const calculateFare = (
  distanceKm: number,
  timeMin: number,
  traffic: string,
  weather: string,
  numberOfRiders: number = 1
): number => {
  const baseFare = 30;
  const ratePerKm = 10;
  const ratePerMin = 1;

  let trafficMultiplier = 1;
  let weatherMultiplier = 1;

  if (traffic === "heavy") trafficMultiplier = 1.2;
  if (weather === "rain" || weather === "storm") weatherMultiplier = 1.15;

  const totalFare =
    baseFare +
    (distanceKm * ratePerKm + timeMin * ratePerMin) *
      trafficMultiplier *
      weatherMultiplier;

  const farePerRider = totalFare / numberOfRiders;

  return parseFloat(farePerRider.toFixed(2));
};

export default calculateFare;
