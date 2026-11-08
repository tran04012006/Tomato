import { useState } from "react";
import "../styles/pomodoro.css";
import ModeSwitch from "./pomodoro/ModeSwitch";
export default function Pomodoro() {

  //set mặc định để hiện giao diện
  const [mode, setMode] = useState("focus");
  return (
    <div className="panel">
      <ModeSwitch mode={mode} onChange={(key) => setMode(key)} />
    </div>
  );
}
