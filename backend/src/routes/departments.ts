import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authGuard, requireRole, AuthedRequest } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  departmentCreateSchema,
  departmentUpdateSchema,
  departmentListQuerySchema,
} from '../schemas';
import { logActivity } from '../lib/activityLog';

const router = Router();

/**
 * GET ALL DEPARTMENTS
 */
router.get(
  '/',
  authGuard,
  validateQuery(departmentListQuerySchema),
  async (req, res, next) => {
    try {
      const q = (req as any).validatedQuery;

      const where: Prisma.DepartmentWhereInput = {
        deletedAt: null,
      };

      if (q.search) {
        where.OR = [
          {
            name: {
              contains: q.search,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: q.search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const [total, data] = await Promise.all([
        prisma.department.count({ where }),

        prisma.department.findMany({
          where,
          orderBy: {
            [q.sortBy]: q.order,
          },
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          include: {
            _count: {
              select: {
                faculty: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
            },
          },
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
/**
 * CREATE DEPARTMENT
 */
router.post(
  '/',
  authGuard,
  requireRole('ADMIN'),
  validateBody(departmentCreateSchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const dept = await prisma.department.create({
        data: req.body,
      });

      await logActivity({
        actorId: req.user!.sub,
        action: 'CREATE',
        entity: 'Department',
        entityId: dept.id,
        metadata: {
          name: dept.name,
          code: dept.code,
        },
      });

      res.status(201).json({
        data: dept,
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * UPDATE DEPARTMENT
 */
router.patch(
  '/:id',
  authGuard,
  requireRole('ADMIN'),
  validateBody(departmentUpdateSchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const dept = await prisma.department.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

      await logActivity({
        actorId: req.user!.sub,
        action: 'UPDATE',
        entity: 'Department',
        entityId: dept.id,
       metadata: {
  name: dept.name,
  code: dept.code,
  changed: Object.keys(req.body),
},
      });

      res.json({
        data: dept,
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * DELETE DEPARTMENT (SOFT DELETE)
 */
router.delete(
  '/:id',
  authGuard,
  requireRole('ADMIN'),
  async (req: AuthedRequest, res, next) => {
    try {
      const count = await prisma.faculty.count({
        where: {
          departmentId: req.params.id,
          deletedAt: null,
        },
      });

      if (count > 0) {
        return res.status(400).json({
          message: `Cannot delete department with ${count} active faculty. Reassign them first.`,
        });
      }

      const dept = await prisma.department.update({
        where: {
          id: req.params.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await logActivity({
        actorId: req.user!.sub,
        action: 'DELETE',
        entity: 'Department',
        entityId: dept.id,
       metadata: {
  name: dept.name,
  code: dept.code,
},
      });

      res.json({
        message: 'Department deleted',
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;