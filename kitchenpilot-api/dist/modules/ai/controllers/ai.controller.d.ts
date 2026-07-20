import { AIAgent } from '../agents/ai.agent';
import { AnalyzeTextDto } from '../dto/analyze-text.dto';
import { AIResponseDto } from '../dto/ai-response.dto';
export declare class AIController {
    private readonly aiAgent;
    constructor(aiAgent: AIAgent);
    analyzeText(dto: AnalyzeTextDto): Promise<AIResponseDto>;
}
