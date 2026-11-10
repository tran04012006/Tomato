import { useState, useEffect } from "react";
import "../styles/pomodoro.css";
import ModeSwitch from "./pomodoro/ModeSwitch";
import TimerRing from "./pomodoro/TimerRing";
import Controls from "./pomodoro/Controls";
import PomoInfo from "./pomodoro/PomoInfo";
import { DURATIONS, MODE_LABELS, MODE_COLORS } from "./pomodoro/constants";

export default function Pomodoro() {
  const [mode, setMode] = useState("focus"); // mode hiện tại
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus); // số giây còn lại
  const [isRunning, setIsRunning] = useState(false); // đang chạy hay đang dừng
  const [sessions, setSessions] = useState(0); // số phiên focus đã xong

  // Khi isRunning = true thì mỗi giây trừ 1 giây
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Dừng setInterval khi bấm pause hoặc rời trang
    return () => clearInterval(timer);
  }, [isRunning]);

  // Khi hết giờ thì dừng lại, nếu là Focus thì cộng 1 phiên
  useEffect(() => {
    if (timeLeft > 0) return;

    setIsRunning(false);
    if (mode === "focus") {
      setSessions((prev) => prev + 1);
    }
  }, [timeLeft, mode]);

  // Đổi mode
  function handleModeChange(newMode) {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  }

  // Bấm Play / Pause
  function toggleTimer() {
    // Hết giờ mà bấm Play thì chạy lại từ đầu
    if (timeLeft === 0) {
      setTimeLeft(DURATIONS[mode]);
    }
    setIsRunning(!isRunning);
  }

  // Bấm Reset
  function resetTimer() {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  }

  return (
    <div className="panel">
      <ModeSwitch mode={mode} onChange={handleModeChange} />

      <TimerRing
        timeLeft={timeLeft}
        totalTime={DURATIONS[mode]}
        color={MODE_COLORS[mode]}
        label={MODE_LABELS[mode]}
      />

      <Controls
        isRunning={isRunning}
        sessions={sessions}
        onToggle={toggleTimer}
        onReset={resetTimer}
      />

      <PomoInfo mode={mode} />
      
    </div>

    

      
  );
}