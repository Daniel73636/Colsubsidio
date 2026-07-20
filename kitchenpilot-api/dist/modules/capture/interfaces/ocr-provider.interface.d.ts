export interface TextBlock {
    text: string;
    boundingBox?: [number, number, number, number];
    confidence: number;
}
export interface OCRResult {
    text: string;
    confidence: number;
    blocks?: TextBlock[];
}
export interface OCRProviderInterface {
    extract(imagePath: string): Promise<OCRResult>;
}
export declare const OCR_PROVIDER_TOKEN = "OCR_PROVIDER";
