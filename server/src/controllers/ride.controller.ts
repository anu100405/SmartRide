import { Request, Response } from "express";
import RideRequest from "../models/rideRequest.model";
import calculateFare from "../services/fareCalculator";
import { graph, nodes } from "../services/graph";
import { dijkstra } from "../services/dijkstra";
import { findClosestNode } from "../services/mapMatching";
import { getWeatherCondition, getTrafficLevel } from "../services/externalAPI";

export const handleRideRequest = async (req: Request, res: Response) => {
  try {
    const { userId, from, to } = req.body;

    // Map pickup/drop to closest nodes
    const startNode = findClosestNode(from.lat, from.lon, nodes);
    const endNode = findClosestNode(to.lat, to.lon, nodes);

    // Get shortest path and distance using Dijkstra
    const { distance } = dijkstra(graph, startNode, endNode);

    // Approximate duration: assume avg speed 40 km/h (0.66 km/min)
    const durationMin = distance / 0.66;

    // Get traffic and weather for fare multiplier
    const weather = await getWeatherCondition(from.lat, from.lon);
    const traffic = await getTrafficLevel(from.lat, from.lon);

    const fare = calculateFare(distance, durationMin, traffic, weather);

    const ride = await RideRequest.create({
      userId,
      from,
      to,
      estimatedDistance: distance,
      estimatedTime: durationMin,
      trafficLevel: traffic,
      weatherCondition: weather,
      fare,
      routeNodes: [], // Optional: you can add path nodes if you want
    });

    res.status(200).json({ rideId: ride._id, fare, eta: durationMin });
  } catch (err) {
    res.status(500).json({ error: "Ride request failed", details: err });
  }
};
