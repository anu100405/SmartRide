import { Edge } from "./graph";

export function dijkstra(graph: Edge[][], start: number, end: number) {
  const distances = Array(graph.length).fill(Infinity);
  const previous = Array(graph.length).fill(null);
  const visited = new Set<number>();

  distances[start] = 0;

  while (visited.size < graph.length) {
    let currentNode = -1;
    let smallestDist = Infinity;

    for (let i = 0; i < graph.length; i++) {
      if (!visited.has(i) && distances[i] < smallestDist) {
        smallestDist = distances[i];
        currentNode = i;
      }
    }

    if (currentNode === -1) break;
    if (currentNode === end) break;

    visited.add(currentNode);

    for (const edge of graph[currentNode]) {
      if (visited.has(edge.to)) continue;
      const newDist = distances[currentNode] + edge.weight;
      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        previous[edge.to] = currentNode;
      }
    }
  }

  const path = [];
  let curr = end;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { path, distance: distances[end] };
}
