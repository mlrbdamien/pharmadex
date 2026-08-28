import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { consumeSeed, onSeed } from '../lib/searchSeed';

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Entrée : ouvre le premier résultat. */
  onEnter: () => void;
  count: number | null;
};

export function SearchBar({ value, onChange, onEnter, count }: Props) {
  const input = useRef<HTMLInputElement>(null);

  // La capture de frappe globale vit dans la coquille (elle vaut pour tous
  // les écrans) ; la barre consomme ici le tampon — y compris les caractères
  // d'un scan arrivés pendant le changement de route — puis s'abonne au flux.
  const latest = useRef({ value, onChange });
  latest.current = { value, onChange };

  useEffect(() => {
    input.current?.focus();
    const seed = consumeSeed();
    if (seed) latest.current.onChange(latest.current.value + seed);
    return onSeed((char) => {
      input.current?.focus();
      latest.current.onChange(latest.current.value + char);
    });
  }, []);

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ink-3"
        aria-hidden
      />
      <input
        ref={input}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onEnter();
          } else if (event.key === 'Escape') {
            onChange('');
          }
        }}
        placeholder="Rechercher un protocole, un lien, un document…"
        aria-label="Rechercher"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-lg border border-line-strong bg-surface-1 py-3 pr-24 pl-11 text-lg
                   shadow-sm placeholder:text-ink-3 focus:border-accent focus:ring-0"
      />
      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
        {count !== null && (
          <span className="text-sm tabular-nums text-ink-3">
            {count} {count > 1 ? 'résultats' : 'résultat'}
          </span>
        )}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              input.current?.focus();
            }}
            aria-label="Effacer la recherche"
            className="rounded p-1 text-ink-3 hover:bg-surface-2 hover:text-ink-2"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
