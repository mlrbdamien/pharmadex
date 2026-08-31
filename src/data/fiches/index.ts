import { CATALOGUE } from './catalogue';
import type { EntreeFiche, Section, Volet } from './types';
import { fold } from '../../lib/resources';

export { CATALOGUE };
export * from './types';

/**
 * Le contenu des fiches arrive par import dynamique, volet par volet, et
 * reste en mémoire ensuite. Le catalogue, lui, est toujours là : c'est lui
 * qui alimente la recherche du comptoir et le rattachement aux produits.
 */
const cache = new Map<Volet, Record<string, Section[]>>();

export async function chargerVolet(volet: Volet): Promise<Record<string, Section[]>> {
  const deja = cache.get(volet);
  if (deja) return deja;
  let contenu: Record<string, Section[]>;
  if (volet === 'otc') contenu = (await import('./otc')).SECTIONS_OTC;
  else if (volet === 'rx') contenu = (await import('./rx')).SECTIONS_RX;
  else contenu = (await import('./lpd')).SECTIONS_LPD;
  cache.set(volet, contenu);
  return contenu;
}

export async function chargerFiche(id: string): Promise<Section[] | null> {
  const entree = ficheParId(id);
  if (!entree) return null;
  return (await chargerVolet(entree.volet))[id] ?? null;
}

export function ficheParId(id: string): EntreeFiche | undefined {
  return CATALOGUE.find((f) => f.id === id);
}

/**
 * Les fiches que couvre un code ATC complet — même convention que les
 * liaisons `atc_resources` : le préfixe couvre tout ce qui commence par lui.
 * C'est ce qui fait qu'un Temesta scanné remonte la fiche benzodiazépines.
 */
export function fichesPourAtc(atcCode: string | null | undefined): EntreeFiche[] {
  if (!atcCode) return [];
  return CATALOGUE.filter((f) => f.atc?.some((p) => atcCode.startsWith(p)));
}

/**
 * Recherche sur les métadonnées seules — instantanée, sans charger les
 * 424 Ko de contenu. Suffisant au comptoir : on cherche « benzo », « toux »,
 * « R5 », pas une phrase enfouie dans une section.
 */
export function chercherFiches(q: string): EntreeFiche[] {
  const mots = fold(q).split(/\s+/).filter(Boolean);
  if (mots.length === 0) return [];
  return CATALOGUE.filter((f) => {
    const meule = fold(`${f.code} ${f.titre} ${f.sous} ${f.groupe}`);
    return mots.every((m) => meule.includes(m));
  });
}

/** Les groupes d'un volet, dans l'ordre où ils apparaissent au catalogue. */
export function groupesDe(volet: Volet): { groupe: string; fiches: EntreeFiche[] }[] {
  const ordre: string[] = [];
  const par = new Map<string, EntreeFiche[]>();
  for (const f of CATALOGUE) {
    if (f.volet !== volet) continue;
    if (!par.has(f.groupe)) {
      par.set(f.groupe, []);
      ordre.push(f.groupe);
    }
    par.get(f.groupe)!.push(f);
  }
  return ordre.map((groupe) => ({ groupe, fiches: par.get(groupe)! }));
}
