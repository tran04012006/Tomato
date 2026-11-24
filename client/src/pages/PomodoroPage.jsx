import { useState, useEffect } from "react";
import "../styles/pomodoro.css";
import ModeSwitch from "./pomodoro/ModeSwitch";
import TimerRing from "./pomodoro/TimerRing";
import Controls from "./pomodoro/Controls";
import PomoInfo from "./pomodoro/PomoInfo";
import { DURATIONS, MODE_LABELS, MODE_COLORS } from "./pomodoro/constants";
import { createSession, getStats } from "./api/pomodoro";
import ringSound from "../assets/audio/ring.mp3"


export default function Pomodoro() {
  const [mode, setMode] = useState("focus"); // mode hiện tại
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus); // số giây còn lại
  const [isRunning, setIsRunning] = useState(false); // đang chạy hay đang dừng
  const [sessions, setSessions] = useState(0); // số phiên focus đã xong
 

  // Khi mở trang: lấy stats từ server
  useEffect(() => {
    getStats()
      .then((res) => setSessions(res.data.data.focusSessions))
      .catch((err) => console.error(err));
  }, []);

  // Khi hết giờ thì dừng lại, nếu là Focus thì cộng 1 phiên + lưu lên server
  useEffect(() => {
    if (timeLeft > 0) return;

    setIsRunning(false);

  //thêm tiếng sau khi hết session
    const sound = new Audio(ringSound);                                    
    sound.volume = 0.6;                                                            
    sound.play().catch((err) => console.error("cant play audio:", err));    

    if (mode === "focus") {
      setSessions((prev) => prev + 1);
      createSession(DURATIONS.focus / 60).catch((err) => console.error(err));
    }
  }, [timeLeft, mode]);


  // Khi isRunning = true thì mỗi giây trừ 1 giây
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Dừng setInterval khi bấm pause hoặc rời trang
    return () => clearInterval(timer);
  }, [isRunning]);


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
    <div className="panel active">
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

      <div className="session-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`dot ${i < sessions % 4 ? "filled" : ""}`} />
        ))}
      </div>


      <PomoInfo mode={mode} />

    </div>




  );
}