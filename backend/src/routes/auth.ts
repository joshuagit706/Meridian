import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import nacl from 'tweetnacl';
import { StrKey, TransactionBuilder } from '@stellar/stellar-sdk';
import { prisma } from '../db';
import { config } from '../config';
import { issueToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { BadRequestError, UnauthorizedError, NotFoundError, AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const router = Router();

// ─── Schemas ─────────────────────────────────────────────────────────────────

const verifyBodySchema = z.object({
  address: z
    .string()
    .length(56)
    .refine((a) => StrKey.isValidEd25519PublicKey(a), {
      message: 'Invalid Stellar address',
    }),
  challenge: z
    .string()
    .regex(/^[0-9a-f]{64}$/, 'challenge must be a 64-char hex string'),
  // signedXdr: the Stellar transaction XDR signed by Freighter containing the
  // challenge as a TEXT memo (first 28 hex chars).
  signedXdr: z.string().min(1, 'signedXdr is required'),
});

// ─── GET /auth/challenge ──────────────────────────────────────────────────────

router.get(
  '/challenge',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = req.query.address as string | undefined;
      if (!address || !StrKey.isValidEd25519PublicKey(address)) {
        throw new BadRequestError('Valid Stellar address required as ?address=');
      }

      const now = new Date();

      // Clean up all expired challenges globally (probabilistic, 20% of requests)
      if (Math.random() < 0.2) {
        prisma.authChallenge
          .deleteMany({ where: { expiresAt: { lt: now } } })
          .catch(() => {});
      }

      // Delete expired challenges for this address
      await prisma.authChallenge.deleteMany({
        where: { address, expiresAt: { lt: now } },
      });

      // Enforce max 3 active challenges per address to prevent DB flooding
      const activeCount = await prisma.authChallenge.count({
        where: { address, expiresAt: { gt: now } },
      });
      if (activeCount >= 3) {
        throw new AppError(
          'Too many pending challenges for this address. Wait for existing ones to expire.',
          429,
          'TOO_MANY_CHALLENGES'
        );
      }

      const challengeBytes = crypto.randomBytes(32);
      const challenge = challengeBytes.toString('hex');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await prisma.authChallenge.create({
        data: { address, challenge, expiresAt },
      });

      logger.debug({ address }, 'Auth challenge issued');
      res.json({ challenge });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /auth/verify ────────────────────────────────────────────────────────

router.post(
  '/verify',
  validate(verifyBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, signedXdr, challenge } = req.body as z.infer<typeof verifyBodySchema>;

      // Look up challenge in DB
      const record = await prisma.authChallenge.findUnique({
        where: { challenge },
      });

      if (!record) {
        throw new UnauthorizedError('Challenge not found or already used');
      }
      if (record.address !== address) {
        throw new UnauthorizedError('Challenge does not belong to this address');
      }
      if (record.expiresAt < new Date()) {
        await prisma.authChallenge.delete({ where: { id: record.id } });
        throw new UnauthorizedError('Challenge has expired');
      }

      // Deserialize the Freighter-signed Stellar transaction
      let tx: ReturnType<typeof TransactionBuilder.fromXDR>;
      try {
        tx = TransactionBuilder.fromXDR(signedXdr, config.networkPassphrase);
      } catch {
        throw new BadRequestError('signedXdr is not a valid Stellar transaction');
      }

      // The tx source must be the address claiming to authenticate
      if (tx.source !== address) {
        throw new UnauthorizedError('Transaction source does not match claimed address');
      }

      // The TEXT memo must equal the first 28 hex chars of the challenge
      // (Stellar TEXT memo max is 28 bytes)
      const expectedMemo = challenge.slice(0, 28);
      const memoValue =
        tx.memo.type === 'text' ? (tx.memo.value?.toString() ?? '') : '';
      if (memoValue !== expectedMemo) {
        throw new UnauthorizedError('Transaction memo does not match challenge');
      }

      // Verify the Ed25519 signature on the transaction hash
      if (tx.signatures.length === 0) {
        throw new UnauthorizedError('Transaction has no signatures');
      }
      const txHash = tx.hash();
      let publicKeyBytes: Buffer;
      try {
        publicKeyBytes = Buffer.from(StrKey.decodeEd25519PublicKey(address));
      } catch {
        throw new BadRequestError('Failed to decode Stellar address');
      }
      const sigBytes = Buffer.from(tx.signatures[0].signature());
      const valid = nacl.sign.detached.verify(txHash, sigBytes, publicKeyBytes);
      if (!valid) {
        throw new UnauthorizedError('Signature verification failed');
      }

      // Consume challenge (single-use)
      await prisma.authChallenge.delete({ where: { id: record.id } });

      // Look up actor in DB for role
      const actor = await prisma.actor.findUnique({
        where: { address },
        select: { address: true, role: true, name: true, active: true, kycStatus: true },
      });

      if (!actor) {
        throw new NotFoundError('Actor not registered. Contact an admin to register your address.');
      }
      if (!actor.active) {
        throw new UnauthorizedError('Actor account has been deactivated');
      }

      const token = issueToken(actor.address, actor.role);

      logger.info({ address, role: actor.role }, 'Auth token issued');
      res.json({
        token,
        actor: {
          address: actor.address,
          role: actor.role,
          name: actor.name,
          kycStatus: actor.kycStatus,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
