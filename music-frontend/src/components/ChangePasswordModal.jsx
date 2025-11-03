// music-frontend/src/components/ChangePasswordModal.jsx (FULL CODE MỚI)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// (1) Import cả 3 API
import { api, changePasswordApi, requestPasswordResetOtpApi, resetPasswordOtpApi } from '../utils/api'; 
import './ChangePasswordModal.css'; 
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Cần để lấy email

// (Hàm Toast Helper)
const showToast = (message, type = 'success') => {
    alert(message); 
};

const ChangePasswordModal = ({ onClose }) => {
  const { user } = useAuth(); // Lấy email của user đang đăng nhập
  const navigate = useNavigate(); 
  
  // (2) QUẢN LÝ VIEW: 'change' (đổi bằng pass cũ) hoặc 'reset' (đổi bằng OTP)
  const [view, setView] = useState('change'); 
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // (3) HÀM XỬ LÝ SUBMIT (Tùy theo view)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);

    if (view === 'change') {
        // === LUỒNG 1: DÙNG MẬT KHẨU CŨ ===
        try {
          const response = await changePasswordApi({
            oldPassword: oldPassword,
            newPassword: newPassword,
          });
          showToast(response.message || 'Đổi mật khẩu thành công!');
          onClose(); 
        } catch (err) {
          setError(err.response?.data?.message || 'Đổi mật khẩu thất bại.');
        }
    } else {
        // === LUỒNG 2: DÙNG OTP ===
        try {
          const response = await resetPasswordOtpApi({
            email: user.email, // Dùng email của user đang login
            otpCode: otpCode,
            newPassword: newPassword,
          });
          showToast(response.message || 'Đổi mật khẩu thành công!');
          onClose(); 
        } catch (err) {
          setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. OTP sai hoặc hết hạn.');
        }
    }
    setLoading(false);
  };

  // (4) HÀM KHI NHẤN "QUÊN MẬT KHẨU CŨ?"
  const handleForgotPasswordClick = async () => {
    setLoading(true);
    setError('');
    try {
        await requestPasswordResetOtpApi(); // Gọi API gửi OTP
        showToast(`Đã gửi OTP đến ${user.email}`);
        setView('reset'); // Chuyển sang "box" nhập OTP
    } catch (err) {
        setError('Không thể gửi OTP. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          
          {/* Lỗi chung */}
          {error && <p className="modal-error">{error}</p>}

          {/* === VIEW 1: ĐỔI BẰNG MẬT KHẨU CŨ === */}
          {view === 'change' && (
            <>
              <h2>Đổi Mật khẩu</h2>
              <label>Mật khẩu cũ:</label>
              <input 
                type="password" 
                name="oldPassword" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                required
              />
              
              <label>Mật khẩu mới:</label>
              <input 
                type="password" 
                name="newPassword" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required
              />
              
              <label>Xác nhận mật khẩu mới:</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
              />
              
              <div className="form-buttons">
                <button type="submit" disabled={loading} className="profile-button save">
                  {loading ? 'Đang đổi...' : 'Xác nhận'}
                </button>
              </div>

              <p className="forgot-password-link-modal" onClick={handleForgotPasswordClick}>
                Quên mật khẩu cũ? (Dùng OTP)
              </p>
            </>
          )}

          {/* === VIEW 2: ĐỔI BẰNG OTP === */}
          {view === 'reset' && (
            <>
              <h2>Đặt lại Mật khẩu</h2>
              <p className="sub-text" style={{textAlign: 'center', marginTop: '-15px', marginBottom: '15px'}}>
                  Đã gửi mã OTP đến <strong>{user.email}</strong>
              </p>

              <label>Mã OTP (6 chữ số):</label>
              <input 
                type="text" 
                name="otpCode" 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                required
                maxLength={6}
              />
              
              <label>Mật khẩu mới:</label>
              <input 
                type="password" 
                name="newPassword" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required
              />
              
              <label>Xác nhận mật khẩu mới:</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
              />

              <div className="form-buttons">
                <button type="submit" disabled={loading} className="profile-button save">
                  {loading ? 'Đang đặt lại...' : 'Đặt lại Mật khẩu'}
                </button>
              </div>
              
              <p className="forgot-password-link-modal" onClick={() => setView('change')}>
                Quay lại (Dùng mật khẩu cũ)
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;