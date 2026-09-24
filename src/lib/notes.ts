import { supabase } from './supabase';
import { fold } from './resources';

/**
 * Notes maison sur les médicaments — jamais sur les patients : le type
 * obligatoire, tiré d'un vocabulaire médicament, cadre l'usage autant que
 * la consigne affichée dans l'éditeur.
 */

export type NoteType =
  | 'posologie'
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
  substance: string | null;
  /** Amendement à une fiche du Sémaphore — quatrième portée. */
  fiche_id: string | null;
  /**
   * Précise une note produit : elle ne vaut que pour CE dosage. La posologie
   * du Dafalgan 80 mg n'est pas celle du 600 mg. Jamais renseigné sans
   * authorization_nr (contrainte SQL).
   */
  dosage_nr: string | null;
  note_type: NoteType;
  body: string;
  verified_on: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

// Six types, six couleurs distinctes : le bandeau prend celle du type, la
// nature de la consigne se lit avant même son texte.
export const TYPES_NOTES: Record<NoteType, { label: string; classes: string }> = {
  posologie: { label: 'Posologie', classes: 'bg-dose-soft text-dose-text' },
  conseil: { label: 'Conseil comptoir', classes: 'bg-accent-soft text-accent' },
  conservation: { label: 'Conservation', classes: 'bg-good-soft text-good-text' },
  substitution: { label: 'Substitution', classes: 'bg-warning-soft text-warning-text' },
  disponibilite: { label: 'Disponibilité', classes: 'bg-critical-soft text-critical-text' },
  remboursement: { label: 'Remboursement', classes: 'bg-surface-2 text-ink-2' },
  preparation: { label: 'Préparation', classes: 'bg-info-soft text-info-text' },
};

const COLONNES =
  'id,authorization_nr,dosage_nr,atc_prefix,substance,fiche_id,note_type,body,verified_on,created_by,created_at,updated_at';

/**
 * Les notes d'une fiche : celles du produit, celles dont le préfixe ATC
 * couvre son code, celles dont le principe actif figure dans ses substances.
 * L'appariement substance se fait ici (texte libre Swissmedic côté produit,
 * inexprimable en filtre PostgREST) — la table des notes est petite.
 *
 * `dosageNr` : la fiche montre un dosage précis. Ses notes propres s'ajoutent
 * à celles du produit entier ; celles des AUTRES dosages sont écartées. Sans
 * dosage (fiche d'autorisation), toutes s'affichent — chacune porte alors le
 * libellé du dosage qu'elle vise.
 */
export async function notesPour(
  authorizationNr: string,
  dosageNr: string | null,
  atcCode: string | null,
  substances: string | null,
): Promise<ProductNote[]> {
  const { data, error } = await supabase
    .from('product_notes')
    .select(COLONNES)
    .order('created_at', { ascending: false });
  if (error) return [];
  const meule = fold(substances ?? '');
  const rows = (data ?? []) as ProductNote[];
  return rows
    .filter((n) => {
      if (n.authorization_nr) {
        if (n.authorization_nr !== authorizationNr) return false;
        return !n.dosage_nr || !dosageNr || n.dosage_nr === dosageNr;
      }
      if (n.atc_prefix) return Boolean(atcCode && atcCode.startsWith(n.atc_prefix));
      if (n.substance) return meule.includes(fold(n.substance));
      return false;
    })
    .sort((a, b) => Number(Boolean(b.authorization_nr)) - Number(Boolean(a.authorization_nr)));
}

/**
 * Les amendements d'une fiche. Un amendement ne réécrit pas la fiche : il
 * s'affiche en tête, daté et signé. C'est le fonctionnement d'un errata —
 * on n'efface pas, on ajoute.
 */
