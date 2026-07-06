import { prisma } from './prisma';


export async function generateEmployeeId(): Promise<string> {
  const counter = await prisma.counter.upsert({
    where: { id: 'faculty' },
    update: { value: { increment: 1 } },
    create: { id: 'faculty', value: 1 },
  });

  return `FAC${String(counter.value).padStart(3, '0')}`;
}