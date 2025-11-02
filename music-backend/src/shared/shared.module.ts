// music-backend/src/shared/shared.module.ts (TẠO MỚI)
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    // LƯU Ý: Cấu hình mailer phải nằm ở App.module.ts,
    // Ở đây chúng ta sẽ giả lập một module Shared để Export Mailer
    MailerModule.forRoot({
      transport: { 
        host: 'smtp.gmail.com', 
        port: 587,
        secure: false, 
        auth: {
          user: 'YOUR_GMAIL_ADDRESS', 
          pass: 'YOUR_APP_PASSWORD',   
        },
      },
      defaults: {
        from: '"Lame Music Support" <noreply@lame.com>', 
      },
    }),
  ],
  // Xuất khẩu MailerModule để các module khác sử dụng
  exports: [MailerModule], 
})
export class SharedModule {}