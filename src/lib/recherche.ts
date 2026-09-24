import { fold } from './resources';
import type { EntreeFiche } from './fiches';
import { LIBELLES_VOLET } from './fiches';
import type { ProductNote } from './notes';
import { TYPES_NOTES } from './notes';
import { routeProduit } from './products';
import type { DosageHit, Resource } from './types';

/**
 * La recherche unique du comptoir.
 *
 * Pharmadex avait quatre champs de recherche — accueil, catalogue, fiches,
 * ressources — pour un seul geste mental. Cela imposait une décision AVANT
 * de taper : « où je cherche ? ». C'est de la latence, et elle est cognitive,
 * donc invisible dans un profilage. Une seule barre, un seul classement.
 */

export type TypeResultat = 'produit' | 'fiche' | 'ressource' | 'note';

export const LIBELLES_TYPE: Record<TypeResultat, string> = {
  produit: 'Médicament',
  fiche: 'Sémaphore',
  ressource: 'Ressource',
  note: 'Note',
};

export type Resultat = {
  type: TypeResultat;
  cle: string;
  /** La route à ouvrir — un résultat est toujours une destination. */
  vers: string;
  titre: string;
  sous: string | null;
  badge: string | null;
  score: number;
  annote?: boolean;
  /**
   * Rang dans la réponse de la RPC, pour départager deux dosages de même
   * score : Postgres les renvoie dans l'ordre officiel (80, 150, 300, 600 mg).
   * Départager par le titre les remettait dans l'ordre alphabétique — 150,
   * 300, 600, 80.
   */
  rang?: number;
};

/**
 * Qualité d'une correspondance, du plus fort au plus faible. Le seuil compte
 * plus que la valeur : ce sont quatre paliers, pas une échelle continue.
 */
const EXACT = 100;
const PREFIXE = 85;
const MOTS = 70;
const SECONDAIRE = 45;

/**
 * Un médicament est une identification, une fiche ou une note est une
 * réponse. À correspondance égale, la réponse passe devant — d'autant que
 * les produits sont 6 300 contre 36 fiches : sans cette pondération, une
 * requête de concept (« toux ») noierait la fiche sous les antitussifs.
 * Une correspondance exacte de nom garde l'avantage (85 > 70 + 10).
 */
const POIDS: Record<TypeResultat, number> = {
  fiche: 10,
  note: 8,
  ressource: 5,
  produit: 0,
};

/** Chaque mot de la requête doit préfixer un mot du texte. */
function tousEnPrefixe(texte: string, mots: string[]): boolean {
  const cibles = texte.split(/[\s,;/()–—-]+/).filter(Boolean);
  return mots.every((m) => cibles.some((c) => c.startsWith(m)));
}

function qualite(titre: string, secondaire: string, requete: string, mots: string[]): number {
  const t = fold(titre);
  if (t === requete) return EXACT;
  if (t.startsWith(requete)) return PREFIXE;
  if (tousEnPrefixe(t, mots)) return MOTS;
  const s = fold(secondaire);
  if (mots.every((m) => s.includes(m))) return SECONDAIRE;
  return 0;
}

export type Sources = {
  /** Une ligne par DOSAGE : « Dafalgan 300, supp 300 mg ». */
  dosages: DosageHit[];
  fiches: EntreeFiche[];
  ressources: Resource[];
  notes: ProductNote[];
  /** Marque un dosage annoté, pour l'afficher dans la liste. */
  estAnnote?: (d: DosageHit) => boolean;
};

/**
 * Fusionne et classe. Les dosages arrivent déjà filtrés par Postgres (la
 * RPC fait le travail de préfixe sur 10 300 lignes) ; fiches, ressources et
 * notes sont filtrées ici, sur des tables tenues en mémoire.
 */
export function rechercher(requete: string, sources: Sources, limite = 40): Resultat[] {
  const q = fold(requete.trim());
  if (!q) return [];
  const mots = q.split(/\s+/).filter(Boolean);
  const sortie: Resultat[] = [];

  const ajouter = (base: Omit<Resultat, 'score'>, brut: number) => {
    if (brut > 0) sortie.push({ ...base, score: brut + POIDS[base.type] });
  };

  sources.dosages.forEach((d, rang) => {
    ajouter(
      {
        type: 'produit',
        rang,
        // Une clé par DOSAGE : plusieurs dosages partagent une autorisation,
        // et deux lignes à la même clé se confondraient dans la liste.
        cle: `p${d.authorization_nr}-${d.dosage_nr ?? ''}`,
        vers: routeProduit(d.authorization_nr, d.dosage_nr),
        titre: d.name,
        sous: d.substances,
        badge: d.atc_code,
        annote: sources.estAnnote?.(d),
      },
      // La RPC n'a renvoyé que des correspondances : le plancher est MOTS.
      Math.max(MOTS, qualite(d.name, `${d.product_name} ${d.substances ?? ''}`, q, mots)),
    );
  });

  for (const f of sources.fiches) {
    ajouter(
      {
        type: 'fiche',
        cle: `f${f.id}`,
        vers: `/f/${f.id}`,
        titre: f.titre,
        sous: f.sous,
        badge: `${f.code} · ${LIBELLES_VOLET[f.volet]}`,
      },
      qualite(f.titre, `${f.code} ${f.sous} ${f.groupe}`, q, mots),
    );
  }

  for (const r of sources.ressources) {
    ajouter(
      {
        type: 'ressource',
        cle: `r${r.id}`,
        vers: `/r/${r.id}`,
        titre: r.title,
        sous: r.description,
        badge: r.tags?.[0] ?? null,
      },
      qualite(r.title, `${r.description ?? ''} ${(r.tags ?? []).join(' ')}`, q, mots),
    );
  }

  for (const n of sources.notes) {
    const cible = n.fiche_id ?? n.authorization_nr ?? n.atc_prefix ?? n.substance ?? '';
    ajouter(
      {
        type: 'note',
        cle: `n${n.id}`,
        // Une note précisée sur un dosage ouvre la fiche SUR ce dosage : ouverte
        // sur l'autorisation, la posologie du 80 mg s'y lirait sans son dosage.
        vers: n.fiche_id
          ? `/f/${n.fiche_id}`
          : n.authorization_nr
            ? routeProduit(n.authorization_nr, n.dosage_nr)
            : '/notes',
        titre: n.body.split('\n')[0].slice(0, 90),
        sous: cible,
        badge: TYPES_NOTES[n.note_type].label,
      },
      qualite(n.body, cible, q, mots),
    );
  }

  return sortie
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.rang !== undefined && b.rang !== undefined ? a.rang - b.rang : 0) ||
        a.titre.localeCompare(b.titre),
    )
    .slice(0, limite);
}
