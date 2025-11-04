// music-backend/src/user/user.controller.ts (FULL CODE)
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../auth/jwt.strategy';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { Controller, Get, Patch, Body, UseGuards, Req, ValidationPipe, Param } from '@nestjs/common';

@Controller('users') // <-- TIỀN TỐ LÀ /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * API MỚI: Lấy thông tin user hiện tại (đã đăng nhập)
   * GET /users/me
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me') // <-- ENDPOINT LÀ /me
  async getMyProfile(@Req() req: any) {
    const userId = (req.user as JwtPayload).userId;
    return this.userService.findById(userId);
  }

  /**
   * API MỚI: Cập nhật thông tin user hiện tại
   * PATCH /users/me
   */
  @UseGuards(AuthGuard('jwt'))
  @Patch('me') // <-- ENDPOINT LÀ /me
  async updateMyProfile(
    @Req() req: any, 
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    const userId = (req.user as JwtPayload).userId;
    return this.userService.updateProfile(userId, updateUserDto);
  }

  /**
   * API MỚI: Lấy thông tin CÔNG KHAI của user
   * GET /users/public/:username
   */
  @Get('public/:username') // <-- ENDPOINT MỚI
  async getPublicProfile(@Param('username') username: string) {
    // Gọi hàm Service (cần được sửa ở file user.service.ts)
    return this.userService.findPublicProfileByUsername(username); 
  }
}