// music-backend/src/user/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToOne, 
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Artist } from '../artist/artist.entity';
import { UserLikedSongs } from '../like/user-liked-songs.entity'; // <-- THÊM DÒNG NÀY

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

  // === SỬA DÒNG NÀY ===
  @Column({ type: 'tinyint', default: 2 }) // Sử dụng 'tinyint' hoặc 'int' cho các giá trị 0, 1, 2
  active: number; // <-- Đổi kiểu thành number

  // === CỘT MỚI: DÙNG CHO MÃ OTP ===
// === THÊM name: 'verification_token' ===
  @Column({ type: 'varchar', length: 255, nullable: true, select: false, name: 'verification_token' }) 
  verification_token: string | null; 

  // === THÊM name: 'otp_expiry' ===
  @Column({ type: 'datetime', nullable: true, select: false, name: 'otp_expiry' }) 
  otp_expiry: Date | null;
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

  @OneToMany(() => UserLikedSongs, (likedSong) => likedSong.user)
  likedSongs: UserLikedSongs[]; // <-- THÊM DÒNG NÀY
}