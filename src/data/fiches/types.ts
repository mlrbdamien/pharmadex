/**
 * Le modèle de l'aide-mémoire de comptoir, repris de comptoir-otc.
 *
 * Une fiche se divise en deux : ses métadonnées (le catalogue, toujours
 * chargé, quelques kilo-octets) et ses sections (le contenu, 424 Ko pour
 * les trois volets, chargées à la demande). La règle d'or du projet — plus
 * rapide que Google — interdit de faire porter ce poids à l'écran de
 * recherche, qui ne s'en sert pas.
 */

export type Volet = 'otc' | 'rx' | 'lpd';

/** Niveau d'orientation N1–N4 : quand voir un médecin, et où. */
export type Triage = {
  n: 1 | 2 | 3 | 4;
  quand: string;
  ou: string;
  items: string[];
};

/** Bloc « ne pas délivrer » — la contre-indication ferme. */
export type Stop = {
  t?: string | null;
  p?: string[];
  ul?: string[];
};

export type Tableau = { head: string[]; rows: string[][] };

/**
 * Les clés d'une section, rendues dans un ordre fixe (voir FicheView) :
 * p → ul → ol → table → check → triage → stop → warn.
 *
 * Les chaînes portent du HTML en ligne d'un vocabulaire clos et vérifié :
 * `<b>`, `<em>`, `<i>`, `<a>`, et `<span class="dose|cat|n|nv|tel">`.
 * C'est du contenu rédigé dans le dépôt, jamais une saisie d'utilisateur.
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

export type EntreeFiche = {
  id: string;
  code: string;
  groupe: string;
  titre: string;
  sous: string;
  volet: Volet;
  /** Bandeau de catégorie de remise, quand la fiche contient un liste B. */
  remise?: string;
  /**
   * Préfixes ATC couverts par la fiche. Une boîte scannée dont le code
   * commence par l'un d'eux fait remonter la fiche sur la fiche produit —
   * c'est le lien qui justifie d'avoir réuni les deux outils.
   */
  atc?: string[];
};

export const LIBELLES_VOLET: Record<Volet, string> = {
  otc: 'Conseil OTC',
  rx: 'Ordonnances',
  lpd: 'Données',
};
