import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IntentClassifierService } from './services/intent-classifier.service';
import { AIAgent } from './agents/ai.agent';
import { AIController } from './controllers/ai.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [IntentClassifierService, AIAgent],
  exports: [AIAgent, IntentClassifierService],
})
export class AIModule {}
