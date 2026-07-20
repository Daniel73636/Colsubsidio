export interface SpeechResult {
  /** Transcribed text from the audio input */
  text: string;
  /** Confidence score between 0 and 1 */
  confidence: number;
}

export interface SpeechProviderInterface {
  /**
   * Transcribes audio from a buffer.
   * @param audioBuffer - Raw audio bytes
   * @param mimeType    - MIME type of the audio file (e.g. 'audio/mpeg')
   */
  transcribe(audioBuffer: Buffer, mimeType: string): Promise<SpeechResult>;
}

export const SPEECH_PROVIDER_TOKEN = 'SPEECH_PROVIDER';
