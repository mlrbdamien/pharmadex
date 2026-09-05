import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/** Concatène des classes en ignorant les valeurs vides. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-card bg-surface-1 border border-line shadow-card',
        padded && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  icon: Icon,
  title,
  action,
}: {
  icon?: LucideIcon;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="etiquette flex items-center gap-1.5">
        {Icon && <Icon size={12} strokeWidth={2} aria-hidden />}
        {title}
      </p>
      {action}
    </div>
  );
}

/**
 * La marque : le « + » du favicon, dans un carré d'accent. Un seul dessin
 * pour l'onglet, la connexion et la vitrine — la taille se passe en classes
 * (`size-7 rounded-[7px]` par défaut).
 */
export function Marque({ className = 'size-7 rounded-[7px]' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('bg-accent text-on-accent inline-flex shrink-0 items-center justify-center', className)}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-[58%] w-[58%]"
        fill="none"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      >
        <path d="M16 8v16M8 16h16" />
      </svg>
    </span>
  );
}
