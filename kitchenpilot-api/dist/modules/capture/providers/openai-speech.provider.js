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
var OpenAISpeechProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAISpeechProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importStar(require("openai"));
let OpenAISpeechProvider = OpenAISpeechProvider_1 = class OpenAISpeechProvider {
    configService;
    logger = new common_1.Logger(OpenAISpeechProvider_1.name);
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
    async transcribe(audioBuffer, mimeType) {
        this.logger.log(`Transcribing audio via OpenAI Whisper [mimeType=${mimeType}]`);
        try {
            const ext = this.getExtensionFromMime(mimeType);
            const filename = `audio.${ext}`;
            const file = await (0, openai_1.toFile)(audioBuffer, filename, { type: mimeType });
            const response = await this.client.audio.transcriptions.create({
                model: 'whisper-1',
                file,
                response_format: 'verbose_json',
            });
            const text = response.text ?? '';
            const avgLogprob = response['avg_logprob'] != null
                ? Number(response['avg_logprob'])
                : -0.5;
            const confidence = Math.min(1, Math.max(0, 1 + avgLogprob));
            this.logger.log(`Transcription complete. Characters: ${text.length}`);
            return { text, confidence };
        }
        catch (err) {
            this.logger.error('OpenAI Whisper transcription failed', String(err));
            throw err;
        }
    }
    getExtensionFromMime(mimeType) {
        const mimeMap = {
            'audio/mpeg': 'mp3',
            'audio/mp3': 'mp3',
            'audio/wav': 'wav',
            'audio/wave': 'wav',
            'audio/webm': 'webm',
            'audio/ogg': 'ogg',
            'audio/flac': 'flac',
            'audio/m4a': 'm4a',
            'audio/mp4': 'mp4',
        };
        return mimeMap[mimeType] ?? 'mp3';
    }
};
exports.OpenAISpeechProvider = OpenAISpeechProvider;
exports.OpenAISpeechProvider = OpenAISpeechProvider = OpenAISpeechProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAISpeechProvider);
//# sourceMappingURL=openai-speech.provider.js.map