import { supabase } from './supabase';

/** Tous les tags connus, pour l'autocomplétion. Alimentés par le trigger SQL. */
export async function listTags(): Promise<string[]> {
  const { data, error } = await supabase.from('tags').select('name').order('name');
  if (error) throw error;
  return (data ?? []).map((row) => row.name);
}

/** Normalisation identique à celle du trigger `sync_tags()` côté Postgres. */
export function normalizeTag(raw: string): string {
  return raw.trim().toLowerCase();
}
