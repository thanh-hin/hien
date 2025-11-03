// music-backend/src/category/category.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories') // API: GET /categories
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }
}