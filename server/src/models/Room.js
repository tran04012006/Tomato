import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🍅' },
    photo: { type: String, default: '' },
    maxMembers: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
