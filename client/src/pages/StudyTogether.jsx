import { useState } from "react";
import "../styles/study.css";
import NameBar from "../pages/study/NameBar";
import RoomPicker from "../pages/study/PickRoom";

export default function StudyTogether() {
  const [name, setName] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const handleNameChange = (value) => {
    setName(value);
    if (value.trim()) setShowHint(false);
  };

  const handleJoin = (id) => {
    if (!name.trim()) return setShowHint(true);
    setRoomId(id);
  };

  return (
    <div className="panel">
      <div className="section-label">Choose your study room</div>
      <NameBar name={name} onChange={handleNameChange} showHint={showHint} />
      <RoomPicker onJoin={handleJoin} />
      <div className="study-banner">
        🌱 Tomatoes grow better planted together — and so do you!
      </div>
      {roomId && <div>Đang ở phòng {roomId}</div>}
    </div>
  );
}