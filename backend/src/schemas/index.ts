import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const QualificationEnum = z.enum([
  "BTECH",
  "MTECH",
  "MSC",
  "PHD",
  "MBA",
  "OTHER",
]);

export const StatusEnum = z.enum([
  "ACTIVE",
  "ON_LEAVE",
  "INACTIVE",
]);

export const RoleEnum = z.enum([
  "ADMIN",
  "FACULTY",
]);

export const facultyCreateSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().trim().min(5).max(25),
  designation: z.string().trim().min(1).max(80),
  qualification: QualificationEnum,
  experienceYears: z.coerce.number().int().min(0).max(70).default(0),
  subjects: z.array(z.string().trim().min(1)).default([]),
  bio: z.string().max(2000).optional().nullable(),
  departmentId: z.string().min(1),
  joiningDate: z.coerce.date(),
  status: StatusEnum.default("ACTIVE"),
  createLoginAccount: z.boolean().optional(),
  password: z.string().min(6).max(72).optional(),
});

export const facultyUpdateSchema =
  facultyCreateSchema.partial().omit({
    createLoginAccount: true,
    password: true,
  });

export const facultySelfUpdateSchema = z.object({
  phone: z.string().trim().min(5).max(25).optional(),
  bio: z.string().max(2000).optional().nullable(),
  subjects: z.array(z.string().trim().min(1)).optional(),
});
export const facultyListQuerySchema = z.object({
  search: z.string().trim().optional(),
  department: z.string().optional(),
  status: StatusEnum.optional(),
  qualification: QualificationEnum.optional(),
  sortBy: z
    .enum([
      "firstName",
      "lastName",
      "joiningDate",
      "experienceYears",
      "createdAt",
      "employeeId",
    ])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const departmentCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  code: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .transform((v) => v.toUpperCase()),
  description: z.string().max(500).optional().nullable(),
});

export const departmentUpdateSchema =
  departmentCreateSchema.partial();

export const departmentListQuerySchema = z.object({
  search: z.string().trim().optional(),
  sortBy: z.enum([
    "name",
    "code",
    "createdAt",
  ]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
export const activityListQuerySchema = z.object({
  entity: z.string().optional(),
  action: z.enum([
    "CREATE",
    "UPDATE",
    "DELETE",
  ]).optional(),
  actorId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});