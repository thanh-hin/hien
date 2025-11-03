// music-backend/src/playlist/playlist.service.ts (FULL CODE)
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { CreatePlaylistDto } from '../auth/dto/create-playlist.dto';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity'; // <-- (1) IMPORT SONG

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Song) // <-- (2) INJECT SONG REPO
    private songRepository: Repository<Song>,
  ) {}

  /**
   * TẠO PLAYLIST MỚI (Đã fix logic Public/Private)
   */
  async create(userId: number, createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    
    const privateStatus = createPlaylistDto.isPrivate ? 1 : 0; 

    const newPlaylist = this.playlistRepository.create({
      name: createPlaylistDto.name,
      user: user,
      is_active: 1,      
      is_private: privateStatus, 
    });

    return this.playlistRepository.save(newPlaylist);
  }

  /**
   * === HÀM MỚI: Lấy tất cả playlist của 1 user ===
   */
  async findMyPlaylists(userId: number): Promise<Playlist[]> {
    return this.playlistRepository.find({
      where: { 
        user: { id: userId },
        is_active: 1 
      },
      order: { created_at: 'DESC' } // Playlist mới nhất lên đầu
    });
  }

  /**
   * === HÀM MỚI: Thêm bài hát vào Playlist ===
   */
  async addSongToPlaylist(userId: number, playlistId: number, songId: number): Promise<Playlist> {
    // 1. Tìm playlist (và tải các bài hát đã có)
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['user', 'songs'], 
    });

    if (!playlist) {
      throw new NotFoundException('Không tìm thấy Playlist.');
    }

    // 2. Kiểm tra Playlist có thuộc User này không
    if (playlist.user.id !== userId) {
      throw new UnauthorizedException('Bạn không có quyền chỉnh sửa Playlist này.');
    }

    // 3. Tìm bài hát
    const song = await this.songRepository.findOne({ where: { id: songId } });
    if (!song) {
      throw new NotFoundException('Không tìm thấy Bài hát.');
    }

    // 4. Kiểm tra bài hát đã có trong playlist chưa
    const songExists = playlist.songs.some(s => s.id === song.id);
    if (songExists) {
      // Ném lỗi BadRequest thay vì trả về playlist
      throw new BadRequestException('Bài hát này đã có trong playlist.');
    }

    // 5. Thêm bài hát và lưu
    playlist.songs.push(song);
    return this.playlistRepository.save(playlist);
  }
}