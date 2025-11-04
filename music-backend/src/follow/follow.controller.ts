// music-backend/src/follow/follow.controller.ts (TẠO MỚI)
import { Controller, Post, Get, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../auth/jwt.strategy';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  /**
   * API: POST /follow/:artistId
   * (API này xử lý cả Follow và Unfollow)
   */
  @UseGuards(AuthGuard('jwt')) // Bắt buộc đăng nhập
  @Post(':artistId')
  async toggleFollow(
    @Req() req: any,
    @Param('artistId', ParseIntPipe) artistId: number,
  ) {
    const userId = (req.user as JwtPayload).userId;
    return this.followService.toggleFollow(userId, artistId);
  }

  /**
   * API: GET /follow/status/:artistId
   * (Kiểm tra xem user hiện tại có đang follow nghệ sĩ này không)
   */
  @UseGuards(AuthGuard('jwt')) // Bắt buộc đăng nhập
  @Get('status/:artistId')
  async checkStatus(
    @Req() req: any,
    @Param('artistId', ParseIntPipe) artistId: number,
  ) {
    const userId = (req.user as JwtPayload).userId;
    return this.followService.checkFollowStatus(userId, artistId);
  }

  /**
   * === API MỚI: Lấy danh sách đang theo dõi ===
   * GET /follow/my-following
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('my-following')
  async getMyFollowing(@Req() req: any) {
    const userId = (req.user as JwtPayload).userId;
    return this.followService.findMyFollowing(userId);
  }
}