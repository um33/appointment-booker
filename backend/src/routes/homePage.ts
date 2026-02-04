import {Router} from 'express';
import { prisma } from '../prisma';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const homePageRouter = Router();

// get to the home page after varyfying the user is authenticated
homePageRouter.get('/homePage' ,authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ message: `Welcome to the home page, ${user.name}!`, user });
});

