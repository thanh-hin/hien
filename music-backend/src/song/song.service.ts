// music-backend/src/song/song.service.ts (CODE CHÍNH XÁC)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { JwtPayload } from '../auth/jwt.strategy'; 
import { Artist } from '../artist/artist.entity'; // <-- Cần import
import { Lyrics } from '../lyrics/lyrics.entity'; // <-- (1) IMPORT

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist) // Cần nếu sau này bạn muốn làm tính năng 'Like'
    private artistRepository: Repository<Artist>, 
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
  ) {}

  
  /**
   * Hàm lấy bài hát (cho Trang Home) - ĐÃ THÊM LIMIT
   */
  async findAll(user: JwtPayload | null): Promise<Song[]> {
    
    const query = this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.artist', 'artist') 
      .leftJoinAndSelect('song.album', 'album')   
      .where('song.active = :active', { active: true });

    if (user) {
      // LOGIC KHI ĐÃ ĐĂNG NHẬP (Lấy 5 bài hát hot nhất)
      return query
        .orderBy('song.play_count', 'DESC')
        .limit(5) // <-- CHỈ LẤY 5 BÀI
        .getMany();
    } else {
      // LOGIC KHI CHƯA ĐĂNG NHẬP (Lấy 5 bài hát ngẫu nhiên)
      return query
        .orderBy('RAND()', 'ASC')
        .limit(5) // <-- CHỈ LẤY 5 BÀI
        .getMany();
    }
  }

  /**
   * Lấy chi tiết một bài hát theo ID
   */
  async findOne(id: number): Promise<Song | null> {
    return this.songRepository.findOne({
      where: { id: id, active: true },
      // Quan trọng: Phải lấy Album và Artist để hiển thị
      relations: ['artist', 'album'], 
    });
  }
  // Cần export class SongService

  /**
   * (3) HÀM MỚI: Lấy lời bài hát theo ID bài hát
   */
  async findLyrics(songId: number): Promise<Lyrics | null> {
    return this.lyricsRepository.findOne({
      where: { song_id: songId },
    });
  }
}