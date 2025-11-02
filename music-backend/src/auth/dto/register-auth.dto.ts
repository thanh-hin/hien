// music-backend/src/auth/dto/register-auth.dto.ts (CẬP NHẬT)
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn, IsNumber, Max, Min } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional() // Giới tính vẫn có thể tùy chọn
  @IsString()
  @IsIn(['male', 'female', 'other', 'prefer not to say'])
  gender?: 'male' | 'female' | 'other' | 'prefer not to say';

  // === THAY ĐỔI TRƯỜNG NĂM SINH ===
  @IsNotEmpty({ message: 'Năm sinh không được để trống' }) // <-- THÊM BẮT BUỘC
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  birth_year: number; // <-- BỎ DẤU '?' (không còn optional)
}