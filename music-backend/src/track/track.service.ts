// src/track/track.service.ts
import { Injectable } from '@nestjs/common';

// Định nghĩa kiểu dữ liệu cho bài hát (TypeScript)
export interface Track {
  id: number;
  title: string;
  artist: string;
  // Đây là đường dẫn đến file audio, bạn cần đặt file này trong thư mục public của Frontend
  audioSrc: string; 
  image: string; // Ảnh album
}

@Injectable()
export class TrackService {
  // Dữ liệu giả lập
  private readonly tracks: Track[] = [
    {
      id: 1,
      title: 'Bài Hát Đầu Tiên',
      artist: 'Nghệ Sĩ A',
      audioSrc: '/audio/track1.mp3', // Đường dẫn này sẽ được React hiểu
      image: '/images/album1.jpg',
    },
    {
      id: 2,
      title: 'Vũ Điệu Cuối Cùng',
      artist: 'Nghệ Sĩ B',
      audioSrc: '/audio/track2.mp3',
      image: '/images/album2.jpg',
    },
  ];

  // Hàm trả về tất cả bài hát
  findAll(): Track[] {
    return this.tracks;
  }

  // (Bạn có thể thêm hàm findOne(id) sau)
}