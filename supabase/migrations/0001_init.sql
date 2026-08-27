-- ============================================================================
-- Pharmadex — schéma initial
--
-- v2 (HORS PÉRIMÈTRE, ne pas coder maintenant) : import AIPS/Refdata dans une
-- table `products` (gtin, pharmacode, nom, principe actif, …) et une table de
-- jointure `product_resources` (product_id, resource_id), permettant de scanner
-- une boîte au comptoir et d'obtenir directement les protocoles rattachés.
-- Les codes capturés dans `search_misses` (colonne `is_code`) constituent la
-- liste de départ des produits que l'équipe cherche déjà.
-- ============================================================================

create extension if not exists unaccent with schema extensions;

-- ---------------------------------------------------------------------------
-- Recherche insensible aux accents.
--
-- Le dictionnaire `french` de Postgres ne retire PAS les accents : sans cette
-- configuration, « pediatrie » tapé à la volée ne trouve pas « pédiatrie ».
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_ts_config where cfgname = 'fr_unaccent') then
    execute 'create text search configuration public.fr_unaccent (copy = french)';
    execute 'alter text search configuration public.fr_unaccent
             alter mapping for hword, hword_part, word
             with extensions.unaccent, french_stem';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Allowlist — la seule porte d'entrée.
-- ---------------------------------------------------------------------------
create table public.allowed_emails (
  email      text primary key check (email = lower(email)),
  label      text,                                  -- « Comptoir », « Damien », …
  can_edit   boolean     not null default false,
  created_at timestamptz not null default now()
);

comment on table public.allowed_emails is
  'Alimentée à la main (SQL editor / dashboard), jamais par l''application.';

-- ---------------------------------------------------------------------------
-- Helpers d'autorisation.
--
-- SECURITY DEFINER est ici obligatoire : une politique RLS posée SUR
-- allowed_emails qui interrogerait allowed_emails provoquerait une récursion
-- infinie. Ces fonctions court-circuitent la RLS le temps de la vérification.
-- Le search_path figé empêche le détournement de résolution de noms.
-- ---------------------------------------------------------------------------
create or replace function public.current_email() returns text
  language sql stable
  as $$ select lower(auth.jwt() ->> 'email') $$;

create or replace function public.is_allowed() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (
         select 1 from allowed_emails where email = public.current_email()
       ) $$;

create or replace function public.can_edit() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (
         select 1 from allowed_emails
         where email = public.current_email() and can_edit
       ) $$;

-- ---------------------------------------------------------------------------
-- Tags — libres, mais matérialisés pour l'autocomplétion.
-- ---------------------------------------------------------------------------
create table public.tags (
  name       text primary key
             check (name = lower(trim(name)) and length(name) between 2 and 40),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Aplatissement des tags pour l'indexation.
--
-- `array_to_string` est déclarée STABLE, pas IMMUTABLE : les fonctions de
-- sortie d'éléments peuvent en théorie dépendre de réglages de session (pensez
-- à DateStyle pour un tableau de dates). Postgres refuse donc de l'employer
-- dans une colonne générée — d'où ce passe-plat.
--
-- Le marquer IMMUTABLE est ici légitime et non un contournement : les éléments
-- sont du `text`, dont la fonction de sortie (`textout`) est elle-même
-- immuable. Le résultat ne dépend d'aucun réglage.
-- ---------------------------------------------------------------------------
create or replace function public.tags_text(tags text[]) returns text
  language sql immutable parallel safe
  as $$ select array_to_string(tags, ' ') $$;

-- ---------------------------------------------------------------------------
-- Ressources — un lien OU un fichier, jamais les deux, jamais aucun.
-- ---------------------------------------------------------------------------
create table public.resources (
  id              uuid primary key default gen_random_uuid(),
  title           text        not null check (length(trim(title)) > 0),
  description     text        check (length(description) <= 500),
  url             text,
  file_path       text,                             -- chemin dans le bucket `resources`
  file_name       text,
  file_size       integer,
  mime_type       text,
  tags            text[]      not null default '{}',
  pinned          boolean     not null default false,
  verified_on     date,                             -- « vérifié le »
  owner           text,                             -- responsable, texte libre
  broken          boolean     not null default false,
  last_checked_at timestamptz,
  last_status     integer,                          -- code HTTP du dernier contrôle
  created_at      timestamptz not null default now(),
  created_by      text        not null default public.current_email(),
  updated_at      timestamptz not null default now(),

  constraint resource_target_exclusif check (
    (url is not null and file_path is null) or
    (url is null     and file_path is not null)
  ),
  constraint url_http_uniquement check (url is null or url ~* '^https?://')
);

