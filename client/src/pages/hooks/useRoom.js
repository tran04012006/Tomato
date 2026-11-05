import { useState, useEffect } from "react";
import { getUsers, getMessages } from "../api/studyApi";
import socket from "../../socket";

export default function useRoom(roomId, user) {
  const [messages, setMessages] = useState([]);
  //danh sach users
  const [users, setUsers] = useState([]);
  //so luong user trong moi room
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    //---------------handlers
    //message
    const handleMessage = (message) => {
      console.log("Client received:", message);

      setMessages((prev) => [...prev, message]);
    };

    const handleSocketId = (id) => {
      console.log("socket ID in server:", id);
    };
    //connection
    const handleConnect = () => {
      // console.log("chay connection ");
      // console.log("Connected:", socket.id);

      // Tell server which room to join
      socket.emit("room:join", { roomId });
    };

    //room
    const handleRoomJoined = (data) => {
      console.log("Successfully joined:", data.roomId);
    };

    const handleRoomError = (error) => {
      console.error("Room error:", error);
    };

    const handleRoomCount = ({ roomId: updatedRoomId, count }) => {
      if (updatedRoomId === roomId) {
        setUserCount(count);
      }
    };

    //lang nghe su kien cua server
    //server gui ten gi o client se lang nghe dung cai ten do
    //server gui len param gi thi ham handleSocketId se tu dong nhan param do
    //--------------------
    //listeners
    socket.on("connect", handleConnect);
    socket.on("server_send_socket_id: ", handleSocketId);
    socket.on("chat:message", handleMessage);
    //neu tham gia phong thanh cong
    socket.on("room:joined", handleRoomJoined);
    //neu tham gia phong that bai
    socket.on("room:error", handleRoomError);
    //dem so user trong phong
    socket.on("room:count", handleRoomCount);

    //-------------start the connection
    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }
    //---------------return
    return () => {
      socket.emit("room:leave");

      socket.off("server_send_socket_id: ", handleSocketId);
      socket.off("chat:message", handleMessage);
      socket.off("connect", handleConnect);
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:error", handleRoomError);
      socket.off("room:count", handleRoomCount);

      socket.disconnect();
    };
  }, [roomId]);


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

  return {
    users,
    userCount,
    messages,
    sendMessage,
  };
}
