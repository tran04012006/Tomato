import { Router } from 'express';
import Room from '../models/Room.js';
import { requireAuth } from '../middleware/auth.js';
import { countInRoom } from '../socket/presence.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req, res, next) => {
  try {
    const rooms = await Room.find().sort({ name: 1 }).lean();
    res.json({
      rooms: rooms.map((r) => ({ ...r, id: r._id, count: countInRoom(String(r._id)) })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
