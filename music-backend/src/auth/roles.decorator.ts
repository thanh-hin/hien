// music-backend/src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; 
// Decorator này cho phép bạn "đánh dấu" API cần role gì
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);