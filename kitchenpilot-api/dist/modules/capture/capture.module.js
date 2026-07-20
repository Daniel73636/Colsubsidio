"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const speech_provider_interface_1 = require("./interfaces/speech-provider.interface");
const ocr_provider_interface_1 = require("./interfaces/ocr-provider.interface");
const openai_speech_provider_1 = require("./providers/openai-speech.provider");
const google_speech_provider_1 = require("./providers/google-speech.provider");
const openai_vision_provider_1 = require("./providers/openai-vision.provider");
const tesseract_ocr_provider_1 = require("./providers/tesseract-ocr.provider");
const google_vision_provider_1 = require("./providers/google-vision.provider");
const speech_service_1 = require("./services/speech.service");
const image_processing_service_1 = require("./services/image-processing.service");
const capture_controller_1 = require("./controllers/capture.controller");
let CaptureModule = class CaptureModule {
};
exports.CaptureModule = CaptureModule;
exports.CaptureModule = CaptureModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [capture_controller_1.CaptureController],
        providers: [
            openai_speech_provider_1.OpenAISpeechProvider,
            google_speech_provider_1.GoogleSpeechProvider,
            openai_vision_provider_1.OpenAIVisionProvider,
            tesseract_ocr_provider_1.TesseractOCRProvider,
            google_vision_provider_1.GoogleVisionProvider,
            {
                provide: speech_provider_interface_1.SPEECH_PROVIDER_TOKEN,
                useFactory: (configService, openai, google) => {
                    const provider = configService.get('SPEECH_PROVIDER', 'openai');
                    if (provider === 'google')
                        return google;
                    return openai;
                },
                inject: [config_1.ConfigService, openai_speech_provider_1.OpenAISpeechProvider, google_speech_provider_1.GoogleSpeechProvider],
            },
            {
                provide: ocr_provider_interface_1.OCR_PROVIDER_TOKEN,
                useFactory: (configService, openaiVision, tesseract, googleVision) => {
                    const provider = configService.get('OCR_PROVIDER', 'openai');
                    if (provider === 'tesseract')
                        return tesseract;
                    if (provider === 'google')
                        return googleVision;
                    return openaiVision;
                },
                inject: [
                    config_1.ConfigService,
                    openai_vision_provider_1.OpenAIVisionProvider,
                    tesseract_ocr_provider_1.TesseractOCRProvider,
                    google_vision_provider_1.GoogleVisionProvider,
                ],
            },
            speech_service_1.SpeechService,
            image_processing_service_1.ImageProcessingService,
        ],
        exports: [speech_service_1.SpeechService, image_processing_service_1.ImageProcessingService],
    })
], CaptureModule);
//# sourceMappingURL=capture.module.js.map