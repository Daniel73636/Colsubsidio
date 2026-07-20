"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var IntentClassifierService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentClassifierService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ai_response_dto_1 = require("../dto/ai-response.dto");
const intent_classifier_prompt_1 = require("../prompts/intent-classifier.prompt");
let IntentClassifierService = IntentClassifierService_1 = class IntentClassifierService {
    configService;
    logger = new common_1.Logger(IntentClassifierService_1.name);
    _client = null;
    constructor(configService) {
        this.configService = configService;
    }
    get client() {
        if (!this._client) {
            this._client = new openai_1.default({
                apiKey: this.configService.get('OPENAI_API_KEY', ''),
            });
        }
        return this._client;
    }
    async classify(text) {
        if (!text?.trim()) {
            throw new common_1.BadRequestException('Input text cannot be empty');
        }
        this.logger.log(`Classifying text (${text.length} chars): "${text.slice(0, 80)}..."`);
        let raw;
        try {
            const response = await this.client.chat.completions.create({
                model: this.configService.get('AI_MODEL', 'gpt-4o-mini'),
                messages: [
                    { role: 'system', content: intent_classifier_prompt_1.INTENT_CLASSIFIER_SYSTEM_PROMPT },
                    { role: 'user', content: (0, intent_classifier_prompt_1.buildUserPrompt)(text) },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1,
                max_tokens: 600,
            });
            raw = response.choices[0]?.message?.content ?? '{}';
            this.logger.debug(`Raw LLM response: ${raw}`);
        }
        catch (err) {
            this.logger.error('OpenAI API call failed', String(err));
            throw new common_1.BadGatewayException(`AI provider unavailable: ${err instanceof Error ? err.message : String(err)}`);
        }
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            this.logger.error(`Invalid JSON from LLM: ${raw}`);
            throw new common_1.BadGatewayException('AI provider returned invalid JSON');
        }
        const dto = (0, class_transformer_1.plainToInstance)(ai_response_dto_1.AIResponseDto, parsed);
        if (!ai_response_dto_1.VALID_INTENTS.includes(dto.intent)) {
            this.logger.warn(`Unknown intent "${dto.intent}", defaulting to "inventory_receipt"`);
            dto.intent = 'inventory_receipt';
        }
        dto.confidence = Math.min(1, Math.max(0, dto.confidence ?? 0));
        dto.entities = dto.entities ?? {};
        dto.missing_fields = dto.missing_fields ?? [];
        dto.questions = dto.questions ?? [];
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            this.logger.error('AIResponseDto validation failed', JSON.stringify(errors));
            throw new common_1.BadGatewayException('AI response did not match expected schema');
        }
        this.logger.log(`Classification done. intent=${dto.intent}, confidence=${dto.confidence}, missing=${dto.missing_fields.length}`);
        return dto;
    }
};
exports.IntentClassifierService = IntentClassifierService;
exports.IntentClassifierService = IntentClassifierService = IntentClassifierService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IntentClassifierService);
//# sourceMappingURL=intent-classifier.service.js.map