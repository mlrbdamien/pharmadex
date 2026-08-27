# Pharmadex — notes pour les sessions Claude Code

Outil web interne d'une officine suisse : centralise les liens et documents du
comptoir derrière une recherche instantanée.

**Critère de réussite unique : être plus rapide que Google.** Toute proposition
qui ajoute un clic, un écran ou une latence sur le chemin « taper → trouver →
ouvrir » va dans le mauvais sens.

## Stack

- Vite 7 + React 19 + TypeScript 5.8 (strict, `noUnusedLocals`) — pas de SSR.
- Tailwind v4 via `@tailwindcss/vite` : **pas de `tailwind.config.js`**, tout se
  configure en CSS dans `src/index.css` (`@theme`).
- Supabase (Postgres, Auth, Storage, Edge Functions), région Francfort.
- React Router, `@supabase/supabase-js`, `lucide-react`. Rien d'autre — pas de
  Redux, pas de bibliothèque de composants.
- Déploiement : Cloudflare Pages (build statique).

## Conventions

- Interface **en français**, desktop-first, dense, mode clair. Pas d'onboarding.
- `src/lib` (données et logique) · `src/pages` (une route = un fichier) ·
  `src/components` (présentation).
- Les commentaires expliquent *pourquoi*, jamais *quoi*.
- Qualité : `npm run build` (inclut `tsc --noEmit`) et `npm run lint`. Pas de
  tests E2E, pas de CI élaborée — c'est un choix, pas un oubli.

## Points structurants

- **Toute la sécurité repose sur la RLS**, pas sur le front. Les helpers
  `is_allowed()` et `can_edit()` sont en `SECURITY DEFINER` pour éviter une
  récursion infinie dans la policy de `allowed_emails`.
- **Authentification par mot de passe, sans aucun e-mail.** Choix délibéré : au
  comptoir, aller chercher un lien dans une boîte mail au milieu d'un conseil
  est rédhibitoire, et le SMTP intégré de Supabase est limité à quelques envois
  par heure. Ne pas réintroduire de lien magique ni de réinitialisation par
  e-mail sans demande explicite — cela ramènerait la dépendance SMTP.
- **`allowed_emails` n'est pas modifiable depuis l'application.** Ajouter un
  accès = créer le compte au dashboard (avec « Auto Confirm User ») + insérer
  une ligne en SQL (voir README).
- **Recherche** : configuration Postgres `fr_unaccent` (français + `unaccent`).
  La fonction `search_resources(q)` ajoute `:*` à chaque lexème pour trouver dès
  la frappe, avec un `ilike` en filet. Le front garde toutes les ressources en
  mémoire et affiche un filtre local pendant l'aller-retour réseau.
- **Douchettes code-barres** : elles écrivent dans la barre de recherche comme un
  clavier. Toute frappe imprimable y est redirigée, et Entrée ouvre le premier
  résultat. Ne pas casser ce comportement.
- **Le compte comptoir est en lecture seule et reste connecté en permanence.**

## Hors périmètre — ne pas construire sans demande explicite

- Base de médicaments, import AIPS/Refdata. Prévu en v2 (`products` +
  `product_resources`), mentionné en commentaire dans `0001_init.sql`.
- Multi-officine, rôles au-delà de `can_edit`, panneau d'administration.
- **Aucune donnée patient, nulle part** : ne jamais ajouter de champ « notes de
  cas » ou tout autre espace de saisie libre qui inviterait à en consigner.
