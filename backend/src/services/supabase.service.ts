import { config } from "../config/index.js";
import { createClient } from "@supabase/supabase-js";

let _supabase: ReturnType<typeof createClient> | null = null;
let _serviceSupabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return _supabase;
}

export function getServiceSupabase() {
  if (!_serviceSupabase) {
    _serviceSupabase = createClient(config.supabase.url, config.supabase.serviceKey);
  }
  return _serviceSupabase;
}

// Verify a Supabase JWT and return the user, or null
export async function verifyToken(token: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
