// music-frontend/src/App.jsx (FULL CODE)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import MainAppLayout from './components/MainAppLayout'; 
import AdminRoute from './components/AdminRoute'; 
import ProtectedRoute from './components/ProtectedRoute'; // <-- (1) IMPORT GUARD

// Import Trang
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import SongDetail from './pages/SongDetail'; 
import ArtistDetail from './pages/ArtistDetail'; 
import VerifyOtp from './pages/VerifyOtp'; 
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPassword from './pages/ResetPassword';
import LikedSongsPage from './pages/LikedSongsPage'; // <-- (2) IMPORT TRANG MỚI

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
        <Route path="blog" element={<div>Trang Blog (Sắp ra mắt)</div>} />

        {/* (3) ROUTE BẢO VỆ (CẦN LOGIN) */}
        <Route element={<ProtectedRoute />}>
            <Route path="liked-songs" element={<LikedSongsPage />} />
        </Route>
      </Route>
      
      {/* 3. ROUTE ADMIN (BẢO VỆ RIÊNG) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      
      <Route path="*" element={<div>404: Không tìm thấy trang này.</div>} />
    </Routes>
  );
}

export default App;