import { useState, useEffect } from "react";
import { getRooms } from "../api/studyApi";
import socket from "../../socket";

export default function useRooms() {
  const [rooms, setRooms] = useState(() =>
    getRooms().map((room) => ({
      ...room,
      count: 0,
    })),
  );

  useEffect(() => {
    const handleRoomCount = (data) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === data.roomId ? { ...room, count: data.count } : room,
        ),
      );
    };

    const handleRoomsCounts = (counts) => {
      setRooms((prev) =>
        prev.map((room) => ({
          ...room,
          count: counts[room.id] ?? 0,
        })),
      );
    };

    const handleConnect = () => {
      socket.emit("rooms:counts:get");
    };

    socket.on("connect", handleConnect);
    socket.on("room:count", handleRoomCount);
    socket.on("rooms:counts", handleRoomsCounts);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("room:count", handleRoomCount);
      socket.off("rooms:counts", handleRoomsCounts);

      socket.disconnect();
    };
  }, []);

  return rooms;
}
