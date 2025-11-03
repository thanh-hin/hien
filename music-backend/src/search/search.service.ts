// music-backend/src/search/search.service.ts (TẠO MỚI)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; // <-- IMPORT 'Like'
import { Song } from '../song/song.entity';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  /**
   * Tìm kiếm tất cả (Bài hát, Nghệ sĩ, Album) dựa trên 1 query
   */
  async findAll(query: string) {
    if (!query || query.trim() === '') {
      return { songs: [], artists: [], albums: [] };
    }

    const searchTerm = `%${query}%`; // Thêm % cho LIKE

    const [songs, artists, albums] = await Promise.all([
      
      // 1. Tìm Bài hát (theo Title)
      this.songRepository.find({
        where: { title: Like(searchTerm), active: true },
        relations: ['artist', 'album'],
        take: 5, // Giới hạn 5 kết quả
      }),
      
      // 2. Find Artists (theo Stage Name)
      this.artistRepository.find({
        where: { stage_name: Like(searchTerm), active: true },
        take: 5,
      }),
      
      // 3. Find Albums (theo Title)
      this.albumRepository.find({
        where: { title: Like(searchTerm) }, // (Giả sử Album luôn active)
        relations: ['artist'],
        take: 5,
      }),
    ]);

    return { songs, artists, albums };
  }
}