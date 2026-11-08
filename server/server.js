import "dotenv/config";
import express from "express";
import { createServer } from "http";

import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./src/app.js";
import { registerSocket } from "./src/socket/index.js";
import indexRoute from "./src/routes/index.route.js";
import auth from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createJWT, verifyToken } from "./src/middleware/JWTaction.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";
// import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

dotenv.config();
const port = process.env.PORT;
const {
  PORT = 5000,
  MONGO_URI,
  JWT_SECRET,
  CLIENT_ORIGIN = "http://localhost:5173",
} = process.env;
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

registerSocket(io);
// Swagger Documentation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// //test jwt
// // createJWT("Tran");
// const decodedData = verifyToken(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJUcmFuIiwiaWF0IjoxNzkzMjA0NjQ1LCJleHAiOjE3OTM4MDk0NDV9.CUSK2hy-5EPofmCSS5Xwb2XriiUZU3nm-kPriOIYCqg",
// );
// console.log("decodedData: ", decodedData);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tomato backend is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
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
