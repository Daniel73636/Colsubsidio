import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { toFile } from 'openai';
import type { SpeechProviderInterface } from '../interfaces/speech-provider.interface';
import {
  SpeechResult,
} from '../interfaces/speech-provider.interface';

@Injectable()
export class OpenAISpeechProvider implements SpeechProviderInterface {
  private readonly logger = new Logger(OpenAISpeechProvider.name);
  private _client: OpenAI | null = null;

  constructor(private readonly configService: ConfigService) {}

  /** Lazy-initialized OpenAI client — avoids crash when no API key is present at startup */
  private get client(): OpenAI {
    if (!this._client) {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      if (!apiKey) {
        throw new ServiceUnavailableException('OPENAI_API_KEY is not configured in the environment');
      }
      this._client = new OpenAI({ apiKey });
    }
    return this._client;
  }

  async transcribe(audioBuffer: Buffer, mimeType: string): Promise<SpeechResult> {
    this.logger.log(`Transcribing audio via OpenAI Whisper [mimeType=${mimeType}]`);

    try {
      const ext = this.getExtensionFromMime(mimeType);
      const filename = `audio.${ext}`;

      const file = await toFile(audioBuffer, filename, { type: mimeType });

      const response = await this.client.audio.transcriptions.create({
        model: 'whisper-1',
        file,
        response_format: 'verbose_json',
      });

      const text = response.text ?? '';
      // verbose_json includes avg_logprob which approximates confidence
      const avgLogprob: number =
        (response as unknown as Record<string, unknown>)['avg_logprob'] != null
          ? Number((response as unknown as Record<string, unknown>)['avg_logprob'])
          : -0.5;

      // Convert avg_logprob (typically -1..0) to 0-1 confidence
      const confidence = Math.min(1, Math.max(0, 1 + avgLogprob));

      this.logger.log(`Transcription complete. Characters: ${text.length}`);
      return { text, confidence };
    } catch (err) {
      this.logger.error('OpenAI Whisper transcription failed', String(err));
      throw err;
    }
  }

  private getExtensionFromMime(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/wave': 'wav',
      'audio/webm': 'webm',
      'audio/ogg': 'ogg',
      'audio/flac': 'flac',
      'audio/m4a': 'm4a',
      'audio/mp4': 'mp4',
    };
    return mimeMap[mimeType] ?? 'mp3';
  }
}
