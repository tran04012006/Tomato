import { parse } from "cookie";
const handleChatSend = (socket, io, { text } = {}) => {
  const roomId = socket.data.roomId;

  const clean = String(text || "")
    .trim()
    .slice(0, 500);

  if (!clean) return;

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

const handleRoomLeave = (socket) => {
  const roomId = socket.data.roomId;

  if (!roomId) return;

  socket.leave(roomId);
  socket.data.roomId = null;

  console.log(`${socket.id} left room ${roomId}`);
};

const handleRoomJoin = (socket, { roomId } = {}) => {
  console.log("goi handleRoomJoin!!!!!!!!!!");
  const VALID_ROOMS = ["r1", "r2", "r3"];
  if (!VALID_ROOMS.includes(roomId)) {
    socket.emit("room:error", "Invalid room");
    return;
  }

  // Leave previous room, if any
  if (socket.data.roomId) {
    socket.leave(socket.data.roomId);
  }

  // tao mo socket.io room co gia tri bang gia tri cua bien roomId
  socket.join(roomId);

  //
  socket.data.roomId = roomId;

  console.log(`${socket.id} joined room ${roomId}`);

  socket.emit("room:joined", { roomId });
};

export function registerSocket(io) {
  // io.use(async (socket, next) => {
  //   try {
  //     // doc cookie
  //     const cookies = parse(socket.handshake.headers.cookie || "");

  //     // lay ra userId
  //     let userId = verifyToken(cookies[COOKIE_NAME]);

  //     if (!userId) {
  //       userId = "1";
  //     }

  //     // lay user ra
  //     let user = await User.findById(userId);

  //     if (!user) {
  //       user = {
  //         _id: userId,
  //         name: "Guest",
  //       };
  //     }

  //     socket.data.user = {
  //       id: String(user._id),
  //       name: user.name,
  //     };

  //     next();
  //   } catch (error) {
  //     console.error("Socket authentication error:", error);
  //     next(new Error("unauthorized"));
  //   }
  // });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Temporary guest user
    socket.data.user = {
      id: socket.id,
      name: "Guest",
    };

    socket.on("chat:send", (data) => {
      handleChatSend(socket, io, data);
    });

    socket.on("room:join", (data) => {
      handleRoomJoin(socket, data);
    });

    socket.on("room:leave", () => {
      handleRoomLeave(socket);
    });
  });
}
