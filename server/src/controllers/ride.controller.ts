import { Request, Response } from "express";
import { findNearestNode } from "../utils/mapMatching";
import { dijkstra } from "../utils/dijkstra";
import { loadGraph } from "../utils/graphLoader";
import { calculateTotalDistance } from "../utils/calculateDistance";
import calculateFare from "../services/fareCalculator";
import { estimateTraffic, getWeatherCondition } from "../services/externalAPI";

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
