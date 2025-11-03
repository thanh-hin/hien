// music-backend/src/search/search.module.ts (TẠO MỚI)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';

@Module({
  imports: [
    // Đăng ký 3 Entity mà Service này cần tìm kiếm
    TypeOrmModule.forFeature([Song, Artist, Album])
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}