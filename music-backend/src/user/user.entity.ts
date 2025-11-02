// music-backend/src/user/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToOne, 
  JoinColumn 
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Artist } from '../artist/artist.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  // === DÒNG GÂY LỖI NẰM Ở ĐÂY ===
  @Column({ type: 'varchar', length: 255, select: false }) // 'select: false' giấu password
  password: string;
  // =============================

  @Column({ type: 'boolean', default: false })
  active: boolean;

  // === CỘT MỚI: DÙNG CHO MÃ OTP ===
  @Column({ type: 'varchar', length: 255, nullable: true, select: false }) 
  verification_token: string | null; // <-- Tên cột giữ nguyên, nhưng giờ lưu OTP 6 ký tự

  @Column({ type: 'datetime', nullable: true, select: false }) // <-- CỘT MỚI
  otp_expiry: Date | null; // Lưu thời gian hết hạn của OTP (ví dụ: 5 phút sau khi gửi)
  // =================================

  // ... (gender, birth_year) ...
  @Column({ 
    type: 'enum', 
    enum: ['male', 'female', 'other', 'prefer not to say'],
    default: 'prefer not to say' 
  })
  gender: 'male' | 'female' | 'other' | 'prefer not to say';

  @Column({ type: 'year', nullable: true })
  birth_year: number | null;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Role, (role) => role.users, { eager: true }) 
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

}