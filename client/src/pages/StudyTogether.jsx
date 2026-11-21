import { useState, useEffect } from "react";
import socket from "../socket";

import "../styles/study.css";
import NameBar from "./study/NameBar";
import RoomPicker from "./study/PickRoom";
import Room from "./study/Room";

const puzzlePalsInstallerUrl =
  "https://github.com/tran04012006/PuzzlePalsAssetPack/releases/download/v1.0.0/PuzzlePals-Setup.exe";

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

      <section className="puzzle-pals-card" aria-labelledby="puzzle-pals-title">
        <div className="puzzle-pals-intro">
          <span className="puzzle-pals-icon" aria-hidden="true">🧩</span>
          <div>
            <h2 id="puzzle-pals-title">PuzzlePals</h2>
            <p>Solve puzzles with a friend on two Windows machines on the same LAN.</p>
            <p>RULE: The player who reaches 20 points first wins.</p>
          </div>
        </div>

        <div className="puzzle-pals-actions">
          <a className="puzzle-pals-link puzzle-pals-link--primary" href="puzzlepals://play">
            Mở PuzzlePals
          </a>
          <a className="puzzle-pals-link" href={puzzlePalsInstallerUrl}>
            Tải game cho Windows
          </a>
        </div>

        <p className="puzzle-pals-note">
          Install the game once on each machine. When entering the game, one person selects Host, 
          the other enters the Host's IP address, and then selects Join.
        </p>
      </section>

      <div className="study-banner">
        🌱 Tomatoes grow better planted together — and so do you!
      </div>
    </div>
  );
}
