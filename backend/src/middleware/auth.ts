import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../lib/jwt";

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

export function authGuard(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Not authenticated',
    });
  }

  const token = header.slice(7).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}

export function requireRole(...roles: Array<'ADMIN' | 'FACULTY'>) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
}