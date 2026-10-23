import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://djqbekzksyrfratdhalt.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_bkgbsuqzFmwGcJWV7ks2Wg_zkdJIe5X';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const STORAGE_BUCKET = 'photos';
