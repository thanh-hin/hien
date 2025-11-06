// music-backend/src/song/dto/update-song.dto.ts (SỬA LỖI VALIDATION)
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string; // <-- KHÔNG CÓ @IsNumberString

  @IsOptional()
  @IsNumberString() 
  albumId?: string;

  @IsOptional()
  @IsNumberString()
  track_number?: string;
}