// music-frontend/src/components/AddToPlaylistModal.jsx (FULL CODE - SỬA LOGIC GỌI COMPONENT)
import React, { useState, useEffect } from 'react';
// (1) IMPORT ĐÚNG 3 HÀM TỪ API
import { fetchMyPlaylists, addSongToPlaylistApi, createPlaylistApi } from '../utils/api';
import './AddToPlaylistModal.css';
import { FaTimes, FaPlus } from 'react-icons/fa';
import CreatePlaylistModal from './CreatePlaylistModal'; // <-- (2) IMPORT MODAL TẠO MỚI

// (3) HÀM TOAST (NÊN TÁCH RA FILE RIÊNG SAU NÀY)
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 3000);
};


const AddToPlaylistModal = ({ songId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  // (4) STATE MỚI ĐỂ MỞ MODAL CON
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 

  // Load playlist
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        setLoading(true);
        const res = await fetchMyPlaylists();
        setPlaylists(res);
      } catch (err) {
        setError('Không thể tải playlist.');
      } finally {
        setLoading(false);
      }
    };
    loadPlaylists();
  }, []); // Chỉ chạy 1 lần khi mở

  // Thêm bài hát vào playlist (giữ nguyên)
  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addSongToPlaylistApi(playlistId, songId);
      showToast('✅ Đã thêm bài hát vào playlist!');
      onClose(); // Đóng modal cha
    } catch (err) {
      showToast(err.response?.data?.message || 'Thêm thất bại.', 'error');
    }
  };

  // (5) HÀM XỬ LÝ KHI MODAL CON TẠO XONG
  const handlePlaylistCreated = (newPlaylist) => {
      // Thêm playlist mới vào danh sách
      setPlaylists(prev => [newPlaylist, ...prev]); 
      // Đóng modal con
      setIsCreateModalOpen(false); 
      showToast('🎵 Playlist mới đã được tạo!');
  };

  // Lọc playlist (giữ nguyên)
  const filteredPlaylists = playlists.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <> {/* (Phải bọc trong Fragment) */}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
          <h2>Thêm vào Playlist</h2>

          {/* Ô tìm kiếm */}
          <input
            type="text"
            placeholder="Tìm kiếm playlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="playlist-search"
          />

          {/* (6) SỬA LỖI: NÚT TẠO MỚI (GỌI MODAL CON) */}
          <div className="create-playlist-row" onClick={() => setIsCreateModalOpen(true)}>
            <div className="create-playlist-icon-box">
              <FaPlus />
            </div>
            <span>Tạo playlist mới</span>
          </div>

        {error && <p className="modal-error">{error}</p>}
       <h3 className="playlist-section-title">Playlist của bạn</h3>
        
          {loading ? (
            <p style={{textAlign: 'center', color: 'var(--color-text-secondary)'}}>Đang tải...</p>
          ) : (
            <ul className="playlist-list">
              {filteredPlaylists.length > 0 ? (
                filteredPlaylists.map((playlist) => (
                  <li key={playlist.id} onClick={() => handleAddToPlaylist(playlist.id)}>
                    {playlist.name}
                  </li>
                ))
              ) : (
                <p style={{textAlign: 'center', color: 'var(--color-text-secondary)'}}>
                    {search ? 'Không tìm thấy playlist khớp.' : 'Bạn chưa có playlist nào.'}
                  </p>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* (7) RENDER MODAL CON (NẰM BÊN NGOÀI MODAL CHA) */}
      <CreatePlaylistModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated}
      />
    </>
  );
};

export default AddToPlaylistModal;