import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api/axios.js';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/todos')
      .then((res) => setTodos(res.data.todos))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const add = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    try {
      const res = await api.post('/todos', { text: value });
      setTodos((t) => [res.data.todo, ...t]);
      setText('');
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const toggle = async (todo) => {
    try {
      const res = await api.patch(`/todos/${todo._id}`, { done: !todo.done });
      setTodos((t) => t.map((x) => (x._id === todo._id ? res.data.todo : x)));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((t) => t.filter((x) => x._id !== id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const done = todos.filter((t) => t.done).length;
  const pct = todos.length ? Math.round((done / todos.length) * 100) : 0;
  const visible = todos.filter((t) => (filter === 'all' ? true : filter === 'active' ? !t.done : t.done));
  const growth = todos.length && done === todos.length ? 'Look at you bloom!' : done ? 'Your progress is growing.' : 'You’ve planted the seeds.';

  return (
    <div className="pomato-card mx-auto" style={{ maxWidth: 560 }}>
      <div className="panel-heading mb-3">
        <h2 className="mb-0">Plant your plans</h2>
        <p className="text-muted small mb-0">Big things start with small tasks.</p>
      </div>

      <div className="task-garden mb-3">
        <span className="small fw-bold text-success">YOUR DAILY GROWTH</span>
        <div className="growth-text">{growth} 🌱</div>
      </div>

      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="progress flex-grow-1" style={{ height: 6 }} role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar bg-success" style={{ width: `${pct}%` }} />
        </div>
        <span className="small text-success fw-bold">{done} of {todos.length} done</span>
      </div>

      <form className="input-group mb-3" onSubmit={add}>
        <input className="form-control" placeholder="What’s your next small step?" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} aria-label="Task mới" />
        <button className="btn btn-pomato" aria-label="Thêm task">+</button>
      </form>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="btn-group btn-group-sm mb-3" role="group" aria-label="Lọc task">
        {['all', 'active', 'done'].map((f) => (
          <button key={f} type="button" className={`btn btn-outline-success ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted small text-center">Đang tải…</p>
      ) : visible.length === 0 ? (
        <p className="text-muted small text-center py-3">{filter === 'done' ? 'Nothing completed yet.' : 'No tasks here.'}</p>
      ) : (
        <ul className="list-unstyled d-grid gap-2 mb-0">
          {visible.map((t) => (
            <li key={t._id} className={`todo-item d-flex align-items-center gap-2 ${t.done ? 'is-done' : ''}`}>
              <input type="checkbox" className="form-check-input mt-0" checked={t.done} onChange={() => toggle(t)} aria-label={`Hoàn thành: ${t.text}`} />
              <span className="flex-grow-1 small fw-semibold">{t.text}</span>
              <button className="btn btn-sm text-muted" onClick={() => remove(t._id)} aria-label={`Xóa: ${t.text}`}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
