import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CaptureModule } from './modules/capture/capture.module';
import { AIModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // ── Configuration (load .env globally) ──
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── Feature modules ──
    CaptureModule,
    AIModule,
  ],
})
export class AppModule {}
