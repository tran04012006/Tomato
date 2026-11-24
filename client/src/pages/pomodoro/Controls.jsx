export default function Controls({ isRunning, sessions, onToggle, onReset }) {
  return (
    <div className="pomo-controls">
      <button className="ctrl-btn" onClick={onReset}>
        ↺
      </button>

      <button className="play-btn" onClick={onToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          {isRunning ? (
            // Icon Pause
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          ) : (
            // Icon Play
            <polygon points="5,3 19,12 5,21" />
          )}
        </svg>
      </button>

      <span className="session-count">🍅×{sessions}</span>
    </div>
  );
}