
import { createClient } from '@supabase/supabase-js';

// Ensure we handle potential whitespace or missing values gracefully
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

const supabaseUrl = envUrl && envUrl.length > 0 ? envUrl : "https://placeholder.supabase.co";
const supabaseAnonKey = envKey && envKey.length > 0 ? envKey : "placeholder-key";

if (!envUrl) {
    console.warn("WARNING: NEXT_PUBLIC_SUPABASE_URL is missing or empty. Using placeholder for build.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
    return envUrl && envUrl.length > 0 && envKey && envKey.length > 0;
};
