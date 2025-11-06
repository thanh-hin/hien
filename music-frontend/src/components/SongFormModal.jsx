// music-frontend/src/components/SongFormModal.jsx (BẢN SỬA LỖI FINAL)
import React, { useState, useEffect } from 'react';
// (1) IMPORT API CATEGORY
import { createSongApi, updateMySongApi, getMyAlbumsApi, fetchCategories } from '../utils/api'; 
import './ChangePasswordModal.css'; 
import '../pages/ArtistDashboard/ArtistDashboard.css'; 
import { FaTimes, FaMusic, FaImage } from 'react-icons/fa';

const showToast = (message, type = 'success') => { alert(message); };

const SongFormModal = ({ onClose, onComplete, songToEdit }) => {
    const isEditMode = Boolean(songToEdit);

    const [title, setTitle] = useState(songToEdit?.title || '');
    // === SỬA STATE: Dùng genre thay vì genreName ===
    const [genre, setGenre] = useState(songToEdit?.genre || ''); 
    // ===============================================
    const [albumId, setAlbumId] = useState(songToEdit?.album?.id || '');
    const [trackNumber, setTrackNumber] = useState(songToEdit?.track_number || '');
    
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        songToEdit?.image_url || songToEdit?.cover_url || '/images/default-album.png'
    );
    
    const [artistAlbums, setArtistAlbums] = useState([]); 
    // === (2) STATE MỚI CHO CATEGORY ===
    const [categories, setCategories] = useState([]);
    // ==================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load danh sách Album và Category cùng lúc
    useEffect(() => {
        const loadDependencies = async () => {
            try {
                // Tải Album
                const albums = await getMyAlbumsApi();
                setArtistAlbums(albums);

                // === (3) Tải Category ===
                const categoryList = await fetchCategories();
                setCategories(categoryList);
                // ==========================

            } catch (e) {
                console.error("Lỗi tải Dependencies:", e);
                setError("Lỗi tải Album hoặc Thể loại.");
            }
        };
        loadDependencies();
    }, []);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'audio') setAudioFile(file);
            if (type === 'image') {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // 1. Kiểm tra bắt buộc
        if (!title || !genre || (!isEditMode && !audioFile)) {
            setError('Vui lòng điền Tiêu đề, Thể loại và Tải lên File nhạc (bắt buộc khi tạo mới).');
            return;
        }

        setLoading(true);
        
        const formData = new FormData();
        // 2. Thêm các trường data
        formData.append('title', title);
        formData.append('genre', genre); // <-- Gửi tên thể loại (string)
        if (albumId) formData.append('albumId', albumId);
        if (trackNumber) formData.append('track_number', trackNumber);
        formData.append('duration', '0'); // Backend sẽ tự tính toán

        // 3. Thêm File (Quan trọng)
        if (audioFile) formData.append('audioFile', audioFile); 
        if (imageFile) formData.append('imageFile', imageFile); 

        try {
            if (isEditMode) {
                await updateMySongApi(songToEdit.id, formData);
                showToast('Cập nhật bài hát thành công! Vui lòng chờ duyệt lại.');
            } else {
                await createSongApi(formData);
                showToast('Bài hát đã được gửi và đang chờ Admin duyệt!');
            }
            onComplete();
            onClose(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Thao tác thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
                <h2>{isEditMode ? 'Sửa Bài hát' : 'Tải lên Bài hát Mới'}</h2>
                
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    {error && <p className="modal-error">{error}</p>}

                    {/* Tiêu đề */}
                    <div className="form-group">
                        <label>Tiêu đề:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    
                    {/* === (4) DROPDOWN THỂ LOẠI === */}
                    <div className="form-group">
                        <label>Thể loại (Bắt buộc):</label>
                        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="form-select" required>
                            <option value="" disabled>--- Chọn Thể loại ---</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* ============================== */}


                    {/* Album và Track Number */}
                    <div className="form-group-flex">
                         <div className="form-group">
                            <label>Album:</label>
                            {/* === ALBUM CHO PHÉP TRỐNG === */}
                            <select value={albumId} onChange={(e) => setAlbumId(e.target.value)} className="form-select">
                                <option value="">(Chọn Album - Single)</option>
                                {artistAlbums.map(album => (
                                    <option key={album.id} value={album.id}>{album.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Track #:</label>
                            <input type="number" value={trackNumber} onChange={(e) => setTrackNumber(e.target.value)} placeholder="Thứ tự" />
                        </div>
                    </div>
                    
                    {/* File Nhạc (Bắt buộc khi tạo) */}
                    <div className="form-group">
                        <label>{isEditMode ? 'Đổi File Nhạc' : 'File Nhạc (MP3/WAV)'}: <FaMusic /></label>
                        <input type="file" accept=".mp3,.wav" onChange={(e) => handleFileChange(e, 'audio')} required={!isEditMode} />
                        {isEditMode && songToEdit?.file_url && <p className='subtle-text'>File hiện tại: {songToEdit.file_url.split('/').pop()}</p>}
                    </div>
                    
                    {/* Ảnh Bìa */}
                    <div className="form-group avatar-upload-section">
                        <label>Ảnh Bìa ({isEditMode ? 'Đổi Ảnh' : 'Optional'}): <FaImage /></label>
                        <div className="avatar-preview-box">
                            <img src={imagePreview} alt="Cover Preview" className="avatar-preview" style={{ borderRadius: '8px' }}/>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                        </div>
                    </div>
                    
                    <div className="form-buttons">
                        <button type="submit" disabled={loading} className="profile-button save">
                            {loading ? 'Đang xử lý...' : (isEditMode ? 'Lưu & Gửi Duyệt lại' : 'Tải lên & Gửi duyệt')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SongFormModal;