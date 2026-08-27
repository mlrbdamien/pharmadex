import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { normalizeTag } from '../lib/tags';

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Tags existants, pour l'autocomplétion. */
  suggestions: string[];
};

export function TagInput({ value, onChange, suggestions }: Props) {
  const [draft, setDraft] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const needle = normalizeTag(draft);
    return suggestions
      .filter((tag) => !value.includes(tag))
      .filter((tag) => (needle ? tag.includes(needle) : true))
      .slice(0, 8);
  }, [draft, suggestions, value]);

  function add(raw: string) {
    const tag = normalizeTag(raw);
    // Bornes identiques au check SQL de la table `tags`.
    if (tag.length < 2 || tag.length > 40 || value.includes(tag)) {
      setDraft('');
      return;
    }
    onChange([...value, tag]);
    setDraft('');
  }

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 bg-white
                   px-2 py-1.5 focus-within:border-teal-600"
        onClick={() => input.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-teal-50 px-1.5 py-0.5 text-sm text-teal-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Retirer ${tag}`}
              className="text-teal-500 hover:text-teal-800"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              add(draft);
            } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => draft && add(draft)}
          placeholder={value.length === 0 ? 'grossesse, pédiatrie…' : ''}
          className="min-w-32 flex-1 border-0 p-0.5 text-sm focus:ring-0 focus:outline-none"
        />
      </div>

      {matches.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {matches.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => add(tag)}
              className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-500
                         hover:border-teal-300 hover:text-teal-700"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
