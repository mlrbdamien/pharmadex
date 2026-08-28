import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { TagFilter } from '../components/TagFilter';
import { ResourceCard } from '../components/ResourceCard';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { isStale, localFilter } from '../lib/resources';

/**
 * Le catalogue complet des ressources : tout le cache mémoire, filtre par tag
 * et par texte. La page Recherche reste l'entrée rapide ; celle-ci est
 * l'inventaire qu'on parcourt.
 */
export function Ressources() {
  const { canEdit } = useAuth();
  const { resources, tags, refresh } = useStore();
  const [filtre, setFiltre] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [seulementStale, setSeulementStale] = useState(false);

  const nbStale = useMemo(
    () => resources.filter((r) => !r.broken && isStale(r)).length,
    [resources],
  );

  const visibles = useMemo(() => {
    let liste = localFilter(resources, filtre);
    if (tag) liste = liste.filter((r) => r.tags.includes(tag));
    if (seulementStale) liste = liste.filter((r) => !r.broken && isStale(r));
    return liste;
  }, [resources, filtre, tag, seulementStale]);

  return (
    <>
      <EnteteEcran
        titre="Ressources"
        contexte={`${resources.length} au catalogue`}
        onMenu={useMenu()}
        actions={
          canEdit && (
            <Link
              to="/nouveau"
              className="bg-accent hover:bg-accent-hover inline-flex items-center gap-1.5 rounded-control
                         px-2.5 py-1.5 text-sm font-medium text-on-accent transition-colors"
            >
              <Plus className="size-4" /> Ajouter
            </Link>
          )
        }
      />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <Search
              className="text-ink-3 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={filtre}
              onChange={(event) => setFiltre(event.target.value)}
              placeholder="Filtrer le catalogue…"
              autoComplete="off"
              spellCheck={false}
              className="border-line bg-surface-1 focus:border-accent w-full rounded-control border py-2.5
                         pr-3 pl-10 text-[15px] shadow-card placeholder:text-ink-3"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {tags.length > 0 && <TagFilter tags={tags} active={tag} onSelect={setTag} />}
            {nbStale > 0 && (
              <button
                type="button"
                aria-pressed={seulementStale}
                onClick={() => setSeulementStale((v) => !v)}
                className={`rounded-full border px-2.5 py-1 text-sm transition ${
                  seulementStale
                    ? 'border-warning bg-warning-soft text-warning-text font-medium'
                    : 'border-line bg-surface-1 text-ink-2 hover:border-warning'
                }`}
              >
                à revérifier ({nbStale})
              </button>
            )}
          </div>

          {visibles.length === 0 ? (
            <p className="text-ink-3 mt-10 text-center text-sm">
              Aucune ressource ne correspond.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {visibles.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  canEdit={canEdit}
                  onTagClick={setTag}
                  onChanged={() => void refresh()}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
