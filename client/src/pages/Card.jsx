import { useState } from "react";
import '../styles/card.css'
import TabBar from "./TabBar";
import Pomodoro from "./PomodoroPage.jsx";
import TodoList from "./TodoPage";
import StudyTogether from "./StudyTogether.jsx";

function Card() {
  const [tab, setTab] = useState("pomodoro");

  return (
    <div className="card">
      <TabBar active={tab} onChange={setTab} />

      {/* Cả 3 trang luôn tồn tại, chỉ ẩn/hiện bằng CSS
          => chuyển tab không bị mất state */}
      <div style={{ display: tab === "pomodoro" ? "block" : "none" }}>
        <Pomodoro />
      </div>

      <div style={{ display: tab === "todo" ? "block" : "none" }}>
        <TodoList />
      </div>

      <div style={{ display: tab === "together" ? "block" : "none" }}>
        <StudyTogether />
      </div>
    </div>
  );
}

export default Card;