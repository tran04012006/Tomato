import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./src/app.js";
import { registerSocket } from "./src/socket/index.js";
const {
  PORT = 5000,
  MONGO_URI,
  JWT_SECRET,
  CLIENT_ORIGIN = "http://localhost:5173",
} = process.env;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
});

if (!MONGO_URI || !JWT_SECRET) {
  console.error(
    "Thiếu MONGO_URI hoặc JWT_SECRET. Hãy copy .env.example thành .env và điền giá trị.",
  );
  process.exit(1);
}

//khi co ai do di vao trang web thi no se co su kien connection, thi se chay
//vao code nay

registerSocket(io);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
