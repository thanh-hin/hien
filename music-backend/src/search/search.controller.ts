// music-backend/src/search/search.controller.ts (TẠO MỚI)
import { SearchService } from './search.service';
import { Controller, Get, Query, Patch, Body, UseGuards, Req, ValidationPipe, Param } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query('q') query: string) {
    // Service sẽ xử lý nếu query rỗng
    return this.searchService.findAll(query);
  }
}