import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-key';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Use a placeholder valid URL if the env var is missing/invalid so the client
// can be constructed without throwing. All network calls will simply fail
// gracefully instead of crashing the entire app at import time.
const safeUrl = isValidUrl(supabaseUrl) ? supabaseUrl : FALLBACK_URL;
const safeKey = supabaseAnonKey || FALLBACK_KEY;

export const supabase: SupabaseClient<Database> = createClient<Database>(safeUrl, safeKey);
export const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey !== '' && supabaseAnonKey !== FALLBACK_KEY;