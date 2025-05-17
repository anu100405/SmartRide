import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const weatherApiKey = process.env.OPENWEATHER_API_KEY;
const ORS_API_KEY = process.env.ORS_API_KEY;

export async function getDistanceAndTime(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number }
) {
  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  try {
    const response = await axios.post(
      url,
      {
        coordinates: [
          [from.lon, from.lat], // Note: [lon, lat] format
          [to.lon, to.lat],
        ],
      },
      {
        headers: {
          Authorization: ORS_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const distanceKm = data.routes[0].summary.distance / 1000; // in km
    const durationMin = data.routes[0].summary.duration / 60; // in min

    return { distanceKm, durationMin };
  } catch (err: any) {
    console.error("ORS Error:", err.response?.data || err.message);
    return { distanceKm: 0, durationMin: 0 }; // fallback
  }
}

export async function getWeatherCondition(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

  try {
    const res = await axios.get(url);
    const condition = res.data.weather[0].main.toLowerCase(); // "rain", "clear", "clouds"
    return condition;
  } catch (err) {
    console.error("Weather API Error:", err);
    return "clear"; // default fallback
  }
}

export async function getTrafficLevel(lat: number, lon: number) {
  // Simulate traffic by time of day or random
  return "moderate"; // or "heavy"
}

export const estimateTraffic = (): "light" | "moderate" | "heavy" => {
  const hour = new Date().getHours();
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) return "heavy"; // peak hours
  if (hour >= 11 && hour <= 16) return "moderate";
  return "light";
};
