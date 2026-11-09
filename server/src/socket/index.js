import { parse } from "cookie";
import Message from "../models/Message.js";
import { verifyToken } from "../middleware/JWTaction.js";
import UserModel from "../models/UserModel.js";
const sendRoomCount = (io, roomId) => {
  const count = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
  // console.log("cap nhat lai count, count = " + count);

  io.emit("room:count", { roomId, count });
};

const getRoomHistory = async (roomId) => {
  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1, _id: -1 })
    .limit(50)
    .lean();

  return messages.reverse();
};

const handleChatSend = async (socket, io, { text } = {}) => {
  const roomId = socket.data.roomId;
  const user = socket.data.user;

  const cleanText = String(text || "")
    .trim()
    .slice(0, 500);

  if (!roomId || !user || !cleanText) return;

  try {
    const savedMessage = await Message.create({
      roomId,
      userId: user.id,
      name: user.name,
      text: cleanText,
    });

    // console.log("savedMessage: ", savedMessage);
    //store roi moi gui message
    io.to(roomId).emit("chat:message", {
      _id: String(savedMessage._id),
      roomId: savedMessage.roomId,
      userId: savedMessage.userId,
      name: savedMessage.name,
      text: savedMessage.text,
      createdAt: savedMessage.createdAt,
    });
  } catch (error) {
    console.error("Failed to save:", error);

    socket.emit("chat:error", "Could not save message");
  }
};

const handleRoomLeave = (socket, io) => {
  const roomId = socket.data.roomId;

  if (!roomId) return;

  socket.leave(roomId);
  socket.data.roomId = null;
  // console.log("user ra khoi rooms");
  sendRoomCount(io, roomId);

  console.log(`${socket.id} left room ${roomId}`);
};

const handleRoomJoin = async (socket, io, { roomId } = {}) => {
  const VALID_ROOMS = ["r1", "r2", "r3"];
  if (!VALID_ROOMS.includes(roomId)) {
    socket.emit("room:error", "Invalid room");
    return;
  }

  // Leave previous room, if any
  if (socket.data.roomId) {
    handleRoomLeave(socket, io);
  }

  // tao mo socket.io room co gia tri bang gia tri cua bien roomId
  socket.join(roomId);
  sendRoomCount(io, roomId);

  //
  socket.data.roomId = roomId;

  console.log(`${socket.id} joined room ${roomId}`);

  socket.emit("room:joined", { roomId });

  try {
    const history = await getRoomHistory(roomId);
    console.log("History count:", history.length);
    console.log("History: ", history);

    // The user may have left while MongoDB was loading
    if (socket.data.roomId !== roomId) return;

    // Send chat history only to the user who just joined
    socket.emit("room:history", {
      roomId,
      messages: history,
    });
  } catch (error) {
    console.error("Failed to load chat history:", error);
    socket.emit("chat:error", "Could not load chat history");
  }
};

export function registerSocket(io) {
  console.log("go to registerSocket");
  io.use(async (socket, next) => {
    try {
      console.log("go to try");
      // 1. Read cookies sent during Socket.IO handshake
      const cookieHeader = socket.handshake.headers.cookie || "";
      const cookies = parse(cookieHeader);
      console.log("cookies: ", cookies);
      const token = cookies.tokenUser;

      console.log("token: ", token);

      if (!token) {
        return next(new Error("Not authenticated"));
      }

      // 2. Verify the JWT
      const decoded = verifyToken(token);

      if (!decoded?.email) {
        return next(new Error("Invalid or expired token"));
      }

      // 3. Find the authenticated user in MongoDB
      const user = await UserModel.findOne({
        email: decoded.email,
        delete: false,
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      // 4. Store verified identity in the Socket.IO session
      socket.data.user = {
        id: String(user._id),
        name: user.username,
      };

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });
  io.on("connection", (socket) => {
    // console.log("Client connected:", socket.id);
    // Handle chat
    socket.on("chat:send", (data) => {
      handleChatSend(socket, io, data);
    });

    // Handle joining room
    socket.on("room:join", (data) => {
      handleRoomJoin(socket, io, data);
    });

    // Handle leaving room
    socket.on("room:leave", () => {
      handleRoomLeave(socket, io);
    });

    socket.on("rooms:counts:get", () => {
      const counts = {};

      for (const roomId of ["r1", "r2", "r3"]) {
        counts[roomId] = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
      }

      socket.emit("rooms:counts", counts);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;

      if (roomId) {
        socket.data.roomId = null;

        // Socket.IO already removed the connection from its rooms
        sendRoomCount(io, roomId);
      }

      // console.log("Client disconnected:", socket.id);
    });
  });
}
