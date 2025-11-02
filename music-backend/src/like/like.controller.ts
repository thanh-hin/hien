// music-backend/src/like/like.controller.ts (FULL CODE)
import { Controller, Post, Param, ParseIntPipe, UseGuards, Req, Get } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../auth/jwt.strategy';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard'; 

@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    /**
     * === API MỚI: Lấy danh sách bài hát đã thích ===
     * GET /like/my-songs
     */
    @Get('my-songs')
    @UseGuards(AuthGuard('jwt')) // Bắt buộc đăng nhập
    async getMyLikedSongs(@Req() req: any) {
        const userId = (req.user as JwtPayload).userId;
        // Dữ liệu trả về sẽ là: [ { user_id, song_id, liked_at, song: {...} }, ... ]
        return this.likeService.findUserLikedSongs(userId);
    }

    /**
     * POST /like/:songId - Bật/Tắt trạng thái Like (Cần đăng nhập)
     */
    @Post(':songId') 
    @UseGuards(AuthGuard('jwt')) 
    async toggleLike(
        @Param('songId', ParseIntPipe) songId: number,
        @Req() req: any,
    ): Promise<{ isLiked: boolean }> {
        const userId = (req.user as JwtPayload).userId; 
        const isLiked = await this.likeService.toggleLike(userId, songId);
        return { isLiked };
    }

    /**
     * GET /like/:songId/status - Lấy trạng thái Like (Guest có thể xem)
     */
    @Get(':songId/status')
    @UseGuards(OptionalJwtAuthGuard) 
    async getLikeStatus(
        @Param('songId', ParseIntPipe) songId: number,
        @Req() req: any,
    ): Promise<{ isLiked: boolean }> {
        const user = (req.user as JwtPayload | null);
        
        if (!user) {
            return { isLiked: false }; 
        }
        
        const isLiked = await this.likeService.isLiked(user.userId, songId);
        return { isLiked };
    }
}