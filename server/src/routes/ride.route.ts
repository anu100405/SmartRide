import express from "express";
import { handleRideRequest } from "../controllers/ride.controller";

const router = express.Router();

router.route("/request").post(handleRideRequest);

export default router;;
