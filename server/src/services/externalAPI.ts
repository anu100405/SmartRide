import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const weatherApiKey = process.env.OPENWEATHER_API_KEY;

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

export const estimateTraffic = (): "light" | "moderate" | "heavy" => {
  const hour = new Date().getHours();
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) return "heavy"; // peak hours
  if (hour >= 11 && hour <= 16) return "moderate";
  return "light";
};
