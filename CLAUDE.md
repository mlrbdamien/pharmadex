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
  COMPTOIR / ÉDITION avec compteurs et `EnteteEcran` par page. Le bloc
  « État » du pied a été retiré : la console `/admin` le fait mieux, et un
  chiffre affiché à deux endroits finit par diverger. Toute nouvelle page s'inscrit dans ce gabarit.
- **Recherche unique** (`src/lib/recherche.ts`, `useRecherche.ts`,
  `components/Palette.tsx`) : UNE barre, des résultats fusionnés et classés —
  médicaments, fiches, ressources, notes. Pharmadex avait quatre champs de
  recherche pour un seul geste mental, ce qui imposait de décider « où je
  cherche ? » AVANT de taper. Ne jamais réintroduire un champ qui cherche
  dans une source : les filtres des pages de parcours (Médicaments, Fiches,
  Ressources) sont autre chose — ils NARROW une liste qu'on parcourt, en
  composition avec une facette (arbre ATC, volet, tag).
  Le classement pondère le TYPE : fiche +10, note +8, ressource +5, produit 0.
  Un médicament est une identification, une fiche est une réponse ; et les
  produits sont 6 300 contre 36 fiches, donc sans pondération « toux »
  noierait la fiche sous les antitussifs. Une correspondance exacte de nom
  garde l'avantage (85 > 70+10) — vérifié.
  Un champ posé dans une enveloppe qui montre déjà le focus porte
  `.champ-nu` : sans quoi la règle `:focus-visible` globale lui dessine un
  second anneau, de rayon différent.
  Toute frappe hors d'un champ ouvre la palette EN SUPERPOSITION (plus de
  redirection vers l'accueil) : vérifier un dosage depuis une fiche ne doit
  pas faire perdre la fiche. ↑↓ parcourent, Entrée ouvre, Échap ferme.
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

- **Posologies maison** : type de note `posologie` (migration 0011) — même
  cycle de vie que les notes (portée, auteur, fraîcheur), mais rendu dans un
  bloc propre en tête de fiche avec bouton de copie, parce que c'est la
  question numéro un au comptoir et que le texte est fait pour être collé
  ailleurs. `copier()` dans src/lib/notes.ts gère le repli execCommand.
- **Calcul de dispensation** (`/dispensation`, src/lib/dispensation.ts) :
  couverture, date d'épuisement, avance/retard, observance. Entièrement pur
  et SANS AUCUNE PERSISTANCE — ni base, ni localStorage, ni URL (sauf le n°
  d'autorisation du produit, qui ne désigne personne). Une date de délivrance
  dit quelque chose d'un patient : elle ne survit pas au rechargement. C'est
  ainsi que l'invariant « aucune donnée patient » tient ici — par
  l'architecture, pas par une consigne affichée.
  La galénique est une unité de calcul (`unite`/`ml`/`g`/`dose`), pas un
  libellé : `lireConditionnement()` lit la taille d'emballage dans les deux
  formats (Refdata la met en fin de dénomination, la table Swissmedic en
  tête) et renvoie null plutôt qu'un chiffre approximatif — le champ reste
  alors vide, une quantité fausse produirait un verdict faux sans le dire.
  `mg` est volontairement exclu du vocabulaire d'unités : « cpr 400 mg »
  deviendrait sinon un emballage de 400 unités. Les gouttes par ml sont un
  paramètre à l'écran (20 ne vaut que pour les solutions aqueuses).
  AUCUN VERDICT, aucun seuil, aucune couleur sémantique sur le résultat —
  décision produit explicite : l'écran rend les quantités (consommé,
  théoriquement consommé, écart signé, taux, durée couverte) et Damien
  interprète. Un seuil codé appliquerait le même jugement à une cure de sept
  jours et à un chronique de trois mois. Ne pas réintroduire de palier.
  Le champ « reste en main » (optionnel, zéro par défaut) est ce qui sépare
  une consommation mesurée d'une consommation supposée.
- **Notes maison** (`product_notes`, migrations 0009+0010+0011) : sur UN produit,
  UN code ATC complet ou UN principe actif (appariement substance côté
  application, champ Swissmedic en texte libre), type OBLIGATOIRE (vocabulaire médicament — le typage cadre
  l'usage : l'invariant « aucune donnée patient » tient aussi par le design),
  auteur/date visibles, fraîcheur surveillée, écriture éditeurs. Bandeaux en
  haut de fiche, marqueur ⚠ dans recherche/scan/catalogue, page /notes.
- **Fiche = lecteur de notice** : sommaire vertical avec suivi de lecture,
  notice pleine hauteur, périphérie en panneau droit. PAS de bouton PDF ni de
  notice patient (retirés sur décision produit). Badge de catégorie coloré.
