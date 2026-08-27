import { supabase } from './supabase';
import type { ProductRow, ScanHit } from './types';

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
  // TODO(human) : implémentation à valider douchette en main — la version
  // ci-dessous ne couvre que les cas EAN-13 et GTIN-14 nus.
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

/** Résolution groupée code → nom de produit, pour le journal. */
export async function resolveCodes(codes: string[]): Promise<Map<string, string>> {
  if (codes.length === 0) return new Map();
  const { data, error } = await supabase.rpc('resolve_codes', { codes });
  if (error) return new Map();
  return new Map((data ?? []).map((row) => [row.code, row.name]));
}
