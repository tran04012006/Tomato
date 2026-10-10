import express from "express";
import mongoose from "mongoose";
import indexRoute from "./src/routes/index.route.js";
import register from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";

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
  }),
);

app.use(express.json());

app.use("/", indexRoute);
app.use("/Register", register);

// Khởi động server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
