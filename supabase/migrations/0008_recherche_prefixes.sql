-- ============================================================================
-- Pharmadex — recherche de produits par préfixes de mots
--
-- « ib sandoz » doit trouver « IBUPROFEN Sandoz cpr pell 400 mg » : chaque
-- mot tapé est un DÉBUT de mot du nom (français ou allemand) ou des
-- substances, dans n'importe quel ordre. Personne ne tape un nom complet
-- au comptoir.
-- ============================================================================

create or replace function public.search_products(q text)
  returns setof public.products
  language plpgsql stable security invoker
  set search_path = public, extensions
as $$
declare
  mots text[];
begin
  -- Découpage en mots, accents retirés, métacaractères regex neutralisés :
  -- l'entrée vient d'un champ de saisie, pas d'un développeur.
  select array_agg(regexp_replace(m, '([.^$*+?()\[\]{}\\|])', '\\\1', 'g'))
    into mots
    from regexp_split_to_table(lower(unaccent(trim(coalesce(q, '')))), '\s+') as m
   where m <> '';

  if mots is null then
    return;
  end if;

  return query
    select p.*
      from products p
     where (
       select bool_and(
                lower(unaccent(
                  coalesce(p.name_fr, '') || ' ' || p.name || ' ' || coalesce(p.substances, '')
                )) ~ ('\m' || m)
              )
         from unnest(mots) as m
     )
     order by
       -- Le nom qui COMMENCE par le premier mot tapé d'abord : qui tape
       -- « ib » pense « Ibuprofen », pas « Zentel (mébendazole + ib…) ».
       lower(unaccent(coalesce(p.name_fr, p.name))) ~ ('^' || mots[1]) desc,
       p.delisted,
       coalesce(p.name_fr, p.name)
     limit 8;
end $$;
