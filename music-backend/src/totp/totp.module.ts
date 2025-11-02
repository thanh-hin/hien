// music-backend/src/totp/totp.module.ts
import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';

@Module({
  providers: [TotpService],
  exports: [TotpService], // <-- ĐẢM BẢO DÒNG NÀY CÓ ĐỂ AUTHMODULE THẤY NÓ
})
export class TotpModule {}