import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AIResponseDto, VALID_INTENTS } from '../dto/ai-response.dto';
import {
  INTENT_CLASSIFIER_SYSTEM_PROMPT,
  buildUserPrompt,
} from '../prompts/intent-classifier.prompt';

@Injectable()
export class IntentClassifierService {
  private readonly logger = new Logger(IntentClassifierService.name);
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

  async classify(text: string): Promise<AIResponseDto> {
    if (!text?.trim()) {
      throw new BadRequestException('Input text cannot be empty');
    }

    this.logger.log(`Classifying text (${text.length} chars): "${text.slice(0, 80)}..."`);

    let raw: string;
    try {
      const response = await this.client.chat.completions.create({
        model: this.configService.get<string>('AI_MODEL', 'gpt-4o-mini'),
        messages: [
          { role: 'system', content: INTENT_CLASSIFIER_SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(text) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 600,
      });

      raw = response.choices[0]?.message?.content ?? '{}';
      this.logger.debug(`Raw LLM response: ${raw}`);
    } catch (err) {
      this.logger.error('OpenAI API call failed', String(err));
      throw new BadGatewayException(
        `AI provider unavailable: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // ── Parse JSON ──
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      this.logger.error(`Invalid JSON from LLM: ${raw}`);
      throw new BadGatewayException('AI provider returned invalid JSON');
    }

    // ── Coerce & validate with class-validator ──
    const dto = plainToInstance(AIResponseDto, parsed);

    // Ensure intent is always one of the valid ones (fallback)
    if (!VALID_INTENTS.includes(dto.intent)) {
      this.logger.warn(`Unknown intent "${dto.intent}", defaulting to "inventory_receipt"`);
      dto.intent = 'inventory_receipt';
    }

    // Clamp confidence
    dto.confidence = Math.min(1, Math.max(0, dto.confidence ?? 0));

    // Ensure arrays are present
    dto.entities = dto.entities ?? {};
    dto.missing_fields = dto.missing_fields ?? [];
    dto.questions = dto.questions ?? [];

    const errors = await validate(dto);
    if (errors.length > 0) {
      this.logger.error('AIResponseDto validation failed', JSON.stringify(errors));
      throw new BadGatewayException('AI response did not match expected schema');
    }

    this.logger.log(
      `Classification done. intent=${dto.intent}, confidence=${dto.confidence}, missing=${dto.missing_fields.length}`,
    );

    return dto;
  }
}
