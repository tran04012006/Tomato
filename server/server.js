
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import app from "./src/app.js";
import { registerSocket } from "./src/socket/index.js";
import indexRoute from "./src/routes/index.route.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

const {
  PORT = 5000,
  MONGO_URI,
  JWT_SECRET,
  CLIENT_ORIGIN = "http://localhost:5173",
} = process.env;

// Create one HTTP server for Express and Socket.IO
const server = http.createServer(app);

// Attach Socket.IO to the same HTTP server
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

// Register Socket.IO events
registerSocket(io);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tomato backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// API routes
app.use("/", indexRoute);

// Start backend once
const startServer = async () => {
  try {
    if (!MONGO_URI || !JWT_SECRET) {
      throw new Error("MONGO_URI or JWT_SECRET is missing");
    }

    // Connect to MongoDB once
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    // Start HTTP server once
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP server error:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
