// music-backend/src/user/user.module.ts (BẢN SỬA LỖI FINAL)
import { Module, forwardRef } from '@nestjs/common'; // <-- (1) IMPORT forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module'; // <-- (2) IMPORT AUTHMODULE

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // (3) SỬ DỤNG forwardRef ĐỂ TRÁNH VÒNG LẶP
    forwardRef(() => AuthModule), 
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], 
})
export class UserModule {}