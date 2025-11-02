// music-backend/src/auth/auth.module.ts (CODE ĐÃ SỬA LỖI MAILER DEPENDENCY)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; 
import { MailerModule } from '@nestjs-modules/mailer'; // <-- (1) IMPORT MAILER

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; 
import { RoleModule } from '../role/role.module'; 
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { JwtStrategy } from './jwt.strategy'; 
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    UserModule, 
    RoleModule, 
    TypeOrmModule.forFeature([User, Role]),

    SharedModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [JwtModule, PassportModule], 
})
export class AuthModule {}