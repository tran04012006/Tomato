
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tomato API is running",
  });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

export default app;
