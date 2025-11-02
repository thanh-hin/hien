// src/role/role.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]) // Đăng ký RoleEntity
  ],
  exports: [TypeOrmModule] // Export để module khác dùng
})
export class RoleModule {}