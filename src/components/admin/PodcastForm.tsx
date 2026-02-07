import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Trash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { usePodcastStore } from '../../store/podcastStore';
import { useAuthStore } from '../../store/authStore';
import { Database } from '../../types/supabase';
import { toAppError } from '../../types/errors';
import { PodcastUploader } from '../podcast/PodcastUploader';

type Podcast = Database['public']['Tables']['podcasts']['Row'];

interface PodcastFormProps {
  podcast?: Podcast;
  isEditing?: boolean;
}

const CATEGORIES = [
  'Quran',
  'Hadith',
  'Fiqh',
  'Seerah',
  'History',
  'Family',
  'Youth',
  'Spirituality',
];

export const PodcastForm: React.FC<PodcastFormProps> = ({ 
  podcast, 
  isEditing = false 
}) => {
  const { user } = useAuthStore();
  const { addPodcast, updatePodcast, deletePodcast } = usePodcastStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: podcast?.title || '',
    description: podcast?.description || '',
    video_url: podcast?.video_url || '',
    thumbnail_url: podcast?.thumbnail_url || '',
    category: podcast?.category || CATEGORIES[0],
    duration: podcast?.duration || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | 'youtube'>('url');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.video_url.trim()) {
      newErrors.video_url = 'Media source is required';
    } else if (uploadMethod === 'url' || uploadMethod === 'youtube') {
      // Only validate URL format if using URL or YouTube upload method
      const isValidUrl = formData.video_url.match(
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|.*\.mp4|.*\.mp3|.*\.m4a|.*\.wav)/
      );
      if (!isValidUrl) {
        newErrors.video_url = 'Please enter a valid media URL';
      }
    }
    
    if (!formData.thumbnail_url.trim()) {
      newErrors.thumbnail_url = 'Thumbnail URL is required';
    } else if (!formData.thumbnail_url.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)/i)) {
      newErrors.thumbnail_url = 'Please enter a valid image URL';
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && podcast) {
        const { error } = await updatePodcast(podcast.id, formData);
        if (error) throw new Error(error);
        navigate(`/podcasts/${podcast.id}`);
      } else {
        const { error } = await addPodcast({
          ...formData,
          user_id: user.id,
        });
        if (error) throw new Error(error);
        navigate('/admin');
      }
    } catch (error: unknown) {
      const appError = toAppError(error);
      console.error('Error saving podcast:', appError);
      alert(`Failed to save podcast: ${appError.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!podcast || !window.confirm('Are you sure you want to delete this podcast?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await deletePodcast(podcast.id);
      if (error) throw new Error(error);
      navigate('/admin');
    } catch (error: unknown) {
      const appError = toAppError(error);
      console.error('Error deleting podcast:', appError);
      alert(`Failed to delete podcast: ${appError.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Video' : 'Add New Video'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter podcast title"
            error={errors.title}
            fullWidth
          />
          
          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter podcast description"
            error={errors.description}
            fullWidth
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-200 mb-1 block">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-vercel-border bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              label="Duration (seconds)"
              name="duration"
              type="number"
              value={formData.duration.toString()}
              onChange={(e) => 
                setFormData((prev) => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 0 
                }))
              }
              placeholder="Enter duration in seconds"
              error={errors.duration}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Media Source
            </label>
            <PodcastUploader
              onUrlChange={(url) => 
                setFormData(prev => ({ ...prev, video_url: url }))
              }
              onDurationChange={(duration) =>
                setFormData(prev => ({ ...prev, duration }))
              }
              onMethodChange={setUploadMethod}
              onMetadataChange={(metadata) => {
                setFormData(prev => ({
                  ...prev,
                  title: prev.title || metadata.title,
                  description: prev.description || metadata.description,
                  thumbnail_url: prev.thumbnail_url || metadata.thumbnail || ''
                }));
              }}
              initialMethod={uploadMethod}
            />
            {errors.video_url && (
              <p className="text-red-500 text-sm">{errors.video_url}</p>
            )}
          </div>
          
          <Input
            label="Thumbnail URL"
            name="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            error={errors.thumbnail_url}
            fullWidth
          />
          
          {formData.thumbnail_url && !errors.thumbnail_url && (
            <div className="mt-2">
              <p className="text-sm text-gray-400 mb-2">Thumbnail Preview:</p>
              <img
                src={formData.thumbnail_url}
                alt="Thumbnail preview"
                className="w-full max-w-md h-48 object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Invalid+Image+URL';
                  setErrors((prev) => ({ 
                    ...prev, 
                    thumbnail_url: 'Invalid image URL or image not accessible' 
                  }));
                }}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {isEditing && podcast ? (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<Trash className="h-4 w-4" />}
            >
              Delete
            </Button>
          ) : (
            <div></div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {isEditing ? 'Update' : 'Create'} Video
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};