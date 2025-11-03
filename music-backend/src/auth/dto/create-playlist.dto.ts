// music-backend/src/playlist/dto/create-playlist.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Tên Playlist không được vượt quá 100 ký tự' })
  name: string;
  
  @IsBoolean({ message: 'Trạng thái Riêng tư phải là boolean.' })
  isPrivate: boolean; // Frontend gửi true/false
}