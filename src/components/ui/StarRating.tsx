import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRate, 
  size = 'md', 
  readonly = false 
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const handleMouseEnter = (index: number) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(null);
  };

  const handleClick = (index: number) => {
    if (!readonly && onRate) {
      onRate(index);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isHalf = star - 0.5 === displayRating; // Simplified logic, for now assume whole stars or half if needed later

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`
              transition-transform duration-150 
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              ${size === 'lg' ? 'p-1' : 'p-0.5'}
            `}
            onMouseEnter={() => handleMouseEnter(star)}
            onClick={() => handleClick(star)}
          >
            <Star 
              className={`
                ${starSizes[size]} 
                ${isFilled ? 'fill-knighty-accent text-knighty-accent' : 'text-knighty-border fill-transparent'}
                transition-colors duration-200
              `} 
            />
          </button>
        );
      })}
    </div>
  );
};
