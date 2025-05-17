import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getRoute = async (start: [number, number], end: [number, number]) => {
  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  try {
    const response = await axios.post(
      url,
      { coordinates: [start, end] },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const route = response.data;

    if (!route.routes || route.routes.length === 0) {
      console.error(
        "No route found. Response:",
        JSON.stringify(route, null, 2)
      );
      throw new Error("No route could be calculated.");
    }

    const distance = route.routes[0].summary.distance;
    const duration = route.routes[0].summary.duration;

    return { distance, duration, route };
  } catch (error: any) {
    console.error(
      "Error fetching route from OpenRouteService:",
      error.response?.data || error.message
    );
    throw new Error("Route fetching failed");
  }
};

export default getRoute;
