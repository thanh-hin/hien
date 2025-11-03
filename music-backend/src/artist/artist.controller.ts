// music-backend/src/artist/artist.controller.ts (BẢN SỬA LỖI 400 FINAL)
import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './artist.entity';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  /**
   * API: GET /artists/featured (Lấy 5 nghệ sĩ ngẫu nhiên cho Trang Home)
   */
  @Get('featured')
  async getFeaturedArtists() {
    return this.artistService.findFeaturedArtists();
  }
  
  /**
   * API MỚI: GET /artists/all (Lấy TẤT CẢ nghệ sĩ - KHÔNG NHẬN THAM SỐ)
   */
  @Get('all')
  async getAllArtists() {
    return this.artistService.findAllArtists();
  }

  /**
   * API: GET /artists/:id (Lấy chi tiết 1 nghệ sĩ)
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
        throw new NotFoundException(`Nghệ sĩ với ID ${id} không tồn tại`);
    }
    return artist;
  }
}