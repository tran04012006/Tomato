import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md pomato-nav sticky-top">
      <div className="container">
        <NavLink className="navbar-brand brand-name" to="/">
          🍅 pomato<span className="brand-period">.</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Mở menu"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          {user && (
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/pomodoro">Pomodoro</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/todo">To-Do</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/rooms">Study Together</NavLink></li>
            </ul>
          )}
          <div className="ms-auto d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="small fw-bold text-secondary">{user.name}</span>
                <button className="btn btn-sm btn-outline-pomato" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-sm btn-outline-pomato" to="/login">Log in</NavLink>
                <NavLink className="btn btn-sm btn-pomato" to="/register">Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
