// music-backend/src/category/category.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // Lấy tất cả thể loại
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
        order: { name: 'ASC' } // Sắp xếp theo A-Z
    });
  }
}