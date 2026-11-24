import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    task: {type: String, required: true, trim: true, maxlength: 200},
    done: {type: Boolean, default: false}
  },
  { timestamps: true }
);

export default mongoose.model('Todo', TodoSchema );
