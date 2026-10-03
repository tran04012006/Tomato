import { parse } from 'cookie';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';
import { COOKIE_NAME, verifyToken } from '../middleware/auth.js';
import { addMember, countInRoom, listMembers, removeMember, updateMember } from './presence.js';

const STATUSES = ['Focusing', 'On break'];

export function registerSocket(io) {
  // Xác thực bằng JWT trong cookie httpOnly
  io.use(async (socket, next) => {
    try {
      const cookies = parse(socket.handshake.headers.cookie || '');
      const userId = verifyToken(cookies[COOKIE_NAME]);
      if (!userId) return next(new Error('unauthorized'));
      const user = await User.findById(userId);
      if (!user) return next(new Error('unauthorized'));
      socket.data.user = { id: String(user._id), name: user.name };
      next();
    } catch (err) {
      next(err);
    }
  });

  const leave = (socket) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    removeMember(roomId, socket.id);
    socket.leave(roomId);
    socket.data.roomId = null;
    io.to(roomId).emit('room:presence', listMembers(roomId));
    io.to(roomId).emit('chat:message', systemMessage(`${socket.data.user.name} đã rời phòng.`));
  };

  io.on('connection', (socket) => {
    socket.on('room:join', async ({ roomId } = {}) => {
      try {
        if (!mongoose.isValidObjectId(roomId)) return socket.emit('room:error', 'Phòng không hợp lệ');
        const room = await Room.findById(roomId);
        if (!room) return socket.emit('room:error', 'Không tìm thấy phòng');
        if (socket.data.roomId === roomId) return;
        leave(socket);
        if (countInRoom(roomId) >= room.maxMembers) return socket.emit('room:error', 'Phòng đã đầy');

        const { id, name } = socket.data.user;
        addMember(roomId, socket.id, {
          socketId: socket.id,
          userId: id,
          name,
          avatar: name.slice(0, 2).toUpperCase(),
          status: 'On break',
          min: 0,
        });
        socket.data.roomId = roomId;
        socket.join(roomId);

        const history = await Message.find({ room: roomId }).sort({ createdAt: -1 }).limit(50).lean();
        socket.emit('room:joined', {
          room: { id: room._id, name: room.name, photo: room.photo, maxMembers: room.maxMembers },
          history: history.reverse().map(toClientMessage),
        });
        io.to(roomId).emit('room:presence', listMembers(roomId));
        socket.to(roomId).emit('chat:message', systemMessage(`${name} đã vào phòng.`));
      } catch (err) {
        console.error(err);
        socket.emit('room:error', 'Không thể vào phòng');
      }
    });

    socket.on('room:leave', () => leave(socket));

    socket.on('status:update', ({ status, min } = {}) => {
      const roomId = socket.data.roomId;
      if (!roomId || !STATUSES.includes(status)) return;
      updateMember(roomId, socket.id, { status, min: Math.max(0, Math.min(Number(min) || 0, 100000)) });
      io.to(roomId).emit('room:presence', listMembers(roomId));
    });

    socket.on('chat:send', async ({ text } = {}) => {
      const roomId = socket.data.roomId;
      const clean = String(text || '').trim().slice(0, 500);
      if (!roomId || !clean) return;
      try {
        const msg = await Message.create({
          room: roomId,
          user: socket.data.user.id,
          name: socket.data.user.name,
          text: clean,
        });
        io.to(roomId).emit('chat:message', toClientMessage(msg));
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => leave(socket));
  });
}

function toClientMessage(m) {
  return { id: String(m._id), userId: String(m.user), name: m.name, text: m.text, createdAt: m.createdAt };
}

function systemMessage(text) {
  return { id: `sys-${Date.now()}-${Math.random()}`, system: true, name: 'System', text, createdAt: new Date() };
}
