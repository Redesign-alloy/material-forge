 // External Supabase client for user's own Supabase project
 import { createClient } from '@supabase/supabase-js';
 
 // Get the external Supabase credentials from environment
 // These are set via Lovable secrets and exposed through edge functions
 // For client-side, we'll use the Supabase instance configured in the app
 
 // The external Supabase URL and key will be fetched from edge function
 // or we use the environment variables if available
 const EXTERNAL_SUPABASE_URL = 'https://lvzqojywrzhhddxoinps.supabase.co';
 const EXTERNAL_SUPABASE_ANON_KEY = import.meta.env.VITE_EXTERNAL_SUPABASE_ANON_KEY || '';
 
 // Create the external Supabase client
 // This connects to the user's external Supabase project
 export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
   auth: {
     storage: localStorage,
     persistSession: true,
     autoRefreshToken: true,
     storageKey: 'external-supabase-auth',
   }
 });
 
 // Export the URL for reference
 export const EXTERNAL_URL = EXTERNAL_SUPABASE_URL;