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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIResponseDto = exports.VALID_INTENTS = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
exports.VALID_INTENTS = [
    'inventory_receipt',
    'temperature_record',
    'stock_check',
    'expiration_check',
    'cleaning_record',
];
class AIResponseDto {
    intent;
    entities;
    missing_fields;
    questions;
    confidence;
}
exports.AIResponseDto = AIResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Classified intent of the input text',
        enum: exports.VALID_INTENTS,
        example: 'inventory_receipt',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.VALID_INTENTS),
    __metadata("design:type", String)
], AIResponseDto.prototype, "intent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Extracted entities from the text (product, quantity, batch, temperature, etc.)',
        type: 'object',
        additionalProperties: true,
        example: { product: 'pollo', quantity: 20, unit: 'kg', batch: 'A45', temperature: 3 },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AIResponseDto.prototype, "entities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of field names that are missing from the input and are required for this intent',
        type: [String],
        example: ['quantity', 'batch'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AIResponseDto.prototype, "missing_fields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Follow-up questions in Spanish to ask the user for the missing fields',
        type: [String],
        example: ['¿Cuál es la cantidad recibida?', '¿Cuál es el número de lote?'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AIResponseDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confidence score of the classification (0 = no confidence, 1 = maximum confidence)',
        minimum: 0,
        maximum: 1,
        example: 0.95,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], AIResponseDto.prototype, "confidence", void 0);
//# sourceMappingURL=ai-response.dto.js.map