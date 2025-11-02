// music-frontend/src/pages/LikedSongsPage.jsx (BẢN SỬA LỖI KHÔNG PHÁT NHẠC)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLikedSongs } from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import './LikedSongsPage.css'; 
import { FaPlay, FaHeart } from 'react-icons/fa';

const LikedSongsPage = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const loadLikedSongs = async () => {
      setLoading(true);
      const data = await fetchLikedSongs(); // Gọi API
      
      // === SỬA LỖI LOGIC TẠI ĐÂY ===
      // Trích xuất và SỬA LỖI ĐƯỜNG DẪN file_url
      const songsOnly = data.map(item => {
          const song = item.song;
          if (song && song.file_url) {
              // Đảm bảo URL là tuyệt đối
              song.file_url = `http://localhost:3000${song.file_url.replace('/audio', '/media/audio')}`;
          }
          return song;
      }).filter(Boolean); // Lọc ra các bài hát
      // ============================
      
      setLikedSongs(songsOnly);
      setLoading(false);
    };

    loadLikedSongs();
  }, []);

  // Phát toàn bộ danh sách (bắt đầu từ bài đầu tiên)
  const playAllLiked = () => {
    if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs, 0); // (Track, Playlist, Index)
    }
  };

  if (loading) {
    return <div className="loading-message">Đang tải danh sách yêu thích...</div>;
  }

  return (
    <div className="liked-songs-container">
      {/* Header Trang (Màu Tím) */}
      <div className="playlist-header">
        <div className="playlist-cover-art">
          <FaHeart size={60} />
        </div>
        <div className="playlist-info">
          <p className="playlist-type">PLAYLIST</p>
          <h1>Bài hát đã thích</h1>
          <p className="playlist-owner">{user?.username} • {likedSongs.length} bài hát</p>
          <button className="playlist-play-button" onClick={playAllLiked}>
            <FaPlay size={20} /> PHÁT TẤT CẢ
          </button>
        </div>
      </div>

      {/* Danh sách bài hát */}
      <div className="song-list-detail">
        {likedSongs.length > 0 ? (
          likedSongs.map((song, index) => (
            <div key={song.id} className="song-row" onClick={() => playTrack(song, likedSongs, index)}>
              <div className="song-title-col">
                <span>{index + 1}.</span>
                <img src={song.album?.cover_url || '/images/default-album.png'} alt={song.title} />
                <div>
                  <p className="song-row-title">{song.title}</p>
                  <p className="song-row-artist">{song.artist?.stage_name}</p>
                </div>
              </div>
              <span className="song-album-col">{song.album?.title}</span>
              <FaHeart className="song-row-liked" /> 
            </div>
          ))
        ) : (
          <p className="subtle-text">Bạn chưa thích bài hát nào.</p>
        )}
      </div>
    </div>
  );
};

export default LikedSongsPage;