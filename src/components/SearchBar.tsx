import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Entrée : ouvre le premier résultat. */
  onEnter: () => void;
  count: number | null;
};

export function SearchBar({ value, onChange, onEnter, count }: Props) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  // Les douchettes code-barres se comportent comme un clavier très rapide, mais
  // ne donnent pas le focus au champ. On redirige donc toute frappe imprimable
  // vers la barre de recherche, où qu'on se trouve sur la page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typingElsewhere =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable === true;
      if (typingElsewhere || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;

      event.preventDefault();
      input.current?.focus();
      onChange(value + event.key);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [value, onChange]);

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
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
        className="w-full rounded-lg border border-slate-300 bg-white py-3 pr-24 pl-11 text-lg
                   shadow-sm placeholder:text-slate-400 focus:border-teal-600 focus:ring-0"
      />
      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
        {count !== null && (
          <span className="text-sm tabular-nums text-slate-400">
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
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
