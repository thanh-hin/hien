// music-backend/src/totp/totp.service.ts (FULL CODE)
import { Injectable } from '@nestjs/common';

@Injectable()
export class TotpService {
  /**
   * Tạo mã OTP 6 chữ số ngẫu nhiên
   */
  generateOtp(): string {
    // Math.random() tạo số từ 0 đến 1. Nhân với 900000 (tạo 6 chữ số) + 100000 (đảm bảo 6 chữ số)
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Tính thời gian hết hạn (5 phút sau)
   */
  getExpiryTime(): Date {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    return expiryTime;
  }
}