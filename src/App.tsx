import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/public/LandingPage';
import { ExplorePage } from './pages/public/ExplorePage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { FoodSafetyPage } from './pages/public/FoodSafetyPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DonorDashboard } from './pages/donor/DonorDashboard';
import { RecipientDashboard } from './pages/recipient/RecipientDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SpringBootModal } from './components/api/SpringBootModal';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const location = useLocation();

  // Hide public navbar and footer on dedicated dashboard views for clean workspace experience, or keep clean top header
  const isDashboard =
    location.pathname.startsWith('/donor') ||
    location.pathname.startsWith('/recipient') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAF4]">
      <Navbar onOpenApiModal={() => setApiModalOpen(true)} />
      <div className="flex-1">{children}</div>
      {!isDashboard && <Footer onOpenApiModal={() => setApiModalOpen(true)} />}
      <SpringBootModal isOpen={apiModalOpen} onClose={() => setApiModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/food-safety" element={<FoodSafetyPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Portal Dashboards */}
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/donor/create" element={<DonorDashboard />} />
              <Route path="/recipient" element={<RecipientDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
