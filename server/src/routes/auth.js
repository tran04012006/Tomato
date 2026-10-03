import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { COOKIE_NAME, requireAuth, setAuthCookie, signToken } from '../middleware/auth.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name || name.length > 32) return res.status(400).json({ message: 'Tên không hợp lệ (1–32 ký tự)' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Email không hợp lệ' });
    if (password.length < 6) return res.status(400).json({ message: 'Mật khẩu tối thiểu 6 ký tự' });

    if (await User.exists({ email })) return res.status(409).json({ message: 'Email đã được đăng ký' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    setAuthCookie(res, signToken(user._id));
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    setAuthCookie(res, signToken(user._id));
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

export default router;
