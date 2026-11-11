

import { io } from "socket.io-client";
 
const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
 
// autoConnect: false -> RoomPage tự gọi socket.connect() khi vào phòng.
// auth là hàm nên mỗi lần (re)connect sẽ đọc token mới nhất.
const socket = io(SERVER_URL, {
  autoConnect: false,
  auth: (cb) => {
    cb({ token: localStorage.getItem("token") });
  },
});
 
export default socket;