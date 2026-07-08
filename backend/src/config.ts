import 'dotenv/config';
import path from 'path';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
}

function optionalEnv(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value && value.trim() !== '' ? value.trim() : defaultValue;
}

// Validate critical secrets at startup
const jwtSecret = requireEnv('JWT_SECRET');
const contractId = requireEnv('CONTRACT_ID');
const adminSecretKey = requireEnv('ADMIN_SECRET_KEY');

if (jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

export const config = {
  port: parseInt(optionalEnv('PORT', '3000'), 10),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  logLevel: optionalEnv('LOG_LEVEL', 'info'),

  // Database
  databaseUrl: requireEnv('DATABASE_URL'),

  // Redis
  redisUrl: optionalEnv('REDIS_URL', 'redis://localhost:6379'),

  // JWT
  jwtSecret,

  // Stellar / Soroban
  contractId,
  sorobanRpcUrl: optionalEnv('SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'),
  networkPassphrase: optionalEnv(
    'NETWORK_PASSPHRASE',
    'Test SDF Network ; September 2015'
  ),
  adminSecretKey,

  // IPFS / Pinata
  pinataApiKey: optionalEnv('PINATA_API_KEY', ''),
  pinataSecretKey: optionalEnv('PINATA_SECRET_KEY', ''),
  pinataJwt: optionalEnv('PINATA_JWT', ''),

  // App
  appUrl: optionalEnv('APP_URL', 'http://localhost:5173'),
  corsOrigin: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),

  // Storage
  qrStoragePath: path.resolve(optionalEnv('QR_STORAGE_PATH', './storage/qr')),

  get isProd(): boolean {
    return this.nodeEnv === 'production';
  },

  get isDev(): boolean {
    return this.nodeEnv === 'development';
  },
} as const;
