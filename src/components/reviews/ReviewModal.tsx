import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';
import { useReviewStore } from '../../store/reviewStore';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
  streamTitle: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  streamId, 
  streamTitle 
}) => {
  const { addReview, userReview } = useReviewStore();
  
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [content, setContent] = useState(userReview?.content || '');
  const [watchedAt, setWatchedAt] = useState(
    userReview?.watched_at 
      ? new Date(userReview.watched_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when opening/userReview changes
  React.useEffect(() => {
    if (isOpen) {
      setRating(userReview?.rating || 0);
      setContent(userReview?.content || '');
      setWatchedAt(
        userReview?.watched_at 
          ? new Date(userReview.watched_at).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0]
      );
    }
  }, [isOpen, userReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return; // Require at least a star rating

    setIsSubmitting(true);
    try {
      await addReview(streamId, rating, content, new Date(watchedAt).toISOString());
      onClose();
    } catch (error) {
      console.error('Failed to log review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-knighty-card border border-knighty-border rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-knighty-border/50">
          <div>
            <span className="text-xs font-bold text-knighty-accent uppercase tracking-wider">I Watched</span>
            <h3 className="text-xl font-bold text-white leading-tight mt-1 line-clamp-1">{streamTitle}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-knighty-muted hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Rating Section */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <label className="text-sm font-medium text-knighty-muted">Rate this stream</label>
            <StarRating rating={rating} onRate={setRating} size="lg" />
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-knighty-muted uppercase tracking-wider flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Watched On
            </label>
            <input 
              type="date" 
              value={watchedAt}
              onChange={(e) => setWatchedAt(e.target.value)}
              className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-knighty-accent focus:border-knighty-accent outline-none"
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-knighty-muted uppercase tracking-wider">
              Review (Optional)
            </label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a review..."
              rows={4}
              className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-3 py-2 text-white text-sm placeholder-knighty-muted/50 focus:ring-1 focus:ring-knighty-accent focus:border-knighty-accent outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
              size="lg"
              disabled={isSubmitting || rating === 0}
              className="font-bold"
            >
              {isSubmitting ? 'Saving...' : 'Log & Save'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
