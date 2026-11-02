import express from "express";
import mongoose from "mongoose";
import indexRoute from "./src/routes/index.route.js";
import auth from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createJWT, verifyToken } from "./src/middleware/JWTaction.js";
import { swaggerUi, swaggerSpec } from "./src/config/swagger.js";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
// Kết nối MongoDB
console.log("MONGO_URI loaded:", Boolean(process.env.MONGO_URI));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.use(express.json());
app.use(cookieParser());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// //test jwt
// // createJWT("Tran");
// const decodedData = verifyToken(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJUcmFuIiwiaWF0IjoxNzkzMjA0NjQ1LCJleHAiOjE3OTM4MDk0NDV9.CUSK2hy-5EPofmCSS5Xwb2XriiUZU3nm-kPriOIYCqg",
// );
// console.log("decodedData: ", decodedData);

app.use("/", indexRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
