/**
 * Références externes du comptoir, intégrées à la fiche produit.
 *
 * Ce que chaque site permet a été vérifié :
 * - Le CRAT (grossesse/allaitement) accepte les recherches en URL (?s=).
 * - SwissPedDose est derrière un login : pas de lien profond possible. On
 *   ouvre la base et on copie la substance dans le presse-papier — la session
 *   du poste persiste après la première connexion.
 * - Guidelines SSI : recherche non adressable par URL, organisation par
 *   indication et non par substance → ressource épinglée, pas de bouton fiche.
 */

export const SWISSPEDDOSE_URL = 'https://db.swisspeddose.ch';

/** Sels et formes à écarter avant de chercher : ils polluent la requête. */
const SELS = new Set([
  'hydrochloridum', 'hydrochloridi', 'sulfas', 'sulfatis', 'natricum',
  'kalicum', 'calcicum', 'dinatricum', 'maleas', 'tartras', 'mesilas',
  'phosphas', 'nitras', 'bromidum', 'anhydricum', 'monohydricum',
  'dihydricum', 'trihydricum', 'hemihydricum',
]);

/**
 * « lamivudinum » → « lamivudine », « acidum acetylsalicylicum » →
 * « acide acetylsalicylique », « propranololi » → « propranolol ».
 * Heuristique validée contre la recherche du CRAT — approximative par
 * construction : en cas d'échec, l'utilisateur atterrit sur la recherche du
 * site avec un terme proche, jamais dans le vide.
 */
export function franciserSubstance(latin: string): string {
  const words: string[] = [];
  for (let w of latin.toLowerCase().trim().split(/\s+/)) {
    if (SELS.has(w)) continue;
    for (const [suffixe, remplacement] of [
      ['icum', 'ique'],
      ['inum', 'ine'],
      ['olum', 'ol'],
      ['um', 'e'],
    ] as const) {
      if (w.endsWith(suffixe)) {
        w = w.slice(0, -suffixe.length) + remplacement;
        break;
      }
    }
    if (w.endsWith('i') && w.length > 4) w = w.slice(0, -1); // génitif latin
    words.push(w);
  }
  return words.join(' ');
}

/** Les substances d'un produit, prêtes pour une recherche (3 au plus). */
export function substancesRecherchables(substances: string | null): string[] {
  if (!substances) return [];
  return substances
    .split(/[;,]/)
    .map((s) => franciserSubstance(s))
    .filter((s) => s.length > 2)
    .slice(0, 3);
}

export function lecratUrl(substance: string): string {
  return `https://www.lecrat.fr/?s=${encodeURIComponent(substance)}`;
}
