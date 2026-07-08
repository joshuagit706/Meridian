import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError && err.isOperational) {
    // Known, expected errors — no stack trace needed in production
    if (err.statusCode >= 500) {
      logger.error(
        { err, reqId: req.id, method: req.method, url: req.url },
        err.message
      );
    } else {
      logger.warn(
        { code: err.code, reqId: req.id, method: req.method, url: req.url },
        err.message
      );
    }

    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Unhandled / programmer errors — always log with full stack
  logger.error(
    { err, stack: err.stack, reqId: req.id, method: req.method, url: req.url },
    'Unhandled server error'
  );

  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
