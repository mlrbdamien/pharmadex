import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, SearchX } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { TagFilter } from '../components/TagFilter';
import { ResourceCard } from '../components/ResourceCard';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import {
  localFilter,
  logSearchMiss,
  openResource,
  searchResources,
  shouldLogMiss,
} from '../lib/resources';
import type { Resource } from '../lib/types';

export function Home() {
  const { canEdit } = useAuth();
  const { resources, tags, loading, error, refresh } = useStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  /** Résultats faisant autorité (Postgres). `null` = réponse pas encore arrivée. */
  const [remote, setRemote] = useState<Resource[] | null>(null);

  const lastLogged = useRef<string | null>(null);
  const requestId = useRef(0);
  const trimmed = query.trim();

  // Recherche serveur, débounce 150 ms. Tant qu'elle est en vol, l'affichage
  // retombe sur le filtre local : l'écran n'est jamais vide entre deux frappes.
  useEffect(() => {
    if (!trimmed) {
      setRemote(null);
      return;
    }
    setRemote(null);
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const rows = await searchResources(trimmed);
        if (id === requestId.current) setRemote(rows);
      } catch {
        // Le filtre local reste affiché — mieux que rien au comptoir.
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const base = useMemo(
    () => remote ?? localFilter(resources, trimmed),
    [remote, resources, trimmed],
  );
  const results = useMemo(
    () => (activeTag ? base.filter((r) => r.tags.includes(activeTag)) : base),
    [base, activeTag],
  );

  // Journal des recherches vides. Deux conditions avant de consigner :
  //
  // 1. la réponse serveur est arrivée et est vide (`remote`) — se fier au seul
  //    cache local produirait de faux négatifs ;
  // 2. deux secondes sans frappe. Ce délai fait l'essentiel du travail : une
  //    hésitation au milieu d'un mot dure quelques centaines de millisecondes,
  //    pas deux secondes. Ce qui reste est un terme abouti, pas « gross ».
  useEffect(() => {
    if (!trimmed || remote === null || remote.length > 0) return;
    const timer = setTimeout(() => {
      if (shouldLogMiss(trimmed, lastLogged.current)) {
        lastLogged.current = trimmed;
        void logSearchMiss(trimmed);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [trimmed, remote]);

  // Entrée ouvre le premier résultat : scan de code-barres → Entrée → la fiche
  // s'ouvre, sans toucher la souris.
  const openFirst = useCallback(() => {
    const first = results[0];
    if (first) void openResource(first);
  }, [results]);

  const pinned = results.filter((r) => r.pinned);
  const rest = results.filter((r) => !r.pinned);

  function card(resource: Resource, first = false) {
    return (
      <ResourceCard
        key={resource.id}
        resource={resource}
        canEdit={canEdit}
        onTagClick={setActiveTag}
        onChanged={() => void refresh()}
        first={first}
      />
    );
  }

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onEnter={openFirst}
          count={trimmed ? results.length : null}
        />

        {tags.length > 0 && (
          <div className="mt-3">
            <TagFilter tags={tags} active={activeTag} onSelect={setActiveTag} />
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : trimmed ? (
          results.length > 0 ? (
            <div className="mt-4 space-y-2">{results.map((r, i) => card(r, i === 0))}</div>
          ) : (
            <div className="mt-10 text-center">
              <SearchX className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">
                Aucun résultat pour « {trimmed} »
              </p>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => navigate(`/nouveau?titre=${encodeURIComponent(trimmed)}`)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-teal-600
                             px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
                >
                  <Plus className="size-4" /> Ajouter cette ressource
                </button>
              )}
            </div>
          )
        ) : (
          <div className="mt-6 space-y-6">
            {pinned.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Épinglées
                </h2>
                <div className="space-y-2">{pinned.map((r) => card(r))}</div>
              </section>
            )}
            <section>
              <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {activeTag ? `Tag « ${activeTag} »` : 'Dernières ajoutées'}
              </h2>
              {rest.length > 0 ? (
                <div className="space-y-2">{rest.slice(0, 30).map((r) => card(r))}</div>
              ) : (
                <p className="text-sm text-slate-400">
                  Rien pour l'instant.
                  {canEdit && ' Utilisez « Ajouter » pour créer la première ressource.'}
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
