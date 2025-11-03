// music-frontend/src/pages/ArtistDetail.jsx (BẢN SỬA LỖI FINAL)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api'; // <-- (1) IMPORT 'api' (CÓ INTERCEPTOR)
import './ArtistDetail.css'; 
import { FaPlay, FaHeart } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext'; 

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hàm tính tuổi an toàn
  const calculateAge = (birthYear) => {
    if (!birthYear) return 'Không rõ';
    const year = parseInt(birthYear);
    if (isNaN(year)) return 'Không rõ';
    return new Date().getFullYear() - year;
  };

  // === CHỈ DÙNG 1 useEffect ĐỂ TẢI DATA ===
  useEffect(() => {
    const loadArtist = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/artists/${id}`);
        const artistData = response.data;

        // === SỬA LỖI LINK ẢNH/NHẠC (LOGIC AN TOÀN) ===
        // Hàm helper để fix URL
        const fixUrl = (url, type = 'image') => {
            if (!url) { // Xử lý NULL
                return type === 'image' ? '/images/default-album.png' : '';
            }
            if (url.startsWith('http')) { // Nếu đã là URL tuyệt đối
                return url;
            }
            // Mặc định (ví dụ: /images/artist-1.jpg)
            const prefix = type === 'image' ? '/media/images' : '/media/audio';
            const originalPath = type === 'image' ? '/images' : '/audio';
            
            // Đảm bảo không thay thế 2 lần
            if (url.startsWith(prefix)) {
                return `http://localhost:3000${url}`;
            }
            
            return `http://localhost:3000${url.replace(originalPath, prefix)}`;
        };
        
        // 1. Sửa URL Ảnh đại diện (Avatar)
        artistData.avatar_url = fixUrl(artistData.avatar_url, 'image');

        // 2. Sửa URL cho các Album
        if (artistData.albums) {
            artistData.albums = artistData.albums.map(album => ({
                ...album,
                cover_url: fixUrl(album.cover_url, 'image')
            }));
        }

        // 3. Sửa URL cho các Bài hát
        if (artistData.songs) {
            artistData.songs = artistData.songs.map(song => {
                // Sửa ảnh riêng của bài hát (nếu có)
                const songImageUrl = song.image_url ? fixUrl(song.image_url, 'image') : null;
                
                return {
                    ...song,
                    file_url: fixUrl(song.file_url, 'audio'), // Fix file nhạc
                    image_url: songImageUrl // Gán ảnh đã fix
                };
            });
        }
        // ===================================

        setArtist(artistData);
      } catch (err) {
        console.error("Lỗi tải chi tiết nghệ sĩ:", err);
        setError('Không tìm thấy nghệ sĩ này.');
      } finally {
        setLoading(false);
      }
    };
    loadArtist();
  }, [id]); // Chỉ chạy khi 'id' thay đổi

  // MẢNG AN TOÀN (Đã có)
  const songs = artist?.songs || []; 
  const albums = artist?.albums || []; 

  // LOGIC "PHÁT TẤT CẢ" (Đã fix URL trong useEffect)
  const playArtistSongs = () => {
    if (songs.length > 0) { 
      // 'songs' ở đây đã chứa URL tuyệt đối đã fix
      playTrack(songs[0], songs, 0); 
    }
  };

  // Nút chuyển sang trang chi tiết bài hát
  const goToSongDetail = (songId) => {
      navigate(`/song/${songId}`);
  };

  if (loading) {
    return <div className="artist-detail-loading">Đang tải thông tin nghệ sĩ...</div>;
  }
  
  if (error || !artist) {
    return <div className="artist-detail-error">{error || 'Nghệ sĩ không tồn tại.'}</div>;
  }

  return (
    <div className="artist-detail-container">
      
      {/* HEADER NGHỆ SĨ */}
      <div className="artist-header">
        <img src={artist.avatar_url} alt={artist.stage_name} className="artist-avatar-large" />
        <div className="artist-info">
          <p className="artist-type">NGHỆ SĨ</p>
          <h1>{artist.stage_name}</h1>
          <p className="artist-stats">
            Tuổi: <strong>{calculateAge(artist.user?.birth_year)}</strong> • 
            Bài hát: <strong>{songs.length}</strong> • 
            Album: <strong>{albums.length}</strong>
          </p>
          <p className="artist-bio">{artist.bio || 'Chưa có thông tin giới thiệu.'}</p>

          <div className="artist-controls">
            <button className="artist-play-button" onClick={playArtistSongs}>
              <FaPlay size={20} /> PHÁT TẤT CẢ
            </button>
            <button className="icon-button follow-button"><FaHeart size={18} /> THEO DÕI</button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI HÁT */}
      <div className="artist-body-section">
        <h3>Bài hát nổi bật</h3>
        <div className="song-list-detail">
            {songs.length > 0 ? (
                songs.slice(0, 5).map((song, index) => (
                    <div key={song.id} className="song-row" onClick={() => goToSongDetail(song.id)}>
                        <div className="song-title-col">
                            <span>{index + 1}.</span>
                            {/* === SỬA LỖI CLASSNAME === */}
                            <img 
                                src={song.image_url || song.album?.cover_url} 
                                alt={song.title} 
                                // (Không cần class 'detail-album-cover' ở đây, 
                                // CSS của .song-title-col img sẽ lo)
                            />
                            <div>
                                <p className="song-row-title">{song.title}</p>
                                <p className="song-row-artist">{artist.stage_name}</p>
                            </div>
                        </div>
                        {/* === XÓA BỎ LƯỢT NGHE === */}
                        {/* <span className="song-play-count">{song.play_count?.toLocaleString() || 0}</span> */}
                    </div>
                ))
            ) : (
                <p className="subtle-text">Nghệ sĩ này chưa có bài hát nào.</p>
            )}
        </div>
      </div>

      {/* DANH SÁCH ALBUM */}
      <div className="artist-body-section">
        <h3>Album</h3>
        <div className="album-list-scroll">
            {albums.length > 0 ? (
                albums.map(album => (
                    <div key={album.id} className="album-card-small">
                        <img src={album.cover_url} alt={album.title} />
                        <div className="album-card-info">
                            <p className="album-title-small">{album.title}</p>
                            <p className="album-year-small">{new Date(album.release_date).getFullYear() || ''}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="subtle-text">Nghệ sĩ này chưa có album nào.</p>
            )}
        </div>
      </div>
      
    </div>
  );
};

export default ArtistDetail;