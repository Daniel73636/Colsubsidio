export interface SpeechResult {
    text: string;
    confidence: number;
}
export interface SpeechProviderInterface {
    transcribe(audioBuffer: Buffer, mimeType: string): Promise<SpeechResult>;
}
export declare const SPEECH_PROVIDER_TOKEN = "SPEECH_PROVIDER";
