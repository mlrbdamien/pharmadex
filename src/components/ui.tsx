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
