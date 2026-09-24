-- ============================================================================
-- Pharmadex — le dosage devient un niveau à part entière
--
-- Swissmedic a trois niveaux : l'AUTORISATION (un numéro, une notice, un code
-- ATC), le DOSAGE (« Dosisstärke ») et l'EMBALLAGE (un GTIN). L'import les
-- écrasait au niveau de l'autorisation et gardait le nom le plus court :
--   - 2 148 autorisations sur 6 309 ont plusieurs dosages ;
--   - 3 990 dosages (38 %) étaient introuvables — « dafalgan 300 » ne
--     trouvait rien, seul le suppositoire à 80 mg existait ;
--   - un scan de Dafalgan 300 ouvrait une fiche intitulée « … 80 mg » ;
--   - la catégorie de remise varie selon le dosage pour 19 autorisations
--     (Perenterol 250 en D, 500 en B) : le badge pouvait être faux.
--
-- Ce qui RESTE au niveau de l'autorisation, parce que c'est juste : le code
-- ATC (il ne varie jamais entre dosages — vérifié, 0 cas sur 2 148), la
-- notice AIPS, les ressources et fiches du Sémaphore liées.
--
-- `products`, `dosages` et `packages` sont remplies par l'import seul
-- (service_role) : aucune policy d'écriture, comme en 0003.
-- ============================================================================

create table public.dosages (
  authorization_nr text not null references public.products on delete cascade,
  -- Le « Dosisstärke-nummer » officiel : 1, 2, 3… sous une autorisation.
  dosage_nr   text not null check (dosage_nr ~ '^[0-9]{1,3}$'),
  -- Nom Swissmedic (traduit par table quand il était en allemand) et
  -- dénomination française officielle quand Refdata ou l'OFSP en fournit une.
  name        text not null,
  name_fr     text,
  fr_source   text check (fr_source in ('refdata', 'sl', 'table')),
  -- Ce qui distingue ce dosage de ses voisins : « 300 mg ». Puce du catalogue.
  label       text,
  -- Les principes actifs peuvent différer d'un dosage à l'autre (36 cas).
  substances  text,
  -- Catégorie de remise DU DOSAGE — Swissmedic écrit « B/D » quand ses
  -- emballages diffèrent. Chaque niveau porte la sienne, lue telle quelle.
  category    text,
  delisted    boolean not null default false,
  imported_at timestamptz not null default now(),
  primary key (authorization_nr, dosage_nr)
);

alter table public.dosages enable row level security;
create policy "dosages_select_allowed" on public.dosages
  for select to authenticated using (public.is_allowed());
grant select on public.dosages to authenticated;

-- Le catalogue filtre les AUTORISATIONS, mais on y tape un dosage
-- (« dafalgan 80 ») : leurs noms réunis ici, remplis par l'import, pour que
-- le filtre les voie sans jointure.
alter table public.products
  add column if not exists noms_dosages text;

-- ---------------------------------------------------------------------------
-- Emballages : leur dosage, et leur propre catégorie de remise (elle varie
-- d'un emballage à l'autre pour 39 dosages — Fluimucil 200 existe en D et B).
-- Nullable le temps du premier import qui suit cette migration.
-- ---------------------------------------------------------------------------

alter table public.packages
  add column if not exists dosage_nr text,
  add column if not exists category  text;

alter table public.packages
  add constraint packages_dosage_fk
  foreign key (authorization_nr, dosage_nr)
  references public.dosages (authorization_nr, dosage_nr) on delete cascade;

create index packages_dosage_idx on public.packages (authorization_nr, dosage_nr);

-- ---------------------------------------------------------------------------
-- Notes : une note peut cibler un dosage précis. La posologie maison du
-- Dafalgan 80 mg n'est pas celle du 600 mg.
--
-- Une note « dosage » EST une note produit, précisée : elle garde son
-- authorization_nr et y ajoute dosage_nr. La contrainte d'exclusivité à
-- quatre portées (0012) n'a donc pas à changer.
-- ---------------------------------------------------------------------------

alter table public.product_notes
  add column if not exists dosage_nr text;

alter table public.product_notes
  add constraint note_dosage_precise_un_produit
  check (dosage_nr is null or authorization_nr is not null);

alter table public.product_notes
  add constraint product_notes_dosage_fk
  foreign key (authorization_nr, dosage_nr)
  references public.dosages (authorization_nr, dosage_nr) on delete cascade;

