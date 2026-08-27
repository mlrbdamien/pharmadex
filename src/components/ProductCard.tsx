import { useMemo, useState } from 'react';
import { ExternalLink, Link2, Pill, Search, X } from 'lucide-react';
import type { Product, Resource } from '../lib/types';
import { atcLevels, linkAtc, linkProduct } from '../lib/products';
import { fold } from '../lib/resources';
import { useStore } from '../lib/store';

type Props = {
  product: Product;
  canEdit: boolean;
  /** Relance une recherche texte avec le nom du produit. */
  onSearchName: (name: string) => void;
  /** Une liaison vient d'être créée : re-scanner pour rafraîchir. */
  onLinked: () => void;
  /** Ressources déjà liées (pour les exclure du sélecteur). */
  linked: Resource[];
};

const CATEGORY_LABELS: Record<string, string> = {
  A: 'A — ordonnance non renouvelable',
  B: 'B — sur ordonnance',
  D: 'D — conseil spécialisé',
  E: 'E — vente libre',
};

export function ProductCard({ product, canEdit, onSearchName, onLinked, linked }: Props) {
  const { resources } = useStore();
  const [linking, setLinking] = useState(false);
  const [filter, setFilter] = useState('');
  /** Portée choisie : n° d'autorisation, ou un préfixe ATC. */
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
      setLinking(false);
      setFilter('');
      onLinked();
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-lg border border-teal-300 bg-teal-50/50 px-4 py-3">
      <div className="flex items-start gap-3">
        <Pill className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-slate-900">{product.name}</h2>
          <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
            {product.package_description && <span>{product.package_description}</span>}
            {product.company && <span>{product.company}</span>}
            {product.atc_code && <span className="font-mono">{product.atc_code}</span>}
            {product.category && (
              <span>{CATEGORY_LABELS[product.category] ?? product.category}</span>
            )}
          </p>
          {product.substances && (
            <p className="mt-0.5 truncate text-xs text-slate-400">{product.substances}</p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSearchName(product.name.split(',')[0])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 px-2.5 py-1
                     text-sm text-teal-700 hover:bg-teal-100"
        >
          <Search className="size-3.5" /> Chercher « {product.name.split(',')[0]} »
        </button>
        <a
          href={`https://www.swissmedicinfo.ch/?query=${encodeURIComponent(product.name.split(',')[0])}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1
                     text-sm text-slate-600 hover:bg-white"
        >
          <ExternalLink className="size-3.5" /> Notice (AIPS)
        </a>
        {canEdit && !linking && (
          <button
            type="button"
            onClick={() => setLinking(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1
                       text-sm text-slate-600 hover:bg-white"
          >
            <Link2 className="size-3.5" /> Lier une ressource
          </button>
        )}
      </div>

      {linking && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Lier une ressource à…</span>
            <button
              type="button"
              onClick={() => setLinking(false)}
              aria-label="Fermer"
              className="rounded p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Portée : le produit précis, ou un niveau de la classe ATC.
              Boutons plutôt que saisie libre : impossible de se tromper de code. */}
          <div className="mt-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setScope(product.authorization_nr)}
              className={`rounded-full border px-2 py-0.5 text-xs ${
                scope === product.authorization_nr
                  ? 'border-teal-600 bg-teal-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-teal-300'
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
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-teal-300'
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
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm
                       focus:border-teal-600 focus:ring-0"
          />
          <ul className="mt-2 space-y-1">
            {candidates.map((resource) => (
              <li key={resource.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void link(resource)}
                  className="w-full truncate rounded px-2 py-1 text-left text-sm text-slate-700
                             hover:bg-teal-50 hover:text-teal-800"
                >
                  {resource.title}
                </button>
              </li>
            ))}
            {candidates.length === 0 && (
              <li className="px-2 py-1 text-sm text-slate-400">Aucune ressource à proposer.</li>
            )}
          </ul>
        </div>
      )}
    </article>
  );
}
