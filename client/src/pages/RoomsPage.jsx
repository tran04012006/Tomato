import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/axios.js';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () =>
      api
        .get('/rooms')
        .then((res) => setRooms(res.data.rooms))
        .catch((err) => setError(errorMessage(err)))
        .finally(() => setLoading(false));
    load();
    const id = setInterval(load, 10000); // cập nhật số người định kỳ
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pomato-card mx-auto" style={{ maxWidth: 560 }}>
      <div className="panel-heading mb-3">
        <h2 className="mb-0">Grow together</h2>
        <p className="text-muted small mb-0">Good company. Better focus.</p>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}
      {loading && <p className="text-muted small text-center">Đang tải…</p>}
      {!loading && rooms.length === 0 && !error && (
        <p className="text-muted small text-center">Chưa có phòng nào. Chạy <code>npm run seed</code> ở thư mục gốc để tạo phòng mẫu.</p>
      )}

      <div className="d-grid gap-2">
        {rooms.map((r) => {
          const full = r.count >= r.maxMembers;
          return (
            <button key={r.id} type="button" className={`room-card ${full ? 'full' : ''}`} disabled={full} onClick={() => navigate(`/rooms/${r.id}`)}>
              {r.photo && <img className="room-photo" src={r.photo} alt="" loading="lazy" />}
              <div className="flex-grow-1 text-start">
                <div className="fw-bold small">{r.icon} {r.name}</div>
                <div className="text-muted" style={{ fontSize: 11 }}>{r.description}</div>
              </div>
              <span className={`badge ${full ? 'text-bg-secondary' : 'text-bg-success'}`}>{full ? 'Full' : `${r.count}/${r.maxMembers}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
