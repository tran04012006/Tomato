import { CIRCUMFERENCE } from "./constants";

export default function TimerRing({ timeLeft, totalTime, color, label }) {
  // Đổi số giây thành dạng mm:ss
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Tính phần trăm đã chạy được (từ 0 đến 1)
  const progress = (totalTime - timeLeft) / totalTime;

  // Vòng tròn càng chạy lâu thì offset càng nhỏ => phần màu càng dài
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="ring-wrap">
      <svg id="timer-svg" width="220" height="220" viewBox="0 0 220 220">
        {/* Vòng nền */}
        <circle
          cx="110"
          cy="110"
          r="88"
          fill="none"
          stroke="#f0e0dc"
          strokeWidth="10"
        />

        {/* Vòng màu chạy theo thời gian */}
        <circle
          cx="110"
          cy="110"
          r="88"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>

      <div className="timer-inner">
        <div id="timer-display">
          {minutes}:{seconds}
        </div>
        <div id="timer-label">{label}</div>
      </div>
    </div>
  );
}
