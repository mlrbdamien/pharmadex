/**
 * Calcul de dispensation — combien de temps tient ce qui a été délivré, et
 * le patient revient-il à l'heure.
 *
 * Tout est pur et synchrone : aucune requête, aucune écriture. La page qui
 * s'en sert ne conserve rien — ni base, ni stockage local, ni paramètre
 * d'URL. Les dates d'une délivrance disent quelque chose d'une personne ;
 * elles vivent le temps du calcul, pas une seconde de plus.
 */

// ---------------------------------------------------------------------------
// Unités et galéniques
// ---------------------------------------------------------------------------

/** L'unité dans laquelle se compte un emballage. */
export type Unite = 'unite' | 'ml' | 'g' | 'dose';

/** L'unité dans laquelle s'exprime une prise — pas toujours celle de l'emballage. */
export type UniteDose = 'unite' | 'ml' | 'goutte' | 'mesure' | 'g' | 'dose';

export type Conditionnement = {
  /** Contenu total de l'emballage, dans son unité. */
  quantite: number;
  unite: Unite;
  /** Nom au pluriel, pour que le verdict se lise en français. */
  libelle: string;
};

/**
 * Les galéniques proposées au choix quand la lecture automatique échoue ou
 * se trompe. Volontairement courte : ce sont des unités de calcul, pas le
 * catalogue des formes pharmaceutiques.
 */
export const FORMES: { libelle: string; unite: Unite }[] = [
  { libelle: 'comprimés', unite: 'unite' },
  { libelle: 'capsules', unite: 'unite' },
  { libelle: 'sachets', unite: 'unite' },
  { libelle: 'suppositoires', unite: 'unite' },
  { libelle: 'ovules', unite: 'unite' },
  { libelle: 'patchs', unite: 'unite' },
  { libelle: 'ampoules', unite: 'unite' },
  { libelle: 'seringues', unite: 'unite' },
  { libelle: 'unidoses', unite: 'unite' },
  { libelle: 'pièces', unite: 'unite' },
  { libelle: 'ml', unite: 'ml' },
  { libelle: 'g', unite: 'g' },
  { libelle: 'doses', unite: 'dose' },
];

/** Les façons d'exprimer une prise, selon ce que contient l'emballage. */
export function unitesDosePour(unite: Unite): UniteDose[] {
  if (unite === 'ml') return ['ml', 'goutte', 'mesure'];
  if (unite === 'g') return ['g'];
  if (unite === 'dose') return ['dose'];
  return ['unite'];
}

export const LIBELLES_DOSE: Record<UniteDose, string> = {
  unite: 'par prise',
  ml: 'ml',
  goutte: 'gouttes',
  mesure: 'cuillères-mesure',
  g: 'g',
  dose: 'bouffées / pulvérisations',
};

// ---------------------------------------------------------------------------
// Lecture du conditionnement
// ---------------------------------------------------------------------------

// Les deux sources ne présentent pas la taille au même endroit : Refdata la
// met en fin de dénomination (« SPEDIFEN cpr pell 400 mg 30 pce »), la table
// Swissmedic traduite en tête (« 5 x 3 ml flacon(s) »). D'où deux ancrages.
const MOTS: [RegExp, Unite, string][] = [
  [/comprim\w*|cpr|tabl\w*/i, 'unite', 'comprimés'],
  [/capsule\w*|caps/i, 'unite', 'capsules'],
  [/sachet\w*|sach/i, 'unite', 'sachets'],
  [/suppositoire\w*|supp/i, 'unite', 'suppositoires'],
  [/ovule\w*/i, 'unite', 'ovules'],
  [/patch\w*|emplâtre\w*/i, 'unite', 'patchs'],
  [/ampoule\w*|amp/i, 'unite', 'ampoules'],
  [/seringue\w*|ser/i, 'unite', 'seringues'],
  [/unidose\w*/i, 'unite', 'unidoses'],
  [/dragée\w*/i, 'unite', 'dragées'],
  [/flacon\w*|fl/i, 'unite', 'flacons'],
  [/stylo\w*|injecteur\w*/i, 'unite', 'stylos'],
  [/dose\w*|inhalation\w*|pulvérisation\w*|bouffée\w*|inh/i, 'dose', 'doses'],
  [/pce|pz|stk|pièce\w*/i, 'unite', 'pièces'],
  [/ml/i, 'ml', 'ml'],
  [/^l$/i, 'ml', 'ml'],
  [/^g$/i, 'g', 'g'],
];

