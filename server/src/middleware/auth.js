import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'token';

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function requireAuth(req, res, next) {
  const userId = verifyToken(req.cookies?.[COOKIE_NAME]);
  if (!userId) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
  req.userId = userId;
  next();
}
