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
var AIAgent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgent = void 0;
const common_1 = require("@nestjs/common");
const intent_classifier_service_1 = require("../services/intent-classifier.service");
let AIAgent = AIAgent_1 = class AIAgent {
    intentClassifier;
    logger = new common_1.Logger(AIAgent_1.name);
    constructor(intentClassifier) {
        this.intentClassifier = intentClassifier;
    }
    async process(text) {
        this.logger.log(`AIAgent processing text: "${text.slice(0, 60)}..."`);
        const classified = await this.intentClassifier.classify(text);
        this.logger.log(`Pipeline complete → intent: ${classified.intent} | confidence: ${classified.confidence}`);
        return classified;
    }
};
exports.AIAgent = AIAgent;
exports.AIAgent = AIAgent = AIAgent_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [intent_classifier_service_1.IntentClassifierService])
], AIAgent);
//# sourceMappingURL=ai.agent.js.map