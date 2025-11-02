// music-backend/src/song/song.controller.ts

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// === SỬA DÒNG NÀY (THÊM type) ===
import type { Request } from 'express'; 
// =================================
import { SongService } from './song.service';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard'; 
import { JwtPayload } from '../auth/jwt.strategy'; 
import { NotFoundException, Param, ParseIntPipe } from '@nestjs/common'; // <-- Thêm

@Controller('song') 
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard) 
  // Lỗi sẽ hết sau khi import type Request
  findAll(@Req() req: Request) { 
    const user: JwtPayload | null = (req as any).user as JwtPayload | null;
    return this.songService.findAll(user);
  }

  // API LẤY CHI TIẾT BÀI HÁT
  @Get(':id') 
  // Không cần @UseGuards vì SongDetail.jsx sẽ dùng axios để gọi
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const song = await this.songService.findOne(id);
    if (!song) {
        // Ném lỗi 404 nếu không tìm thấy, để Frontend xử lý chuyển hướng
        throw new NotFoundException(`Bài hát với ID ${id} không tồn tại`);
    }
    return song;
  }
  
  // === (4) API MỚI: GET /song/:id/lyrics ===
  @Get(':id/lyrics')
  async findLyrics(@Param('id', ParseIntPipe) id: number) {
    const lyrics = await this.songService.findLyrics(id);
    if (!lyrics) {
      throw new NotFoundException(`Không tìm thấy lời cho bài hát ID ${id}`);
    }
    return lyrics; // Chỉ trả về object lyrics (chứa .lyrics)
  }
}

