import { SpeechProviderInterface, SpeechResult } from '../interfaces/speech-provider.interface';
export declare class GoogleSpeechProvider implements SpeechProviderInterface {
    private readonly logger;
    transcribe(audioBuffer: Buffer, mimeType: string): Promise<SpeechResult>;
}
