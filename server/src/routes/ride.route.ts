import express from "express";
import {
  getShortestPathWithFare,
  handleRideRequest,
} from "../controllers/ride.controller";

const router = express.Router();

router.route("/book-ride").get(getShortestPathWithFare);
router.route("/request-ride").post(handleRideRequest);

export default router;
