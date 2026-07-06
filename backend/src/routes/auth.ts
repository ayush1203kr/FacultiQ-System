import { Router } from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '../schemas';
import { authGuard, AuthedRequest } from '../middleware/auth';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login with email and password
 */
router.post(
  '/login',
  loginLimiter,
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          faculty: {
            include: {
              department: true,
            },
          },
        },
      });

      if (!user)
        return res.status(401).json({
          message: 'Invalid credentials',
        });

      const ok = await bcrypt.compare(password, user.password);

      if (!ok)
        return res.status(401).json({
          message: 'Invalid credentials',
        });

      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const { password: _pw, ...safe } = user;

      res.json({
        token,
        user: safe,
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current logged-in user
 */
router.get(
  '/me',
  authGuard,
  async (req: AuthedRequest, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user!.sub,
        },
        include: {
          faculty: {
            include: {
              department: true,
            },
          },
        },
      });

      if (!user)
        return res.status(404).json({
          message: 'User not found',
        });

      const { password: _pw, ...safe } = user;

      res.json({
        user: safe,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;