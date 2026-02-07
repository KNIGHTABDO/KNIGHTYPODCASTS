import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface ProgressState {
  saveProgress: (streamId: string, seconds: number) => Promise<void>;
  getProgress: (streamId: string) => Promise<number>; // returns seconds
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  saveProgress: async (streamId, seconds) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watch_progress')
        .upsert({
          user_id: user.id,
          stream_id: streamId,
          progress_seconds: Math.floor(seconds),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, stream_id' });

      if (error) console.error('Error saving progress:', error);
    } catch (err) {
      console.error('Error in saveProgress:', err);
    }
  },

  getProgress: async (streamId) => {
    const user = useAuthStore.getState().user;
    if (!user) return 0;

    try {
      const { data, error } = await supabase
        .from('watch_progress')
        .select('progress_seconds')
        .eq('user_id', user.id)
        .eq('stream_id', streamId)
        .single();

      if (error) return 0;
      return data?.progress_seconds || 0;
    } catch (err) {
      console.error('Error getting progress:', err);
      return 0;
    }
  }
}));
