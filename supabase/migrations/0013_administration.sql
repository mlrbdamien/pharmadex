-- ============================================================================
-- Pharmadex — administration
--
-- Trois manques que l'application ne savait pas combler :
--   1. Les accès se modifiaient au dashboard Supabase (aucune policy
--      d'écriture sur allowed_emails). Ajouter une collègue supposait un
--      compte Supabase — c'est-à-dire, en pratique, attendre Damien.
--   2. Rien ne disait qui avait modifié quoi. `updated_by` donne le dernier
--      auteur, jamais l'histoire.
--   3. Aucune vue d'ensemble de la fraîcheur des données.
--
-- Le droit d'administrer est SÉPARÉ du droit d'éditer : rédiger une fiche et
-- donner un accès ne sont pas le même acte. Un éditeur de plus est une
-- décision de contenu ; un administrateur de plus est une décision de
-- sécurité.
-- ============================================================================

alter table public.allowed_emails
  add column if not exists is_admin boolean not null default false;

-- Amorçage : les éditeurs actuels deviennent administrateurs — sans quoi
-- personne ne pourrait ouvrir le panneau qui sert à nommer les
-- administrateurs. À restreindre depuis le panneau dès la première visite.
update public.allowed_emails set is_admin = true where can_edit;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (
         select 1 from allowed_emails
          where email = public.current_email() and is_admin
       ) $$;

grant execute on function public.is_admin() to authenticated;

-- Un administrateur voit et modifie toute la table ; les autres continuent de
-- ne voir que leur propre ligne (l'application en tire can_edit).
create policy "allowed_emails_select_admin" on public.allowed_emails
  for select to authenticated using (public.is_admin());
create policy "allowed_emails_insert_admin" on public.allowed_emails
  for insert to authenticated with check (public.is_admin());
create policy "allowed_emails_update_admin" on public.allowed_emails
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "allowed_emails_delete_admin" on public.allowed_emails
  for delete to authenticated using (public.is_admin());

grant select, insert, update, delete on public.allowed_emails to authenticated;

-- ---------------------------------------------------------------------------
-- Journal d'activité
--
-- Ce que le dépôt git assurait pour les fiches avant qu'elles passent en base :
-- savoir qui a écrit quoi, et quand. Écrit par des triggers plutôt que par
-- l'application — une écriture qui contourne l'interface (script, SQL editor)
-- doit laisser la même trace.
-- ---------------------------------------------------------------------------

create table public.journal (
  id      bigint generated always as identity primary key,
  cible   text not null check (cible in ('fiche', 'note', 'ressource', 'acces')),
  cible_id text,
  action  text not null check (action in ('creation', 'modification', 'suppression')),
  -- De quoi relire la ligne sans aller chercher l'objet, qui peut être supprimé.
  resume  text,
  acteur  text,
  at      timestamptz not null default now()
);

create index journal_at_idx on public.journal (at desc);
create index journal_cible_idx on public.journal (cible, cible_id);

alter table public.journal enable row level security;

-- Lecture réservée aux administrateurs : c'est le seul contenu de Pharmadex
-- qui parle des personnes plutôt que des médicaments.
create policy "journal_select_admin" on public.journal
  for select to authenticated using (public.is_admin());

grant select on public.journal to authenticated;

/**
 * Consigne une écriture. SECURITY DEFINER : le journal n'accepte aucune
 * écriture directe (pas de policy insert), seulement celles des triggers —
 * une ligne de journal ne doit pas pouvoir être fabriquée.
 *
 * TG_ARGV[0] = la cible, [1] = la colonne servant de résumé, [2] = la clé
 * (toutes les tables n'ont pas de colonne `id` : allowed_emails a `email`).
 */
create or replace function public.consigner() returns trigger
  language plpgsql security definer set search_path = public
as $$
declare
  ligne    jsonb;
  acte     text;
  resume   text;
  identite text;
begin
  if tg_op = 'DELETE' then
    ligne := to_jsonb(old);
    acte := 'suppression';
  else
    ligne := to_jsonb(new);
    acte := case tg_op when 'INSERT' then 'creation' else 'modification' end;
  end if;

  resume := ligne ->> tg_argv[1];
  identite := ligne ->> tg_argv[2];

  insert into public.journal (cible, cible_id, action, resume, acteur)
  values (tg_argv[0], identite, acte, left(coalesce(resume, ''), 200),
          public.current_email());

  return case tg_op when 'DELETE' then old else new end;
end;
$$;

create trigger fiches_journal
  after insert or update or delete on public.fiches
  for each row execute function public.consigner('fiche', 'titre', 'id');

create trigger notes_journal
  after insert or update or delete on public.product_notes
  for each row execute function public.consigner('note', 'body', 'id');

create trigger resources_journal
  after insert or update or delete on public.resources
  for each row execute function public.consigner('ressource', 'title', 'id');

create trigger acces_journal
  after insert or update or delete on public.allowed_emails
  for each row execute function public.consigner('acces', 'email', 'email');
