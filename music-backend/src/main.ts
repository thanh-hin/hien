// music-backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- IMPORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Cổng React
    credentials: true,
  });

  // DÙNG VALIDATIONPIPE TOÀN CỤC (Để định dạng lỗi)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();