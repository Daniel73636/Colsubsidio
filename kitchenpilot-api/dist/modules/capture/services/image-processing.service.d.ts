import type { OCRProviderInterface } from '../interfaces/ocr-provider.interface';
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
export declare class ImageProcessingService {
    private readonly ocrProvider;
    private readonly logger;
    constructor(ocrProvider: OCRProviderInterface);
    processImage(file: Express.Multer.File): Promise<ImageProcessingResult>;
}
