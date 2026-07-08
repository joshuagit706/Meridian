import { PrismaClient } from '@prisma/client';
import { config } from './config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.isDev
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ]
      : [
          { emit: 'event', level: 'warn' },
          { emit: 'event', level: 'error' },
        ],
    errorFormat: config.isDev ? 'pretty' : 'minimal',
  });

if (config.isDev) {
  // Log queries in development only — lazy import to avoid circular dep
  prisma.$on('query' as never, (e: { query: string; duration: number }) => {
    if (process.env.PRISMA_QUERY_LOG === 'true') {
      console.debug(`[Prisma] ${e.query} — ${e.duration}ms`);
    }
  });
}

if (!config.isProd) {
  globalForPrisma.prisma = prisma;
}
