// music-backend/src/auth/auth.service.ts (FULL CODE - OTP READY)
import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto'; // <-- IMPORT DTO MỚI
import { MailerService } from '@nestjs-modules/mailer'; 
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private mailerService: MailerService, 
  ) {}

  /**
   * Hàm REGISTER: Tạo User (active=false), Tạo OTP và Gửi email.
   */
  async register(registerAuthDto: RegisterAuthDto): Promise<Omit<User, 'password'>> {
    const { username, email, password, gender, birth_year } = registerAuthDto;

    const existingUser = await this.userRepository.findOne({ where: [{ username }, { email }] });
    if (existingUser) throw new ConflictException('Username or Email already exists');

    const listenerRole = await this.roleRepository.findOne({ where: { name: 'listener' } });
    if (!listenerRole) throw new InternalServerErrorException("Default role 'listener' not found");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // === TẠO OTP VÀ THỜI GIAN HẾT HẠN ===
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 số
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5); // Hết hạn sau 5 phút
    // ======================================

    const user = this.userRepository.create({
      username, email, password: hashedPassword, role: listenerRole!,
      active: false, 
      verification_token: otpCode, // <-- LƯU MÃ OTP
      otp_expiry: expiryTime,      // <-- LƯU THỜI GIAN HẾT HẠN
      gender: gender, birth_year: birth_year,
    });

    try {
      const savedUser = await this.userRepository.save(user); 
      
      // GỬI EMAIL CHỨA MÃ OTP
      try {
        await this.mailerService.sendMail({
          to: savedUser.email,
          subject: 'Mã xác nhận Lame Music',
          html: `<p>Mã xác nhận (OTP) của bạn là:</p> <h1>${otpCode}</h1> <p>Mã này sẽ hết hạn sau 5 phút.</p>`,
        });
      } catch (mailError) {
          console.error("LỖI GỬI MAIL SMTP (Kiểm tra App Password!):", mailError);
      }

      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user due to database error.');
    }
  }

  /**
   * Hàm LOGIN: (Logic cũ giữ nguyên)
   */
  async login(loginAuthDto: LoginAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository
      .createQueryBuilder('user') 
      .leftJoinAndSelect('user.role', 'role') 
      .addSelect('user.password') 
      .where('user.email = :email', { email }) 
      .getOne(); 

    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    // NẾU USER CHƯA ACTIVE
    if (!user.active) {
        throw new UnauthorizedException('Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để nhận mã OTP.');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const payload = { userId: user.id, username: user.username, role: user.role.name };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  /**
   * Hàm CONFIRM: Xác thực OTP và kích hoạt tài khoản.
   */
  async verifyOtp(email: string, otpCode: string): Promise<User> {
    // 1. Tìm User (cần lấy cả token và thời gian hết hạn)
    const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect(['user.verification_token', 'user.otp_expiry']) 
        .where('user.email = :email', { email })
        .getOne();

    if (!user || user.active) {
      throw new NotFoundException('Tài khoản không tồn tại hoặc đã được kích hoạt.');
    }
    
    // 2. Kiểm tra Mã OTP
    if (user.verification_token !== otpCode) {
      throw new UnauthorizedException('Mã xác nhận không đúng.');
    }
    
    // 3. Kiểm tra Thời gian hết hạn
    if (user.otp_expiry && new Date() > user.otp_expiry) {
      // Xóa OTP hết hạn để user có thể yêu cầu gửi lại
      user.verification_token = null; 
      user.otp_expiry = null;
      await this.userRepository.save(user);
      throw new UnauthorizedException('Mã xác nhận đã hết hạn. Vui lòng đăng ký lại.');
    }
    
    // 4. Kích hoạt tài khoản và xóa thông tin OTP
    user.active = true;
    user.verification_token = null; 
    user.otp_expiry = null;

    return this.userRepository.save(user);
  }
}