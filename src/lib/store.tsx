import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Resource } from './types';
import { listAll, STALE_MONTHS } from './resources';
import { listTags } from './tags';
import { chargerNotesIndex, type NotesIndex } from './notes';

/**
 * Toutes les ressources sont chargées une fois et gardées en mémoire. C'est ce
 * qui permet au filtre par tag et à la vue d'accueil d'être instantanés, et à
 * la recherche d'afficher un résultat local avant même la réponse du serveur.
 */
type StoreValue = {
  resources: Resource[];
  tags: string[];
  notesIndex: NotesIndex | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [notesIndex, setNotesIndex] = useState<NotesIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [rows, names, notes] = await Promise.all([
        listAll(),
        listTags(),
        chargerNotesIndex(STALE_MONTHS),
      ]);
      setResources(rows);
      setTags(names);
      setNotesIndex(notes);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Chargement impossible');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ resources, tags, notesIndex, loading, error, refresh }),
    [resources, tags, notesIndex, loading, error, refresh],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore doit être utilisé dans <StoreProvider>');
  return value;
}
