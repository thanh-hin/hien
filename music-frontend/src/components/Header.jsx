// music-frontend/src/components/Header.jsx (BẢN SỬA LỖI FINAL)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, searchApi } from '../utils/api'; 
import './Header.css'; 
import { FaSearch, FaUserCircle } from 'react-icons/fa';

// === HÀM HELPER: Sửa lỗi URL (Fix NULL và Thêm Domain) ===
const fixImageUrl = (url, type = 'image') => {
    if (!url) { 
        if (type === 'artist') return '/images/default-artist.png';
        return '/images/default-album.png'; 
    }
    if (url.startsWith('http')) return url;
    const prefix = type === 'image' ? '/media/images' : '/media/audio';
    const originalPath = type === 'image' ? '/images' : '/audio';
    
    if (url.startsWith(prefix)) {
        return `http://localhost:3000${url}`;
    }
    return `http://localhost:3000${url.replace(originalPath, prefix)}`;
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null); // (null = ẩn, { songs: []... } = hiện)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null); 

  // (useEffect Debouncing cho Search)
  useEffect(() => {
    // Nếu query rỗng, xóa kết quả và không gọi API
    if (query.trim() === '') {
      setResults(null);
      return;
    }

    // Trì hoãn 500ms
    const delayDebounce = setTimeout(async () => {
      const data = await searchApi(query);
      
      // Fix URL ảnh cho kết quả search
      data.songs = data.songs.map(song => ({
          ...song,
          image_url: song.image_url ? fixImageUrl(song.image_url, 'song') : (song.album ? fixImageUrl(song.album.cover_url, 'album') : fixImageUrl(null, 'album')),
      }));
      data.artists = data.artists.map(artist => ({
          ...artist,
          avatar_url: fixImageUrl(artist.avatar_url, 'artist')
      }));
      data.albums = data.albums.map(album => ({
          ...album,
          cover_url: fixImageUrl(album.cover_url, 'album')
      }));
      
      setResults(data);
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // (useEffect Ẩn Dropdown khi click ra ngoài)
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setResults(null); 
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchContainerRef, userMenuRef]);

  // (Hàm xử lý click kết quả Search)
  const handleResultClick = (path) => {
    navigate(path);
    setQuery('');
    setResults(null);
  };
  
  const handleUserMenu = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleBecomeArtist = () => {
    navigate('/artist-registration'); 
    setDropdownOpen(false);
  };

  return (
    <header className="header-container">
      
      {/* === CỘT 1: BÊN TRÁI (LOGO) === */}
      <div className="header-left">
        <h1 className="logo" onClick={() => navigate('/')}>lame 🎵</h1>
      </div>
      
      {/* === CỘT 2: GIỮA (SEARCH) === */}
      <div className="header-center" ref={searchContainerRef}>
        <div className="search-bar-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          {/* === KẾT QUẢ TÌM KIẾM (DROPDOWN) === */}
          {results && (
            <div className="search-results-dropdown">
              
              {/* === (1) LOGIC XỬ LÝ "KHÔNG CÓ THÔNG TIN" === */}
              {(results.songs.length === 0 && results.artists.length === 0 && results.albums.length === 0) ? (
                <div className="search-no-results">Không có thông tin cho "{query}"</div>
              ) : (
                <>
                  {/* === Phần Bài hát === */}
                  {results.songs.length > 0 && (
                    <div className="search-result-section">
                      <h4>Bài hát</h4>
                      {results.songs.map(song => (
                        <div key={song.id} className="search-result-item" onClick={() => handleResultClick(`/song/${song.id}`)}>
                          <img src={song.image_url || song.album?.cover_url} alt={song.title} />
                          <div>
                            <p>{song.title}</p>
                            <span>{song.artist?.stage_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* === Phần Nghệ sĩ === */}
                  {results.artists.length > 0 && (
                    <div className="search-result-section">
                      <h4>Nghệ sĩ</h4>
                      {results.artists.map(artist => (
                        <div key={artist.id} className="search-result-item" onClick={() => handleResultClick(`/artist/${artist.id}`)}>
                          <img src={artist.avatar_url} alt={artist.stage_name} className="artist-avatar" />
                          <div>
                            <p>{artist.stage_name}</p>
                            <span>Nghệ sĩ</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* === Phần Album === */}
                  {results.albums.length > 0 && (
                    <div className="search-result-section">
                      <h4>Album</h4>
                      {results.albums.map(album => (
                        <div key={album.id} className="search-result-item" onClick={() => handleResultClick(`/album/${album.id}`)}>
                          <img src={album.cover_url} alt={album.title} />
                          <div>
                            <p>{album.title}</p>
                            <span>{album.artist?.stage_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* === CỘT 3: BÊN PHẢI (AUTH) === */}
      <div className="header-right">
        {isAuthenticated ? (
          <> 
            {user?.role === 'listener' && (
              <button className="btn-become-artist" onClick={handleBecomeArtist}>
                Trở thành Nghệ sĩ
              </button>
            )}
            <div className="user-menu" ref={userMenuRef}>
              <button className="user-menu-button" onClick={handleUserMenu}>
                <FaUserCircle size={28} />
                <span>{user?.username}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div onClick={() => { navigate('/profile/info'); setDropdownOpen(false); }}>Tài khoản</div>
                  <div onClick={logout}>Đăng xuất</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <button className="btn-signup" onClick={() => navigate('/register')}>Đăng ký</button>
            <button className="btn-login" onClick={() => navigate('/login')}>Đăng nhập</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;