-- ============================================================================
-- Pharmadex — l'aide-mémoire de comptoir passe en base
--
-- Les 36 fiches venues de comptoir-otc étaient statiques, compilées dans
-- l'application. Décision de Damien : les rendre modifiables depuis
-- l'interface, ET permettre des amendements datés. Les deux, parce qu'ils ne
-- répondent pas à la même question — l'un corrige le texte de référence,
-- l'autre y ajoute une remarque signée sans le réécrire.
--
-- Écriture réservée aux éditeurs : les règles de sourcing (aucun contenu de
-- mémoire, tout vérifié en ligne et daté, marqueur « non vérifié ») ne sont
-- plus tenues par un commit git, elles reposent désormais sur la discipline
-- de qui édite. `updated_by` et `verifie_le` sont là pour que la question
-- « qui a écrit ça, et quand l'a-t-on vérifié » ait toujours une réponse.
-- ============================================================================

create table public.fiches (
  id        text primary key,
  code      text not null,
  groupe    text not null,
  titre     text not null,
  sous      text not null default '',
  volet     text not null check (volet in ('otc', 'rx', 'lpd')),
  -- Bandeau de catégorie de remise, quand la fiche cite un produit de liste B.
  remise    text,
  -- Préfixes ATC couverts : un produit dont le code commence par l'un d'eux
  -- fait remonter la fiche. Même convention que atc_resources.
  atc       text[] not null default '{}',
  -- Les sections, dans leur ordre d'affichage. Le modèle (p, ul, ol, table,
  -- check, triage, stop, warn) vit dans src/data/fiches/types.ts — le valider
  -- en SQL fossiliserait un schéma qui bouge encore.
  sections  jsonb not null default '[]'::jsonb,
  rang      integer not null default 0,
  -- Date de dernière vérification des sources, saisie par l'éditeur : elle ne
  -- suit PAS updated_at, une correction de coquille ne revérifie rien.
  verifie_le date not null default current_date,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index fiches_volet_idx on public.fiches (volet, rang);

alter table public.fiches enable row level security;

create policy "fiches_select_allowed" on public.fiches
  for select to authenticated using (public.is_allowed());
create policy "fiches_insert_editor" on public.fiches
  for insert to authenticated with check (public.can_edit());
create policy "fiches_update_editor" on public.fiches
  for update to authenticated using (public.can_edit()) with check (public.can_edit());
create policy "fiches_delete_editor" on public.fiches
  for delete to authenticated using (public.can_edit());

grant select, insert, update, delete on public.fiches to authenticated;

-- ---------------------------------------------------------------------------
-- Amendements : une note peut porter sur une fiche
--
-- Quatrième portée, exclusive comme les trois autres. Un amendement ne
-- réécrit rien — il s'affiche en tête de la fiche, daté et signé. C'est le
-- fonctionnement d'un errata : on n'efface pas, on ajoute.
-- ---------------------------------------------------------------------------

alter table public.product_notes
  add column if not exists fiche_id text references public.fiches on delete cascade;

alter table public.product_notes drop constraint note_cible_exclusive;
alter table public.product_notes add constraint note_cible_exclusive check (
  (authorization_nr is not null)::int
  + (atc_prefix is not null)::int
  + (substance is not null)::int
  + (fiche_id is not null)::int = 1
);

create index if not exists product_notes_fiche_idx
  on public.product_notes (fiche_id) where fiche_id is not null;
