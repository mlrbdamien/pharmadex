import { supabase } from './supabase';
import type { Resource, ResourceDraft } from './types';
import { todayISO } from './format';

/**
 * Colonnes demandées explicitement : `select('*')` rapatrierait aussi
 * `search_vector`, qui pèse plus lourd que tout le reste de la ligne et ne
 * sert à rien côté navigateur.
 */
// `as const` n'est pas cosmétique : supabase-js déduit le type des lignes en
// analysant CE littéral. Une concaténation le réduirait à `string` et toutes
// les requêtes retomberaient sur un type d'erreur générique.
const COLUMNS =
  'id,title,description,url,file_path,file_name,file_size,mime_type,tags,pinned,verified_on,owner,broken,last_checked_at,last_status,created_at,created_by,updated_at' as const;

const BUCKET = 'resources';

// ---------------------------------------------------------------------------
// Lecture
// ---------------------------------------------------------------------------

/**
 * Toutes les ressources, en une fois. À l'échelle d'une officine (quelques
 * centaines de lignes, quelques dizaines de Ko) c'est le meilleur compromis :
 * le filtre par tag et la vue d'accueil deviennent instantanés, sans réseau.
 */
export async function listAll(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select(COLUMNS)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getResource(id: string): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select(COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Recherche plein texte française, accents ignorés, préfixes acceptés. */
export async function searchResources(q: string): Promise<Resource[]> {
  const { data, error } = await supabase.rpc('search_resources', { q }).select(COLUMNS);
  if (error) throw error;
  return data ?? [];
}

/** Au-delà de cet âge, une ressource jamais revue est considérée à revérifier. */
export const STALE_MONTHS = 12;

/**
 * Une ressource est « à revérifier » quand sa dernière vérification (ou, à
 * défaut, sa création) remonte à plus de STALE_MONTHS. C'est ce qui donne un
 * sens au champ « vérifié le » : sans rappel, la date n'est que décorative —
 * et en officine, un protocole périmé est plus dangereux qu'un lien mort.
 */
export function isStale(resource: Resource): boolean {
  const reference = resource.verified_on ?? resource.created_at;
  const date = new Date(reference);
  if (Number.isNaN(date.getTime())) return false;
  const limite = new Date();
  limite.setMonth(limite.getMonth() - STALE_MONTHS);
  return date < limite;
}

// ---------------------------------------------------------------------------
// Filtrage local — affiché pendant que la requête réseau est en vol, pour que
// l'écran ne soit jamais vide entre deux frappes.
// ---------------------------------------------------------------------------

/** « Pédiatrie » → « pediatrie ». Miroir de la config SQL `fr_unaccent`. */
export function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function localFilter(resources: Resource[], q: string): Resource[] {
  const needle = fold(q.trim());
  if (!needle) return resources;
  const words = needle.split(/\s+/);
  return resources.filter((r) => {
    const haystack = fold(`${r.title} ${r.description ?? ''} ${r.tags.join(' ')}`);
    return words.every((w) => haystack.includes(w));
  });
}

// ---------------------------------------------------------------------------
// Écriture (éditeurs uniquement — la RLS refuse le reste)
// ---------------------------------------------------------------------------

export async function createResource(draft: ResourceDraft): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .insert(draft)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function updateResource(
  id: string,
  patch: Partial<ResourceDraft>,
): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .update(patch)
    .eq('id', id)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteResource(resource: Resource): Promise<void> {
  if (resource.file_path) {
    await supabase.storage.from(BUCKET).remove([resource.file_path]);
  }
  const { error } = await supabase.from('resources').delete().eq('id', resource.id);
  if (error) throw error;
}

/** « Revérifié aujourd'hui » — un geste, pas un formulaire. */
export async function markVerified(id: string): Promise<Resource> {
  return updateResource(id, { verified_on: todayISO() });
}

export async function togglePinned(id: string, pinned: boolean): Promise<Resource> {
  return updateResource(id, { pinned });
}

// ---------------------------------------------------------------------------
// Fichiers
// ---------------------------------------------------------------------------

export type UploadedFile = {
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
};

export async function uploadFile(file: File): Promise<UploadedFile> {
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'bin';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (error) throw error;
  return {
    file_path: path,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type || 'application/octet-stream',
  };
}

/** Le bucket est privé : tout accès passe par une URL signée à durée limitée. */
export async function signedUrl(path: string, seconds = 3600): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, seconds);
  if (error) throw error;
  return data.signedUrl;
}

/** Ouvre une ressource dans un nouvel onglet, lien ou fichier. */
export async function openResource(resource: Resource): Promise<void> {
  if (resource.url) {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    return;
  }
  if (!resource.file_path) return;

  // La fenêtre doit être ouverte DANS le geste utilisateur : après l'await de
  // l'URL signée, le bloqueur de pop-up la refuserait. (Pas de flag `noopener`
  // ici : il ferait renvoyer `null` par window.open, on coupe le lien à la main.)
  const tab = window.open('', '_blank');
  if (tab) tab.opener = null;
  try {
    const url = await signedUrl(resource.file_path);
    if (tab) tab.location.href = url;
    else window.location.href = url;
  } catch (error) {
    tab?.close();
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Récupération du titre d'une page (Edge Function : le CORS interdit de le
// faire depuis le navigateur)
// ---------------------------------------------------------------------------

export async function fetchTitle(url: string): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke<{ title?: string }>('fetch-title', {
    body: { url },
  });
  if (error) return null;
  return data?.title?.trim() || null;
}

// ---------------------------------------------------------------------------
// Journal des recherches vides
// ---------------------------------------------------------------------------

/**
 * Décide si un terme resté sans résultat mérite d'être consigné.
 *
 * Appelée uniquement après 2 s sans frappe, avec 0 résultat côté serveur, sur
 * un terme déjà trimé. `lastLogged` est le dernier terme consigné dans cette
 * session (null au démarrage).
 *
 * Le délai écarte déjà l'essentiel des états intermédiaires de frappe ; cette
 * fonction rattrape ce qui passe au travers.
 */
export function shouldLogMiss(term: string, lastLogged: string | null): boolean {
  // Un code-barres arrive d'un bloc, jamais lettre par lettre : aucune raison
  // de le filtrer, et c'est la matière première de la v2 « produits ».
  if (/^[0-9]{8,14}$/.test(term)) return true;

  // Plus exigeant que le garde-fou SQL (3) : au comptoir, un besoin réel fait
  // rarement moins de quatre caractères.
  if (term.length < 4) return false;
  if (!lastLogged) return true;

  const current = term.toLowerCase();
  const previous = lastLogged.toLowerCase();

  // « grossesse » puis « grossesse alcool » : une seule recherche qui se
  // précise, pas deux besoins distincts. On n'en garde qu'un.
  //
  // Le terme retenu est le plus court des deux, faute de pouvoir revenir en
  // arrière (le compte comptoir n'a pas le droit de supprimer). Avec le délai
  // de 2 s en amont, le cas est devenu rare : il faut une pause franche en
  // plein milieu d'une saisie pour le déclencher.
  return !current.startsWith(previous) && !previous.startsWith(current);
}

export async function logSearchMiss(term: string): Promise<void> {
  const { error } = await supabase.rpc('log_search_miss', { q: term });
  // Un échec ici ne doit jamais gêner la recherche en cours : le journal est
  // un bonus, pas une fonctionnalité du comptoir.
  if (error) console.warn('log_search_miss', error.message);
}
