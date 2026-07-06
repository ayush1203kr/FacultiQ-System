import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient, Qualification, Status } from '@prisma/client';

const prisma = new PrismaClient();

const DEPARTMENTS = [
  { name: 'Computer Science', code: 'CS', description: 'Computing, AI, software engineering' },
  { name: 'Mechanical Engineering', code: 'ME', description: 'Design, thermodynamics, robotics' },
  { name: 'Electrical Engineering', code: 'EE', description: 'Circuits, power systems, control' },
  { name: 'Mathematics', code: 'MATH', description: 'Pure and applied mathematics' },
  { name: 'Physics', code: 'PHY', description: 'Theoretical and experimental physics' },
  { name: 'Chemistry', code: 'CHEM', description: 'Organic, inorganic and analytical chemistry' },
];

const DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
];

const QUALIFICATIONS: Qualification[] = [
  'PHD',
  'MTECH',
  'MSC',
  'MBA',
  'BTECH',
  'OTHER',
];

const SUBJECTS: Record<string, string[]> = {
  CS: [
    'Data Structures',
    'Algorithms',
    'Operating Systems',
    'DBMS',
    'Machine Learning',
    'AI',
    'Web Development',
    'Compilers',
  ],
  ME: [
    'Thermodynamics',
    'Fluid Mechanics',
    'Machine Design',
    'Robotics',
    'CAD/CAM',
    'Manufacturing',
  ],
  EE: [
    'Circuit Theory',
    'Power Systems',
    'Control Systems',
    'Signals & Systems',
    'Electronics',
  ],
  MATH: [
    'Linear Algebra',
    'Calculus',
    'Probability',
    'Discrete Mathematics',
    'Real Analysis',
  ],
  PHY: [
    'Quantum Mechanics',
    'Classical Mechanics',
    'Electromagnetism',
    'Optics',
  ],
  CHEM: [
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Physical Chemistry',
    'Analytical Chemistry',
  ],
};

const FIRST = [
  'Aarav',
  'Vivaan',
  'Ananya',
  'Diya',
  'Rohan',
  'Ishaan',
  'Kavya',
  'Priya',
  'Aditya',
  'Meera',
  'Kabir',
  'Neha',
  'Arjun',
  'Riya',
  'Vikram',
  'Sara',
  'Yash',
  'Isha',
  'Devansh',
  'Nisha',
];

const LAST = [
  'Sharma',
  'Verma',
  'Iyer',
  'Patel',
  'Reddy',
  'Nair',
  'Kapoor',
  'Bose',
  'Mehta',
  'Rao',
  'Joshi',
  'Khan',
  'Chopra',
  'Das',
  'Gupta',
  'Singh',
  'Menon',
  'Pandey',
  'Malhotra',
  'Sinha',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}
async function main() {
  console.log('🌱 Seeding FacultiQ database...');

  // Remove existing data
  await prisma.activityLog.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.counter.deleteMany();

  // Create Admin
  const adminEmail =
    process.env.ADMIN_EMAIL || 'admin@facultiq.com';

  const adminPassword =
    process.env.ADMIN_PASSWORD || 'Admin@123';

  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin: ${admin.email}`);

  // Departments
  const departments = [];

  for (const d of DEPARTMENTS) {
    const dept = await prisma.department.create({
      data: d,
    });

    departments.push(dept);
  }

  console.log(`✅ Departments: ${departments.length}`);

  // Employee ID Counter
  await prisma.counter.create({
    data: {
      id: 'faculty',
      value: 0,
    },
  });

  // Faculty Status Distribution
  const statuses: Status[] = [
    ...Array(14).fill('ACTIVE' as Status),
    ...Array(3).fill('ON_LEAVE' as Status),
    ...Array(3).fill('INACTIVE' as Status),
  ];

  const facultyPassword = await bcrypt.hash(
    'Faculty@123',
    12
  );
    for (let i = 0; i < 20; i++) {
    const dept = departments[i % departments.length];

    const first = pick(FIRST);
    const last = pick(LAST);

    const email =
      `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@facultiq.com`;

    const counter = await prisma.counter.update({
      where: {
        id: 'faculty',
      },
      data: {
        value: {
          increment: 1,
        },
      },
    });

    const employeeId =
      `FAC${String(counter.value).padStart(3, '0')}`;

    const qualification = pick(QUALIFICATIONS);

    const experienceYears =
      Math.floor(Math.random() * 25) + 1;

    let userId: string | undefined;

    if (i < 3) {
      const user = await prisma.user.create({
        data: {
          email: `faculty${i + 1}@facultiq.com`,
          password: facultyPassword,
          role: 'FACULTY',
        },
      });

      userId = user.id;
    }

    await prisma.faculty.create({
      data: {
        employeeId,
        userId,

        firstName: first,
        lastName: last,

        email: userId
          ? `faculty${i + 1}@facultiq.com`
          : email,

        phone:
          `+91-9${Math.floor(
            100000000 +
              Math.random() * 899999999
          )}`,

        designation: pick(DESIGNATIONS),

        qualification,

        experienceYears,

        subjects: pickN(
          SUBJECTS[dept.code] || [],
          Math.min(
            3,
            SUBJECTS[dept.code].length
          )
        ),

        bio: `${qualification} with ${experienceYears} years of experience in the ${dept.name} department.`,

        departmentId: dept.id,

        joiningDate: daysAgo(
          Math.floor(Math.random() * 720)
        ),

        status: statuses[i],
      },
    });
  }

  console.log('✅ Faculty: 20');
    await prisma.activityLog.create({
    data: {
      actorId: admin.id,
      action: 'CREATE',
      entity: 'System',
      entityId: 'seed',
      metadata: {
        note: 'Initial database seed complete',
      },
    },
  });

  console.log('✅ Activity log initialized');

  console.log('\n🎉 Seed complete!');
  console.log(
    'Admin: admin@facultiq.com / Admin@123'
  );
  console.log(
    'Faculty: faculty1@facultiq.com / Faculty@123'
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });