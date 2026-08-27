import { supabase } from './supabase';

/**
 * URL de consultation d'une notice, via le relais fetch-notice.
 * files.refdata.ch sert ses HTML en application/octet-stream : sans relais
 * qui rétablit text/html, l'iframe reste blanche.
 */
export function noticeViewUrl(htmlUrl: string): string {
  const doc = htmlUrl.split('/').pop() ?? '';
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-notice?doc=${encodeURIComponent(doc)}`;
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
 * fait défiler l'iframe jusqu'à la rubrique.
 *
 * Les notices HTML de l'AIPS portent des ancres #section1…#section21 suivant
 * l'ordre standardisé des rubriques. Pour la FI (SmPC), l'ordre usuel est :
 * 1 nom · 2 composition · 3 forme · 4 indications · 5 posologie ·
 * 6 contre-indications · 7 mises en garde · 8 interactions ·
 * 9 grossesse/allaitement · 10 conduite · 11 effets indésirables ·
 * 12 surdosage · … La notice patient (PIL) suit une autre numérotation.
 */
export const NOTICE_SHORTCUTS: Record<'SmPC' | 'PIL', NoticeShortcut[]> = {
  // TODO(human) : choisir les rubriques qui méritent un accès en un clic au
  // comptoir, leurs libellés et leurs ancres — version minimale en attendant.
  SmPC: [
    { label: 'Grossesse / allaitement', anchor: 'section9' },
  ],
  PIL: [],
};
