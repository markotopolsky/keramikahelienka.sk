import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Supabase client with the service role key, for the checkout only (lib/objednavka-akcia.ts):
 * public.vytvor_objednavku may be called by nobody else. The key bypasses RLS, so it lives only in
 * server env variables (no NEXT_PUBLIC_ prefix) and `server-only` stops a client import at build time.
 * null while the key is not set.
 */
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
