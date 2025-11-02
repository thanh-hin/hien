// music-backend/src/auth/optional-jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  
  // Ghi đè phương thức handleRequest
  handleRequest(err, user, info) {
    // Phương thức này được gọi sau khi 'jwt.strategy.ts' chạy
    
    // Bất kể lỗi (err) hay thông tin (info) là gì,
    // (ví dụ: Token hết hạn, không có Token)
    // chúng ta KHÔNG NÉM LỖI (KHÔNG throw error).
    
    // Chỉ trả về 'user' nếu xác thực thành công (có Token hợp lệ)
    // hoặc trả về 'null' nếu thất bại (là khách)
    return user || null;
  }
}