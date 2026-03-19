import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import type { IncomingMessage, ServerResponse } from 'http';
import type { NestExpressApplication } from '@nestjs/platform-express';

let app: NestExpressApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    // Global prefix for all routes
    app.setGlobalPrefix('api/v1', {
      exclude: ['api/docs', 'api/docs-json', 'api/docs-yaml'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Swagger setup
    const port = configService.get<number>('PORT', 3000);
    const config = new DocumentBuilder()
      .setTitle('Dashboard App API')
      .setDescription('The Dashboard App backend API documentation')
      .setVersion('1.0')
      .addServer('https://dep-incubation-backend.vercel.app', 'Production')
      .addServer(`http://localhost:${port}`, 'Local')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      useGlobalPrefix: false,
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js',
      ],
      customSiteTitle: 'Dashboard API Docs',
    });

    // Enable CORS - allow all origins
    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();
  }
  return app;
}

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API base path: http://localhost:${port}/api/v1`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}

// For Vercel serverless
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await createApp();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}

// For local development
if (process.env.VERCEL !== '1') {
  void bootstrap();
}
