/**
 * Références externes du comptoir, en accès rapide dans le rail.
 *
 * De simples liens, à UN seul endroit — les intégrations contextuelles par
 * substance ont été essayées puis retirées : la francisation des noms latins
 * était trop approximative pour qu'un bouton tienne sa promesse.
 * URLs vérifiées le 27.08.2026.
 */

import { Baby, Blocks, Bug, Mail, type LucideIcon } from 'lucide-react';

export type ReferenceExterne = {
  label: string;
  url: string;
  icone: LucideIcon;
  /** Ce qu'on y trouve — affiché en infobulle. */
  titre: string;
};

export const LIENS_REFERENCES: ReferenceExterne[] = [
  {
    label: 'Guidelines SSI',
    url: 'https://ssi.guidelines.ch',
    icone: Bug,
    titre: 'Société Suisse d’Infectiologie — thérapie antimicrobienne',
  },
  {
    label: 'Le CRAT',
    url: 'https://www.lecrat.fr',
    icone: Baby,
    titre: 'Médicaments et grossesse / allaitement',
  },
  {
    label: 'iMail Offizin',
    url: 'https://imail-offizin.ch',
    icone: Mail,
    titre: 'Réponses documentées aux questions du comptoir',
  },
  {
    label: 'SwissPedDose',
    url: 'https://db.swisspeddose.ch',
    icone: Blocks,
    titre: 'Doses pédiatriques harmonisées (login requis)',
  },
];
