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
// Kết nối MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/UserInformation")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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
