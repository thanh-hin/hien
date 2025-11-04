// music-backend/src/follow/follow.module.ts (SỬA ĐỔI)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service'; // <-- IMPORT
import { FollowController } from './follow.controller'; // <-- IMPORT
import { AuthModule } from '../auth/auth.module'; // <-- IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    AuthModule, // <-- THÊM VÀO
  ],
  controllers: [FollowController], // <-- THÊM VÀO
  providers: [FollowService], // <-- THÊM VÀO
  exports: [TypeOrmModule]
})
export class FollowModule {}