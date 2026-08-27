-- ============================================================================
-- Pharmadex v2.1 — les produits sont cherchables par nom, pas seulement
-- par scan. « Inderal » au clavier vaut un scan de la boîte.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Fiche produit + ressources liées, par n° d'autorisation. Factorisation du
-- corps de scan_gtin, pour que le scan et le clic sur un résultat de
-- recherche partagent exactement la même réponse.
-- ---------------------------------------------------------------------------
create or replace function public.product_hit(auth text)
  returns json
  language plpgsql stable security invoker
  set search_path = public
as $$
declare
  hit record;
  res json;
begin
  select p.authorization_nr, p.name, p.company, p.atc_code, p.substances, p.category
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

-- scan_gtin réutilise product_hit, en ajoutant le conditionnement de
-- l'emballage précis qui a été scanné.
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
  if norm !~ '^[0-9]{13}$' then
    return null;
  end if;

  select k.authorization_nr, k.description into pkg
    from packages k where k.gtin = norm;
  if not found then
    return null;
  end if;

  hit := public.product_hit(pkg.authorization_nr);
  return jsonb_set(hit::jsonb, '{product,package_description}',
                   coalesce(to_jsonb(pkg.description), 'null'::jsonb))::json;
end $$;

-- ---------------------------------------------------------------------------
-- Recherche de produits par nom ou principe actif, accents ignorés.
--
-- 6 300 lignes : un parcours séquentiel avec unaccent est indolore, comme le
-- filet ilike de search_resources. Les correspondances en début de nom
-- remontent d'abord (au comptoir on tape le début du nom commercial).
-- ---------------------------------------------------------------------------
create or replace function public.search_products(q text)
  returns setof public.products
  language sql stable security invoker
  set search_path = public, extensions
as $$
  select p.*
    from products p
   where unaccent(p.name) ilike '%' || unaccent(trim(q)) || '%'
      or unaccent(coalesce(p.substances, '')) ilike '%' || unaccent(trim(q)) || '%'
   order by
     unaccent(p.name) ilike unaccent(trim(q)) || '%' desc,
     position(lower(unaccent(trim(q))) in lower(unaccent(p.name))),
     p.name
   limit 6;
$$;

grant execute on function public.product_hit(text)     to authenticated;
grant execute on function public.search_products(text) to authenticated;
