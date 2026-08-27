-- ============================================================================
-- Pharmadex v3 — notices AIPS et fiches complètes
--
-- L'AIPS (format SIMIS) publie un catalogue d'URLs : chaque autorisation
-- pointe vers sa notice HTML/PDF hébergée publiquement chez Refdata. On
-- n'importe donc AUCUN contenu — seulement l'index des liens, rafraîchi par
-- le workflow mensuel. Conditions d'utilisation AIPS/SAI : consultation et
-- réutilisation permises, usage consultatif.
-- ============================================================================

create table public.notices (
  -- Pas de FK vers products : l'AIPS couvre des numéros absents de la liste
  -- des emballages (retraits récents, autorisations spéciales).
  authorization_nr text not null,
  doc_type    text not null check (doc_type in ('SmPC','PIL','PL')),
  lang        text not null check (lang in ('de','fr','it','en')),
  description text,
  html_url    text not null,
  pdf_url     text,
  updated_on  timestamptz,
  primary key (authorization_nr, doc_type, lang)
);

create index notices_auth_idx on public.notices (authorization_nr);

alter table public.notices enable row level security;

create policy "notices_select_allowed" on public.notices
  for select to authenticated using (public.is_allowed());
-- Aucune policy d'écriture : remplie par l'import (service_role) uniquement.

grant select on public.notices to authenticated;

-- ---------------------------------------------------------------------------
-- Le revers des liaisons, pour la fiche ressource : à quels produits et à
-- quelles classes cette ressource est-elle rattachée ? Le compteur par
-- préfixe montre la portée réelle (« M01A → 87 produits »).
-- ---------------------------------------------------------------------------
create or replace function public.resource_links(rid uuid)
  returns json
  language sql stable security invoker
  set search_path = public
as $$
  select json_build_object(
    'products', coalesce((
      select json_agg(json_build_object(
               'authorization_nr', p.authorization_nr,
               'name', p.name) order by p.name)
        from product_resources pr
        join products p using (authorization_nr)
       where pr.resource_id = rid
    ), '[]'::json),
    'atc', coalesce((
      select json_agg(json_build_object(
               'prefix', ar.atc_prefix,
               'product_count', (select count(*) from products p
                                  where p.atc_code like ar.atc_prefix || '%'))
             order by ar.atc_prefix)
        from atc_resources ar
       where ar.resource_id = rid
    ), '[]'::json)
  );
$$;

-- resolve_codes renvoie désormais aussi le n° d'autorisation, pour que le
-- journal des recherches vides pointe vers la fiche produit.
drop function public.resolve_codes(text[]);
create function public.resolve_codes(codes text[])
  returns table (code text, name text, authorization_nr text)
  language sql stable security invoker
  set search_path = public
as $$
  select c.code, p.name, p.authorization_nr
    from unnest(codes) as c(code)
    join packages k
      on k.gtin = case
                    when length(c.code) = 14 and left(c.code, 1) = '0'
                    then substr(c.code, 2)
                    else c.code
                  end
    join products p using (authorization_nr);
$$;

grant execute on function public.resource_links(uuid)  to authenticated;
grant execute on function public.resolve_codes(text[]) to authenticated;
