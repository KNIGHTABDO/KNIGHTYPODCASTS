import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PodcastForm } from '../components/admin/PodcastForm';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const AdminPodcastNewPage: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4" />
            <div className="h-64 bg-gray-800 rounded" />
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
              <p className="text-gray-400 mb-6">
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
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/admin" className="text-green-500 hover:text-green-400">
            &larr; Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Add New Podcast</h1>
        </div>
        
        <PodcastForm />
      </div>
    </Layout>
  );
};