export declare const VALID_INTENTS: readonly ["inventory_receipt", "temperature_record", "stock_check", "expiration_check", "cleaning_record"];
export type ValidIntent = (typeof VALID_INTENTS)[number];
export declare class AIResponseDto {
    intent: ValidIntent;
    entities: Record<string, unknown>;
    missing_fields: string[];
    questions: string[];
    confidence: number;
}
