import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { SpeechService } from '../services/speech.service';
import { ImageProcessingService } from '../services/image-processing.service';
import { UploadAudioDto } from '../dto/upload-audio.dto';
import { UploadImageDto } from '../dto/upload-image.dto';

@ApiTags('Capture')
@Controller('capture')
export class CaptureController {
  constructor(
    private readonly speechService: SpeechService,
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // POST /api/capture/audio
  // ─────────────────────────────────────────────────────────────
  @Post('audio')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('audio', { storage: memoryStorage() }),
  )
  @ApiOperation({
    summary: 'Transcribe audio to text',
    description:
      'Receives a multipart audio file and returns the transcribed text using the configured Speech-to-Text provider (Whisper or Google Speech).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAudioDto })
  @ApiResponse({
    status: 200,
    description: 'Transcription successful',
    schema: {
      example: {
        text: 'Recibimos veinte kilos de pollo lote A45 temperatura 3 grados',
        confidence: 0.95,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No audio file provided or invalid format' })
  @ApiResponse({ status: 500, description: 'Provider error' })
  async transcribeAudio(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ text: string; confidence: number }> {
    const result = await this.speechService.transcribeAudio(file);
    return { text: result.text, confidence: result.confidence };
  }

  // ─────────────────────────────────────────────────────────────
  // POST /api/capture/image
  // ─────────────────────────────────────────────────────────────
  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', { storage: memoryStorage() }),
  )
  @ApiOperation({
    summary: 'Extract text from image (OCR)',
    description:
      'Receives a multipart image file and returns extracted text and metadata using the configured OCR provider (GPT-4o Vision, Tesseract, or Google Vision).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({
    status: 200,
    description: 'OCR extraction successful',
    schema: {
      example: {
        extractedText: 'FACTURA #4521\nPollo entero 20kg\nLote: A45\nTemp: 3°C',
        metadata: {
          provider: 'OpenAIVisionProvider',
          confidence: 0.93,
          blocks: [],
          filename: 'factura.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 102400,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No image file provided or invalid format' })
  @ApiResponse({ status: 500, description: 'Provider error' })
  async processImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ extractedText: string; metadata: object }> {
    const result = await this.imageProcessingService.processImage(file);
    return { extractedText: result.extractedText, metadata: result.metadata };
  }
}
