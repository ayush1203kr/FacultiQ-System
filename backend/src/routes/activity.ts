import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authGuard, requireRole } from '../middleware/auth';
import { validateQuery } from '../middleware/validate';
import { activityListQuerySchema } from '../schemas';

const router = Router();

/**
 * GET ACTIVITY LOGS
 */
router.get(
  '/',
  authGuard,
  requireRole('ADMIN'),
  validateQuery(activityListQuerySchema),
  async (req, res, next) => {
    try {
      const q = (req as any).validatedQuery;

      const where: Prisma.ActivityLogWhereInput = {};

      if (q.entity) {
        where.entity = q.entity;
      }

      if (q.action) {
        where.action = q.action;
      }

      if (q.actorId) {
        where.actorId = q.actorId;
      }

      const [total, data] = await Promise.all([
        prisma.activityLog.count({
          where,
        }),

        prisma.activityLog.findMany({
          where,

          include: {
            actor: {
              select: {
                id: true,
                email: true,
                role: true,
                faculty: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },

          orderBy: {
            createdAt: 'desc',
          },

          skip: (q.page - 1) * q.limit,

          take: q.limit,
        }),
      ]);

      res.json({
        data,
        total,
        page: q.page,
        limit: q.limit,
        totalPages: Math.max(
          1,
          Math.ceil(total / q.limit)
        ),
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;