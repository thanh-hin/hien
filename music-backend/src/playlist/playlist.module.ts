// music-backend/src/playlist/playlist.module.ts (FULL CODE)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { User } from '../user/user.entity'; 
import { Song } from '../song/song.entity'; // <-- (1) IMPORT SONG
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, User, Song]), // <-- (2) THÊM SONG
    AuthModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}