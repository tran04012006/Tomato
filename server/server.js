import express from "express";
import mongoose from "mongoose";
import indexRoute from "./src/routes/index.route.js";
import auth from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


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

app.use("/", indexRoute);

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
