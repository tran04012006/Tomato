import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import roomRoutes from './routes/rooms.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/rooms', roomRoutes);

app.use('/api', (_req, res) => res.status(404).json({ message: 'Không tìm thấy API' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

export default app;
