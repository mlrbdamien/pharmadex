-- ============================================================================
-- Pharmadex — notes maison sur les médicaments
--
-- Une note porte sur UN produit ou sur UNE classe ATC (exclusif), avec un
-- type OBLIGATOIRE tiré d'un vocabulaire médicament : le typage cadre
-- l'usage — l'invariant « aucune donnée patient » du projet tient aussi par
-- ce design, pas seulement par la consigne.
--
-- Auteur et dates visibles ; écriture réservée aux éditeurs ; fraîcheur
-- surveillée comme les ressources (verified_on).
-- ============================================================================

create table public.product_notes (
  id               uuid primary key default gen_random_uuid(),
  -- Cible : produit OU classe, jamais les deux, jamais aucun.
  authorization_nr text references public.products on delete cascade,
  atc_prefix       text check (atc_prefix ~ '^[A-Z][0-9A-Z]{0,6}$'),
  note_type        text not null check (note_type in
    ('conseil', 'conservation', 'substitution', 'disponibilite',
     'remboursement', 'preparation')),
  body             text not null check (length(trim(body)) between 1 and 1000),
  verified_on      date not null default current_date,
  created_by       text not null default public.current_email(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint note_cible_exclusive check (
    (authorization_nr is not null) <> (atc_prefix is not null)
  )
);

create index product_notes_auth_idx   on public.product_notes (authorization_nr);
create index product_notes_prefix_idx on public.product_notes (atc_prefix);

create trigger product_notes_touch
  before update on public.product_notes
  for each row execute function public.touch_updated_at();

alter table public.product_notes enable row level security;

create policy "notes_select_allowed" on public.product_notes
  for select to authenticated using (public.is_allowed());
create policy "notes_insert_editor" on public.product_notes
  for insert to authenticated with check (public.can_edit());
create policy "notes_update_editor" on public.product_notes
  for update to authenticated using (public.can_edit()) with check (public.can_edit());
create policy "notes_delete_editor" on public.product_notes
  for delete to authenticated using (public.can_edit());

grant select, insert, update, delete on public.product_notes to authenticated;
