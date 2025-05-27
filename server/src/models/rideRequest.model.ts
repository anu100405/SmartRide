import mongoose from "mongoose";

const RideRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  from: {
    lat: Number,
    lon: Number,
    address: String,
  },
  to: {
    lat: Number,
    lon: Number,
    address: String,
  },
  estimatedDistance: Number,
  estimatedTime: Number,
  trafficLevel: String,
  weatherCondition: String,
  fare: Number,
  createdAt: { type: Date, default: Date.now },
  shared: { type: Boolean, default: false },
  coRiders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const RideRequest = mongoose.model("RideRequest", RideRequestSchema);
