// src/track/track.controller.ts
import { Controller, Get } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('tracks') // URL sẽ là /tracks
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get() // Khi có request GET /tracks
  findAll() {
    return this.trackService.findAll(); // Gọi service để lấy dữ liệu
  }
}