// music-frontend/src/components/PlayerBar.jsx (BẢN SỬA LỖI ẢNH BÀI HÁT)
import React, { useEffect } from 'react'; 
import { usePlayer } from '../context/PlayerContext';
import AudioPlayer from 'react-h5-audio-player'; 
import 'react-h5-audio-player/lib/styles.css'; 
import './PlayerBar.css'; 

import { 
  IoPlaySkipBackSharp, 
  IoPlaySkipForwardSharp, 
  IoPlaySharp, 
  IoPauseSharp 
} from 'react-icons/io5';
import { HiVolumeUp } from 'react-icons/hi';

const PlayerBar = () => {
  // LẤY audioRef TỪ CONTEXT
  const { 
    currentTrack, isPlaying, setIsPlaying, audioRef, 
    currentPlaylist, playNext, playPrevious 
  } = usePlayer(); 

  // LOGIC ĐIỀU KHIỂN PLAYER TỪ CONTEXT
  useEffect(() => {
    if (audioRef.current && audioRef.current.audio.current) {
      const audio = audioRef.current.audio.current;
      
      // KIỂM TRA QUAN TRỌNG: Nếu src đã được cập nhật
      if (currentTrack?.file_url && audio.src !== currentTrack.file_url) {
        audio.load(); 
      }
      
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack, audioRef]); 

  const isReady = !!currentTrack; 

  const customIcons = {
    play: <IoPlaySharp size={24} />,
    pause: <IoPauseSharp size={24} />,
    previous: <IoPlaySkipBackSharp size={22} />,
    next: <IoPlaySkipForwardSharp size={22} />,
  };

  // Xử lý khi bài hát kết thúc
  const handleNextOnEnd = () => {
    if (currentPlaylist.length > 1) { 
        playNext();
    } else {
        setIsPlaying(false);
    }
  };

  // Nút Next/Previous trên Player Bar
  const handleNextClick = () => {
    if (currentPlaylist.length > 0) playNext();
  };
  const handlePreviousClick = () => {
    if (currentPlaylist.length > 0) playPrevious();
  };

  return (
    <div className={`player-bar-container ${!isReady ? 'empty' : ''}`}>
      {/* 1. Thông tin bài hát */}
      <div className="player-track-info">
        {isReady ? (
          <>
            {/* === SỬA LỖI LOGIC ẢNH TẠI ĐÂY === */}
            <img 
              src={currentTrack.image_url || currentTrack.album?.cover_url || '/images/default-album.png'} 
              alt={currentTrack.title} 
            />
            {/* ================================== */}
            <div>
              <p className="title">{currentTrack.title}</p>
              <p className="artist">{currentTrack.artist?.stage_name || 'Nghệ sĩ'}</p>
            </div>
          </>
        ) : (
          <p className="waiting-text">Chọn một bài hát để bắt đầu nghe.</p>
        )}
      </div>
      
      {/* 2. Trình phát nhạc */}
      {isReady && (
        <AudioPlayer
          ref={audioRef} 
          className="audio-player-core"
          src={currentTrack.file_url} // URL nhạc đã được fix ở (Home.jsx/SongDetail.jsx)
          showSkipControls={true} 
          showJumpControls={false} 
          customIcons={customIcons} 
          onPlay={() => setIsPlaying(true)} 
          onPause={() => setIsPlaying(false)} 
          onEnded={handleNextOnEnd} 
          onClickNext={handleNextClick} 
          onClickPrevious={handlePreviousClick} 
        />
      )}
      
      {/* 3. Điều khiển Âm lượng */}
      {isReady && (
        <div className="player-volume-controls">
          <HiVolumeUp size={24} /> 
        </div>
      )}
    </div>
  );
};

export default PlayerBar;