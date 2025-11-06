// music-frontend/src/context/PlayerContext.jsx (BẢN SỬA LỖI FINAL - DÙNG REF CỦA THƯ VIỆN)
import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { incrementPlayCountApi } from '../utils/api'; 

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]); 
    
    // === 1. REF CHỨA COMPONENT THƯ VIỆN VÀ CỜ ĐẾM ===
    const audioRef = useRef(null); // Ref component Player Bar
    const hasIncrementedRef = useRef(false); 
    // ======================================
    
    // Hàm Helper lấy Audio Element
    const getAudioElement = () => {
        // Cấu trúc của react-h5-audio-player: audioRef.current.audio.current
        return audioRef.current?.audio?.current; 
    };

    // === 2. HÀM XỬ LÝ LƯỢT NGHE (LISTENER) ===
    const handleTimeUpdate = useCallback(() => {
        const audio = getAudioElement();
        if (!audio || !currentTrack) return;

        // Nếu thời gian phát lớn hơn 2 giây VÀ chưa được đếm
        if (audio.currentTime >= 2 && !hasIncrementedRef.current) {
            incrementPlayCountApi(currentTrack.id);
            hasIncrementedRef.current = true;
            console.log(`[Play Count] Tăng lượt nghe cho Song ID: ${currentTrack.id} (2s rule)`);
            
            // Xóa listener (Không thể xóa listener trong useEffect, nên dùng cờ)
            // LƯU Ý: Thư viện này tự quản lý listeners, chúng ta chỉ cần flag.
        }
    }, [currentTrack]);
    // ===========================================
    
    const playTrack = useCallback((track, playlist = [], startIndex = 0) => {
        // Nếu chọn bài mới
        if (track.id !== currentTrack?.id || playlist.length > 0) {
            setCurrentTrack(track);
            if (playlist.length > 0) {
                setCurrentPlaylist(playlist);
            }
            setIsPlaying(true); 
        } else if (audioRef.current) {
            // Nếu là bài cũ, toggle play/pause
            const audio = getAudioElement();
            if (audio) {
                audio.paused ? audio.play() : audio.pause();
                setIsPlaying(!audio.paused);
            }
        }
    }, [currentTrack]); 

    const togglePlay = useCallback(() => {
        const audio = getAudioElement();
        if (audio && currentTrack) {
            audio.paused ? audio.play() : audio.pause();
            setIsPlaying(!audio.paused);
        }
    }, [currentTrack]);


    // === 3. HOOK QUẢN LÝ TỰ ĐỘNG PHÁT VÀ ĐẾM LƯỢT NGHE ===
    useEffect(() => {
        const audio = getAudioElement();
        
        // Gắn listener timeupdate cho Player Bar
        if (audio && currentTrack) {
            // Đảm bảo cờ đếm lượt nghe được reset khi track thay đổi
            hasIncrementedRef.current = false; 
            
            // Thư viện tự gọi play/pause, chúng ta chỉ cần gắn listener cho đếm lượt nghe
            const timeUpdateHandler = handleTimeUpdate;
            audio.addEventListener('timeupdate', timeUpdateHandler);

            return () => {
                // Cleanup
                audio.removeEventListener('timeupdate', timeUpdateHandler);
            };
        }
    }, [currentTrack, handleTimeUpdate]);
    // ======================================================


    const playNext = useCallback(() => {
        // ... (logic chuyển bài next giữ nguyên) ...
        if (!currentTrack || currentPlaylist.length === 0) return;
        const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % currentPlaylist.length; 
        if (currentPlaylist[nextIndex]) {
             playTrack(currentPlaylist[nextIndex]);
        }
    }, [currentPlaylist, currentTrack, playTrack]);

    const playPrevious = useCallback(() => {
        // ... (logic chuyển bài previous giữ nguyên) ...
        if (!currentTrack || currentPlaylist.length === 0) return;
        const currentIndex = currentPlaylist.findIndex(t => t.id === currentTrack.id);
        const previousIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
        if (currentPlaylist[previousIndex]) {
            playTrack(currentPlaylist[previousIndex]);
        }
    }, [currentPlaylist, currentTrack, playTrack]);
    
    // EXPORT audioRef để PlayerBar có thể gắn ref vào AudioPlayer
    const contextValue = {
        currentTrack, isPlaying, playTrack, togglePlay,
        audioRef, // <-- ĐÂY LÀ CHÌA KHÓA
        currentPlaylist, playNext, playPrevious    
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