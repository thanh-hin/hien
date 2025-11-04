// music-backend/src/follow/follow.entity.ts
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    ManyToOne, 
    JoinColumn,
    Unique
} from 'typeorm';
import { User } from '../user/user.entity'; // Import User Entity

@Entity('follow')
@Unique(['followerId', 'followingId']) // Đảm bảo mỗi cặp User-Artist chỉ có 1 lần theo dõi
export class Follow {
    
    @PrimaryGeneratedColumn()
    id: number;

    // ===================================
    // 1. CỘT NGƯỜI THEO DÕI (FOLLOWER)
    // ===================================
    @Column({ name: 'follower_id' })
    followerId: number;

    @ManyToOne(() => User, user => user.following)
    @JoinColumn({ name: 'follower_id' })
    follower: User; // User đang theo dõi (người nghe/listener)

    // ===================================
    // 2. CỘT NGƯỜI ĐƯỢC THEO DÕI (FOLLOWING/ARTIST)
    // ===================================
    @Column({ name: 'following_id' })
    followingId: number;

    @ManyToOne(() => User, user => user.followers)
    @JoinColumn({ name: 'following_id' })
    following: User; // User được theo dõi (nghệ sĩ/artist)
    
    // ===================================
    // 3. CỘT TRẠNG THÁI (Active/Inactive)
    // ===================================
    // Dùng để soft-delete hoặc ẩn mối quan hệ theo dõi mà không cần xóa hàng.
    // 1 = Active, 0 = Inactive/Unfollowed
    @Column({ default: 1, type: 'tinyint' })
    active: number; 

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}