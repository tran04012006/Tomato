import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api/axios.js';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/pomodoro" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/pomodoro', { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Đăng nhập thất bại'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card pomato-card mx-auto">
      <h2 className="mb-1">Welcome back 🍅</h2>
      <p className="text-muted small mb-4">Đăng nhập để tiếp tục hành trình tập trung.</p>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form onSubmit={submit} className="d-grid gap-3">
        <div>
          <label className="form-label fw-bold small" htmlFor="email">Email</label>
          <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div>
          <label className="form-label fw-bold small" htmlFor="password">Mật khẩu</label>
          <input id="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <button className="btn btn-pomato" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Log in'}</button>
      </form>
      <p className="small text-muted mt-3 mb-0">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}
