import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Pill, Search } from 'lucide-react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { supabase } from '../lib/supabase';
import { fold } from '../lib/resources';
import { cn } from '../components/ui';
import type { ProductRow } from '../lib/types';

const PAGE = 50;

/** Les 14 groupes anatomiques principaux de la classification ATC. */
const GROUPES_ATC: { code: string; libelle: string }[] = [
  { code: 'A', libelle: 'Digestif' },
  { code: 'B', libelle: 'Sang' },
  { code: 'C', libelle: 'Cardiovasculaire' },
  { code: 'D', libelle: 'Dermatologie' },
  { code: 'G', libelle: 'Génito-urinaire' },
  { code: 'H', libelle: 'Hormones' },
  { code: 'J', libelle: 'Anti-infectieux' },
  { code: 'L', libelle: 'Antinéoplasiques' },
  { code: 'M', libelle: 'Musculo-squelettique' },
  { code: 'N', libelle: 'Système nerveux' },
  { code: 'P', libelle: 'Antiparasitaires' },
  { code: 'R', libelle: 'Respiratoire' },
  { code: 'S', libelle: 'Organes sensoriels' },
  { code: 'V', libelle: 'Divers' },
];

/**
 * Le catalogue des 6 300 médicaments autorisés, navigable : filtre texte,
 * groupes ATC, pagination. Chaque ligne mène à la fiche.
 */
export function Medicaments() {
  const [filtre, setFiltre] = useState('');
  const [groupe, setGroupe] = useState<string | null>(null);
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
        .order('name')
        .limit(pages * PAGE);
      if (groupe) query = query.like('atc_code', `${groupe}%`);
      const needle = filtre.trim();
      if (needle) {
        // Filtre serveur large ; l'affinage insensible aux accents se fait
        // en local sur la page reçue (fold), le serveur n'ayant pas unaccent
        // exposé via PostgREST.
        query = query.or(`name.ilike.%${needle}%,substances.ilike.%${needle}%`);
      }
      const { data, count } = await query;
      if (id !== requestId.current) return;
      setRows(data ?? []);
      setTotal(count);
      setChargement(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [filtre, groupe, pages]);

  // Repartir en page 1 quand le filtre change.
  useEffect(() => {
    setPages(1);
  }, [filtre, groupe]);

  const visibles = useMemo(() => {
    const needle = fold(filtre.trim());
    if (!needle) return rows;
    return rows.filter((p) => fold(`${p.name} ${p.substances ?? ''}`).includes(needle));
  }, [rows, filtre]);

  return (
    <>
      <EnteteEcran
        titre="Médicaments"
        contexte={total !== null ? `${total} autorisés en Suisse` : undefined}
        onMenu={useMenu()}
      />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl">
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

          <div className="mt-3 flex flex-wrap gap-1.5">
            {GROUPES_ATC.map((g) => {
              const actif = groupe === g.code;
              return (
                <button
                  key={g.code}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => setGroupe(actif ? null : g.code)}
                  title={g.libelle}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[13px] transition-colors',
                    actif
                      ? 'border-accent bg-accent text-on-accent'
                      : 'border-line bg-surface-1 text-ink-2 hover:border-accent-ring hover:text-ink',
                  )}
                >
                  <span className="donnee font-semibold">{g.code}</span>
                  <span className="ml-1.5 hidden sm:inline">{g.libelle}</span>
                </button>
              );
            })}
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
                    <span className="text-ink min-w-0 flex-1 truncate text-[15px]">{product.name}</span>
                    <span className="text-ink-3 hidden max-w-40 shrink-0 truncate text-[13px] lg:inline">
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
