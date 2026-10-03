import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PomodoroPage from './pages/PomodoroPage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import RoomPage from './pages/RoomPage.jsx';

export default function App() {
  return (
    <>
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/pomodoro" replace />} />
          <Route path="*" element={<Navigate to="/pomodoro" replace />} />
        </Routes>
      </main>
    </>
  );
}
