import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const VALID_INTENTS = [
  'inventory_receipt',
  'temperature_record',
  'stock_check',
  'expiration_check',
  'cleaning_record',
] as const;

export type ValidIntent = (typeof VALID_INTENTS)[number];

export class AIResponseDto {
  @ApiProperty({
    description: 'Classified intent of the input text',
    enum: VALID_INTENTS,
    example: 'inventory_receipt',
  })
  @IsString()
  @IsIn(VALID_INTENTS)
  intent: ValidIntent;

  @ApiProperty({
    description: 'Extracted entities from the text (product, quantity, batch, temperature, etc.)',
    type: 'object',
    additionalProperties: true,
    example: { product: 'pollo', quantity: 20, unit: 'kg', batch: 'A45', temperature: 3 },
  })
  @IsObject()
  entities: Record<string, unknown>;

  @ApiProperty({
    description: 'List of field names that are missing from the input and are required for this intent',
    type: [String],
    example: ['quantity', 'batch'],
  })
  @IsArray()
  @IsString({ each: true })
  missing_fields: string[];

  @ApiProperty({
    description: 'Follow-up questions in Spanish to ask the user for the missing fields',
    type: [String],
    example: ['¿Cuál es la cantidad recibida?', '¿Cuál es el número de lote?'],
  })
  @IsArray()
  @IsString({ each: true })
  questions: string[];

  @ApiProperty({
    description: 'Confidence score of the classification (0 = no confidence, 1 = maximum confidence)',
    minimum: 0,
    maximum: 1,
    example: 0.95,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;
}
