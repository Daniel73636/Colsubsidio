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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_agent_1 = require("../agents/ai.agent");
const analyze_text_dto_1 = require("../dto/analyze-text.dto");
const ai_response_dto_1 = require("../dto/ai-response.dto");
let AIController = class AIController {
    aiAgent;
    constructor(aiAgent) {
        this.aiAgent = aiAgent;
    }
    async analyzeText(dto) {
        return this.aiAgent.process(dto.text);
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze and classify text from voice or OCR',
        description: 'Receives plain text (from STT or OCR output) and returns a structured AIResponseDto ' +
            `with one of the following intents: ${ai_response_dto_1.VALID_INTENTS.join(', ')}. ` +
            'Missing required fields are listed in missing_fields with follow-up questions in Spanish.',
    }),
    (0, swagger_1.ApiBody)({ type: analyze_text_dto_1.AnalyzeTextDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Text successfully classified',
        type: ai_response_dto_1.AIResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or empty input text',
    }),
    (0, swagger_1.ApiResponse)({
        status: 502,
        description: 'AI provider unavailable or returned invalid response',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyze_text_dto_1.AnalyzeTextDto]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "analyzeText", null);
exports.AIController = AIController = __decorate([
    (0, swagger_1.ApiTags)('AI Interpretation'),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_agent_1.AIAgent])
], AIController);
//# sourceMappingURL=ai.controller.js.map