/** « 3 x 28 » → 84. Le point et la virgule décimale sont acceptés. */
function produit(chiffres: string): number {
  return chiffres
    .split(/[x×]/)
    .map((n) => Number(n.trim().replace(',', '.')))
    .filter((n) => Number.isFinite(n) && n > 0)
    .reduce((a, b) => a * b, 1);
}

const NOMBRES = String.raw`\d+(?:[.,]\d+)?(?:\s*[x×]\s*\d+(?:[.,]\d+)?)*`;
// `mg` est délibérément absent : « IBUPROFEN cpr 400 mg » finirait lu comme
// un emballage de 400 unités, alors que c'est un dosage.
const UNITES_TEXTE = String.raw`pce|pz|stk|pi[eè]ces?|ml|l|g|doses?|inh\w*|` +
  String.raw`compr\w*|cpr|tabl\w*|caps\w*|sach\w*|supp\w*|ovules?|patchs?|` +
  String.raw`amp\w*|ser\w*|unidoses?|drag\w*|flacons?|fl|stylos?|injecteurs?|` +
  String.raw`pulv\w*|bouff\w*|empl\w*`;

const EN_FIN = new RegExp(String.raw`\s(${NOMBRES})\s*(${UNITES_TEXTE})\.?\s*$`, 'i');
const EN_TETE = new RegExp(String.raw`^\s*(${NOMBRES})\s*(${UNITES_TEXTE})`, 'i');

/**
 * Lit « 30 pce », « 5 x 3 ml flacon(s) », « 200 doses ».
 *
 * Renvoie null plutôt qu'un chiffre approximatif : le champ reste alors vide
 * et se saisit à la main. Une quantité fausse serait pire qu'absente — elle
 * produirait un verdict d'observance faux sans que rien ne le signale.
 */
