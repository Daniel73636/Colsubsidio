import { Injectable, Logger } from '@nestjs/common';
import {
  OCRProviderInterface,
  OCRResult,
} from '../interfaces/ocr-provider.interface';

/**
 * STUB — Google Cloud Vision OCR provider.
 * Returns a typed mock response. Replace with real @google-cloud/vision integration when needed.
 */
@Injectable()
export class GoogleVisionProvider implements OCRProviderInterface {
  private readonly logger = new Logger(GoogleVisionProvider.name);

  async extract(imagePath: string): Promise<OCRResult> {
    this.logger.warn(
      `[STUB] GoogleVisionProvider.extract called [path=${imagePath}]. Returning mock data.`,
    );

    return {
      text: '[STUB] Texto de prueba extraído por Google Vision (mock)',
      confidence: 0.92,
      blocks: [
        {
          text: '[STUB] Bloque de texto 1',
          confidence: 0.94,
          boundingBox: [10, 10, 200, 30],
        },
        {
          text: '[STUB] Bloque de texto 2',
          confidence: 0.88,
          boundingBox: [10, 50, 180, 30],
        },
      ],
    };
  }
}
