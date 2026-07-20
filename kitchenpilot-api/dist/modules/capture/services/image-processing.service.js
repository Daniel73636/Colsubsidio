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
var ImageProcessingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingService = void 0;
const common_1 = require("@nestjs/common");
const ocr_provider_interface_1 = require("../interfaces/ocr-provider.interface");
const file_util_1 = require("../../../common/utils/file.util");
let ImageProcessingService = ImageProcessingService_1 = class ImageProcessingService {
    ocrProvider;
    logger = new common_1.Logger(ImageProcessingService_1.name);
    constructor(ocrProvider) {
        this.ocrProvider = ocrProvider;
    }
    async processImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No image file provided');
        }
        this.logger.log(`Processing image: ${file.originalname} [${file.mimetype}, ${file.size} bytes]`);
        const tmpPath = (0, file_util_1.saveTmpFile)(file.buffer, file.originalname);
        let result;
        try {
            result = await this.ocrProvider.extract(tmpPath);
        }
        finally {
            (0, file_util_1.deleteTmpFile)(tmpPath);
        }
        this.logger.log(`OCR done. Confidence: ${result.confidence.toFixed(2)}, blocks: ${result.blocks?.length ?? 0}`);
        return {
            extractedText: result.text,
            metadata: {
                provider: this.ocrProvider.constructor.name,
                confidence: result.confidence,
                blocks: result.blocks,
                filename: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
            },
        };
    }
};
exports.ImageProcessingService = ImageProcessingService;
exports.ImageProcessingService = ImageProcessingService = ImageProcessingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ocr_provider_interface_1.OCR_PROVIDER_TOKEN)),
    __metadata("design:paramtypes", [Object])
], ImageProcessingService);
//# sourceMappingURL=image-processing.service.js.map