export async function notesPourFiche(ficheId: string): Promise<ProductNote[]> {
  const { data, error } = await supabase
    .from('product_notes')
    .select(COLONNES)
    .eq('fiche_id', ficheId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as ProductNote[];
}

export async function listAllNotes(): Promise<ProductNote[]> {
  const { data, error } = await supabase
    .from('product_notes')
    .select(COLONNES)
    .order('verified_on');
  if (error) return [];
  return (data ?? []) as ProductNote[];
}

/** Exactement UNE portée doit être renseignée — la contrainte SQL le tient. */
export async function createNote(note: {
  authorization_nr?: string | null;
  dosage_nr?: string | null;
  atc_prefix?: string | null;
  substance?: string | null;
  fiche_id?: string | null;
  note_type: NoteType;
  body: string;
}): Promise<void> {
  const { error } = await supabase.from('product_notes').insert(note);
  if (error) throw error;
}

/**
 * Modifier une note ne touche JAMAIS à sa portée. Les champs sont recopiés un
 * à un, au lieu de transmettre l'objet reçu : un objet passé par variable
 * échappe à la vérification d'excès de TypeScript, et c'est exactement ainsi
 * qu'une note de classe ATC, modifiée depuis une fiche, redevenait une note
 * sur ce seul produit — et disparaissait de tous les autres, sans un mot.
 */
export async function updateNote(
  id: string,
  patch: Partial<Pick<ProductNote, 'note_type' | 'body' | 'verified_on'>>,
): Promise<void> {
  const champs: Partial<Pick<ProductNote, 'note_type' | 'body' | 'verified_on'>> = {};
  if (patch.note_type !== undefined) champs.note_type = patch.note_type;
  if (patch.body !== undefined) champs.body = patch.body;
  if (patch.verified_on !== undefined) champs.verified_on = patch.verified_on;
  const { error } = await supabase.from('product_notes').update(champs).eq('id', id);
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
  /** Autorisations portant une note sur le produit ENTIER. */
  auths: Set<string>;
  /** Dosages précis portant une note : clés « autorisation/dosage ». */
  dosages: Set<string>;
  prefixes: string[];
  substances: string[];
  total: number;
  aReverifier: number;
};

/**
 * L'index se déduit des notes déjà chargées : une seule requête sert au
 * marquage des produits ET à la recherche, qui a besoin du corps.
 */
export function indexDepuisNotes(rows: ProductNote[], staleMonths: number): NotesIndex {
  const limite = new Date();
  limite.setMonth(limite.getMonth() - staleMonths);
  return {
    auths: new Set(
      rows.filter((r) => r.authorization_nr && !r.dosage_nr).map((r) => r.authorization_nr!),
    ),
    dosages: new Set(
      rows.filter((r) => r.authorization_nr && r.dosage_nr).map((r) => `${r.authorization_nr}/${r.dosage_nr}`),
    ),
    prefixes: rows.map((r) => r.atc_prefix).filter(Boolean) as string[],
    substances: (rows.map((r) => r.substance).filter(Boolean) as string[]).map(fold),
    total: rows.length,
    aReverifier: rows.filter((r) => new Date(r.verified_on) < limite).length,
  };
}

/**
 * `dosageNr` absent : on demande pour l'autorisation (ligne du catalogue) —
 * une note sur N'IMPORTE LEQUEL de ses dosages suffit à la marquer.
 * `dosageNr` présent : seules comptent les notes de ce dosage ou du produit.
 */
export function estAnnote(
  index: NotesIndex | null,
  authorizationNr: string,
  atcCode: string | null,
  substances?: string | null,
  dosageNr?: string | null,
): boolean {
  if (!index) return false;
  if (index.auths.has(authorizationNr)) return true;
  if (dosageNr) {
    if (index.dosages.has(`${authorizationNr}/${dosageNr}`)) return true;
  } else {
    for (const cle of index.dosages) if (cle.startsWith(`${authorizationNr}/`)) return true;
  }
  if (atcCode && index.prefixes.some((p) => atcCode.startsWith(p))) return true;
  if (substances && index.substances.length > 0) {
    const meule = fold(substances);
    return index.substances.some((sub) => meule.includes(sub));
  }
  return false;
}


/**
 * Copie dans le presse-papier, avec repli pour les contextes où l'API
 * moderne est refusée (navigateur ancien, page non sécurisée). Renvoie la
 * réussite : l'appelant affiche la confirmation, jamais un faux positif.
 */
export async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    try {
      const zone = document.createElement('textarea');
      zone.value = texte;
      zone.setAttribute('readonly', '');
      zone.style.position = 'fixed';
      zone.style.opacity = '0';
      document.body.appendChild(zone);
      zone.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(zone);
      return ok;
    } catch {
      return false;
    }
  }
}
