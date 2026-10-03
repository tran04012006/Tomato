import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api/axios.js';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/pomodoro" replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/pomodoro', { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Đăng ký thất bại'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card pomato-card mx-auto">
      <h2 className="mb-1">Join Pomato 🌱</h2>
      <p className="text-muted small mb-4">Tạo tài khoản để lưu to-do và vào phòng học chung.</p>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form onSubmit={submit} className="d-grid gap-3">
        <div>
          <label className="form-label fw-bold small" htmlFor="name">Tên hiển thị</label>
          <input id="name" className="form-control" value={form.name} onChange={set('name')} maxLength={32} required autoComplete="name" />
        </div>
        <div>
          <label className="form-label fw-bold small" htmlFor="email">Email</label>
          <input id="email" type="email" className="form-control" value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>
        <div>
          <label className="form-label fw-bold small" htmlFor="password">Mật khẩu (tối thiểu 6 ký tự)</label>
          <input id="password" type="password" className="form-control" value={form.password} onChange={set('password')} minLength={6} required autoComplete="new-password" />
        </div>
        <button className="btn btn-pomato" disabled={busy}>{busy ? 'Đang tạo…' : 'Sign up'}</button>
      </form>
      <p className="small text-muted mt-3 mb-0">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
