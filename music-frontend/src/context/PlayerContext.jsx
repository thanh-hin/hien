// music-frontend/src/context/PlayerContext.jsx (BẢN NÂNG CẤP PLAYLIST)
import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // === STATE MỚI: DANH SÁCH PHÁT HIỆN TẠI ===
  const [currentPlaylist, setCurrentPlaylist] = useState([]); 
  // ===========================================
  
  const audioRef = useRef(null); 

  // (1) HÀM playTrack ĐƯỢC NÂNG CẤP
  const playTrack = useCallback((track, playlist = [], startIndex = 0) => {
    // Nếu có playlist (ví dụ: khi nhấn "Phát tất cả")
    if (playlist.length > 0) {
        setCurrentPlaylist(playlist); // Lưu lại cả danh sách
        setCurrentTrack(playlist[startIndex]); // Phát bài được chọn
    } else {
        // Nếu chỉ phát 1 bài (ví dụ: click ở Home)
        setCurrentTrack(track);
        setCurrentPlaylist([track]); // Playlist chỉ có 1 bài
    }
    setIsPlaying(true);
  }, []); 

  // === (2) HÀM NEXT/PREVIOUS MỚI ===
  const playNext = useCallback(() => {
    if (currentPlaylist.length === 0) return;

    const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack?.id);
    // Tính index tiếp theo, quay về 0 nếu hết
    const nextIndex = (currentIndex + 1) % currentPlaylist.length; 

    if (currentPlaylist[nextIndex]) {
        setCurrentTrack(currentPlaylist[nextIndex]);
        setIsPlaying(true); 
    }
  }, [currentPlaylist, currentTrack]);

  const playPrevious = useCallback(() => {
    if (currentPlaylist.length === 0) return;

    const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack?.id);
    // Tính index trước đó, quay về cuối nếu đang ở 0
    const previousIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;

    if (currentPlaylist[previousIndex]) {
        setCurrentTrack(currentPlaylist[previousIndex]);
        setIsPlaying(true);
    }
  }, [currentPlaylist, currentTrack]);
  // =============================

  const contextValue = {
    currentTrack,
    isPlaying,
    playTrack,
    setIsPlaying,
    audioRef, 
    currentPlaylist, // <-- CHIA SẺ
    playNext,       // <-- CHIA SẺ
    playPrevious    // <-- CHIA SẺ
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};