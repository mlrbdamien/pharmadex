import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Link2, Pill, Search, StickyNote } from 'lucide-react';
import type { Product, Resource } from '../lib/types';
import { LinkPicker } from './LinkPicker';
import { useStore } from '../lib/store';
import { estAnnote } from '../lib/notes';

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
  const [linking, setLinking] = useState(false);
  const { notesIndex } = useStore();

  return (
    <article className="rounded-lg border border-accent-ring bg-accent-soft px-4 py-3">
      <div className="flex items-start gap-3">
        <Pill className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0 flex-1">
          {/* Le nom ouvre la fiche complète : notice, emballages, génériques. */}
          <Link to={`/p/${product.authorization_nr}`}>
            <h2 className="flex items-center gap-1.5 font-semibold text-ink hover:text-accent hover:underline">
              {product.name}
              {estAnnote(notesIndex, product.authorization_nr, product.atc_code, product.substances) && (
                <StickyNote className="text-warning size-4 shrink-0" aria-label="Note maison" />
              )}
            </h2>
          </Link>
          <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-3">
            {product.package_description && <span>{product.package_description}</span>}
            {product.company && <span>{product.company}</span>}
            {product.atc_code && <span className="font-mono">{product.atc_code}</span>}
            {product.category && (
              <span>{CATEGORY_LABELS[product.category] ?? product.category}</span>
            )}
          </p>
          {product.substances && (
            <p className="mt-0.5 truncate text-xs text-ink-3">{product.substances}</p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Link
          to={`/p/${product.authorization_nr}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1 text-sm
                     font-medium text-on-accent hover:bg-accent-hover"
        >
          Fiche complète
        </Link>
        <button
          type="button"
          onClick={() => onSearchName(product.name.split(',')[0])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-2.5 py-1
                     text-sm text-accent hover:bg-accent-soft"
        >
          <Search className="size-3.5" /> Chercher « {product.name.split(',')[0]} »
        </button>
        <a
          href={`https://www.swissmedicinfo.ch/?query=${encodeURIComponent(product.name.split(',')[0])}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-2.5 py-1
                     text-sm text-ink-2 hover:bg-surface-1"
        >
          <ExternalLink className="size-3.5" /> AIPS
        </a>
        {canEdit && !linking && (
          <button
            type="button"
            onClick={() => setLinking(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-2.5 py-1
                       text-sm text-ink-2 hover:bg-surface-1"
          >
            <Link2 className="size-3.5" /> Lier une ressource
          </button>
        )}
      </div>

      {linking && (
        <div className="mt-3">
          <LinkPicker
            product={product}
            linked={linked}
            onDone={() => {
              setLinking(false);
              onLinked();
            }}
            onClose={() => setLinking(false)}
          />
        </div>
      )}
    </article>
  );
}
