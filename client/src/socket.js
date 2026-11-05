import { io } from "socket.io-client";

const socket = io({
  path: "/socket.io",
  autoConnect: false,
  withCredentials: true,
});

export default socket;
