import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Pill, Search, StickyNote } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { supabase } from '../lib/supabase';
import { libelleFr } from '../lib/products';
import { useStore } from '../lib/store';
import { estAnnote } from '../lib/notes';
import { enfantsDe, LIBELLES_ATC, tousLesCodesAtc } from '../lib/atc';
import { fold } from '../lib/resources';
import { cn } from '../components/ui';
import type { ProductRow } from '../lib/types';

const PAGE = 50;

const CATEGORIES_REMISE: Record<string, string> = {
  A: 'A — ordonnance non renouvelable',
  B: 'B — sur ordonnance',
  D: 'D — conseil spécialisé',
  E: 'E — vente libre',
};


/**
 * Le catalogue des 6 300 médicaments autorisés, navigable : filtre texte,
 * groupes ATC, pagination. Chaque ligne mène à la fiche.
 */
export function Medicaments() {
  const { notesIndex } = useStore();
  const [filtre, setFiltre] = useState('');
  const [atcPrefix, setAtcPrefix] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [enfants, setEnfants] = useState<{ code: string; n: number }[]>([]);
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [pages, setPages] = useState(1);
  const [chargement, setChargement] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    setChargement(true);
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('name_fr', { nullsFirst: false })
        .limit(pages * PAGE);
      if (atcPrefix) query = query.like('atc_code', `${atcPrefix}%`);
      if (cat) query = query.eq('category', cat);
      // Un groupe or() PAR MOT : les groupes se cumulent en ET, donc chaque
      // mot tapé doit apparaître quelque part — « ib sandoz » trouve
      // Ibuprofen Sandoz. L'affinage insensible aux accents reste local.
      for (const mot of filtre.trim().split(/\s+/).filter(Boolean)) {
        const m = mot.replace(/[%,().]/g, '');
        if (m) {
          query = query.or(`name_fr.ilike.%${m}%,name.ilike.%${m}%,substances.ilike.%${m}%`);
        }
      }
      const { data, count } = await query;
      if (id !== requestId.current) return;
      setRows(data ?? []);
      setTotal(count);
      setChargement(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [filtre, atcPrefix, cat, pages]);

  // Repartir en page 1 quand le filtre change.
  useEffect(() => {
    setPages(1);
  }, [filtre, atcPrefix, cat]);

  // Les enfants du niveau ATC courant, avec compteurs, depuis le cache
  // complet des codes (chargé par pages de 1 000 : Supabase tronque toute
  // réponse au-delà — un limit(10000) avait silencieusement amputé l'arbre).
  useEffect(() => {
    let cancelled = false;
    void tousLesCodesAtc().then((codes) => {
      if (!cancelled) setEnfants(enfantsDe(codes, atcPrefix));
    });
    return () => {
      cancelled = true;
    };
  }, [atcPrefix]);

  const visibles = useMemo(() => {
    const needle = fold(filtre.trim());
    if (!needle) return rows;
    const mots = needle.split(/\s+/).filter(Boolean);
    return rows.filter((p) => {
      const meule = fold(`${p.name_fr ?? ''} ${p.name} ${p.substances ?? ''}`);
      return mots.every((mot) => meule.includes(mot));
    });
  }, [rows, filtre]);

  return (
    <>
      <EnteteEcran
        titre="Médicaments"
        contexte={total !== null ? `${total} autorisés en Suisse` : undefined}
        onMenu={useMenu()}
      />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative">
            <Search
              className="text-ink-3 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={filtre}
              onChange={(event) => setFiltre(event.target.value)}
              placeholder="Filtrer par nom ou principe actif…"
              autoComplete="off"
              spellCheck={false}
              className="border-line bg-surface-1 focus:border-accent w-full rounded-control border py-2.5
                         pr-3 pl-10 text-[15px] shadow-card placeholder:text-ink-3"
            />
          </div>

          {/* Arborescence ATC : cliquer un niveau descend, le fil d'Ariane remonte. */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {atcPrefix && (
              <>
                <button
                  type="button"
                  onClick={() => setAtcPrefix('')}
                  className="border-line bg-surface-1 text-ink-2 hover:text-ink cursor-pointer
                             rounded-full border px-2.5 py-1 text-[13px]"
                >
                  Tous
                </button>
                {[1, 3, 4, 5].map((longueur) =>
                  atcPrefix.length > longueur ? (
                    <button
                      key={longueur}
                      type="button"
                      onClick={() => setAtcPrefix(atcPrefix.slice(0, longueur))}
                      className="border-line bg-surface-1 donnee text-ink-2 hover:text-ink
                                 cursor-pointer rounded-full border px-2.5 py-1 text-[13px]"
                    >
                      {atcPrefix.slice(0, longueur)}
                    </button>
                  ) : null,
                )}
                <span className="bg-accent text-on-accent rounded-full px-2.5 py-1 text-[13px] font-semibold">
                  <span className="donnee">{atcPrefix}</span>
                  {LIBELLES_ATC[atcPrefix] && ` ${LIBELLES_ATC[atcPrefix]}`}
                </span>
                <span className="text-ink-3 mx-0.5">›</span>
              </>
            )}
            {enfants.map((enfant) => (
              <button
                key={enfant.code}
                type="button"
                onClick={() => setAtcPrefix(enfant.code)}
                title={LIBELLES_ATC[enfant.code]}
                className="border-line bg-surface-1 text-ink-2 hover:border-accent-ring hover:text-ink
                           cursor-pointer rounded-full border px-2.5 py-1 text-[13px] transition-colors"
              >
                <span className="donnee font-semibold">{enfant.code}</span>
                {LIBELLES_ATC[enfant.code] && (
                  <span className="ml-1.5 hidden sm:inline">{LIBELLES_ATC[enfant.code]}</span>
                )}
                <span className="donnee text-ink-3 ml-1.5">{enfant.n}</span>
              </button>
            ))}
          </div>

          {/* Catégorie de remise */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-ink-3 text-[12px]">Remise :</span>
            {(['A', 'B', 'D', 'E'] as const).map((lettre) => (
              <button
                key={lettre}
                type="button"
                aria-pressed={cat === lettre}
                onClick={() => setCat(cat === lettre ? null : lettre)}
                title={CATEGORIES_REMISE[lettre]}
                className={cn(
                  'donnee cursor-pointer rounded-full border px-2.5 py-0.5 text-[13px] font-semibold transition-colors',
                  cat === lettre
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-line bg-surface-1 text-ink-2 hover:border-accent-ring',
                )}
              >
                {lettre}
              </button>
            ))}
          </div>

          {chargement ? (
            <p className="text-ink-3 mt-10 flex items-center justify-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" /> Chargement…
            </p>
          ) : visibles.length === 0 ? (
            <p className="text-ink-3 mt-10 text-center text-sm">Aucun médicament ne correspond.</p>
          ) : (
            <>
              <div className="border-line bg-surface-1 shadow-card mt-4 rounded-card border">
                {visibles.map((product) => (
                  <Link
                    key={product.authorization_nr}
                    to={`/p/${product.authorization_nr}`}
                    className="border-line hover:bg-surface-2 flex items-center gap-3 border-b px-4 py-2.5
                               last:border-0"
                  >
                    <Pill size={15} className="text-accent shrink-0" aria-hidden />
                    <span className="text-ink min-w-0 flex-1 truncate text-[15px]">
                      {libelleFr(product)}
                    </span>
                    {estAnnote(notesIndex, product.authorization_nr, product.atc_code, product.substances) && (
                      <StickyNote className="text-warning size-3.5 shrink-0" aria-label="Note maison" />
                    )}
                    {product.delisted && (
                      <span className="bg-warning-soft text-warning-text shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium">
                        retiré
                      </span>
                    )}
                    <span className="text-ink-3 hidden w-64 shrink-0 truncate text-[13px] lg:inline">
                      {product.substances}
                    </span>
                    <span className="text-ink-3 hidden w-40 shrink-0 truncate text-right text-[13px] xl:inline">
                      {product.company}
                    </span>
                    {product.atc_code && (
                      <span className="donnee text-ink-3 shrink-0 text-[12.5px]">{product.atc_code}</span>
                    )}
                  </Link>
                ))}
              </div>
              {total !== null && rows.length < total && (
                <button
                  type="button"
                  onClick={() => setPages((n) => n + 1)}
                  className="border-line text-ink-2 hover:border-accent-ring hover:text-ink mx-auto mt-4
                             block rounded-control border px-4 py-2 text-sm transition-colors"
                >
                  Afficher plus ({rows.length} / {total})
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
