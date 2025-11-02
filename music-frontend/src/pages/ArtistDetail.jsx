// music-frontend/src/pages/ArtistDetail.jsx (FULL CODE FINAL)
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

  useEffect(() => {
    const loadArtist = async () => {
      setLoading(true);
      setError('');
      try {
        // (2) SỬ DỤNG 'api.get' THAY VÌ 'axios.get'
        const response = await api.get(`/artists/${id}`);
        setArtist(response.data);
      } catch (err) {
        console.error("Lỗi tải chi tiết nghệ sĩ:", err);
        setError('Không tìm thấy nghệ sĩ này.');
      } finally {
        setLoading(false);
      }
    };
    loadArtist();
  }, [id]); // Bỏ 'navigate' khỏi dependency

  // (3) MẢNG AN TOÀN (Đã có)
  const songs = artist?.songs || []; 
  const albums = artist?.albums || []; 

  // (4) SỬA LOGIC "PHÁT TẤT CẢ" (Gửi cả playlist)
  const playArtistSongs = () => {
    if (songs.length > 0) { 
      // Sửa đường dẫn file_url cho toàn bộ playlist
      const playlistWithUrls = songs.map(song => ({
          ...song,
          file_url: `http://localhost:3000${song.file_url.replace('/audio', '/media/audio')}`
      }));
      playTrack(playlistWithUrls[0], playlistWithUrls, 0); 
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
        <img src={artist.avatar_url || '/images/default-artist.png'} alt={artist.stage_name} className="artist-avatar-large" />
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
                            <img src={song.album?.cover_url || '/images/default-album.png'} alt={song.title} />
                            <div>
                                <p className="song-row-title">{song.title}</p>
                                <p className="song-row-artist">{artist.stage_name}</p>
                            </div>
                        </div>
                        <span className="song-play-count">{song.play_count?.toLocaleString() || 0}</span>
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
                        <img src={album.cover_url || '/images/default-album.png'} alt={album.title} />
                        <p className="album-title-small">{album.title}</p>
                        <p className="album-year-small">{new Date(album.release_date).getFullYear() || ''}</p>
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