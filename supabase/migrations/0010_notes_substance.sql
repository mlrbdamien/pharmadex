-- ============================================================================
-- Pharmadex — troisième portée de note : le principe actif
--
-- Une note porte désormais sur UN produit, UN code ATC (le plus précis,
-- choisi à la création) ou UN principe actif — exactement l'un des trois.
-- La note « substance » s'affiche sur tout produit dont le champ substances
-- contient le principe (l'appariement se fait côté application, le champ
-- étant du texte libre Swissmedic).
-- ============================================================================

alter table public.product_notes
  add column if not exists substance text
    check (substance = lower(trim(substance)));

alter table public.product_notes drop constraint note_cible_exclusive;
alter table public.product_notes add constraint note_cible_exclusive check (
  (authorization_nr is not null)::int
  + (atc_prefix is not null)::int
  + (substance is not null)::int = 1
);

create index if not exists product_notes_substance_idx
  on public.product_notes (substance) where substance is not null;
