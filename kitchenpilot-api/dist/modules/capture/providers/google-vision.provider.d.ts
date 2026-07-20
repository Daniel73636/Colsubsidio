import { OCRProviderInterface, OCRResult } from '../interfaces/ocr-provider.interface';
export declare class GoogleVisionProvider implements OCRProviderInterface {
    private readonly logger;
    extract(imagePath: string): Promise<OCRResult>;
}