export function lireConditionnement(description: string | null | undefined): Conditionnement | null {
  const texte = (description ?? '').trim();
  if (!texte) return null;

  for (const motif of [EN_TETE, EN_FIN]) {
    const m = texte.match(motif);
    if (!m) continue;
    const quantite = produit(m[1]);
    if (!Number.isFinite(quantite) || quantite <= 0) continue;
    const mot = m[2];
    const trouve = MOTS.find(([regex]) => regex.test(mot));
    if (!trouve) continue;
    const [, unite, libelle] = trouve;
    // Un litre se compte en ml, comme le reste des liquides.
    const facteur = /^l$/i.test(mot) ? 1000 : 1;
    return { quantite: quantite * facteur, unite, libelle };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Rythme de prise
// ---------------------------------------------------------------------------

/**
 * Trois façons de dire la fréquence, qui couvrent ce qui se présente au
 * comptoir : « 3 fois par jour », « 1 fois par semaine » (bisphosphonates),
 * « tous les 3 jours » (patchs). Toutes se ramènent à un nombre de prises
 * quotidien, fractionnaire au besoin.
 */
export type Rythme =
  | { mode: 'jour'; prises: number }
  | { mode: 'semaine'; prises: number }
  | { mode: 'intervalle'; jours: number };

export function prisesParJour(rythme: Rythme): number {
  if (rythme.mode === 'jour') return rythme.prises;
  if (rythme.mode === 'semaine') return rythme.prises / 7;
  return rythme.jours > 0 ? 1 / rythme.jours : 0;
}

/**
 * Combien vaut une unité de dose dans l'unité de l'emballage.
 * Le nombre de gouttes par ml n'est pas une constante universelle : 20 vaut
 * pour les solutions aqueuses, une solution huileuse ou alcoolique en donne
 * 15 à 30. Le paramètre est donc exposé à l'écran, pas figé ici.
 */
export function facteurDose(
  uniteDose: UniteDose,
  gouttesParMl: number,
  mlParMesure: number,
): number {
  if (uniteDose === 'goutte') return gouttesParMl > 0 ? 1 / gouttesParMl : 0;
  if (uniteDose === 'mesure') return mlParMesure;
  return 1;
}

// ---------------------------------------------------------------------------
// Calendrier — en jours entiers, sans fuseau
// ---------------------------------------------------------------------------

/** Une date ISO en numéro de jour absolu. Passe par UTC : aucun décalage d'été. */
export function jour(iso: string): number | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const n = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / 86_400_000;
  return Number.isFinite(n) ? n : null;
}

export function dateIso(n: number): string {
  return new Date(n * 86_400_000).toISOString().slice(0, 10);
}

export function aujourdhuiIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/** « 2026-08-31 » → « 31.08.2026 », l'écriture suisse. */
export function enSuisse(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

// ---------------------------------------------------------------------------
// Le calcul
// ---------------------------------------------------------------------------

export type Saisie = {
  /** Contenu d'un emballage, dans son unité. */
  parEmballage: number;
  emballages: number;
  unite: Unite;
  libelle: string;
  quantiteParPrise: number;
  uniteDose: UniteDose;
  rythme: Rythme;
  gouttesParMl: number;
  mlParMesure: number;
  /**
   * Ce qui reste en main au jour de vérification, compté ou déclaré. Zéro
   * quand l'emballage est terminé — c'est ce qui sépare une consommation
   * mesurée d'une consommation supposée.
   */
  resteCompte: number;
  /** Dates ISO. `reference` est le jour depuis lequel on regarde. */
  dispenseLe: string;
  reference: string;
};

export type Resultat = {
  /** Ce qui a été remis : parEmballage × emballages. */
  total: number;
  /** Consommation prescrite, en unités d'emballage par jour. */
  parJour: number;
  /** Durée de traitement que la délivrance couvre. Exacte, non arrondie. */
  joursCouverts: number;
  /** Premier jour sans traitement — la date à laquelle il faut être revenu. */
  epuisementLe: string;
  joursEcoules: number;
  /** Ce que la posologie prescrivait de consommer sur la période écoulée. */
  theorique: number;
  /** Ce qui a réellement été consommé : délivré moins ce qui reste en main. */
  consomme: number;
  /** consomme − theorique. Négatif : moins pris que prescrit. */
  ecartQuantite: number;
  /** Le même écart exprimé en jours de traitement. */
  ecartJours: number;
  /** consomme / theorique. 1 = exactement la posologie. null le jour même. */
  taux: number | null;
};

/**
 * Aucun seuil, aucun verdict, aucune couleur : la fonction rend les
 * quantités et laisse l'interprétation au pharmacien. Trois jours d'écart
 * ne veulent pas dire la même chose sur une cure de sept jours et sur un
 * traitement chronique — et ce jugement-là ne se code pas.
 */
export function calculer(s: Saisie): Resultat | null {
  const total = s.parEmballage * s.emballages;
  const parJour =
    s.quantiteParPrise *
    facteurDose(s.uniteDose, s.gouttesParMl, s.mlParMesure) *
    prisesParJour(s.rythme);
  const debut = jour(s.dispenseLe);
  const ref = jour(s.reference);
  if (!(total > 0) || !(parJour > 0) || debut === null || ref === null) return null;

  const joursCouverts = total / parJour;
  // Dernière prise complète au jour `floor(couverts) - 1` : l'emballage est
  // vide au matin du jour `floor(couverts)`. Seule cette date est arrondie —
  // un calendrier n'a pas de demi-journées ; tout le reste reste exact.
  const epuisement = debut + Math.floor(joursCouverts);
  const joursEcoules = ref - debut;
  const periode = Math.max(0, joursEcoules);
  const theorique = parJour * periode;
  const consomme = total - s.resteCompte;
  const ecartQuantite = consomme - theorique;

  return {
    total,
    parJour,
    joursCouverts,
    epuisementLe: dateIso(epuisement),
    joursEcoules,
    theorique,
    consomme,
    ecartQuantite,
    ecartJours: ecartQuantite / parJour,
    taux: theorique > 0 ? consomme / theorique : null,
  };
}

/** Emballages nécessaires pour couvrir une durée prescrite. */
export function emballagesPour(jours: number, parEmballage: number, parJour: number): number | null {
  if (!(jours > 0) || !(parEmballage > 0) || !(parJour > 0)) return null;
  return Math.ceil((jours * parJour) / parEmballage);
}

/** « 1,5 » et « 1.5 » se valent : le comptoir tape à la suisse. */
export function nombre(saisie: string): number {
  const n = Number(saisie.trim().replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** Arrondi lisible : pas de « 33.333333333 » sur un écran de comptoir. */
export function arrondi(n: number, decimales = 1): string {
  const arrondie = Math.round(n * 10 ** decimales) / 10 ** decimales;
  return String(arrondie).replace('.', ',');
}