- **Catalogue** : arborescence ATC navigable (niveaux 1→3→4→5→7, compteurs
  calculés depuis les codes réels), filtre par catégorie de remise A/B/D/E.
  Libellés français : `src/lib/atc-libelles.json`, 1 278 entrées moissonnées
  de Wikipédia fr (CC BY-SA, générateur `scripts/gen_atc_labels.py` — à
  relancer en janvier quand l'OMS révise), fusionnées avec la table maison
  de `src/lib/atc.ts` qui prime. L'état de consultation (filtre, niveau ATC,
  remise, pagination) vit dans l'URL : le retour navigateur le restaure.
  ATTENTION : Supabase tronque toute réponse à 1 000 lignes, limit() au-delà
  est ignoré en silence — paginer par .range() (voir tousLesCodesAtc).

## Sémaphore — règles d'écriture NON NÉGOCIABLES

Nom choisi par Damien le 31.08.2026 en remplacement d'« aide-mémoire » : ces
fiches signalent quoi faire — niveaux d'orientation N1–N4, blocs « ne pas
délivrer », avertissements. Ne pas revenir à l'ancien nom.

Les 36 fiches viennent du projet `~/comptoir-otc` (fusionné le 31.08.2026 :
les trois volets, pas de fichier autonome, liaison ATC pendant le portage).
Elles vivent **en base** (table `fiches`, migration 0012) et sont
**modifiables depuis l'interface** par les éditeurs — décision de Damien :
édition complète ET amendements datés, les deux.

**Les règles ci-dessous viennent avec le contenu. Elles existent parce qu'une
erreur dans ces fiches peut se retrouver face à un patient.** Elles étaient
tenues par le rituel git ; elles ne reposent plus que sur la discipline de
qui édite. Un formulaire n'empêche personne d'écrire de mémoire.

### Ce que le Sémaphore n'est pas

Ni un détecteur d'interactions, ni une base de données. Les interactions,
doublons et posologies restent vérifiés dans le logiciel d'officine. Ces
fiches sont une grille de lecture : quoi vérifier, quoi dire, quand appeler.
Partout où un lecteur pourrait croire à une couverture exhaustive, le texte
doit le démentir. `compendium.ch` fait foi, pas Pharmadex.

### Méthode

1. **Une fiche à la fois.** Écrire une fiche, s'arrêter, attendre la
   validation explicite de Damien avant d'en commencer une autre. Jamais deux
   fiches dans un même élan, même si la demande semble le permettre.
2. **`verifie_le` se met à jour SEULEMENT quand les sources ont été
   revérifiées.** Corriger une coquille ne revérifie rien : laisser la date.
   C'est le seul témoin qui reste de la fraîcheur d'une fiche.
3. **Rapport de fin de fiche** dans la conversation : ce qui a été vérifié et
   où, les `non vérifié` restants avec leur raison, les sources tentées sans
   succès (qui figurent aussi dans le tableau `Sources` de la fiche).
4. **Amender plutôt que réécrire**, quand l'information s'ajoute. Un
   amendement (note de portée `fiche_id`) s'affiche en tête, daté et signé,
   sans toucher au texte vérifié. C'est le fonctionnement d'un errata.
   Réécrire est pour la correction ; amender est pour l'ajout.
   `supabase/seed/0012_fiches_data.sql` est l'amorçage initial, en
   `on conflict do nothing` : ne JAMAIS le régénérer ni le rejouer en
   écrasement — il effacerait le travail fait au comptoir.

### Sourcing — la règle qui prime sur toutes les autres

**AUCUN CONTENU DE MÉMOIRE.** Chaque posologie, contre-indication, catégorie
de remise, interaction ou statut de remboursement est vérifié en ligne
pendant la session qui écrit la fiche, sur une source ouverte, et daté.

1. **Suisses, prioritaires** — compendium.ch, swissmedicinfo.ch (information
   professionnelle) · Swissmedic · OFSP et Liste des spécialités · Fedlex
   (LPTh, OMéd, LAMal, OAMal, OPAS, OCStup) · LiMA · pharmaSuisse, RBP V,
   FPH · autorités vaudoises · Tox Info Suisse · sociétés suisses.
2. **Internationales, TOUJOURS signalées comme non suisses** — Embryotox,
   CRAT (grossesse, allaitement) · KDIGO (rénal) · listes PIM du sujet âgé.
3. **Jamais citées** — bases sous authentification (Pharmavista, Documedis,
   compendium sous login HIN) · RCP européens ou français présentés comme
   applicables en Suisse · toute donnée retenue de mémoire.

