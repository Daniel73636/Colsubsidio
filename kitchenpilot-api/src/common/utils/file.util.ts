import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('FileUtil');
const TMP_DIR = '/tmp/kitchenpilot';

/**
 * Ensures the KitchenPilot temp directory exists.
 */
export function ensureTmpDir(): void {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    logger.log(`Created tmp directory: ${TMP_DIR}`);
  }
}

/**
 * Saves a buffer to a temp file and returns its absolute path.
 */
export function saveTmpFile(
  buffer: Buffer,
  originalName: string,
): string {
  ensureTmpDir();
  const ext = path.extname(originalName) || '';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(TMP_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  logger.log(`Saved tmp file: ${filePath}`);
  return filePath;
}

/**
 * Deletes a tmp file silently.
 */
export function deleteTmpFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.log(`Deleted tmp file: ${filePath}`);
    }
  } catch (err) {
    logger.warn(`Could not delete tmp file ${filePath}: ${String(err)}`);
  }
}
