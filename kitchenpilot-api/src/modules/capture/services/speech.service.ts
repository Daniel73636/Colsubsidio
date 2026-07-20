import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { SpeechProviderInterface } from '../interfaces/speech-provider.interface';
import {
  SpeechResult,
  SPEECH_PROVIDER_TOKEN,
} from '../interfaces/speech-provider.interface';

@Injectable()
export class SpeechService {
  private readonly logger = new Logger(SpeechService.name);

  constructor(
    @Inject(SPEECH_PROVIDER_TOKEN)
    private readonly speechProvider: SpeechProviderInterface,
  ) {}

  async transcribeAudio(file: Express.Multer.File): Promise<SpeechResult> {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    this.logger.log(
      `Processing audio file: ${file.originalname} [${file.mimetype}, ${file.size} bytes]`,
    );

    const result = await this.speechProvider.transcribe(
      file.buffer,
      file.mimetype,
    );

    this.logger.log(
      `Transcription done. Confidence: ${result.confidence.toFixed(2)}`,
    );

    return result;
  }
}
