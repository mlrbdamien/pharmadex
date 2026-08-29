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

- Interface **en français**, desktop-first, dense. Pas d'onboarding.
- **Direction visuelle « Console »** (transposée de ~/dev/vetements-p24, v4) :
  tokens CSS dans `src/index.css` (`--surface/-ink/-line/-accent`… + mode
  sombre via `prefers-color-scheme`), classes `.etiquette` et `.donnee`,
  rayons `rounded-card`/`rounded-control`. **Jamais de couleurs Tailwind
  brutes (slate-500, teal-700…)** : toujours les tokens.
- **Coquille** (`src/components/Coquille.tsx`) : rail latéral à groupes
  COMPTOIR / ÉDITION avec compteurs, bloc « État » en pied, `EnteteEcran`
  par page. Toute nouvelle page s'inscrit dans ce gabarit.
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

## v2 (livrée) — scan de boîte → protocoles

- `products`/`packages` importés mensuellement depuis la liste publique
  Swissmedic (`scripts/import_products.py` + workflow `import-products.yml`).
  GTIN calculé : 7680 + n° d'autorisation + code emballage + clé EAN-13.
- Liaison à deux niveaux : `product_resources` (produit précis) et
  `atc_resources` (préfixe de classe ATC — le vrai levier). La RPC
  `scan_gtin` renvoie l'union des deux.
- Les médicaments sont NAVIGABLES (page /medicaments : filtre, groupes ATC,
  pagination) et les ressources aussi (/ressources) — pas seulement
  atteignables par la recherche.
- Les produits sont aussi cherchables PAR NOM et par principe actif
  (`search_products`, migration 0004) : cliquer un résultat produit ouvre la
  même fiche qu'un scan (`product_hit`, partagé avec `scan_gtin`).
- Un scan ou une recherche qui identifie un produit n'est JAMAIS consigné en
  recherche vide.
- `products`/`packages` : aucune policy d'écriture, remplies par l'import
  (service_role) uniquement.

## v3 (livrée) — fiches complètes

- Fiche produit `/p/:nr` : notice AIPS intégrée en iframe (le catalogue SIMIS
  ne fournit que des URLs vers files.refdata.ch — AUCUN contenu n'est copié),
  emballages, produits de même classe, liaisons avec déliage.
- Fiche ressource `/r/:id` (vue, tous) ; l'édition vit sur `/r/:id/modifier`.
- **Cliquer ouvre la fiche** (ressource comme produit) — décision produit de
  Damien du 27.08.2026, qui a explicitement écarté l'optimisation « clic =
  cible directe ». Le bouton « Ouvrir » de la fiche mène au lien/fichier.
  Entrée dans la recherche suit la même logique (fiche du premier résultat).
  Ne pas revenir en arrière sans demande explicite.
- `NOTICE_SHORTCUTS` (src/lib/notices.ts) : rubriques en un clic, savoir de
  pharmacien — ancres #sectionN standardisées des notices.

- **Douchette globale** : la capture de frappe vit dans la coquille
  (CoquilleLayout) et vaut pour TOUS les écrans — un scan ramène à la
  recherche, la saisie préservée par le tampon `src/lib/searchSeed.ts`.
  Ne pas remettre d'écouteur clavier global dans un composant de page.
- **Fraîcheur** : une ressource sans vérification depuis 12 mois
  (`isStale`, `STALE_MONTHS`) porte un badge ambre « à revérifier » et
  remonte dans le bloc État. C'est le pendant « contenu » du badge
  « lien cassé ».
- **Références externes** (`src/lib/refs.ts`) : groupe « Références » du
  rail — Guidelines SSI, Le CRAT, iMail Offizin, SwissPedDose, en simples
  liens à un seul endroit. Les boutons contextuels par substance sur la
  fiche ont été ESSAYÉS PUIS RETIRÉS (décision Damien) : la francisation
  des noms latins était trop approximative. Ne pas les réintroduire.

- **Données françaises officielles**, par ordre de priorité à l'import :
  1. `scripts/import_refdata.py` — Refdatabase-articles (clé `REFDATA_API_KEY`,
     en-tête `X-API-Key`, portail developer.refdata.ch) : dénominations
     officielles FR pour ~79 % des emballages, + prix publics.
  2. `scripts/import_sl.py` — Liste des spécialités OFSP : comble les
     remboursés que Refdata n'a pas, + prix.
  3. `scripts/formes_fr.py` — table de traduction, repli final.
  `products.fr_source` dit qui a rempli `name_fr` ; on n'écrase jamais une
  donnée de rang supérieur. **Le Pharmacode n'existe PAS dans ces sources** :
  Refdata a migré vers le GTIN comme identifiant, la v2.0 ne l'expose plus.
  La colonne `packages.pharmacode` et sa résolution dans `scan_gtin` sont en
  place si une source apparaît.
- **L'import est un miroir de la source, prouvé idempotent** (double
  exécution → checksums identiques). Les emballages et notices disparus de
  la source sont PURGÉS (garde-fou de volume : une source tronquée fait
  échouer l'import plutôt que vider la base) ; les produits disparus sont
  MARQUÉS `delisted`, jamais supprimés — des boîtes circulent encore et la
  suppression emporterait les liaisons (ON DELETE CASCADE). Badge « retiré
  du marché » au catalogue et sur la fiche.
- **Traduction allemand → français à l'import** (`scripts/formes_fr.py`) :
  Swissmedic ne publie ses données qu'en allemand ; l'import traduit les
  suffixes de forme et les unités d'emballage via une table déterministe
  (terminologie officielle). Les marques, substances (latin) et produits
  enregistrés en italien ne sont JAMAIS touchés. Le résumé du workflow
  compte les formes restées en allemand — compléter la table, pas inventer
  un service de traduction.

## Hors périmètre — ne pas construire sans demande explicite

- Recherche plein texte DANS les notices (elles restent chez Refdata).
- Refdata / pharmacode, sauf si les douchettes de l'officine l'exigent.
- Multi-officine, rôles au-delà de `can_edit`, panneau d'administration.
- **Aucune donnée patient, nulle part** : ne jamais ajouter de champ « notes de
  cas » ou tout autre espace de saisie libre qui inviterait à en consigner.
