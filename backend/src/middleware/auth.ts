import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export interface AuthPayload {
  address: string;
  role: string;
}

// Augment Express Request to carry the decoded actor
declare global {
  namespace Express {
    interface Request {
      actor?: AuthPayload;
    }
  }
}

export function issueToken(address: string, role: string): string {
  return jwt.sign({ address, role } satisfies AuthPayload, config.jwtSecret, {
    expiresIn: '7d',
    issuer: 'lineage-backend',
    audience: 'lineage-frontend',
  });
}

function extractBearer(req: Request): string {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header');
  }
  return header.slice(7);
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = extractBearer(req);
    const payload = jwt.verify(token, config.jwtSecret, {
      issuer: 'lineage-backend',
      audience: 'lineage-frontend',
    }) as AuthPayload;

    if (!payload.address || !payload.role) {
      throw new UnauthorizedError('Invalid token payload');
    }

    req.actor = { address: payload.address, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(err);
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, (err?: unknown) => {
    if (err) return next(err);
    if (req.actor?.role !== 'Admin') {
      return next(new ForbiddenError('Admin role required'));
    }
    next();
  });
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    requireAuth(req, res, (err?: unknown) => {
      if (err) return next(err);
      if (!req.actor || !roles.includes(req.actor.role)) {
        return next(
          new ForbiddenError(
            `Access restricted to roles: ${roles.join(', ')}`
          )
        );
      }
      next();
    });
  };
}
