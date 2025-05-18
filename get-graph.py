import osmnx as ox
import networkx as nx
import json

# Get driveable road network of Dehradun
G = ox.graph_from_place("Dehradun, India", network_type="drive")

# Simplify graph
G = ox.utils_graph.get_undirected(G)

# Convert graph to a dictionary with lat/lon and edges
data = {
    "nodes": [
        {
            "id": int(node),
            "lat": float(data["y"]),
            "lon": float(data["x"])
        }
        for node, data in G.nodes(data=True)
    ],
    "edges": [
        {
            "source": int(u),
            "target": int(v),
            "weight": float(data["length"])
        }
        for u, v, data in G.edges(data=True)
        if "length" in data
    ]
}

# Save as JSON
with open("dehradun_graph.json", "w") as f:
    json.dump(data, f, indent=2)