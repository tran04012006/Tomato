const handleChatSend = (socket, io, { text } = {}) => {
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
  io.emit("chat:message", msg);
};

export function registerSocket(io) {
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
    io.emit("chat:message", msg);
  });
}
