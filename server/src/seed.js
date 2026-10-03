import 'dotenv/config';
import mongoose from 'mongoose';
import Room from './models/Room.js';

const rooms = [
  { name: 'Tomato Room A', icon: '🍅', description: 'General study — all subjects welcome', photo: 'https://images.unsplash.com/photo-1567774040705-e55e313f6079?auto=format&fit=crop&w=600&q=80' },
  { name: 'Tomato Room B', icon: '🌿', description: 'Quiet focus — no chatting, just vibes', photo: 'https://images.unsplash.com/photo-1784753390058-7dca350296d3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Tomato Room C', icon: '📚', description: 'Night owls — late session crew', photo: 'https://images.unsplash.com/photo-1698854536049-4ea3b8e4d035?auto=format&fit=crop&w=600&q=80' },
  { name: 'Tomato Room D', icon: '☀️', description: 'Morning session — early risers', photo: 'https://images.unsplash.com/photo-1595315342828-f5c4749649ba?auto=format&fit=crop&w=600&q=80' },
  { name: 'Tomato Room E', icon: '🌙', description: 'Exam prep — high focus zone', photo: 'https://images.unsplash.com/photo-1739918075668-fc7844c6d921?auto=format&fit=crop&w=600&q=80' },
];

await mongoose.connect(process.env.MONGO_URI);
await Room.deleteMany({});
await Room.insertMany(rooms.map((r) => ({ ...r, maxMembers: 10 })));
console.log(`Đã tạo ${rooms.length} phòng học.`);
await mongoose.disconnect();
