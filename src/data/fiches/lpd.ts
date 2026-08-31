import type { Section } from './types';

/* Fichier généré depuis comptoir-otc.html — sections du volet lpd.
   Contenu rédigé une fiche à la fois, sources vérifiées en session, validé
   par Damien. Éditions ciblées uniquement : ne jamais régénérer en masse. */

export const SECTIONS_LPD: Record<string, Section[]> = {
 "t6": [
  {
   "t": "Lire cette fiche",
   "open": true,
   "p": [
    "Tout ce que voit le comptoir — ordonnances, historiques, consignations — renseigne sur la santé : ce sont des <b>données sensibles</b> au sens de la LPD (art. 5 let. c ch. 2). Cette fiche donne les réflexes de comptoir et les obligations de l'officine ; elle vaut pour les deux autres volets, OTC compris — consigner une remise B (fiche T1), c'est déjà traiter des données sensibles.",
    "Elle ne remplace ni le préposé fédéral (PFPDT) ni un conseil juridique : un litige ou un cas limite sort du comptoir. Et la numérotation saute : T5 (remboursement) reste à venir, ce volet a été traité en priorité."
   ]
  },
  {
   "t": "Deux régimes qui se cumulent",
   "open": true,
   "p": [
    "Le secret professionnel préexiste à la LPD et s'y ajoute. La révélation n'est licite qu'avec le consentement de l'intéressé ou l'autorisation écrite de l'autorité (art. 321 ch. 2 CP), sous réserve des droits et obligations légales d'aviser une autorité (ch. 3) — le lien avec les annonces obligatoires de la fiche T4."
   ],
   "table": {
    "head": [
     "Régime",
     "Qui est tenu",
     "Sanction"
    ],
    "rows": [
     [
      "Secret professionnel — art. 321 CP",
      "Les <b>pharmaciens et leurs auxiliaires</b>, nommément cités ; les étudiants ; et encore après la fin de l'activité",
      "Sur plainte : peine privative de liberté jusqu'à <span class='dose'>3 ans</span> ou peine pécuniaire"
     ],
     [
      "Devoir de discrétion — art. 62 LPD",
      "Quiconque exerce une profession qui requiert la connaissance de données secrètes — <b>y compris qui travaille pour le soumis au secret ou se forme chez lui</b>",
      "Sur plainte : amende jusqu'à <span class='dose'>250 000 CHF</span>"
     ]
    ]
   },
   "warn": [
    "Les sanctions LPD visent la <b>personne physique</b> fautive, pas l'entreprise (art. 60–62 ; FMH/ASSM 7.2) : chaque membre de l'équipe est exposé personnellement, l'apprenti compris."
   ]
  },
  {
   "t": "Les principes, en une main",
   "open": true,
   "ol": [
    "<b>Licéité, bonne foi, proportionnalité</b> : ne collecter que ce qui sert une finalité déterminée et reconnaissable pour le patient (LPD art. 6 al. 1–3)",
    "<b>Exactitude</b> : rectifier, effacer ou détruire les données inexactes (al. 5)",
    "<b>Destruction ou anonymisation</b> dès que les données ne sont plus nécessaires — sous réserve des conservations légales, comme les dix ans de l'OCStup (al. 4 ; fiche T4)",
    "<b>Consentement</b>, quand il est requis : libre, après information — et <b>exprès</b> pour des données sensibles (al. 6–7)",
    "<b>Communiquer des données sensibles à des tiers est une atteinte à la personnalité</b> (art. 30 al. 2 let. c), licite seulement si le consentement, un intérêt privé ou public prépondérant, ou la loi la justifie (art. 31 al. 1) — la règle qui gouverne tout le comptoir"
   ]
  },
  {
   "t": "Au comptoir — les réflexes",
   "open": true,
   "p": [
    "Applications concrètes des art. 6, 8 et 30 ; les formulations sont des conventions de l'outil."
   ],
   "ul": [
    "Ce qui se dit au comptoir s'entend dans la file : baisser la voix dès que le sujet est sensible, proposer l'entretien à l'écart — l'espace de confidentialité ne sert pas qu'aux prestations.",
    "Écrans, ordonnances et paniers préparés hors de la vue des autres clients : c'est une mesure organisationnelle de sécurité (art. 8), pas de la politesse.",
    "Téléphone et répondeur : rappeler sans nommer le traitement ni le diagnostic tant que l'identité de l'interlocuteur n'est pas établie.",
    "Un proche vient chercher le traitement : la <b>remise</b> obéit aux règles pharmaceutiques (fiches T1 et T4) — mais <b>confirmer ou commenter</b> le traitement d'un patient à un tiers est une communication de données sensibles : l'accord du patient d'abord (art. 30–31).",
    "La discrétion se forme : chacun est tenu personnellement (section précédente), et la formation de l'équipe compte parmi les mesures de sécurité (FMH)."
   ],
   "stop": {
    "t": "Ne pas transmettre",
    "ul": [
     "À la police ou à une autorité <b>sans base écrite</b> : le secret tient, sauf levée par l'autorité (art. 321 ch. 2 CP) ou obligation légale d'aviser (ch. 3) — dans le doute, différer et demander la base légale par écrit",
     "À l'employeur d'un patient : jamais sans consentement exprès",
     "À un assureur, au-delà de ce que la facturation exige légalement — l'étendue exacte due aux assureurs viendra en fiche T5",
     "À la famille ou aux proches sans l'accord du patient — même « pour aider »"
    ]
   }
  },
  {
   "t": "Les obligations de l'officine",
   "open": true,
   "table": {
    "head": [
     "Obligation",
     "À l'officine, concrètement",
     "Base"
    ],
    "rows": [
     [
      "Informer",
      "Déclaration de protection des données accessible (comptoir, site) : identité du responsable, finalités, destinataires",
      "LPD art. 19"
     ],
     [
      "Sécuriser",
      "Mesures proportionnées au risque : accès restreints au logiciel, armoires fermées, messagerie chiffrée (HIN), sauvegardes, formation de l'équipe",
      "LPD art. 8 · OPDo · exemples FMH"
     ],
     [
      "Encadrer les sous-traitants",
      "Logiciel d'officine, hébergeur, centre de décompte : contrat, garanties de sécurité vérifiées, pas de sous-sous-traitance sans accord préalable",
      "LPD art. 9"
     ],
     [
      "Surveiller l'étranger",
      "Un cloud dont le prestataire étranger peut lire les données en clair = communication à l'étranger : pays reconnu adéquat (annexe 1 OPDo) ou garanties — sinon y renoncer",
      "LPD art. 16 ss · FMH"
     ],
     [
      "Tenir le registre des traitements",
      "Exemption sous 250 collaborateurs <b>sauf</b> données sensibles « à grande échelle » ; la FMH recommande aux cabinets de tenir malgré tout le registre des traitements sensibles (dossiers, facturation) — transposable à l'officine",
      "LPD art. 12 · OPDo art. 24 · FMH 03/2023"
     ],
     [
      "Analyser l'impact (AIPD)",
      "Avant tout traitement à risque élevé — typiquement un nouveau cloud ou de l'IA sur les données patients ; dispense si obligation légale ou produit certifié",
      "LPD art. 22"
     ],
     [
      "Annoncer les violations",
      "Au PFPDT « dans les meilleurs délais » si risque élevé (portail Data Breach) ; informer le patient si nécessaire. Cas d'officine : vol d'ordinateur, clé USB perdue, envoi au mauvais destinataire",
      "LPD art. 24 · FMH"
     ],
     [
      "Répondre au droit d'accès",
      "Gratuit, sous <span class='dose'>30 jours</span> ; les données de santé peuvent être remises par l'intermédiaire d'un professionnel de santé que le patient désigne",
      "LPD art. 25 (al. 3) · FMH"
     ]
    ]
   },
   "warn": [
    "« À grande échelle » n'est tranché nulle part pour une pharmacie isolée : <span class='nv'>non vérifié</span> — aucune position suisse publique trouvée cette session. La ligne prudente et peu coûteuse est celle de la FMH : tenir le registre des traitements sensibles sans se demander si on y est obligé."
   ]
  },
  {
   "t": "Croisements",
   "ul": [
    "Fiche T1 — la consignation d'une remise B (art. 48 OMéd) est une <b>obligation légale</b> : collecte licite sans consentement, mais même devoir de discrétion sur son contenu.",
    "Fiche T4 — transmission des ordonnances par voie sécurisée, interdiction d'envoi électronique au patient, conservation de dix ans des documents stupéfiants : de la protection des données avant la lettre.",
    "Fiches de classe à venir — chaque « note au dossier » d'un V3 crée une donnée sensible de plus, soumise aux mêmes règles."
   ]
  },
  {
   "t": "Sources",
   "table": {
    "head": [
     "Organisme",
     "Publication",
     "Consulté le"
    ],
    "rows": [
     [
      "Fedlex",
      "LPD, RS 235.1, état au 07.07.2025 — art. 5, 6, 8, 9, 12, 19, 22, 24, 25, 30, 31, 60–62",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "OPDo, RS 235.11, état au 01.12.2025 — art. 24 (exception au registre)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "Code pénal, RS 311.0, état au 12.06.2026 — art. 321 (secret professionnel : pharmaciens et auxiliaires)",
      "30.08.2026"
     ],
     [
      "FMH",
      "« Guide pour le registre des activités de traitement », version 03/2023 — recommandation de tenir le registre des traitements sensibles, colonnes du registre, cloud et communication à l'étranger",
      "30.08.2026"
     ],
     [
      "FMH / ASSM",
      "Guide pratique « Bases juridiques pour le quotidien médical », chap. 7.2 « Protection des données dans les cabinets médicaux », MAJ 22.06.2026 — AIPD, annonces de violations, droit d'accès sous 30 jours, exemples de mesures",
      "30.08.2026"
     ],
     [
      "Note de transposition",
      "Les guides FMH visent les cabinets médicaux : leurs recommandations sont transposées à l'officine en le signalant — aucun équivalent pharmaSuisse en accès public trouvé",
      "30.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "pharmaSuisse : pas de guide nLPD officine ouvert (déclaration du site seulement) · PFPDT : référencé via la FMH, pages propres non dépouillées cette session",
      "30.08.2026"
     ]
    ]
   }
  }
 ]
};
