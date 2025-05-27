import { Request, Response } from "express";
import { findNearestNode } from "../utils/mapMatching";
import { dijkstra } from "../utils/dijkstra";
import { loadGraph } from "../utils/graphLoader";
import { calculateTotalDistance } from "../utils/calculateDistance";
import calculateFare from "../services/fareCalculator";
import { estimateTraffic, getWeatherCondition } from "../services/externalAPI";
import { RideRequest } from "../models/rideRequest.model";
import { User } from "../models/user.model";

export const getShortestPathWithFare = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const graph = loadGraph();
    const { fromLat, fromLon, toLat, toLon } = req.query;

    if (!fromLat || !fromLon || !toLat || !toLon) {
      res.status(400).json({ error: "Missing coordinates" });
      return;
    }

    const startId = findNearestNode(graph.nodes, +fromLat, +fromLon);
    const endId = findNearestNode(graph.nodes, +toLat, +toLon);
    const path = dijkstra(startId, endId, graph.edges);

    if (!path || path.length === 0) {
      res.status(404).json({ error: "No path found between given locations" });
      return;
    }

    const pathCoords = path.map((id) => graph.nodes.find((n) => n.id === id));
    const distanceKm = calculateTotalDistance(pathCoords as any[]);

    const averageSpeedKmph = 30;
    const timeMin = (distanceKm / averageSpeedKmph) * 60;

    const traffic = estimateTraffic(); // make sure this returns something like 'heavy', 'normal'
    const weather = await getWeatherCondition(+fromLat, +fromLon);

    const fare = calculateFare(
      distanceKm,
      timeMin,
      traffic as string,
      weather as string
    );

    res.json({
      distanceKm,
      timeMin: parseFloat(timeMin.toFixed(2)),
      fare,
      traffic,
      weather,
      path: pathCoords,
    });
  } catch (err) {
    console.error("Error in getShortestPathWithFare:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleRideRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, from, to } = req.body;

    const graph = loadGraph();
    const startId = findNearestNode(graph.nodes, from.lat, from.lon);
    const endId = findNearestNode(graph.nodes, to.lat, to.lon);
    const path = dijkstra(startId, endId, graph.edges);

    if (!path || path.length === 0) {
      return res
        .status(404)
        .json({ error: "No path found between given locations" });
    }

    const pathCoords = path.map((id) => graph.nodes.find((n) => n.id === id));
    const distanceKm = calculateTotalDistance(pathCoords as any[]);
    const averageSpeedKmph = 30;
    const durationMin = (distanceKm / averageSpeedKmph) * 60;
    const traffic = estimateTraffic();
    const weather = await getWeatherCondition(from.lat, from.lon);
    const io = req.app.get("io");

    // === Shared ride logic without location check ===
    let existingRide = await RideRequest.findOne({
      shared: true,
      $expr: { $lt: [{ $size: "$coRiders" }, 3] },
    });

    if (existingRide) {
      if (
        existingRide.from?.lat == null ||
        existingRide.from?.lon == null ||
        existingRide.to?.lat == null ||
        existingRide.to?.lon == null
      ) {
        return res.status(500).json({
          error: "Existing ride has invalid location data",
        });
      }

      if (!existingRide.coRiders.includes(userId)) {
        existingRide.coRiders.push(userId);
      }

      const newCombinedStartId = findNearestNode(
        graph.nodes,
        Math.min(existingRide.from.lat, from.lat),
        Math.min(existingRide.from.lon, from.lon)
      );
      const newCombinedEndId = findNearestNode(
        graph.nodes,
        Math.max(existingRide.to.lat, to.lat),
        Math.max(existingRide.to.lon, to.lon)
      );

      const newPath = dijkstra(
        newCombinedStartId,
        newCombinedEndId,
        graph.edges
      );
      const newPathCoords = newPath.map((id) =>
        graph.nodes.find((n) => n.id === id)
      );
      const newDistanceKm = calculateTotalDistance(newPathCoords as any[]);
      const newDurationMin = (newDistanceKm / averageSpeedKmph) * 60;

      existingRide.estimatedDistance = newDistanceKm;
      existingRide.estimatedTime = newDurationMin;
      existingRide.fare = calculateFare(
        newDistanceKm,
        newDurationMin,
        traffic,
        weather,
        existingRide.coRiders.length
      );

      await existingRide.save();

      const riderUsers = await User.find({
        _id: { $in: existingRide.coRiders },
      }).select("username");

      const usernames = riderUsers.map((u) => u.username);
      io.to(existingRide._id.toString()).emit("rideUpdated", {
        rideId: existingRide._id.toString(),
        fare: existingRide.fare,
        eta: parseFloat(existingRide.estimatedTime!.toFixed(2)),
        riders: usernames.length,
        usernames,
        message: `${usernames[usernames.length - 1]} joined the ride!`,
        newPickup: from,
        newDestination: to,
        path: newPathCoords,
      });

      return res.status(200).json({
        rideId: existingRide._id,
        fare: existingRide.fare,
        eta: parseFloat(existingRide.estimatedTime!.toFixed(2)),
        path: newPathCoords,
        shared: true,
      });
    }

    // === Create a new ride ===
    const newRide = await RideRequest.create({
      userId,
      from,
      to,
      estimatedDistance: distanceKm,
      estimatedTime: durationMin,
      trafficLevel: traffic,
      weatherCondition: weather,
      fare: calculateFare(distanceKm, durationMin, traffic, weather, 1),
      shared: true,
      coRiders: [userId],
    });

    return res.status(200).json({
      rideId: newRide._id,
      fare: newRide.fare,
      eta: parseFloat(durationMin.toFixed(2)),
      path: pathCoords,
      shared: false,
    });
  } catch (err) {
    console.error("handleRideRequest error:", err);
    return res.status(500).json({
      error: "Ride request failed",
      details: (err as Error).message,
    });
  }
};
