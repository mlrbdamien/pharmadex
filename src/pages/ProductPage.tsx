import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Link2, Loader2, Pill, Unlink } from 'lucide-react';
import { ResourceCard } from '../components/ResourceCard';
import { LinkPicker } from '../components/LinkPicker';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
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
import { bestByType, fetchNoticeHtml, listNotices, NOTICE_SHORTCUTS } from '../lib/notices';
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
  const [noticeHtml, setNoticeHtml] = useState<string | null>(null);
  const [anchor, setAnchor] = useState('');
  const noticeFrame = useRef<HTMLIFrameElement>(null);
  const [linking, setLinking] = useState(false);
  const [delisted, setDelisted] = useState(false);
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
    void supabase
      .from('products')
      .select('delisted')
      .eq('authorization_nr', nr)
      .maybeSingle()
      .then(({ data }) => setDelisted(Boolean(data?.delisted)));
    const [docs, pkgs, detail] = await Promise.all([
      listNotices(nr),
      listPackages(nr),
      linkDetails(nr, found.product.atc_code),
    ]);
    // Seule l'information professionnelle intéresse le comptoir — la notice
    // patient redirait la même chose en moins précis (décision produit).
    setNotices(docs.filter((n) => n.doc_type === 'SmPC'));
    setPackages(pkgs);
    setLinks(detail);
    setActiveDoc((current) => current ?? bestByType(docs).SmPC ?? null);
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

  useEffect(() => {
    setNoticeHtml(null);
    setAnchor('');
    if (!activeDoc) return;
    let cancelled = false;
    void fetchNoticeHtml(activeDoc.html_url).then((html) => {
      if (!cancelled) setNoticeHtml(html);
    });
    return () => {
      cancelled = true;
    };
  }, [activeDoc]);

  // Défile l'iframe jusqu'à la rubrique. `allow-same-origin` sans
  // `allow-scripts` : aucun script de la notice ne s'exécute, mais NOUS
  // pouvons piloter son défilement depuis l'application.
  //
  // Surtout pas scrollIntoView : il fait défiler TOUS les ancêtres
  // défilables, donc la page entière bougeait à chaque clic de rubrique.
  // On ne touche qu'au défilement interne de l'iframe.
  useEffect(() => {
    if (!anchor) return;
    const frame = noticeFrame.current;
    const doc = frame?.contentDocument;
    const cible = doc?.getElementById(anchor);
    if (!frame || !doc || !cible) return;
    const haut =
      cible.getBoundingClientRect().top +
      (doc.documentElement.scrollTop || doc.body.scrollTop || 0);
    frame.contentWindow?.scrollTo({ top: Math.max(0, haut - 8), behavior: 'smooth' });
  }, [anchor, noticeHtml]);

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

  const product = hit?.product;

  return (
    <>
      <EnteteEcran titre="Fiche médicament" onMenu={useMenu()} />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-3 hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>

        {loading ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-ink-3">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : notFound || !product ? (
          <p className="mt-10 text-center text-sm text-ink-3">
            Produit inconnu. <Link to="/" className="text-accent underline">Retour à la recherche</Link>
          </p>
        ) : (
          <div className="space-y-6">
            {/* ---- En-tête ---- */}
            <section>
              <div className="flex items-start gap-3">
                <Pill className="mt-1 size-6 shrink-0 text-accent" aria-hidden />
                <div>
                  <h1 className="flex items-center gap-2 text-xl font-semibold text-ink">
                    {product.name}
                    {delisted && (
                      <span className="bg-warning-soft text-warning-text rounded px-2 py-0.5 text-xs font-medium">
                        retiré du marché
                      </span>
                    )}
                  </h1>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-ink-3">
                    {product.company && <span>{product.company}</span>}
                    {product.atc_code && <span className="font-mono">{product.atc_code}</span>}
                    {product.category && <span>{CATEGORY_LABELS[product.category] ?? product.category}</span>}
                  </p>
                  {product.substances && (
                    <p className="mt-0.5 text-sm text-ink-3">{product.substances}</p>
                  )}
                </div>
              </div>
            </section>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
            {/* ---- Notice intégrée ---- */}
            {notices.length === 0 && (
              <p className="border-line bg-surface-1 text-ink-3 rounded-card border px-4 py-6 text-center text-sm">
                Pas de notice AIPS pour ce produit.
              </p>
            )}
            {notices.length > 0 && (
              <section>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="etiquette">
                    Information professionnelle
                    {activeDoc && activeDoc.lang !== 'fr' && ` (${activeDoc.lang})`}
                  </span>
                  {activeDoc?.pdf_url && (
                    <a
                      href={activeDoc.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3
                                 py-1.5 text-sm text-ink-2 hover:border-accent"
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
                                ? 'border-accent bg-accent-soft text-accent'
                                : 'border-line text-ink-2 hover:border-accent-ring'
                            }`}
                          >
                            {shortcut.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {noticeHtml === null ? (
                      <div className="border-line bg-surface-1 mt-2 flex h-[32rem] w-full items-center justify-center rounded-lg border xl:h-[44rem]">
                        <Loader2 className="text-ink-3 size-5 animate-spin" />
                      </div>
                    ) : (
                      <iframe
                        ref={noticeFrame}
                        key={activeDoc.html_url}
                        srcDoc={noticeHtml}
                        title={DOC_LABELS[activeDoc.doc_type]}
                        sandbox="allow-same-origin"
                        className="border-line mt-2 h-[32rem] w-full rounded-lg border bg-white xl:h-[44rem]"
                      />
                    )}
                    <p className="mt-1 text-xs text-ink-3">
                      Source : AIPS / Refdata — document officiel, à titre consultatif.
                    </p>
                  </>
                )}
              </section>
            )}

            </div>

            <div className="min-w-0 space-y-6">
            {/* ---- Ressources liées ---- */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wide text-ink-3 uppercase">
                  Ressources Pharmadex liées
                </h2>
                {canEdit && !linking && (
                  <button
                    type="button"
                    onClick={() => setLinking(true)}
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
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
                            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-ink-3">
                              ce produit
                            </span>
                          )}
                          {(links.byPrefix.get(resource.id) ?? []).map((prefix) => (
                            <span
                              key={prefix}
                              className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent"
                            >
                              {prefix}
                            </span>
                          ))}
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => void unlink(resource)}
                              title="Délier"
                              className="rounded p-1 text-ink-3 hover:bg-critical-soft hover:text-critical-text"
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
                  <p className="text-sm text-ink-3">
                    Aucune ressource liée à ce produit ou à sa classe.
                  </p>
                )
              )}
            </section>

            {/* ---- Emballages ---- */}
            {packages.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-ink-3 uppercase">
                  Emballages ({packages.length})
                </h2>
                <table className="w-full text-sm">
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.gtin} className="border-b border-line">
                        <td className="py-1.5 text-ink-2">
                          {pkg.description_fr || pkg.description || '—'}
                        </td>
                        <td className="py-1.5 text-right text-ink-2 tabular">
                          {pkg.price_public != null
                            ? `${pkg.price_public.toFixed(2)} CHF`
                            : ''}
                        </td>
                        <td className="donnee py-1.5 pl-3 text-right text-xs text-ink-3">
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
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-ink-3 uppercase">
                  Même classe {product.atc_code} ({generics.length})
                </h2>
                <div className="rounded-lg border border-line bg-surface-1">
                  {generics.map((generic) => (
                    <Link
                      key={generic.authorization_nr}
                      to={`/p/${generic.authorization_nr}`}
                      className="flex items-center gap-2 border-b border-line px-3 py-2 text-sm
                                 last:border-0 hover:bg-accent-soft"
                    >
                      <span className="min-w-0 flex-1 truncate text-ink">{generic.name}</span>
                      <span className="shrink-0 text-xs text-ink-3">{generic.company}</span>
                      <ExternalLink className="size-3.5 shrink-0 text-ink-3" aria-hidden />
                    </Link>
                  ))}
                </div>
              </section>
            )}
            </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </>
  );
}
