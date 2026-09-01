-- ============================================================================
-- Pharmadex — lier une fiche du Sémaphore à un médicament, à la main
--
-- Une fiche remonte déjà automatiquement sur les produits dont le code ATC
-- commence par l'un de ses préfixes. C'est large et sans entretien, mais ça
-- ne couvre pas les cas d'espèce : une fiche « toux » qu'on veut voir sur un
-- sirop précis, un produit hors classe, un rattachement que l'ATC ne dit pas.
--
-- Même dualité que pour les ressources : `atc_resources` (large, par classe)
-- et `product_resources` (fin, par produit). Ici, l'ATC de la fiche joue le
-- rôle du premier, cette table celui du second.
-- ============================================================================

create table public.product_fiches (
  authorization_nr text not null references public.products on delete cascade,
  fiche_id         text not null references public.fiches   on delete cascade,
  created_at       timestamptz not null default now(),
  primary key (authorization_nr, fiche_id)
);

create index product_fiches_fiche_idx on public.product_fiches (fiche_id);

alter table public.product_fiches enable row level security;

create policy "product_fiches_select_allowed" on public.product_fiches
  for select to authenticated using (public.is_allowed());
create policy "product_fiches_insert_editor" on public.product_fiches
  for insert to authenticated with check (public.can_edit());
create policy "product_fiches_delete_editor" on public.product_fiches
  for delete to authenticated using (public.can_edit());

grant select, insert, delete on public.product_fiches to authenticated;
