import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PodcastsPage } from './pages/PodcastsPage';
import { PodcastDetailPage } from './pages/PodcastDetailPage';
import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import { AdminPodcastNewPage } from './pages/AdminPodcastNewPage';
import { AdminPodcastEditPage } from './pages/AdminPodcastEditPage';
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
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/podcasts/:id" element={<PodcastDetailPage />} />
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
          path="/admin/podcasts/new" 
          element={
            <ProtectedRoute>
              <AdminPodcastNewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/podcasts/:id/edit" 
          element={
            <ProtectedRoute>
              <AdminPodcastEditPage />
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