const calculateFare = (
  distanceKm: number,
  timeMin: number,
  traffic: string,
  weather: string
): number => {
  const baseFare = 30;
  const ratePerKm = 10;
  const ratePerMin = 1;

  let trafficMultiplier = 1;
  let weatherMultiplier = 1;

  if (traffic === "heavy") trafficMultiplier = 1.2;
  if (weather === "rain" || weather === "storm") weatherMultiplier = 1.15;

  const fare =
    baseFare +
    (distanceKm * ratePerKm + timeMin * ratePerMin) *
      trafficMultiplier *
      weatherMultiplier;

  return parseFloat(fare.toFixed(2));
};

export default calculateFare;
