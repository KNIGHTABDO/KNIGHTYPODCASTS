import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-white">404</h1>
          <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
          <p className="text-vercel-muted mt-2 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button 
              variant="primary" 
              size="lg" 
              leftIcon={<Home className="h-5 w-5" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};