import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

/**
 * Middleware factory that validates req.body against the given Zod schema.
 * On success, replaces req.body with the parsed (coerced) value.
 * On failure, calls next() with a 400 BadRequestError containing all ZodError issues.
 */
export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as ZodError).errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return next(
        new BadRequestError(
          `Validation failed: ${issues.map((i) => `${i.path}: ${i.message}`).join('; ')}`
        )
      );
    }
    req.body = result.data;
    next();
  };
}
