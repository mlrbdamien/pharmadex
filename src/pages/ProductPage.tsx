import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Link2, Loader2, Pill, Unlink } from 'lucide-react';
import { Header } from '../components/Header';
import { ResourceCard } from '../components/ResourceCard';
import { LinkPicker } from '../components/LinkPicker';
import { useAuth } from '../lib/auth';
import {
  linkDetails,
  listGenerics,
  listPackages,
  productHit,
  unlinkAtc,
  unlinkProduct,
} from '../lib/products';
import type { LinkDetail, PackageRow } from '../lib/products';
import type { ProductRow } from '../lib/types';
import { bestByType, listNotices, NOTICE_SHORTCUTS } from '../lib/notices';
import type { Notice } from '../lib/notices';
import type { Resource, ScanHit } from '../lib/types';

const CATEGORY_LABELS: Record<string, string> = {
  A: 'Cat. A — ordonnance non renouvelable',
  B: 'Cat. B — sur ordonnance',
  D: 'Cat. D — conseil spécialisé',
  E: 'Cat. E — vente libre',
};

const DOC_LABELS: Record<string, string> = {
  SmPC: 'Information professionnelle',
  PIL: 'Notice patient',
  PL: 'Notice',
};

export function ProductPage() {
  const { nr } = useParams<{ nr: string }>();
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  const [hit, setHit] = useState<ScanHit | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [generics, setGenerics] = useState<ProductRow[]>([]);
  const [links, setLinks] = useState<LinkDetail | null>(null);
  const [activeDoc, setActiveDoc] = useState<Notice | null>(null);
  const [anchor, setAnchor] = useState('');
  const [linking, setLinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!nr) return;
    const found = await productHit(nr);
    if (!found) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setHit(found);
    const [docs, pkgs, detail] = await Promise.all([
      listNotices(nr),
      listPackages(nr),
      linkDetails(nr, found.product.atc_code),
    ]);
    setNotices(docs);
    setPackages(pkgs);
    setLinks(detail);
    setActiveDoc((current) => current ?? bestByType(docs).SmPC ?? bestByType(docs).PIL ?? null);
    if (found.product.atc_code) {
      setGenerics(await listGenerics(found.product.atc_code, nr));
    }
    setLoading(false);
  }, [nr]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setHit(null);
    setActiveDoc(null);
    setAnchor('');
    void load();
  }, [load]);

  async function unlink(resource: Resource) {
    if (!nr || !links) return;
    // Une liaison de classe couvre d'autres produits : le geste doit le dire.
    const prefixes = links.byPrefix.get(resource.id) ?? [];
    if (links.direct.has(resource.id)) {
      await unlinkProduct(nr, resource.id);
    }
    for (const prefix of prefixes) {
      if (
        window.confirm(
          `« ${resource.title} » est liée à toute la classe ${prefix}. La délier pour TOUS les produits de cette classe ?`,
        )
      ) {
        await unlinkAtc(prefix, resource.id);
      }
    }
    await load();
  }

  const best = bestByType(notices);
  const product = hit?.product;

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
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
        ) : notFound || !product ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            Produit inconnu. <Link to="/" className="text-teal-700 underline">Retour à la recherche</Link>
          </p>
        ) : (
          <div className="space-y-6">
            {/* ---- En-tête ---- */}
            <section>
              <div className="flex items-start gap-3">
                <Pill className="mt-1 size-6 shrink-0 text-teal-700" aria-hidden />
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">{product.name}</h1>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-slate-500">
                    {product.company && <span>{product.company}</span>}
                    {product.atc_code && <span className="font-mono">{product.atc_code}</span>}
                    {product.category && <span>{CATEGORY_LABELS[product.category] ?? product.category}</span>}
                  </p>
                  {product.substances && (
                    <p className="mt-0.5 text-sm text-slate-400">{product.substances}</p>
                  )}
                </div>
              </div>
            </section>

            {/* ---- Notice intégrée ---- */}
            {notices.length > 0 && (
              <section>
                <div className="flex flex-wrap items-center gap-2">
                  {(['SmPC', 'PIL', 'PL'] as const).map((type) =>
                    best[type] ? (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setActiveDoc(best[type]!);
                          setAnchor('');
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${
                          activeDoc?.doc_type === type
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : 'border-slate-300 text-slate-600 hover:border-teal-400'
                        }`}
                      >
                        {DOC_LABELS[type]}
                        {best[type]!.lang !== 'fr' && (
                          <span className="ml-1 opacity-70">({best[type]!.lang})</span>
                        )}
                      </button>
                    ) : null,
                  )}
                  {activeDoc?.pdf_url && (
                    <a
                      href={activeDoc.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3
                                 py-1.5 text-sm text-slate-600 hover:border-teal-400"
                    >
                      <FileText className="size-4" /> PDF
                    </a>
                  )}
                </div>

                {activeDoc && (
                  <>
                    {(NOTICE_SHORTCUTS[activeDoc.doc_type as 'SmPC' | 'PIL'] ?? []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {NOTICE_SHORTCUTS[activeDoc.doc_type as 'SmPC' | 'PIL'].map((shortcut) => (
                          <button
                            key={shortcut.anchor}
                            type="button"
                            onClick={() => setAnchor(shortcut.anchor)}
                            className={`rounded-full border px-2.5 py-0.5 text-xs ${
                              anchor === shortcut.anchor
                                ? 'border-teal-600 bg-teal-50 text-teal-800'
                                : 'border-slate-200 text-slate-600 hover:border-teal-300'
                            }`}
                          >
                            {shortcut.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <iframe
                      key={`${activeDoc.html_url}#${anchor}`}
                      src={anchor ? `${activeDoc.html_url}#${anchor}` : activeDoc.html_url}
                      title={DOC_LABELS[activeDoc.doc_type]}
                      sandbox=""
                      className="mt-2 h-[32rem] w-full rounded-lg border border-slate-200 bg-white"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Source : AIPS / Refdata — document officiel, à titre consultatif.
                    </p>
                  </>
                )}
              </section>
            )}

            {/* ---- Ressources liées ---- */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Ressources Pharmadex liées
                </h2>
                {canEdit && !linking && (
                  <button
                    type="button"
                    onClick={() => setLinking(true)}
                    className="inline-flex items-center gap-1 text-sm text-teal-700 hover:underline"
                  >
                    <Link2 className="size-3.5" /> Lier
                  </button>
                )}
              </div>
              {linking && (
                <div className="mb-3">
                  <LinkPicker
                    product={product}
                    linked={hit!.resources as Resource[]}
                    onDone={() => void load()}
                    onClose={() => setLinking(false)}
                  />
                </div>
              )}
              {(hit!.resources as Resource[]).length > 0 ? (
                <div className="space-y-2">
                  {(hit!.resources as Resource[]).map((resource) => (
                    <div key={resource.id} className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <ResourceCard
                          resource={resource}
                          canEdit={canEdit}
                          onTagClick={() => navigate('/')}
                          onChanged={() => void load()}
                        />
                      </div>
                      {links && (
                        <div className="flex shrink-0 flex-col items-end gap-1 pt-2">
                          {links.direct.has(resource.id) && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                              ce produit
                            </span>
                          )}
                          {(links.byPrefix.get(resource.id) ?? []).map((prefix) => (
                            <span
                              key={prefix}
                              className="rounded bg-teal-50 px-1.5 py-0.5 font-mono text-xs text-teal-700"
                            >
                              {prefix}
                            </span>
                          ))}
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => void unlink(resource)}
                              title="Délier"
                              className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Unlink className="size-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !linking && (
                  <p className="text-sm text-slate-400">
                    Aucune ressource liée à ce produit ou à sa classe.
                  </p>
                )
              )}
            </section>

            {/* ---- Emballages ---- */}
            {packages.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Emballages ({packages.length})
                </h2>
                <table className="w-full text-sm">
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.gtin} className="border-b border-slate-100">
                        <td className="py-1.5 text-slate-700">{pkg.description || '—'}</td>
                        <td className="py-1.5 text-right font-mono text-xs text-slate-400">
                          {pkg.gtin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* ---- Génériques / apparentés ---- */}
            {generics.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Même classe {product.atc_code} ({generics.length})
                </h2>
                <div className="rounded-lg border border-slate-200 bg-white">
                  {generics.map((generic) => (
                    <Link
                      key={generic.authorization_nr}
                      to={`/p/${generic.authorization_nr}`}
                      className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-sm
                                 last:border-0 hover:bg-teal-50"
                    >
                      <span className="min-w-0 flex-1 truncate text-slate-800">{generic.name}</span>
                      <span className="shrink-0 text-xs text-slate-400">{generic.company}</span>
                      <ExternalLink className="size-3.5 shrink-0 text-slate-300" aria-hidden />
                    </Link>
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
