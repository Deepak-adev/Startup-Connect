import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import BusinessInquiry from './pages/BusinessInquiry';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import InvestorInquiry from './pages/InvestorInquiry';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inquiry" element={<BusinessInquiry />} />
      <Route path="/investor-inquiry" element={<InvestorInquiry />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/app" element={<Dashboard />} />
      {/* Catch all redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}