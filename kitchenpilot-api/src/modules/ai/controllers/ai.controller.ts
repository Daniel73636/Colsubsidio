import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AIAgent } from '../agents/ai.agent';
import { AnalyzeTextDto } from '../dto/analyze-text.dto';
import { AIResponseDto, VALID_INTENTS } from '../dto/ai-response.dto';

@ApiTags('AI Interpretation')
@Controller('ai')
export class AIController {
  constructor(private readonly aiAgent: AIAgent) {}

  // ─────────────────────────────────────────────────────────────
  // POST /api/ai/analyze
  // ─────────────────────────────────────────────────────────────
  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze and classify text from voice or OCR',
    description:
      'Receives plain text (from STT or OCR output) and returns a structured AIResponseDto ' +
      `with one of the following intents: ${VALID_INTENTS.join(', ')}. ` +
      'Missing required fields are listed in missing_fields with follow-up questions in Spanish.',
  })
  @ApiBody({ type: AnalyzeTextDto })
  @ApiResponse({
    status: 200,
    description: 'Text successfully classified',
    type: AIResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or empty input text',
  })
  @ApiResponse({
    status: 502,
    description: 'AI provider unavailable or returned invalid response',
  })
  async analyzeText(@Body() dto: AnalyzeTextDto): Promise<AIResponseDto> {
    return this.aiAgent.process(dto.text);
  }
}
