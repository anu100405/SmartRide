# 🚖 SmartRide Next-Gen

**SmartRide** is an intelligent cab-sharing simulation built using C++, designed to demonstrate advanced ride-matching, dynamic fare calculation, and personalized user preferences based on real-world scenarios like weather, traffic, and urban road mapping.

---

## 📌 Features

- 🗺️ **City Graph Modeling** – Predefined map of Dehradun using real coordinates.
- 🧭 **Dijkstra's Algorithm** – Finds the shortest path between source and destination.
- 🧠 **Dynamic Fare Calculation** – Adjusts fare based on:
  - **weather** (simulated)
  - **Traffic conditions** (simulated)
- 🤝 **Ride Matching (Multi-hop)** – Matches users sharing route segments and splits fare intelligently.
- 📐 **Distance Calculation using Coordinates** – Uses **Haversine formula** to compute straight-line distances between locations.
- 🧾 **Modular Code Structure** – Clean separation into multiple C++ files:
  <!-- - `graph.cpp` / `graph.h` – Graph and Dijkstra logic -->
  <!-- - `fare.cpp` / `fare.h` – Weather & traffic-based fare system -->
  - `location.cpp` / `location.h` – City location coordinates
  <!-- - `ride.cpp` / `ride.h` – Ride request handling -->
  - `main.cpp` – User interaction and simulation

---

## 🧱 Folder Structure
  - Include
    - location.h
    - main.h
  - Programs
    - location.cpp
  - .gitignore
  - main.cpp

---

## Sample Locations (Dehradun)

| Place            | Latitude   | Longitude  |
|------------------|------------|------------|
| ISBT             | 30.2900    | 77.9900    |
| Clock Tower      | 30.3256    | 78.0437    |
| Railway Station  | 30.3150    | 78.0335    |
| Graphic Era      | 30.2700    | 78.0800    |
| Pacific Mall     | 30.3350    | 78.0650    |

---

## Run the program

```bash
g++ main.cpp
./a.out            // For Linux
./a.exe            // For windows
```

---

## 👨‍💻 Authors
  - Anushka Sharma **(Team Lead)**
  - Ayush Saini
  - Vanshika Chaudhary
  - Aman Kumar

---

## 💡Future Enhancements
  - Integration with real-time APIs (Google Maps, OpenWeather)
  - Fare splitting between users for shared segments
  - Web dashboard for booking and history
  - Gender-aware ride sharing preferences