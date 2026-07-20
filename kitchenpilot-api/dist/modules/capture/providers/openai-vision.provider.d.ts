import { ConfigService } from '@nestjs/config';
import type { OCRProviderInterface } from '../interfaces/ocr-provider.interface';
import { OCRResult } from '../interfaces/ocr-provider.interface';
export declare class OpenAIVisionProvider implements OCRProviderInterface {
    private readonly configService;
    private readonly logger;
    private _client;
    constructor(configService: ConfigService);
    private get client();
    extract(imagePath: string): Promise<OCRResult>;
    private getMimeType;
}
