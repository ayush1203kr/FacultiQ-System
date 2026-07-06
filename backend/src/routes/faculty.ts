import { Router } from 'express';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authGuard, requireRole, AuthedRequest } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  facultyCreateSchema,
  facultyUpdateSchema,
  facultySelfUpdateSchema,
  facultyListQuerySchema,
} from '../schemas';
import { logActivity } from '../lib/activityLog';
import { generateEmployeeId } from '../lib/employeeId';

const router = Router();

/**
 * GET ALL FACULTY
 */
router.get(
  '/',
  authGuard,
  validateQuery(facultyListQuerySchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const q = (req as any).validatedQuery;

      const where: Prisma.FacultyWhereInput = {
        deletedAt: null,
      };

      if (q.department)
        where.departmentId = q.department;

      if (q.status)
        where.status = q.status;

      if (q.qualification)
        where.qualification = q.qualification;

      if (q.search) {
        const s = q.search;

        where.OR = [
          {
            firstName: {
              contains: s,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: s,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: s,
              mode: 'insensitive',
            },
          },
          {
            employeeId: {
              contains: s,
              mode: 'insensitive',
            },
          },
          {
            subjects: {
              has: s,
            },
          },
        ];
      }

      const [total, data] = await Promise.all([
        prisma.faculty.count({
          where,
        }),

        prisma.faculty.findMany({
          where,
          include: {
            department: true,
          },
          orderBy: {
            [q.sortBy]: q.order,
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

router.get(
  '/:id',
  authGuard,
  async (req: AuthedRequest, res, next) => {
    try {
      const faculty = await prisma.faculty.findFirst({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
        include: {
          department: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!faculty) {
        return res.status(404).json({
          message: 'Faculty not found',
        });
      }

      res.json({
        data: faculty,
      });
    } catch (e) {
      next(e);
    }
  }
);
router.post(
  '/',
  authGuard,
  requireRole('ADMIN'),
  // validateBody(facultyCreateSchema),
  async (req: AuthedRequest, res, next) => {
    try {
      const body = req.body as any;

      const employeeId = await generateEmployeeId();

      let userId: string | undefined;

      if (body.createLoginAccount && body.password) {
        const hash = await bcrypt.hash(body.password, 12);

        const user = await prisma.user.create({
          data: {
            email: body.email,
            password: hash,
            role: 'FACULTY',
          },
        });

        userId = user.id;
      }

      const faculty = await prisma.faculty.create({
  data: {
    employeeId,

    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,

    designation: body.designation,

    qualification: body.qualification,

    experienceYears: body.experienceYears,

    subjects: body.subjects,

    bio: body.bio ?? null,

    departmentId: body.departmentId,

    joiningDate: new Date(body.joiningDate),

    status: body.status,

    userId,
  },

  include: {
    department: true,
  },
});

await logActivity({
  actorId: req.user!.sub,
  action: "CREATE",
  entity: "Faculty",
  entityId: faculty.id,
  metadata: {
    name: `${faculty.firstName} ${faculty.lastName}`,
    employeeId: faculty.employeeId,
    email: faculty.email,
  },
});

res.status(201).json({
  data: faculty,
});
    } catch (e: any) {
  console.error("CREATE ERROR");
  console.error(e);

  return res.status(500).json({
    message: e.message,
    stack: e.stack,
  });
}
  }
);
/**
 * UPDATE FACULTY
 */
router.patch(
  '/:id',
  authGuard,
  async (req: AuthedRequest, res, next) => {
    try {
      const existing = await prisma.faculty.findFirst({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
      });

      if (!existing) {
        return res.status(404).json({
          message: 'Faculty not found',
        });
      }

      const isAdmin = req.user!.role === 'ADMIN';
      const isSelf = existing.userId === req.user!.sub;

      if (!isAdmin && !isSelf) {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      let data: any;

      if (isAdmin) {
        const parsed = facultyUpdateSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            message: 'Validation failed',
            errors: parsed.error.flatten().fieldErrors,
          });
        }

        data = parsed.data;
      } else {
        const parsed = facultySelfUpdateSchema.safeParse(req.body);

        if (!parsed.success) {
          return res.status(400).json({
            message: 'Validation failed',
            errors: parsed.error.flatten().fieldErrors,
          });
        }

        data = parsed.data;
      }

      const updated = await prisma.faculty.update({
        where: {
         id: req.params.id,
        },
        data,
        include: {
          department: true,
        },
      });

      await logActivity({
        actorId: req.user!.sub,
        action: 'UPDATE',
        entity: 'Faculty',
        entityId: updated.id,
       metadata: {
  name: `${updated.firstName} ${updated.lastName}`,
  changed: Object.keys(data),
},
      });

      res.json({
        data: updated,
      });
    } catch (e) {
      next(e);
    }
  }
);

/**
 * SOFT DELETE FACULTY
 */
router.delete(
  '/:id',
  authGuard,
  requireRole('ADMIN'),
  async (req: AuthedRequest, res, next) => {
    try {
      const existing = await prisma.faculty.findFirst({
        where: {
          id: req.params.id,
          deletedAt: null,
        },
      });

      if (!existing) {
        return res.status(404).json({
          message: 'Faculty not found',
        });
      }

      await prisma.faculty.update({
        where: {
          id: req.params.id ,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await logActivity({
        actorId: req.user!.sub,
        action: 'DELETE',
        entity: 'Faculty',
        entityId: existing.id,
        metadata: {
  name: `${existing.firstName} ${existing.lastName}`,
  employeeId: existing.employeeId,
  email: existing.email,
},
      });

      res.json({
        message: 'Faculty deleted',
      });
  } catch (e: any) {
  console.error(e);

  return res.status(500).json({
    message: e.message,
    stack: e.stack,
  });
}
  }
);

export default router;