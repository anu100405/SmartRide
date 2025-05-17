// Example node with lat/lon for map matching
export interface Node {
  id: number;
  lat: number;
  lon: number;
}

// Edges with weights (distance in km)
export interface Edge {
  to: number;
  weight: number;
}

// Graph: adjacency list of edges per node
export const graph: Edge[][] = [
  // Node 0 connections
  [
    { to: 1, weight: 2 },
    { to: 2, weight: 5 },
  ],
  // Node 1 connections
  [
    { to: 0, weight: 2 },
    { to: 2, weight: 3 },
    { to: 3, weight: 4 },
  ],
  // Node 2 connections
  [
    { to: 0, weight: 5 },
    { to: 1, weight: 3 },
    { to: 3, weight: 2 },
  ],
  // Node 3 connections
  [
    { to: 1, weight: 4 },
    { to: 2, weight: 2 },
  ],
];

export const nodes: Node[] = [
  { id: 0, lat: 12.9716, lon: 77.5946 },
  { id: 1, lat: 12.972, lon: 77.6 },
  { id: 2, lat: 12.97, lon: 77.605 },
  { id: 3, lat: 12.975, lon: 77.61 },
];
