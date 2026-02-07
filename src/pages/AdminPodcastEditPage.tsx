import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PodcastForm } from '../components/admin/PodcastForm';
import { usePodcastStore } from '../store/podcastStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AdminPodcastEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentPodcast, isLoading: isPodcastLoading, fetchPodcastById } = usePodcastStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  
  useEffect(() => {
    if (id) {
      fetchPodcastById(id);
    }
  }, [id, fetchPodcastById]);
  
  const isLoading = isAuthLoading || isPodcastLoading;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-vercel-card rounded w-1/4" />
            <div className="h-64 bg-vercel-card rounded" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-vercel-muted mb-6">
                You need to sign in to access the admin area.
              </p>
              <Link to="/auth">
                <Button variant="primary">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  if (!currentPodcast) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Video Not Found</h2>
              <p className="text-vercel-muted mb-6">
                The video you are trying to edit does not exist.
              </p>
              <Link to="/admin">
                <Button variant="primary">Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/admin" className="text-vercel-muted hover:text-white transition-colors duration-200">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Edit Video</h1>
        </div>
        
        <PodcastForm podcast={currentPodcast} isEditing />
      </div>
    </Layout>
  );
};