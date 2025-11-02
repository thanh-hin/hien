// music-backend/src/shared/shared.module.ts (CẤU HÌNH GMAIL/GOOGLE SMTP)
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // === CẤU HÌNH GMAIL MỚI ===
        host: 'smtp.gmail.com', // Host SMTP của Google
        port: 465, // Port an toàn nhất cho Gmail (SSL/TLS)
        secure: true, // Phải là TRUE cho port 465
        auth: {
          user: 'thanhhien09022004@gmail.com', // <-- EMAIL GỬI CỦA BẠN
          pass: 'mtlp nzwg xuee lezi',   // <-- MẬT KHẨU ỨNG DỤNG 16 KÝ TỰ CỦA GOOGLE
        },
      },
      defaults: {
        from: '"Lame Music Support" <noreply@lame.com>',
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailerModule],
})
export class SharedModule {}