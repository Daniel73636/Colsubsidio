import { Injectable, Logger } from '@nestjs/common';
import { IntentClassifierService } from '../services/intent-classifier.service';
import { AIResponseDto } from '../dto/ai-response.dto';

/**
 * AIAgent is the orchestration layer for AI processing pipelines.
 * Currently it routes text through the IntentClassifierService.
 * Future agents (e.g., InventoryAgent, TemperatureAgent) can be added here
 * as separate injectable services and composed by this agent.
 */
@Injectable()
export class AIAgent {
  private readonly logger = new Logger(AIAgent.name);

  constructor(
    private readonly intentClassifier: IntentClassifierService,
  ) {}

  /**
   * Processes plain text through the full AI pipeline:
   * 1. Classifies intent
   * 2. (Future) Routes to domain-specific agent based on intent
   * 3. Returns unified AIResponseDto
   */
  async process(text: string): Promise<AIResponseDto> {
    this.logger.log(`AIAgent processing text: "${text.slice(0, 60)}..."`);

    const classified = await this.intentClassifier.classify(text);

    this.logger.log(
      `Pipeline complete → intent: ${classified.intent} | confidence: ${classified.confidence}`,
    );

    return classified;
  }
}
