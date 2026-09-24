import { supabase } from './supabase';
import type { DosageHit, ProductRow, ScanHit } from './types';

/**
 * Détecte si la saisie ressemble à un code scanné plutôt qu'à du texte.
 * Volontairement plus strict que le `is_code` du journal (8–14 chiffres) :
 * seuls les GTIN complets et les trames GS1 déclenchent la voie « produit ».
 */
export function looksLikeScan(raw: string): boolean {
  return normalizeScannedCode(raw) !== null;
}

/**
 * Extrait un GTIN-13 de ce qu'émet réellement une douchette.
 *
 * Reçoit la saisie brute (déjà trimée). Renvoie 13 chiffres, ou null si la
 * saisie n'est pas un code exploitable (auquel cas la recherche texte
 * normale s'applique).
 *
 * Cas connus à arbitrer selon les douchettes de l'officine :
 *  - EAN-13 nu :            « 7680317060015 »
 *  - GTIN-14 :              « 07680317060015 » (zéro de tête à retirer)
 *  - Trame GS1 DataMatrix : « 0107680317060015172708...10ABC123 » — l'AI 01
 *    (2 chiffres) est suivi du GTIN-14 ; le reste (péremption 17, lot 10,
 *    numéro de série 21) est à ignorer. Certaines douchettes insèrent un
 *    caractère GS (\x1d) ou un ']d2' d'en-tête de symbologie.
 */
export function normalizeScannedCode(raw: string): string | null {
  // À VALIDER douchette en main (test : scanner une boîte dans la barre de
  // recherche) — la version ci-dessous ne couvre que les cas EAN-13 et
  // GTIN-14 nus, pas les trames GS1 DataMatrix décrites ci-dessus.
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 13) return digits;
  if (digits.length === 14 && digits.startsWith('0')) return digits.slice(1);
  return null;
}

/** Scan → produit + ressources liées. Null si le code est inconnu. */
export async function scanGtin(code: string): Promise<ScanHit | null> {
  const { data, error } = await supabase.rpc('scan_gtin', { code });
  if (error) throw error;
  return (data as ScanHit | null) ?? null;
}

/**
 * Dosages dont le nom, celui de leur autorisation ou le principe actif
 * correspond à la saisie — une ligne PAR DOSAGE. « dafalgan 300 » trouve le
 * suppositoire à 300 mg sous son propre nom, au lieu du seul 80 mg que
 * l'ancien import laissait subsister.
 */
export async function searchDosages(q: string): Promise<DosageHit[]> {
  const { data, error } = await supabase.rpc('search_dosages', { q });
  if (error) return [];
  return data ?? [];
}

/**
 * L'adresse d'une fiche. Le dosage passe en paramètre plutôt qu'en segment :
 * « /p/47505 » reste valide pour les liens déjà partagés, les notes et le
 * journal, qui ne désignent qu'une autorisation.
 */
export function routeProduit(nr: string, dosageNr?: string | null, gtin?: string | null): string {
  const params = new URLSearchParams();
  if (dosageNr) params.set('d', dosageNr);
  if (gtin) params.set('g', gtin);
  const q = params.toString();
  return `/p/${nr}${q ? `?${q}` : ''}`;
}

/**
 * Produits dont le nom ou le principe actif correspond à la saisie.
 * « Inderal » au clavier vaut un scan de la boîte — et « propranolol »
 * trouve aussi les génériques.
 */
export async function searchProducts(q: string): Promise<ProductRow[]> {
  const { data, error } = await supabase.rpc('search_products', { q });
  if (error) return [];
  return data ?? [];
}

/** Fiche complète d'un produit (même forme qu'un scan, conditionnement en moins). */
export async function productHit(authorizationNr: string): Promise<ScanHit | null> {
  const { data, error } = await supabase.rpc('product_hit', { auth: authorizationNr });
  if (error) throw error;
  return (data as ScanHit | null) ?? null;
}

// ---------------------------------------------------------------------------
// Liaisons (éditeurs — la RLS refuse le reste)
// ---------------------------------------------------------------------------

export async function linkProduct(authorizationNr: string, resourceId: string): Promise<void> {
  const { error } = await supabase
    .from('product_resources')
    .insert({ authorization_nr: authorizationNr, resource_id: resourceId });
  // 23505 = liaison déjà existante : un double clic n'est pas une erreur.
  if (error && error.code !== '23505') throw error;
}

export async function unlinkProduct(authorizationNr: string, resourceId: string): Promise<void> {
  const { error } = await supabase
    .from('product_resources')
    .delete()
    .eq('authorization_nr', authorizationNr)
    .eq('resource_id', resourceId);
  if (error) throw error;
}

export async function linkAtc(atcPrefix: string, resourceId: string): Promise<void> {
  const { error } = await supabase
    .from('atc_resources')
    .insert({ atc_prefix: atcPrefix, resource_id: resourceId });
  if (error && error.code !== '23505') throw error;
}

export async function unlinkAtc(atcPrefix: string, resourceId: string): Promise<void> {
  const { error } = await supabase
    .from('atc_resources')
    .delete()
    .eq('atc_prefix', atcPrefix)
    .eq('resource_id', resourceId);
  if (error) throw error;
}

