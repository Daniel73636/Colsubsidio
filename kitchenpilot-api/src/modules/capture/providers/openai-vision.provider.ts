import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import type { OCRProviderInterface } from '../interfaces/ocr-provider.interface';
import {
  OCRResult,
} from '../interfaces/ocr-provider.interface';

@Injectable()
export class OpenAIVisionProvider implements OCRProviderInterface {
  private readonly logger = new Logger(OpenAIVisionProvider.name);
  private _client: OpenAI | null = null;

  constructor(private readonly configService: ConfigService) {}

  /** Lazy-initialized OpenAI client — avoids crash when no API key is present at startup */
  private get client(): OpenAI {
    if (!this._client) {
      this._client = new OpenAI({
        apiKey: this.configService.get<string>('OPENAI_API_KEY', ''),
      });
    }
    return this._client;
  }

  async extract(imagePath: string): Promise<OCRResult> {
    this.logger.log(`Extracting text via GPT-4o Vision [path=${imagePath}]`);

    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const ext = path.extname(imagePath).toLowerCase().replace('.', '');
      const mimeType = this.getMimeType(ext);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an OCR engine for industrial kitchen documents. ' +
              'Extract ALL visible text from the image exactly as it appears. ' +
              'Return ONLY a JSON object with this shape: ' +
              '{"text": "<full extracted text>", "confidence": <0-1 float>, "blocks": [{"text": "<block text>", "confidence": <0-1>}]}. ' +
              'No explanations, no markdown, only raw JSON.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: dataUrl, detail: 'high' },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500,
      });

      const raw = response.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(raw) as OCRResult;

      this.logger.log(
        `OCR complete. Extracted ${parsed.text?.length ?? 0} characters.`,
      );

      return {
        text: parsed.text ?? '',
        confidence: parsed.confidence ?? 0.9,
        blocks: parsed.blocks ?? [],
      };
    } catch (err) {
      this.logger.error('GPT-4o Vision OCR failed', String(err));
      throw err;
    }
  }

  private getMimeType(ext: string): string {
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    return mimeMap[ext] ?? 'image/jpeg';
  }
}
