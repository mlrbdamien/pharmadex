import { supabase } from './supabase';
import type { SearchMiss } from './types';

export async function listMisses(): Promise<SearchMiss[]> {
  const { data, error } = await supabase
    .from('search_misses')
    .select('term,hits,first_seen,last_seen,is_code')
    .order('hits', { ascending: false })
    .order('last_seen', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SearchMiss[];
}

export async function deleteMiss(term: string): Promise<void> {
  const { error } = await supabase.from('search_misses').delete().eq('term', term);
  if (error) throw error;
}
