import type { Section } from './types';

/* Fichier généré depuis comptoir-otc.html — sections du volet rx.
   Contenu rédigé une fiche à la fois, sources vérifiées en session, validé
   par Damien. Éditions ciblées uniquement : ne jamais régénérer en masse. */

export const SECTIONS_RX: Record<string, Section[]> = {
 "t3": [
  {
   "t": "Lire cette fiche",
   "open": true,
   "p": [
    "Première fiche du volet <b>ordonnances</b> : elle pose la démarche de validation commune à toutes les classes, avant les fiches par classe thérapeutique. Le cadre légal détaillé (stupéfiants, renouvellement, substitution, ordonnances étrangères) viendra en fiche T4, le remboursement en fiche T5 — toutes deux à venir.",
    "Les fiches de ce volet sont des <b>grilles de lecture</b> : quoi vérifier pour telle classe, quoi dire au patient, quand rappeler le prescripteur."
   ],
   "warn": [
    "Aucune fiche de ce volet ne liste exhaustivement les interactions, les doublons ni les posologies. Cette vérification-là appartient au <b>logiciel d'officine</b>, qui a les bases à jour et le dossier complet du patient — les fiches le complètent, elles ne le remplacent jamais."
   ]
  },
  {
   "t": "L'échelle V1–V4",
   "open": true,
   "p": [
    "L'échelle N1–N4 du volet OTC oriente un <b>patient</b> ; l'échelle V1–V4 décide du sort d'une <b>ordonnance</b>. Une fiche porte une seule des deux séries, jamais les deux."
   ],
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant, avant que le patient quitte l'officine",
     "items": [
      "Erreur manifeste qui mettrait le patient en danger : dose sans rapport avec aucune posologie de l'information professionnelle, contre-indication absolue documentée au dossier",
      "Doute sérieux sur l'authenticité de l'ordonnance ou l'identité du patient",
      "Prescripteur injoignable et danger en cas de remise : la boîte reste derrière le comptoir"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Un élément requis manque ou est illisible <b>et</b> change la délivrance : dosage ambigu, forme galénique absente, durée incohérente (contenu minimal : section OMéd 51 ci-dessous)",
      "Incohérence entre l'ordonnance et le dossier que le logiciel ou l'anamnèse fait remonter, sans explication plausible",
      "Ce qui a été clarifié se note : qui a été joint, quand, ce qui a été convenu"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde explicite",
     "ou": "Patient — au comptoir, et note au dossier",
     "items": [
      "L'ordonnance est valable mais la remise appelle une information de sécurité active : effet indésirable à surveiller, précaution d'emploi, association OTC à éviter",
      "La mise en garde se formule au patient et se documente — c'est ce qui la distingue du conseil standard"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard de remise",
     "items": [
      "Ordonnance conforme, posologie plausible, rien au dossier : prise, durée, effets attendus — et questionner l'automédication en cours (croisements OTC ci-dessous)"
     ]
    }
   ],
   "warn": [
    "Calibrage — symétrique du volet OTC : <b>ne pas monter un V3 en V2 par prudence</b>. Rappeler un prescripteur pour ce qui relève de l'information au patient use le lien avec le cabinet, et finit par faire ignorer les vrais appels."
   ]
  },
  {
   "t": "La démarche — sept contrôles, dans l'ordre",
   "open": true,
   "p": [
    "Ordre de travail proposé par l'outil, aligné sur les contrôles avant exécution de la prise de position KAV/APC n° 0025 (§ 9) et sur les exigences de la LPTh et de l'OMéd : chaque contrôle peut faire tomber la décision d'un cran, et on ne saute pas d'étape parce que le patient attend.",
    "La validation se documente par le <b>visa du pharmacien sur l'ordonnance</b>, et la remise passe par le contrôle d'une deuxième personne — principe des 4 yeux (KAV 0025 § 9)."
   ],
   "ol": [
    "<b>Le patient</b> — pour qui est l'ordonnance, identité plausible, dossier ouvert",
    "<b>L'ordonnance</b> — conformité formelle : les données minimales de l'OMéd art. 51 (section suivante), signature, date",
    "<b>Le médicament</b> — préparation ou principe actif, forme, dosage, durée : plausibilité contre l'information professionnelle (compendium.ch)",
    "<b>Le terrain</b> — âge, poids en pédiatrie, grossesse ou allaitement, fonction rénale et hépatique si connues, populations à risque",
    "<b>Le crible du logiciel</b> — interactions, doublons, historique : l'étape que les fiches ne couvrent <b>jamais</b>",
    "<b>Le remboursement</b> — statut LS et limitations (fiche T5 à venir) : mieux vaut le savoir avant la remise qu'après",
    "<b>La remise</b> — ce qu'on dit au patient, et ce qu'il ne faut pas associer en OTC : la section « croisements » de chaque fiche de classe"
   ]
  },
  {
   "t": "Contenu minimal d'une ordonnance — OMéd art. 51",
   "open": true,
   "p": [
    "L'ordonnance d'un médecin ou d'un chiropraticien « doit contenir au moins les données suivantes » (OMéd art. 51 al. 1, état au 01.01.2026) — applicables « par analogie » aux autres professionnels habilités (al. 3).",
    "Forme (al. 2) : sur papier, signature <b>manuscrite</b> ; ordonnance électronique munie d'une signature électronique qualifiée, ou transmise avec des exigences de sécurité comparables — authenticité, intégrité des données, confidentialité."
   ],
   "table": {
    "head": [
     "Lettre",
     "Donnée requise"
    ],
    "rows": [
     [
      "a",
      "Nom, prénom et adresse du cabinet du prescripteur, et son numéro GLN du registre des professions médicales"
     ],
     [
      "b",
      "Signature légalement valable du prescripteur"
     ],
     [
      "c",
      "Nom, prénom, <b>date de naissance et sexe</b> du patient"
     ],
     [
      "d",
      "Date de rédaction de l'ordonnance"
     ],
     [
      "e",
      "Nom de la préparation ou du principe actif, forme pharmaceutique, quantité de principe actif par unité le cas échéant"
     ],
     [
      "f",
      "Dosage et durée d'utilisation"
     ],
     [
      "g",
      "Prescriptions d'utilisation"
     ]
    ]
   },
   "warn": [
    "Un manque n'est pas automatiquement un V2 : il le devient quand il <b>change la délivrance</b> ou fait douter de l'authenticité — sinon il se corrige ou se documente au comptoir.",
    "Durée de validité d'une ordonnance non stupéfiante, règles de renouvellement, exigences cantonales vaudoises : <span class='nv'>non vérifié</span> cette session — traité en fiche T4."
   ]
  },
  {
   "t": "Deux principes de la LPTh à garder en tête",
   "ul": [
    "« Les règles reconnues des sciences pharmaceutiques et médicales doivent être respectées lors de la prescription, de la remise et de l'utilisation de médicaments » — LPTh art. 26 al. 1 (état au 01.01.2025). C'est le fondement légal de la validation officinale : remettre n'est pas exécuter.",
    "« L'ordonnance est la propriété de la personne pour laquelle elle a été délivrée », qui choisit librement son fournisseur — LPTh art. 26 al. 2bis let. b. Le patient peut demander son ordonnance et la faire exécuter ailleurs ; l'original lui appartient."
   ]
  },
  {
   "t": "Calibrage V2 ↔ V3 — exemples du comptoir",
   "p": [
    "La frontière qui compte est entre V2 (on appelle) et V3 (on délivre en mettant en garde) : c'est elle qui protège à la fois le patient et le lien avec les cabinets. Les exemples ci-dessous viennent de la pratique du titulaire, pas d'une source publiée."
   ],
   "table": {
    "head": [
     "Situation vue au comptoir",
     "Niveau retenu",
     "Pourquoi"
    ],
    "rows": []
   }
  },
  {
   "t": "Croisements OTC",
   "p": [
    "Le réflexe transversal à toute remise d'ordonnance : <b>demander ce que le patient prend déjà sans ordonnance</b>. Les fiches de classe porteront leurs croisements précis ; en attendant, les plus fréquents passent par :"
   ],
   "ul": [
    "Fiche T2 — plafonds et lignes rouges du paracétamol, des AINS, des décongestionnants et des antitussifs : à croiser avec toute ordonnance qui en contient ou qui s'y additionne",
    "Fiche 1 — cumul silencieux de paracétamol entre une ordonnance et les associations grippales du comptoir",
    "Fiches 7 et 12 — automédication de la toux et de l'état grippal chez le patient déjà traité"
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
      "OMéd, RS 812.212.21, état au 01.01.2026 — art. 51 (contenu minimal de l'ordonnance, signature, ordonnance électronique)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "LPTh, RS 812.21, état au 01.01.2025 — art. 26 al. 1, 2bis (règles des sciences pharmaceutiques, propriété de l'ordonnance)",
      "30.08.2026"
     ],
     [
      "KAV/APC — pharmaciens cantonaux",
      "Prise de position n° 0025 « Prescriptions médicales », V02, valable dès le 22.05.2025 — § 9 : contrôles avant exécution, visa du pharmacien, principe des 4 yeux",
      "30.08.2026"
     ],
     [
      "Convention de l'outil",
      "Échelle V1–V4 et exemples de calibrage : conventions internes validées par le pharmacien titulaire — aucune source publiée ne les définit ; l'ordre des sept contrôles s'aligne sur la prise de position KAV 0025",
      "30.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "RBP pharmaSuisse/santésuisse : non consultées cette session (pas d'accès public vérifié)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "t4": [
  {
   "t": "Lire cette fiche",
   "open": true,
   "p": [
    "Le cadre juridique de la validation : compléter la démarche de la fiche T3 quand la question est « cette ordonnance est-elle valable, et qu'ai-je le droit d'en faire ». Le remboursement viendra en fiche T5.",
    "Trois étages de règles : le <b>droit fédéral</b> (LPTh, OMéd, LStup, OCStup, LAMal) · la <b>prise de position n° 0025 « Prescriptions médicales »</b> des pharmaciens cantonaux (KAV/APC, V02, valable dès le 22.05.2025), qui fait référence pour la pratique officinale · le <b>droit cantonal</b>, expressément réservé par la prise de position — et Vaud, précisément, ne fixe presque rien (section vaudoise ci-dessous)."
   ]
  },
  {
   "t": "Qui peut prescrire — et à qui",
   "open": true,
   "ul": [
    "<b>Médecins</b> titulaires d'une autorisation de pratiquer sous leur propre responsabilité ; à l'hôpital, les assistants n'en ont pas — l'ordonnance doit alors porter <b>en plus le nom et le GLN du médecin responsable du service</b> (KAV 0025).",
    "<b>Médecins-dentistes et chiropraticiens</b> : dans le cadre de leur activité autorisée (chiropraticiens selon l'art. 4 OPAS) — mais <b>pas de substances contrôlées</b> pour ces deux professions (art. 10 LStup, via KAV 0025).",
    "<b>Naturopathes et thérapeutes</b>, avec ou sans diplôme fédéral : pas de prescription, seulement des recommandations (KAV 0025).",
    "Une ordonnance n'est valable que si son auteur détient une <b>autorisation de pratiquer en cours de validité</b> — le médecin qui a cessé son activité et rendu son autorisation ne prescrit plus (guide pratique FMH/ASSM).",
    "Ordonnance exigée avant toute remise soumise à ordonnance ; le patient peut y renoncer (LPTh art. 26 al. 4). Les médicaments prescrits ne s'exécutent qu'en officine — un médecin ne peut pas exécuter l'ordonnance d'un autre prescripteur (KAV 0025)."
   ]
  },
  {
   "t": "Forme et transmission",
   "open": true,
   "p": [
    "Sur <b>papier</b> : signature <b>manuscrite originale</b>. Signature scannée, fax, photocopie, e-mail ou mention « visé électroniquement » ne font pas un document valable ; les signatures « p.o. » sont nulles et la signature ne se délègue pas (KAV 0025).",
    "En <b>électronique</b> : l'art. 51 al. 2 OMéd admet la signature électronique qualifiée <i>ou</i> une transmission d'une sécurité comparable — mais la prise de position KAV exige la signature qualifiée ou avancée vérifiable et désigne « E-ordonnance Suisse » comme seule solution acceptée ; une image de signature insérée dans un PDF ne suffit pas. Au comptoir, la ligne KAV est la ligne sûre."
   ],
   "ul": [
    "Envoi direct cabinet → pharmacie : uniquement avec le <b>consentement écrit du patient</b>, confirmé périodiquement (en règle générale une fois par an), voie protégée (HIN → HIN/Ovan) et original papier qui suit par poste (KAV 0025).",
    "<b>Interdit</b> : envoyer l'ordonnance au patient par e-mail, messagerie ou fax — impossible d'en vérifier l'authenticité à la remise (KAV 0025).",
    "Les <b>copies</b> doivent être marquées comme telles et ne donnent pas droit au retrait de médicaments (KAV 0025)."
   ]
  },
  {
   "t": "Validité et répétition",
   "open": true,
   "p": [
    "Le droit fédéral ne fixe <b>aucune durée de validité</b> pour l'ordonnance ordinaire — c'est la mention du prescripteur qui prime, puis les règles cantonales, qui divergent fortement (Zurich : <span class='dose'>1 an</span>, traitements de longue durée <span class='dose'>2 ans</span> ; Soleure : <span class='dose'>6 mois</span>, ordonnances permanentes <span class='dose'>1 an</span> — guide FMH/ASSM)."
   ],
   "table": {
    "head": [
     "Situation",
     "Règle",
     "Source"
    ],
    "rows": [
     [
      "Catégorie A",
      "Non renouvelable sans <b>l'autorisation expresse</b> du médecin",
      "OMéd art. 41"
     ],
     [
      "Répétition non indiquée (cat. B–D)",
      "Répétition unique possible dans la limite de validité, dans des cas justifiés ; le prescripteur peut l'interdire (« ne rep. »)",
      "KAV 0025, § 7"
     ],
     [
      "Répétition chiffrée (« rep. 3× »)",
      "Remise répétée jusqu'au nombre indiqué, selon la posologie prescrite",
      "KAV 0025, § 7"
     ],
     [
      "Traitement chronique, répétition non spécifiée",
      "Remise répétée pendant la validité — ordonnances renouvelables <b>1 an au maximum</b>, ou jusqu'à la prochaine consultation",
      "KAV 0025, § 7"
     ],
     [
      "Poursuite d'un traitement de longue durée sans nouvelle ordonnance",
      "Possible en remise B par le pharmacien <b>pendant un an</b> après une première prescription médicale — consentement du patient, jamais pour les stupéfiants ni les antibiotiques systémiques",
      "OMéd art. 45 al. 1 let. b et al. 4 · KAV 0025 § 9.4 · fiche T1"
     ]
    ]
   },
   "warn": [
    "Vaud ne fixe aucune durée de validité : c'est le <b>devoir de diligence</b> du pharmacien qui tranche (presse spécialisée romande, Ma Santé 22.06.2022 — à confirmer auprès de la pharmacienne cantonale). La prise de position KAV donne <span class='dose'>1 mois</span> comme validité de base d'une ordonnance portant des substances contrôlées b/c (<span class='dose'>6 mois</span> si la durée prescrite l'exige) ; pour le reste, fixer une politique de maison cohérente et s'y tenir."
   ]
  },
  {
   "t": "Stupéfiants — OCStup",
   "open": true,
   "p": [
    "Le terme officiel est « <b>ordonnance de stupéfiants</b> » — le formulaire à souche fourni par Swissmedic via le canton. Elle est obligatoire pour les substances des <b>tableaux a et d</b> ; les tableaux <b>b et c</b> passent sur ordonnance ordinaire (OCStup art. 46). Le prescripteur doit avoir examiné le patient lui-même (art. 46 al. 1)."
   ],
   "ul": [
    "<b>Urgence</b>, prescription impossible à obtenir : le pharmacien responsable peut remettre le plus petit emballage commercialisé — procès-verbal à l'autorité cantonale dans les <span class='dose'>5 jours</span> pour les tableaux a, b et d, médecin traitant informé en parallèle (OCStup art. 52 · KAV 0025 § 9.5).",
    "Stupéfiant prescrit <b>hors indication autorisée</b> ou au-dessus de la dose maximale : annonce à l'autorité cantonale dans les <span class='dose'>30 jours</span> (art. 11 LStup ; OCStup art. 49–50, via KAV 0025)."
   ],
   "table": {
    "head": [
     "",
     "Tableaux a et d — ordonnance à souche",
     "Tableaux b et c — ordonnance ordinaire"
    ],
    "rows": [
     [
      "Validité",
      "<span class='dose'>1 mois</span> (OCStup art. 47 al. 2)",
      "<span class='dose'>1 mois</span>, position KAV (§ 7)"
     ],
     [
      "Quantité maximale",
      "Besoin d'<span class='dose'>1 mois</span> ; <span class='dose'>3 mois</span> au plus si les circonstances le justifient, durée précise indiquée (art. 47 al. 3)",
      "Besoin d'<span class='dose'>1 mois</span> ; <span class='dose'>6 mois</span> au plus, durée précise indiquée (art. 48)"
     ],
     [
      "Répétition",
      "Non renouvelable, sauf mention contraire du prescripteur (art. 51 al. 3)",
      "Remise partielle possible pendant la validité, quantité et centre de remise notés sur l'ordonnance (art. 51 al. 4)"
     ],
     [
      "À la remise",
      "Original blanc <b>et</b> copie rose physiquement présents ; l'original reste à la pharmacie ; transmission numérique impossible ; max. 2 préparations contrôlées par formulaire (KAV 0025 § 6.6, § 7)",
      "Circuit ordinaire"
     ]
    ]
   }
  },
  {
   "t": "Substitution — art. 52a LAMal",
   "open": true,
   "p": [
    "Quand plusieurs médicaments de <b>même composition de substances actives</b> sont dans la liste des spécialités, le pharmacien peut remettre celui « dont le prix est plus avantageux » — sauf si le médecin ou le chiropraticien « exige expressément la délivrance d'une préparation originale » (art. 52a al. 1, état au 01.07.2026). Celui qui substitue <b>en informe l'auteur de la prescription</b> (al. 2).",
    "Rupture de stock : remplacement par une préparation de composition identique ; en urgence, un médicament analogue peut partir sans accord préalable — le prescripteur est informé, au besoin après coup (KAV 0025 § 9.2). L'impact sur la quote-part (art. 38a OPAS) viendra en fiche T5."
   ]
  },
  {
   "t": "Décision — situations types",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur, et autorité cantonale si falsification",
     "items": [
      "Ordonnance présumée <b>falsifiée ou modifiée</b> : ne pas exécuter, retenir le document, signaler à l'autorité cantonale — c'est un faux dans les titres (KAV 0025 § 9.1)",
      "Stupéfiant des tableaux a/d sans formulaire à souche, ou souche sans l'original blanc et la copie rose présents",
      "Prescripteur sans autorisation de pratiquer, ou hors de son champ (naturopathe ; dentiste ou chiropraticien prescrivant un stupéfiant)"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Donnée minimale de l'OMéd art. 51 manquante ou illisible qui change la délivrance (fiche T3)",
      "Validité expirée ou douteuse : mention absente, date ancienne, quantité stupéfiante au-dessus du plafond sans durée précisée",
      "Ordonnance électronique sans signature qualifiée vérifiable, ou reçue directement du patient par voie électronique"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec information active",
     "ou": "Patient au comptoir · prescripteur informé · note au dossier",
     "items": [
      "Substitution générique effectuée : dire au patient ce qui change (nom, boîte), informer le prescripteur (art. 52a al. 2)",
      "Remise partielle d'un stupéfiant b/c : quantité et centre de remise portés sur l'ordonnance (OCStup art. 51 al. 4)"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Ordonnance conforme, dans sa période de validité, répétition acceptable — la validation pharmaceutique de la fiche T3 s'applique"
     ]
    }
   ]
  },
  {
   "t": "Conservation, archivage, ordonnances étrangères",
   "ul": [
    "<b>Substances contrôlées</b> : documents, données et supports concernant la prescription et le commerce conservés <b>dix ans</b> (OCStup art. 62 al. 3) ; la pharmacie doit pouvoir produire à tout moment les pièces d'acquisition et de remise, remises des tableaux a/d attestées par les ordonnances de stupéfiants elles-mêmes (art. 63).",
    "<b>Ordonnances ordinaires</b> : durée de conservation en officine <span class='nv'>non vérifié</span> — aucune règle fédérale trouvée cette session ; suivre la pratique du logiciel et les exigences cantonales.",
    "<b>Ordonnances étrangères</b> : « généralement non valables », sous réserve des réglementations des pratiques frontalières — traiter la demande comme une <b>remise sans ordonnance</b> (art. 45 OMéd, fiche T1) avec le devoir de diligence complet (KAV 0025 § 9.4). Pour les stupéfiants, seule exception : le prescripteur étranger <b>autorisé à pratiquer dans la zone frontière</b> (OCStup art. 51 al. 2 let. b ; art. 10 al. 2 LStup)."
   ]
  },
  {
   "t": "Spécificités vaudoises",
   "p": [
    "Aucune règle vaudoise publiée n'a été trouvée cette session sur la validité des ordonnances — la page de la pharmacienne cantonale (vd.ch) est un portail sans directive détaillée en accès direct. La prise de position KAV réserve expressément les « dispositions cantonales contraires » (§ 10) : en cas de doute réel, la question se pose directement au Pôle produits thérapeutiques — <span class='tel'>021 316 42 01</span>, pharmacien.cantonal@vd.ch."
   ],
   "warn": [
    "Le règlement vaudois sur l'exercice des professions de la santé (REPS, 811.01.1) n'a pas pu être dépouillé cette session : d'éventuelles règles cantonales sur l'ordonnance ou son archivage restent <span class='nv'>non vérifié</span>."
   ]
  },
  {
   "t": "Croisements OTC",
   "ul": [
    "Fiche T1 — catégories de remise, remise B sans ordonnance (art. 45 OMéd), consignation (art. 47–48) : le socle commun des deux volets.",
    "Antibiotiques systémiques : <b>jamais</b> en remise B sans ordonnance (art. 45 al. 4 OMéd) — verrouille les demandes « comme la dernière fois » des fiches angine (3) et otite (5).",
    "Poursuite de traitement un an (art. 45 al. 1 let. b) : la passerelle légale entre le comptoir OTC et le renouvellement — jamais pour les stupéfiants."
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
      "OMéd, RS 812.212.21, état au 01.01.2026 — art. 41–42 (catégories A/B), 45 (remise sans ordonnance, al. 4 antibiotiques), 51 (contenu)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "LPTh, RS 812.21, état au 01.01.2025 — art. 26 (principes, al. 4 ordonnance avant remise)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "OCStup, RS 812.121.1, état au 23.01.2023 — art. 46–48 (prescription, ordonnance de stupéfiants, quantités), 51 (remise, zone frontière, renouvellement), 52 (urgences), 62–63 (documents, dix ans, pharmacies)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "LAMal, RS 832.10, état au 01.07.2026 — art. 52a (droit de substitution, teneur en vigueur depuis le 01.01.2024)",
      "30.08.2026"
     ],
     [
      "KAV/APC — pharmaciens cantonaux",
      "Prise de position n° 0025 « Prescriptions médicales », V02, valable dès le 22.05.2025 — autorisation de prescrire, signatures et transmission, tableau validité/quantités/répétition, exécution et falsification, substitution, ordonnances étrangères, urgences stupéfiants",
      "30.08.2026"
     ],
     [
      "FMH / ASSM",
      "Guide pratique « Bases juridiques pour le quotidien médical », chap. 4.5 « Établir des ordonnances » — validité cantonale (ZH, SO), autorisation de pratiquer, signature électronique",
      "30.08.2026"
     ],
     [
      "Ma Santé (presse spécialisée romande)",
      "« Durée de validité d'une ordonnance », 22.06.2022 (MAJ 04.10.2022) — Vaud sans règle spécifique, devoir de diligence ; article partiellement payant",
      "30.08.2026"
     ],
     [
      "État de Vaud — vd.ch",
      "Portail « Pharmacienne cantonale — informations pour les pharmacies » : coordonnées du Pôle produits thérapeutiques, pas de directive détaillée en accès direct",
      "30.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "REPS vaudois 811.01.1 (PDF non dépouillé) · conservation des ordonnances ordinaires : aucune base fédérale trouvée",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "t5": [
  {
   "t": "Lire cette fiche",
   "open": true,
   "p": [
    "Au comptoir, le remboursement bloque plus souvent que la pharmacologie. Cette fiche donne la mécanique et les réflexes ; le <b>logiciel de tarification fait foi</b> pour chaque cas concret, et la Liste des spécialités change plusieurs fois par an — tout statut cité ici est daté du 30.08.2026 et <b>à revérifier</b>.",
    "La LS officielle se consulte sur le portail de l'OFSP (sl.bag.admin.ch, successeur de spezialitaetenliste.ch) — c'est là que se lisent les limitations exactes."
   ]
  },
  {
   "t": "La mécanique de base",
   "open": true,
   "p": [
    "L'assurance obligatoire des soins prend en charge les médicaments de la <b>Liste des spécialités</b>, établie par l'OFSP (art. 52 al. 1 let. b LAMal) ; ils « ne peuvent être facturés à l'assurance obligatoire des soins qu'au plus d'après les tarifs, prix et taux de rémunération » de cette liste (al. 3)."
   ],
   "table": {
    "head": [
     "Qui paie quoi",
     "Règle",
     "Base"
    ],
    "rows": [
     [
      "Franchise",
      "Montant fixe annuel — <span class='dose'>300 CHF</span> en franchise ordinaire ; options plus élevées selon le contrat",
      "LAMal art. 64 al. 2 · OAMal art. 103 al. 1"
     ],
     [
      "Quote-part",
      "<span class='dose'>10 %</span> des coûts au-delà de la franchise, plafonnée à <span class='dose'>700 CHF</span>/an (adulte) et <span class='dose'>350 CHF</span> (enfant)",
      "LAMal art. 64 · OAMal art. 103 al. 2"
     ],
     [
      "Enfants",
      "Pas de franchise, quote-part réduite de moitié ; plafond commun pour la fratrie chez le même assureur",
      "LAMal art. 64 al. 4"
     ],
     [
      "Qui avance l'argent",
      "Par défaut, <b>le patient</b> est débiteur et se fait rembourser (<b>tiers garant</b>) ; le <b>tiers payant</b> n'existe que par convention entre assureur et fournisseur — avec copie de la facture remise d'office au patient",
      "LAMal art. 42 al. 1–3"
     ]
    ]
   }
  },
  {
   "t": "Les limitations LS — ce qui bloque vraiment",
   "open": true,
   "p": [
    "« L'admission dans une liste peut être assortie d'une limitation. Celle-ci peut notamment se rapporter à la quantité ou aux indications médicales » (art. 73 OAMal). Au comptoir, une limitation peut porter sur l'indication, la quantité, la durée, le prescripteur (spécialiste) ou exiger une <b>garantie préalable de prise en charge</b> de l'assureur.",
    "Le réflexe : quand le logiciel signale une limitation, lire son texte exact sur la LS en ligne avant de promettre quoi que ce soit au patient — et si une garantie est exigée, elle se demande <b>avant</b> la remise."
   ]
  },
  {
   "t": "Quote-part différenciée — art. 38a OPAS",
   "open": true,
   "p": [
    "La quote-part monte à <span class='dose'>40 %</span> pour les médicaments dont le prix de fabrique dépasse d'au moins <span class='dose'>10 %</span> la moyenne du tiers le plus avantageux des médicaments de mêmes substances actives de la LS (al. 1) — et la règle s'applique aux originaux <b>comme aux génériques et biosimilaires</b> (al. 2), ainsi qu'aux prises en charge selon 71a OAMal (al. 9).",
    "Exceptions (al. 7) : le prescripteur exige expressément l'original « pour des raisons médicales vérifiables », ou le pharmacien rejette la substitution pour les mêmes raisons — un « sic » de pure convenance ne protège pas la quote-part du patient."
   ],
   "warn": [
    "Obligation réglementaire d'information au comptoir (al. 8) : signaler au patient qu'un générique ou biosimilaire de mêmes substances existe dans la LS, et que la quote-part du médicament remis dépasse <span class='dose'>10 %</span>. Ce n'est pas du zèle commercial, c'est l'OPAS."
   ]
  },
  {
   "t": "Hors indication, hors limitation, hors liste — art. 71a–71d OAMal",
   "open": true,
   "p": [
    "Un médicament LS utilisé hors indication autorisée ou hors limitation peut être pris en charge « au cas par cas » : préalable indispensable à une autre prestation prédominante (71a al. 1 let. a), ou grand bénéfice thérapeutique attendu contre une maladie mortelle ou gravement invalidante sans alternative (let. b), ou prophylaxie post-exposition (let. c). Les art. 71b et 71c couvrent le hors-LS et le non-autorisé en Suisse.",
    "La règle qui commande tout : la prise en charge n'existe « que si l'assureur a donné une <b>garantie spéciale</b> après avoir consulté le médecin-conseil » (71d al. 1). Dossier complet → décision sous <span class='dose'>2 semaines</span> (al. 3) ; rejet motivé au médecin et au patient (al. 6). Prix facturé : au plus le prix LS pour 71a ; prix payé + part de distribution + TVA pour 71b/71c (al. 4)."
   ],
   "warn": [
    "La demande relève du médecin — mais c'est souvent le comptoir qui découvre le problème à la tarification. Sans garantie écrite au dossier, ne pas promettre le remboursement : c'est un V2, pas un acte de foi."
   ]
  },
  {
   "t": "LiMA — moyens et appareils",
   "p": [
    "Les moyens et appareils (pansements, tigettes, aides à l'incontinence…) se remboursent selon la <b>LiMA</b>, annexe 2 de l'OPAS, par groupes de produits et dans la limite d'un <b>montant maximal de remboursement</b> (MMR) — la liste n'est pas publiée au RO, elle se consulte en ligne (OFSP ; OPAS art. 20–20a ; RBP V art. 3). Au-delà du MMR, la différence est au patient : le dire avant, pas sur la facture."
   ]
  },
  {
   "t": "RBP V — ce que l'AOS paie au pharmacien",
   "open": true,
   "p": [
    "Depuis le 01.01.2026, la structure tarifaire <b>RBP V</b> (pharmaSuisse × prio.swiss, approuvée par le Conseil fédéral le 29.10.2025, durée trois ans) rémunère les prestations du pharmacien en points tarifaires, indépendamment du prix du médicament. Champ : médicaments LS des catégories A et B, préparations magistrales (LMT), et médicaments 71a–71c <b>munis d'une garantie valide</b>.",
    "La « validation de sécurité médicament » forfaitise précisément les contrôles de la fiche T3 : vérification d'ordonnance et de la répétition, posologie et limitations, interactions au sein de l'ordonnance, facteurs de risque, contact prescripteur si nécessaire, mésusage, conseils de prise, choix économique de l'emballage."
   ],
   "table": {
    "head": [
     "Position",
     "Prestation",
     "Points tarifaires"
    ],
    "rows": [
     [
      "3000–3003",
      "Validation de sécurité médicament — nouveau (A / B) · existant (A / B)",
      "<span class='dose'>3.63</span> · <span class='dose'>2.83</span> · <span class='dose'>2.97</span> · <span class='dose'>1.44</span>"
     ],
     [
      "3004",
      "Validation de sécurité patient",
      "<span class='dose'>2.75</span>"
     ],
     [
      "3007–3009",
      "Semainier (3–5 · 6–8 · ≥9 médicaments)",
      "<span class='dose'>6.56</span> · <span class='dose'>10.94</span> · <span class='dose'>15.21</span>"
     ],
     [
      "3010 / 3011",
      "Remise fractionnée · prise sous surveillance",
      "<span class='dose'>3.75</span> · <span class='dose'>7.50</span>"
     ],
     [
      "3012",
      "Service de garde",
      "<span class='dose'>12.00</span>"
     ],
     [
      "3014",
      "Substitution",
      "selon art. 11 de l'annexe A"
     ],
     [
      "3017–3020",
      "Forfaits méthadone",
      "<span class='dose'>69.69</span>–<span class='dose'>216.03</span>"
     ]
    ]
   },
   "warn": [
    "Un « nouveau médicament » au sens RBP V = principe actif (ATC niveau 5) non retiré dans les <span class='dose'>365 jours</span> selon le dossier de la pharmacie. La <b>valeur du point</b> dépend des conventions d'adhésion (CSS, HSK…) : <span class='nv'>non vérifié</span> cette session — voir sa propre convention. En cas de litige, seule la version allemande de la convention fait foi."
   ]
  },
  {
   "t": "Décision — situations types",
   "open": true,
   "p": [
    "Le remboursement ne crée jamais de V1 : un problème de prise en charge ne retient pas un traitement — il se règle après, ou autrement."
   ],
   "triage": [
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur, ou assureur / médecin-conseil",
     "items": [
      "Limitation LS exigeant une garantie de prise en charge, sans garantie au dossier",
      "Usage hors indication ou hors limitation (71a) sans garantie spéciale écrite de l'assureur",
      "Ordonnance hors LS dont le patient ne peut pas assumer le coût : chercher l'alternative LS avec le prescripteur"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec information active",
     "ou": "Patient — au comptoir",
     "items": [
      "Quote-part à <span class='dose'>40 %</span> : information obligatoire (38a al. 8) et substitution proposée",
      "Médicament hors liste ou LiMA au-delà du MMR : annoncer le reste à charge avant la remise",
      "Original exigé « sic » sans raison médicale apparente : délivrer, informer du surcoût, documenter"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Médicament LS sans limitation, générique économiquement optimal, tiers payant conventionnel : rien à signaler"
     ]
    }
   ]
  },
  {
   "t": "Croisements OTC",
   "ul": [
    "Un produit OTC n'est à charge de l'AOS que s'il figure sur la LS <b>et</b> qu'il est prescrit — le même ibuprofène se paie ou se rembourse selon le chemin qu'il a pris ; ne jamais le promettre sans ordonnance (fiches T1, 1, 14).",
    "Chiropraticiens : leur droit de prescription remboursée est limité à des groupes précis de la LS — analgésiques, anti-inflammatoires, minéraux et vitamines notamment (art. 4 OPAS ; fiche T4 pour qui peut prescrire).",
    "La substitution générique (fiche T4, art. 52a LAMal) est aussi un geste tarifaire : position RBP V dédiée et quote-part du patient en jeu (38a OPAS)."
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
      "LAMal, RS 832.10, état au 01.07.2026 — art. 42 (tiers garant/payant), 52 (LS), 64 (participation aux coûts)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "OAMal, RS 832.102, état au 01.08.2026 — art. 71a et 71d (prise en charge au cas par cas, teneur 2024), 73 (limitations), 103 (franchise 300, plafonds 700/350)",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "OPAS, RS 832.112.31, état au 01.08.2026 — art. 4 (prescription des chiropraticiens), 20–20a (LiMA, annexe 2), 38a (quote-part différenciée, information au patient)",
      "30.08.2026"
     ],
     [
      "pharmaSuisse / prio.swiss",
      "« Convention relative à la structure tarifaire RBP V » du 01.01.2026, annexe A — positions et points tarifaires, définition du nouveau médicament, contenu forfaitaire de la validation",
      "30.08.2026"
     ],
     [
      "Conseil fédéral",
      "Communiqué d'approbation de la RBP V (29.10.2025) — entrée en vigueur au 01.01.2026",
      "30.08.2026"
     ],
     [
      "OFSP",
      "Portail LS sl.bag.admin.ch (successeur de spezialitaetenliste.ch — redirection vérifiée) : application en ligne, texte des limitations",
      "30.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Valeur du point tarifaire RBP V selon les conventions d'adhésion (CSS, HSK) : non consultée — montants propres à chaque convention",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "r1": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Indications dominantes : fibrillation auriculaire non valvulaire (prévention de l'AVC et de l'embolie systémique), traitement et prévention des récidives de TVP et d'embolie pulmonaire, thromboprophylaxie orthopédique — selon les IP suisses respectives (AIPS). Lixiana et Pradaxa ne s'instaurent dans la TVP/EP qu'<b>après au moins 5 jours d'héparine</b> ; les valves cardiaques mécaniques restent le territoire des AVK — elles sont une CI formelle de Pradaxa."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Doses",
     "Cat.",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Eliquis",
      "apixaban",
      "<span class='dose'>2,5</span> et <span class='dose'>5 mg</span>, 2×/j",
      "<span class='cat cat-B'>B</span>",
      "02.2024"
     ],
     [
      "Xarelto",
      "rivaroxaban",
      "<span class='dose'>10</span>, <span class='dose'>15</span>, <span class='dose'>20 mg</span>, 1×/j (2×/j en début de TVP/EP)",
      "<span class='cat cat-B'>B</span>",
      "05.2025"
     ],
     [
      "Lixiana",
      "édoxaban",
      "<span class='dose'>15</span>, <span class='dose'>30</span>, <span class='dose'>60 mg</span>, 1×/j",
      "<span class='cat cat-B'>B</span>",
      "12.2023"
     ],
     [
      "Pradaxa",
      "dabigatran étexilate",
      "<span class='dose'>110</span> et <span class='dose'>150 mg</span>, 2×/j",
      "<span class='cat cat-B'>B</span>",
      "02.2024"
     ],
     [
      "Marcoumar",
      "phenprocoumone",
      "<span class='dose'>3 mg</span> quadrisécable, selon INR",
      "<span class='cat cat-A'>A</span>",
      "10.2020"
     ],
     [
      "Sintrom / Sintrom mitis",
      "acénocoumarol",
      "<span class='dose'>4</span> / <span class='dose'>1 mg</span>, selon INR",
      "<span class='cat cat-A'>A</span>",
      "11.2025"
     ]
    ]
   },
   "warn": [
    "Les deux AVK sont en catégorie <span class='cat cat-A'>A</span> : ordonnance non renouvelable sans autorisation expresse du prescripteur (OMéd art. 41 — fiche T4). Les quatre AOD sont en <span class='cat cat-B'>B</span>."
   ]
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Une seule anticoagulation à la fois</b> — l'association d'anticoagulants est contre-indiquée (IP Lixiana, explicite) sauf relais documenté ou dose de maintien d'un cathéter : deux anticoagulants sur une ordonnance ou au dossier = prescripteur, maintenant",
    "<b>Dose ↔ indication</b> — la même boîte sert plusieurs schémas : Eliquis FA <span class='dose'>5 mg 2×/j</span> mais TVP/EP <span class='dose'>10 mg 2×/j</span> 7 jours puis <span class='dose'>5 mg 2×/j</span>, prévention de récidive <span class='dose'>2,5 mg 2×/j</span> — vérifier que la dose colle à l'indication et à la phase du traitement",
    "<b>Critères de réduction</b> — Eliquis FA : <span class='dose'>2,5 mg 2×/j</span> si <b>au moins 2 critères</b> parmi âge ≥<span class='dose'>80 ans</span>, poids ≤<span class='dose'>60 kg</span>, créatinine ≥<span class='dose'>133 µmol/l</span> · Xarelto FA : <span class='dose'>15 mg</span> si ClCr 30–49 · Lixiana : <span class='dose'>30 mg</span> si ClCr 15–50 ou inhibiteur de la P-gp listé (section interactions)",
    "<b>Fonction rénale</b> — l'IP de Pradaxa impose son évaluation <b>avant tout traitement</b> (CI si ClCr <<span class='dose'>30</span>), puis au moins annuelle si atteinte modérée et plus fréquente chez les 75–80 ans ; pour les autres, seuils à la section populations",
    "<b>Interactions</b> — le crible du logiciel d'abord (fiche T3, étape 5), puis les lignes rouges de la section suivante",
    "<b>Durée</b> — la thromboprophylaxie orthopédique est courte (Eliquis : 10–14 jours après genou) : un renouvellement d'AOD « orthopédique » qui traîne interroge",
    "<b>AVK</b> — dernier INR connu, carnet tenu, et à chaque médicament ajouté <b>ou arrêté</b> : contrôles rapprochés (l'IP de Sintrom évoque deux fois par semaine)"
   ]
  },
  {
   "t": "Interactions majeures — lignes rouges par produit",
   "open": true,
   "p": [
    "Tirées des rubriques « Interactions » des IP suisses (AIPS). <b>Liste non exhaustive</b> : le logiciel d'officine et l'IP complète font foi — cette section ne remplace ni l'un ni l'autre."
   ],
   "table": {
    "head": [
     "Produit",
     "Ce que dit son IP"
    ],
    "rows": [
     [
      "Pradaxa",
      "<b>Contre-indiqué</b> avec quinidine, dronédarone, ritonavir, tipranavir, nelfinavir, saquinavir, ciclosporine, tacrolimus, kétoconazole et itraconazole systémiques (inhibiteurs P-gp). Amiodarone ou vérapamil : espacer la prise de <span class='dose'>2 h</span> et surveiller. Ticagrélor : exposition et risque accrus"
     ],
     [
      "Xarelto",
      "Azolés systémiques (kétoconazole, itraconazole, voriconazole, posaconazole) et inhibiteurs de la protéase du VIH : administration <b>non recommandée</b> (exposition ×2,6). Fluconazole : acceptable"
     ],
     [
      "Lixiana",
      "Ciclosporine, dronédarone, érythromycine, kétoconazole, quinidine, vérapamil : <b>réduire à 30 mg 1×/j</b>. Autres anticoagulants : contre-indiqués"
     ],
     [
      "Eliquis",
      "Azolés systémiques et inhibiteurs de la protéase du VIH : prudence et surveillance clinique (exposition ×2). Pas d'adaptation pour diltiazem, amiodarone, vérapamil, clarithromycine, naproxène"
     ],
     [
      "AVK (les deux)",
      "Marge thérapeutique étroite : toute co-médication nouvelle ou arrêtée peut décaler l'INR. À retenir pour le comptoir : AINS et salicylés y c. coxibs (« à éviter absolument », IP Sintrom), <b>miconazole même en application locale</b>, paracétamol (listé par l'IP Sintrom), ISRS, statines, tramadol, amoxicilline ± clavulanate, cotrimoxazole, clarithromycine, quinolones, métronidazole, amiodarone, allopurinol, thyroxine — et la <b>glucosamine</b> (IP Marcoumar)"
     ]
    ]
   },
   "warn": [
    "Inducteurs communs à toute la classe : rifampicine, carbamazépine, phénytoïne, phénobarbital et <b>millepertuis</b> font chuter l'exposition des AOD (≈−50 % pour l'apixaban) et déstabilisent les AVK — le millepertuis se vend au comptoir sans ordonnance, c'est un croisement OTC à part entière.",
    "AINS, antiagrégants, ISRS/IRSN : risque hémorragique majoré avec toute la classe (explicite dans l'IP Xarelto ; l'IP Eliquis ne montre pas d'interaction pharmacocinétique avec AAS ou clopidogrel mais réserve la réponse individuelle). L'association relève d'une décision médicale, jamais de l'automédication."
   ]
  },
  {
   "t": "Rénal, hépatique, populations",
   "open": true,
   "p": [
    "AVK : grossesse <b>contre-indiquée</b> (les deux IP) — contraception efficace exigée pendant le traitement, et jusqu'à trois mois après l'arrêt pour Marcoumar. Sintrom ajoute une CI de « défaut de coopération » (patient non surveillable). Personne âgée polymédiquée : c'est le profil type des critères de réduction d'Eliquis et de la surveillance rénale rapprochée de Pradaxa (75–80 ans)."
   ],
   "table": {
    "head": [
     "",
     "Eliquis",
     "Xarelto",
     "Lixiana",
     "Pradaxa"
    ],
    "rows": [
     [
      "Seuil rénal critique",
      "Non recommandé si ClCr <<span class='dose'>15</span> ou dialyse",
      "CI si dialyse ; prudence 15–29 ; <span class='dose'>15 mg</span> si 30–49 (FA)",
      "Non recommandé si ClCr <<span class='dose'>15</span> ou dialyse ; <span class='dose'>30 mg</span> si 15–50",
      "<b>CI si ClCr <<span class='dose'>30</span></b>"
     ],
     [
      "Hépatique",
      "CI si hépatopathie avec coagulopathie ou Child C",
      "CI si hépatopathie sévère avec risque hémorragique majoré",
      "CI si hépatopathie avec coagulopathie",
      "CI si maladie hépatique pouvant affecter la survie (Child A, B et C)"
     ],
     [
      "Grossesse",
      "Non recommandé",
      "<b>CI</b> (grossesse et allaitement)",
      "<b>CI</b> (grossesse et allaitement)",
      "Éviter ; « sauf nécessité absolue »"
     ],
     [
      "Autres CI notables",
      "Saignement évolutif",
      "Ulcère GI aigu · endocardite bactérienne aiguë",
      "Lésions à haut risque hémorragique · autre anticoagulant",
      "<b>Valves cardiaques artificielles</b> · diathèse hémorragique"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Deux anticoagulants prescrits ou au dossier sans relais documenté",
      "Pradaxa avec une ClCr connue <<span class='dose'>30</span>, une valve mécanique, ou l'un des inhibiteurs P-gp contre-indiqués par son IP",
      "AVK, Xarelto ou Lixiana chez une patiente enceinte connue — CI formelles des IP"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Dose qui ne colle pas aux critères visibles du dossier : Eliquis FA plein dosage malgré ≥2 critères de réduction (ou réduit sans critère), Xarelto <span class='dose'>20 mg</span> avec ClCr 30–49 connue, Lixiana <span class='dose'>60 mg</span> avec un inhibiteur P-gp listé",
      "Azolé systémique ou inhibiteur de protéase ajouté sous Xarelto (« non recommandé ») ou sous Eliquis sans surveillance prévue",
      "Instauration de Pradaxa sans fonction rénale documentée — son IP l'exige avant traitement",
      "Dose de phase aiguë (Eliquis <span class='dose'>10 mg 2×/j</span>) qui se prolonge au-delà des 7 jours prévus"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Toute nouvelle co-médication (ou arrêt) chez un patient sous AVK : prévenir que l'INR doit être recontrôlé rapidement, le noter",
      "ISRS/IRSN ou antiagrégant prescrit avec un AOD : rappeler les signes de saignement, documenter",
      "Millepertuis, glucosamine ou AINS découverts à l'anamnèse d'automédication : faire arrêter, expliquer, noter — et voir croisements OTC"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Renouvellement stable, fonction rénale suivie, aucune co-médication nouvelle : conseil de la section suivante"
     ]
    }
   ],
   "warn": [
    "Calibrage : l'ordonnance d'anticoagulant émane presque toujours d'un suivi cardiologique ou hospitalier construit — le V2 vise l'incohérence <b>visible au comptoir</b>, pas la remise en cause du choix thérapeutique."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "Pradaxa se conserve dans son <b>emballage d'origine</b>, à l'abri de l'humidité — pas de semainier pour les gélules (IP : remarques de conservation).",
    "Signes qui doivent faire consulter : saignement qui ne s'arrête pas, sang dans les urines ou selles noires, hématomes inhabituels, et <b>tout choc à la tête</b> — même sans plaie.",
    "Jamais d'AINS ni d'aspirine en automédication ; pour la douleur, le paracétamol d'abord — sous AVK, le signaler quand même : l'IP de Sintrom le liste parmi les potentialisateurs, l'INR peut bouger.",
    "Dire à chaque soignant — dentiste compris — qu'on est anticoagulé ; signaler toute nouvelle boîte, y compris achetée sans ordonnance.",
    "Sous AVK : le carnet INR est le tableau de bord — l'apporter à la pharmacie ne coûte rien et évite des appels."
   ],
   "table": {
    "head": [
     "Produit",
     "Prise",
     "Dose oubliée (IP)"
    ],
    "rows": [
     [
      "Eliquis",
      "Avec ou sans repas",
      "La prendre immédiatement, puis continuer normalement"
     ],
     [
      "Xarelto 15/20",
      "<b>Avec un repas</b> (biodisponibilité) ; le 10 mg : indifférent",
      "La prendre le jour même seulement — sinon sauter"
     ],
     [
      "Lixiana",
      "Avec ou sans repas",
      "La prendre immédiatement, puis reprendre le lendemain — jamais deux le même jour"
     ],
     [
      "Pradaxa",
      "Indifférent ; si gêne gastrique : pendant le repas",
      "Dès que possible, jusqu'à <span class='dose'>6 h</span> avant la dose suivante — sinon sauter"
     ]
    ]
   }
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiche T2 — la vigilance « AINS + anticoagulants » du volet OTC est désormais <b>documentée par les IP suisses</b> : risque hémorragique majoré sur toute la classe, refus d'automédication AINS et alternative paracétamol (dans les plafonds de T2).",
    "Fiches 1 et 14 — paracétamol : premier choix antalgique de l'anticoagulé, mais potentialisateur listé chez Sintrom → INR à surveiller en usage répété.",
    "<b>Millepertuis</b> (rayon sommeil/moral) : inducteur qui affaiblit AOD et AVK — question d'anamnèse systématique avant tout conseil OTC chez l'anticoagulé.",
    "<b>Glucosamine</b> (rayon articulations) : listée par l'IP Marcoumar parmi les potentialisateurs — le complément « anodin » qui ne l'est pas.",
    "Miconazole buccal ou cutané : interaction AVK <b>même en application locale</b> (IP Sintrom) — vérifier le dossier avant de conseiller un antifongique."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations éventuelles des six spécialités : <span class='nv'>non vérifié</span> cette session — le logiciel de tarification fait foi, mécanique générale en fiche T5. À revérifier : la LS change plusieurs fois par an."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Eliquis® (BMS), mise à jour 02.2024 — indications, posologie FA et critères de réduction, CI, interactions, rénal, grossesse, présentation [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Xarelto® (Bayer), mise à jour 05.2025 — CI (grossesse/allaitement, dialyse, ulcère GI), 15 mg si ClCr 30–49, azolés/IP VIH non recommandés, prise avec repas (15/20 mg)",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Lixiana® (Daiichi Sankyo), mise à jour 12.2023 — 30 mg si ClCr 15–50 ou inhibiteur P-gp, CI autres anticoagulants, CI grossesse/allaitement",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Pradaxa® (Boehringer), mise à jour 02.2024 — CI ClCr <30, CI inhibiteurs P-gp nominatifs, CI valves artificielles, fonction rénale avant et pendant, conservation",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Marcoumar® (Viatris), mise à jour 10.2020 — CI grossesse, CYP2C9/3A4, liste des potentialisateurs (dont glucosamine), contrôles INR",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Sintrom®/mitis (Medius), mise à jour 11.2025 — AINS « à éviter absolument », miconazole même local, paracétamol et ISRS potentialisateurs, contrôles 2×/semaine à chaque changement",
      "31.08.2026"
     ],
     [
      "Méthode",
      "Rubriques « Interactions » lues dans les IP intégrales (AIPS, textes officiels Swissmedic via Refdata), conformément au brief — aucune base sous authentification citée",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statut et limitations des six produits) : non consultée cette session — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r2": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Deux régimes très différents : la <b>monothérapie</b> au long cours (prévention secondaire — AAS ou clopidogrel), et la <b>bithérapie</b> (DAPT) après syndrome coronarien aigu ou pose de stent, toujours en association à l'AAS et <b>limitée dans le temps</b> — l'IP de Brilique recommande au moins 12 mois (relais éventuel à 60 mg 2×/j chez les hauts risques), celle d'Efient conseille 15 mois. L'association AAS-dipyridamole n'apparaît plus dans l'AIPS (Asasantine : aucune FI trouvée) ; le clopidogrel se délivre surtout en génériques — l'IP Plavix vaut pour la substance."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Schéma usuel (IP)",
     "Cat.",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Aspirine Cardio 100 / 300",
      "acide acétylsalicylique",
      "<span class='dose'>100 mg</span> 1×/j (selon l'indication jusqu'à <span class='dose'>300 mg</span>/j)",
      "<span class='cat cat-B'>B</span>",
      "03.2026"
     ],
     [
      "Plavix (et génériques)",
      "clopidogrel",
      "<span class='dose'>75 mg</span> 1×/j · charge <span class='dose'>300 mg</span> en SCA",
      "<span class='cat cat-B'>B</span>",
      "09.2022"
     ],
     [
      "Efient",
      "prasugrel",
      "charge <span class='dose'>60 mg</span> puis <span class='dose'>10 mg</span> 1×/j + AAS",
      "<span class='cat cat-B'>B</span>",
      "04.2025"
     ],
     [
      "Brilique",
      "ticagrélor",
      "charge <span class='dose'>180 mg</span> puis <span class='dose'>90 mg</span> 2×/j + AAS <span class='dose'>75–150 mg</span> · <span class='dose'>60 mg</span> 2×/j au long cours",
      "<span class='cat cat-B'>B</span>",
      "11.2025"
     ]
    ]
   }
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Mono ou bithérapie ?</b> Une DAPT a un contexte (SCA, stent) et une durée — vérifier au dossier depuis quand elle court ; une bithérapie qui se renouvelle sans horizon interroge, mais sa durée est une décision du cardiologue",
    "<b>Efient : balayer ses deux verrous</b> — antécédent d'AVC ou d'AIT = <b>contre-indication</b>, et « en général non recommandé » dès <span class='dose'>75 ans</span> (IP)",
    "<b>Brilique : l'AAS n'est pas optionnel</b> — dose d'entretien <span class='dose'>75–150 mg</span>/j sauf CI ; et aucune co-prescription de kétoconazole, clarithromycine, néfazodone, ritonavir ou atazanavir (CI)",
    "<b>Clopidogrel : regarder l'IPP</b> — oméprazole et ésoméprazole inhibent le CYP2C19 et sont déconseillés ; si un IPP est nécessaire, l'IP désigne le <b>pantoprazole</b>",
    "<b>AAS : les CI silencieuses</b> — bronchospasme/urticaire aux AINS, ulcère actif, MICI, ClCr <<span class='dose'>30</span>, insuffisance cardiaque NYHA III–IV, méthotrexate ≥<span class='dose'>15 mg/sem</span>, 3ᵉ trimestre",
    "<b>Antiagrégant + anticoagulant</b> — association possible mais d'école cardiologique : contexte documenté exigé, sinon clarifier (et voir fiche R1)",
    "<b>Chirurgie ou soins dentaires programmés</b> — l'arrêt éventuel (7 jours avant pour clopidogrel, prasugrel et ticagrélor selon leurs IP) appartient au prescripteur, jamais au comptoir ni au patient"
   ]
  },
  {
   "t": "Interactions majeures — lignes rouges par produit",
   "open": true,
   "p": [
    "Tirées des rubriques « Interactions » des IP suisses (AIPS). <b>Liste non exhaustive</b> — le logiciel d'officine et l'IP complète font foi."
   ],
   "table": {
    "head": [
     "Produit",
     "Ce que dit son IP"
    ],
    "rows": [
     [
      "Aspirine Cardio",
      "<b>CI</b> : méthotrexate ≥<span class='dose'>15 mg/sem</span>. Ibuprofène ou naproxène pris <b>le même jour</b> peuvent réduire l'effet antiagrégant (le métamizole aussi). ISRS : risque hémorragique synergique. Potentialise anticoagulants, valproate, phénytoïne, digoxine ; la glycémie peut baisser sous antidiabétiques"
     ],
     [
      "Clopidogrel",
      "Inhibiteurs modérés/puissants du CYP2C19 <b>déconseillés</b> : oméprazole, ésoméprazole, fluvoxamine, fluoxétine, moclobémide, voriconazole, fluconazole, ciprofloxacine, cimétidine, carbamazépine… IPP de choix : <b>pantoprazole</b>. Inducteurs puissants du CYP2C19 également déconseillés (excès de métabolite actif). Triple association clopidogrel + AAS + dipyridamole post-AVC : non recommandée"
     ],
     [
      "Efient",
      "Coumariniques : « ne doivent pas être utilisés ensemble ». AINS au long cours : prudence. IPP et anti-H2 : sans restriction clinique (phase III menée sans en tenir compte). Peu sensible aux inhibiteurs/inducteurs du CYP"
     ],
     [
      "Brilique",
      "<b>CI</b> : inhibiteurs puissants du CYP3A4 (kétoconazole, clarithromycine, néfazodone, ritonavir, atazanavir). Inducteurs (rifampicine, carbamazépine, phénytoïne, <b>millepertuis</b>) : perte d'efficacité possible. Simvastatine : exposition +81 %. Substrats étroits du CYP3A4 (ergotamine, cisapride) : non recommandés. Digoxine : surveiller"
     ]
    ]
   },
   "warn": [
    "Toute la classe saigne davantage avec AINS, autres antiagrégants, anticoagulants et ISRS/IRSN — l'addition se fait aussi avec ce que le patient s'achète seul (croisements OTC ci-dessous)."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Grossesse",
      "AAS : <b>CI au 3ᵉ trimestre</b> (risque malformatif discuté avant). Clopidogrel : « uniquement lorsque l'indication est indispensable ». Efient : prudence, aucune étude clinique. Brilique : « sauf nécessité absolue »"
     ],
     [
      "Allaitement",
      "Efient : métabolites excrétés dans le lait, risque non exclu. Brilique : passage inconnu. Clopidogrel : passage démontré chez le rat"
     ],
     [
      "Personne âgée",
      "Efient « en général non recommandé » dès <span class='dose'>75 ans</span> (saignements). Pour les autres : pas de seuil d'âge dans les rubriques extraites"
     ],
     [
      "Rein",
      "AAS : CI si ClCr <<span class='dose'>30</span>. Clopidogrel, prasugrel, ticagrélor : pas de seuil rénal dans les rubriques extraites — consulter l'IP complète en cas d'insuffisance sévère"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Efient chez un patient avec antécédent d'AVC ou d'AIT au dossier — CI formelle de l'IP",
      "Brilique co-prescrit avec kétoconazole, clarithromycine, néfazodone, ritonavir ou atazanavir — CI de l'IP",
      "Aspirine Cardio malgré un antécédent connu de bronchospasme aux AINS, un ulcère actif, ou du méthotrexate ≥<span class='dose'>15 mg/sem</span>"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Clopidogrel prescrit avec oméprazole ou ésoméprazole : proposer le passage au pantoprazole, documenter la réponse",
      "Efient chez un patient de ≥<span class='dose'>75 ans</span> sans mention d'une décision assumée",
      "Bithérapie qui se prolonge nettement au-delà de la durée attendue sans confirmation au dossier, ou antiagrégant + anticoagulant sans contexte documenté",
      "Brilique sans AAS associé, sans CI expliquant son absence"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Dyspnée rapportée sous Brilique : souvent légère et transitoire selon l'IP, mais à faire évaluer si elle persiste — noter, informer",
      "ISRS prescrit avec un antiagrégant : rappeler les signes de saignement",
      "Automédication AINS découverte chez un patient sous Aspirine Cardio : expliquer l'antagonisme du même jour, proposer le paracétamol",
      "Patient qui envisage d'arrêter avant un soin dentaire ou une opération : ne jamais arrêter seul — c'est le prescripteur qui décide"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Monothérapie stable ou DAPT dans sa fenêtre prévue, sans co-médication nouvelle"
     ]
    }
   ],
   "warn": [
    "Calibrage : comme pour R1, le V2 vise l'incohérence visible au comptoir — la durée d'une DAPT et l'équilibre ischémie/saignement restent des décisions cardiologiques."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "Aspirine Cardio est <b>gastro-résistante</b> : avaler entière, ne pas écraser ni croquer, avec un peu de liquide, idéalement une demi-heure avant le repas (IP).",
    "Clopidogrel oublié : moins de <span class='dose'>12 h</span> de retard → prendre la dose, puis reprendre l'horaire habituel ; plus de 12 h → attendre la prochaine, <b>sans doubler</b> (IP).",
    "Efient : pendant ou entre les repas, comprimé <b>entier</b>. Brilique : deux prises par jour, régulières ; il existe un comprimé orodispersible.",
    "Sous Brilique, un essoufflement nouveau est un effet connu, souvent passager — le signaler au médecin plutôt que d'arrêter.",
    "Les mêmes réflexes que sous anticoagulant : signes de saignement à connaître, informer chaque soignant, jamais d'AINS ni d'aspirine <i>supplémentaire</i> en automédication, et <b>jamais d'arrêt sans avis</b> — surtout avec un stent."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiches T2 et 14 — l'ibuprofène ou le naproxène pris <b>le même jour</b> que l'Aspirine Cardio peuvent en réduire l'effet cardioprotecteur (IP) : chez le coronarien, antalgie par paracétamol d'abord.",
    "<b>Millepertuis</b> : inducteur qui peut faire perdre son efficacité au ticagrélor (IP Brilique) — même réflexe d'anamnèse qu'en fiche R1.",
    "IPP en automédication chez un patient sous clopidogrel : orienter vers le <b>pantoprazole</b>, pas l'oméprazole (IP Plavix) — croisement à reprendre dans la future fiche IPP (R14).",
    "Fiche R1 — les cumuls antiagrégant + anticoagulant et leurs signes d'alerte communs."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des quatre spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5. À revérifier régulièrement."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Aspirine Cardio® 100/300 (Bayer), mise à jour 03.2026 — indications, CI (asthme AINS, ulcère, MICI, ClCr <30, NYHA III–IV, MTX ≥15, 3ᵉ trimestre), interactions (ibuprofène/naproxène même jour, ISRS), gastro-résistance, présentation [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Plavix® (Sanofi), mise à jour 09.2022 — posologie et règle des 12 h, CI, CYP2C19 (IPP : pantoprazole), triple association post-AVC, arrêt 7 j préopératoire",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Efient® (Leman SKL), mise à jour 04.2025 — CI antécédent AVC/AIT, ≥75 ans non recommandé en général, coumariniques exclus, 15 mois conseillés, arrêt 7 j",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Brilique® 60/90 (AstraZeneca), mise à jour 11.2025 — CI CYP3A4 puissants et hémorragie intracrânienne, AAS obligatoire 75–150, ≥12 mois puis 60 mg, dyspnée, millepertuis, arrêt 7 j",
      "31.08.2026"
     ],
     [
      "Constat de marché",
      "Asasantine (AAS + dipyridamole) : aucune information professionnelle trouvée dans l'AIPS au 31.08.2026 — association considérée comme non commercialisée en Suisse",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5. Critère de poids pour Efient 5 mg : non retrouvé dans l'IP suisse, volontairement non repris",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r3": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Un antibiotique systémique ne part <b>jamais</b> sans ordonnance : l'art. 45 al. 4 OMéd les exclut explicitement de la remise B par le pharmacien (fiches T1 et T4) — même Uvamin, pourtant en catégorie B. Toutes les IP rappellent de « tenir compte des recommandations officielles » sur les résistances : une cure = une indication, une durée, une fin.",
    "Sélection de comptoir pour la saison (angine, otite, pneumonie, cystite) — les autres classes viendront avec leurs fiches :"
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Terrain type (IP)",
     "Cat.",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Amoxi-Mepha (cpr, susp. péd.)",
      "amoxicilline",
      "ORL (otite, angine strep), pneumonie, urinaire",
      "<span class='cat cat-A'>A</span>",
      "08.2024"
     ],
     [
      "Augmentin 625 mg / 1 g",
      "amoxicilline + ac. clavulanique",
      "Germes producteurs de β-lactamase — ORL, respiratoire bas",
      "<span class='cat cat-A'>A</span>",
      "03.2026"
     ],
     [
      "Klacid 250/500",
      "clarithromycine",
      "Respiratoire (pneumonie atypique), alternative macrolide",
      "<span class='cat cat-A'>A</span>",
      "04.2025"
     ],
     [
      "Ciproxine 250/500/750",
      "ciprofloxacine",
      "Réservée : « que lorsque d'autres antibiotiques » ne conviennent pas dans les infections non compliquées (IP)",
      "<span class='cat cat-A'>A</span>",
      "08.2025"
     ],
     [
      "Uvamin retard",
      "nitrofurantoïne",
      "Cystite — <span class='dose'>7–10 j</span>",
      "<span class='cat cat-B'>B</span>",
      "07.2025"
     ],
     [
      "Monuril 3 g",
      "fosfomycine",
      "Cystite non compliquée — <b>dose unique</b>",
      "<span class='cat cat-A'>A</span>",
      "11.2022"
     ]
    ]
   },
   "warn": [
    "Catégorie A pour cinq des six : ordonnance non renouvelable sans autorisation expresse (OMéd art. 41, fiche T4) — le « comme la dernière fois » n'existe pas pour un antibiotique."
   ]
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Allergie au dossier</b> — hypersensibilité aux pénicillines <b>ou aux céphalosporines</b> = CI d'Amoxi et d'Augmentin (croisée) ; une vraie réaction immédiate documentée arrête la validation",
    "<b>Augmentin a une CI à lui</b> — antécédent d'ictère ou d'atteinte hépatique lors d'un traitement antérieur par Augmentin (IP)",
    "<b>Mononucléose</b> — sous amoxicilline, exanthème quasi constant (>90 % selon l'IP) : une « angine » du jeune adulte fatigué mérite la question",
    "<b>Klacid : balayer la liste des CI</b> — simvastatine et lovastatine, colchicine, dompéridone, quétiapine, pimozide, cisapride, ergotamine, midazolam oral, antécédent de QT long (IP) — c'est la CI la plus dense de la fiche",
    "<b>Ciproxine : trois verrous</b> — pas avant la fin de la croissance, CI en grossesse et allaitement, CI avec la tizanidine ; et l'IP la réserve aux cas où les antibiotiques usuels ne conviennent pas",
    "<b>Uvamin : le rein d'abord</b> — CI si TFGe <<span class='dose'>45 ml/min</span>, en fin de grossesse, chez le nourrisson <3 mois, en cas de déficit en G6PD ; pas avant 12 ans",
    "<b>Durées cohérentes</b> — Uvamin <span class='dose'>7–10 j</span> en aigu, Monuril en dose unique, Ciproxine « au moins 3 jours après l'arrêt de la fièvre » : une quantité qui ne colle pas à la durée se clarifie"
   ]
  },
  {
   "t": "Interactions majeures — lignes rouges par produit",
   "open": true,
   "p": [
    "Rubriques « Interactions » des IP suisses (AIPS). <b>Liste non exhaustive</b> — logiciel d'officine et IP complètes font foi."
   ],
   "table": {
    "head": [
     "Produit",
     "Ce que dit son IP"
    ],
    "rows": [
     [
      "Amoxicilline / Augmentin",
      "<b>AVK</b> : INR augmenté rapporté — surveiller étroitement à l'introduction <b>et à l'arrêt</b> (fiche R1). Allopurinol : exanthèmes plus fréquents. Méthotrexate : excrétion réduite, toxicité majorée. Contraceptifs oraux : efficacité possiblement diminuée (flore intestinale) — l'IP le dit encore. Probénécide : déconseillé"
     ],
     [
      "Klacid",
      "<b>CI</b> : simvastatine/lovastatine (rhabdomyolyse), colchicine (décès rapportés, surtout âgés et insuffisants rénaux), ergotamine (vasospasmes), dompéridone/quétiapine/pimozide/cisapride (QT), midazolam oral. Warfarine : hémorragies sévères rapportées, INR à surveiller fréquemment ; prudence aussi avec dabigatran, rivaroxaban, apixaban, édoxaban (fiche R1). Atorvastatine : taux augmentés — préférer une statine hors CYP3A4"
     ],
     [
      "Ciproxine",
      "<b>Chélation</b> : fer, sucralfate, antiacides et produits contenant magnésium, aluminium ou calcium réduisent fortement l'absorption — espacer les prises. Inhibiteur du CYP1A2 : prudence avec théophylline, clozapine, duloxétine (et la caféine). Tizanidine : CI"
     ],
     [
      "Uvamin / Monuril",
      "Pas de ligne rouge d'interaction majeure dans les rubriques extraites — leurs verrous sont rénaux et de terrain (voir points de contrôle)"
     ]
    ]
   },
   "warn": [
    "Fluoroquinolones : l'IP de Ciproxine ouvre sur des effets indésirables « graves, potentiellement irréversibles » — tendinites et ruptures tendineuses en tête. Toute douleur tendineuse sous quinolone = arrêt et avis médical, pas d'attentisme."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Grossesse",
      "Amoxi : prudence (pas d'étude contrôlée). Augmentin : pas d'effet tératogène animal ; réserve en cas de rupture prématurée des membranes. Klacid : expériences insuffisantes, effets délétères non exclus. Ciproxine : <b>ne pas administrer</b>. Uvamin : <b>CI au dernier trimestre</b> (anémie hémolytique). Monuril : données limitées au 1ᵉʳ trimestre, sans signal à ce jour"
     ],
     [
      "Allaitement",
      "Amoxi passe dans le lait (effets possibles chez le nourrisson). Ciproxine : ne pas administrer. Uvamin : lié au risque G6PD néonatal"
     ],
     [
      "Enfants",
      "Ciproxine : pas avant la fin de la croissance (cartilages). Uvamin : pas avant 12 ans, CI <3 mois. Monuril : pas avant 12 ans. Amoxi : suspension pédiatrique avec pipette doseuse"
     ],
     [
      "Rein",
      "Uvamin : CI si TFGe <<span class='dose'>45</span>. Monuril : non recommandé si ClCr <<span class='dose'>10</span>. Klacid + colchicine : toxicité surtout chez l'insuffisant rénal"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Réaction allergique immédiate documentée aux pénicillines/céphalosporines, et l'ordonnance porte une β-lactamine",
      "Klacid co-prescrit avec simvastatine, colchicine, dompéridone ou un autre médicament de sa liste de CI",
      "Ciproxine chez une patiente enceinte ou un adolescent en croissance ; Uvamin avec TFGe connue <<span class='dose'>45</span> ou grossesse à terme ; Augmentin après ictère documenté sous Augmentin"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Quinolone en première intention d'une infection banale non compliquée — l'IP elle-même la réserve aux échecs des traitements usuels",
      "Klacid chez un patient anticoagulé (warfarine ou AOD) sans plan de surveillance — ou proposer l'alternative discutée avec le prescripteur",
      "Amoxicilline à dose élevée chez un patient sous méthotrexate",
      "Durée ou quantité incohérente avec l'indication apparente (boîte entière pour une dose unique, cure de 3 jours pour une pneumonie)"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Patient sous AVK : contrôle INR rapproché à l'introduction <b>et à la fin</b> de l'antibiotique (fiche R1), note au dossier",
      "Contraception orale + amoxicilline : recommander une précaution complémentaire pendant la cure (IP)",
      "Allopurinol + amoxicilline : prévenir du risque d'éruption — la signaler plutôt que l'ignorer",
      "Ciproxine : espacer fer, antiacides, calcium ; arrêter et consulter en cas de douleur tendineuse",
      "Mononucléose suspectée sous amoxicilline : l'éruption attendue n'est pas une allergie — mais c'est le médecin qui requalifie"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Cure standard, terrain sans particularité : le conseil de la section suivante suffit"
     ]
    }
   ],
   "warn": [
    "Calibrage : le choix de la molécule et de la durée appartient au prescripteur — le V2 « quinolone en première intention » se formule comme une question de sécurité (IP à l'appui), pas comme une leçon d'antibiothérapie."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "<b>La cure se termine</b> — même si ça va mieux avant ; Ciproxine se poursuit « au moins 3 jours après l'arrêt de la fièvre » (IP). Les restes ne se gardent pas : retour à la pharmacie.",
    "Suspension pédiatrique d'amoxicilline : reconstituée, elle vit <b>au réfrigérateur, 14 jours maximum</b> (IP) — noter la date d'ouverture sur le flacon, agiter, utiliser la pipette fournie.",
    "Augmentin se prend <b>au début du repas</b> : meilleure résorption et moins de nausées (IP). Uvamin : pendant ou juste après le repas. Monuril : <b>à jeun</b> (2–3 h d'un repas), de préférence le soir, <b>après avoir vidé la vessie</b>, sachet dissous dans un verre d'eau (IP).",
    "Ciproxine ne se prend pas en même temps que fer, antiacides ou calcium — espacer les prises.",
    "Effets attendus et gérables : selles molles, mycose possible en fin de cure. Diarrhée sévère ou sanglante, éruption fébrile, douleur tendineuse (quinolone) : consulter.",
    "Fièvre qui remonte après amélioration ou absence d'amélioration à 48–72 h : recontacter le médecin — renvois vers les fiches OTC pour l'accompagnement symptomatique."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiches 3 et 5 — angine et otite : le volet OTC porte le triage <i>avant</i> l'antibiotique (angine strep de l'enfant : traitement symptomatique sans antibiotique selon PIGS) ; R3 prend le relais <i>après</i> la prescription.",
    "Fiche 8 — la fièvre qui revient après un mieux : c'est aussi le signal d'échec de cure à donner au patient.",
    "Fiche T2 / fiche 1 — l'accompagnement symptomatique (paracétamol en premier) pendant la cure, dans les plafonds connus.",
    "Fiche R1 — amoxicilline, Augmentin et Klacid chez l'anticoagulé : INR à resserrer, prudence AOD.",
    "Antiacides, fer, calcium et magnésium du libre accès × Ciproxine : la chélation se joue au comptoir — vérifier l'automédication avant la remise.",
    "Dompéridone (nausées, cat. B) × Klacid : contre-indiqué — le réflexe vaut aussi quand c'est le comptoir qui remet la dompéridone."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des six spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Amoxi-Mepha (Mepha), mise à jour 08.2024 — indications, CI mononucléose, interactions (AVK/INR, allopurinol, MTX, contraceptifs), suspension 14 j au réfrigérateur, présentation [A]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Augmentin cpr (GSK), mise à jour 03.2026 — CI ictère antérieur sous Augmentin, prise en début de repas, interactions, présentation [A]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Klacid comprimés (Viatris), mise à jour 04.2025 — CI simvastatine/lovastatine, colchicine, dompéridone, quétiapine, ergot, midazolam oral, QT ; warfarine et AOD ; présentation [A]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Ciproxine (Bayer), mise à jour 08.2025 — usage réservé dans le non-compliqué, CI grossesse/allaitement/croissance/tizanidine, chélation cations, CYP1A2, tendinopathies, présentation [A]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Uvamin retard (Mepha), mise à jour 07.2025 — CI TFGe <45, G6PD, fin de grossesse, <3 mois ; 7–10 j ; prise au repas ; présentation [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Monuril 3 g (Zambon), mise à jour 11.2022 — dose unique, à jeun le soir vessie vidée, <12 ans non, ClCr <10 non recommandé, présentation [A]",
      "31.08.2026"
     ],
     [
      "Note de sélection",
      "Fiche limitée à six molécules de saison — les IP des autres antibiotiques ambulatoires (céphalosporines, doxycycline, cotrimoxazole…) seront sourcées au besoin, même méthode",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r4": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Sélection ambulatoire : trois ISRS, deux IRSN, une tétracyclique sédative — tous en catégorie <span class='cat cat-B'>B</span>. Point commun de classe : <b>IMAO contre-indiqués partout</b> (fenêtre de deux semaines dans les deux sens, linézolide et bleu de méthylène inclus selon les IP), effet en 2 à 4 semaines, et arrêt toujours progressif."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Posologie (IP)",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Cipralex (+ génériques)",
      "escitalopram",
      "<span class='dose'>10 mg</span>/j, max <span class='dose'>20 mg</span>",
      "04.2026"
     ],
     [
      "Sertralin-Mepha (et al.)",
      "sertraline",
      "<span class='dose'>50 mg</span>/j, paliers ≤50 mg/sem, max <span class='dose'>200 mg</span>",
      "08.2025"
     ],
     [
      "Deroxat (+ génériques)",
      "paroxétine",
      "<span class='dose'>20 mg</span>/j, max <span class='dose'>50 mg</span> (60 mg panique)",
      "09.2025"
     ],
     [
      "Efexor ER (+ génériques)",
      "venlafaxine",
      "<span class='dose'>75 mg</span>/j, max <span class='dose'>225 mg</span> (375 mg cas justifiés)",
      "05.2023"
     ],
     [
      "Duloxetin-Mepha (et al.)",
      "duloxétine",
      "gélules gastro-résistantes, arrêt sur 1–2 semaines",
      "12.2024"
     ],
     [
      "Remeron (+ génériques)",
      "mirtazapine",
      "prise vespérale ; poursuivre 6 mois après rémission",
      "06.2021"
     ]
    ]
   }
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Pas d'IMAO dans le décor</b> — y compris les déguisés : linézolide (antibiotique) et bleu de méthylène sont nommés par les IP",
    "<b>Escitalopram : penser QT</b> — CI si QT long connu ou congénital, et CI avec tout médicament allongeant le QT ; femmes, hypokaliémie et cardiopathies en tête des cas rapportés (torsades)",
    "<b>Duloxétine : trois verrous propres</b> — CI avec les inhibiteurs du CYP1A2 (<b>ciprofloxacine</b> — fiche R3 —, fluvoxamine, énoxacine), CI si ClCr <<span class='dose'>30</span>, CI si HTA non équilibrée",
    "<b>Paroxétine : deux croisements qui tuent l'efficacité d'autrui</b> — tamoxifène (« on renoncera à la paroxétine » pendant le traitement, IP) ; et CI avec thioridazine/pimozide (QT + CYP2D6)",
    "<b>Sertraline</b> — CI pimozide, épilepsie instable, insuffisance hépatique sévère",
    "<b>Moins de 18 ans</b> — Efexor ER et Remeron : ne doivent pas être prescrits (CI/mise en garde explicites) ; comportement suicidaire accru sous antidépresseurs dans les études pédiatriques",
    "<b>Dose max et paliers respectés</b> — les IP donnent des bornes nettes (tableau ci-dessus) : une ordonnance au-delà se clarifie, une escalade trop rapide aussi"
   ]
  },
  {
   "t": "Interactions majeures — les trois registres de la classe",
   "open": true,
   "p": [
    "Rubriques « Interactions » des IP suisses. <b>Liste non exhaustive</b> — logiciel d'officine et IP complètes font foi."
   ],
   "table": {
    "head": [
     "Registre",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Syndrome sérotoninergique",
      "Association à d'autres sérotoninergiques : autres ISRS/IRSN, <b>triptans</b>, tricycliques, lithium — et côté comptoir : <b>tramadol</b> (fiche R7 à venir) et sympathomimétiques <b>y compris pseudoéphédrine</b> (IP Deroxat). Tableau potentiellement fatal (IP sertraline)"
     ],
     [
      "Hémorragie",
      "Saignements anormaux rapportés sous ISRS — des ecchymoses aux hémorragies d'issue fatale ; prudence accrue avec AINS, antiagrégants et anticoagulants (fiches T2, R1, R2), et risque d'hémorragie du post-partum (IP sertraline)"
     ],
     [
      "Cytochromes",
      "Paroxétine (et fluoxétine) : inhibiteurs puissants du CYP2D6 — tamoxifène neutralisé, thioridazine/pimozide CI. Duloxétine : victime du CYP1A2 (ciprofloxacine CI). Escitalopram : additions de QT. Millepertuis : prudence sérotoninergique (IP sertraline) — encore lui"
     ]
    ]
   },
   "warn": [
    "L'hyponatrémie sous ISRS (sécrétion inappropriée d'ADH) vise particulièrement la <b>femme âgée</b> (IP Cipralex) — confusion, chutes, fatigue inexpliquée sous diurétiques : y penser au comptoir, c'est un motif de contact médical."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Grossesse — 1ᵉʳ trimestre",
      "Paroxétine : risque accru de malformations congénitales, <b>en particulier cardiovasculaires</b> (études épidémiologiques citées par l'IP) — la question se pose avant la prescription, pas au comptoir"
     ],
     [
      "Grossesse — fin",
      "Exposition tardive aux ISRS : risque d'<b>hypertension pulmonaire persistante du nouveau-né</b> (HTAPP) et de complications périnatales ; hémorragie du post-partum (ISRS/IRSN)"
     ],
     [
      "Enfants / ados",
      "Efexor ER : CI <18 ans. Remeron : ne pas traiter <18 ans. Pour toute la classe : signaux suicidaires accrus chez les jeunes en début de traitement"
     ],
     [
      "Personne âgée",
      "Hyponatrémie (ISRS), sédation et chutes (mirtazapine) ; escitalopram : dose réduite recommandée — vérifier l'IP au cas par cas"
     ],
     [
      "Rein / foie",
      "Duloxétine : CI si ClCr <<span class='dose'>30</span> et si insuffisance hépatique. Sertraline : CI si Child C. Mirtazapine : clairance diminuée si IR modérée à sévère"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "IMAO (ou linézolide) au dossier avec n'importe quel produit de la fiche — CI de classe",
      "Duloxétine co-prescrite avec ciprofloxacine ou fluvoxamine, ou chez une ClCr connue <<span class='dose'>30</span> — CI de l'IP",
      "Escitalopram avec QT long documenté ou co-prescription torsadogène connue ; paroxétine avec tamoxifène, thioridazine ou pimozide",
      "Efexor ER ou Remeron prescrits à un mineur"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Dose au-dessus du maximum de l'IP (escitalopram >20 mg, sertraline >200 mg, paroxétine >50–60 mg) sans justification visible",
      "Deux sérotoninergiques puissants d'ordonnances différentes (ISRS + tramadol, ISRS + triptan quotidien) sans plan documenté",
      "Escitalopram chez un patient cumulant hypokaliémie, diurétiques et autres allongeurs de QT"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "AINS ou aspirine en automédication chez un patient sous ISRS : expliquer le sur-risque de saignement, orienter vers le paracétamol (fiche T2)",
      "Décongestionnant à la pseudoéphédrine demandé sous paroxétine/ISRS : refuser et expliquer (registre sérotoninergique/sympathomimétique)",
      "Millepertuis à l'anamnèse : faire arrêter, noter — troisième fiche R d'affilée où il pose problème",
      "Premier mois de traitement : rappeler le délai d'action et l'importance de ne pas arrêter seul (le sevrage brutal de paroxétine/venlafaxine se paie)"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Renouvellement stable, sans nouvelle co-médication : conseil de la section suivante"
     ]
    }
   ],
   "warn": [
    "Calibrage : l'indication psychiatrique et la stratégie de traitement ne se discutent pas au comptoir — les V1/V2 de cette fiche sont tous des questions de <b>sécurité médicamenteuse</b>, jamais d'opportunité thérapeutique."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "<b>L'effet vient en 2 à 4 semaines</b> (IP Remeron, valable pour la classe) — les premiers jours peuvent être inconfortables sans que ce soit un échec ; ne pas arrêter sur cette impression.",
    "<b>On n'arrête jamais d'un coup</b> — l'arrêt se prépare avec le médecin, par paliers (duloxétine : 1 à 2 semaines minimum selon l'IP ; paroxétine et venlafaxine sont les plus sensibles au sevrage).",
    "Duloxétine : gélule gastro-résistante, <b>à avaler entière</b>. Mirtazapine : prise du soir, somnolence attendue au début — prudence au volant.",
    "Un traitement qui marche se poursuit : l'IP de Remeron recommande <b>6 mois après la disparition des symptômes</b> avant d'envisager la descente.",
    "Éviter l'automédication qui interfère : AINS et aspirine (saignement), décongestionnants (pseudoéphédrine), millepertuis — demander conseil avant toute nouvelle boîte.",
    "Signaler sans attendre : agitation inhabituelle, fièvre avec tremblements et confusion (syndrome sérotoninergique), idées noires nouvelles — surtout au début et chez les jeunes."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiche T2 / fiche 14 — AINS et aspirine sous ISRS : le registre hémorragique se joue souvent en automédication ; paracétamol en premier.",
    "Fiche 1 — les décongestionnants à la <b>pseudoéphédrine</b> : l'IP de Deroxat les nomme — le rhume du patient sous ISRS se traite autrement (lavage nasal, fiche 1).",
    "<b>Millepertuis</b> (rayon moral/sommeil) : sérotoninergique en plus d'inducteur — c'est la troisième fiche R où il figure ; l'anamnèse OTC le cherche systématiquement.",
    "Fiche R1/R2 — ISRS chez l'anticoagulé ou l'antiagrégé : les mises en garde se cumulent, la note au dossier aussi.",
    "Fiche R3 — ciprofloxacine × duloxétine : CI formelle ; le lien inverse de celui déjà posé dans R3.",
    "Fiche 22 (fatigue post-infectieuse) — la fatigue qui traîne chez un patient sous antidépresseur mérite le différentiel hyponatrémie chez l'aîné."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des six spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Cipralex (Lundbeck), mise à jour 04.2026 — CI QT long et co-prescriptions torsadogènes, max 20 mg, hyponatrémie de la femme âgée, présentation [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Sertralin-Mepha, mise à jour 08.2025 — CI IMAO/pimozide/épilepsie instable/Child C, max 200 mg, saignements sous ISRS, HTAPP et post-partum, millepertuis",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Deroxat (GSK), mise à jour 09.2025 — CI IMAO (linézolide, bleu de méthylène) et thioridazine/pimozide, tamoxifène, triptans et sympathomimétiques dont pseudoéphédrine, malformations cardiovasculaires 1ᵉʳ trimestre, sevrage",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Efexor ER (Viatris), mise à jour 05.2023 — CI <18 ans et IMAO, 75–225 mg (375 justifié), syndrome sérotoninergique",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Duloxetin-Mepha, mise à jour 12.2024 — CI CYP1A2 (ciprofloxacine, fluvoxamine, énoxacine), ClCr <30, insuffisance hépatique, HTA non équilibrée ; arrêt progressif 1–2 semaines",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Remeron (Organon), mise à jour 06.2021 — CI IMAO, <18 ans, effet en 2–4 semaines, 6 mois après rémission, arrêt progressif",
      "31.08.2026"
     ],
     [
      "Note de sélection",
      "Cymbalta : plus d'IP dans l'AIPS au 31.08.2026 — la duloxétine est sourcée via son générique. Fluoxétine, fluvoxamine, citalopram, trazodone, tricycliques : à sourcer au besoin, même méthode",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r5": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Anxiolytiques et hypnotiques, tous en catégorie <span class='cat cat-B'>B</span>. Cadre stupéfiants vérifié dans l'OTStup-DFI (annexe 3 = tableau b, état au 13.03.2026) : lorazépam, oxazépam, alprazolam, diazépam et <b>zolpidem</b> y figurent — la <b>zopiclone n'apparaît dans aucune annexe</b>. Conséquence concrète (OCStup art. 48, fiche T4) : pour les substances du tableau b, la quantité prescrite est plafonnée au besoin d'<span class='dose'>1 mois</span> (<span class='dose'>6 mois</span> au plus si la durée exacte est indiquée), et la remise partielle est possible pendant la validité (art. 51 al. 4) — la zopiclone échappe à ce plafond."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Repères (IP)",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Temesta / Expidet",
      "lorazépam",
      "anxiolytique ; âgé : dose initiale −50 % ; <12 ans : non",
      "11.2022"
     ],
     [
      "Seresta / forte",
      "oxazépam",
      "demi-vie courte, sans métabolite actif — souvent préféré chez l'âgé ; prudence hypotension",
      "06.2026"
     ],
     [
      "Xanax / retard",
      "alprazolam",
      "anxiolytique ; sevrage par paliers ≤<span class='dose'>0,5 mg</span> tous les 3 jours",
      "11.2024"
     ],
     [
      "Valium",
      "diazépam",
      "longue durée d'action ; âgé : dose minimale, surveillance rapprochée",
      "06.2023"
     ],
     [
      "Stilnox",
      "zolpidem",
      "hypnotique ; ≤<span class='dose'>4 semaines</span> arrêt compris ; 1 cpr max/nuit",
      "10.2024"
     ],
     [
      "Imovane",
      "zopiclone",
      "hypnotique ; « généralement pas plus de <span class='dose'>10 jours</span> » ; goût amer connu",
      "11.2025"
     ]
    ]
   }
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Les CI de classe</b> — myasthénie grave, insuffisance respiratoire sévère, syndrome d'apnées du sommeil, insuffisance hépatique sévère (IP Temesta, Xanax, Stilnox, Imovane) ; Temesta ajoute la dépendance active et l'intoxication aiguë",
    "<b>Xanax a une CI que les autres n'ont pas</b> — kétoconazole, itraconazole, autres azolés et inhibiteurs de la protéase : l'association « ne doit pas être faite » (CYP3A4)",
    "<b>Hypnotiques : la durée est dans l'IP</b> — Stilnox ≤<span class='dose'>4 semaines</span> phase d'arrêt comprise, Imovane ≈<span class='dose'>10 jours</span> : un renouvellement d'hypnotique qui s'installe se questionne — c'est l'IP qui le dit, pas le comptoir",
    "<b>Comportements complexes du sommeil</b> — antécédent de somnambulisme sous zolpidem <b>ou</b> zopiclone = CI des deux produits (les IP se citent mutuellement)",
    "<b>Opioïdes au dossier</b> — l'association benzodiazépine/Z-drug + opioïde « peut entraîner une forte sédation, une dépression respiratoire, un coma et la mort » (IP) : doses minimales, durée minimale, surveillance — et fiche R7 à venir",
    "<b>Quantités OCStup</b> — tableau b : plafond d'un mois sauf durée précisée (max 6 mois) ; une ordonnance de 3 boîtes « en réserve » sans durée n'est pas conforme (fiche T4)",
    "<b>Grossesse</b> — Stilnox : CI grossesse et allaitement ; benzodiazépines : risque malformatif discuté au 1ᵉʳ trimestre et syndrome du nouveau-né en fin de grossesse (IP Temesta) — la question se pose à la prescription"
   ]
  },
  {
   "t": "Interactions et terrains à risque",
   "open": true,
   "table": {
    "head": [
     "Registre",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Dépresseurs centraux",
      "Alcool, opioïdes, antipsychotiques, antihistaminiques sédatifs, autres hypnotiques : effets additifs — sédation et dépression respiratoire (IP Seresta, liste complète). L'alcool est l'interaction que le patient ne déclare pas : la nommer"
     ],
     [
      "CYP3A4",
      "Xanax : azolés et inhibiteurs de protéase interdits ; ritonavir même à faible dose réduit fortement la clairance de l'alprazolam"
     ],
     [
      "Personne âgée",
      "Dose initiale réduite de moitié (Temesta), réactions paradoxales (agitation, agressivité — Temesta, Seresta), hypotension et chutes (Seresta), accumulation avec le diazépam : chez l'aîné, la benzodiazépine à demi-vie courte et dose minimale est la règle des IP"
     ],
     [
      "Dépendance",
      "Le risque croît avec la dose et la durée (toutes les IP) ; le zolpidem expose aussi à l'abus et à la dépendance — son statut tableau b n'est pas décoratif"
     ]
    ]
   },
   "warn": [
    "Sevrage : après une utilisation prolongée, « un arrêt brutal peut entraîner des phénomènes de sevrage potentiellement mortels » (IP Temesta). L'arrêt se planifie toujours — Xanax donne même le rythme : ≤<span class='dose'>0,5 mg</span> de réduction tous les 3 jours."
   ]
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Xanax co-prescrit avec un azolé ou un inhibiteur de la protéase — CI de l'IP",
      "Zolpidem ou zopiclone malgré un antécédent documenté de comportement complexe du sommeil sous l'un des deux",
      "Myasthénie, apnées du sommeil ou insuffisance respiratoire sévère connues au dossier avec n'importe quel produit de la fiche",
      "Quantité de tableau b au-delà du plafond OCStup sans durée de traitement indiquée (fiche T4)"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Hypnotique renouvelé bien au-delà des 4 semaines (zolpidem) ou 10 jours (zopiclone) de l'IP, sans stratégie visible — question de sécurité, pas de morale",
      "Benzodiazépine + opioïde nouvellement associés sans mention d'une surveillance",
      "Diazépam pleine dose chez un patient très âgé ou insuffisant hépatique"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Première délivrance : durée prévue, risque de dépendance, et l'alcool nommé explicitement",
      "Personne âgée : prévenir du risque de chute nocturne et de la somnolence du lendemain — noter",
      "Patient qui veut arrêter : jamais d'un coup après usage prolongé — organiser la descente avec le médecin",
      "Conduite : pas de volant tant que la somnolence résiduelle n'est pas évaluée, surtout en début de traitement"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Usage ponctuel cadré, terrain sans signal : conseil de la section suivante"
     ]
    }
   ],
   "warn": [
    "Calibrage : la dépendance se gère mieux par l'alliance que par le refus — un patient dépendant relève d'un projet de sevrage médical (V2/V3 constructifs), pas d'un blocage au comptoir qui l'envoie ailleurs."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "Stilnox se prend <b>au moment de se coucher</b> — pas « après le film » : à distance du repas, déjà au lit ou juste avant, jamais plus d'un comprimé par nuit (IP).",
    "Imovane laisse un <b>goût amer</b> — effet connu et bénin, autant le dire avant.",
    "<b>Pas d'alcool</b> : l'addition sédative est réelle et l'IP la classe parmi les dangers, pas les inconforts.",
    "Somnolence du lendemain : prudence au volant et dans les escaliers — chez l'aîné, la chute nocturne (WC) est le vrai risque.",
    "La durée prévue se dit dès la première boîte : un hypnotique est une béquille de quelques semaines, pas un traitement de fond — et l'arrêt se prépare, jamais brutal.",
    "Comportements nocturnes étranges rapportés par l'entourage (manger, conduire, téléphoner endormi) : arrêter et consulter — c'est une CI pour la suite."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiche T2 — antihistaminiques sédatifs du comptoir (doxylamine et consorts) : addition sédative avec toute la classe ; l'anamnèse « que prenez-vous pour dormir ? » vaut dans les deux sens.",
    "Fiche R4 — antidépresseurs co-prescrits : sédation additive (mirtazapine) et le vrai traitement de fond de l'insomnie anxieuse.",
    "Fiche R7 (à venir) — opioïdes : l'association la plus dangereuse de la fiche ; le tramadol est d'ailleurs lui aussi au tableau b depuis 2023 (Swissmedic).",
    "Fiche T4 — quantités et remise partielle des substances du tableau b : le cadre légal de chaque délivrance de cette fiche.",
    "Alcool — pas une fiche, mais le croisement le plus fréquent : à nommer à chaque première remise."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des six spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Temesta/Expidet (11.2022) — CI de classe, sevrage potentiellement mortel, âgé −50 %, opioïdes, grossesse ; présentation [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisses Seresta/forte (06.2026) et Valium (06.2023) — dépresseurs centraux additifs, réactions paradoxales, hypotension/chutes, âgé dose minimale ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Xanax/retard (11.2024) — CI azolés et inhibiteurs de protéase, paliers de sevrage 0,5 mg/3 j ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Stilnox (10.2024) — ≤4 semaines arrêt compris, CI grossesse/allaitement et comportements complexes du sommeil, prise au coucher, abus/dépendance ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Imovane (11.2025) — ~10 jours, CI croisée comportements du sommeil (zolpidem/zopiclone), goût amer, opioïdes ; [B]",
      "31.08.2026"
     ],
     [
      "Fedlex",
      "OTStup-DFI, RS 812.121.11, état au 13.03.2026, annexe 3 (tableau b) — lorazépam, oxazépam, alprazolam, diazépam, zolpidem inscrits ; zopiclone absente de toutes les annexes (1–8, vérifié)",
      "31.08.2026"
     ],
     [
      "Swissmedic",
      "Page « Stupéfiants autorisés » — confirmation annexe 3 = liste b (mention du tramadol, incorporé le 01.03.2023)",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r6": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Atypiques en tête (quétiapine loin devant au comptoir), un classique (halopéridol), et un cas à part : la <b>clozapine</b>, seule en catégorie <span class='cat cat-A'>A</span> — ordonnance non renouvelable sans autorisation expresse (fiche T4) — et seule à conditionner sa délivrance à des analyses de sang régulières."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Repères (IP)",
     "Cat.",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Seroquel / XR (+ génériques)",
      "quétiapine",
      "l'atypique le plus délivré ; sédation, métabolique",
      "<span class='cat cat-B'>B</span>",
      "non affichée (AIPS)"
     ],
     [
      "Zyprexa / Velotab (+ gén.)",
      "olanzapine",
      "métabolique au premier plan (glycémie, poids)",
      "<span class='cat cat-B'>B</span>",
      "02.2020"
     ],
     [
      "Risperdal (+ génériques)",
      "rispéridone",
      "solution buvable pour titrations fines (0,25 mg)",
      "<span class='cat cat-B'>B</span>",
      "03.2026"
     ],
     [
      "Aripiprazol-Mepha (et al.)",
      "aripiprazole",
      "profil métabolique plus léger ; comprimés et sirop",
      "<span class='cat cat-B'>B</span>",
      "06.2022"
     ],
     [
      "Haldol",
      "halopéridol",
      "le champion des CI cardiaques — voir points de contrôle",
      "<span class='cat cat-B'>B</span>",
      "11.2024"
     ],
     [
      "Leponex",
      "clozapine",
      "schizophrénie résistante ; surveillance hématologique obligatoire",
      "<span class='cat cat-A'>A</span>",
      "06.2026"
     ]
    ]
   }
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Haldol : balayer le cœur</b> — CI si QTc allongé ou QT long congénital, antécédent de torsades, hypokaliémie non corrigée, infarctus récent, insuffisance cardiaque décompensée, et <b>toute co-prescription allongeant le QT</b> ; CI aussi : syndrome parkinsonien, démence à corps de Lewy",
    "<b>Quétiapine : la CI que R3 annonçait</b> — inhibiteurs puissants du CYP3A4 <b>contre-indiqués</b> : clarithromycine, érythromycine, azolés, inhibiteurs de protéase, néfazodone (kétoconazole : AUC ×5–8). Le miroir exact de la CI Klacid×quétiapine",
    "<b>Leponex : les verrous absolus</b> — patient « ne pouvant pas être soumis à des analyses de sang régulières » = CI en soi ; antécédent d'agranulocytose (clozapine ou autre), troubles médullaires, épilepsie non contrôlée, iléus, myocardite : la liste se lit en entier avant toute première délivrance",
    "<b>Leponex : la surveillance est une condition de remise</b> — numération dans les 10 jours avant l'instauration, puis suivi régulier du taux de neutrophiles pendant tout le traitement : sans preuve de suivi au dossier, la boîte ne part pas",
    "<b>Rispéridone chez le dément</b> — CI si parkinsonisme ou corps de Lewy probables ; l'indication « agressivité de l'Alzheimer » est bornée à <span class='dose'>12 semaines</span> par l'IP — un renouvellement au long cours interroge",
    "<b>Le terrain métabolique</b> — olanzapine (et quétiapine) : glycémie et poids ; chez le diabétique, l'IP de Zyprexa exige une pesée bénéfice/risque explicite",
    "<b>Parkinson au dossier</b> — Haldol CI, et l'halopéridol « peut atténuer l'action de la lévodopa » : un antipsychotique chez un parkinsonien se clarifie toujours"
   ]
  },
  {
   "t": "Interactions majeures",
   "open": true,
   "table": {
    "head": [
     "Produit",
     "Ce que dit son IP"
    ],
    "rows": [
     [
      "Quétiapine",
      "<b>CI</b> : inhibiteurs puissants du CYP3A4 (clarithromycine, érythromycine, azolés, inhibiteurs de protéase, néfazodone)"
     ],
     [
      "Halopéridol",
      "<b>CI</b> : tout médicament allongeant le QT (escitalopram de R4, macrolides de R3, dompéridone…) ; atténue lévodopa et agonistes dopaminergiques"
     ],
     [
      "Clozapine",
      "Fluvoxamine : taux <b>jusqu'à ×10</b> ; ciprofloxacine et autres inhibiteurs du CYP1A2 : élévation marquée (fiche R3) ; et la <b>caféine</b> est un substrat concurrent — 5 jours sans café font chuter les taux d'environ 50 % : tout changement d'habitude café/thé compte"
     ],
     [
      "Olanzapine",
      "Le <b>tabagisme</b> accélère son métabolisme (demi-vie plus longue chez le non-fumeur) : arrêt ou reprise du tabac = taux qui bougent"
     ],
     [
      "Classe",
      "Dépresseurs centraux additifs — alcool, benzodiazépines (fiche R5), opioïdes ; hypotension orthostatique cumulée avec les antihypertenseurs (fiche R8 à venir)"
     ]
    ]
   },
   "warn": [
    "Liste <b>non exhaustive</b> — logiciel d'officine et IP complètes font foi. Le tabac et le café ne sont pas dans le logiciel : ils sont dans l'anamnèse."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Personne âgée démente",
      "Mortalité globale augmentée sous atypiques (méta-analyse citée par l'IP Risperdal : 4,0 % vs 3,1 % sous placebo) ; Seroquel « n'est pas homologué » chez le dément âgé ; Haldol CI si corps de Lewy"
     ],
     [
      "Grossesse — 3ᵉ trimestre",
      "Nouveau-nés exposés aux antipsychotiques : risque de symptômes extrapyramidaux et de sevrage néonatal (IP Risperdal, formulation de classe)"
     ],
     [
      "Diabétique",
      "Olanzapine : hyperglycémies parfois graves rapportées (acidocétose, coma hyperosmolaire) — prescription après évaluation explicite"
     ],
     [
      "Prostate / glaucome",
      "Clozapine anticholinergique : surveillance étroite si hypertrophie prostatique ou glaucome à angle fermé ; la constipation sous clozapine se dépiste tôt (risque d'iléus)"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Haldol avec un allongeur de QT au dossier, un QT long connu ou une hypokaliémie non corrigée — CI de l'IP",
      "Quétiapine co-prescrite avec clarithromycine, azolé ou inhibiteur de protéase — CI de l'IP (et de celle de Klacid, fiche R3)",
      "Leponex sans preuve de suivi hématologique, ou malgré un antécédent d'agranulocytose — les deux sont des CI",
      "Haldol ou Risperdal chez un dément parkinsonien ou à corps de Lewy documenté"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Rispéridone « pour l'agitation » qui dépasse largement les 12 semaines de l'IP chez un dément, sans réévaluation visible",
      "Ciprofloxacine ou fluvoxamine ajoutées sous clozapine — l'élévation des taux se gère en amont, pas après coup",
      "Olanzapine instaurée chez un diabétique sans trace de l'évaluation exigée par l'IP"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Sous clozapine : demander la date de la dernière prise de sang, rappeler que fièvre ou angine = consultation immédiate (agranulocytose), noter",
      "Changement d'habitude tabac ou café signalé sous clozapine/olanzapine : prévenir que les taux bougent, suggérer d'en parler au prescripteur",
      "Somnolence et hypotension orthostatique : lever en deux temps, prudence au volant — surtout en début de traitement",
      "Constipation sous clozapine : ne pas banaliser, la signaler tôt"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Traitement stable, suivi en place, pas de co-médication nouvelle"
     ]
    }
   ],
   "warn": [
    "Calibrage : comme en R4, tout ce qui touche à l'indication psychiatrique reste hors du comptoir — les V1/V2 de cette fiche sont cardiologiques, hématologiques ou pharmacocinétiques, jamais psychiatriques."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "La somnolence du début s'atténue souvent ; en attendant : pas de volant si elle persiste, et se lever en deux temps (l'hypotension orthostatique fait chuter).",
    "Sous Leponex : <b>les prises de sang font partie du traitement</b> — sans elles, la pharmacie ne peut pas délivrer ; et toute fièvre ou angine se signale au médecin le jour même.",
    "Café et tabac ne sont pas anodins ici : tout changement notable d'habitude mérite d'être signalé (clozapine, olanzapine).",
    "Poids et soif inhabituelle : en parler au suivi — le contrôle métabolique fait partie du traitement (olanzapine, quétiapine).",
    "Ne jamais arrêter seul : l'arrêt se planifie avec le prescripteur, comme pour les fiches R4 et R5.",
    "L'alcool s'additionne à la sédation — même message qu'en R5, même sincérité requise."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiche R3 — le miroir est bouclé : Klacid CI quétiapine (IP Klacid) et quétiapine CI clarithromycine (IP Seroquel) — deux sources indépendantes, même verrou.",
    "Fiche R4 — escitalopram et autres allongeurs de QT × Haldol : la CI se joue entre ordonnances de prescripteurs différents — c'est le comptoir qui voit tout.",
    "Fiche R5 — benzodiazépines co-prescrites : sédation additive, chutes de l'âgé.",
    "Dompéridone (cat. B, conseil antinauséeux) × Haldol : allongeur de QT — même réflexe qu'avec Klacid en R3.",
    "Le café du patient sous clozapine : probablement le seul endroit du fichier où « combien de tasses par jour ? » est une question de pharmacovigilance.",
    "Laxatifs OTC chez le patient sous clozapine : une demande répétée est un signal (constipation anticholinergique) — orienter vers le suivi, pas seulement vers le rayon."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des six spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Seroquel (date de mise à jour non affichée dans l'AIPS) — CI CYP3A4 puissants (clarithromycine, azolés, IP VIH), kétoconazole AUC ×5–8, non homologué démence âgée ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Zyprexa cpr/Velotab (02.2020) — hyperglycémies graves rapportées, diabétique, tabagisme et demi-vie ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Risperdal (03.2026) — CI démence parkinsonienne/corps de Lewy, mortalité accrue du dément (4,0 % vs 3,1 %), indication Alzheimer bornée à 12 semaines, 3ᵉ trimestre ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Aripiprazol-Mepha (06.2022) — formes comprimés et sirop ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Haldol (11.2024) — CI cardiaques complètes (QT, torsades, hypokaliémie, co-prescriptions), Parkinson et corps de Lewy, lévodopa ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Leponex (06.2026) — CI analyses impossibles/agranulocytose/iléus/myocardite, numération avant instauration puis suivi ANC, fluvoxamine ×10, ciprofloxacine, caféine −50 %, constipation ; [A]",
      "31.08.2026"
     ],
     [
      "Note de sélection",
      "Formes dépôt (Risperdal Consta, Abilify Maintena/Asimtufii, Haldol decanoas) écartées : hors circuit du comptoir ambulatoire courant — à sourcer si besoin",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r7": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Trois régimes légaux cohabitent dans la même classe — tous vérifiés dans les IP et l'OTStup-DFI : les paliers III sont en <b>[A+]</b> (catégorie A + <b>ordonnance de stupéfiants</b> : formulaire à souche, valable <span class='dose'>1 mois</span>, quantité d'<span class='dose'>1 mois</span> extensible à <span class='dose'>3</span>, non renouvelable — fiche T4) ; le tramadol est en [A] au <b>tableau b</b> (ordonnance ordinaire, plafond 1→6 mois) ; les préparations de codéine relèvent du régime allégé du tableau c — d'où le Co-Dafalgan en simple [B]."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Palier",
     "Régime",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Tramal / retard",
      "tramadol",
      "II",
      "<span class='cat cat-A'>A</span> · tableau b — ordonnance ordinaire",
      "04.2025"
     ],
     [
      "Co-Dafalgan",
      "paracétamol + codéine",
      "II",
      "<span class='cat cat-B'>B</span> · tableau c — ordonnance ordinaire",
      "03.2026"
     ],
     [
      "Targin",
      "oxycodone + naloxone",
      "III",
      "<b>[A+]</b> — ordonnance à souche",
      "01.2025"
     ],
     [
      "MST Continus",
      "morphine retard",
      "III",
      "<b>[A+]</b> — ordonnance à souche",
      "05.2024"
     ],
     [
      "Durogesic Matrix",
      "fentanyl transdermique",
      "III",
      "<b>[A+]</b> — ordonnance à souche",
      "03.2024"
     ]
    ]
   },
   "warn": [
    "Le tableau b du tramadol n'est pas théorique : inscrit le 01.03.2023 (Swissmedic), vérifié à l'annexe 3 de l'OTStup-DFI — quantités plafonnées comme pour les benzodiazépines de la fiche R5."
   ]
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Palier III = souche</b> — original blanc et copie rose présents, validité 1 mois, quantité cohérente avec la durée indiquée (fiche T4) : c'est le contrôle formel avant tout le reste",
    "<b>Benzodiazépine ou autre dépresseur au dossier</b> — « forte sédation, dépression respiratoire, coma et mort » (IP Tramal, formulation identique côté R5) : association à doses et durées minimales, surveillance explicite",
    "<b>Tramadol : trois verrous</b> — jamais après un IMAO (14 jours, interactions « potentiellement mortelles ») ; plafond <span class='dose'>400 mg/j</span> au-delà duquel le risque convulsif monte ; ISRS/IRSN au dossier = risque épileptogène et sérotoninergique cumulé (fiche R4)",
    "<b>Co-Dafalgan : les CI pédiatriques absolues</b> — <12 ans / <<span class='dose'>33 kg</span>, et <b>tout adolescent <<span class='dose'>50 kg</span> après amygdalectomie ou adénoïdectomie pour apnées</b> ; CI aussi : allaitement, métaboliseur ultrarapide CYP2D6 connu, atteinte hépatique grave, maladie de Gilbert, toute difficulté respiratoire",
    "<b>Durogesic : jamais en premier opioïde</b> — l'expérience chez les naïfs est « limitée » et l'IP impose une autre entrée en matière ; changement de timbre toutes les <span class='dose'>72 h</span>",
    "<b>MST/formes retard : intégrité galénique</b> — écraser ou mâcher un comprimé retard libère la dose d'un coup (IP) : vérifier les capacités de déglutition avant de valider",
    "<b>Cumul de paracétamol</b> — Co-Dafalgan en contient : croiser systématiquement avec l'automédication (fiches T2 et 1) et les autres ordonnances"
   ]
  },
  {
   "t": "Interactions et terrains",
   "open": true,
   "table": {
    "head": [
     "Registre",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Dépresseurs centraux",
      "Benzodiazépines, alcool, autres opioïdes, sédatifs : l'addition va jusqu'au décès (toutes les IP) — c'est LE registre de la classe, et il traverse les ordonnances de prescripteurs différents"
     ],
     [
      "Sérotonine (tramadol)",
      "Syndrome sérotoninergique « potentiellement mortel », rapporté avec association ISRS/IRSN <b>et avec le tramadol seul</b> ; épileptiques : « nécessité absolue » seulement"
     ],
     [
      "CYP2D6 (codéine)",
      "La codéine devient morphine via le CYP2D6 : les ultrarapides surdosent aux doses usuelles — CI si phénotype connu, et vigilance devant toute somnolence anormale ; la paroxétine et la fluoxétine (R4) bloquent au contraire la conversion"
     ],
     [
      "Chaleur (fentanyl)",
      "Sources de chaleur externes sur le timbre (couverture chauffante, lit à eau…) <b>et fièvre</b> : libération accrue, « surdosage et décès » possibles"
     ],
     [
      "Inducteurs",
      "Carbamazépine : effet du tramadol réduit et raccourci — l'échec antalgique inexpliqué a parfois une cause pharmacocinétique"
     ]
    ]
   },
   "warn": [
    "Liste <b>non exhaustive</b> — logiciel d'officine et IP complètes font foi. La rotation d'opioïdes et l'équianalgésie appartiennent au prescripteur : le comptoir vérifie la cohérence, pas la stratégie."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Allaitement",
      "Co-Dafalgan : <b>CI</b> (décès de nouveau-nés décrits chez des mères ultrarapides). Durogesic : passage dans le lait, sédation et dépression respiratoire du nourrisson — déconseillé"
     ],
     [
      "Grossesse / accouchement",
      "Fentanyl : traverse le placenta — dépression respiratoire et sevrage néonatals possibles ; l'accouchement sous opioïdes se gère en milieu équipé"
     ],
     [
      "Enfant",
      "Co-Dafalgan : CI strictes ci-dessus. Durogesic : le contact ou l'usage par inadvertance d'un timbre « peut entraîner un surdosage mortel » chez l'enfant — l'élimination est un geste de sécurité"
     ],
     [
      "Personne âgée",
      "MST : prudence explicite (âgés/affaiblis, apnées, cœur pulmonaire) ; sédation, chutes et confusion s'additionnent avec R5/R6"
     ],
     [
      "Respiratoire",
      "MST : CI si dépression respiratoire sévère, BPCO ou asthme sévères ; Co-Dafalgan : CI dès « difficultés à respirer, indépendamment de la gravité »"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Palier III sans ordonnance de stupéfiants conforme (pas de souche, validité dépassée, quantité hors cadre sans durée) — fiche T4",
      "Co-Dafalgan chez un enfant <12 ans/<33 kg, un adolescent <50 kg post-amygdalectomie, une mère qui allaite ou un ultrarapide CYP2D6 documenté — CI de l'IP",
      "Tramadol dans les 14 jours d'un IMAO, ou ordonnances cumulées dépassant 400 mg/j",
      "Durogesic instauré chez un patient manifestement naïf d'opioïdes"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Opioïde + benzodiazépine nouvellement réunis (même par deux prescripteurs) sans mention de surveillance — le cumul le plus mortel du fichier",
      "Tramadol chez un épileptique connu, ou ajouté à un ISRS/IRSN sans plan",
      "Forme retard chez un patient qui ne peut pas avaler entier (sonde, troubles de déglutition) : la galénique doit changer, pas se broyer"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Première délivrance d'opioïde : constipation quasi systématique — en parler d'emblée, laxatif au besoin (Targin fait exception : sa naloxone est là pour ça, IP)",
      "Durogesic : la règle de la chaleur (pas de bouillotte ni couverture chauffante, consulter en cas de fièvre marquée) et l'élimination sécurisée des timbres — hors de portée des enfants",
      "Somnolence, conduite : pas de volant en début de traitement ou à chaque changement de dose (l'IP de Targin note qu'un traitement stable ne l'interdit pas d'office)",
      "Cumul de paracétamol expliqué au patient sous Co-Dafalgan (fiche T2)"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Traitement stable et cadré, souche en règle, aucun cumul nouveau"
     ]
    }
   ],
   "warn": [
    "Calibrage : la douleur chronique traitée n'est pas une suspicion d'abus — le cadre stupéfiants protège le circuit, pas la méfiance. Un doute réel d'usage détourné se traite par le prescripteur et, si nécessaire, l'autorité (fiche T4), jamais par une remise refusée sans explication."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "<b>La constipation ne s'attend pas, elle se prévient</b> — hydratation, mobilité, laxatif d'accompagnement si prescrit ; sous Targin, la naloxone incluse s'en charge en partie (IP).",
    "Comprimés retard (MST, Targin, Tramal retard) : <b>avaler entiers</b> — ni croqués, ni écrasés, ni coupés.",
    "Durogesic : coller sur peau propre et sèche, changer toutes les <span class='dose'>72 h</span> en variant les sites, <b>aucune source de chaleur</b> sur le timbre, signaler une fièvre élevée ; éliminer les timbres usagés hors de portée des enfants — un timbre peut être dangereux même après usage.",
    "Somnolence et vertiges : prudence au volant au début et à chaque changement de dose ; l'alcool est exclu.",
    "Ne jamais dépanner un proche avec ses opioïdes — la dose qui soulage l'un peut arrêter la respiration de l'autre (codéine et enfants en tête).",
    "Signes d'alerte : somnolence dont on ne se réveille pas, respiration lente ou bruyante → urgence <span class='tel'>144</span>."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiches T2 et 1 — le <b>paracétamol caché</b> du Co-Dafalgan : additionner avant tout conseil OTC antalgique ou antigrippal.",
    "Fiche R5 — benzodiazépines : le cumul à ne jamais laisser passer sans question ; le tramadol partage même leur tableau b.",
    "Fiche R4 — ISRS/IRSN × tramadol : sérotonine et seuil convulsif ; la ligne existe dans les deux fiches, dans les deux sens.",
    "Antitussifs codéinés du comptoir (fiche 7) : même substance, mêmes CI pédiatriques — le patient sous Co-Dafalgan qui tousse ne double pas sa codéine.",
    "Fiche T4 — tout le cadre stupéfiants : souche, urgences (art. 52 OCStup), remise partielle."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des cinq spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Tramal/retard (04.2025) — IMAO 14 j, convulsions >400 mg/j, syndrome sérotoninergique même en monothérapie, carbamazépine, benzodiazépines ; [A]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Co-Dafalgan (03.2026) — CI <12 ans/<33 kg, <50 kg post-amygdalectomie, allaitement, ultrarapides CYP2D6, Gilbert, difficultés respiratoires ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Targin (01.2025) — naloxone contre la constipation induite, conduite (stable ≠ interdit) ; [A+]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse MST Continus (05.2024) — CI respiratoires et digestives, comprimés entiers (libération massive sinon), prudences âgé/IMAO/TC ; [A+]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Durogesic Matrix (03.2024) — chaleur et fièvre (surdosage, décès), naïfs aux opioïdes, 72 h, enfants et timbres, allaitement/accouchement ; [A+]",
      "31.08.2026"
     ],
     [
      "Fedlex",
      "OTStup-DFI, RS 812.121.11, état au 13.03.2026 — oxycodone, morphine, fentanyl : annexes du tableau a ; tramadol : annexe 3 (tableau b) ; codéine : annexe 4 (tableau c) pour ses préparations",
      "31.08.2026"
     ],
     [
      "Fedlex / fiche T4",
      "OCStup, RS 812.121.1 — art. 46–48 (souche tableaux a/d, quantités 1→3 mois ; ordinaire b/c, 1→6 mois), 51–52 (renouvellement, urgences)",
      "31.08.2026"
     ],
     [
      "Swissmedic",
      "Page « Stupéfiants autorisés » — tramadol incorporé à la liste b le 01.03.2023",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r8": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Le socle de l'hypertension et de l'insuffisance cardiaque ambulatoires — souvent en associations fixes (Co-…, + HCT) qu'il faut savoir décomposer à la validation. Tous en catégorie <span class='cat cat-B'>B</span>. Représentants sourcés (les IP valent pour leurs classes et génériques) :"
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Classe",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Lisinopril axapharm (et al.)",
      "lisinopril",
      "IEC",
      "04.2024"
     ],
     [
      "Diovan (+ génériques)",
      "valsartan",
      "sartan (ARA II)",
      "05.2025"
     ],
     [
      "Esidrex",
      "hydrochlorothiazide",
      "thiazidique",
      "05.2022"
     ],
     [
      "Torem",
      "torasémide",
      "diurétique de l'anse",
      "09.2019"
     ],
     [
      "Aldactone (+ génériques)",
      "spironolactone",
      "épargneur potassique",
      "08.2025"
     ]
    ]
   }
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>La triade néphrotoxique</b> — IEC ou sartan + diurétique + AINS : le cumul qui abîme le rein ; l'AINS arrive souvent par l'automédication (fiche T2) ou une ordonnance tierce — c'est le contrôle n° 1 de cette classe",
    "<b>IEC : la CI récente à connaître</b> — sacubitril/valsartan (Entresto) et racécadotril sont <b>contre-indiqués</b> avec un IEC (risque accru d'angio-œdème) ; antécédent d'angio-œdème = terrain à considérer avant toute validation",
    "<b>Grossesse</b> — IEC « contre-indiqué pendant la grossesse » (changement de traitement « le plus vite possible ») ; Diovan : CI grossesse et allaitement ; Esidrex : l'<b>hypertension de la femme enceinte est une CI propre</b> de son IP",
    "<b>Le potassium monte par trois portes</b> — spironolactone + IEC/sartan, suppléments potassiques, et les <b>sels de régime au potassium</b> ; l'IP d'Aldactone y ajoute AINS, héparines et triméthoprime (Bactrim) : chaque ajout chez un patient sous épargneur se pèse",
    "<b>Aldactone : CI nettes</b> — ClCr <<span class='dose'>30</span>, hyperkaliémie ou hyponatrémie existantes, Addison, association à l'éplérénone",
    "<b>Double blocage</b> — aliskirène + IEC/sartan : CI chez le diabétique et si DFG <<span class='dose'>60</span> (IP Diovan) ; IEC + sartan ensemble : à clarifier systématiquement",
    "<b>Hypotension de première association</b> — ajouter un IEC chez un patient déjà sous diurétique expose à une chute tensionnelle : première prise prudente (IP lisinopril)"
   ]
  },
  {
   "t": "Interactions majeures",
   "open": true,
   "table": {
    "head": [
     "Registre",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "AINS",
      "Avec IEC/sartans : effet antihypertenseur réduit et fonction rénale menacée, surtout chez l'âgé déshydraté ; avec les diurétiques : efficacité réduite ; avec la spironolactone : hyperkaliémie — le rayon antalgique est l'ennemi de toute la fiche"
     ],
     [
      "Lithium",
      "IEC et diurétiques augmentent la lithémie (« il importe de la surveiller », IP Esidrex) — patient sous lithium (R4-adjacent) : tout changement se signale"
     ],
     [
      "Potassium",
      "Spironolactone : la liste hyperkaliémiante complète de son IP (suppléments, sels de régime, IEC, ARA, AINS, héparines, triméthoprime) ; hypokaliémie inverse sous thiazide/anse — la kaliémie est le fil rouge"
     ],
     [
      "Hypokaliémie (anse/thiazide)",
      "Torasémide : l'hypokaliémie expose aux arythmies ventriculaires — et l'IP nomme l'<b>abus de laxatifs</b> parmi les causes aggravantes : croisement OTC direct"
     ],
     [
      "Antidiabétiques",
      "IEC + insuline/antidiabétiques : hypoglycémies décrites (IP lisinopril) — vigilance en début de traitement (fiche R11 à venir)"
     ]
    ]
   },
   "warn": [
    "Liste <b>non exhaustive</b> — logiciel d'officine et IP complètes font foi. Le suivi biologique (sodium, potassium, créatinine — et acide urique, glucose sous thiazide) appartient au prescripteur : le comptoir vérifie qu'il existe, pas ses valeurs."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Grossesse",
      "CI dans toute la fiche : IEC (passage à un autre traitement au plus vite), sartans (CI grossesse et allaitement), Esidrex (CI dans l'HTA gravidique) — toute femme en âge de procréer sous ces classes mérite l'information"
     ],
     [
      "Personne âgée",
      "Hyponatrémie du thiazide (confusion, vomissements, apathie — l'IP décrit les symptômes neurologiques), hypotension orthostatique, déshydratation lors de canicule ou gastro-entérite : le terrain de tous les accidents de la classe"
     ],
     [
      "Insuffisance rénale",
      "Thiazides : perte d'efficacité si TFG <<span class='dose'>30</span> ; Aldactone : CI ; IEC/sartans : surveillance rapprochée — la créatinine du dossier n'est jamais décorative ici"
     ],
     [
      "Peau (HCT)",
      "Esidrex : risque accru de cancers cutanés non mélanocytaires (basocellulaires et spinocellulaires) documenté par registres — l'IP demande protection solaire et examen immédiat de toute lésion suspecte"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "IEC co-prescrit avec sacubitril/valsartan ou racécadotril — CI de l'IP (angio-œdème)",
      "Aldactone malgré ClCr connue <<span class='dose'>30</span>, hyperkaliémie documentée ou association à l'éplérénone",
      "IEC ou sartan chez une patiente enceinte connue ; aliskirène + IEC/sartan chez un diabétique"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "AINS prescrit (autre ordonnance) chez un patient sous IEC/sartan + diurétique : la triade se signale, l'alternative se discute",
      "IEC + sartan ensemble sans mention explicite ; supplément potassique ou triméthoprime ajouté sous spironolactone",
      "Antécédent d'angio-œdème au dossier et nouvelle prescription d'IEC"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Toux sèche persistante sous IEC : l'effet est connu — orienter vers le prescripteur pour discuter l'alternative, ne pas « traiter la toux » (fiches 6/7 : le différentiel commence ici)",
      "Esidrex : protection solaire et surveillance des lésions cutanées — un conseil de délivrance à part entière (IP)",
      "Gastro-entérite ou canicule chez un patient sous diurétique/IEC : risque de déshydratation et d'insuffisance rénale — recontacter le médecin si ça dure (fiche 16)",
      "Demande de laxatifs répétée sous diurétique : l'hypokaliémie se cumule (IP Torem) — questionner, orienter"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Traitement stable, biologie suivie, pas d'automédication à risque : conseil de la section suivante"
     ]
    }
   ],
   "warn": [
    "Calibrage : la triade AINS est un V2 quand elle naît d'une <b>ordonnance</b>, un V3-conseil quand elle naît du <b>rayon</b> — dans les deux cas elle se documente."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "<b>Pas d'anti-inflammatoires sans avis</b> — l'ibuprofène « anodin » du rayon peut coûter une fonction rénale avec ce traitement ; le paracétamol d'abord (fiches T2, 14).",
    "En cas de <b>gastro, fièvre durable ou canicule</b> : boire, et si les pertes durent, appeler le médecin — diurétiques et IEC peuvent nécessiter une pause décidée par lui, jamais par soi-même.",
    "Sous Esidrex : <b>crème solaire et chapeau</b> ne sont pas un luxe — et toute tache ou lésion cutanée qui change se montre rapidement.",
    "Sous spironolactone : pas de <b>sel de régime au potassium</b> ni de suppléments sans avis — le « sel sans sodium » n'est pas neutre ici.",
    "Une toux sèche qui s'installe sous IEC se signale au médecin — c'est un effet du médicament possible, pas un rhume à traiter.",
    "Vertiges au lever en début de traitement : se lever en deux temps ; s'ils persistent, en parler."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiche T2 / fiche 14 — la <b>triade AINS</b> : le croisement fondateur du brief, désormais sourcé des deux côtés (l'IP d'Aldactone liste l'AINS parmi les hyperkaliémiants, celles des diurétiques parmi les antagonistes).",
    "Fiches 6 et 7 — la toux de l'IEC dans le différentiel de toute toux sèche persistante au comptoir.",
    "Fiche 16 — gastro-entérite : la déshydratation sous diurétique/IEC est le cas type où le conseil OTC doit lever les yeux vers l'ordonnance.",
    "Laxatifs du libre accès × diurétiques : l'hypokaliémie s'additionne (IP Torem) — même vigilance que sous clozapine (R6), pour une autre raison.",
    "Fiche R1 — chez l'anticoagulé, la triade rénale dégrade aussi l'élimination des AOD : les fiches se cumulent."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des cinq spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Lisinopril axapharm (04.2024) — CI Entresto/racécadotril et grossesse, angio-œdème, hypotension d'association, potassium, lithium, antidiabétiques ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Diovan (05.2025) — CI grossesse/allaitement, aliskirène (diabète, DFG <60), double blocage ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Esidrex (05.2022) — CI anurie/HTA gravidique, cancers cutanés non mélanocytaires et protection solaire, hyponatrémie, lithium, TFG <30 ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Torem (09.2019) — hypokaliémie et arythmies, abus de laxatifs, lithium/aminosides, suivi biologique ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Aldactone (08.2025) — CI (ClCr <30, hyperkaliémie, Addison, éplérénone), liste hyperkaliémiante complète (sels de régime, AINS, héparines, triméthoprime) ; [B]",
      "31.08.2026"
     ],
     [
      "Note de sélection",
      "Associations fixes (Co-Diovan, Lisinopril-HCT…) : à valider en décomposant leurs composants selon cette fiche ; périndopril, candésartan et autres représentants à sourcer au besoin",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ],
 "r9": [
  {
   "t": "Ce qui est prescrit",
   "open": true,
   "p": [
    "Deux bêtabloquants cardiosélectifs du quotidien et deux antiarythmiques à haute surveillance — tous en catégorie <span class='cat cat-B'>B</span>. Constat de marché au passage : la <b>digoxine orale n'a plus d'IP dans l'AIPS</b> (seul l'antidote DigiFab subsiste) — ses interactions restent citées par les autres IP pour mémoire."
   ],
   "table": {
    "head": [
     "Spécialité",
     "Principe actif",
     "Repères (IP)",
     "IP mise à jour"
    ],
    "rows": [
     [
      "Beloc ZOK (+ génériques)",
      "métoprolol",
      "cardiosélectif, formes retard 25–200",
      "10.2020"
     ],
     [
      "Concor (+ génériques)",
      "bisoprolol",
      "cardiosélectif ; traitement « généralement de longue durée »",
      "12.2020"
     ],
     [
      "Cordarone (+ génériques)",
      "amiodarone",
      "réservé aux arythmies documentées ; demi-vie très longue",
      "04.2024"
     ],
     [
      "Sotalol-Mepha",
      "sotalol",
      "bêtabloquant à effet antiarythmique de classe III (QT)",
      "03.2021"
     ]
    ]
   }
  },
  {
   "t": "Points de contrôle à la validation",
   "open": true,
   "ol": [
    "<b>Jamais d'arrêt brutal d'un bêtabloquant</b> — l'IP de Beloc ZOK donne même le schéma : réduction progressive sur au moins <span class='dose'>2 semaines</span>, dose divisée par deux à chaque palier, dernière marche à <span class='dose'>12,5 mg</span> ; une ordonnance qui s'interrompt sans relais se clarifie",
    "<b>Les CI communes des bêtabloquants</b> — BAV 2/3 non appareillé, bradycardie <<span class='dose'>50/min</span>, insuffisance cardiaque décompensée, syndrome du nœud sinusal, phéochromocytome non traité ; Beloc ZOK : asthme grave ou bronchospasme sévère aux antécédents",
    "<b>Sotalol : la liste de CI la plus longue de la fiche</b> — s'y ajoutent asthme et BPCO (sans nuance de gravité), <b>QT long héréditaire ou acquis, hypokaliémie, hypomagnésiémie</b>, insuffisance rénale grave, NYHA IV : chaque case du dossier compte",
    "<b>Cordarone : trois organes à l'œil</b> — thyroïde (bilan et antécédents ; l'hyperthyroïdie peut éclore <b>jusqu'à des mois après l'arrêt</b>), yeux (micro-dépôts cornéens), peau (photoprotection exigée par l'IP) — et l'ECG « cordaronique » avec son QT",
    "<b>Torsadogènes croisés</b> — Cordarone CI en combinaison avec les médicaments à torsades ; sotalol + diurétique hypokaliémiant (furosémide, HCT — fiche R8) = terrain à torsades décrit par l'IP : le QT se cumule entre R3, R4, R6 et cette fiche",
    "<b>Vérapamil/diltiazem + bêtabloquant</b> — effet additif sur conduction et contractilité ; le vérapamil i.v. est interdit sous bêtabloquant (IP)",
    "<b>Diabétique sous bêtabloquant</b> — la tachycardie d'alerte de l'hypoglycémie est atténuée (IP Beloc ZOK) : le signal passe aux sueurs et à la faim — à dire au patient (fiche R11 à venir)"
   ]
  },
  {
   "t": "Interactions majeures — Cordarone en tête",
   "open": true,
   "table": {
    "head": [
     "Registre",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Anticoagulants oraux",
      "L'amiodarone inhibe le CYP2C9 : effet des AVK augmenté, « contrôle plus fréquent du taux de prothrombine » et adaptation nécessaires (fiche R1) — et la demi-vie très longue prolonge l'interaction des mois après l'arrêt"
     ],
     [
      "Statines",
      "Risque de rhabdomyolyse accru avec simvastatine, atorvastatine, lovastatine (CYP3A4) — l'IP recommande explicitement « une statine qui n'est pas métabolisée par CYP 3A4 » (fiche R10)"
     ],
     [
      "Digoxine",
      "Taux plasmatiques augmentés et synergie bradycardisante — pour les patients qui en reçoivent encore (préparation étrangère ou magistrale)"
     ],
     [
      "QT",
      "Cordarone : CI de combinaison avec les torsadogènes ; sotalol : QTc >« 500 msec » = repenser le traitement — croiser avec escitalopram (R4), macrolides (R3), halopéridol et dompéridone (R6)"
     ],
     [
      "Bradycardisants",
      "Bêtabloquant + vérapamil/diltiazem + amiodarone : les bradycardies s'additionnent — le pouls du patient est une donnée de validation"
     ]
    ]
   },
   "warn": [
    "Liste <b>non exhaustive</b> — logiciel d'officine et IP complètes font foi. La demi-vie de l'amiodarone fait qu'« arrêté » ne veut pas dire « parti » : l'IP impose la surveillance des interactions chez qui l'a stoppée dans les derniers mois."
   ]
  },
  {
   "t": "Populations",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Ce que disent les IP"
    ],
    "rows": [
     [
      "Grossesse",
      "Cordarone : CI « sauf en cas d'indication vitale » — hypo/hyperthyroïdie, goitre et effet cardiodépresseur chez le nouveau-né"
     ],
     [
      "Asthme / BPCO",
      "Sotalol : CI franche. Beloc ZOK : CI si asthme grave, et bronchospasme possible même sans antécédent ; Concor : bronchodilatateur en couverture — toute dyspnée nouvelle sous bêtabloquant se signale (fiche 11)"
     ],
     [
      "Personne âgée",
      "Bradycardie plus marquée sous amiodarone (IP) ; chutes et hypotension s'additionnent avec R5/R6/R8"
     ],
     [
      "Antécédents thyroïdiens",
      "Cordarone « avec prudence, posologie minimale active et stricte surveillance » — personnels ou familiaux"
     ]
    ]
   }
  },
  {
   "t": "Décision",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Ne pas délivrer",
     "ou": "Prescripteur — maintenant",
     "items": [
      "Sotalol malgré QT long, hypokaliémie documentée, asthme/BPCO ou l'une de ses CI cardiaques",
      "Cordarone co-prescrite avec un torsadogène de la liste des autres fiches (halopéridol, clarithromycine, escitalopram à risque…) sans cadre cardiologique explicite",
      "Bêtabloquant chez un patient avec bradycardie connue <<span class='dose'>50/min</span> ou BAV 2/3 non appareillé au dossier"
     ]
    },
    {
     "n": 2,
     "quand": "Délivrer seulement après clarification",
     "ou": "Prescripteur — avant la remise",
     "items": [
      "Ordonnance qui met fin à un bêtabloquant sans schéma dégressif ni relais visible",
      "Simvastatine ou atorvastatine ajoutée sous amiodarone — proposer l'alternative que l'IP recommande",
      "Sotalol + furosémide/HCT nouvellement associés sans mention du suivi kaliémie/magnésium",
      "AVK + amiodarone qui démarre : le plan de contrôles INR rapprochés doit exister (fiche R1)"
     ]
    },
    {
     "n": 3,
     "quand": "Délivrer, avec mise en garde et note",
     "ou": "Patient au comptoir · dossier",
     "items": [
      "Première Cordarone : photoprotection (pas d'UV, écran solaire), signes thyroïdiens discrets à connaître (perte de poids, palpitations), contrôles prévus — noter",
      "Diabétique sous bêtabloquant : l'hypoglycémie prévient moins par le cœur — sueurs et faim deviennent les signaux",
      "Pouls très lent constaté ou rapporté, fatigue inhabituelle : faire contrôler avant le prochain renouvellement",
      "Dyspnée ou sifflements nouveaux sous bêtabloquant : consultation, pas d'automédication respiratoire (fiche 11)"
     ]
    },
    {
     "n": 4,
     "quand": "Délivrer",
     "ou": "Conseil standard",
     "items": [
      "Traitement stable, pouls et biologie suivis : conseil de la section suivante"
     ]
    }
   ],
   "warn": [
    "Calibrage : l'indication antiarythmique est cardiologique de bout en bout — les V1/V2 de cette fiche portent sur les cumuls et les CI visibles au comptoir, jamais sur le choix du rythme ou de la fréquence cible."
   ]
  },
  {
   "t": "Ce qu'on dit au patient",
   "open": true,
   "ul": [
    "<b>Ce traitement ne s'arrête jamais du jour au lendemain</b> — même si tout va bien, même avant une opération : l'arrêt se organise avec le médecin (cœur et tension peuvent rebondir violemment).",
    "Sous Cordarone : <b>le soleil est un vrai sujet</b> — écran total et couverture vestimentaire, en montagne aussi ; et signaler perte de poids, nervosité ou palpitations, même des mois après un arrêt.",
    "Prendre son pouls de temps en temps est utile : en dessous de <span class='dose'>50</span> au repos avec fatigue ou vertiges, on appelle le cabinet.",
    "Vertiges au lever, surtout au début : se lever en deux temps.",
    "Diabétique : les signes d'hypoglycémie changent sous bêtabloquant — se fier aux sueurs et à la faim, contrôler plus souvent au début.",
    "Aucun nouveau médicament — même « naturel » ou de comptoir — sans vérifier : le QT et le pouls de cette classe se cumulent avec beaucoup de choses."
   ]
  },
  {
   "t": "Croisements OTC",
   "open": true,
   "ul": [
    "Fiche 11 (asthme/BPCO) — la dyspnée sous bêtabloquant : différentiel obligatoire avant tout conseil respiratoire OTC.",
    "Fiche R8 — sotalol × diurétiques hypokaliémiants : le potassium relie les deux fiches ; les laxatifs du rayon aggravent le même terrain.",
    "Fiche R1 — amiodarone × AVK : INR à resserrer, et l'effet persiste des mois après l'arrêt de la Cordarone.",
    "Fiche R10 (à venir) — la statine compatible avec l'amiodarone : la recommandation est déjà dans l'IP de Cordarone.",
    "Fiches R3/R4/R6 — la carte des torsadogènes du fichier : macrolides, escitalopram, halopéridol, dompéridone — le sotalol et l'amiodarone en sont les amplificateurs.",
    "Décongestionnants (fiche 1) : la pseudoéphédrine contrarie l'objectif tensionnel et rythmique — même réflexe que chez l'hypertendu de T2."
   ]
  },
  {
   "t": "Remboursement",
   "p": [
    "Statut LS et limitations des quatre spécialités : <span class='nv'>non vérifié</span> cette session — logiciel de tarification et fiche T5."
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
      "AIPS / swissmedicinfo (Refdata)",
      "IP suisse Beloc ZOK (10.2020) — CI cardiaques et asthme grave, schéma d'arrêt sur ≥2 semaines, hypoglycémie masquée, vérapamil i.v. ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Concor (12.2020) — pas d'arrêt abrupt, asthme sous couverture bronchodilatatrice, vérapamil/diltiazem ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Cordarone comprimés (04.2024) — QT « cordaronique », CI grossesse sauf vitale, thyroïde (jusqu'à des mois après l'arrêt), photoprotection, dépôts cornéens, AVK/CYP2C9, statines CYP3A4, digoxine, demi-vie ; [B]",
      "31.08.2026"
     ],
     [
      "AIPS / swissmedicinfo",
      "IP suisse Sotalol-Mepha (03.2021) — CI complètes (QT long, hypokaliémie/hypomagnésiémie, asthme/BPCO, IR grave), torsades et diurétiques, QTc >500 ms ; [B]",
      "31.08.2026"
     ],
     [
      "Constat de marché",
      "Digoxine orale : aucune IP dans l'AIPS au 31.08.2026 (recherches « Digoxin », « Digoxine », substance « Digoxinum » — seul DigiFab, antidote, référencé)",
      "31.08.2026"
     ],
     [
      "Note de sélection",
      "Carvédilol, aténolol, flécaïnide, dronédarone : à sourcer au besoin, même méthode",
      "31.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Liste des spécialités (statuts et limitations) : non consultée — voir fiche T5",
      "31.08.2026"
     ]
    ]
   }
  }
 ]
};
