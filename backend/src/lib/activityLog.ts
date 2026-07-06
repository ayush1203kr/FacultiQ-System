import { prisma } from '../lib/prisma';
import { LogAction } from '@prisma/client';

export async function logActivity(params: {
  actorId: string;
  action: LogAction;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata ? (params.metadata as any) : undefined,
      },
    });
  } catch (err) {
    console.error('[activity-log]', err);
  }
}