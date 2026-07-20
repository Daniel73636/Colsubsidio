import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AnalyzeTextDto {
  @ApiProperty({
    description: 'Plain text to analyze and classify (typically from STT or OCR output)',
    example: 'Recibimos veinte kilos de pollo lote A45 temperatura 3 grados',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  text: string;
}
