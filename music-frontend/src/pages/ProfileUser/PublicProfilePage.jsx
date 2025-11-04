// music-frontend/src/pages/Profile/PublicProfilePage.jsx (TẠO MỚI)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink, Outlet } from 'react-router-dom';
import { getPublicProfileApi } from '../../utils/api';
import './Profile.css'; // Dùng chung CSS
import { FaHeart, FaMusic } from 'react-icons/fa';

const PublicProfilePage = () => {
    const { username } = useParams(); // Lấy username từ URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // API GET /users/public/:username
                const data = await getPublicProfileApi(username); 
                
                // Fix URL cho người đang theo dõi (nếu có)
                if (data.following) {
                    data.following = data.following.map(follow => {
                        if (follow.following?.artist) {
                            follow.following.artist.avatar_url = `/images/default-artist.png`; // Tạm dùng default
                        }
                        return follow;
                    });
                }

                setProfile(data);
            } catch (err) {
                setError('Không tìm thấy người dùng này hoặc tài khoản chưa công khai.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading) return <p>Đang tải hồ sơ công khai...</p>;
    if (error || !profile) return <p>{error || 'Không thể hiển thị hồ sơ.'}</p>;

    return (
        <div className="profile-layout-container">
            
            {/* 1. HEADER CÔNG KHAI */}
            <div className="profile-header public-profile">
                <div className="profile-header-overlay">
                    <div className="profile-header-info">
                        <p className="profile-header-sub">HỒ SƠ CÔNG KHAI</p>
                        <h1 className="profile-header-name">{profile.username}</h1>
                        <p className="profile-stats">
                            Đang theo dõi: {profile.following?.length || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. NỘI DUNG CÁC MỤC (Tạm thời chỉ hiển thị) */}
            <div className="public-profile-content">
                
                {/* Mục 1: Playlist Công khai */}
                <div className="profile-section">
                    <h2>Playlist Công khai ({profile.playlists?.length || 0})</h2>
                    <div className="playlist-grid">
                        {profile.playlists && profile.playlists.length > 0 ? (
                            profile.playlists.map(pl => (
                                <div 
                                    key={pl.id} 
                                    className="playlist-card"
                                    onClick={() => window.location.href = `/playlist/${pl.id}`} // Tạm thời dùng reload
                                >
                                    <img src="/images/default-playlist-cover.jpg" alt={pl.name} />
                                    <h4>{pl.name}</h4>
                                    <p>{pl.songs?.length || 0} bài hát</p>
                                </div>
                            ))
                        ) : (
                            <p>Không có playlist công khai nào.</p>
                        )}
                    </div>
                </div>

                {/* Mục 2: Đang theo dõi */}
                <div className="profile-section">
                    <h2>Đang theo dõi ({profile.following?.length || 0})</h2>
                    <div className="artist-grid-full">
                        {profile.following?.map(f => (
                            <div key={f.followingId} className="artist-card" onClick={() => window.location.href = `/artist/${f.following?.artist?.id}`}>
                                <img src="/images/default-artist.png" alt={f.following?.artist?.stage_name || f.following?.username} />
                                <h4>{f.following?.artist?.stage_name || f.following?.username}</h4>
                                <p>User / {f.following?.artist ? 'Nghệ sĩ' : 'Người nghe'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfilePage;