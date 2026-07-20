import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { OCRProviderInterface } from '../interfaces/ocr-provider.interface';
import {
  OCRResult,
  OCR_PROVIDER_TOKEN,
} from '../interfaces/ocr-provider.interface';
import { saveTmpFile, deleteTmpFile } from '../../../common/utils/file.util';

export interface ImageProcessingResult {
  extractedText: string;
  metadata: {
    provider: string;
    confidence: number;
    blocks?: unknown[];
    filename: string;
    mimeType: string;
    sizeBytes: number;
  };
}

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);

  constructor(
    @Inject(OCR_PROVIDER_TOKEN)
    private readonly ocrProvider: OCRProviderInterface,
  ) {}

  async processImage(file: Express.Multer.File): Promise<ImageProcessingResult> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    this.logger.log(
      `Processing image: ${file.originalname} [${file.mimetype}, ${file.size} bytes]`,
    );

    const tmpPath = saveTmpFile(file.buffer, file.originalname);

    let result: OCRResult;
    try {
      result = await this.ocrProvider.extract(tmpPath);
    } finally {
      deleteTmpFile(tmpPath);
    }

    this.logger.log(
      `OCR done. Confidence: ${result.confidence.toFixed(2)}, blocks: ${result.blocks?.length ?? 0}`,
    );

    return {
      extractedText: result.text,
      metadata: {
        provider: this.ocrProvider.constructor.name,
        confidence: result.confidence,
        blocks: result.blocks,
        filename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    };
  }
}
