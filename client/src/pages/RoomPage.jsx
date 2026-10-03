import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoomPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const boxRef = useRef(null);

  useEffect(() => {
    const onJoined = ({ room: r, history }) => { setRoom(r); setMessages(history); };
    const onPresence = (list) => setMembers(list);
    const onMessage = (m) => setMessages((prev) => [...prev, m].slice(-200));
    const onError = (msg) => setError(msg);
    const onConnectError = () => setError('Không kết nối được tới server. Hãy đăng nhập lại.');
    const join = () => socket.emit('room:join', { roomId });

    socket.on('room:joined', onJoined);
    socket.on('room:presence', onPresence);
    socket.on('chat:message', onMessage);
    socket.on('room:error', onError);
    socket.on('connect_error', onConnectError);
    socket.on('connect', join);

    if (socket.connected) join();
    else socket.connect();

    return () => {
      socket.emit('room:leave');
      socket.off('room:joined', onJoined);
      socket.off('room:presence', onPresence);
      socket.off('chat:message', onMessage);
      socket.off('room:error', onError);
      socket.off('connect_error', onConnectError);
      socket.off('connect', join);
    };
  }, [roomId]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    socket.emit('chat:send', { text: value });
    setText('');
  };

  if (error && !room) {
    return (
      <div className="pomato-card mx-auto text-center" style={{ maxWidth: 480 }}>
        <p className="text-danger fw-bold">{error}</p>
        <button className="btn btn-pomato" onClick={() => navigate('/rooms')}>Quay lại danh sách phòng</button>
      </div>
    );
  }

  return (
    <div className="pomato-card mx-auto" style={{ maxWidth: 560 }}>
      {room?.photo && (
        <div className="room-cover mb-3">
          <img src={room.photo} alt="" />
          <span>Your shared corner of calm</span>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-bold">{room ? room.name : 'Đang vào phòng…'}</div>
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted fw-bold">{members.length}/{room?.maxMembers ?? 10} people</span>
          <button className="btn btn-sm btn-outline-pomato" onClick={() => navigate('/rooms')}>Leave</button>
        </div>
      </div>

      {error && <div className="alert alert-warning py-2 small">{error}</div>}

      <div className="section-label">In this room</div>
      <ul className="list-unstyled d-grid gap-1 mb-3">
        {members.map((m) => (
          <li key={m.socketId} className={`user-row d-flex align-items-center gap-2 ${m.userId === user.id ? 'you' : ''}`}>
            <span className="avatar">{m.avatar}</span>
            <span className="flex-grow-1 small fw-semibold">{m.name}{m.userId === user.id ? ' (you)' : ''}</span>
            <span className="small text-muted">
              <span className="status-dot" style={{ background: m.status === 'Focusing' ? '#4a8c52' : '#e07c5a' }} /> {m.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="section-label">Room Chat</div>
      <div className="chat-box mb-2" ref={boxRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg ${m.system ? 'text-muted fst-italic' : ''}`}>
            {!m.system && <strong className="me-1">{m.name}</strong>}
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <form className="input-group" onSubmit={send}>
        <input className="form-control" placeholder="Say something kind…" value={text} onChange={(e) => setText(e.target.value)} maxLength={500} aria-label="Tin nhắn" />
        <button className="btn btn-pomato">Send</button>
      </form>
    </div>
  );
}
