import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from './store';
import { estAnnote } from './notes';
import { localFilter, searchResources } from './resources';
import type { Resource } from './types';
import { looksLikeScan, normalizeScannedCode, scanGtin, searchDosages } from './products';
import { rechercher, type Resultat } from './recherche';
import type { DosageHit, ScanHit } from './types';

/**
 * La recherche du comptoir, telle que l'écran d'accueil et la palette la
 * font toutes deux. Un seul endroit où vivent le débounce, la voie du scan
 * et la fusion des sources — deux implémentations divergeraient au premier
 * ajustement.
 */
export function useRecherche(requete: string): {
  resultats: Resultat[];
  /** Produit identifié par un code scanné : il court-circuite le classement. */
  scan: ScanHit | null;
  cherche: boolean;
  /**
   * Réponse Postgres pour les ressources, `null` tant qu'elle n'est pas
   * arrivée. Le journal des recherches vides s'y fie : le cache local seul
   * produirait de faux négatifs.
   */
  distant: Resource[] | null;
} {
  const { resources, fiches, notes, notesIndex } = useStore();
  // Chaque lot de dosages retient la requête qui l'a produit. Sans cette
  // étiquette, les dosages de « dafalgan » restaient affichés — et ouvrables
  // par Entrée — pendant que « dafalgan 300 » était encore en vol.
  const [dosages, setDosages] = useState<{ pour: string; lignes: DosageHit[] }>({
    pour: '',
    lignes: [],
  });
  const [distant, setDistant] = useState<Resource[] | null>(null);
  const [scan, setScan] = useState<ScanHit | null>(null);
  const [cherche, setCherche] = useState(false);
  // Une réponse lente ne doit pas écraser une frappe plus récente.
  const requeteId = useRef(0);
  const q = requete.trim();

  useEffect(() => {
    const mien = ++requeteId.current;
    if (!q) {
      setDosages({ pour: '', lignes: [] });
      setDistant(null);
      setScan(null);
      setCherche(false);
      return;
    }
    setDistant(null);
    setCherche(true);
    const minuteur = setTimeout(async () => {
      if (looksLikeScan(q)) {
        const code = normalizeScannedCode(q);
        const trouve = code ? await scanGtin(code).catch(() => null) : null;
        if (requeteId.current !== mien) return;
        setScan(trouve);
        setDosages({ pour: q, lignes: [] });
        // Un code inconnu de Swissmedic laisse la réponse vide : le journal
        // des recherches vides doit pouvoir le consigner.
        setDistant(trouve ? (trouve.resources as Resource[]) : []);
        setCherche(false);
        if (trouve) return;
      }
      // Ressources ET produits en parallèle : « Inderal » au clavier vaut un
      // scan de la boîte.
      const [ressources, lignes] = await Promise.all([
        searchResources(q).catch(() => [] as Resource[]),
        searchDosages(q).catch(() => [] as DosageHit[]),
      ]);
      if (requeteId.current !== mien) return;
      setScan(null);
      setDosages({ pour: q, lignes });
      setDistant(ressources);
      setCherche(false);
    }, 150);
    return () => clearTimeout(minuteur);
  }, [q]);

  const resultats = useMemo(
    () =>
      rechercher(q, {
        dosages: dosages.pour === q ? dosages.lignes : [],
        fiches,
        // Postgres fait autorité (radicalisation, tsvector) ; le cache local
        // tient l'écran pendant que la réponse est en vol.
        ressources: distant ?? localFilter(resources, q),
        notes,
        estAnnote: (d) =>
          estAnnote(notesIndex, d.authorization_nr, d.atc_code, d.substances, d.dosage_nr),
      }),
    [q, dosages, distant, fiches, resources, notes, notesIndex],
  );

  return { resultats, scan, cherche, distant };
}

/**
 * Sélection au clavier dans une liste de résultats. Les mains restent sur le
 * clavier : au comptoir, on tape, on flèche, on valide — jamais la souris.
 */
export function useSelection(
  nombre: number,
  /** Ce qui, en changeant, doit ramener la sélection en tête. */
  cle: string,
): {
  selection: number;
  setSelection: (n: number) => void;
  surTouche: (evenement: React.KeyboardEvent) => Resultat | 'ferme' | null;
} {
  const [selection, setSelection] = useState(0);

  // Toute nouvelle recherche repart du premier résultat : garder l'index de
  // la précédente désignerait une ligne au hasard. La clé est la requête,
  // pas le nombre — deux recherches peuvent rendre autant de résultats.
  useEffect(() => setSelection(0), [cle]);

  function surTouche(evenement: React.KeyboardEvent): Resultat | 'ferme' | null {
    if (evenement.key === 'ArrowDown') {
      evenement.preventDefault();
      setSelection((s) => (nombre === 0 ? 0 : (s + 1) % nombre));
    } else if (evenement.key === 'ArrowUp') {
      evenement.preventDefault();
      setSelection((s) => (nombre === 0 ? 0 : (s - 1 + nombre) % nombre));
    } else if (evenement.key === 'Escape') {
      return 'ferme';
    }
    return null;
  }

  return { selection, setSelection, surTouche };
}
