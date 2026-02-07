import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Podcast = Database['public']['Tables']['podcasts']['Row'];

type PodcastWithProfile = Podcast & {
  profiles: { username: string } | null;
};

interface PodcastState {
  podcasts: PodcastWithProfile[];
  featuredPodcasts: PodcastWithProfile[];
  currentPodcast: PodcastWithProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchPodcasts: () => Promise<void>;
  fetchFeaturedPodcasts: () => Promise<void>;
  fetchPodcastById: (id: string) => Promise<void>;
  fetchPodcastsByUserId: (userId: string) => Promise<void>;
  addPodcast: (podcast: Omit<Podcast, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updatePodcast: (id: string, podcast: Partial<Podcast>) => Promise<{ error: string | null }>;
  deletePodcast: (id: string) => Promise<{ error: string | null }>;
  fetchUserPodcasts: () => Promise<void>;
}

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  podcasts: [],
  featuredPodcasts: [],
  currentPodcast: null,
  isLoading: false,
  error: null,

  fetchPodcasts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*, profiles!podcasts_user_id_fkey(username)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ podcasts: (data as PodcastWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchFeaturedPodcasts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*, profiles!podcasts_user_id_fkey(username)')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      set({ featuredPodcasts: (data as PodcastWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchPodcastById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*, profiles!podcasts_user_id_fkey(username)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentPodcast: data as PodcastWithProfile, isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchPodcastsByUserId: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*, profiles!podcasts_user_id_fkey(username)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ podcasts: (data as PodcastWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  addPodcast: async (podcast) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('podcasts')
        .insert([{ ...podcast, user_id: authUser.id }])
        .select('*, profiles!podcasts_user_id_fkey(username)');
      
      if (error) throw error;
      
      if (data) {
        set({ podcasts: [(data[0] as PodcastWithProfile), ...get().podcasts] });
      }
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  updatePodcast: async (id, podcast) => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .update(podcast)
        .eq('id', id)
        .select('*, profiles!podcasts_user_id_fkey(username)');
      
      if (error) throw error;
      
      if (data) {
        const updated = data[0] as PodcastWithProfile;
        set({
          podcasts: get().podcasts.map(p => p.id === id ? updated : p),
          currentPodcast: updated
        });
      }
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  deletePodcast: async (id) => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set({
        podcasts: get().podcasts.filter(p => p.id !== id),
        currentPodcast: null
      });
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  fetchUserPodcasts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('podcasts')
        .select('*, profiles!podcasts_user_id_fkey(username)')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ podcasts: (data as PodcastWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },
}));