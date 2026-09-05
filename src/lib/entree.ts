/**
 * Ce que voit un visiteur NON connecté, selon l'adresse qu'il demande.
 *
 * Deux écrans possibles : la vitrine (présentation publique de l'outil, avec
 * un bouton « Se connecter ») ou le formulaire de connexion, directement.
 *
 * L'adresse demandée n'est jamais réécrite pendant la connexion : le `Gate`
 * se contente de changer ce qu'il rend. Une fois connecté, l'application
 * rend donc la route demandée — un lien /p/12345 partagé entre collègues
 * aboutit sur la fiche. Seule `/connexion` n'existe pas côté application et
 * retombe sur l'accueil.
 */
export type EcranDeconnecte = 'vitrine' | 'connexion';

export function ecranDeconnecte(pathname: string): EcranDeconnecte {
  // Décision de Damien (05.09.2026) : la vitrine ne s'affiche que sur la
  // racine. Tout autre chemin est un lien qu'on a reçu ou tapé — on veut
  // l'ouvrir, pas découvrir l'outil : formulaire directement, adresse
  // conservée, et la fiche s'ouvre sitôt connecté.
  return pathname === '/' ? 'vitrine' : 'connexion';
}
