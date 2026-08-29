-- ============================================================================
-- Pharmadex — dénominations françaises officielles, prix publics, Pharmacode
--
-- Swissmedic ne publie sa liste qu'en allemand ; l'import la traduit par table
-- (scripts/formes_fr.py). Les sources officielles françaises s'y substituent
-- quand elles couvrent le produit, par ordre de priorité :
--
--   1. Refdatabase-articles (Refdata) — 100 % des articles, Pharmacode inclus
--   2. Liste des spécialités (OFSP)   — 54 %, remboursés, + prix publics
--   3. table de traduction            — repli
--
-- `name_fr` est AGNOSTIQUE de la source ; `fr_source` dit qui l'a remplie.
-- ============================================================================

alter table public.products
  add column if not exists name_fr   text,
  add column if not exists fr_source text check (fr_source in ('refdata', 'sl', 'table'));

alter table public.packages
  add column if not exists description_fr text,
  add column if not exists price_public   numeric(10, 2),
  -- Rempli par la Refdatabase. La colonne existe dès maintenant pour que la
  -- recherche par code soit prête le jour de son arrivée.
  add column if not exists pharmacode     text;

create index if not exists packages_pharmacode_idx
  on public.packages (pharmacode) where pharmacode is not null;

-- ---------------------------------------------------------------------------
-- Recherche : le nom français d'abord, l'allemand toujours cherchable.
-- Une collègue germanophone garde ses réflexes, et la boîte porte parfois
-- l'allemand — les deux doivent trouver.
-- ---------------------------------------------------------------------------
create or replace function public.search_products(q text)
  returns setof public.products
  language sql stable security invoker
  set search_path = public, extensions
as $$
  select p.*
    from products p
   where unaccent(coalesce(p.name_fr, '')) ilike '%' || unaccent(trim(q)) || '%'
      or unaccent(p.name) ilike '%' || unaccent(trim(q)) || '%'
      or unaccent(coalesce(p.substances, '')) ilike '%' || unaccent(trim(q)) || '%'
   order by
     unaccent(coalesce(p.name_fr, p.name)) ilike unaccent(trim(q)) || '%' desc,
     position(lower(unaccent(trim(q))) in lower(unaccent(coalesce(p.name_fr, p.name)))),
     coalesce(p.name_fr, p.name)
   limit 6;
$$;

-- ---------------------------------------------------------------------------
-- Scan : GTIN comme avant, et Pharmacode en plus (7 à 9 chiffres). Les deux
-- codes cohabitent sur les emballages suisses selon les fournisseurs.
-- ---------------------------------------------------------------------------
create or replace function public.scan_gtin(code text)
  returns json
  language plpgsql stable security invoker
  set search_path = public
as $$
declare
  norm text := regexp_replace(coalesce(code, ''), '[^0-9]', '', 'g');
  pkg  record;
  hit  json;
begin
  if length(norm) = 14 and left(norm, 1) = '0' then
    norm := substr(norm, 2);
  end if;

  if norm ~ '^[0-9]{13}$' then
    select k.authorization_nr, k.description, k.description_fr
      into pkg from packages k where k.gtin = norm;
  elsif norm ~ '^[0-9]{6,9}$' then
    -- Pharmacode : jamais ambigu avec un GTIN, dont la longueur est fixe.
    select k.authorization_nr, k.description, k.description_fr
      into pkg from packages k where k.pharmacode = ltrim(norm, '0');
  else
    return null;
  end if;

  if not found then
    return null;
  end if;

  hit := public.product_hit(pkg.authorization_nr);
  return jsonb_set(hit::jsonb, '{product,package_description}',
                   coalesce(to_jsonb(coalesce(pkg.description_fr, pkg.description)),
                            'null'::jsonb))::json;
end $$;

-- product_hit expose le nom français quand il existe.
create or replace function public.product_hit(auth text)
  returns json
  language plpgsql stable security invoker
  set search_path = public
as $$
declare
  hit record;
  res json;
begin
  select p.authorization_nr, coalesce(p.name_fr, p.name) as name, p.company,
         p.atc_code, p.substances, p.category
    into hit
    from products p
   where p.authorization_nr = auth;

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
      'package_description', null
    ),
    'resources', res
  );
end $$;
