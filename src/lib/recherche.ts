import { fold } from './resources';
import type { EntreeFiche } from './fiches';
import { LIBELLES_VOLET } from './fiches';
import type { ProductNote } from './notes';
import { TYPES_NOTES } from './notes';
import { libelleFr } from './products';
import type { ProductRow, Resource } from './types';

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
  fiche: 'Aide-mémoire',
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
  produits: ProductRow[];
  fiches: EntreeFiche[];
  ressources: Resource[];
  notes: ProductNote[];
  /** Marque un produit annoté, pour l'afficher dans la liste. */
  estAnnote?: (p: ProductRow) => boolean;
};

/**
 * Fusionne et classe. Les produits arrivent déjà filtrés par Postgres (la
 * RPC fait le travail de préfixe sur 6 300 lignes) ; fiches, ressources et
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

  for (const p of sources.produits) {
    const nom = libelleFr(p);
    ajouter(
      {
        type: 'produit',
        cle: `p${p.authorization_nr}`,
        vers: `/p/${p.authorization_nr}`,
        titre: nom,
        sous: p.substances,
        badge: p.atc_code,
        annote: sources.estAnnote?.(p),
      },
      // La RPC n'a renvoyé que des correspondances : le plancher est MOTS.
      Math.max(MOTS, qualite(nom, p.substances ?? '', q, mots)),
    );
  }

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
        vers: n.fiche_id
          ? `/f/${n.fiche_id}`
          : n.authorization_nr
            ? `/p/${n.authorization_nr}`
            : '/notes',
        titre: n.body.split('\n')[0].slice(0, 90),
        sous: cible,
        badge: TYPES_NOTES[n.note_type].label,
      },
      qualite(n.body, cible, q, mots),
    );
  }

  return sortie
    .sort((a, b) => b.score - a.score || a.titre.localeCompare(b.titre))
    .slice(0, limite);
}
