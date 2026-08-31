import type { Section, Stop, Tableau } from './fiches';

/**
 * Conversions texte ↔ structure, pour l'éditeur de fiches.
 *
 * Module volontairement SANS import d'exécution — seuls des types entrent
 * ici. Un aller-retour qui perd du contenu mutilerait une fiche sans rien
 * dire ; il faut pouvoir l'exécuter hors navigateur pour le prouver sur le
 * corpus entier, ce qu'un module tirant Supabase interdirait.
 *
 * Une liste s'édite à raison d'un élément par ligne, un tableau avec des
 * cellules séparées par « | ». Ces conventions ne sont pas un pari : les
 * 36 fiches ne contiennent aucun saut de ligne dans une chaîne de liste, ni
 * aucun « | » dans leurs 2 885 cellules.
 */

export const enLignes = (v?: string[]): string => (v ?? []).join('\n');

export function depuisLignes(t: string): string[] | undefined {
  const lignes = t.split('\n').map((l) => l.trim()).filter(Boolean);
  return lignes.length > 0 ? lignes : undefined;
}

export const tableauEnTexte = (t?: Tableau): string =>
  t ? [t.head, ...t.rows].map((r) => r.join(' | ')).join('\n') : '';

export function texteEnTableau(t: string): Tableau | undefined {
  const lignes = t.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lignes.length === 0) return undefined;
  const [head, ...rows] = lignes.map((l) => l.split('|').map((c) => c.trim()));
  return { head, rows };
}

/** L'aller-retour complet d'une section, tel que l'éditeur le fait subir. */
export function allerRetourSection(s: Section): Section {
  // Clés posées dans l'ordre du modèle — cosmétique en base (jsonb ne
  // conserve pas l'ordre) mais ça garde les diffs lisibles à la lecture.
  const r: Section = { t: s.t };
  if (s.open) r.open = true;
  for (const cle of ['p', 'ul', 'ol'] as const) {
    const v = depuisLignes(enLignes(s[cle]));
    if (v) r[cle] = v;
  }
  const table = texteEnTableau(tableauEnTexte(s.table));
  if (table) r.table = table;
  const check = depuisLignes(enLignes(s.check));
  if (check) r.check = check;
  if (s.triage) {
    r.triage = s.triage.map((t) => ({ ...t, items: depuisLignes(enLignes(t.items)) ?? [] }));
  }
  if (s.stop) {
    const stop: Stop = {};
    if (s.stop.t !== undefined) stop.t = s.stop.t;
    const pp = depuisLignes(enLignes(s.stop.p));
    const uu = depuisLignes(enLignes(s.stop.ul));
    if (pp) stop.p = pp;
    if (uu) stop.ul = uu;
    r.stop = stop;
  }
  const warn = depuisLignes(enLignes(s.warn));
  if (warn) r.warn = warn;
  return r;
}
