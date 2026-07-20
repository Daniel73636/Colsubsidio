import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Global prefix ──
  app.setGlobalPrefix('api');

  // ── Global Validation Pipe ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Exception Filter ──
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // ── CORS (dev-friendly) ──
  app.enableCors();

  // ── Swagger / OpenAPI ──
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KitchenPilot AI API')
    .setDescription(
      'Backend para cocinas industriales que convierte voz e imágenes en datos estructurados. ' +
        'Módulos: **Capture** (STT + OCR) y **AI Interpretation** (clasificación de intents).',
    )
    .setVersion('1.0.0')
    .addTag('Capture', 'Audio transcription and image OCR endpoints')
    .addTag('AI Interpretation', 'Natural language understanding and intent classification')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Local development')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'KitchenPilot AI — API Docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 KitchenPilot AI is running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger UI available at:        http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').fatal('Fatal startup error', err);
  process.exit(1);
});
