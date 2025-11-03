// music-backend/src/auth/auth.controller.ts (FULL CODE - OTP ENDPOINTS)
import { 
  Controller, Post, Body, ValidationPipe, 
  Get, Query, Redirect, BadRequestException,
  UseGuards, // <-- (1) IMPORT UseGuards
  Req // <-- (2) IMPORT Req
} from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';
import { AuthGuard } from '@nestjs/passport'; // <-- IMPORT MỚI

import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto'; // <-- IMPORT DTO MỚI
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto'; // <-- IMPORT MỚI
import { ResetPasswordWithOtpDto } from './dto/reset-password-with-otp.dto'; // <-- IMPORT MỚI
import { ChangePasswordDto } from './dto/change-password.dto'; // <-- IMPORT MỚI

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

  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPasswordOtp(forgotPasswordDto);
  }

  // === ENDPOINT 6: ĐẶT LẠI MẬT KHẨU (DÙNG OTP) ===
  @Post('/reset-password-otp')
  resetPassword(@Body() resetPasswordDto: ResetPasswordWithOtpDto) {
    // Trả về { message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập.' }
    return this.authService.resetPasswordOtp(resetPasswordDto);
  }
/**
   * ENDPOINT MỚI: POST /auth/change-password (Đổi pass khi đã login)
   */
  @UseGuards(AuthGuard('jwt')) 
  @Post('/change-password')
  async changePassword(
    @Req() req: any,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto
  ) {
    const userId = (req.user as JwtPayload).userId;
    return this.authService.changePassword(userId, changePasswordDto);
  }
  
  /**
   * ENDPOINT MỚI: POST /auth/request-reset-otp (Khi đã đăng nhập)
   */
  @UseGuards(AuthGuard('jwt')) 
  @Post('/request-reset-otp')
  async requestResetOtp(@Req() req: any) {
    const userId = (req.user as JwtPayload).userId;
    return this.authService.requestPasswordResetOtp(userId);
  }
}