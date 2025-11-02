// music-backend/src/like/user-liked-songs.entity.ts (BẢN SỬA LỖI FINAL)
import { Entity, ManyToOne, PrimaryColumn, JoinColumn, CreateDateColumn } from 'typeorm'; // <-- (1) THÊM CreateDateColumn
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';

@Entity('UserLikedSongs')
export class UserLikedSongs {
    
    @PrimaryColumn({ name: 'user_id' }) 
    user_id: number; 

    @PrimaryColumn({ name: 'song_id' }) 
    song_id: number; 

    // === (2) THÊM CỘT BỊ THIẾU ===
    // Dùng @CreateDateColumn để nó tự động điền ngày giờ khi Like
    @CreateDateColumn({ name: 'liked_at' })
    liked_at: Date;
    // ===========================

    // QUAN HỆ VỚI USER
    @ManyToOne(() => User, (user) => user.likedSongs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' }) 
    user: User; 

    // QUAN HỆ VỚI SONG
    @ManyToOne(() => Song, (song) => song.likedByUsers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'song_id' }) 
    song: Song; 
}