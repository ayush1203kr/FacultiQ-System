import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authGuard } from '../middleware/auth';

const router = Router();


router.get(
  '/summary',
  authGuard,
  async (_req, res, next) => {
    try {
      const [
        totalFaculty,
        totalDepartments,
        statusGroups,
        qualificationGroups,
        departmentGroups,
        allFaculty,
      ] = await Promise.all([
        prisma.faculty.count({
          where: {
            deletedAt: null,
          },
        }),

        prisma.department.count({
          where: {
            deletedAt: null,
          },
        }),

        prisma.faculty.groupBy({
          by: ['status'],
          where: {
            deletedAt: null,
          },
          _count: {
            _all: true,
          },
        }),

        prisma.faculty.groupBy({
          by: ['qualification'],
          where: {
            deletedAt: null,
          },
          _count: {
            _all: true,
          },
        }),

        prisma.faculty.groupBy({
          by: ['departmentId'],
          where: {
            deletedAt: null,
          },
          _count: {
            _all: true,
          },
        }),

        prisma.faculty.findMany({
          where: {
            deletedAt: null,
          },
          select: {
            joiningDate: true,
          },
        }),
      ]);

      const departments = await prisma.department.findMany({
        where: {
          id: {
            in: departmentGroups.map((d) => d.departmentId),
          },
        },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });

      const departmentMap = new Map(
        departments.map((d) => [d.id, d])
      );

      const byDepartment = departmentGroups.map((g) => ({
        departmentId: g.departmentId,
        department: departmentMap.get(g.departmentId)?.name || 'Unknown',
        code: departmentMap.get(g.departmentId)?.code || '',
        count: g._count._all,
      }));

      const statusDistribution = statusGroups.map((g) => ({
        status: g.status,
        count: g._count._all,
      }));

      const qualificationDistribution =
        qualificationGroups.map((g) => ({
          qualification: g.qualification,
          count: g._count._all,
        }));

      const now = new Date();

      const months: {
        month: string;
        count: number;
      }[] = [];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        );

        const key = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, '0')}`;

        months.push({
          month: key,
          count: 0,
        });
      }

      const monthIndex = new Map(
        months.map((m, i) => [m.month, i])
      );

      allFaculty.forEach(({ joiningDate }) => {
        const d = new Date(joiningDate);

        const key = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, '0')}`;

        const index = monthIndex.get(key);

        if (index !== undefined) {
          months[index].count++;
        }
      });

      const active =
        statusDistribution.find(
          (s) => s.status === 'ACTIVE'
        )?.count || 0;

      const onLeave =
        statusDistribution.find(
          (s) => s.status === 'ON_LEAVE'
        )?.count || 0;

      const inactive =
        statusDistribution.find(
          (s) => s.status === 'INACTIVE'
        )?.count || 0;

      res.json({
        totals: {
          faculty: totalFaculty,
          departments: totalDepartments,
          active,
          onLeave,
          inactive,
        },

        byDepartment,

        statusDistribution,

        qualificationDistribution,

        monthlyJoinees: months,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;