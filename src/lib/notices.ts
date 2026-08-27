import { supabase } from './supabase';

/**
 * Rapporte le HTML d'une notice via l'Edge Function fetch-notice.
 * files.refdata.ch n'expose pas de CORS, et la passerelle Supabase interdit
 * de SERVIR du HTML rendu : l'application récupère donc le texte et le rend
 * elle-même (iframe srcdoc). Null en cas d'échec — la fiche reste utilisable.
 */
export async function fetchNoticeHtml(htmlUrl: string): Promise<string | null> {
  const doc = htmlUrl.split('/').pop() ?? '';
  const { data, error } = await supabase.functions.invoke<string>('fetch-notice', {
    body: { doc },
  });
  if (error || typeof data !== 'string') return null;
  return data;
}

export type Notice = {
  authorization_nr: string;
  doc_type: 'SmPC' | 'PIL' | 'PL';
  lang: 'de' | 'fr' | 'it' | 'en';
  description: string | null;
  html_url: string;
  pdf_url: string | null;
  updated_on: string | null;
};

/**
 * Notices d'un produit, langue préférée d'abord (fr, puis de, it, en).
 * Le repli linguistique compte : ~3 % des notices n'existent pas en français.
 */
export async function listNotices(authorizationNr: string): Promise<Notice[]> {
  const { data, error } = await supabase
    .from('notices')
    .select('authorization_nr,doc_type,lang,description,html_url,pdf_url,updated_on')
    .eq('authorization_nr', authorizationNr);
  // La notice est un enrichissement : son absence (table pas encore migrée,
  // panne d'import) ne doit jamais casser la fiche produit.
  if (error) return [];
  const order = { fr: 0, de: 1, it: 2, en: 3 } as const;
  return ((data ?? []) as Notice[]).sort((a, b) => order[a.lang] - order[b.lang]);
}

/** Pour chaque type de document, la notice dans la meilleure langue disponible. */
export function bestByType(notices: Notice[]): Partial<Record<Notice['doc_type'], Notice>> {
  const best: Partial<Record<Notice['doc_type'], Notice>> = {};
  for (const notice of notices) {
    if (!best[notice.doc_type]) best[notice.doc_type] = notice;
  }
  return best;
}

export type NoticeShortcut = {
  /** Libellé du bouton, court — il s'affiche au comptoir. */
  label: string;
  /** Ancre dans le HTML de la notice (#sectionN). */
  anchor: string;
};

/**
 * Raccourcis de rubriques affichés au-dessus de la notice intégrée : un clic
 * fait défiler jusqu'à la rubrique.
 *
 * Numérotation VÉRIFIÉE sur les documents réels (deux FI et deux notices
 * patient concordantes) — elle diffère de l'ordre théorique des rubriques :
 * les FI commencent à #section1 = Composition.
 *
 * FI (SmPC) : 1 composition · 2 forme · 3 indications · 4 posologie ·
 * 5 contre-indications · 6 mises en garde · 7 interactions · 8 grossesse/
 * allaitement · 9 conduite · 10 effets indésirables · 11 surdosage.
 * Les instructions pour patients particuliers (âge, insuffisances) sont une
 * sous-rubrique de la posologie, sans ancre propre.
 *
 * Notice patient (PIL) : 2 qu'est-ce/indications · 4 quand ne pas prendre ·
 * 5 précautions · 6 grossesse/allaitement · 7 comment utiliser ·
 * 8 effets secondaires · 10 composition.
 */
export const NOTICE_SHORTCUTS: Record<'SmPC' | 'PIL', NoticeShortcut[]> = {
  SmPC: [
    { label: 'Composition', anchor: 'section1' },
    { label: 'Indications', anchor: 'section3' },
    { label: 'Posologie', anchor: 'section4' },
    { label: 'Contre-indications', anchor: 'section5' },
    { label: 'Mises en garde', anchor: 'section6' },
    { label: 'Interactions', anchor: 'section7' },
    { label: 'Grossesse / allaitement', anchor: 'section8' },
    { label: 'Effets indésirables', anchor: 'section10' },
    { label: 'Surdosage', anchor: 'section11' },
  ],
  PIL: [
    { label: 'Indications', anchor: 'section2' },
    { label: 'Contre-indications', anchor: 'section4' },
    { label: 'Précautions', anchor: 'section5' },
    { label: 'Grossesse / allaitement', anchor: 'section6' },
    { label: 'Posologie', anchor: 'section7' },
    { label: 'Effets secondaires', anchor: 'section8' },
    { label: 'Composition', anchor: 'section10' },
  ],
};
