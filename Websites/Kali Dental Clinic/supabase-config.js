// Supabase configuration for KALI Dental Clinic
// Using publishable key only - no service role keys

const SUPABASE_URL = 'https://gwtaaljthqosalpjerrx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_O2WKU5iGpR9y3KnBTrOphA_RHPbz4J6';

let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    if (!supabaseClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      console.log('Supabase client initialized');
    }
    return supabaseClient;
  } else {
    console.error('Supabase library not loaded');
    return null;
  }
}

// Initialize immediately
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
});

// Make available globally
window.getSupabaseClient = initSupabase;
window.supabaseUrl = SUPABASE_URL;
