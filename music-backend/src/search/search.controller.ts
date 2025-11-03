// music-backend/src/search/search.controller.ts (TẠO MỚI)
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query('q') query: string) {
    // Service sẽ xử lý nếu query rỗng
    return this.searchService.findAll(query);
  }
}