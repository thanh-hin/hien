// music-frontend/src/pages/SongDetail.jsx (FULL CODE FINAL)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api'; // Dùng API instance đã có token
import { usePlayer } from '../context/PlayerContext'; 
import './SongDetail.css'; 
import { FaPlay, FaHeart, FaPause, FaEllipsisV, FaRedo } from 'react-icons/fa'; 
import { useAuth } from '../context/AuthContext'; 

const SongDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, setIsPlaying, audioRef } = usePlayer();
  const { isAuthenticated } = useAuth(); 
  
  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [loadingLyrics, setLoadingLyrics] = useState(true); 
  const [isLiked, setIsLiked] = useState(false); // <-- STATE TRẠNG THÁI LIKE
  const [error, setError] = useState(''); 

  // Tải Data & Trạng thái Like
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadingLyrics(true);
      setError(''); 
      try {
        const [songRes, lyricsRes] = await Promise.all([
          api.get(`/song/${id}`), 
          api.get(`/song/${id}/lyrics`).catch(err => {
            if (err.response && err.response.status === 404) return { data: { lyrics: 'Không tìm thấy lời bài hát.' } };
            return null;
          }) 
        ]);
        
        if (songRes.data) {
            const songData = songRes.data;
            
            // LOGIC SỬA ĐƯỜNG DẪN TUYỆT ĐỐI
            let url = songData.file_url;
            
            if (url.startsWith('/audio/')) {
                // Thay thế đường dẫn cũ (/audio) bằng đường dẫn mới (/media/audio)
                url = url.replace('/audio', '/media/audio');
            }
            
            // Gán URL tuyệt đối cho Player
            songData.file_url = `http://localhost:3000${url}`; 
            
            setSong(songData);
        } else {
            throw new Error('Không tìm thấy bài hát');
        }
        
        // TẢI TRẠNG THÁI LIKE
        if (isAuthenticated) {
            const likeStatus = await api.get(`/like/${id}/status`);
            setIsLiked(likeStatus.data.isLiked);
        } else {
            setIsLiked(false);
        }

        // Tải Lyrics
        setLyrics(lyricsRes && lyricsRes.data.lyrics ? lyricsRes.data.lyrics : 'Không tìm thấy lời bài hát.');
        setLoadingLyrics(false);
        
      } catch (err) {
        console.error("Lỗi tải chi tiết bài hát:", err);
        setError('Không thể tìm thấy bài hát bạn yêu cầu.'); 
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isAuthenticated, navigate, playTrack]); 

  // KÍCH HOẠT PHÁT NHẠC
  useEffect(() => {
    if (song && (!currentTrack || currentTrack.id !== song.id)) {
      playTrack(song);
    }
  }, [song, playTrack, currentTrack]); 

  
  const isThisSongPlaying = currentTrack?.id === song?.id && isPlaying;
  const handlePlayPause = () => { if (isThisSongPlaying) { setIsPlaying(false); } else { playTrack(song); } };
  const handleReplay = () => { if (audioRef.current && audioRef.current.audio.current) { audioRef.current.audio.current.currentTime = 0; if (!isPlaying) { playTrack(song); } } };


  // HÀM XỬ LÝ NÚT LIKE (TẠO API POST)
  const handleLike = async () => {
    if (!isAuthenticated) {
        alert('Vui lòng đăng nhập để thích bài hát này.');
        navigate('/login');
        return;
    }
    
    try {
        const response = await api.post(`/like/${song.id}`);
        setIsLiked(response.data.isLiked); 
    } catch (error) {
        console.error("Lỗi khi toggle like:", error);
        if (error.response && error.response.status === 401) {
             alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
        }
    }
  };


  if (loading || error) {
    return <div className="song-detail-error">{error || 'Đang tải...'}</div>;
  }
  
  if (!song) return null;
  
  return (
    <div className="song-detail-container">
      {/* Nền Gradient */}
      <div className="song-detail-gradient-bg" style={{ background: 'var(--color-surface)' }}></div>

      <div className="song-detail-header">
        <img src={song.album?.cover_url || '/images/default-album.png'} alt={song.title} className="detail-album-cover" />
        
        <div className="song-info">
          <p className="song-type">BÀI HÁT</p>
          <h1>{song.title}</h1>
          <p className="song-artist-info">
            <span className="artist-name">{song.artist?.stage_name}</span> • 
            <span>{song.album?.title}</span>
          </p>

          <div className="detail-controls">
            <button className="detail-play-button" onClick={handlePlayPause}>
               {isThisSongPlaying ? <FaPause size={20} /> : <FaPlay size={20} />} 
               {isThisSongPlaying ? 'TẠM DỪNG' : 'PHÁT'}
            </button>
            
            <button className="icon-button" onClick={handleReplay}>
               <FaRedo size={20} /> PHÁT LẠI
            </button>
            
            {/* NÚT LIKE ĐÃ KẾT NỐI */}
            <button 
              className={`icon-button ${isLiked ? 'liked' : ''}`} 
              onClick={handleLike}
            >
              <FaHeart size={20} />
            </button> 
            <button className="icon-button"><FaEllipsisV size={20} /></button>
          </div>
        </div>
      </div>
      
      {/* Body (Lyrics, Related) */}
      <div className="song-detail-body">
        <div className="lyrics-section">
            <h3>Lời bài hát</h3>
            {loadingLyrics ? (
                <p className="lyrics-content">Đang tải lời...</p>
            ) : (
                <p className="lyrics-content">{lyrics}</p>
            )}
        </div>
        
        {/* <div className="related-section">
            <h3>Ca khúc cùng thể loại</h3>
            <p className="subtle-text">Hoàn thành tính năng Upload và Album để mở khóa gợi ý này!</p>
        </div> */}
      </div>
    </div>
  );
};

export default SongDetail;