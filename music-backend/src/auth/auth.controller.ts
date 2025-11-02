// music-backend/src/auth/auth.controller.ts (FULL CODE - OTP ENDPOINTS)
import { 
  Controller, Post, Body, ValidationPipe, 
  BadRequestException 
} from '@nestjs/common'; 

import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto'; // <-- IMPORT DTO MỚI

@Controller('auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  /**
   * ENDPOINT: POST /auth/register (Tạo user INACTIVE và gửi OTP)
   */
  @Post('/register') 
  register(@Body(ValidationPipe) registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  /**
   * ENDPOINT: POST /auth/login (Chỉ đăng nhập nếu user.active = true)
   */
  @Post('/login') 
  login(@Body(ValidationPipe) loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  /**
   * ENDPOINT MỚI: POST /auth/verify-otp (Xác nhận mã OTP)
   */
  @Post('/verify-otp')
  async verifyOtp(@Body(ValidationPipe) verifyOtpDto: VerifyOtpDto) {
    await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otpCode);
    return { message: 'Xác nhận tài khoản thành công! Vui lòng đăng nhập.' };
  }
  
  // API link cũ GET /auth/confirm ĐÃ BỊ XÓA
}