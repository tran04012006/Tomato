import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';

const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const LABELS = { focus: 'Focus', short: 'Short Break', long: 'Long Break' };
const COLORS = { focus: '#d4453a', short: '#4a8c52', long: '#e07c5a' };
const TIPS = {
  focus: 'Focus like a tomato soaking up sunshine — steady & strong! ☀️',
  short: 'Take a breather! Drink some water, stretch a little. 🌿',
  long: 'You earned a long rest! Step outside for some fresh air. 🍃',
};
const R = 88;
const CIRC = 2 * Math.PI * R;
const STORE_KEY = 'pomato-harvest';

function loadSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (saved?.day === new Date().toDateString()) return Number(saved.sessions) || 0;
  } catch { /* bỏ qua */ }
  return 0;
}

export default function PomodoroPage() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(loadSessions);
  const [todos, setTodos] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [message, setMessage] = useState('');
  const deadline = useRef(0);

  useEffect(() => {
    api.get('/todos').then((res) => setTodos(res.data.todos.filter((t) => !t.done))).catch(() => {});
  }, []);

  const finish = useCallback(() => {
    setRunning(false);
    if (mode === 'focus') {
      setSessions((s) => {
        const next = s + 1;
        try { localStorage.setItem(STORE_KEY, JSON.stringify({ day: new Date().toDateString(), sessions: next })); } catch { /* bỏ qua */ }
        setMessage(next % 4 === 0 ? 'Four tomatoes harvested. Time for a long break!' : 'A fresh tomato harvested. You earned a break!');
        return next;
      });
    } else {
      setMessage('Feeling refreshed? Your next little step is waiting.');
    }
  }, [mode]);

  useEffect(() => {
    if (!running) return undefined;
    deadline.current = Date.now() + timeLeft * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        finish();
      }
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, finish]);

  const changeMode = (m) => {
    setMode(m);
    setRunning(false);
    setTimeLeft(DURATIONS[m]);
    setMessage('');
  };

  const toggle = () => {
    if (timeLeft <= 0) setTimeLeft(DURATIONS[mode]);
    setRunning((r) => !r);
    setMessage('');
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const completeTask = async () => {
    if (!taskId) return;
    try {
      await api.patch(`/todos/${taskId}`, { done: true });
      setTodos((t) => t.filter((x) => x._id !== taskId));
      setTaskId('');
      setMessage('One small step. One sweet win.');
    } catch { /* bỏ qua */ }
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const progress = (DURATIONS[mode] - timeLeft) / DURATIONS[mode];
  const harvested = sessions && sessions % 4 === 0 ? 4 : sessions % 4;
  const playLabel = running ? 'Pause' : timeLeft < DURATIONS[mode] ? 'Keep going' : mode === 'focus' ? 'Start focusing' : 'Start your break';

  return (
    <div className="pomato-card mx-auto" style={{ maxWidth: 520 }}>
      <div className="panel-heading mb-3">
        <h2 className="mb-0">Find your focus</h2>
        <p className="text-muted small mb-0">A little time, just for you.</p>
      </div>

      <div className="btn-group w-100 mb-4" role="group" aria-label="Chế độ">
        {Object.keys(DURATIONS).map((m) => (
          <button key={m} type="button" className={`btn btn-sm mode-btn ${mode === m ? 'active' : ''}`} onClick={() => changeMode(m)}>
            {LABELS[m]}
          </button>
        ))}
      </div>

      <div className="ring-wrap mx-auto mb-4">
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle cx="110" cy="110" r={R} fill="none" stroke="#ffe4db" strokeWidth="8" />
          <circle cx="110" cy="110" r={R} fill="none" stroke={COLORS[mode]} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={CIRC * progress} style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
        </svg>
        <div className="text-center position-relative">
          <div className="timer-display">{mm}:{ss}</div>
          <div className="timer-label">{LABELS[mode]}</div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-2">
        <button className="btn btn-outline-pomato" onClick={reset} aria-label="Reset">↺</button>
        <button className="btn btn-pomato px-4" onClick={toggle}>{playLabel}</button>
      </div>
      <p className="text-center small text-muted mb-3">{sessions} {sessions === 1 ? 'session' : 'sessions'} completed today</p>

      {message && <div className="alert alert-success py-2 text-center small">{message}</div>}

      {mode === 'focus' && (
        <div className="mb-3">
          <label className="form-label small fw-bold" htmlFor="current-task">Đang làm task nào?</label>
          <div className="input-group input-group-sm">
            <select id="current-task" className="form-select" value={taskId} onChange={(e) => setTaskId(e.target.value)}>
              <option value="">— Chọn task (không bắt buộc) —</option>
              {todos.map((t) => <option key={t._id} value={t._id}>{t.text}</option>)}
            </select>
            <button className="btn btn-outline-pomato" disabled={!taskId} onClick={completeTask}>Xong ✓</button>
          </div>
        </div>
      )}

      <div className="session-garden mb-3">
        <div className="d-flex justify-content-between small text-muted fw-bold">
          <span>TODAY’S HARVEST</span><span>{harvested} of 4 sessions</span>
        </div>
        <div className="d-flex justify-content-center gap-3 my-2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ fontSize: 28, opacity: i < harvested ? 1 : 0.25, filter: i < harvested ? 'none' : 'grayscale(1)' }}>🍅</span>
          ))}
        </div>
        <p className="text-center small text-muted mb-0">Four little tomatoes. One well-earned break.</p>
      </div>

      <p className="text-center small text-muted mb-0">{TIPS[mode]}</p>
    </div>
  );
}
