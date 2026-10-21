import { useState } from "react";
import '../styles/card.css'
import TabBar from "./TabBar";
import Pomodoro from "./PomodoroPage.jsx";
import TodoList from "./TodoPage";
import Study from "./RoomsPage.jsx";

function Card() {
  const [tab, setTab] = useState("pomodoro");

  return (
    <div className="card">
      <TabBar active={tab} onChange={setTab} />
      {tab === "pomodoro" && <Pomodoro />}
      {tab === "todo" && <TodoList />}
      {tab === "together" && <Study />}
    </div>
  );
}

export default Card;