import { IntentClassifierService } from '../services/intent-classifier.service';
import { AIResponseDto } from '../dto/ai-response.dto';
export declare class AIAgent {
    private readonly intentClassifier;
    private readonly logger;
    constructor(intentClassifier: IntentClassifierService);
    process(text: string): Promise<AIResponseDto>;
}
