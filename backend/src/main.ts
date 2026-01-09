import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (Next.js runs on port 3000)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  // Run on port 3001 to avoid conflict with Next.js
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🌤️  Weather API running on http://localhost:3001`);
}
bootstrap();
