import http from "http";
import app from "./index";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./db/connectDB";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes/controllers via app.get("io")
app.set("io", io);

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join a room for a specific ride
  socket.on("joinRide", (rideId: string) => {
    console.log(`Socket ${socket.id} joining ride room: ${rideId}`);
    socket.join(rideId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server and connect to DB
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
