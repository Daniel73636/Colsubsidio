import { ConfigService } from '@nestjs/config';
import { AIResponseDto } from '../dto/ai-response.dto';
export declare class IntentClassifierService {
    private readonly configService;
    private readonly logger;
    private _client;
    constructor(configService: ConfigService);
    private get client();
    classify(text: string): Promise<AIResponseDto>;
}
