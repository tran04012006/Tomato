import { io } from 'socket.io-client';

// Kết nối thủ công (autoConnect: false) — RoomPage sẽ connect khi vào phòng.
const socket = io({ withCredentials: true, autoConnect: false });

export default socket;
