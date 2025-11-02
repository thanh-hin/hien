// music-frontend/src/components/PlayerBar.jsx (BẢN NÂNG CẤP NEXT/PREVIOUS)
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
  // (1) LẤY THÊM CÁC HÀM MỚI
  const { 
    currentTrack, isPlaying, setIsPlaying, audioRef, 
    currentPlaylist, playNext, playPrevious 
  } = usePlayer(); 

  // (useEffect điều khiển Play/Pause giữ nguyên)
  useEffect(() => {
    if (audioRef.current && audioRef.current.audio.current) {
      const audio = audioRef.current.audio.current;
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

  // (2) HÀM XỬ LÝ KHI BÀI HÁT KẾT THÚC
  const handleNextOnEnd = () => {
    if (currentPlaylist.length > 1) { // Chỉ next nếu playlist có nhiều hơn 1 bài
        playNext();
    } else {
        setIsPlaying(false);
    }
  };

  // (3) HÀM XỬ LÝ KHI CLICK NÚT NEXT/PREVIOUS TRÊN PLAYER
  const handleNextClick = () => {
    if (currentPlaylist.length > 0) playNext();
  };
  const handlePreviousClick = () => {
    if (currentPlaylist.length > 0) playPrevious();
  };

  return (
    <div className={`player-bar-container ${!isReady ? 'empty' : ''}`}>
      {/* ... (Thông tin bài hát giữ nguyên) ... */}
      {/* 1. Thông tin bài hát */}
      <div className="player-track-info">
        {isReady ? (
          <>
            <img 
              src={currentTrack.album?.cover_url || '/images/default-album.png'} 
              alt={currentTrack.title} 
            />
            <div>
              <p className="title">{currentTrack.title}</p>
              <p className="artist">{currentTrack.artist?.stage_name || 'Nghệ sĩ'}</p>
            </div>
          </>
        ) : (
          <p className="waiting-text">Chọn một bài hát để bắt đầu nghe.</p>
        )}
      </div>
      
      
      {isReady && (
        <AudioPlayer
          ref={audioRef} 
          className="audio-player-core"
          src={currentTrack.file_url} 
          showSkipControls={true} 
          showJumpControls={false} 
          customIcons={customIcons} 
          onPlay={() => setIsPlaying(true)} 
          onPause={() => setIsPlaying(false)} 
          
          // (4) GÁN CÁC HÀM MỚI VÀO PLAYER
          onEnded={handleNextOnEnd} 
          onClickNext={handleNextClick} 
          onClickPrevious={handlePreviousClick} 
        />
      )}
      
      {/* ... (Điều khiển Âm lượng giữ nguyên) ... */}
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