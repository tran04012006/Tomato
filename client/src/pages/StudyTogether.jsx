import { useState, useEffect } from "react";
import socket from "../socket";

import "../styles/study.css";
import NameBar from "./study/NameBar";
import RoomPicker from "./study/PickRoom";
import Room from "./study/Room";

export default function StudyTogether() {
  const [name, setName] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [userId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNameChange = (value) => {
    setName(value);
    if (value.trim()) setShowHint(false);
  };

  const handleJoin = (id) => {
    setRoomId(id);
  };

  if (roomId) {
    return (
      <div className="panel">
        <Room
          roomId={roomId}
          userId={userId}
          name={name.trim()}
          onLeave={() => setRoomId(null)}
        />
      </div>
    );
  }

  return (
    <div className="panel">
      <RoomPicker onJoin={handleJoin} />

      <div className="study-banner">
        🌱 Tomatoes grow better planted together — and so do you!
      </div>
    </div>
  );
}