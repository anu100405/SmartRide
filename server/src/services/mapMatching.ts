import { Node } from "./graph";

export function findClosestNode(lat: number, lon: number, nodes: Node[]) {
  let closestNode = nodes[0];
  let minDist = Number.MAX_VALUE;

  for (const node of nodes) {
    const dist = Math.sqrt((lat - node.lat) ** 2 + (lon - node.lon) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closestNode = node;
    }
  }
  return closestNode.id;
}
