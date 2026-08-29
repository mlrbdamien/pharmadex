import { supabase } from './supabase';
import { atcLevels } from './products';

/**
 * Notes maison sur les médicaments — jamais sur les patients : le type
 * obligatoire, tiré d'un vocabulaire médicament, cadre l'usage autant que
 * la consigne affichée dans l'éditeur.
 */

export type NoteType =
  | 'conseil'
  | 'conservation'
  | 'substitution'
  | 'disponibilite'
  | 'remboursement'
  | 'preparation';

export type ProductNote = {
  id: string;
  authorization_nr: string | null;
  atc_prefix: string | null;
  note_type: NoteType;
  body: string;
  verified_on: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export const TYPES_NOTES: Record<NoteType, { label: string; classes: string }> = {
  conseil: { label: 'Conseil comptoir', classes: 'bg-accent-soft text-accent' },
  conservation: { label: 'Conservation', classes: 'bg-good-soft text-good-text' },
  substitution: { label: 'Substitution', classes: 'bg-warning-soft text-warning-text' },
  disponibilite: { label: 'Disponibilité', classes: 'bg-critical-soft text-critical-text' },
  remboursement: { label: 'Remboursement', classes: 'bg-surface-2 text-ink-2' },
  preparation: { label: 'Préparation', classes: 'bg-accent-soft text-accent' },
};

const COLONNES =
  'id,authorization_nr,atc_prefix,note_type,body,verified_on,created_by,created_at,updated_at';

/** Les notes d'une fiche : celles du produit, puis celles de sa classe. */
export async function notesPour(
  authorizationNr: string,
  atcCode: string | null,
): Promise<ProductNote[]> {
  const prefixes = atcCode ? atcLevels(atcCode) : [];
  let query = supabase.from('product_notes').select(COLONNES);
  query = prefixes.length
    ? query.or(
        `authorization_nr.eq.${authorizationNr},atc_prefix.in.(${prefixes.join(',')})`,
      )
    : query.eq('authorization_nr', authorizationNr);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];
  const rows = (data ?? []) as ProductNote[];
  return rows.sort((a, b) => Number(Boolean(b.authorization_nr)) - Number(Boolean(a.authorization_nr)));
}

export async function listAllNotes(): Promise<ProductNote[]> {
  const { data, error } = await supabase
    .from('product_notes')
    .select(COLONNES)
    .order('verified_on');
  if (error) return [];
  return (data ?? []) as ProductNote[];
}

export async function createNote(note: {
  authorization_nr: string | null;
  atc_prefix: string | null;
  note_type: NoteType;
  body: string;
}): Promise<void> {
  const { error } = await supabase.from('product_notes').insert(note);
  if (error) throw error;
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<ProductNote, 'note_type' | 'body' | 'verified_on'>>,
): Promise<void> {
  const { error } = await supabase.from('product_notes').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('product_notes').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Index léger des cibles annotées, pour marquer les résultats de recherche
 * et de scan sans requête par ligne. Quelques dizaines de notes au plus :
 * la table entière tient dans un aller-retour.
 */
export type NotesIndex = {
  auths: Set<string>;
  prefixes: string[];
  total: number;
  aReverifier: number;
};

export async function chargerNotesIndex(staleMonths: number): Promise<NotesIndex> {
  const { data, error } = await supabase
    .from('product_notes')
    .select('authorization_nr,atc_prefix,verified_on');
  const rows = error ? [] : (data ?? []);
  const limite = new Date();
  limite.setMonth(limite.getMonth() - staleMonths);
  return {
    auths: new Set(rows.map((r) => r.authorization_nr).filter(Boolean) as string[]),
    prefixes: rows.map((r) => r.atc_prefix).filter(Boolean) as string[],
    total: rows.length,
    aReverifier: rows.filter((r) => new Date(r.verified_on) < limite).length,
  };
}

export function estAnnote(
  index: NotesIndex | null,
  authorizationNr: string,
  atcCode: string | null,
): boolean {
  if (!index) return false;
  if (index.auths.has(authorizationNr)) return true;
  return atcCode ? index.prefixes.some((p) => atcCode.startsWith(p)) : false;
}
