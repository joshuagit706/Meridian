import pino from 'pino';
import { config } from '../config';

const transport =
  !config.isProd
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined;

export const logger = pino(
  {
    level: config.logLevel,
    base: { service: 'lineage-backend' },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'body.password',
        'body.secret',
        'body.adminSecretKey',
      ],
      censor: '[REDACTED]',
    },
  },
  transport ? pino.transport(transport) : undefined
);
