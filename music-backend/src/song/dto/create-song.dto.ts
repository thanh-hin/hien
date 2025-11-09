// music-backend/src/song/dto/create-song.dto.ts (THÊM DURATION)
import { IsString, IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string; 
  
  @IsOptional()
  @IsNumberString() 
  albumId?: string; 

  @IsOptional()
  @IsNumberString()
  track_number?: string; 
  
  @IsOptional() // <-- QUAN TRỌNG
  @IsNumberString() 
  duration?: string; // <-- Đã đúng (nhận chuỗi)

  @IsOptional() // <-- Lời bài hát là Optional
  @IsString()
  lyricsContent?: string; // <-- TRƯỜNG MỚI
}