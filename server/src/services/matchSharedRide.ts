import { RideRequest } from "../models/rideRequest.model";

const findSharedRideMatch = async (from: any, to: any) => {
  // Find existing rides that are not full and have similar route & time
  const potentialRides = await RideRequest.find({
    shared: true,
    "from.lat": { $gte: from.lat - 0.01, $lte: from.lat + 0.01 },
    "from.lon": { $gte: from.lon - 0.01, $lte: from.lon + 0.01 },
    status: "waiting", // or similar
  });

  return potentialRides;
};