-- Vecteur de recherche pondéré : titre > tags > description.
--
-- to_tsvector(regconfig, text) est IMMUTABLE, donc utilisable en colonne
-- générée. Contrepartie : si la configuration fr_unaccent change un jour, il
-- faudra REINDEX resources_search_idx.
alter table public.resources add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('public.fr_unaccent', coalesce(title, '')),        'A') ||
    setweight(to_tsvector('public.fr_unaccent', public.tags_text(tags)),     'B') ||
    setweight(to_tsvector('public.fr_unaccent', coalesce(description, '')),  'C')
  ) stored;

create index resources_search_idx on public.resources using gin (search_vector);
create index resources_tags_idx   on public.resources using gin (tags);
create index resources_recent_idx on public.resources (pinned desc, created_at desc);

-- ---------------------------------------------------------------------------
-- Journal des recherches vides.
-- ---------------------------------------------------------------------------
create table public.search_misses (
  term       text primary key check (term = lower(trim(term))),
  hits       integer     not null default 1,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  -- Une douchette code-barres écrit un EAN-13 dans la barre de recherche. Ces
  -- codes ne sont pas du bruit : ce sont les produits que l'équipe cherche et
  -- qu'on ne sait pas encore rattacher (matière première de la v2). On les
  -- marque plutôt que de les jeter, pour pouvoir les filtrer à l'affichage.
  is_code    boolean generated always as (term ~ '^[0-9]{8,14}$') stored
);

create index search_misses_recent_idx on public.search_misses (last_seen desc);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger resources_touch
  before update on public.resources
  for each row execute function public.touch_updated_at();

-- Normalise les tags et alimente la table `tags`.
-- SECURITY DEFINER : évite d'ouvrir une policy INSERT sur `tags`.
create or replace function public.sync_tags() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  -- Minuscules + trim AVANT dédoublonnage, sinon « Grossesse » et « grossesse »
  -- survivent tous les deux. Les bornes correspondent au check de `tags`.
  new.tags := (
    select coalesce(array_agg(distinct lower(trim(t)) order by lower(trim(t))), '{}')
    from unnest(new.tags) as t
    where length(trim(t)) between 2 and 40
  );

  insert into tags (name)
  select distinct t from unnest(new.tags) as t
  on conflict (name) do nothing;

  return new;
end $$;

create trigger resources_sync_tags
  before insert or update of tags on public.resources
  for each row execute function public.sync_tags();

-- ---------------------------------------------------------------------------
-- Recherche. SECURITY INVOKER : la RLS de `resources` s'applique normalement.
--
-- Le suffixe `:*` sur chaque lexème rend la recherche utilisable dès la frappe
-- — « grosse » trouve « grossesse » sans attendre le mot complet.
-- Le ilike sert de filet pour les correspondances en milieu de mot
-- (« stitut » → « Institut »), que la recherche plein texte ne couvre pas.
-- À l'échelle d'une officine (quelques centaines de lignes) ce parcours
-- séquentiel est indolore.
-- ---------------------------------------------------------------------------
create or replace function public.search_resources(q text)
  returns setof public.resources
  language plpgsql stable security invoker
  set search_path = public, extensions
as $$
declare
  norm text := trim(coalesce(q, ''));
  tsq  tsquery;
begin
  if norm = '' then
    return query
      select * from resources order by pinned desc, created_at desc limit 100;
    return;
  end if;

  select to_tsquery('public.fr_unaccent', string_agg(lexeme || ':*', ' & '))
    into tsq
    from unnest(to_tsvector('public.fr_unaccent', norm));

  return query
    select r.* from resources r
    where (tsq is not null and r.search_vector @@ tsq)
       or unaccent(r.title) ilike '%' || unaccent(norm) || '%'
       or unaccent(coalesce(r.description, '')) ilike '%' || unaccent(norm) || '%'
       or exists (
            select 1 from unnest(r.tags) as t
            where unaccent(t) ilike '%' || unaccent(norm) || '%'
          )
    order by
      r.pinned desc,
      case when tsq is not null then ts_rank(r.search_vector, tsq) else 0 end desc,
      r.created_at desc
    limit 50;
