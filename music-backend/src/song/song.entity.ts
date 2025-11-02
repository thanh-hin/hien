// src/song/song.entity.ts
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
import { Album } from '../album/album.entity';
import { Artist } from '../artist/artist.entity';
import { Lyrics } from '../lyrics/lyrics.entity';

@Entity('Song') // Ánh xạ với bảng 'Song'
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  duration: number; // Đơn vị: giây

  @Column({ type: 'varchar', length: 255 })
  file_url: string;

  @Column({ type: 'bigint', default: 0 })
  play_count: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Quan hệ: Nhiều Song thuộc 1 Album (Album có thể null)
  @ManyToOne(() => Album, (album) => album.songs, { 
    nullable: true, 
    onDelete: 'SET NULL' 
  })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  // Quan hệ: Nhiều Song thuộc 1 Artist
  @ManyToOne(() => Artist, (artist) => artist.songs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  // Quan hệ: Một Song có một Lyrics (1-1)
  @OneToOne(() => Lyrics, (lyrics) => lyrics.song)
  lyrics: Lyrics;
}