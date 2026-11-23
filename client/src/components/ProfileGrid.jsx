import "../styles/ProfileGrid.css";
import { useState, useEffect } from "react";
import { getStats } from "../pages/api/pomodoro";


const ProfileGrid = () => {
  const [pomo, setPomo] = useState({ focusSessions: 0, focusMinutes: 0 });

  useEffect(() => {
    getStats()
      .then((res) => setPomo(res.data.data))
      .catch((err) => console.error("Get pomodoro stats failed:", err));
  }, []);

  const stats = [
    {
      id: 1,
      icon: "🍅",
      value: pomo.focusSessions,
      label: "Focus sessions",
    },
    {
      id: 2,
      icon: "⏱️",
      value: pomo.focusMinutes,
      label: "Focus minutes",
    },
    {
      id: 3,
      icon: "✅",
      value: 8,
      label: "Tasks completed",
    },
  ];
  return (
    <div id="profile_grid">
      {stats.map((stat) => (
        <div id="profile_stat_card" key={stat.id}>
          <div id="profile_stat_icon">{stat.icon}</div>

          <strong>{stat.value}</strong>

          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileGrid;