end $$;

-- Enregistre une recherche restée sans résultat.
-- SECURITY DEFINER pour que le compte comptoir (lecture seule) puisse écrire
-- ici, et seulement ici.
create or replace function public.log_search_miss(q text)
  returns void
  language plpgsql security definer set search_path = public
as $$
declare
  norm text := lower(trim(coalesce(q, '')));
begin
  if not public.is_allowed() then
    raise exception 'non autorisé';
  end if;
  if length(norm) < 3 or length(norm) > 80 then
    return;
  end if;

  insert into search_misses (term) values (norm)
  on conflict (term) do update
    set hits = search_misses.hits + 1, last_seen = now();
end $$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.allowed_emails enable row level security;
alter table public.resources      enable row level security;
alter table public.tags           enable row level security;
alter table public.search_misses  enable row level security;

-- allowed_emails : chacun ne voit que sa propre ligne (l'app en tire can_edit).
-- Aucune policy d'écriture : la table se modifie au dashboard / SQL editor.
create policy "allowed_emails_select_self" on public.allowed_emails
  for select to authenticated using (email = public.current_email());

-- resources : lecture pour tout email allowlisté, écriture pour les éditeurs.
create policy "resources_select_allowed" on public.resources
  for select to authenticated using (public.is_allowed());
create policy "resources_insert_editor" on public.resources
  for insert to authenticated with check (public.can_edit());
create policy "resources_update_editor" on public.resources
  for update to authenticated using (public.can_edit()) with check (public.can_edit());
create policy "resources_delete_editor" on public.resources
  for delete to authenticated using (public.can_edit());

-- tags : lecture allowlist (autocomplétion), ménage réservé aux éditeurs.
-- L'insertion passe exclusivement par le trigger sync_tags().
create policy "tags_select_allowed" on public.tags
  for select to authenticated using (public.is_allowed());
create policy "tags_delete_editor" on public.tags
  for delete to authenticated using (public.can_edit());

-- search_misses : lecture et purge réservées aux éditeurs.
-- L'écriture passe exclusivement par log_search_miss().
create policy "search_misses_select_editor" on public.search_misses
  for select to authenticated using (public.can_edit());
create policy "search_misses_delete_editor" on public.search_misses
  for delete to authenticated using (public.can_edit());

-- ---------------------------------------------------------------------------
-- Privilèges.
--
-- RLS et GRANT sont deux serrures distinctes : la policy dit QUELLES LIGNES un
-- rôle peut voir, le GRANT dit s'il a le droit de toucher la table. Supabase
-- pose ces GRANT automatiquement quand « Automatically expose new tables » est
-- actif ; les déclarer ici rend la migration indépendante de ce réglage — et
-- documente au passage qui a le droit de faire quoi.
--
-- Rien n'est accordé à `anon` : sans session, l'API ne renvoie rien.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;

grant select                         on public.allowed_emails to authenticated;
grant select, insert, update, delete on public.resources      to authenticated;
grant select                         on public.tags           to authenticated;
grant select, delete                 on public.search_misses  to authenticated;

-- `tags` n'apparaît pas en écriture : son alimentation passe uniquement par le
-- trigger sync_tags(), en SECURITY DEFINER.

grant execute on function public.tags_text(text[])        to authenticated;
grant execute on function public.current_email()          to authenticated;
grant execute on function public.is_allowed()             to authenticated;
grant execute on function public.can_edit()               to authenticated;
grant execute on function public.search_resources(text)   to authenticated;
grant execute on function public.log_search_miss(text)    to authenticated;

-- ---------------------------------------------------------------------------
-- Storage : bucket privé, servi en URL signée.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources', 'resources', false, 20971520,        -- 20 Mo
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

create policy "storage_select_allowed" on storage.objects
  for select to authenticated
  using (bucket_id = 'resources' and public.is_allowed());
create policy "storage_insert_editor" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resources' and public.can_edit());
create policy "storage_delete_editor" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resources' and public.can_edit());
