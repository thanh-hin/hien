// music-backend/src/user/dto/update-user.dto.ts (BẢN SỬA LỖI 400)
import { 
    IsString, IsOptional, IsIn, 
    IsNumber, Max, Min, MaxLength, 
    ValidateIf 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other', 'prefer not to say'])
  gender?: 'male' | 'female' | 'other' | 'prefer not to say';

  // === SỬA LỖI VALIDATION (Chấp nhận NULL/Rỗng) ===
  @IsOptional() 
  @ValidateIf(o => o.birth_year !== null && o.birth_year !== '') 
  @IsNumber({}, { message: 'Năm sinh phải là một con số' })
  @Min(1900)
  @Max(new Date().getFullYear())
  birth_year?: number; 
}