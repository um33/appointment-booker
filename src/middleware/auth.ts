import {Response, Request, NextFunction} from 'express';
import { verifyAccessToken } from '../utils/jwt';

export type AuthRequest = Request & { user?: { userId: string; role: string } };
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      req.user = { userId: payload.userId, role: payload.role };
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}