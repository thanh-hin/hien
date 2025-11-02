// music-backend/src/artist/artist.controller.ts (FULL CODE ĐÚNG)
import { ArtistService } from './artist.service';
import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  // API: GET /artists/featured
  @Get('featured')
  async getFeaturedArtists() {
    return this.artistService.findFeaturedArtists();
  }

  // === API MỚI: GET /artists/:id ===
  @Get(':id') // Endpoint: GET /artists/123
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
        throw new NotFoundException(`Nghệ sĩ với ID ${id} không tồn tại`);
    }
    return artist;
  }
}