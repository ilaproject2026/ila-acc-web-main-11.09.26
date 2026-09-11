import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder-project.supabase.co'
);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials are not defined or are placeholders. App will run in offline/local mock mode.');
}

// Fallback dummy credentials to prevent createClient from throwing on module evaluation
const safeUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const safeAnonKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(safeUrl, safeAnonKey);
export const supabaseAdmin = (supabaseServiceKey && supabaseUrl)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

