import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus, ScanBarcode, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
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
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-lg font-semibold text-slate-900">Recherches sans résultat</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ce que l'équipe a cherché sans rien trouver. Chaque ligne est une ressource qui
          manque.
        </p>

        {codeCount > 0 && (
          <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={hideCodes}
              onChange={(event) => setHideCodes(event.target.checked)}
              className="size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            <ScanBarcode className="size-4 text-slate-400" />
            Masquer les {codeCount} code{codeCount > 1 ? 's' : ''}-barres scannés
          </label>
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
        ) : visible.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-400">
            Aucune recherche restée sans réponse. Bon signe.
          </p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-400 uppercase">
                <th className="py-2 font-medium">Terme</th>
                <th className="py-2 text-right font-medium">Fois</th>
                <th className="py-2 text-right font-medium">Dernière</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.term} className="group border-b border-slate-100">
                  <td className="py-2 font-medium text-slate-800">
                    {row.term}
                    {row.is_code && (
                      <ScanBarcode className="ml-1.5 inline size-3.5 text-slate-300" aria-label="code-barres" />
                    )}
                    {names.has(row.term) && (
                      <Link
                        to={`/p/${names.get(row.term)!.nr}`}
                        className="ml-2 font-normal text-teal-700 hover:underline"
                      >
                        {names.get(row.term)!.name}
                      </Link>
                    )}
                  </td>
                  <td className="py-2 text-right tabular-nums text-slate-600">{row.hits}</td>
                  <td className="py-2 text-right text-slate-400">{formatDate(row.last_seen)}</td>
                  <td className="w-20 py-2 text-right">
                    <span className="flex justify-end gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                      <Link
                        to={`/nouveau?titre=${encodeURIComponent(row.term)}`}
                        title="Créer la ressource manquante"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal-700"
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
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
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
      </main>
    </div>
  );
}
