import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Video, Settings } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { StreamList } from '../components/admin/StreamList';
import { useStreamStore } from '../store/streamStore';
import { useAuthStore } from '../store/authStore';

export const AdminPage: React.FC = () => {
  const { streams, fetchUserStreams } = useStreamStore();
  const { user, isLoading } = useAuthStore();
  
  useEffect(() => {
    fetchUserStreams();
  }, [fetchUserStreams]);
  
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
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Dashboard</h1>
          <Link to="/admin/streams/new">
            <Button 
              variant="primary" 
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add New Video
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="py-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
                <Video className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-vercel-muted text-sm">Total Videos</p>
                <h3 className="text-2xl font-bold text-white">{streams.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-vercel-subtle flex items-center justify-center mr-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-vercel-muted text-sm">Account</p>
                <h3 className="text-lg font-medium text-white truncate max-w-[180px]">
                  {user.email}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <StreamList />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};