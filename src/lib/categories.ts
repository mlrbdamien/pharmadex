/**
 * Les catégories de remise Swissmedic, telles que le comptoir les lit.
 *
 * Une seule table pour la fiche produit, ses emballages et le filtre du
 * catalogue — il y en avait deux, qui avaient déjà divergé. Swissmedic donne
 * une catégorie à chaque niveau (médicament, dosage, emballage) et écrit
 * « B/D » quand les niveaux inférieurs diffèrent ; on affiche la valeur du
 * niveau montré, sans jamais la déduire.
 */

export type Categorie = { libelle: string; classes: string };

export const CATEGORIES: Record<string, Categorie> = {
  A: { libelle: 'A — ordonnance non renouvelable', classes: 'bg-critical-soft text-critical-text' },
  B: { libelle: 'B — sur ordonnance', classes: 'bg-warning-soft text-warning-text' },
  D: { libelle: 'D — conseil spécialisé', classes: 'bg-accent-soft text-accent' },
  E: { libelle: 'E — vente libre', classes: 'bg-good-soft text-good-text' },
  // TODO(human)
};

/**
 * Une catégorie absente de la table s'affiche quand même, en neutre : un
 * badge muet vaut mieux que pas de badge. C'était le cas de A+ et de B/D,
 * qui n'avaient AUCUN badge — 589 emballages de stupéfiants inclus.
 */
export function categorie(code: string | null | undefined): Categorie | null {
  if (!code) return null;
  return CATEGORIES[code] ?? { libelle: `Catégorie ${code}`, classes: 'bg-surface-2 text-ink-2' };
}

/** Les lettres proposées au filtre du catalogue. */
export const LETTRES_FILTRE = ['A', 'A+', 'B', 'D', 'E'] as const;

/**
 * Les valeurs qu'un filtre doit accepter : un médicament « B/D » a des
 * dosages en B ET en D, il apparaît sous chacune des deux lettres.
 */
export function valeursFiltre(lettre: string): string[] {
  return lettre === 'B' || lettre === 'D' ? [lettre, 'B/D'] : [lettre];
}
