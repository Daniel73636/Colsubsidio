"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OpenAIVisionProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIVisionProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const openai_1 = __importDefault(require("openai"));
let OpenAIVisionProvider = OpenAIVisionProvider_1 = class OpenAIVisionProvider {
    configService;
    logger = new common_1.Logger(OpenAIVisionProvider_1.name);
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
    async extract(imagePath) {
        this.logger.log(`Extracting text via GPT-4o Vision [path=${imagePath}]`);
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            const ext = path.extname(imagePath).toLowerCase().replace('.', '');
            const mimeType = this.getMimeType(ext);
            const base64Image = imageBuffer.toString('base64');
            const dataUrl = `data:${mimeType};base64,${base64Image}`;
            const response = await this.client.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an OCR engine for industrial kitchen documents. ' +
                            'Extract ALL visible text from the image exactly as it appears. ' +
                            'Return ONLY a JSON object with this shape: ' +
                            '{"text": "<full extracted text>", "confidence": <0-1 float>, "blocks": [{"text": "<block text>", "confidence": <0-1>}]}. ' +
                            'No explanations, no markdown, only raw JSON.',
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: { url: dataUrl, detail: 'high' },
                            },
                        ],
                    },
                ],
                response_format: { type: 'json_object' },
                max_tokens: 1500,
            });
            const raw = response.choices[0]?.message?.content ?? '{}';
            const parsed = JSON.parse(raw);
            this.logger.log(`OCR complete. Extracted ${parsed.text?.length ?? 0} characters.`);
            return {
                text: parsed.text ?? '',
                confidence: parsed.confidence ?? 0.9,
                blocks: parsed.blocks ?? [],
            };
        }
        catch (err) {
            this.logger.error('GPT-4o Vision OCR failed', String(err));
            throw err;
        }
    }
    getMimeType(ext) {
        const mimeMap = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif',
        };
        return mimeMap[ext] ?? 'image/jpeg';
    }
};
exports.OpenAIVisionProvider = OpenAIVisionProvider;
exports.OpenAIVisionProvider = OpenAIVisionProvider = OpenAIVisionProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAIVisionProvider);
//# sourceMappingURL=openai-vision.provider.js.map