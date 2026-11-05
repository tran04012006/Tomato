import { useState, useEffect } from "react";
import { getUsers, getMessages } from "../api/studyApi";
import socket from "../../socket";

export default function useRoom(roomId, user) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("Client received:", message);

      setMessages((prev) => [...prev, message]);
    };

    const handleSocketId = (id) => {
      console.log("socket ID in server:", id);
    };
    //lang nghe su kien cua server
    //server gui ten gi o client se lang nghe dung cai ten do
    //server gui len param gi thi ham handleSocketId se tu dong nhan param do
    socket.on("server_send_socket_id: ", handleSocketId);
    socket.on("chat:message", handleMessage);
    socket.connect();
    return () => {
      socket.off("server_send_socket_id: ", handleSocketId);
      socket.off("chat:message", handleMessage);

      socket.disconnect();
    };
  }, []);

  const others = getUsers().filter((u) => u.roomId === roomId);

  // me là người dùng hiện tại -> thêm vào cuối danh sách
  // users = [
  //   ...others,
  //   {
  //     id: user.id,
  //     name: user.name,
  //     roomId,
  //     status: "focus",
  //     focusMinutes: 0,
  //     color: "#d4453a",
  //   },
  // ];

  const sendMessage = (text) => {
    const content = text.trim();

    if (!content) return;
    console.log("client gui chat message: " + text);

    socket.emit("chat:send", {
      text: content,
    });
  };

  return { users, messages, sendMessage };
}
