import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StreamsPage } from './pages/StreamsPage';
import { StreamDetailPage } from './pages/StreamDetailPage';
import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { AdminStreamNewPage } from './pages/AdminStreamNewPage';
import { AdminStreamEditPage } from './pages/AdminStreamEditPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuthStore } from './store/authStore';

function App() {
  const { checkUser, user, isLoading } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }
    
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/streams" element={<StreamsPage />} />
        <Route path="/streams/:id" element={<StreamDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/streams/new" 
          element={
            <ProtectedRoute>
              <AdminStreamNewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/streams/:id/edit" 
          element={
            <ProtectedRoute>
              <AdminStreamEditPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;