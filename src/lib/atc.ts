import { supabase } from './supabase';

/**
 * L'arbre ATC réel de la base — tous les codes des produits, chargés UNE fois
 * par session, par pages de 1 000 (Supabase plafonne chaque réponse à 1 000
 * lignes : un limit(10000) est silencieusement tronqué, ce qui avait amputé
 * l'arborescence de ses groupes C à V).
 */

let cache: string[] | null = null;
let chargement: Promise<string[]> | null = null;

export async function tousLesCodesAtc(): Promise<string[]> {
  if (cache) return cache;
  chargement ??= (async () => {
    const codes: string[] = [];
    for (let page = 0; page < 20; page++) {
      const { data, error } = await supabase
        .from('products')
        .select('atc_code')
        .not('atc_code', 'is', null)
        .order('authorization_nr')
        .range(page * 1000, page * 1000 + 999);
      if (error || !data || data.length === 0) break;
      for (const row of data) codes.push(row.atc_code as string);
      if (data.length < 1000) break;
    }
    cache = codes;
    return codes;
  })();
  return chargement;
}

/** Longueur du niveau suivant : les niveaux ATC font 1, 3, 4, 5 puis 7 caractères. */
export const NIVEAU_SUIVANT: Record<number, number> = { 0: 1, 1: 3, 3: 4, 4: 5, 5: 7 };

export function enfantsDe(codes: string[], prefix: string): { code: string; n: number }[] {
  const longueur = NIVEAU_SUIVANT[prefix.length];
  if (!longueur) return [];
  const comptes = new Map<string, number>();
  for (const code of codes) {
    if (!code.startsWith(prefix)) continue;
    const enfant = code.slice(0, longueur);
    if (enfant.length === longueur) comptes.set(enfant, (comptes.get(enfant) ?? 0) + 1);
  }
  return [...comptes.entries()]
    .map(([code, n]) => ({ code, n }))
    .sort((a, b) => (a.code < b.code ? -1 : 1));
}

/**
 * Libellés français des niveaux 1 et 2 de la classification ATC (OMS).
 * Rédigés à la main faute de source libre en français ; stables d'année en
 * année, relus en revue de code. Les niveaux plus profonds s'affichent en
 * code + compteur.
 */
export const LIBELLES_ATC: Record<string, string> = {
  A: 'Voies digestives et métabolisme',
  A01: 'Préparations stomatologiques',
  A02: 'Troubles de l’acidité',
  A03: 'Troubles fonctionnels gastro-intestinaux',
  A04: 'Antiémétiques et antinauséeux',
  A05: 'Thérapeutique biliaire et hépatique',
  A06: 'Laxatifs',
  A07: 'Antidiarrhéiques, anti-inflammatoires intestinaux',
  A08: 'Préparations contre l’obésité',
  A09: 'Digestifs, enzymes incluses',
  A10: 'Médicaments du diabète',
  A11: 'Vitamines',
  A12: 'Suppléments minéraux',
  A13: 'Toniques',
  A14: 'Anabolisants systémiques',
  A15: 'Stimulants de l’appétit',
  A16: 'Autres médicaments des voies digestives et du métabolisme',
  B: 'Sang et organes hématopoïétiques',
  B01: 'Antithrombotiques',
  B02: 'Antihémorragiques',
  B03: 'Préparations antianémiques',
  B05: 'Substituts du sang et solutions de perfusion',
  B06: 'Autres agents hématologiques',
  C: 'Système cardiovasculaire',
  C01: 'Thérapeutique cardiaque',
  C02: 'Antihypertenseurs',
  C03: 'Diurétiques',
  C04: 'Vasodilatateurs périphériques',
  C05: 'Vasoprotecteurs',
  C07: 'Bêta-bloquants',
  C08: 'Inhibiteurs calciques',
  C09: 'Médicaments agissant sur le système rénine-angiotensine',
  C10: 'Hypolipémiants',
  D: 'Dermatologie',
  D01: 'Antifongiques à usage dermatologique',
  D02: 'Émollients et protecteurs',
  D03: 'Cicatrisants',
  D04: 'Antiprurigineux, antihistaminiques, anesthésiques locaux',
  D05: 'Antipsoriasiques',
  D06: 'Antibiotiques et chimiothérapie à usage dermatologique',
  D07: 'Corticostéroïdes, préparations dermatologiques',
  D08: 'Antiseptiques et désinfectants',
  D09: 'Pansements médicamenteux',
  D10: 'Préparations antiacnéiques',
  D11: 'Autres préparations dermatologiques',
  G: 'Système génito-urinaire et hormones sexuelles',
  G01: 'Anti-infectieux et antiseptiques gynécologiques',
  G02: 'Autres médicaments gynécologiques',
  G03: 'Hormones sexuelles et modulateurs génitaux',
  G04: 'Médicaments urologiques',
  H: 'Hormones systémiques (sauf sexuelles et insulines)',
  H01: 'Hormones hypophysaires et hypothalamiques',
  H02: 'Corticostéroïdes à usage systémique',
  H03: 'Thérapeutique thyroïdienne',
  H04: 'Hormones pancréatiques',
  H05: 'Homéostasie du calcium',
  J: 'Anti-infectieux à usage systémique',
  J01: 'Antibactériens à usage systémique',
  J02: 'Antimycosiques à usage systémique',
  J04: 'Antimycobactériens',
  J05: 'Antiviraux à usage systémique',
  J06: 'Immunsérums et immunoglobulines',
  J07: 'Vaccins',
  L: 'Antinéoplasiques et immunomodulateurs',
  L01: 'Antinéoplasiques',
  L02: 'Thérapeutique endocrine',
  L03: 'Immunostimulants',
  L04: 'Immunosuppresseurs',
  M: 'Système musculo-squelettique',
  M01: 'Anti-inflammatoires et antirhumatismaux',
  M02: 'Topiques pour douleurs articulaires et musculaires',
  M03: 'Myorelaxants',
  M04: 'Antigoutteux',
  M05: 'Médicaments des maladies osseuses',
  M09: 'Autres médicaments des troubles musculo-squelettiques',
  N: 'Système nerveux',
  N01: 'Anesthésiques',
  N02: 'Analgésiques',
  N03: 'Antiépileptiques',
  N04: 'Antiparkinsoniens',
  N05: 'Psycholeptiques',
  N06: 'Psychoanaleptiques',
  N07: 'Autres médicaments du système nerveux',
  P: 'Antiparasitaires, insecticides et répulsifs',
  P01: 'Antiprotozoaires',
  P02: 'Anthelminthiques',
  P03: 'Ectoparasiticides, scabicides incl.',
  R: 'Système respiratoire',
  R01: 'Préparations nasales',
  R02: 'Préparations pour la gorge',
  R03: 'Médicaments des syndromes obstructifs des voies aériennes',
  R05: 'Médicaments de la toux et du rhume',
  R06: 'Antihistaminiques à usage systémique',
  R07: 'Autres médicaments de l’appareil respiratoire',
  S: 'Organes sensoriels',
  S01: 'Ophtalmologie',
  S02: 'Otologie',
  S03: 'Préparations ophtalmiques et otologiques',
  V: 'Divers',
  V01: 'Allergènes',
  V03: 'Tous autres médicaments',
  V04: 'Diagnostics',
  V06: 'Nutriments',
  V07: 'Tous autres produits non thérapeutiques',
  V08: 'Produits de contraste',
  V09: 'Radiopharmaceutiques à usage diagnostique',
  V10: 'Radiopharmaceutiques à usage thérapeutique',
  V20: 'Pansements chirurgicaux',
};
