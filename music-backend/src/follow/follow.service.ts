// music-backend/src/follow/follow.service.ts (TẠO MỚI)
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  /**
   * Logic: Follow hoặc Unfollow một nghệ sĩ
   * (userId = người đang đăng nhập, artistId = người họ muốn follow)
   */
  async toggleFollow(userId: number, artistId: number): Promise<{ isFollowing: boolean }> {
    if (userId === artistId) {
      throw new BadRequestException('Bạn không thể tự theo dõi chính mình.');
    }

    // 1. Kiểm tra xem đã theo dõi chưa (kể cả đã unfollow - active=0)
    const existingFollow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: artistId,
      },
    });

    if (existingFollow) {
      // Đã tồn tại -> Đảo ngược trạng thái
      if (existingFollow.active === 1) {
        // Đang Follow -> Unfollow
        existingFollow.active = 0;
        await this.followRepository.save(existingFollow);
        return { isFollowing: false };
      } else {
        // Đang Unfollow (active=0) -> Follow lại
        existingFollow.active = 1;
        await this.followRepository.save(existingFollow);
        return { isFollowing: true };
      }
    } else {
      // Chưa tồn tại -> Tạo mới (Follow)
      const newFollow = this.followRepository.create({
        followerId: userId,
        followingId: artistId,
        active: 1, // Mặc định là đang theo dõi
      });
      await this.followRepository.save(newFollow);
      return { isFollowing: true };
    }
  }

  /**
   * === HÀM MỚI: Kiểm tra trạng thái Follow (cho trang Artist Detail) ===
   */
  async checkFollowStatus(userId: number, artistId: number): Promise<{ isFollowing: boolean }> {
    if (!userId) return { isFollowing: false };

    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: artistId,
        active: 1, // Chỉ quan tâm nếu đang active follow
      },
    });

    return { isFollowing: !!follow }; // Trả về true nếu tìm thấy, false nếu không
  }

  /**
   * === HÀM MỚI: Lấy danh sách user đang theo dõi (cho trang Profile) ===
   */
  async findMyFollowing(userId: number): Promise<Follow[]> {
    // Tìm tất cả các 'Follow' MÀ 'followerId' (người theo dõi) là 'userId'
    return this.followRepository.find({
      where: {
        followerId: userId,
        active: 1, // Chỉ lấy những người đang theo dõi (không phải đã unfollow)
      },
      // QUAN TRỌNG: Lấy thông tin của người 'được' theo dõi
      relations: [
        'following', // <-- Lấy User (người được theo dõi)
        'following.artist' // <-- Lấy Artist (profile của user đó)
      ],
      order: { createdAt: 'DESC' } // Mới nhất lên đầu
    });
  }
}