import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('[error]', err);

  if (err?.code === 'P2002') {
    return res.status(409).json({
      message: 'Unique constraint failed',
      field: err.meta?.target,
    });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found',
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
}