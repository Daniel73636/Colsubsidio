"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TesseractOCRProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesseractOCRProvider = void 0;
const common_1 = require("@nestjs/common");
let TesseractOCRProvider = TesseractOCRProvider_1 = class TesseractOCRProvider {
    logger = new common_1.Logger(TesseractOCRProvider_1.name);
    async extract(imagePath) {
        this.logger.warn(`[STUB] TesseractOCRProvider.extract called [path=${imagePath}]. Returning mock data.`);
        return {
            text: '[STUB] Texto de prueba extraído por Tesseract OCR (mock)',
            confidence: 0.78,
            blocks: [
                {
                    text: '[STUB] Bloque de texto 1',
                    confidence: 0.78,
                },
            ],
        };
    }
};
exports.TesseractOCRProvider = TesseractOCRProvider;
exports.TesseractOCRProvider = TesseractOCRProvider = TesseractOCRProvider_1 = __decorate([
    (0, common_1.Injectable)()
], TesseractOCRProvider);
//# sourceMappingURL=tesseract-ocr.provider.js.map