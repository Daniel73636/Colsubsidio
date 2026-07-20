import { SpeechService } from '../services/speech.service';
import { ImageProcessingService } from '../services/image-processing.service';
export declare class CaptureController {
    private readonly speechService;
    private readonly imageProcessingService;
    constructor(speechService: SpeechService, imageProcessingService: ImageProcessingService);
    transcribeAudio(file: Express.Multer.File): Promise<{
        text: string;
        confidence: number;
    }>;
    processImage(file: Express.Multer.File): Promise<{
        extractedText: string;
        metadata: object;
    }>;
}
