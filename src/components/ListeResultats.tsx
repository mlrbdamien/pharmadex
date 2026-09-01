import { BookMarked, BookOpen, Pill, StickyNote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from './ui';
import { LIBELLES_TYPE, type Resultat, type TypeResultat } from '../lib/recherche';

/**
 * La liste de résultats, commune à l'écran de recherche et à la palette.
 *
 * Un seul composant pour les deux surfaces : la sélection au clavier, les
 * icônes et le classement ne doivent pas diverger selon l'endroit d'où l'on
 * cherche — c'est la moitié du bénéfice d'avoir unifié la recherche.
 */

const ICONES: Record<TypeResultat, LucideIcon> = {
  produit: Pill,
  fiche: BookOpen,
  ressource: BookMarked,
  note: StickyNote,
};

export function ListeResultats({
  resultats,
  selection,
  onSurvol,
  onOuvrir,
  compact = false,
}: {
  resultats: Resultat[];
  /** Index sélectionné au clavier — la souris ne fait que le déplacer. */
  selection: number;
  onSurvol: (index: number) => void;
  onOuvrir: (resultat: Resultat) => void;
  compact?: boolean;
}) {
  return (
    <div role="listbox" aria-label="Résultats" className="flex flex-col">
      {resultats.map((r, i) => {
        const Icone = ICONES[r.type];
        const actif = i === selection;
        return (
          <button
            key={r.cle}
            type="button"
            role="option"
            aria-selected={actif}
            // `data-actif` permet à la palette de faire défiler jusqu'ici
            // sans conserver une ref par ligne.
            data-actif={actif || undefined}
            onMouseMove={() => onSurvol(i)}
            onClick={() => onOuvrir(r)}
            className={cn(
              'border-line flex w-full cursor-pointer items-center gap-2.5 border-b px-3 text-left last:border-0',
              compact ? 'py-2' : 'py-2.5',
              actif ? 'bg-accent-soft' : 'hover:bg-surface-2',
            )}
          >
            <Icone
              size={15}
              strokeWidth={1.75}
              aria-hidden
              className={cn('shrink-0', actif ? 'text-accent' : 'text-ink-3')}
            />
            <span className="min-w-0 flex-1">
              <span className="text-ink block truncate text-[14.5px] font-medium">{r.titre}</span>
              {r.sous && (
                <span className="text-ink-3 block truncate text-[12.5px]">{r.sous}</span>
              )}
            </span>
            {r.annote && (
              <StickyNote
                size={13}
                className="text-warning shrink-0"
                aria-label="Note maison"
              />
            )}
            {r.badge && (
              <span className="donnee text-ink-3 shrink-0 text-[11.5px]">{r.badge}</span>
            )}
            <span
              className={cn(
                'shrink-0 text-[11px] uppercase tracking-[0.06em]',
                actif ? 'text-accent' : 'text-ink-3',
              )}
            >
              {LIBELLES_TYPE[r.type]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
