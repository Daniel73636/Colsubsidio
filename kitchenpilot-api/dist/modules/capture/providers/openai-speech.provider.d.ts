import { ConfigService } from '@nestjs/config';
import type { SpeechProviderInterface } from '../interfaces/speech-provider.interface';
import { SpeechResult } from '../interfaces/speech-provider.interface';
export declare class OpenAISpeechProvider implements SpeechProviderInterface {
    private readonly configService;
    private readonly logger;
    private _client;
    constructor(configService: ConfigService);
    private get client();
    transcribe(audioBuffer: Buffer, mimeType: string): Promise<SpeechResult>;
    private getExtensionFromMime;
}
