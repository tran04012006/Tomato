import express from "express";
import mongoose from "mongoose";
import indexRoute from "./src/routes/index.route.js";
import auth from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createJWT, verifyToken } from "./src/middleware/JWTaction.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";
// import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

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

// //test jwt
// // createJWT("Tran");
// const decodedData = verifyToken(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJUcmFuIiwiaWF0IjoxNzkzMjA0NjQ1LCJleHAiOjE3OTM4MDk0NDV9.CUSK2hy-5EPofmCSS5Xwb2XriiUZU3nm-kPriOIYCqg",
// );
// console.log("decodedData: ", decodedData);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tomato backend is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
app.use("/", indexRoute);

// Khởi động server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
