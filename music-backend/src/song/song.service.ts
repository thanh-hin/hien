// music-backend/src/song/song.service.ts (CODE CHÍNH XÁC)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { JwtPayload } from '../auth/jwt.strategy'; 
import { Artist } from '../artist/artist.entity'; // <-- Cần import
import { Lyrics } from '../lyrics/lyrics.entity'; // <-- (1) IMPORT
import { Album } from '../album/album.entity'; // <-- CẦN
import { NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';


@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist) // Cần nếu sau này bạn muốn làm tính năng 'Like'
    private artistRepository: Repository<Artist>, 
    @InjectRepository(Lyrics)
    private lyricsRepository: Repository<Lyrics>,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
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
      // Logic khi đã đăng nhập: XÓA 'play_count'
      return query
        // === SỬA DÒNG NÀY: BỎ SẮP XẾP THEO LƯỢT NGHE ===
        .orderBy('song.id', 'DESC') // Sắp xếp theo ID mới nhất (hoặc bất kỳ cột nào)
        // =============================================
        .limit(5)
        .getMany();
    } else {
      // Logic khi là khách (ngẫu nhiên) giữ nguyên
      return query
        .orderBy('RAND()', 'ASC')
        .limit(5)
        .getMany();
    }
  }

  /**
     * Hàm findOne (API Song Detail)
     */
    async findOne(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
        where: { id: id, active: true },
        relations: ['artist', 'album'], 
    });
    
    if (!song) {
        throw new NotFoundException(`Song with ID ${id} not found or is inactive.`); 
    }

    // === SỬA LỖI ĐƯỜNG DẪN: ĐẢM BẢO FILE_URL DÙNG /media ===
    // Nếu file_url trong DB vẫn là /audio/track1.mp3, nó sẽ bị lỗi 404.
    // LƯU Ý: BƯỚC NÀY THAY THẾ CHO VIỆC CHÈN LẠI DỮ LIỆU SQL
    if (song.file_url && song.file_url.startsWith('/audio')) {
        // Tạm thời sửa đường dẫn nếu nó vẫn là đường dẫn Frontend cũ
        song.file_url = song.file_url.replace('/audio', '/media/audio');
    }
    // ====================================================

    return song;
    }

  // Cần export class SongService

  /**
   * (3) HÀM MỚI: Lấy lời bài hát theo ID bài hát
   */
  async findLyrics(songId: number): Promise<Lyrics | null> {
      return this.lyricsRepository.findOne({
        where: { song_id: songId }, // <-- SỬ DỤNG song_id CHÍNH XÁC
      });
    }

    /**
   * === HÀM MỚI: Lấy bài hát theo Thể loại ===
   */
  async findByGenre(genreName: string): Promise<Song[]> {
    // Dùng TypeORM để tìm
    return this.songRepository.find({
      where: { 
        genre: genreName, 
        active: true 
      },
      relations: ['artist', 'album'], // Join bảng
      order: { id: 'DESC' } // Sắp xếp theo ID mới nhất
    });
  }
// === HÀM LẤY TẤT CẢ BÀI HÁT (CÓ LỌC) ===
  async findAllWithFilters(
    genre?: string,
    artistId?: number, // artistId bây giờ là number hoặc undefined
  ): Promise<Song[]> {
    
    // Khởi tạo điều kiện WHERE cơ sở
    let whereConditions: any = { active: true }; 

    // 1. Thêm lọc Thể loại
    if (genre && genre !== '') {
      whereConditions = { ...whereConditions, genre: genre };
    }

    // 2. Thêm lọc Nghệ sĩ (join artist)
    // Kiểm tra artistId là number hợp lệ (do ParseIntPipe xử lý)
    if (artistId !== undefined && artistId !== null) { 
      whereConditions = { ...whereConditions, artist: { id: artistId } };
    }
    
    const options: FindManyOptions<Song> = {
      relations: ['artist', 'album'],
      where: whereConditions, 
      order: { id: 'DESC' }, 
    };

    return this.songRepository.find(options);
  }
}