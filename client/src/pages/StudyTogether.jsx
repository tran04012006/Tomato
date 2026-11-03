import { useState } from "react";
import "../styles/study.css";
import NameBar from "./study/NameBar";

export default function StudyTogether() {
  const [name, setName] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleNameChange = (value) => {
    setName(value);
    if (value.trim()) setShowHint(false);
  };

  return (
    <div className="study-together">
      <NameBar name={name} onChange={handleNameChange} showHint={showHint} />

    </div>
  );
}