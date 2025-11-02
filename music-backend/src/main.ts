// music-backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; 
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { join } from 'path'; 

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // === CẤU HÌNH PHỤC VỤ FILE TĨNH (FIX LỖI 404) ===
  // Vấn đề: File nhạc nằm ở music-frontend/public
  
  // __dirname hiện tại là thư mục 'dist' (khi chạy start:dev)
  // Chúng ta phải đi: /dist -> .. (music-backend) -> .. -> music-frontend/public
  const frontendPublicPath = join(__dirname, '..', '..', 'music-frontend', 'public');

  app.useStaticAssets(frontendPublicPath, {
    prefix: '/media', // URL để truy cập file
    // Thêm cấu hình setHeaders để fix lỗi Content-Type cho file MP3
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.mp3') || path.endsWith('.m4a')) {
            res.set('Content-Type', 'audio/mpeg');
        }
    },
  });
  
  // Cấu hình cho thư mục uploads (nếu có)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', 
  });
  // ====================================================

  await app.listen(3000);
}
bootstrap();