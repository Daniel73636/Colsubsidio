import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Interfaces / tokens
import { SPEECH_PROVIDER_TOKEN } from './interfaces/speech-provider.interface';
import { OCR_PROVIDER_TOKEN } from './interfaces/ocr-provider.interface';

// Providers
import { OpenAISpeechProvider } from './providers/openai-speech.provider';
import { GoogleSpeechProvider } from './providers/google-speech.provider';
import { OpenAIVisionProvider } from './providers/openai-vision.provider';
import { TesseractOCRProvider } from './providers/tesseract-ocr.provider';
import { GoogleVisionProvider } from './providers/google-vision.provider';

// Services
import { SpeechService } from './services/speech.service';
import { ImageProcessingService } from './services/image-processing.service';

// Controller
import { CaptureController } from './controllers/capture.controller';

@Module({
  imports: [ConfigModule],
  controllers: [CaptureController],
  providers: [
    // ── Concrete provider classes (available for factory injection) ──
    OpenAISpeechProvider,
    GoogleSpeechProvider,
    OpenAIVisionProvider,
    TesseractOCRProvider,
    GoogleVisionProvider,

    // ── Speech provider factory — selects by SPEECH_PROVIDER env ──
    {
      provide: SPEECH_PROVIDER_TOKEN,
      useFactory: (
        configService: ConfigService,
        openai: OpenAISpeechProvider,
        google: GoogleSpeechProvider,
      ) => {
        const provider = configService.get<string>('SPEECH_PROVIDER', 'openai');
        if (provider === 'google') return google;
        return openai; // default: openai
      },
      inject: [ConfigService, OpenAISpeechProvider, GoogleSpeechProvider],
    },

    // ── OCR provider factory — selects by OCR_PROVIDER env ──
    {
      provide: OCR_PROVIDER_TOKEN,
      useFactory: (
        configService: ConfigService,
        openaiVision: OpenAIVisionProvider,
        tesseract: TesseractOCRProvider,
        googleVision: GoogleVisionProvider,
      ) => {
        const provider = configService.get<string>('OCR_PROVIDER', 'openai');
        if (provider === 'tesseract') return tesseract;
        if (provider === 'google') return googleVision;
        return openaiVision; // default: openai
      },
      inject: [
        ConfigService,
        OpenAIVisionProvider,
        TesseractOCRProvider,
        GoogleVisionProvider,
      ],
    },

    // ── Services ──
    SpeechService,
    ImageProcessingService,
  ],
  exports: [SpeechService, ImageProcessingService],
})
export class CaptureModule {}
