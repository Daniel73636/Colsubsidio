"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/exceptions/http-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalHttpExceptionFilter());
    app.enableCors();
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('KitchenPilot AI API')
        .setDescription('Backend para cocinas industriales que convierte voz e imágenes en datos estructurados. ' +
        'Módulos: **Capture** (STT + OCR) y **AI Interpretation** (clasificación de intents).')
        .setVersion('1.0.0')
        .addTag('Capture', 'Audio transcription and image OCR endpoints')
        .addTag('AI Interpretation', 'Natural language understanding and intent classification')
        .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Local development')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
    new common_1.Logger('Bootstrap').fatal('Fatal startup error', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map