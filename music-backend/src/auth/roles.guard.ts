// music-backend/src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtPayload } from './jwt.strategy'; // Import JwtPayload

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy role yêu cầu (từ @Roles decorator)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Nếu API không yêu cầu role, cho phép
    }
    
    // 2. Lấy user từ request (đã được AuthGuard giải mã)
    const { user } = context.switchToHttp().getRequest();
    const payload = user as JwtPayload; // ép kiểu user

    // 3. Kiểm tra xem role của user có nằm trong danh sách yêu cầu không
    return requiredRoles.some((role) => payload.role === role);
  }
}