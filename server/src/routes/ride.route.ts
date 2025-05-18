import express from "express";
import { getShortestPathWithFare } from "../controllers/ride.controller";

const router = express.Router();

router.route("/shortest-path").get(getShortestPathWithFare);

export default router;