-- La portée d'une note ne se modifie JAMAIS. L'éditeur la renvoyait à chaque
-- modification, et une note de classe ATC modifiée depuis une fiche devenait
-- une note sur ce seul produit — disparue de tous les autres, sans un mot.
-- L'application ne l'envoie plus ; la base le refuse désormais, quel que
-- soit le client (un onglet resté sur l'ancienne version, un script).
create or replace function public.portee_immuable() returns trigger
  language plpgsql
as $$
begin
  if new.authorization_nr is distinct from old.authorization_nr
     or new.dosage_nr     is distinct from old.dosage_nr
     or new.atc_prefix    is distinct from old.atc_prefix
     or new.substance     is distinct from old.substance
     or new.fiche_id      is distinct from old.fiche_id then
    raise exception 'La portée d''une note ne se modifie pas : supprimer la note et en créer une nouvelle.';
  end if;
  return new;
end $$;

create trigger product_notes_portee_immuable
  before update on public.product_notes
  for each row execute function public.portee_immuable();

-- ---------------------------------------------------------------------------
-- Recherche : une ligne PAR DOSAGE. « dafalgan 300 » doit trouver le
-- suppositoire à 300 mg, sous son propre nom.
--
-- Mêmes règles que search_products (0008) : chaque mot tapé doit commencer
-- un mot du texte, accents ignorés, ordre des mots libre. Le texte cherché
-- réunit les noms du dosage ET de l'autorisation, et les principes actifs.
--
-- search_products reste en place : l'application déployée s'en sert tant que
-- la nouvelle version n'est pas en ligne. À retirer dans une migration
-- ultérieure, une fois le déploiement fait.
-- ---------------------------------------------------------------------------

create or replace function public.search_dosages(q text)
  returns table (
    authorization_nr text,
    dosage_nr        text,
    name             text,
    product_name     text,
    label            text,
    atc_code         text,
    substances       text,
    category         text,
    delisted         boolean
  )
  language plpgsql stable security invoker
  set search_path = public, extensions
as $$
declare
  mots text[];
begin
  select array_agg(regexp_replace(m, '([.^$*+?()\[\]{}\\|])', '\\\1', 'g'))
    into mots
    from regexp_split_to_table(lower(unaccent(trim(coalesce(q, '')))), '\s+') as m
   where m <> '';

  if mots is null then
    return;
  end if;

  return query
    with lignes as (
      select d.authorization_nr                    as aut,
             d.dosage_nr                           as dos,
             coalesce(d.name_fr, d.name)           as nom,
             coalesce(p.name_fr, p.name)           as nom_produit,
             d.label                               as puce,
             p.atc_code                            as atc,
             coalesce(d.substances, p.substances)  as subst,
             d.category                            as cat,
             (d.delisted or p.delisted)            as retire,
             d.dosage_nr::int                      as rang,
             lower(unaccent(
               coalesce(d.name_fr, '') || ' ' || d.name || ' ' ||
               coalesce(p.name_fr, '') || ' ' || p.name || ' ' ||
               coalesce(d.substances, '')
             ))                                    as meule
        from dosages d
        join products p on p.authorization_nr = d.authorization_nr
      union all
      -- Une autorisation SANS AUCUN dosage : retirée du marché avant 0015,
      -- elle n'en recevra jamais (l'import ne crée que ceux de la liste du
      -- mois). Des boîtes circulent encore — elle doit rester trouvable,
      -- comme search_products la trouvait.
      select p.authorization_nr, null::text,
             coalesce(p.name_fr, p.name), coalesce(p.name_fr, p.name),
             null::text, p.atc_code, p.substances, p.category, p.delisted, 0,
             lower(unaccent(
               coalesce(p.name_fr, '') || ' ' || p.name || ' ' || coalesce(p.substances, '')
             ))
        from products p
       where not exists (select 1 from dosages x where x.authorization_nr = p.authorization_nr)
    )
    select l.aut, l.dos, l.nom, l.nom_produit, l.puce, l.atc, l.subst, l.cat, l.retire
      from lignes l
     where (select bool_and(l.meule ~ ('\m' || m)) from unnest(mots) as m)
     order by
       -- Le nom qui COMMENCE par le premier mot tapé d'abord.
       lower(unaccent(l.nom)) ~ ('^' || mots[1]) desc,
       l.retire,
       -- Les dosages d'un même médicament restent groupés, dans l'ordre
       -- officiel : 80, 150, 300, 600 mg — pas l'ordre alphabétique, qui
       -- placerait 150 avant 80.
       l.nom_produit,
       l.rang
     limit 24;
