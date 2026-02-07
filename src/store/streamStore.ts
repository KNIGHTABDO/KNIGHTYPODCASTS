import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Stream = Database['public']['Tables']['streams']['Row'];

type StreamWithProfile = Stream & {
  profiles: { username: string } | null;
};

interface StreamState {
  streams: StreamWithProfile[];
  featuredStreams: StreamWithProfile[];
  currentStream: StreamWithProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchStreams: () => Promise<void>;
  fetchFeaturedStreams: () => Promise<void>;
  fetchStreamById: (id: string) => Promise<void>;
  fetchStreamsByUserId: (userId: string) => Promise<void>;
  addStream: (stream: Omit<Stream, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updateStream: (id: string, stream: Partial<Stream>) => Promise<{ error: string | null }>;
  deleteStream: (id: string) => Promise<{ error: string | null }>;
  fetchUserStreams: () => Promise<void>;
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

export const useStreamStore = create<StreamState>((set, get) => ({
  streams: [],
  featuredStreams: [],
  currentStream: null,
  isLoading: false,
  error: null,

  fetchStreams: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles!streams_user_id_fkey(username)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ streams: (data as StreamWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchFeaturedStreams: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles!streams_user_id_fkey(username)')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      set({ featuredStreams: (data as StreamWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchStreamById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles!streams_user_id_fkey(username)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentStream: data as StreamWithProfile, isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchStreamsByUserId: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles!streams_user_id_fkey(username)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ streams: (data as StreamWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  addStream: async (stream) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('streams')
        .insert([{ ...stream, user_id: authUser.id }])
        .select('*, profiles!streams_user_id_fkey(username)');
      
      if (error) throw error;
      
      if (data) {
        set({ streams: [(data[0] as StreamWithProfile), ...get().streams] });
      }
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  updateStream: async (id, stream) => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .update(stream)
        .eq('id', id)
        .select('*, profiles!streams_user_id_fkey(username)');
      
      if (error) throw error;
      
      if (data) {
        const updated = data[0] as StreamWithProfile;
        set({
          streams: get().streams.map(p => p.id === id ? updated : p),
          currentStream: updated
        });
      }
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  deleteStream: async (id) => {
    try {
      const { error } = await supabase
        .from('streams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set({
        streams: get().streams.filter(p => p.id !== id),
        currentStream: null
      });
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  fetchUserStreams: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles!streams_user_id_fkey(username)')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ streams: (data as StreamWithProfile[]) || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },
}));