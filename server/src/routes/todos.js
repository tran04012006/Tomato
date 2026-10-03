import { Router } from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const validId = (id) => mongoose.isValidObjectId(id);

router.get('/', async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ todos });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text || text.length > 200) return res.status(400).json({ message: 'Nội dung task không hợp lệ (1–200 ký tự)' });
    const todo = await Todo.create({ user: req.userId, text });
    res.status(201).json({ todo });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'ID không hợp lệ' });
    const update = {};
    if (typeof req.body.done === 'boolean') update.done = req.body.done;
    if (typeof req.body.text === 'string' && req.body.text.trim()) update.text = req.body.text.trim().slice(0, 200);

    const todo = await Todo.findOneAndUpdate({ _id: req.params.id, user: req.userId }, update, { new: true });
    if (!todo) return res.status(404).json({ message: 'Không tìm thấy task' });
    res.json({ todo });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'ID không hợp lệ' });
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Không tìm thấy task' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
