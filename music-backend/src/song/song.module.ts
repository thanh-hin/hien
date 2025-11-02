// music-backend/src/song/song.module.ts (ĐÃ SỬA FINAL)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity'; 
import { Lyrics } from '../lyrics/lyrics.entity'; // <-- CẦN CÓ
import { UserLikedSongs } from '../like/user-liked-songs.entity'; 
import { AuthModule } from '../auth/auth.module'; 
import { SongService } from './song.service';
import { SongController } from './song.controller';

@Module({
  imports: [
    // === ĐĂNG KÝ TẤT CẢ CÁC ENTITY CẦN THIẾT ===
    TypeOrmModule.forFeature([Song, Artist, Album, Lyrics, UserLikedSongs]), 
    // ============================================
    AuthModule, 
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}