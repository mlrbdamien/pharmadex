import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';
import { useStore } from './store';
import { isStale } from './resources';

export type Compteurs = {
  ressources: number;
  liensCasses: number;
  aReverifier: number;
  produits: number | null;
  /** null tant qu'inconnu — et pour le comptoir, dont la RLS interdit ce count. */
  recherchesVides: number | null;
};

/**
 * Les compteurs du rail. Ressources et liens cassés sortent du cache mémoire
 * (zéro requête) ; produits et recherches vides coûtent un `count` en tête de
 * réponse. Un échec n'affiche simplement rien : les compteurs sont un confort,
 * jamais un point de rupture.
 */
export function useCompteurs(): Compteurs {
  const { resources } = useStore();
  const { canEdit } = useAuth();
  const [produits, setProduits] = useState<number | null>(null);
  const [recherchesVides, setRecherchesVides] = useState<number | null>(null);

  useEffect(() => {
    void supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setProduits(count));
  }, []);

  useEffect(() => {
    if (!canEdit) return;
    void supabase
      .from('search_misses')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setRecherchesVides(count));
  }, [canEdit]);

  return {
    ressources: resources.length,
    liensCasses: resources.filter((r) => r.broken).length,
    aReverifier: resources.filter((r) => !r.broken && isStale(r)).length,
    produits,
    recherchesVides,
  };
}
