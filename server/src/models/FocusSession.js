import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    minutes: {type: Number,required: true, min:1, max: 120 }
  },
  { timestamps: true }
);

export default mongoose.model('FocusSession', FocusSessionSchema );
