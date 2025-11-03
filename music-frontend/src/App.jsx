// music-frontend/src/App.jsx (FULL CODE SỬA LỖI FINAL)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import MainAppLayout from './components/MainAppLayout'; 
import AdminRoute from './components/AdminRoute'; 
import ProtectedRoute from './components/ProtectedRoute'; // <-- (1) IMPORT GUARD
import ProfileLayout from './pages/ProfileUser/ProfileLayout'; // <-- (2) IMPORT LAYOUT MỚI

// Import Trang
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPage from './pages/AdminPage';
import SongDetail from './pages/SongDetail'; 
import ArtistDetail from './pages/ArtistDetail'; 
import LikedSongsPage from './pages/LikedSongsPage';
import GenreDetailPage from './pages/GenreDetailPage';
import AllSongsPage from './pages/AllSongsPage'; 
import AllArtistsPage from './pages/AllArtistsPage'; 

// (3) IMPORT CÁC TRANG CON CỦA PROFILE
import ProfileInfo from './pages/ProfileUser/ProfileInfo';
import ProfilePlaylists from './pages/ProfileUser/ProfilePlaylists';

function App() {
  return (
    <Routes>
      {/* 1. ROUTE PUBLIC (Không layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* 2. ROUTE CHÍNH (Layout Gốc) */}
      <Route path="/" element={<MainAppLayout />}> 
        <Route index element={<Home />} /> 
        <Route path="song/:id" element={<SongDetail />} /> 
        <Route path="artist/:id" element={<ArtistDetail />} /> 
        <Route path="genre/:genreName" element={<GenreDetailPage />} /> 
        <Route path="songs" element={<AllSongsPage />} />
        <Route path="artists" element={<AllArtistsPage />} />
        <Route path="blog" element={<div>Trang Blog (Sắp ra mắt)</div>} />

        {/* (4) ROUTE BẢO VỆ (CẦN LOGIN) */}
        <Route element={<ProtectedRoute />}>
            <Route path="liked-songs" element={<LikedSongsPage />} />
            {/* (5) ROUTE PROFILE MỚI (LỒNG NHAU) */}
            <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<ProfileInfo />} />
                <Route path="info" element={<ProfileInfo />} />
                <Route path="likes" element={<LikedSongsPage />} />
                <Route path="playlists" element={<ProfilePlaylists />} />
            </Route>
        </Route>
      </Route>
      
      {/* 3. ROUTE ADMIN (BẢO VỆ RIÊNG - ĐÃ ĐƯA RA NGOÀI) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      
      <Route path="*" element={<div>404: Không tìm thấy trang này.</div>} />
    </Routes>
  );
}

export default App;