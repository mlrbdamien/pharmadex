import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarCheck,
  ExternalLink,
  FileText,
  Pin,
  PinOff,
} from 'lucide-react';
import type { Resource } from '../lib/types';
import { markVerified, togglePinned } from '../lib/resources';
import { formatDate, formatSize, hostname } from '../lib/format';

type Props = {
  resource: Resource;
  canEdit: boolean;
  onTagClick: (tag: string) => void;
  onChanged: () => void;
  /** Le premier résultat : celui qu'Entrée ouvre. */
  first?: boolean;
};

export function ResourceCard({ resource, canEdit, onTagClick, onChanged, first }: Props) {
  const [busy, setBusy] = useState(false);
  const isFile = Boolean(resource.file_path);

  async function act(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <article
      className={`group flex items-start gap-3 rounded-lg border bg-surface-1 px-4 py-3 shadow-sm
                  transition hover:border-accent-ring hover:shadow
                  ${first ? 'border-accent ring-1 ring-accent-ring' : 'border-line'}`}
    >
      {/* Le clic ouvre la fiche — décision produit du 27.08.2026. Le bouton
          « Ouvrir » de la fiche mène ensuite au lien ou au fichier. */}
      <Link to={`/r/${resource.id}`} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          {isFile ? (
            <FileText className="size-4 shrink-0 text-ink-3" aria-hidden />
          ) : (
            <ExternalLink className="size-4 shrink-0 text-ink-3" aria-hidden />
          )}
          <h3 className="truncate font-medium text-ink group-hover:text-accent">
            {resource.title}
          </h3>
          {resource.pinned && <Pin className="size-3.5 shrink-0 text-warning" aria-label="Épinglée" />}
          {resource.broken && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded bg-critical-soft px-1.5 py-0.5
                         text-xs font-medium text-critical-text"
              title={`Dernier contrôle : ${formatDate(resource.last_checked_at)}${
                resource.last_status ? ` — HTTP ${resource.last_status}` : ''
              }`}
            >
              <AlertTriangle className="size-3" /> lien cassé
            </span>
          )}
        </div>

        {resource.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-ink-2">{resource.description}</p>
        )}

        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
          <span className="truncate">
            {isFile ? `${resource.file_name} · ${formatSize(resource.file_size)}` : hostname(resource.url)}
          </span>
          {resource.verified_on && <span>vérifié le {formatDate(resource.verified_on)}</span>}
          {resource.owner && <span>{resource.owner}</span>}
        </p>
      </Link>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex flex-wrap justify-end gap-1">
          {resource.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-ink-2 hover:bg-accent-soft
                         hover:text-accent"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
          {canEdit && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => void act(() => markVerified(resource.id))}
                title="Marquer comme vérifiée aujourd'hui"
                className="rounded p-1 text-ink-3 hover:bg-surface-2 hover:text-accent"
              >
                <CalendarCheck className="size-4" />
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void act(() => togglePinned(resource.id, !resource.pinned))}
                title={resource.pinned ? 'Désépingler' : 'Épingler'}
                className="rounded p-1 text-ink-3 hover:bg-surface-2 hover:text-warning"
              >
                {resource.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
