import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface Review {
  id: string;
  created_at: string;
  user_id: string;
  stream_id: string;
  rating: number; // 0.5 to 5.0
  content: string | null;
  watched_at: string;
}

interface ReviewState {
  reviews: Review[];
  userReview: Review | null; // The current user's review for the active stream
  isLoading: boolean;
  error: string | null;
  
  fetchStreamReviews: (streamId: string) => Promise<void>;
  fetchUserReview: (streamId: string) => Promise<void>;
  addReview: (streamId: string, rating: number, content?: string, watchedAt?: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  userReview: null,
  isLoading: false,
  error: null,

  fetchStreamReviews: async (streamId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ reviews: data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchUserReview: async (streamId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('stream_id', streamId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error
      set({ userReview: data || null });
    } catch (err: any) {
      console.error('Error fetching user review:', err);
    }
  },

  addReview: async (streamId, rating, content = '', watchedAt = new Date().toISOString()) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Must be logged in to review');

    set({ isLoading: true, error: null });
    try {
      // Check if update or insert
      const existing = get().userReview;
      
      let query;
      if (existing) {
        query = supabase
          .from('reviews')
          .update({ rating, content, watched_at: watchedAt })
          .eq('id', existing.id);
      } else {
        query = supabase
          .from('reviews')
          .insert({
            stream_id: streamId,
            user_id: user.id,
            rating,
            content,
            watched_at: watchedAt
          });
      }

      const { data, error } = await query.select().single();
      if (error) throw error;

      // Update local state
      set({ 
        userReview: data,
        reviews: existing 
          ? get().reviews.map(r => r.id === existing.id ? data : r)
          : [data, ...get().reviews],
        isLoading: false 
      });
      
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteReview: async (reviewId) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      set({ 
        userReview: null,
        reviews: get().reviews.filter(r => r.id !== reviewId),
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
