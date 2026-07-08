import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerActor, deactivateActor } from '../services/stellar';
import { ConflictError, NotFoundError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// Valid supply-chain roles (Admin is set at deploy time, not through this API)
const VALID_ROLES = ['Producer', 'Processor', 'Distributor', 'Retailer', 'Auditor'] as const;
type Role = (typeof VALID_ROLES)[number];

// ─── Schemas ─────────────────────────────────────────────────────────────────

const createActorSchema = z.object({
  address: z.string().length(56, 'Stellar address must be 56 characters'),
  role: z.enum(VALID_ROLES, {
    errorMap: () => ({
      message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
    }),
  }),
  name: z.string().min(1).max(200),
  contactInfo: z.string().max(500).optional(),
  kycStatus: z.enum(['pending', 'verified', 'rejected']).optional().default('pending'),
});

// ─── POST /actors ─────────────────────────────────────────────────────────────

router.post(
  '/',
  requireAdmin,
  validate(createActorSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, role, name, contactInfo, kycStatus } =
        req.body as z.infer<typeof createActorSchema>;

      // Check for duplicate
      const existing = await prisma.actor.findUnique({ where: { address } });
      if (existing) {
        throw new ConflictError(`Actor with address ${address} already exists`);
      }

      // Register on-chain first (admin-signed)
      const txHash = await registerActor(address, role, name);
      logger.info({ address, role, txHash }, 'Actor registered on-chain');

      // Persist in DB
      const actor = await prisma.actor.create({
        data: { address, role, name, contactInfo, kycStatus },
      });

      res.status(201).json({ actor, txHash });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /actors ──────────────────────────────────────────────────────────────

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleFilter = req.query.role as string | undefined;

      if (roleFilter && !([...VALID_ROLES, 'Admin'] as string[]).includes(roleFilter)) {
        throw new BadRequestError(`Invalid role filter. Must be one of: ${VALID_ROLES.join(', ')}`);
      }

      const actors = await prisma.actor.findMany({
        where: {
          active: true,
          ...(roleFilter ? { role: roleFilter } : {}),
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          address: true,
          role: true,
          name: true,
          contactInfo: true,
          kycStatus: true,
          active: true,
          createdAt: true,
        },
      });

      res.json({ actors, total: actors.length });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /actors/:address ─────────────────────────────────────────────────────

router.get(
  '/:address',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      const actor = await prisma.actor.findUnique({
        where: { address },
        select: {
          id: true,
          address: true,
          role: true,
          name: true,
          contactInfo: true,
          kycStatus: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!actor) {
        throw new NotFoundError(`Actor with address ${address} not found`);
      }

      res.json({ actor });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PATCH /actors/:address/deactivate ────────────────────────────────────────

router.patch(
  '/:address/deactivate',
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;

      const existing = await prisma.actor.findUnique({ where: { address } });
      if (!existing) {
        throw new NotFoundError(`Actor with address ${address} not found`);
      }
      if (!existing.active) {
        throw new ConflictError(`Actor ${address} is already deactivated`);
      }

      // Deactivate on-chain first
      const txHash = await deactivateActor(address);
      logger.info({ address, txHash }, 'Actor deactivated on-chain');

      // Update DB
      const actor = await prisma.actor.update({
        where: { address },
        data: { active: false },
      });

      res.json({ actor, txHash });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
