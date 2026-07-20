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
exports.CaptureController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const speech_service_1 = require("../services/speech.service");
const image_processing_service_1 = require("../services/image-processing.service");
const upload_audio_dto_1 = require("../dto/upload-audio.dto");
const upload_image_dto_1 = require("../dto/upload-image.dto");
let CaptureController = class CaptureController {
    speechService;
    imageProcessingService;
    constructor(speechService, imageProcessingService) {
        this.speechService = speechService;
        this.imageProcessingService = imageProcessingService;
    }
    async transcribeAudio(file) {
        const result = await this.speechService.transcribeAudio(file);
        return { text: result.text, confidence: result.confidence };
    }
    async processImage(file) {
        const result = await this.imageProcessingService.processImage(file);
        return { extractedText: result.extractedText, metadata: result.metadata };
    }
};
exports.CaptureController = CaptureController;
__decorate([
    (0, common_1.Post)('audio'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio', { storage: (0, multer_1.memoryStorage)() })),
    (0, swagger_1.ApiOperation)({
        summary: 'Transcribe audio to text',
        description: 'Receives a multipart audio file and returns the transcribed text using the configured Speech-to-Text provider (Whisper or Google Speech).',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: upload_audio_dto_1.UploadAudioDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transcription successful',
        schema: {
            example: {
                text: 'Recibimos veinte kilos de pollo lote A45 temperatura 3 grados',
                confidence: 0.95,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No audio file provided or invalid format' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Provider error' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptureController.prototype, "transcribeAudio", null);
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: (0, multer_1.memoryStorage)() })),
    (0, swagger_1.ApiOperation)({
        summary: 'Extract text from image (OCR)',
        description: 'Receives a multipart image file and returns extracted text and metadata using the configured OCR provider (GPT-4o Vision, Tesseract, or Google Vision).',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ type: upload_image_dto_1.UploadImageDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OCR extraction successful',
        schema: {
            example: {
                extractedText: 'FACTURA #4521\nPollo entero 20kg\nLote: A45\nTemp: 3°C',
                metadata: {
                    provider: 'OpenAIVisionProvider',
                    confidence: 0.93,
                    blocks: [],
                    filename: 'factura.jpg',
                    mimeType: 'image/jpeg',
                    sizeBytes: 102400,
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No image file provided or invalid format' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Provider error' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaptureController.prototype, "processImage", null);
exports.CaptureController = CaptureController = __decorate([
    (0, swagger_1.ApiTags)('Capture'),
    (0, common_1.Controller)('capture'),
    __metadata("design:paramtypes", [speech_service_1.SpeechService,
        image_processing_service_1.ImageProcessingService])
], CaptureController);
//# sourceMappingURL=capture.controller.js.map