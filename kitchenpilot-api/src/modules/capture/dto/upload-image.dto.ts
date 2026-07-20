import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to process for OCR (jpg, png, webp, gif)',
  })
  image: Express.Multer.File;
}
