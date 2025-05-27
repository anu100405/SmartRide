import express from "express";
import morgan from "morgan";
import cors from "cors";
import ridesRoute from "./routes/ride.route";
import userRoute from "./routes/user.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/rides", ridesRoute);
app.use("/user", userRoute);

export default app;
