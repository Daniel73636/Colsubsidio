import { Injectable, Logger } from '@nestjs/common';
import {
  SpeechProviderInterface,
  SpeechResult,
} from '../interfaces/speech-provider.interface';

/**
 * STUB — Google Cloud Speech-to-Text provider.
 * Returns a typed mock response. Replace with real implementation when needed.
 */
@Injectable()
export class GoogleSpeechProvider implements SpeechProviderInterface {
  private readonly logger = new Logger(GoogleSpeechProvider.name);

  async transcribe(audioBuffer: Buffer, mimeType: string): Promise<SpeechResult> {
    this.logger.warn(
      `[STUB] GoogleSpeechProvider.transcribe called [mimeType=${mimeType}, bytes=${audioBuffer.length}]. Returning mock data.`,
    );

    return {
      text: '[STUB] Transcripción de prueba desde Google Speech (mock)',
      confidence: 0.85,
    };
  }
}
