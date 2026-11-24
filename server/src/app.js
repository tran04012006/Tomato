import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/index.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://tomato-tawny-eight.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tomato backend is running",
  });
});

app.use("/", indexRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;