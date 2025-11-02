// music-backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// === ĐỊNH NGHĨA PAYLOAD (RẤT QUAN TRỌNG) ===
export interface JwtPayload {
  userId: number;
  username: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // PHẢI KHỚP VỚI AuthModule
    });
  }

  // Hàm này giải mã token và trả về payload
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload; 
  }
}