-- ============================================================================
-- Pharmadex v2 — produits et liaison scan → ressources
--
-- Concrétise la v2 annoncée en commentaire de 0001_init.sql : scanner une
-- boîte au comptoir identifie le produit et remonte les ressources liées.
--
-- Source : liste Swissmedic des emballages autorisés (mensuelle, publique).
-- Le GTIN suisse se construit : 7680 + n° d'autorisation (5) + code
-- d'emballage (3) + clé EAN-13. `products` et `packages` sont remplies
-- exclusivement par l'import (service_role) — aucune policy d'écriture.
-- ============================================================================

create table public.products (
  authorization_nr text primary key check (authorization_nr ~ '^[0-9]{5}$'),
  name         text not null,
  company      text,
  atc_code     text,           -- ex. 'M01AE01' ; nullable (rares lignes sans ATC)
  substances   text,           -- Wirkstoff(e), texte brut
  category     text,           -- catégorie de remise (A/B/D/E)
  imported_at  timestamptz not null default now()
);

create table public.packages (
  gtin             text primary key check (gtin ~ '^[0-9]{13}$'),
  authorization_nr text not null references public.products on delete cascade,
  pack_code        text not null,
  description      text        -- conditionnement + unité
);

create index packages_authorization_idx on public.packages (authorization_nr);
create index products_atc_idx on public.products (atc_code);

-- Liaison fine : « ce protocole concerne CE produit », toutes tailles
-- d'emballage confondues (clé = n° d'autorisation, pas GTIN).
create table public.product_resources (
  authorization_nr text not null references public.products  on delete cascade,
  resource_id      uuid not null references public.resources on delete cascade,
  created_at       timestamptz not null default now(),
  primary key (authorization_nr, resource_id)
);

-- Liaison large : « ce protocole concerne toute la classe ». Un préfixe ATC
-- (M, M01, M01A, M01AE, M01AE01) couvre des centaines de boîtes d'un geste —
-- c'est le vrai levier au comptoir.
create table public.atc_resources (
  atc_prefix  text not null check (atc_prefix ~ '^[A-Z][0-9A-Z]{0,6}$'),
  resource_id uuid not null references public.resources on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (atc_prefix, resource_id)
);

create index product_resources_resource_idx on public.product_resources (resource_id);
create index atc_resources_resource_idx     on public.atc_resources (resource_id);

-- ---------------------------------------------------------------------------
-- Scan : GTIN → produit + ressources liées (par produit ET par classe ATC).
--
-- SECURITY INVOKER : la RLS de `resources` s'applique — un email hors
-- allowlist ne verra ni produit ni ressource.
--
-- Le code arrive déjà normalisé par le front (13 chiffres) ; on tolère juste
-- le GTIN-14 à zéro de tête, forme la plus courante en sortie de DataMatrix.
-- ---------------------------------------------------------------------------
create or replace function public.scan_gtin(code text)
  returns json
  language plpgsql stable security invoker
  set search_path = public
as $$
declare
  norm text := regexp_replace(coalesce(code, ''), '[^0-9]', '', 'g');
  hit  record;
  res  json;
begin
  if length(norm) = 14 and left(norm, 1) = '0' then
    norm := substr(norm, 2);
  end if;
  if norm !~ '^[0-9]{13}$' then
    return null;
  end if;

  select p.authorization_nr, p.name, p.company, p.atc_code, p.substances,
         p.category, k.description as package_description
    into hit
    from packages k
    join products p using (authorization_nr)
   where k.gtin = norm;

  if not found then
    return null;
  end if;

  select coalesce(json_agg(row_to_json(r) order by r.pinned desc, r.created_at desc), '[]'::json)
    into res
    from (
      select distinct on (r.id)
             r.id, r.title, r.description, r.url, r.file_path, r.file_name,
             r.file_size, r.mime_type, r.tags, r.pinned, r.verified_on,
             r.owner, r.broken, r.last_checked_at, r.last_status,
             r.created_at, r.created_by, r.updated_at
        from resources r
       where r.id in (
               select pr.resource_id from product_resources pr
                where pr.authorization_nr = hit.authorization_nr
               union
               select ar.resource_id from atc_resources ar
                where hit.atc_code is not null
                  and hit.atc_code like ar.atc_prefix || '%'
             )
    ) r;

  return json_build_object(
    'product', json_build_object(
      'authorization_nr', hit.authorization_nr,
      'name',             hit.name,
      'company',          hit.company,
      'atc_code',         hit.atc_code,
      'substances',       hit.substances,
      'category',         hit.category,
      'package_description', hit.package_description
    ),
    'resources', res
  );
end $$;

-- Résolution groupée de codes du journal vers des noms de produits.
create or replace function public.resolve_codes(codes text[])
  returns table (code text, name text)
  language sql stable security invoker
  set search_path = public
as $$
  select c.code, p.name
    from unnest(codes) as c(code)
    join packages k
      on k.gtin = case
                    when length(c.code) = 14 and left(c.code, 1) = '0'
                    then substr(c.code, 2)
                    else c.code
                  end
    join products p using (authorization_nr);
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.products          enable row level security;
alter table public.packages          enable row level security;
alter table public.product_resources enable row level security;
alter table public.atc_resources     enable row level security;

create policy "products_select_allowed" on public.products
  for select to authenticated using (public.is_allowed());
create policy "packages_select_allowed" on public.packages
  for select to authenticated using (public.is_allowed());

create policy "product_resources_select_allowed" on public.product_resources
  for select to authenticated using (public.is_allowed());
create policy "product_resources_insert_editor" on public.product_resources
  for insert to authenticated with check (public.can_edit());
create policy "product_resources_delete_editor" on public.product_resources
  for delete to authenticated using (public.can_edit());

create policy "atc_resources_select_allowed" on public.atc_resources
  for select to authenticated using (public.is_allowed());
create policy "atc_resources_insert_editor" on public.atc_resources
  for insert to authenticated with check (public.can_edit());
create policy "atc_resources_delete_editor" on public.atc_resources
  for delete to authenticated using (public.can_edit());

-- ---------------------------------------------------------------------------
-- Privilèges (même logique que 0001 : RLS et GRANT sont deux serrures)
-- ---------------------------------------------------------------------------
grant select                 on public.products          to authenticated;
grant select                 on public.packages          to authenticated;
grant select, insert, delete on public.product_resources to authenticated;
grant select, insert, delete on public.atc_resources     to authenticated;

grant execute on function public.scan_gtin(text)       to authenticated;
grant execute on function public.resolve_codes(text[]) to authenticated;
