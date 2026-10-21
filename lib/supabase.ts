import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase client with the anon key, or null while the keys are not set in .env.local.
 * Unlike the reference project this does not throw: without a database the site shows the
 * texts and products from the code (lib/content-defaults.ts, lib/produkty.ts) and /admin says
 * what is missing.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const supabaseChyba =
  "Chýba NEXT_PUBLIC_SUPABASE_URL alebo NEXT_PUBLIC_SUPABASE_ANON_KEY v .env.local (alebo v env premenných hostingu).";
