// music-frontend/src/pages/Profile/ProfilePlaylists.jsx (TẠO MỚI)
import React, { useEffect, useState } from 'react';
import { api, fetchMyPlaylists } from '../../utils/api'; // Sửa: import API
import './Profile.css';

const ProfilePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      try {
        const response = await fetchMyPlaylists(); // API đã tạo
        setPlaylists(response);
      } catch (error) {
        console.error("Lỗi tải playlist:", error);
      }
      setLoading(false);
    };
    loadPlaylists();
  }, []);

  if (loading) return <p>Đang tải playlist...</p>;

  return (
    <div className="profile-playlists-container">
      <h2>Playlist Của bạn</h2>
      <div className="playlist-grid">
        {playlists.length > 0 ? (
          playlists.map(pl => (
            <div key={pl.id} className="playlist-card">
              <img src="/images/default-playlist-cover.jpg" alt={pl.name} />
              <h4>{pl.name}</h4>
              <p>{pl.is_private ? 'Riêng tư' : 'Công khai'}</p>
            </div>
          ))
        ) : (
          <p>Bạn chưa tạo playlist nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePlaylists;