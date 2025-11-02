// music-frontend/src/utils/api.js (BẢN FINAL ĐÃ SỬA LỖI TOKEN)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

// 1. TẠO INSTANCE AXIOS
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. INTERCEPTOR (Tự động gửi Token)
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken'); 

    if (token) {
      // Đính kèm token vào header Authorization
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// =====================================


// Hàm lấy Bài hát
export const fetchSongs = async () => {
  try {
    const response = await api.get('/song'); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi fetch songs:', error);
    // Khi lỗi 401 xảy ra (token hết hạn), interceptor sẽ xử lý.
    throw error; 
  }
};

// Hàm lấy Nghệ sĩ
export const fetchFeaturedArtists = async () => {
  try {
    const response = await api.get('/artists/featured');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tải nghệ sĩ:', error);
    throw error; 
  }
};

// Hàm Login (Trả về toàn bộ data response)
export const loginApi = async (email, password) => {
  // KHÔNG DÙNG try/catch ở đây để lỗi 401 được ném ra và được AuthContext xử lý
  const response = await api.post('/auth/login', { email, password });
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken); 
  }
  // TRẢ VỀ TOÀN BỘ DATA (chứa accessToken)
  return response.data; 
};

// Hàm Register
export const registerApi = async (data) => {
  // KHÔNG DÙNG try/catch ở đây
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Hàm Resend OTP
export const resendOtpApi = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};

/* === API LIKE (MỚI) === */
export const fetchLikedSongs = async () => {
    try {
        // Dùng 'api' (đã có interceptor) để gửi Token
        const response = await api.get('/like/my-songs');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải bài hát đã thích:', error);
        // Nếu lỗi 401 (token hết hạn), interceptor (nếu có) sẽ xử lý
        return [];
    }
};

export { api };