import fs from 'fs';
import path from 'path';

export interface Node {
  id: number;
  lat: number;
  lon: number;
}

export interface Edge {
  source: number;
  target: number;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export function loadGraph(): Graph {
  const data = fs.readFileSync(path.join(__dirname, '../data/dehradun_graph.json'), 'utf-8');
  return JSON.parse(data);
}
