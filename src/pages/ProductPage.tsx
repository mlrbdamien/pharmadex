import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { categorie } from '../lib/categories';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import {
  linkFiche,
  listFichesLiees,
  unlinkFiche,
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
import { chercherFiches, fichesPourAtc, LIBELLES_VOLET } from '../lib/fiches';
import type { EntreeFiche } from '../lib/fiches';


export function ProductPage() {
  const { nr } = useParams<{ nr: string }>();
  // Le dosage affiché (?d=) et l'emballage scanné (?g=). En paramètres plutôt
  // qu'en segments : « /p/47505 » reste valide pour les liens déjà partagés.
  const [params, setParams] = useSearchParams();
  const dosageDemande = params.get('d');
  const gtinScanne = params.get('g');
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
  const parAtc = fichesPourAtc(catalogue, hit?.product.atc_code);
  const [liensFiches, setLiensFiches] = useState<string[]>([]);
  const rechargerFiches = useCallback(async () => {
    if (nr) setLiensFiches(await listFichesLiees(nr));
  }, [nr]);
  useEffect(() => void rechargerFiches(), [rechargerFiches]);
  // Une fiche liée à la main peut aussi être remontée par l'ATC : on ne
  // l'affiche qu'une fois, et c'est la liaison manuelle qui prime (elle
  // porte un bouton de déliaison).
  const fichesLiees = catalogue.filter(
    (f) => liensFiches.includes(f.id) && !parAtc.some((a) => a.id === f.id),
  );
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const noticeFrame = useRef<HTMLIFrameElement>(null);

  // Le n° d'autorisation affiché EN CE MOMENT. Deux boîtes scannées à
  // quelques centaines de millisecondes : la réponse de la première, arrivée
  // après, écrivait son produit sous l'adresse de la seconde.
  const nrCourant = useRef(nr);
  nrCourant.current = nr;

  const load = useCallback(async () => {
    if (!nr) return;
    const encore = () => nrCourant.current === nr;
    const found = await productHit(nr);
    if (!encore()) return;
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
      .then(({ data }) => encore() && setDelisted(Boolean(data?.delisted)));
    const [docs, pkgs, detail] = await Promise.all([
      listNotices(nr),
      // Un échec ici ne doit pas laisser la fiche bloquée sur son indicateur
      // de chargement : sans emballages, elle reste utile.
      listPackages(nr).catch(() => [] as PackageRow[]),
      linkDetails(nr, found.product.atc_code),
    ]);
    if (!encore()) return;
    // Seule l'information professionnelle intéresse le comptoir.
    const pros = docs.filter((n) => n.doc_type === 'SmPC');
    setNotices(pros);
    setPackages(pkgs);
    setLinks(detail);
    setActiveDoc((current) => current ?? bestByType(pros).SmPC ?? null);
    if (found.product.atc_code) {
      const generiques = await listGenerics(found.product.atc_code, nr);
      if (!encore()) return;
      setGenerics(generiques);
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
  const dosages = hit?.dosages ?? [];
  /**
   * Le dosage que montre la fiche : celui de l'adresse ; à défaut, le seul
   * s'il n'y en a qu'un. Sinon aucun — la fiche présente alors l'autorisation
   * et ses dosages en puces, plutôt que d'en élire un au hasard (c'était
   * l'erreur de l'ancien import : le premier venu, 80 mg, pour tous).
   */
  const dosageDuScan = gtinScanne
    ? packages.find((k) => k.gtin === gtinScanne)?.dosage_nr ?? null
    : null;
  const courant =
    dosages.find((d) => d.dosage_nr === (dosageDemande ?? dosageDuScan)) ??
    (dosages.length === 1 ? dosages[0] : null);
  const retire = delisted || Boolean(courant?.delisted);
  // Une liaison faite depuis la fiche vaut pour l'autorisation ENTIÈRE ; sur
  // un médicament à plusieurs dosages, « ce produit » laissait croire au seul
  // dosage affiché.
  const portee = dosages.length > 1 ? 'tous les dosages' : 'ce produit';
  const categorieCode = courant?.category ?? product?.category ?? null;
  const categorieCourante = categorie(categorieCode);
  const substances = courant?.substances ?? product?.substances ?? null;
  // Les emballages du dosage affiché ; tous, groupés, sans dosage choisi.
  const emballages = courant
    ? packages.filter((k) => k.dosage_nr === courant.dosage_nr)
    : packages;

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
            to={`/dispensation?p=${product.authorization_nr}${courant ? `&d=${courant.dosage_nr}` : ''}`}
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
              {courant?.name ?? product.name}
            </h1>
            {categorieCourante && (
              <span
                title={categorieCourante.libelle}
                className={cn(
                  'shrink-0 rounded px-2 py-0.5 text-xs font-semibold',
                  categorieCourante.classes,
                )}
              >
                {categorieCode}
              </span>
            )}
            {retire && (
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
          {/* Les dosages de l'autorisation. Un clic change le dosage affiché
              sans recharger : notice, liaisons et ressources sont celles de
              l'autorisation, elles ne bougent pas. */}
          {dosages.length > 1 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-9">
              {dosages.map((d) => {
                const actif = d.dosage_nr === courant?.dosage_nr;
                return (
                  <button
                    key={d.dosage_nr}
                    type="button"
                    onClick={() => {
                      const suivant = new URLSearchParams(params);
                      suivant.set('d', d.dosage_nr);
                      suivant.delete('g');
                      setParams(suivant, { replace: true });
                    }}
                    aria-pressed={actif}
                    title={d.name}
                    className={cn(
                      'donnee cursor-pointer rounded-full border px-2.5 py-0.5 text-[12.5px] transition-colors',
                      actif
                        ? 'border-accent bg-accent text-on-accent font-semibold'
                        : 'border-line bg-surface-1 text-ink-2 hover:border-accent hover:text-accent',
                      d.delisted && !actif && 'line-through opacity-60',
                    )}
                  >
                    {d.label || d.name}
                  </button>
                );
              })}
            </div>
          )}
          {substances &&
            // La flèche de dépliage n'apparaît que s'il y a quelque chose à
            // déplier — sur « ibuprofenum », un contrôle qui ne fait rien
            // n'est que du bruit. Seuil : substances multiples ou texte long.
            (substances.length > 70 || /[;,]/.test(substances) ? (
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
                  {substances}
                </span>
              </button>
            ) : (
              <p className="text-ink-3 mt-1 pl-9 text-[13px]">{substances}</p>
            ))}
        </div>

        {/* ---- Notes maison : impossibles à manquer ---- */}
        <NotesProduit
          authorizationNr={product.authorization_nr}
          dosageNr={courant?.dosage_nr ?? null}
          dosages={dosages}
          atcCode={product.atc_code}
          substances={substances}
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
                      portee={portee}
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
                                {portee}
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

              {/* Sémaphore : les fiches que le code ATC fait remonter (large,
                  sans entretien) ET celles liées à la main (le cas d'espèce
                  que l'ATC ne dit pas). Seules les secondes se délient. */}
              <SectionSemaphore
                nr={product.authorization_nr}
                parAtc={parAtc}
                liees={fichesLiees}
                canEdit={canEdit}
                onChange={rechargerFiches}
                dosageCount={dosages.length}
              />

              {emballages.length > 0 && (
                <section>
                  <h2 className="etiquette mb-1.5">
                    Emballages {courant && dosages.length > 1 ? `· ${courant.label || courant.name} ` : ''}(
                    {emballages.length})
                  </h2>
                  <div className="border-line bg-surface-1 shadow-card rounded-card border">
                    {emballages.map((pkg) => (
                      <div
                        key={pkg.gtin}
                        className={cn(
                          'border-line flex items-baseline gap-2 border-b px-3 py-1.5 last:border-0',
                          // La boîte qu'on vient de scanner : celle qu'on a en main.
                          pkg.gtin === gtinScanne && 'bg-accent-soft',
                        )}
                      >
                        <span className="text-ink-2 min-w-0 flex-1 truncate text-[13px]">
                          {/* Sans dosage choisi, les emballages de tous les dosages
                              se côtoient : chacun dit alors à quel dosage il appartient. */}
                          {!courant && dosages.length > 1 && pkg.dosage_nr && (
                            <span className="donnee text-ink-3 mr-1.5">
                              {dosages.find((d) => d.dosage_nr === pkg.dosage_nr)?.label}
                            </span>
                          )}
                          {pkg.description_fr || pkg.description || '—'}
                        </span>
                        {/* Pour 39 dosages, la catégorie varie selon l'emballage
                            (Fluimucil 200 existe en D et en B) : on ne la montre
                            ici que lorsqu'elle diffère de celle de l'en-tête. */}
                        {pkg.category && pkg.category !== categorieCode && (
                          <span
                            title={categorie(pkg.category)?.libelle}
                            className={cn(
                              'shrink-0 rounded px-1.5 py-px text-[11px] font-semibold',
                              categorie(pkg.category)?.classes,
                            )}
                          >
                            {pkg.category}
                          </span>
                        )}
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

/* -------------------------------------------------------------------------- */

/**
 * Les fiches du Sémaphore attachées à un produit, par les deux chemins :
 * le code ATC (automatique, par classe) et la liaison manuelle (ce produit).
 * Le second existe parce que le premier est aveugle aux cas d'espèce.
 */
function SectionSemaphore({
  nr,
  parAtc,
  liees,
  canEdit,
  onChange,
  dosageCount,
}: {
  nr: string;
  /** Plus d'un dosage : une liaison se dit « tous les dosages ». */
  dosageCount: number;
  parAtc: EntreeFiche[];
  liees: EntreeFiche[];
  canEdit: boolean;
  onChange: () => Promise<void>;
}) {
  const { fiches: catalogue } = useStore();
  const [choix, setChoix] = useState(false);
  const [filtre, setFiltre] = useState('');

  const deja = new Set([...parAtc, ...liees].map((f) => f.id));
  const candidates = catalogue
    .filter((f) => !deja.has(f.id))
    .filter((f) => !filtre.trim() || chercherFiches([f], filtre).length > 0)
    .slice(0, 8);

  if (parAtc.length === 0 && liees.length === 0 && !canEdit) return null;

  return (
    <section>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h2 className="etiquette">Sémaphore</h2>
        {canEdit && (
          <button
            type="button"
            onClick={() => setChoix((c) => !c)}
            className="text-ink-3 hover:text-accent cursor-pointer text-[12px]"
          >
            {choix ? 'Fermer' : 'Lier une fiche'}
          </button>
        )}
      </div>

      {choix && (
        <div className="border-line bg-surface-1 rounded-card mb-2 border p-2">
          <input
            value={filtre}
            onChange={(event) => setFiltre(event.target.value)}
            placeholder="Filtrer les fiches…"
            autoFocus
            className="border-line bg-surface-1 focus:border-accent rounded-control w-full border px-2 py-1 text-[13px]"
          />
          <div className="mt-1.5 flex flex-col">
            {candidates.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={async () => {
                  await linkFiche(nr, f.id);
                  setChoix(false);
                  setFiltre('');
                  await onChange();
                }}
                className="hover:bg-surface-2 rounded-control flex cursor-pointer items-baseline gap-2 px-1.5 py-1 text-left"
              >
                <span className="donnee text-accent shrink-0 text-[11.5px] font-semibold">
                  {f.code}
                </span>
                <span className="text-ink-2 min-w-0 flex-1 truncate text-[13px]">{f.titre}</span>
              </button>
            ))}
            {candidates.length === 0 && (
              <p className="text-ink-3 px-1.5 py-1 text-[12.5px]">Aucune fiche à lier.</p>
            )}
          </div>
        </div>
      )}

      {parAtc.length + liees.length > 0 ? (
        <div className="border-line bg-surface-1 shadow-card rounded-card overflow-hidden border">
          {[...liees.map((f) => [f, true] as const), ...parAtc.map((f) => [f, false] as const)].map(
            ([fiche, manuelle]) => (
              <div
                key={fiche.id}
                className="border-line hover:bg-surface-2 group flex items-baseline gap-2.5 border-b px-3 py-2 last:border-0"
              >
                <Link to={`/f/${fiche.id}`} className="flex min-w-0 flex-1 items-baseline gap-2.5">
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
                <span
                  className={cn(
                    'donnee shrink-0 rounded px-1.5 py-0.5 text-[10.5px]',
                    manuelle ? 'bg-surface-2 text-ink-3' : 'bg-accent-soft text-accent',
                  )}
                  title={
                    manuelle
                      ? 'Liée à ce médicament, tous dosages confondus'
                      : `Remontée par la classe ${fiche.atc.join(', ')}`
                  }
                >
                  {manuelle ? (dosageCount > 1 ? 'tous les dosages' : 'ce produit') : fiche.atc[0]}
                </span>
                {canEdit && manuelle && (
                  <button
                    type="button"
                    onClick={async () => {
                      await unlinkFiche(nr, fiche.id);
                      await onChange();
                    }}
                    title="Délier"
                    className="text-ink-3 hover:bg-critical-soft hover:text-critical-text
                               shrink-0 cursor-pointer rounded p-1"
                  >
                    <Unlink className="size-3.5" />
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      ) : (
        canEdit && !choix && (
          <p className="text-ink-3 text-[13px]">Aucune fiche pour ce produit ou sa classe.</p>
        )
      )}
    </section>
  );
}
