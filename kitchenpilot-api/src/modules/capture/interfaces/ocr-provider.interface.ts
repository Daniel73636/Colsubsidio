export interface TextBlock {
  /** Extracted text in this block */
  text: string;
  /** Optional bounding box coordinates [x, y, width, height] */
  boundingBox?: [number, number, number, number];
  /** Confidence for this specific block */
  confidence: number;
}

export interface OCRResult {
  /** Full extracted text from the image */
  text: string;
  /** Overall confidence score between 0 and 1 */
  confidence: number;
  /** Individual text blocks detected (provider-dependent) */
  blocks?: TextBlock[];
}

export interface OCRProviderInterface {
  /**
   * Extracts text from an image file.
   * @param imagePath - Absolute path to the image file
   */
  extract(imagePath: string): Promise<OCRResult>;
}

export const OCR_PROVIDER_TOKEN = 'OCR_PROVIDER';
