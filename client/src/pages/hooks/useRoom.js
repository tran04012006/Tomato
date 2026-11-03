import { useState } from "react";
import { getUsers, getMessages } from "../api/studyApi";

export default function useRoom(roomId, user) {
  const [messages, setMessages] = useState(() =>
    getMessages().filter((m) => m.roomId === roomId)
  );

  const others = getUsers().filter((u) => u.roomId === roomId);

  // me là người dùng hiện tại -> thêm vào cuối danh sách
  const users = [
    ...others,
    {
      id: user.id,
      name: user.name,
      roomId,
      status: "focus",
      focusMinutes: 0,
      color: "#d4453a",
    },
  ];

  const sendMessage = (text) => {
    const content = text.trim();
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        roomId,
        userId: user.id,
        text: content,
        ts: Date.now(),
      },
    ]);
  };

  return { users, messages, sendMessage };
}