import { useEffect, useMemo, useState } from 'react';
import { EnteteEcran, useMenu } from '../components/Coquille';
import { Link } from 'react-router-dom';
import { Loader2, Plus, ScanBarcode, Trash2 } from 'lucide-react';
import { deleteMiss, listMisses } from '../lib/misses';
import { resolveCodes } from '../lib/products';
import type { SearchMiss } from '../lib/types';
import { formatDate } from '../lib/format';

export function Misses() {
  const [rows, setRows] = useState<SearchMiss[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideCodes, setHideCodes] = useState(true);
  /** code scanné → nom du produit, quand Swissmedic le connaît. */
  const [names, setNames] = useState<Map<string, { name: string; nr: string }>>(new Map());

  async function load() {
    try {
      const misses = await listMisses();
      setRows(misses);
      setError(null);
      // Depuis la v2, un code résolu n'atterrit plus ici ; ces lignes datent
      // d'avant l'import, ou concernent des codes hors Swissmedic. Résoudre
      // les noms transforme le journal en liste de liaisons à créer.
      const codes = misses.filter((m) => m.is_code).map((m) => m.term);
      setNames(await resolveCodes(codes));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Chargement impossible');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const codeCount = useMemo(() => rows.filter((row) => row.is_code).length, [rows]);
  const visible = hideCodes ? rows.filter((row) => !row.is_code) : rows;

  return (
    <>
      <EnteteEcran titre="Recherches vides" onMenu={useMenu()} />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold text-ink">Recherches sans résultat</h1>
        <p className="mt-1 text-sm text-ink-3">
          Ce que l'équipe a cherché sans rien trouver. Chaque ligne est une ressource qui
          manque.
        </p>

        {codeCount > 0 && (
          <label className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={hideCodes}
              onChange={(event) => setHideCodes(event.target.checked)}
              className="size-4 rounded border-line-strong text-accent focus:ring-accent"
            />
            <ScanBarcode className="size-4 text-ink-3" />
            Masquer les {codeCount} code{codeCount > 1 ? 's' : ''}-barres scannés
          </label>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-critical-soft bg-critical-soft px-4 py-3 text-sm text-critical-text">
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-ink-3">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : visible.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-3">
            Aucune recherche restée sans réponse. Bon signe.
          </p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-3 uppercase">
                <th className="py-2 font-medium">Terme</th>
                <th className="py-2 text-right font-medium">Fois</th>
                <th className="py-2 text-right font-medium">Dernière</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.term} className="group border-b border-line">
                  <td className="py-2 font-medium text-ink">
                    {row.term}
                    {row.is_code && (
                      <ScanBarcode className="ml-1.5 inline size-3.5 text-ink-3" aria-label="code-barres" />
                    )}
                    {names.has(row.term) && (
                      <Link
                        to={`/p/${names.get(row.term)!.nr}`}
                        className="ml-2 font-normal text-accent hover:underline"
                      >
                        {names.get(row.term)!.name}
                      </Link>
                    )}
                  </td>
                  <td className="py-2 text-right tabular-nums text-ink-2">{row.hits}</td>
                  <td className="py-2 text-right text-ink-3">{formatDate(row.last_seen)}</td>
                  <td className="w-20 py-2 text-right">
                    <span className="flex justify-end gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                      <Link
                        to={`/nouveau?titre=${encodeURIComponent(row.term)}`}
                        title="Créer la ressource manquante"
                        className="rounded p-1 text-ink-3 hover:bg-surface-2 hover:text-accent"
                      >
                        <Plus className="size-4" />
                      </Link>
                      <button
                        type="button"
                        title="Retirer du journal"
                        onClick={async () => {
                          await deleteMiss(row.term);
                          setRows((previous) => previous.filter((r) => r.term !== row.term));
                        }}
                        className="rounded p-1 text-ink-3 hover:bg-surface-2 hover:text-critical-text"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
      </main>
    </>
  );
}
