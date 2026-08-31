import { supabase } from './supabase';
import { fold } from './resources';

/**
 * L'aide-mémoire de comptoir : 36 fiches venues du projet comptoir-otc,
 * désormais en base et modifiables depuis l'application.
 *
 * Le contenu était statique et compilé ; le journal git tenait lieu de trace
 * de validation. Cette trace repose maintenant sur `verifie_le` et
 * `updated_by` — et surtout sur la discipline de qui édite : les règles de
 * sourcing (aucun contenu de mémoire, tout vérifié en ligne et daté,
 * marqueur `non vérifié`) sont dans CLAUDE.md et n'ont pas d'équivalent
 * technique. Un formulaire n'empêche personne d'écrire de mémoire.
 */

export type Volet = 'otc' | 'rx' | 'lpd';

export const LIBELLES_VOLET: Record<Volet, string> = {
  otc: 'Conseil OTC',
  rx: 'Ordonnances',
  lpd: 'Données',
};

/** Niveau d'orientation N1–N4 : quand voir un médecin, et où. */
export type Triage = { n: 1 | 2 | 3 | 4; quand: string; ou: string; items: string[] };

/** Bloc « ne pas délivrer » — la contre-indication ferme. */
export type Stop = { t?: string | null; p?: string[]; ul?: string[] };

export type Tableau = { head: string[]; rows: string[][] };

/**
 * Les clés d'une section, rendues dans un ordre FIXE (voir FicheView) :
 * p → ul → ol → table → check → triage → stop → warn. C'est ce qui permet à
 * l'éditeur d'être un formulaire à huit champs facultatifs plutôt qu'un
 * agenceur de blocs : l'ordre n'est pas une décision de rédaction.
 *
 * Les chaînes portent du HTML en ligne d'un vocabulaire clos : `<b>`,
 * `<em>`, `<i>`, `<a>`, et `<span class="dose|cat|n|nv|tel">`.
 */
export type Section = {
  t: string;
  open?: boolean;
  p?: string[];
  ul?: string[];
  ol?: string[];
  table?: Tableau;
  check?: string[];
  triage?: Triage[];
  stop?: Stop;
  warn?: string[];
};

/** Les métadonnées d'une fiche — ce que le catalogue garde en mémoire. */
export type EntreeFiche = {
  id: string;
  code: string;
  groupe: string;
  titre: string;
  sous: string;
  volet: Volet;
  remise: string | null;
  /**
   * Préfixes ATC couverts. Un produit dont le code commence par l'un d'eux
   * fait remonter la fiche — même convention que `atc_resources`. C'est le
   * lien qui justifie que l'aide-mémoire vive dans Pharmadex.
   */
  atc: string[];
  rang: number;
  verifie_le: string;
  updated_at: string;
  updated_by: string | null;
};

export type Fiche = EntreeFiche & { sections: Section[] };

const META =
  'id,code,groupe,titre,sous,volet,remise,atc,rang,verifie_le,updated_at,updated_by';

/**
 * Le catalogue seul : 36 lignes de métadonnées, sans les sections. C'est lui
 * qui alimente la recherche du comptoir et le rattachement aux produits — les
 * 424 Ko de contenu ne doivent jamais transiter pour afficher une liste.
 */
export async function listerFiches(): Promise<EntreeFiche[]> {
  const { data, error } = await supabase
    .from('fiches')
    .select(META)
    .order('rang');
  if (error) return [];
  return (data ?? []) as EntreeFiche[];
}

export async function lireFiche(id: string): Promise<Fiche | null> {
  const { data, error } = await supabase
    .from('fiches')
    .select(`${META},sections`)
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Fiche;
}

export type BrouillonFiche = Partial<
  Pick<EntreeFiche, 'code' | 'groupe' | 'titre' | 'sous' | 'volet' | 'remise' | 'atc' | 'rang' | 'verifie_le'>
> & { sections?: Section[] };

export async function enregistrerFiche(id: string, patch: BrouillonFiche): Promise<void> {
  const { error } = await supabase
    .from('fiches')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/** Une création exige de quoi ranger la fiche : identité, volet, groupe. */
export type NouvelleFiche = BrouillonFiche &
  Pick<EntreeFiche, 'id' | 'code' | 'groupe' | 'titre' | 'volet'>;

export async function creerFiche(fiche: NouvelleFiche): Promise<void> {
  const { error } = await supabase.from('fiches').insert(fiche);
  if (error) throw error;
}

export async function supprimerFiche(id: string): Promise<void> {
  const { error } = await supabase.from('fiches').delete().eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Lectures dérivées — sur le catalogue déjà en mémoire, sans requête
// ---------------------------------------------------------------------------

export function fichesPourAtc(
  catalogue: EntreeFiche[],
  atcCode: string | null | undefined,
): EntreeFiche[] {
  if (!atcCode) return [];
  return catalogue.filter((f) => f.atc?.some((prefixe) => atcCode.startsWith(prefixe)));
}

/**
 * Recherche sur les métadonnées seules. Suffisant au comptoir : on cherche
 * « benzo », « toux », « R5 » — pas une phrase enfouie dans une section.
 */
export function chercherFiches(catalogue: EntreeFiche[], q: string): EntreeFiche[] {
  const mots = fold(q).split(/\s+/).filter(Boolean);
  if (mots.length === 0) return [];
  return catalogue.filter((f) => {
    const meule = fold(`${f.code} ${f.titre} ${f.sous} ${f.groupe}`);
    return mots.every((m) => meule.includes(m));
  });
}

/** Les groupes d'un volet, dans l'ordre de rang. */
export function groupesDe(
  catalogue: EntreeFiche[],
  volet: Volet,
): { groupe: string; fiches: EntreeFiche[] }[] {
  const ordre: string[] = [];
  const par = new Map<string, EntreeFiche[]>();
  for (const f of catalogue) {
    if (f.volet !== volet) continue;
    if (!par.has(f.groupe)) {
      par.set(f.groupe, []);
      ordre.push(f.groupe);
    }
    par.get(f.groupe)!.push(f);
  }
  return ordre.map((groupe) => ({ groupe, fiches: par.get(groupe)! }));
}

/** Un identifiant stable tiré du code : « R10 » → « r10 ». */
export function idDepuisCode(code: string): string {
  return fold(code).replace(/[^a-z0-9]+/g, '') || `f${Date.now()}`;
}
