import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { Product, Resource } from '../lib/types';
import { atcLevels, linkAtc, linkProduct } from '../lib/products';
import { fold } from '../lib/resources';
import { useStore } from '../lib/store';

type Props = {
  product: Product;
  /** Ressources déjà liées, à exclure des propositions. */
  linked: Resource[];
  onDone: () => void;
  onClose: () => void;
};

/**
 * Sélecteur de liaison : une ressource existante + une portée (ce produit,
 * ou un niveau de la classe ATC). Boutons plutôt que saisie libre pour la
 * portée : impossible de se tromper de code.
 */
export function LinkPicker({ product, linked, onDone, onClose }: Props) {
  const { resources } = useStore();
  const [filter, setFilter] = useState('');
  const [scope, setScope] = useState<string>(product.authorization_nr);
  const [busy, setBusy] = useState(false);

  const levels = product.atc_code ? atcLevels(product.atc_code) : [];
  const linkedIds = useMemo(() => new Set(linked.map((r) => r.id)), [linked]);

  const candidates = useMemo(() => {
    const needle = fold(filter.trim());
    return resources
      .filter((r) => !linkedIds.has(r.id))
      .filter((r) => !needle || fold(`${r.title} ${r.tags.join(' ')}`).includes(needle))
      .slice(0, 8);
  }, [resources, filter, linkedIds]);

  async function link(resource: Resource) {
    setBusy(true);
    try {
      if (scope === product.authorization_nr) await linkProduct(scope, resource.id);
      else await linkAtc(scope, resource.id);
      setFilter('');
      onDone();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-surface-1 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-2">Lier une ressource à…</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="rounded p-1 text-ink-3 hover:bg-surface-2"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setScope(product.authorization_nr)}
          className={`rounded-full border px-2 py-0.5 text-xs ${
            scope === product.authorization_nr
              ? 'border-accent bg-accent text-on-accent'
              : 'border-line text-ink-2 hover:border-accent-ring'
          }`}
        >
          ce produit
        </button>
        {levels.map((prefix) => (
          <button
            key={prefix}
            type="button"
            onClick={() => setScope(prefix)}
            title={`Toute la classe ${prefix}`}
            className={`rounded-full border px-2 py-0.5 font-mono text-xs ${
              scope === prefix
                ? 'border-accent bg-accent text-on-accent'
                : 'border-line text-ink-2 hover:border-accent-ring'
            }`}
          >
            {prefix}
          </button>
        ))}
      </div>

      <input
        autoFocus
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filtrer les ressources…"
        className="mt-2 w-full rounded-lg border border-line-strong px-3 py-1.5 text-sm
                   focus:border-accent focus:ring-0"
      />
      <ul className="mt-2 space-y-1">
        {candidates.map((resource) => (
          <li key={resource.id}>
            <button
              type="button"
              disabled={busy}
              onClick={() => void link(resource)}
              className="w-full truncate rounded px-2 py-1 text-left text-sm text-ink-2
                         hover:bg-accent-soft hover:text-accent"
            >
              {resource.title}
            </button>
          </li>
        ))}
        {candidates.length === 0 && (
          <li className="px-2 py-1 text-sm text-ink-3">Aucune ressource à proposer.</li>
        )}
      </ul>
    </div>
  );
}
