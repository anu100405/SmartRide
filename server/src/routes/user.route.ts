import express from "express";
import { register, login } from "../controllers/user.controller";

const router = express.Router();

// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

export default router;
