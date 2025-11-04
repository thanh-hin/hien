// music-backend/src/search/search.module.ts (CẬP NHẬT)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';
import { User } from '../user/user.entity'; // <-- (1) IMPORT USER

@Module({
  imports: [
    // (2) ĐĂNG KÝ USER ENTITY
    TypeOrmModule.forFeature([Song, Artist, Album, User])
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}