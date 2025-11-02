// music-backend/src/auth/dto/verify-otp.dto.ts (TẠO MỚI)
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  @IsString()
  @Length(6, 6, { message: 'Mã OTP phải có 6 chữ số' })
  otpCode: string;
}