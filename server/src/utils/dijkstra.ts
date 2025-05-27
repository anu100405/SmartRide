import { Edge } from './graphLoader';

export function dijkstra(startId: number, endId: number, edges: Edge[]): number[] {
  const graph = new Map<number, { [neighbor: number]: number }>();

  for (const edge of edges) {
    if (!graph.has(edge.source)) graph.set(edge.source, {});
    if (!graph.has(edge.target)) graph.set(edge.target, {});
    graph.get(edge.source)![edge.target] = edge.weight;
    graph.get(edge.target)![edge.source] = edge.weight;
  }

  const distances = new Map<number, number>();
  const prev = new Map<number, number | null>();
  const visited = new Set<number>();
  const pq: [number, number][] = [];

  graph.forEach((_, node) => {
    distances.set(node, Infinity);
    prev.set(node, null);
  });

  distances.set(startId, 0);
  pq.push([0, startId]);

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // sort by distance
    const [dist, node] = pq.shift()!;

    if (visited.has(node)) continue;
    visited.add(node);

    if (node === endId) break;

    const neighbors = graph.get(node)!;
    for (const neighbor in neighbors) {
      const neighborId = parseInt(neighbor);
      const alt = dist + neighbors[neighborId];

      if (alt < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, alt);
        prev.set(neighborId, node);
        pq.push([alt, neighborId]);
      }
    }
  }

  const path: number[] = [];
  let current = endId;
  while (current !== null) {
    path.unshift(current);
    current = prev.get(current)!;
  }

  return path;
}
