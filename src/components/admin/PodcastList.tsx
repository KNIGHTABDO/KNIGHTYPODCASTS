import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDuration } from '../../lib/utils';
import { usePodcastStore } from '../../store/podcastStore';
import { toAppError } from '../../types/errors';


export const PodcastList: React.FC = () => {
  const { podcasts, isLoading, deletePodcast } = usePodcastStore();
  
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const { error } = await deletePodcast(id);
        if (error) throw new Error(error);
      } catch (error: unknown) {
        const appError = toAppError(error);
        console.error('Error deleting podcast:', appError);
        alert(`Failed to delete podcast: ${appError.message}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-800 rounded-lg p-4 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-3" />
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }
  
  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-medium text-gray-300">No podcasts found</h3>
        <p className="mt-2 text-gray-400 mb-4">Get started by adding your first podcast</p>
        <Link to="/admin/podcasts/new">
          <Button variant="primary">Add New Podcast</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {podcasts.map((podcast) => (
        <div 
          key={podcast.id} 
          className="bg-gray-800 rounded-lg overflow-hidden flex flex-col sm:flex-row"
        >
          <div className="sm:w-48 h-32 sm:h-auto">
            <img 
              src={podcast.thumbnail_url} 
              alt={podcast.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{podcast.title}</h3>
              <div className="flex items-center mt-2 sm:mt-0">
                <span className="text-sm text-gray-400 flex items-center mr-4">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(podcast.duration)}
                </span>
                <span className="bg-green-600 text-xs text-white px-2 py-1 rounded-full">
                  {podcast.category}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              {podcast.description.length > 120
                ? `${podcast.description.substring(0, 120)}...`
                : podcast.description}
            </p>
            <div className="mt-4 flex space-x-2">
              <Link to={`/admin/podcasts/${podcast.id}/edit`}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  leftIcon={<Edit className="h-4 w-4" />}
                >
                  Edit
                </Button>
              </Link>
              <Button 
                variant="danger" 
                size="sm" 
                leftIcon={<Trash className="h-4 w-4" />}
                onClick={() => handleDelete(podcast.id, podcast.title)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};