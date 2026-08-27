import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, SearchX } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { TagFilter } from '../components/TagFilter';
import { ResourceCard } from '../components/ResourceCard';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import {
  localFilter,
  logSearchMiss,
  openResource,
  searchResources,
  shouldLogMiss,
} from '../lib/resources';
import { normalizeScannedCode, productHit, scanGtin, searchProducts } from '../lib/products';
import { ProductCard } from '../components/ProductCard';
import { Pill } from 'lucide-react';
import type { ProductRow, Resource, ScanHit } from '../lib/types';

export function Home() {
  const { canEdit } = useAuth();
  const { resources, tags, loading, error, refresh } = useStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  /** Résultats faisant autorité (Postgres). `null` = réponse pas encore arrivée. */
  const [remote, setRemote] = useState<Resource[] | null>(null);
  /** Fiche produit quand la saisie est un code scanné reconnu. */
  const [scan, setScan] = useState<ScanHit | null>(null);
  /** Produits dont le nom correspond à la saisie texte. */
  const [productMatches, setProductMatches] = useState<ProductRow[]>([]);

  const lastLogged = useRef<string | null>(null);
  const requestId = useRef(0);
  const trimmed = query.trim();

  // Recherche serveur, débounce 150 ms. Tant qu'elle est en vol, l'affichage
  // retombe sur le filtre local : l'écran n'est jamais vide entre deux frappes.
  //
  // Un code scanné (GTIN) prend une autre voie : identification du produit et
  // de ses ressources liées, au lieu de la recherche plein texte.
  useEffect(() => {
    if (!trimmed) {
      setRemote(null);
      setScan(null);
      setProductMatches([]);
      return;
    }
    setRemote(null);
    setScan(null);
    const id = ++requestId.current;
    const code = normalizeScannedCode(trimmed);
    const timer = setTimeout(async () => {
      try {
        if (code) {
          const hit = await scanGtin(code);
          if (id !== requestId.current) return;
          setScan(hit);
          setProductMatches([]);
          // Code inconnu de Swissmedic : la recherche texte n'a aucune chance,
          // on la laisse s'afficher vide pour que le journal le consigne.
          setRemote(hit ? (hit.resources as Resource[]) : []);
        } else {
          // Ressources ET produits, en parallèle : « Inderal » au clavier
          // vaut un scan de la boîte.
          const [rows, prods] = await Promise.all([
            searchResources(trimmed),
            searchProducts(trimmed),
          ]);
          if (id !== requestId.current) return;
          setRemote(rows);
          setProductMatches(prods);
        }
      } catch {
        // Le filtre local reste affiché — mieux que rien au comptoir.
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const selectProduct = useCallback((authorizationNr: string) => {
    void productHit(authorizationNr).then((hit) => {
      if (!hit) return;
      setScan(hit);
      setProductMatches([]);
      setRemote(hit.resources as Resource[]);
    });
  }, []);

  const rescan = useCallback(() => {
    const code = normalizeScannedCode(trimmed);
    if (code) {
      void scanGtin(code).then((hit) => {
        setScan(hit);
        setRemote(hit ? (hit.resources as Resource[]) : []);
      });
    } else if (scan) {
      // Fiche ouverte depuis la recherche par nom : recharger par n° d'autorisation.
      selectProduct(scan.product.authorization_nr);
    }
  }, [trimmed, scan, selectProduct]);

  const base = useMemo(
    () => remote ?? localFilter(resources, trimmed),
    [remote, resources, trimmed],
  );
  const results = useMemo(
    () => (activeTag ? base.filter((r) => r.tags.includes(activeTag)) : base),
    [base, activeTag],
  );

  // Journal des recherches vides. Un scan qui identifie un produit n'est
  // jamais consigné — la fiche produit EST une réponse. Deux conditions
  // avant de consigner :
  //
  // 1. la réponse serveur est arrivée et est vide (`remote`) — se fier au seul
  //    cache local produirait de faux négatifs ;
  // 2. deux secondes sans frappe. Ce délai fait l'essentiel du travail : une
  //    hésitation au milieu d'un mot dure quelques centaines de millisecondes,
  //    pas deux secondes. Ce qui reste est un terme abouti, pas « gross ».
  useEffect(() => {
    if (!trimmed || remote === null || remote.length > 0 || scan !== null) return;
    if (productMatches.length > 0) return; // un produit trouvé est une réponse
    const timer = setTimeout(() => {
      if (shouldLogMiss(trimmed, lastLogged.current)) {
        lastLogged.current = trimmed;
        void logSearchMiss(trimmed);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [trimmed, remote, scan, productMatches]);

  // Entrée ouvre le premier résultat : scan de code-barres → Entrée → la fiche
  // s'ouvre, sans toucher la souris.
  const openFirst = useCallback(() => {
    const first = results[0];
    if (first) {
      void openResource(first);
      return;
    }
    if (productMatches[0]) selectProduct(productMatches[0].authorization_nr);
  }, [results, productMatches, selectProduct]);

  const pinned = results.filter((r) => r.pinned);
  const rest = results.filter((r) => !r.pinned);

  function card(resource: Resource, first = false) {
    return (
      <ResourceCard
        key={resource.id}
        resource={resource}
        canEdit={canEdit}
        onTagClick={setActiveTag}
        onChanged={() => void refresh()}
        first={first}
      />
    );
  }

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onEnter={openFirst}
          count={trimmed ? results.length : null}
        />

        {tags.length > 0 && (
          <div className="mt-3">
            <TagFilter tags={tags} active={activeTag} onSelect={setActiveTag} />
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : trimmed ? (
          scan || results.length > 0 || productMatches.length > 0 ? (
            <div className="mt-4 space-y-2">
              {!scan && productMatches.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white">
                  {productMatches.map((product) => (
                    <button
                      key={product.authorization_nr}
                      type="button"
                      onClick={() => selectProduct(product.authorization_nr)}
                      className="flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2
                                 text-left text-sm last:border-0 hover:bg-teal-50"
                    >
                      <Pill className="size-4 shrink-0 text-teal-600" aria-hidden />
                      <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                        {product.name}
                      </span>
                      {product.atc_code && (
                        <span className="shrink-0 font-mono text-xs text-slate-400">
                          {product.atc_code}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {scan && (
                <ProductCard
                  product={scan.product}
                  canEdit={canEdit}
                  linked={scan.resources as Resource[]}
                  onSearchName={(name) => setQuery(name)}
                  onLinked={rescan}
                />
              )}
              {results.map((r, i) => card(r, i === 0))}
              {scan && results.length === 0 && (
                <p className="px-1 text-sm text-slate-500">
                  Aucune ressource liée à ce produit pour l'instant.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-10 text-center">
              <SearchX className="mx-auto size-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">
                Aucun résultat pour « {trimmed} »
              </p>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => navigate(`/nouveau?titre=${encodeURIComponent(trimmed)}`)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-teal-600
                             px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
                >
                  <Plus className="size-4" /> Ajouter cette ressource
                </button>
              )}
            </div>
          )
        ) : (
          <div className="mt-6 space-y-6">
            {pinned.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Épinglées
                </h2>
                <div className="space-y-2">{pinned.map((r) => card(r))}</div>
              </section>
            )}
            <section>
              <h2 className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {activeTag ? `Tag « ${activeTag} »` : 'Dernières ajoutées'}
              </h2>
              {rest.length > 0 ? (
                <div className="space-y-2">{rest.slice(0, 30).map((r) => card(r))}</div>
              ) : (
                <p className="text-sm text-slate-400">
                  Rien pour l'instant.
                  {canEdit && ' Utilisez « Ajouter » pour créer la première ressource.'}
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
