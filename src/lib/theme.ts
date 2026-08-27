/**
 * Bascule de thème à trois états : système (défaut), clair, sombre.
 *
 * Le choix est posé en data-theme sur <html> — le CSS fait le reste — et
 * mémorisé par poste dans localStorage : chaque PC du comptoir garde son
 * réglage, indépendamment du compte connecté.
 */

export type Theme = 'system' | 'light' | 'dark';

const KEY = 'pharmadex-theme';

export function getTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour la session.
  }
}

export function nextTheme(current: Theme): Theme {
  return current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
}

/** À appeler au démarrage, avant le rendu, pour éviter un éclair de thème. */
export function initTheme(): void {
  applyTheme(getTheme());
}
