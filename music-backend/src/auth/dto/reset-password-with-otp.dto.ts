// music-backend/src/auth/dto/reset-password-with-otp.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordWithOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // OTP thường là 6 số, nhưng ta giữ minLength 6 để bắt chuỗi
  otpCode: string; 

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' })
  newPassword: string;
}