import express from "express";
import { getShortestPathWithFare } from "../controllers/ride.controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/shortest-path").get(isAuthenticated, getShortestPathWithFare);

export default router;
