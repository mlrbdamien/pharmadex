import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Pill,
  Unlink,
} from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../lib/auth';
import { getResource, markVerified, openResource } from '../lib/resources';
import { resourceLinks, unlinkAtc, unlinkProduct } from '../lib/products';
import type { ResourceLinks } from '../lib/products';
import { formatDate, formatSize, hostname } from '../lib/format';
import type { Resource } from '../lib/types';

export function ResourcePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  const [resource, setResource] = useState<Resource | null>(null);
  const [links, setLinks] = useState<ResourceLinks>({ products: [], atc: [] });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    const [row, linked] = await Promise.all([getResource(id), resourceLinks(id)]);
    setResource(row);
    setLinks(linked);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const isFile = Boolean(resource?.file_path);

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>

        {loading ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : !resource ? (
          <p className="mt-10 text-center text-sm text-slate-500">Ressource introuvable.</p>
        ) : (
          <div className="space-y-5">
            <section>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl font-semibold text-slate-900">{resource.title}</h1>
                {canEdit && (
                  <Link
                    to={`/r/${resource.id}/modifier`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300
                               px-2.5 py-1.5 text-sm text-slate-600 hover:border-teal-400"
                  >
                    <Pencil className="size-3.5" /> Modifier
                  </Link>
                )}
              </div>
              {resource.description && (
                <p className="mt-1 text-sm text-slate-600">{resource.description}</p>
              )}

              <button
                type="button"
                onClick={() => void openResource(resource)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm
                           font-medium text-white hover:bg-teal-800"
              >
                {isFile ? <FileText className="size-4" /> : <ExternalLink className="size-4" />}
                Ouvrir {isFile ? resource.file_name : hostname(resource.url)}
              </button>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-slate-400">Vérifiée le</dt>
                  <dd className="flex items-center gap-1.5 text-slate-700">
                    {formatDate(resource.verified_on)}
                    {canEdit && (
                      <button
                        type="button"
                        title="Marquer comme vérifiée aujourd'hui"
                        onClick={() => void markVerified(resource.id).then(load)}
                        className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-teal-700"
                      >
                        <CalendarCheck className="size-3.5" />
                      </button>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Responsable</dt>
                  <dd className="text-slate-700">{resource.owner ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">État du lien</dt>
                  <dd className="text-slate-700">
                    {resource.broken ? (
                      <span className="inline-flex items-center gap-1 text-red-700">
                        <AlertTriangle className="size-3.5" /> cassé
                        {resource.last_status && ` (HTTP ${resource.last_status})`}
                      </span>
                    ) : resource.last_checked_at ? (
                      `OK le ${formatDate(resource.last_checked_at)}`
                    ) : (
                      'jamais contrôlé'
                    )}
                  </dd>
                </div>
                {isFile && (
                  <div>
                    <dt className="text-xs text-slate-400">Fichier</dt>
                    <dd className="text-slate-700">{formatSize(resource.file_size)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-slate-400">Ajoutée</dt>
                  <dd className="text-slate-700">
                    {formatDate(resource.created_at)} · {resource.created_by}
                  </dd>
                </div>
              </dl>

              {resource.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {(links.products.length > 0 || links.atc.length > 0) && (
              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Produits et classes liés
                </h2>
                <div className="space-y-1.5">
                  {links.atc.map((entry) => (
                    <div
                      key={entry.prefix}
                      className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50/60
                                 px-3 py-2 text-sm"
                    >
                      <span className="font-mono font-medium text-teal-800">{entry.prefix}</span>
                      <span className="flex-1 text-slate-600">
                        toute la classe — {entry.product_count} produit{entry.product_count > 1 ? 's' : ''}
                      </span>
                      {canEdit && (
                        <button
                          type="button"
                          title="Délier de cette classe"
                          onClick={() => void unlinkAtc(entry.prefix, resource.id).then(load)}
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Unlink className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {links.products.map((entry) => (
                    <div
                      key={entry.authorization_nr}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white
                                 px-3 py-2 text-sm"
                    >
                      <Pill className="size-4 shrink-0 text-teal-600" aria-hidden />
                      <Link
                        to={`/p/${entry.authorization_nr}`}
                        className="min-w-0 flex-1 truncate text-slate-800 hover:text-teal-700"
                      >
                        {entry.name}
                      </Link>
                      {canEdit && (
                        <button
                          type="button"
                          title="Délier de ce produit"
                          onClick={() =>
                            void unlinkProduct(entry.authorization_nr, resource.id).then(load)
                          }
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Unlink className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