Applications : les **interactions** ne viennent que de la rubrique
« Interactions » de l'IP suisse (introuvable en accès ouvert → `non
vérifié`) ; les **catégories de remise** se vérifient PAR PRÉSENTATION (la
même molécule change de catégorie selon le conditionnement) ; le
**remboursement** est toujours daté et présenté comme « à revérifier ».
Chaque fiche finit par une section `Sources` repliée.

### Le marqueur `non vérifié`

Toute affirmation utile mais non vérifiée s'écrit
`<span class='nv'>non vérifié</span>`, suivie de **pourquoi** et de **où
compléter**. Un `non vérifié` honnête vaut mieux qu'une posologie plausible.
Ne jamais le supprimer en reformulant : on le résout en vérifiant, ou on le
garde.

### Deux échelles, jamais mélangées

Une fiche porte UNE série, selon son volet. **N1–N4** (OTC) répond à « où
j'envoie ce patient » : N1 urgences maintenant · N2 médecin aujourd'hui ·
N3 médecin traitant sous 48–72 h · N4 comptoir. **V1–V4** (ordonnances)
répond à « que fais-je de cette ordonnance » : V1 ne pas délivrer, contacter
le prescripteur · V2 délivrer après clarification · V3 délivrer avec mise en
garde et note au dossier · V4 conseil standard. Couleurs communes,
sémantiques distinctes.

### Technique

- **Deux requêtes, jamais une.** `listerFiches()` ne ramène que les
  métadonnées (36 lignes, cachées dans `useStore`) : c'est ce qui alimente la
  recherche du comptoir et le rattachement aux produits. Les sections
  n'arrivent que sur `lireFiche(id)`, pour la fiche ouverte. La règle d'or
  interdit de charger 424 Ko pour afficher une liste.
- **Deux chemins vers un médicament**, comme pour les ressources. Le champ
  `atc` de la fiche est le chemin LARGE : un code produit qui commence par
  l'un de ses préfixes la fait remonter, sans entretien (convention
  `atc_resources` ; préfixes vérifiés contre `src/lib/atc-libelles.json`).
  `product_fiches` (migration 0014) est le chemin FIN : la liaison à la main,
  pour le cas d'espèce que l'ATC ne dit pas. Sur la fiche produit, seules les
  liaisons manuelles portent un bouton de déliaison — l'ATC se corrige dans
  la fiche, pas depuis le produit.
- **L'éditeur est un formulaire à huit champs facultatifs**, pas un agenceur
  de blocs : le rendu suit un ordre fixe (p → ul → ol → table → check →
  triage → stop → warn), l'ordre n'a jamais été une décision de rédaction.
  Les conversions texte ↔ structure sont dans `src/lib/fiches-texte.ts`, un
  module SANS import d'exécution pour rester exécutable hors navigateur : un
  aller-retour qui perd du contenu mutile une fiche en silence, ça se teste
  (303/303 sections vérifiées). Un élément par ligne, cellules séparées par
  « | » — sûr, le corpus ne contient ni saut de ligne dans une liste ni « | »
  dans ses 2 885 cellules.
- Le HTML en ligne des chaînes (`<b>`, `<a>`, `<span class="dose|cat|n|nv">`)
  est rendu par `dangerouslySetInnerHTML` : contenu rédigé au dépôt et relu à
  chaque commit, jamais une saisie d'utilisateur. Vocabulaire clos — ne pas
  l'élargir sans ajouter la classe correspondante à `src/index.css`.
- Les checklists (`check`) gardent leur état dans le composant et le perdent
  en quittant la fiche : une case cochée pour un patient ne doit jamais
  réapparaître cochée pour le suivant.

## Administration (migration 0013)

- **Administrer ≠ éditer.** `allowed_emails.is_admin` est distinct de
  `can_edit` : rédiger une fiche et donner un accès ne sont pas le même acte.
  Helper `public.is_admin()`, policies d'écriture sur `allowed_emails`
  réservées aux administrateurs. L'amorçage a donné le droit aux éditeurs
  existants — sans quoi personne n'aurait pu ouvrir le panneau qui sert à
  nommer les administrateurs.
- **Journal** (`public.journal`) : écrit par des TRIGGERS, pas par
  l'application — une écriture qui contourne l'interface (script, SQL editor)
  doit laisser la même trace. `consigner()` est SECURITY DEFINER et la table
  n'a aucune policy d'insertion : une ligne de journal ne se fabrique pas.
  Lecture réservée aux administrateurs : c'est le seul contenu de Pharmadex
  qui parle de personnes plutôt que de médicaments.
- `/admin` a quatre onglets : accès et droits, état des données, qualité
  (liens cassés, contenus à revérifier, recherches vides — l'écran
  `/recherches-vides` y est replié et sa page supprimée), journal.
- Un administrateur ne peut pas se retirer à lui-même l'administration :
  ce serait fermer la porte de l'intérieur, la seule action irréversible
  depuis cet écran.

## Hors périmètre — ne pas construire sans demande explicite

- Recherche plein texte DANS les notices (elles restent chez Refdata).
- Refdata / pharmacode, sauf si les douchettes de l'officine l'exigent.
- Multi-officine, rôles au-delà de `can_edit`, panneau d'administration.
- **Aucune donnée patient, nulle part** : ne jamais ajouter de champ « notes de
  cas » ou tout autre espace de saisie libre qui inviterait à en consigner.