end $$;

grant execute on function public.search_dosages(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Fiche produit : l'autorisation, ses ressources, et désormais ses dosages.
-- ---------------------------------------------------------------------------

create or replace function public.product_hit(auth text)
  returns json
  language plpgsql stable security invoker
  set search_path = public
as $$
declare
  hit record;
  res json;
  dos json;
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

  select coalesce(json_agg(json_build_object(
           'dosage_nr',  d.dosage_nr,
           'name',       coalesce(d.name_fr, d.name),
           'label',      d.label,
           'category',   d.category,
           'substances', d.substances,
           'delisted',   d.delisted
         ) order by d.dosage_nr::int), '[]'::json)
    into dos
    from dosages d
   where d.authorization_nr = hit.authorization_nr;

  return json_build_object(
    'product', json_build_object(
      'authorization_nr', hit.authorization_nr,
      'name',             hit.name,
      'company',          hit.company,
      'atc_code',         hit.atc_code,
      'substances',       hit.substances,
      'category',         hit.category,
      'package_description', null,
      'dosage_nr',        null
    ),
    'dosages',   dos,
    'resources', res
  );
end $$;

-- ---------------------------------------------------------------------------
-- Scan : le GTIN désigne un emballage, donc un dosage. La réponse le porte,
-- pour que la fiche s'ouvre sur le bon — et non sur le premier venu.
-- ---------------------------------------------------------------------------

create or replace function public.scan_gtin(code text)
  returns json
  language plpgsql stable security invoker
  set search_path = public
as $$
declare
  norm text := regexp_replace(coalesce(code, ''), '[^0-9]', '', 'g');
  pkg  record;
  hit  jsonb;
begin
  if length(norm) = 14 and left(norm, 1) = '0' then
    norm := substr(norm, 2);
  end if;

  if norm ~ '^[0-9]{13}$' then
    select k.authorization_nr, k.dosage_nr, k.description, k.description_fr
      into pkg from packages k where k.gtin = norm;
  elsif norm ~ '^[0-9]{6,9}$' then
    select k.authorization_nr, k.dosage_nr, k.description, k.description_fr
      into pkg from packages k where k.pharmacode = ltrim(norm, '0');
  else
    return null;
  end if;

  if not found then
    return null;
  end if;

  hit := public.product_hit(pkg.authorization_nr)::jsonb;
  hit := jsonb_set(hit, '{product,package_description}',
                   coalesce(to_jsonb(coalesce(pkg.description_fr, pkg.description)), 'null'::jsonb));
  hit := jsonb_set(hit, '{product,dosage_nr}',
                   coalesce(to_jsonb(pkg.dosage_nr), 'null'::jsonb));
  return hit::json;
end $$;

-- ---------------------------------------------------------------------------
-- Journal des recherches vides : un code scanné se nomme par SON dosage.
-- Même signature qu'en 0005 — create or replace suffit.
-- ---------------------------------------------------------------------------

create or replace function public.resolve_codes(codes text[])
  returns table (code text, name text, authorization_nr text)
  language sql stable security invoker
  set search_path = public
as $$
  select c.code,
         coalesce(d.name_fr, d.name, p.name_fr, p.name),
         p.authorization_nr
    from unnest(codes) as c(code)
    join packages k
      on k.gtin = case
                    when length(c.code) = 14 and left(c.code, 1) = '0'
                    then substr(c.code, 2)
                    else c.code
                  end
    join products p on p.authorization_nr = k.authorization_nr
    left join dosages d
      on d.authorization_nr = k.authorization_nr and d.dosage_nr = k.dosage_nr;
$$;

-- Fiche ressource : les produits liés sous leur dénomination française.
create or replace function public.resource_links(rid uuid)
  returns json
  language sql stable security invoker
  set search_path = public
as $$
  select json_build_object(
    'products', coalesce((
      select json_agg(json_build_object(
               'authorization_nr', p.authorization_nr,
               'name', coalesce(p.name_fr, p.name))
             order by coalesce(p.name_fr, p.name))
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