/**
 * Niveaux de liaison possibles pour un code ATC complet.
 * 'M01AE01' → ['M', 'M01', 'M01A', 'M01AE', 'M01AE01'] — les découpes
 * standard de la classification (groupe anatomique → substance).
 */
export function atcLevels(atc: string): string[] {
  const cuts = [1, 3, 4, 5, 7];
  return cuts.filter((n) => atc.length >= n).map((n) => atc.slice(0, n));
}

/** Résolution groupée code → produit, pour le journal (nom + lien de fiche). */
export async function resolveCodes(
  codes: string[],
): Promise<Map<string, { name: string; nr: string }>> {
  if (codes.length === 0) return new Map();
  const { data, error } = await supabase.rpc('resolve_codes', { codes });
  if (error) return new Map();
  return new Map(
    (data ?? []).map((row) => [row.code, { name: row.name, nr: row.authorization_nr }]),
  );
}

// ---------------------------------------------------------------------------
// Fiche produit (v3)
// ---------------------------------------------------------------------------

export type PackageRow = {
  gtin: string;
  authorization_nr: string;
  /** Le dosage de l'emballage : la fiche en liste ceux du dosage affiché. */
  dosage_nr: string | null;
  /** Catégorie propre à l'emballage — elle diffère de celle du dosage pour 39 dosages. */
  category: string | null;
  pack_code: string;
  description: string | null;
  description_fr: string | null;
  price_public: number | null;
};

/**
 * Le libellé à afficher : la dénomination officielle française quand elle
 * existe (Refdata, puis OFSP), sinon la donnée Swissmedic traduite par table.
 */
export function libelleFr<T extends { name?: string | null; name_fr?: string | null }>(
  ligne: T,
): string {
  return ligne.name_fr || ligne.name || '';
}

export async function listPackages(authorizationNr: string): Promise<PackageRow[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('gtin,authorization_nr,dosage_nr,category,pack_code,description,description_fr,price_public')
    .eq('authorization_nr', authorizationNr)
    .order('pack_code');
  if (error) throw error;
  return data ?? [];
}

/** Produits de même code ATC complet : génériques et apparentés directs. */
export async function listGenerics(atcCode: string, excludeNr: string): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('atc_code', atcCode)
    .neq('authorization_nr', excludeNr)
    .order('name')
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export type LinkDetail = {
  /** resource_id → liée directement au produit ? */
  direct: Set<string>;
  /** resource_id → préfixes ATC par lesquels elle est liée. */
  byPrefix: Map<string, string[]>;
};

/**
 * Détail des liaisons d'un produit : par quel chemin chaque ressource lui
 * est-elle rattachée ? Nécessaire pour délier au bon niveau — délier une
 * liaison de classe depuis la fiche d'UN produit retire la ressource de
 * toute la classe, l'interface doit le dire.
 */
export async function linkDetails(
  authorizationNr: string,
  atcCode: string | null,
): Promise<LinkDetail> {
  const [direct, prefixes] = await Promise.all([
    supabase
      .from('product_resources')
      .select('resource_id')
      .eq('authorization_nr', authorizationNr),
    atcCode
      ? supabase
          .from('atc_resources')
          .select('atc_prefix,resource_id')
          .in('atc_prefix', atcLevels(atcCode))
      : Promise.resolve({ data: [], error: null }),
  ]);

  const byPrefix = new Map<string, string[]>();
  for (const row of prefixes.data ?? []) {
    const list = byPrefix.get(row.resource_id) ?? [];
    list.push(row.atc_prefix);
    byPrefix.set(row.resource_id, list);
  }
  return {
    direct: new Set((direct.data ?? []).map((row) => row.resource_id)),
    byPrefix,
  };
}

export type ResourceLinks = {
  products: { authorization_nr: string; name: string }[];
  atc: { prefix: string; product_count: number }[];
};

/** Le revers : à quoi cette ressource est-elle rattachée ? (fiche ressource) */
export async function resourceLinks(resourceId: string): Promise<ResourceLinks> {
  const { data, error } = await supabase.rpc('resource_links', { rid: resourceId });
  if (error) throw error;
  return (data as ResourceLinks) ?? { products: [], atc: [] };
}

// ---------------------------------------------------------------------------
// Liaison manuelle fiche du Sémaphore ↔ médicament
//
// Les préfixes ATC d'une fiche la font remonter sur toute une classe : large,
// sans entretien, mais aveugle aux cas d'espèce. Cette liaison-ci est le
// pendant fin, produit par produit — même dualité que atc_resources /
// product_resources.
// ---------------------------------------------------------------------------

export async function listFichesLiees(authorizationNr: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('product_fiches')
    .select('fiche_id')
    .eq('authorization_nr', authorizationNr);
  if (error) return [];
  return (data ?? []).map((ligne) => ligne.fiche_id);
}

export async function linkFiche(authorizationNr: string, ficheId: string): Promise<void> {
  const { error } = await supabase
    .from('product_fiches')
    .insert({ authorization_nr: authorizationNr, fiche_id: ficheId });
  // 23505 = liaison déjà existante : un double clic n'est pas une erreur.
  if (error && error.code !== '23505') throw error;
}

export async function unlinkFiche(authorizationNr: string, ficheId: string): Promise<void> {
  const { error } = await supabase
    .from('product_fiches')
    .delete()
    .eq('authorization_nr', authorizationNr)
    .eq('fiche_id', ficheId);
  if (error) throw error;
}
