// music-backend/src/song/song.module.ts
import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from '../artist/artist.entity';
import { AuthModule } from '../auth/auth.module'; // <-- (1) IMPORT
import { Lyrics } from '../lyrics/lyrics.entity'; // <-- (1) IMPORT LYRICS ENTITY

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Artist, Lyrics]),
    AuthModule, // <-- (2) THÊM VÀO ĐÂY
  ],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}