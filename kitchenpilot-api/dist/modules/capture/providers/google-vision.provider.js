"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GoogleVisionProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVisionProvider = void 0;
const common_1 = require("@nestjs/common");
let GoogleVisionProvider = GoogleVisionProvider_1 = class GoogleVisionProvider {
    logger = new common_1.Logger(GoogleVisionProvider_1.name);
    async extract(imagePath) {
        this.logger.warn(`[STUB] GoogleVisionProvider.extract called [path=${imagePath}]. Returning mock data.`);
        return {
            text: '[STUB] Texto de prueba extraído por Google Vision (mock)',
            confidence: 0.92,
            blocks: [
                {
                    text: '[STUB] Bloque de texto 1',
                    confidence: 0.94,
                    boundingBox: [10, 10, 200, 30],
                },
                {
                    text: '[STUB] Bloque de texto 2',
                    confidence: 0.88,
                    boundingBox: [10, 50, 180, 30],
                },
            ],
        };
    }
};
exports.GoogleVisionProvider = GoogleVisionProvider;
exports.GoogleVisionProvider = GoogleVisionProvider = GoogleVisionProvider_1 = __decorate([
    (0, common_1.Injectable)()
], GoogleVisionProvider);
//# sourceMappingURL=google-vision.provider.js.map