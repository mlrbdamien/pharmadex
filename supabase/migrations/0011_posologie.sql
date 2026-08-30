-- ============================================================================
-- Pharmadex — posologies maison
--
-- Une posologie personnalisée porte exactement le même cycle de vie qu'une
-- note : auteur, date, fraîcheur, portée (produit / classe ATC / principe
-- actif). On l'ajoute donc au vocabulaire des types plutôt que de dupliquer
-- toute la mécanique — l'affichage, lui, la distingue nettement (bloc propre
-- en tête de fiche, bouton de copie).
-- ============================================================================

alter table public.product_notes drop constraint product_notes_note_type_check;

alter table public.product_notes add constraint product_notes_note_type_check
  check (note_type in
    ('posologie', 'conseil', 'conservation', 'substitution',
     'disponibilite', 'remboursement', 'preparation'));
