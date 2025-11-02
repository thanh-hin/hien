// music-backend/src/auth/dto/login-auth.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string; // Sử dụng email để đăng nhập

  @IsNotEmpty()
  @IsString()
  password: string;
}