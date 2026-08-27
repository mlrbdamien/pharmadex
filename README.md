# Pharmadex

Les références du comptoir — protocoles maison, pages grossesse / allaitement /
pédiatrie / infectiologie, sites officiels — derrière une seule barre de recherche.

Aucune donnée patient n'est stockée, nulle part.

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
4. **Authentication > URL Configuration** :
   - *Site URL* : l'URL Cloudflare Pages de production ;
   - *Redirect URLs* : y ajouter `http://localhost:5173` pour le développement.
5. **Authentication > Sessions** : allonger la durée de session (les postes du
   comptoir doivent rester connectés). Laisser le rafraîchissement automatique actif.

## 1 bis. Service d'envoi d'e-mails — obligatoire avant l'usage réel

Le SMTP intégré de Supabase est **prévu pour les tests uniquement** : quelques
envois par heure, tous projets confondus (quota exact dans
*Authentication > Rate Limits*). Passé ce seuil, la connexion renvoie
« email rate limit exceeded » et plus personne ne peut se connecter.

Avec un compte comptoir partagé qui reste connecté en permanence, les envois
sont rares — mais l'ouverture des accès à l'équipe les concentre sur une même
journée. Il faut donc brancher un service tiers.

*Authentication > Emails > SMTP Settings*, avec au choix Resend, Postmark,
Brevo ou Mailgun : tous ont une offre gratuite très au-delà des besoins d'une
officine. Renseigner l'hôte, le port, l'identifiant, le mot de passe, ainsi
qu'une adresse d'expéditeur du domaine de l'officine — un expéditeur crédible
réduit nettement le classement en indésirable.

Une fois le SMTP configuré, relever la limite dans *Authentication >
Rate Limits*, qui reste basse par défaut même avec un service tiers.

## 2. Ouvrir l'accès à quelqu'un

Deux gestes, volontairement séparés — il n'y a pas de panneau d'administration.

1. **Créer le compte** : Authentication > Users > **Invite user**, saisir l'adresse.
   L'application n'a pas le droit de créer de comptes
   (`signInWithOtp({ shouldCreateUser: false })`), donc cette étape est obligatoire.
2. **Autoriser l'adresse**, dans le SQL Editor :

```sql
insert into public.allowed_emails (email, label, can_edit) values
  ('prenom.nom@exemple.ch', 'Prénom', true);   -- true = peut ajouter et modifier
```

Retirer un accès : supprimer la ligne de `allowed_emails`. La personne reste
authentifiable mais ne voit plus rien (l'écran « Accès refusé » s'affiche).

**Poste du comptoir** : créer un compte partagé (ex. `comptoir@…`) avec
`can_edit = false`, s'y connecter une fois sur chaque PC, et ne plus s'en
déconnecter. Aucun magic link à aller chercher pendant un conseil.

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
