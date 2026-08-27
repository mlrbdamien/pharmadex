type Props = {
  tags: string[];
  active: string | null;
  onSelect: (tag: string | null) => void;
};

/** Filtre par tag en un clic. Recliquer sur le tag actif le retire. */
export function TagFilter({ tags, active, onSelect }: Props) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const selected = tag === active;
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(selected ? null : tag)}
            className={`rounded-full border px-2.5 py-1 text-sm transition ${
              selected
                ? 'border-accent bg-accent text-on-accent'
                : 'border-line bg-surface-1 text-ink-2 hover:border-accent-ring hover:text-accent'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
