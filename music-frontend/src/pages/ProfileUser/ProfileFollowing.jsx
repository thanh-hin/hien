// music-frontend/src/pages/Profile/ProfileFollowing.jsx (TẠO MỚI)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyFollowingApi } from '../../utils/api';
import './Profile.css'; // Dùng chung CSS

// (Hàm helper fix URL - Rất quan trọng)
const fixUrl = (url, type = 'artist') => {
    if (!url) { 
        return '/images/default-artist.png'; 
    }
    if (url.startsWith('http')) return url;
    const prefix = type === 'image' ? '/media/images' : '/media/audio';
    const originalPath = type === 'image' ? '/images' : '/audio';
    
    if (url.startsWith(prefix)) {
        return `http://localhost:3000${url}`;
    }
    return `http://localhost:3000${url.replace(originalPath, prefix)}`;
};

const ProfileFollowing = () => {
    const [followingList, setFollowingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFollowing = async () => {
            setLoading(true);
            try {
                const data = await fetchMyFollowingApi(); // Trả về [Follow]

                // Trích xuất thông tin Artist từ object Follow
                const artists = data.map(follow => {
                    // API trả về: { ..., following: { id, username, ..., artist: { id, stage_name, avatar_url } } }
                    const artistProfile = follow.following.artist;
                    
                    if (artistProfile) {
                        // Fix URL ảnh
                        artistProfile.avatar_url = fixUrl(artistProfile.avatar_url, 'artist');
                        return artistProfile;
                    }
                    return null; // Bỏ qua nếu user đó không phải artist
                }).filter(Boolean); // Lọc bỏ các giá trị null

                setFollowingList(artists);
            } catch (error) {
                console.error("Lỗi tải danh sách đang theo dõi:", error);
            }
            setLoading(false);
        };
        loadFollowing();
    }, []);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="profile-following-container">
            <h2>Đang theo dõi</h2>
            
            {/* Tái sử dụng class 'artist-grid-full' (nếu đã có) hoặc 'playlist-grid' */}
            <div className="playlist-grid"> 
                {followingList.length > 0 ? (
                    followingList.map(artist => (
                        <div 
                            key={artist.id} 
                            // Tái sử dụng style 'playlist-card' (hoặc 'artist-card' nếu bạn thích)
                            className="playlist-card" 
                            onClick={() => navigate(`/artist/${artist.id}`)}
                        >
                            <img src={artist.avatar_url} alt={artist.stage_name} style={{ borderRadius: '50%' }} />
                            <h4>{artist.stage_name}</h4>
                            <p>Nghệ sĩ</p>
                        </div>
                    ))
                ) : (
                    <p>Bạn chưa theo dõi nghệ sĩ nào.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileFollowing;