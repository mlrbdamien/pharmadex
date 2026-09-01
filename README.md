# Pharmadex

Les références du comptoir — protocoles maison, pages grossesse / allaitement /
pédiatrie / infectiologie, sites officiels — derrière une seule barre de recherche.


---

## Démarrer en local

```bash
npm install
cp .env.example .env      # puis renseigner les deux variables
npm run dev
```

---

## 1. Créer le projet Supabase

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**, région
   **Frankfurt (eu-central-1)**. Noter le mot de passe de la base : il sert au backup.
2. **Project Settings > Data API** : copier l'URL du projet et la clé publique
   (« anon key » ou « publishable key ») dans `.env`.
3. **SQL Editor** : exécuter dans l'ordre
   `supabase/migrations/0001_init.sql` puis `supabase/migrations/0002_seed_tags.sql`.
4. **Authentication > Sign In / Providers** : décocher **Allow new users to sign up**.
   Les comptes se créent exclusivement à la main (voir §2).
5. **Authentication > Sessions** : allonger la durée de session (les postes du
   comptoir doivent rester connectés). Laisser le rafraîchissement automatique actif.

Aucune configuration d'URL de redirection ni de SMTP n'est nécessaire :
Pharmadex n'envoie jamais d'e-mail.

## 2. Ouvrir l'accès à quelqu'un

Deux gestes, volontairement séparés — il n'y a pas de panneau d'administration.

1. **Créer le compte** : *Authentication > Users > Add user > Create new user*.
   Saisir l'adresse et un mot de passe, et **cocher « Auto Confirm User »** —
   sans quoi le compte reste en attente d'une confirmation par e-mail que
   Pharmadex n'enverra jamais.
2. **Autoriser l'adresse**, dans le SQL Editor :

```sql
insert into public.allowed_emails (email, label, can_edit) values
  ('prenom.nom@exemple.ch', 'Prénom', true);   -- true = peut ajouter et modifier
```

L'adresse doit être **identique et en minuscules** dans les deux endroits
(une contrainte `check` le vérifie).

Retirer un accès : supprimer la ligne de `allowed_emails`. La personne reste
authentifiable mais ne voit plus rien (écran « Accès refusé »). Pour couper
franchement, supprimer aussi le compte dans *Authentication > Users*.

**Mot de passe oublié** : le redéfinir dans *Authentication > Users*, menu `…`
de la ligne, *Reset password*. Aucun e-mail n'est envoyé — c'est le prix, assumé,
de ne dépendre d'aucun service d'envoi.

**Poste du comptoir** : créer un compte partagé (ex. `comptoir@…`) avec
`can_edit = false`, s'y connecter une fois sur chaque PC et ne plus s'en
déconnecter. Le mot de passe est connu de l'équipe : c'est acceptable ici, où
l'outil ne contient aucune donnée patient, l'accès reste borné par la RLS, et
le poste se trouve dans une zone contrôlée.

## 2 bis. Produits (v2) — scan de boîte

La table des produits vient de la liste publique Swissmedic des emballages
autorisés (« Zugelassene Packungen Humanarzneimittel », mise à jour mensuelle).
Le GTIN de chaque emballage est calculé : `7680` + n° d'autorisation + code
d'emballage + clé EAN-13.

- **Import automatique** : workflow `import-products.yml`, le 3 de chaque mois
  (réutilise le secret `SUPABASE_DB_URL`). Déclenchable à la main via
  *Run workflow*.
- **Test local sans base** : `pip install openpyxl` puis
  `python3 scripts/import_products.py --dry-run`.
- Un produit retiré du marché n'est jamais supprimé : les boîtes encore en
  circulation doivent rester scannables.
- **Liaison** : depuis la fiche produit affichée après un scan, un éditeur peut
  lier une ressource au produit précis ou à un niveau de sa classe ATC
  (« M01A » couvre tous les AINS d'un geste).
- Limite connue : pas de pharmacode (anciens codes 39). Si les douchettes de
  l'officine en émettent, il faudra la base Refdata.

**Notices (v3)** : le même workflow indexe le catalogue AIPS (~29 000 liens
vers les notices HTML/PDF hébergées par Refdata — aucun contenu n'est copié).
La fiche produit (`/p/<n° d'autorisation>`) intègre la notice en iframe, avec
raccourcis de rubriques. Test local : `python3 scripts/import_notices.py --dry-run`.

Sources des données : Swissmedic (liste des médicaments autorisés à usage
humain) et AIPS/Refdata (notices) — données publiques, consultatives, utilisées
conformément à leurs conditions.

## 3. Déployer les Edge Functions

```bash
npx supabase link --project-ref <ref-du-projet>
npx supabase functions deploy fetch-title
npx supabase functions deploy check-links
npx supabase secrets set CHECK_LINKS_SECRET="$(openssl rand -hex 32)"
```

Conserver la valeur du secret : elle doit être identique côté GitHub.

## 4. Déployer sur Cloudflare Pages

Dashboard Cloudflare > **Workers & Pages** > **Create** > **Pages** >
*Connect to Git*, puis :

| Réglage | Valeur |
|---|---|
| Framework preset | *None* |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version (variable `NODE_VERSION`) | `22` |

Variables d'environnement (production **et** preview) :
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

Le repli de routage est assuré par `not_found_handling: "single-page-application"`
dans `wrangler.jsonc` — sans lui, un rechargement sur `/recherches-vides` donnerait
un 404. Ne pas y ajouter de `public/_redirects` : la règle `/* → /index.html` est
rejetée par le validateur Workers, qui y voit une boucle infinie une fois les
chemins normalisés.

## 5. Secrets GitHub

`Settings > Secrets and variables > Actions` :

| Secret | Usage | Où le trouver |
|---|---|---|
| `SUPABASE_DB_URL` | sauvegarde nocturne | Bouton **Connect** (barre du haut) > *Direct connection string* > **Session pooler** > type URI |
| `CHECK_LINKS_URL` | vérificateur hebdo | `https://<ref>.supabase.co/functions/v1/check-links` |
| `CHECK_LINKS_SECRET` | vérificateur hebdo | la valeur générée à l'étape 3 |

**Note** : les migrations posent leurs propres `GRANT`, elles fonctionnent donc que « Automatically expose new tables » soit activé ou non.

Deux pièges sur `SUPABASE_DB_URL` :

- **Retirer les crochets.** La chaîne copiée contient `[YOUR-PASSWORD]` ; il faut
  remplacer le tout, crochets compris. Les laisser produit
  `FATAL: password authentication failed`.
- **Le pooler tronque le nom d'utilisateur dans ses messages d'erreur.** Il
  signale `user "postgres"` alors que la chaîne dit bien
  `postgres.<project-ref>` — ne pas partir en chasse de ce côté, l'erreur
  concerne presque toujours le mot de passe.

Pour tester la chaîne sans consommer un cycle de CI :

```bash
docker run --rm postgres:17-alpine psql "<la-chaîne>" -tAc "select current_user"
```

**Portée de la sauvegarde** : le dump couvre le schéma `public` — ressources,
tags, allowlist, journal des recherches. Il ne contient **pas** les fichiers
téléversés dans le Storage ni les comptes Auth. Les PDF importants doivent
garder une copie dans le dossier partagé de l'officine.

---

## Périmètre

**v1** : liens et fichiers, recherche instantanée, tags, épinglage, journal des
recherches vides, vérificateur de liens hebdomadaire.

**Hors périmètre** : base de médicaments, import AIPS/Refdata, multi-officine,
rôles au-delà de `can_edit`, données patient. Voir `CLAUDE.md`.
