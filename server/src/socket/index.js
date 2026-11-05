import { parse } from "cookie";
const sendRoomCount = (io, roomId) => {
  const count = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
  console.log("cap nhat lai count, count = " + count);

  io.emit("room:count", { roomId, count });
};

const handleChatSend = (socket, io, { text } = {}) => {
  const roomId = socket.data.roomId;

  const clean = String(text || "")
    .trim()
    .slice(0, 500);

  if (!roomId || !clean) return;
  const msg = {
    id: `${socket.id}-${Date.now()}`,
    userId: socket.data.user.id,
    name: socket.data.user.name,
    text: clean,
    createdAt: new Date(),
  };

  console.log("Message:", msg);

  // Send to all connected clients
  io.to(roomId).emit("chat:message", msg);
};

const handleRoomLeave = (socket, io) => {
  const roomId = socket.data.roomId;

  if (!roomId) return;

  socket.leave(roomId);
  socket.data.roomId = null;
  console.log("user ra khoi rooms");
  sendRoomCount(io, roomId);

  console.log(`${socket.id} left room ${roomId}`);
};

const handleRoomJoin = (socket, io, { roomId } = {}) => {
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
  console.log("User di vao phong, cap nhat lai count");
  sendRoomCount(io, roomId);

  //
  socket.data.roomId = roomId;

  console.log(`${socket.id} joined room ${roomId}`);

  socket.emit("room:joined", { roomId });
};

export function registerSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Temporary guest user
    socket.data.user = {
      id: socket.id,
      name: "Guest",
    };

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

      console.log("Client disconnected:", socket.id);
    });
  });
}
