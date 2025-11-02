// music-backend/src/lyrics/lyrics.entity.ts
import { 
  Entity, PrimaryGeneratedColumn, Column, 
  CreateDateColumn, UpdateDateColumn, 
  OneToOne, JoinColumn 
} from 'typeorm';
import { Song } from '../song/song.entity';

@Entity('Lyrics')
export class Lyrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  song_id: number; 

  @Column({ type: 'text' })
  lyrics: string;

  @Column({ type: 'varchar', length: 10, default: 'vi' })
  language: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Song, (song) => song.lyrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'song_id' }) 
  song: Song;
}