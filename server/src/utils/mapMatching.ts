import { Graph, Node } from './graphLoader';

export function findNearestNode(nodes: Node[], lat: number, lon: number): number {
  let nearestNodeId = -1;
  let minDistance = Infinity;

  for (const node of nodes) {
    const dist = Math.hypot(lat - node.lat, lon - node.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestNodeId = node.id;
    }
  }

  return nearestNodeId;
}
