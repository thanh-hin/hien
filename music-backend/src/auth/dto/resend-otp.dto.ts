// music-backend/src/auth/dto/resend-otp.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @IsEmail({}, { message: 'Email phải là địa chỉ email hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;
}