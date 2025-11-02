// music-backend/src/like/like.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLikedSongs } from './user-liked-songs.entity';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { AuthModule } from '../auth/auth.module'; // Cần AuthModule để dùng AuthGuard

@Module({
    imports: [
        TypeOrmModule.forFeature([UserLikedSongs]), // Đăng ký bảng trung gian
        AuthModule,
    ],
    providers: [LikeService],
    controllers: [LikeController],
    exports: [LikeService],
})
export class LikeModule {}