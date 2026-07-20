import type { SpeechProviderInterface } from '../interfaces/speech-provider.interface';
import { SpeechResult } from '../interfaces/speech-provider.interface';
export declare class SpeechService {
    private readonly speechProvider;
    private readonly logger;
    constructor(speechProvider: SpeechProviderInterface);
    transcribeAudio(file: Express.Multer.File): Promise<SpeechResult>;
}
