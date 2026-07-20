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
var SpeechService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechService = void 0;
const common_1 = require("@nestjs/common");
const speech_provider_interface_1 = require("../interfaces/speech-provider.interface");
let SpeechService = SpeechService_1 = class SpeechService {
    speechProvider;
    logger = new common_1.Logger(SpeechService_1.name);
    constructor(speechProvider) {
        this.speechProvider = speechProvider;
    }
    async transcribeAudio(file) {
        if (!file) {
            throw new common_1.BadRequestException('No audio file provided');
        }
        this.logger.log(`Processing audio file: ${file.originalname} [${file.mimetype}, ${file.size} bytes]`);
        const result = await this.speechProvider.transcribe(file.buffer, file.mimetype);
        this.logger.log(`Transcription done. Confidence: ${result.confidence.toFixed(2)}`);
        return result;
    }
};
exports.SpeechService = SpeechService;
exports.SpeechService = SpeechService = SpeechService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(speech_provider_interface_1.SPEECH_PROVIDER_TOKEN)),
    __metadata("design:paramtypes", [Object])
], SpeechService);
//# sourceMappingURL=speech.service.js.map