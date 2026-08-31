import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  ChevronDown,
  ExternalLink,
  Link2,
  Loader2,
  Pill,
  Unlink,
} from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { ResourceCard } from '../components/ResourceCard';
import { NotesProduit } from '../components/NotesProduit';
import { LinkPicker } from '../components/LinkPicker';
import { cn } from '../components/ui';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
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
import { fichesPourAtc, LIBELLES_VOLET } from '../lib/fiches';

/** Catégorie de remise : lisible à un mètre, du plus strict au plus libre. */
const CATEGORIES: Record<string, { libelle: string; classes: string }> = {
  A: { libelle: 'A — ordonnance non renouvelable', classes: 'bg-critical-soft text-critical-text' },
  B: { libelle: 'B — sur ordonnance', classes: 'bg-warning-soft text-warning-text' },
  D: { libelle: 'D — conseil spécialisé', classes: 'bg-accent-soft text-accent' },
  E: { libelle: 'E — vente libre', classes: 'bg-good-soft text-good-text' },
};

export function ProductPage() {
  const { nr } = useParams<{ nr: string }>();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const ouvrirMenu = useMenu();

  const [hit, setHit] = useState<ScanHit | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [generics, setGenerics] = useState<ProductRow[]>([]);
  const [links, setLinks] = useState<LinkDetail | null>(null);
  const [activeDoc, setActiveDoc] = useState<Notice | null>(null);
  const [noticeHtml, setNoticeHtml] = useState<string | null>(null);
  const [anchor, setAnchor] = useState('');
  const [linking, setLinking] = useState(false);
  const [delisted, setDelisted] = useState(false);
  const [substancesOuvertes, setSubstancesOuvertes] = useState(false);

  // Le catalogue des fiches est statique et léger : pas de requête, pas
  // d'état de chargement — seules leurs sections arrivent à la demande.
  const { fiches: catalogue } = useStore();
  const fiches = fichesPourAtc(catalogue, hit?.product.atc_code);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const noticeFrame = useRef<HTMLIFrameElement>(null);

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
    // Seule l'information professionnelle intéresse le comptoir.
    const pros = docs.filter((n) => n.doc_type === 'SmPC');
    setNotices(pros);
    setPackages(pkgs);
    setLinks(detail);
    setActiveDoc((current) => current ?? bestByType(pros).SmPC ?? null);
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
    setSubstancesOuvertes(false);
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

  /** Défilement piloté, confiné à l'iframe (jamais scrollIntoView). */
  const allerA = useCallback((cible: string) => {
    setAnchor(cible);
    const frame = noticeFrame.current;
    const doc = frame?.contentDocument;
    const element = doc?.getElementById(cible);
    if (!frame || !doc || !element) return;
    const haut =
      element.getBoundingClientRect().top +
      (doc.documentElement.scrollTop || doc.body.scrollTop || 0);
    frame.contentWindow?.scrollTo({ top: Math.max(0, haut - 8), behavior: 'smooth' });
  }, []);

  // Suivi de lecture : pendant le défilement de la notice, la rubrique
  // visible se surligne dans le sommaire. Possible parce que l'iframe est
  // en allow-same-origin (sans scripts) : on lit ses positions depuis ici.
  useEffect(() => {
    const frame = noticeFrame.current;
    const win = frame?.contentWindow;
    const doc = frame?.contentDocument;
    if (!win || !doc || noticeHtml === null) return;

    const raccourcis = NOTICE_SHORTCUTS.SmPC;
    function surDefilement() {
      if (!doc) return;
      const y = (doc.documentElement.scrollTop || doc.body.scrollTop || 0) + 80;
      let courant = '';
      for (const r of raccourcis) {
        const el = doc.getElementById(r.anchor);
        if (el && el.offsetTop <= y) courant = r.anchor;
      }
      if (courant) setAnchor(courant);
    }
    win.addEventListener('scroll', surDefilement, { passive: true });
    return () => win.removeEventListener('scroll', surDefilement);
  }, [noticeHtml]);

  async function unlink(resource: Resource) {
    if (!nr || !links) return;
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
  const categorie = product?.category ? CATEGORIES[product.category] : null;

  if (loading || notFound || !product) {
    return (
      <>
        <EnteteEcran titre="Fiche médicament" onMenu={ouvrirMenu} />
        <main className="flex flex-1 items-center justify-center">
          {loading ? (
            <Loader2 className="text-ink-3 size-5 animate-spin" />
          ) : (
            <p className="text-ink-3 text-sm">
              Produit inconnu.{' '}
              <Link to="/" className="text-accent underline">
                Retour à la recherche
              </Link>
            </p>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      <EnteteEcran
        titre="Fiche médicament"
        onMenu={ouvrirMenu}
        actions={
          <Link
            to={`/dispensation?p=${product.authorization_nr}`}
            className="border-line text-ink-2 hover:text-ink hover:bg-surface-2 rounded-control
                       inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[13px]"
          >
            <Calculator size={13} strokeWidth={1.75} aria-hidden />
            Dispensation
          </Link>
        }
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
        {/* ---- En-tête compact ---- */}
        <div className="border-line bg-surface-1 shrink-0 border-b px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Retour"
              className="rounded-control text-ink-3 hover:bg-surface-2 hover:text-ink -ml-1 inline-flex
                         h-8 w-8 shrink-0 cursor-pointer items-center justify-center transition-colors"
            >
              <ArrowLeft size={17} />
            </button>
            <Pill className="text-accent size-5 shrink-0" aria-hidden />
            <h1 className="text-ink min-w-0 truncate text-[17px] font-semibold tracking-[-0.01em]">
              {product.name}
            </h1>
            {categorie && (
              <span
                title={categorie.libelle}
                className={cn(
                  'shrink-0 rounded px-2 py-0.5 text-xs font-semibold',
                  categorie.classes,
                )}
              >
                {product.category}
              </span>
            )}
            {delisted && (
              <span className="bg-warning-soft text-warning-text shrink-0 rounded px-2 py-0.5 text-xs font-medium">
                retiré du marché
              </span>
            )}
            <div className="flex-1" />
            <span className="text-ink-3 hidden shrink-0 text-[13px] lg:inline">
              {product.company}
            </span>
            {product.atc_code && (
              <span className="donnee text-ink-3 hidden shrink-0 text-[13px] md:inline">
                {product.atc_code}
              </span>
            )}
          </div>
          {product.substances &&
            // La flèche de dépliage n'apparaît que s'il y a quelque chose à
            // déplier — sur « ibuprofenum », un contrôle qui ne fait rien
            // n'est que du bruit. Seuil : substances multiples ou texte long.
            (product.substances.length > 70 || /[;,]/.test(product.substances) ? (
              <button
                type="button"
                onClick={() => setSubstancesOuvertes((v) => !v)}
                className="text-ink-3 hover:text-ink-2 mt-1 flex w-full cursor-pointer items-start
                           gap-1 pl-9 text-left text-[13px]"
                title={substancesOuvertes ? 'Replier' : 'Déplier'}
              >
                <ChevronDown
                  size={13}
                  className={cn('mt-0.5 shrink-0 transition-transform', !substancesOuvertes && '-rotate-90')}
                />
                <span className={cn('min-w-0', !substancesOuvertes && 'truncate')}>
                  {product.substances}
                </span>
              </button>
            ) : (
              <p className="text-ink-3 mt-1 pl-9 text-[13px]">{product.substances}</p>
            ))}
        </div>

        {/* ---- Notes maison : impossibles à manquer ---- */}
        <NotesProduit
          authorizationNr={product.authorization_nr}
          atcCode={product.atc_code}
          substances={product.substances}
        />

        {/* ---- Corps : sommaire · notice · périphérie ---- */}
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Sommaire des rubriques */}
          {notices.length > 0 && (
            <nav
              aria-label="Rubriques de la notice"
              className="border-line shrink-0 lg:w-52 lg:overflow-y-auto lg:border-r
                         max-lg:overflow-x-auto max-lg:border-b"
            >
              <div className="flex gap-0.5 p-2 max-lg:items-center lg:flex-col lg:py-3">
                {NOTICE_SHORTCUTS.SmPC.map((r) => {
                  const actif = anchor === r.anchor;
                  return (
                    <button
                      key={r.anchor}
                      type="button"
                      onClick={() => allerA(r.anchor)}
                      aria-current={actif || undefined}
                      className={cn(
                        'rounded-control shrink-0 cursor-pointer px-2.5 py-1.5 text-left text-[13.5px] transition-colors',
                        actif
                          ? 'bg-accent-soft text-accent font-medium'
                          : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                      )}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          )}

          {/* Notice */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col max-lg:h-[70vh]">
            {notices.length === 0 ? (
              <p className="text-ink-3 m-auto p-8 text-center text-sm">
                Pas d'information professionnelle AIPS pour ce produit.
              </p>
            ) : noticeHtml === null ? (
              <div className="m-auto">
                <Loader2 className="text-ink-3 size-5 animate-spin" />
              </div>
            ) : (
              <>
                <iframe
                  ref={noticeFrame}
                  key={activeDoc?.html_url}
                  srcDoc={noticeHtml}
                  title="Information professionnelle"
                  sandbox="allow-same-origin"
                  className="min-h-0 w-full flex-1 bg-white"
                />
                <p className="border-line text-ink-3 shrink-0 border-t px-4 py-1.5 text-[11.5px]">
                  Source : AIPS / Refdata — document officiel, à titre consultatif
                  {activeDoc && activeDoc.lang !== 'fr' && ` (${activeDoc.lang})`}.
                </p>
              </>
            )}
          </div>

          {/* Périphérie */}
          <aside
            className="border-line bg-rail shrink-0 lg:w-80 lg:overflow-y-auto lg:border-l
                       max-lg:border-t"
          >
            <div className="space-y-5 p-4">
              <section>
                <div className="mb-1.5 flex items-center justify-between">
                  <h2 className="etiquette">Ressources liées</h2>
                  {canEdit && !linking && (
                    <button
                      type="button"
                      onClick={() => setLinking(true)}
                      className="text-accent inline-flex cursor-pointer items-center gap-1 text-[13px] hover:underline"
                    >
                      <Link2 className="size-3.5" /> Lier
                    </button>
                  )}
                </div>
                {linking && (
                  <div className="mb-2">
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
                      <div key={resource.id}>
                        <ResourceCard
                          resource={resource}
                          canEdit={canEdit}
                          onTagClick={() => navigate('/')}
                          onChanged={() => void load()}
                        />
                        {links && (
                          <div className="mt-1 flex items-center justify-end gap-1">
                            {links.direct.has(resource.id) && (
                              <span className="bg-surface-2 text-ink-3 rounded px-1.5 py-0.5 text-[11px]">
                                ce produit
                              </span>
                            )}
                            {(links.byPrefix.get(resource.id) ?? []).map((prefix) => (
                              <span
                                key={prefix}
                                className="bg-accent-soft text-accent donnee rounded px-1.5 py-0.5 text-[11px]"
                              >
                                {prefix}
                              </span>
                            ))}
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => void unlink(resource)}
                                title="Délier"
                                className="text-ink-3 hover:bg-critical-soft hover:text-critical-text
                                           cursor-pointer rounded p-1"
                              >
                                <Unlink className="size-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  !linking && <p className="text-ink-3 text-[13px]">Aucune pour ce produit ou sa classe.</p>
                )}
              </section>

              {/* Aide-mémoire : la fiche de classe que le code ATC du produit
                  fait remonter. C'est le lien qui justifie d'avoir réuni les
                  deux outils — scanner un Temesta ouvre les benzodiazépines. */}
              {fiches.length > 0 && (
                <section>
                  <h2 className="etiquette mb-1.5">Aide-mémoire</h2>
                  <div className="border-line bg-surface-1 shadow-card rounded-card overflow-hidden border">
                    {fiches.map((fiche) => (
                      <Link
                        key={fiche.id}
                        to={`/f/${fiche.id}`}
                        className="border-line hover:bg-surface-2 flex items-baseline gap-2.5 border-b px-3 py-2 last:border-0"
                      >
                        <span className="donnee text-accent shrink-0 text-[12px] font-semibold">
                          {fiche.code}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-ink block truncate text-[13.5px] font-medium">
                            {fiche.titre}
                          </span>
                          <span className="text-ink-3 block truncate text-[12px]">
                            {LIBELLES_VOLET[fiche.volet]}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {packages.length > 0 && (
                <section>
                  <h2 className="etiquette mb-1.5">Emballages ({packages.length})</h2>
                  <div className="border-line bg-surface-1 shadow-card rounded-card border">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.gtin}
                        className="border-line flex items-baseline gap-2 border-b px-3 py-1.5 last:border-0"
                      >
                        <span className="text-ink-2 min-w-0 flex-1 truncate text-[13px]">
                          {pkg.description_fr || pkg.description || '—'}
                        </span>
                        {pkg.price_public != null && (
                          <span className="text-ink tabular shrink-0 text-[13px] font-medium">
                            {pkg.price_public.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-ink-3 mt-1 text-right text-[11px]">prix publics en CHF</p>
                </section>
              )}

              {generics.length > 0 && (
                <section>
                  <h2 className="etiquette mb-1.5">
                    Même classe {product.atc_code} ({generics.length})
                  </h2>
                  <div className="border-line bg-surface-1 shadow-card rounded-card border">
                    {generics.map((generic) => (
                      <Link
                        key={generic.authorization_nr}
                        to={`/p/${generic.authorization_nr}`}
                        className="border-line hover:bg-accent-soft flex items-center gap-2 border-b px-3
                                   py-1.5 text-[13px] last:border-0"
                      >
                        <span className="text-ink min-w-0 flex-1 truncate">
                          {generic.name_fr || generic.name}
                        </span>
                        <ExternalLink className="text-ink-3 size-3 shrink-0" aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
