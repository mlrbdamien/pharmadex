import { supabase } from './supabase';

/**
 * Le panneau d'administration : accès, état des données, qualité, journal.
 *
 * Tout ce qui, jusqu'ici, obligeait à ouvrir le tableau de bord Supabase —
 * c'est-à-dire, en pratique, à attendre. Les policies (migration 0013)
 * réservent l'écriture aux administrateurs ; l'application ne fait que
 * refléter ce droit, elle ne le décide pas.
 */

export type Acces = {
  email: string;
  label: string | null;
  can_edit: boolean;
  is_admin: boolean;
  created_at: string;
};

export async function listerAcces(): Promise<Acces[]> {
  const { data, error } = await supabase
    .from('allowed_emails')
    .select('email,label,can_edit,is_admin,created_at')
    .order('email');
  if (error) throw error;
  return (data ?? []) as Acces[];
}

export async function ajouterAcces(acces: {
  email: string;
  label: string | null;
  can_edit: boolean;
  is_admin: boolean;
}): Promise<void> {
  const { error } = await supabase
    .from('allowed_emails')
    .insert({ ...acces, email: acces.email.trim().toLowerCase() });
  if (error) throw error;
}

export async function majAcces(
  email: string,
  patch: Partial<Pick<Acces, 'label' | 'can_edit' | 'is_admin'>>,
): Promise<void> {
  const { error } = await supabase.from('allowed_emails').update(patch).eq('email', email);
  if (error) throw error;
}

export async function retirerAcces(email: string): Promise<void> {
  const { error } = await supabase.from('allowed_emails').delete().eq('email', email);
  if (error) throw error;
}

// ---------------------------------------------------------------------------

export type LigneJournal = {
  id: number;
  cible: string;
  cible_id: string | null;
  action: string;
  resume: string | null;
  acteur: string | null;
  at: string;
};

export async function lireJournal(limite = 100): Promise<LigneJournal[]> {
  const { data, error } = await supabase
    .from('journal')
    .select('id,cible,cible_id,action,resume,acteur,at')
    .order('at', { ascending: false })
    .limit(limite);
  if (error) return [];
  return (data ?? []) as LigneJournal[];
}

// ---------------------------------------------------------------------------

export type EtatDonnees = {
  produits: number | null;
  /** Dosages : le niveau que le comptoir identifie (Dafalgan supp 300 mg). */
  dosages: number | null;
  emballages: number | null;
  notices: number | null;
  fiches: number | null;
  /** Date du dernier import Swissmedic — la fraîcheur du catalogue. */
  importLe: string | null;
  /**
   * Dosages portant une dénomination française officielle (Refdata ou OFSP).
   * Comptés sur les DOSAGES : c'est là que vivent les noms depuis 0015. Le
   * même compte sur les autorisations chuterait mécaniquement — le libellé
   * commun n'est officiel que si TOUS les dosages le sont.
   */
  nomsFr: number | null;
};

/**
 * Un `count` en tête de réponse ne rapatrie aucune ligne : compter 6 300
 * produits ne coûte pas plus qu'en compter un.
 */
export async function lireEtatDonnees(): Promise<EtatDonnees> {
  const tete = { count: 'exact' as const, head: true };
  const [produits, dosages, emballages, notices, fiches, nomsFr, dernier] = await Promise.all([
    supabase.from('products').select('*', tete),
    supabase.from('dosages').select('*', tete),
    supabase.from('packages').select('*', tete),
    supabase.from('notices').select('*', tete),
    supabase.from('fiches').select('*', tete),
    supabase.from('dosages').select('*', tete).not('name_fr', 'is', null),
    supabase
      .from('products')
      .select('imported_at')
      .order('imported_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    produits: produits.count,
    dosages: dosages.count,
    emballages: emballages.count,
    notices: notices.count,
    fiches: fiches.count,
    nomsFr: nomsFr.count,
    importLe: dernier.data?.imported_at ?? null,
  };
}
