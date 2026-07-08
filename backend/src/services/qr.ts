import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs/promises';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

/**
 * Generates a PNG QR code for the given batchId.
 * The QR encodes the public verification URL for that batch.
 * The PNG is saved to {QR_STORAGE_PATH}/batch-{batchId}.png.
 * Returns the web-accessible relative path: /qr/batch-{batchId}.png
 */
export async function generateQRCode(batchId: string): Promise<string> {
  const verifyUrl = `${config.appUrl}/verify/${batchId}`;
  const filename = `batch-${batchId}.png`;
  const filePath = path.join(config.qrStoragePath, filename);

  // Ensure storage directory exists
  try {
    await fs.mkdir(config.qrStoragePath, { recursive: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new AppError(`Failed to create QR storage directory: ${msg}`, 500, 'QR_DIR_ERROR');
  }

  try {
    await QRCode.toFile(filePath, verifyUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new AppError(`QR code generation failed: ${msg}`, 500, 'QR_GENERATE_ERROR');
  }

  const relativePath = `/qr/${filename}`;
  logger.info({ batchId, filePath, relativePath }, 'QR code generated');
  return relativePath;
}
