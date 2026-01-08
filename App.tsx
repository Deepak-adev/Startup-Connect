import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import BusinessInquiry from './pages/BusinessInquiry';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import InvestorInquiry from './pages/InvestorInquiry';

import LandingPage from './pages/LandingPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inquiry" element={<BusinessInquiry />} />
        <Route path="/investor-inquiry" element={<InvestorInquiry />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/app" element={<Dashboard />} />
        {/* Catch all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}