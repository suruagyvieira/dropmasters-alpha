import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Detect if we are in the build phase to avoid crashing during static generation
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test';

// Validation helper
const isValidSupabaseConfig = (url: string | undefined, key: string | undefined): boolean => {
    if (!url || !key) return false;
    if (url.includes('YOUR_SUPABASE_URL') || url === '') return false;
    return url.startsWith('http');
};

// Lazy initialization
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
    if (!isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
        return null;
    }

    if (!supabaseInstance) {
        try {
            supabaseInstance = createClient(supabaseUrl as string, supabaseAnonKey as string, {
                auth: {
                    persistSession: true, // Habilitado para manter login no navegador
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
            return null;
        }
    }

    return supabaseInstance;
};

// For backwards compatibility
export const supabase = isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)
    ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    })
    : null;
