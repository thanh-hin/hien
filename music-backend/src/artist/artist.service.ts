// music-backend/src/artist/artist.service.ts (BẢN FINAL FIX LỖI TRÙNG LẶP)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
// Import các Entity khác (cần thiết cho TypeORM)
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';
import { Album } from '../album/album.entity';


@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    // Cần inject thêm các Repository khác nếu Service cần truy cập trực tiếp
  ) {}

  /**
   * Lấy danh sách 6 nghệ sĩ ngẫu nhiên cho trang chủ (Sử dụng SQL Thô)
   */
  async findFeaturedArtists(): Promise<Artist[]> {
    // Sử dụng query() trực tiếp để khắc phục lỗi RAND()
    const query = `
        SELECT * FROM Artist 
        WHERE active = 1 
        ORDER BY RAND() 
        LIMIT 6
    `;

    const artists = await this.artistRepository.query(query);
    
    // TypeORM sẽ tự động ánh xạ kết quả SELECT * thành đối tượng Artist
    return artists;
  }

  /**
   * Lấy chi tiết một nghệ sĩ theo ID, bao gồm Bài hát và Album (Dùng cho Trang Detail)
   */
  async findOne(id: number): Promise<Artist | null> {
    return this.artistRepository.findOne({
      where: { id: id, active: true },
      // === QUAN TRỌNG: JOIN các quan hệ ===
      relations: ['user', 'songs', 'albums'], 
      // Sắp xếp dữ liệu liên quan
      order: {
        songs: { play_count: 'DESC' }, // Top songs
        albums: { release_date: 'DESC' } // Album mới nhất
      }
    });
  }
}