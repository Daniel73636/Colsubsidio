import { ApiProperty } from '@nestjs/swagger';

export class UploadAudioDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file to transcribe (mp3, wav, webm, m4a, ogg, flac)',
  })
  audio: Express.Multer.File;
}
