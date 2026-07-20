import { Injectable, Logger } from '@nestjs/common';
import {
  OCRProviderInterface,
  OCRResult,
} from '../interfaces/ocr-provider.interface';

/**
 * STUB — Tesseract OCR provider.
 * Returns a typed mock response. Replace with real node-tesseract-ocr integration when needed.
 */
@Injectable()
export class TesseractOCRProvider implements OCRProviderInterface {
  private readonly logger = new Logger(TesseractOCRProvider.name);

  async extract(imagePath: string): Promise<OCRResult> {
    this.logger.warn(
      `[STUB] TesseractOCRProvider.extract called [path=${imagePath}]. Returning mock data.`,
    );

    return {
      text: '[STUB] Texto de prueba extraído por Tesseract OCR (mock)',
      confidence: 0.78,
      blocks: [
        {
          text: '[STUB] Bloque de texto 1',
          confidence: 0.78,
        },
      ],
    };
  }
}
