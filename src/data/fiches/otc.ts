import type { Section } from './types';

/* Fichier généré depuis comptoir-otc.html — sections du volet otc.
   Contenu rédigé une fiche à la fois, sources vérifiées en session, validé
   par Damien. Éditions ciblées uniquement : ne jamais régénérer en masse. */

export const SECTIONS_OTC: Record<string, Section[]> = {
 "t1": [
  {
   "t": "Catégories de remise",
   "open": true,
   "p": [
    "Depuis la révision LPTh entrée en vigueur le <span class='dose'>01.01.2019</span>, la catégorie C n'existe plus : ses préparations ont été reclassées en <span class='cat cat-B'>B</span> ou en <span class='cat cat-D'>D</span> (Swissmedic). La catégorie se vérifie <b>par présentation</b> — la ligne du conditionnement sur compendium.ch — jamais par principe actif ni par analogie avec un produit voisin."
   ],
   "table": {
    "head": [
     "Cat.",
     "Base légale",
     "Définition",
     "Remise"
    ],
    "rows": [
     [
      "<span class='cat cat-A'>A</span>",
      "OMéd art. 41",
      "Soumis à ordonnance <b>non renouvelable</b>",
      "Pharmacie, sur ordonnance"
     ],
     [
      "<span class='cat cat-B'>B</span>",
      "OMéd art. 42",
      "Soumis à ordonnance",
      "Pharmacie — sans ordonnance uniquement dans les cas de l'art. 45 OMéd, voir ci-dessous"
     ],
     [
      "<span class='cat cat-D'>D</span>",
      "OMéd art. 43",
      "Remise sur conseil spécialisé",
      "Sur conseil spécialisé"
     ],
     [
      "<span class='cat cat-E'>E</span>",
      "OMéd art. 44",
      "Vente libre",
      "« Vente dans tous les commerces » (Swissmedic)"
     ]
    ]
   }
  },
  {
   "t": "Remise de liste B sans ordonnance — art. 45 OMéd",
   "open": true,
   "p": [
    "Base : LPTh art. 24 al. 1 let. a · OMéd (RS 812.212.21, état au <span class='dose'>01.01.2026</span>) art. 45, 47 et 48. Cas prévus :"
   ],
   "ul": [
    "<b>a.</b> Maladies fréquentes — principes actifs connus, autorisés depuis plusieurs années ; indications et préparations admises : <b>annexe 2 OMéd</b>.",
    "<b>b.</b> Poursuite d'un traitement de longue durée pendant <span class='dose'>1 an</span> après une première prescription médicale — consigner le mode de prescription d'origine, revalider CI et interactions à chaque répétition (KAV).",
    "<b>c.</b> Anciens C reclassés B pour raisons de sécurité : risque d'abus connu (accoutumance, dépendance), interactions graves possibles, ou obligation de consigner spéciale. Exemple KAV : codéine dans la toux irritative — consigner l'indication et l'exclusion d'un abus à l'anamnèse.",
    "<b>d.</b> Cas exceptionnels justifiés (LPTh art. 24 al. 1 let. a ch. 2) : documentation détaillée obligatoire ; stupéfiants remis en urgence à signaler à l'autorité compétente (KAV)."
   ],
   "warn": [
    "Anti-infectieux systémiques : hors art. 45 al. 1 — pas d'automédication. Remise sans ordonnance uniquement en cas exceptionnel justifié (let. d), avec documentation détaillée (KAV, annexe)."
   ]
  },
  {
   "t": "Conditions : en personne et consigné — art. 47–48 OMéd",
   "p": [
    "Aide à la mise en œuvre des pharmaciens cantonaux (KAV/APC n° 014 V02, valable dès le <span class='dose'>01.07.2019</span>, élaborée avec pharmaSuisse) :"
   ],
   "ul": [
    "Remise par le <b>pharmacien en personne</b> — implication et validation traçables : validation dans le système informatique à droits restreints, ou visa daté sur papier.",
    "<b>Patient présent en personne</b> pour l'évaluation et la remise. Dérogation exceptionnelle seulement si : dossier patient existant + premier contact personnel déjà eu + justification consignée + porteur identifiable et plausible (procuration, proche, soins à domicile). Pas de livraison postale.",
    "<b>Consigner</b> (électronique ou écrit) : nom, prénom, date de naissance, sexe · point de remise, date, visa du pharmacien · médicament, dosage, taille d'emballage · éléments justifiant la décision. Un tiers doit pouvoir reconstituer la décision de remise.",
    "Quand un <b>algorithme de remise</b> pharmaSuisse (ou équivalent reconnu) existe pour l'indication, le joindre à la documentation — exemple KAV : pilule du lendemain."
   ]
  },
  {
   "t": "Échelle d'orientation N1–N4",
   "open": true,
   "p": [
    "Convention de l'outil : chaque red flag porte un niveau. Le niveau encode <b>quand</b> et <b>où</b>, parce que la destination change selon l'heure — le soir et le week-end, « médecin traitant » n'est pas une destination disponible."
   ],
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Urgence vitale. Le patient ne repart pas avec un conseil."
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Doit être vu ou évalué par un médecin le jour même. Le niveau le plus fréquent en garde — toujours donner les deux destinations."
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Consultation différée. Un N3 un dimanche soir repart avec un conseil et la consigne de consulter — ce n'est <b>pas</b> un motif d'urgences."
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Automédication accompagnée, avec un délai de réévaluation annoncé au patient."
     ]
    }
   ],
   "warn": [
    "Ne jamais monter un N3 en N2 « par prudence » : surcharger les urgences est aussi une erreur de triage."
   ]
  },
  {
   "t": "Questionnement structuré — LINDAAFF",
   "p": [
    "L'anamnèse officinale suit le cadre <b>LINDAAFF</b> et les bonnes pratiques de triage — standard de la formation FPH : « effectue et documente des entretiens d'anamnèse en tenant compte du LINDAAFF et des bonnes pratiques de triage » (Recueil de travaux pratiques 2025, rôle 1). Dans les fiches pathologie, chaque question porte une colonne « réponse qui fait basculer » avec son niveau N1–N4."
   ],
   "warn": [
    "Développé lettre à lettre de l'acronyme : <span class='nv'>non vérifié</span> — aucune source officielle ouverte cette session ne le détaille. À compléter à la main."
   ]
  },
  {
   "t": "Les cinq questions de sécurité",
   "p": [
    "Convention de l'outil, en complément du LINDAAFF — à poser avant toute délivrance :"
   ],
   "check": [
    "Pour qui ? — âge, le patient est-il devant moi ?",
    "Autres médicaments en cours ? — ordonnance, automédication, cumuls silencieux",
    "Grossesse ou allaitement ?",
    "Maladies chroniques ? — asthme, HTA, rein, foie, anticoagulation",
    "Allergies ou réactions antérieures ? Déjà essayé quelque chose pour cet épisode ?"
   ]
  },
  {
   "t": "Numéros et destinations — Vaud",
   "open": true,
   "table": {
    "head": [
     "Situation",
     "Destination",
     "Numéro"
    ],
    "rows": [
     [
      "Urgence vitale",
      "Urgences",
      "<a href='tel:144'>144</a>"
     ],
     [
      "Médecin de garde — soir, week-end, sans médecin traitant",
      "CTMG : un infirmier évalue, conseille et oriente · 24 h/24, 7 j/7 · tout le canton, y c. pédiatrie et psychiatrie · tarif local",
      "<a href='tel:0848133133'>0848 133 133</a>"
     ],
     [
      "Intoxication",
      "Tox Info Suisse · 24 h/24",
      "<a href='tel:145'>145</a> · depuis l'étranger <span class='tel'>+41 44 251 51 51</span>"
     ],
     [
      "Pharmacie de garde",
      "Via la CTMG ou vd.ch",
      "<a href='tel:0848133133'>0848 133 133</a>"
     ],
     [
      "S'orienter dans le dispositif",
      "urgences-sante.ch (vd.ch)",
      "—"
     ]
    ]
   }
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
      "OMéd, RS 812.212.21, état au 01.01.2026 — art. 41–44 (catégories), 45, 47, 48",
      "30.08.2026"
     ],
     [
      "Pharmaciens cantonaux KAV/APC",
      "Aide à la mise en œuvre n° 014 V02 « Remise en personne et obligation de consigner », valable dès le 01.07.2019",
      "30.08.2026"
     ],
     [
      "Swissmedic",
      "Pages catégories de remise / reclassification LPTh 2019 — suppression de la catégorie C",
      "30.08.2026"
     ],
     [
      "État de Vaud — vd.ch",
      "Page « Urgences » (144, CTMG, pharmacies de garde) · communiqué CTMG (24 h/24, périmètre cantonal)",
      "30.08.2026"
     ],
     [
      "Tox Info Suisse",
      "toxinfo.ch — numéro d'urgence 145",
      "30.08.2026"
     ],
     [
      "FPH",
      "Recueil de travaux pratiques 2025, rôle 1 — anamnèse selon LINDAAFF",
      "30.08.2026"
     ],
     [
      "pharmaSuisse",
      "Page « Traitement et triage des cas aigus en pharmacie »",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "t2": [
  {
   "t": "Lire cette fiche",
   "open": true,
   "p": [
    "Fiche de <b>sécurité produit</b> : les blocs rouges répondent à « ce produit ne part pas », pas à « où j'envoie ce patient ». À croiser avec la fiche pathologie concernée, qui porte le triage.",
    "Les catégories ci-dessous sont vérifiées <b>par présentation</b> sur compendium.ch au 30.08.2026. La preuve que la règle n'est pas théorique : Paracétamol Mepha cpr 500 mg est en <span class='cat cat-D'>D</span> en blister de <span class='dose'>20</span>, et en <span class='cat cat-B'>B</span> en boîtes de <span class='dose'>100</span> et <span class='dose'>300</span> — même produit, même dosage."
   ]
  },
  {
   "t": "Paracétamol",
   "open": true,
   "p": [
    "Adulte et enfant >12 ans (><span class='dose'>40 kg</span>) : <span class='dose'>1–2 cp 500 mg</span> par prise, intervalle <span class='dose'>4–6 h</span>, maximum <span class='dose'>8 cp/j</span> soit <span class='dose'>4 g/j</span> — <b>toutes sources confondues</b>."
   ],
   "table": {
    "head": [
     "Présentation vérifiée",
     "Composition",
     "Cat.",
     "Posologie / durée max"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg, blister 30",
      "paracétamol 500 mg",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span>"
     ],
     [
      "Paracétamol Mepha cpr pell 500 mg",
      "paracétamol 500 mg",
      "<span class='cat cat-D'>D</span> (20 pce) · <span class='cat cat-B'>B</span> (100/300 pce)",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span>, intervalle <span class='dose'>4–6 h</span>"
     ],
     [
      "NeoCitran Grippe/refroid. pdr adultes",
      "paracétamol 500 mg + phéniramine 20 mg + phényléphrine 10 mg + vit. C 50 mg / sachet",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>1 sachet</span>, ≥<span class='dose'>4 h</span> d'intervalle, max <span class='dose'>3×/j</span> · >14 ans · max <span class='dose'>3 j</span> sans avis médical"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "Trouble sévère de la fonction hépatique, hépatite aiguë — CI des FI Dafalgan et NeoCitran.",
     "Toute demande qui porterait le cumul au-dessus de <span class='dose'>4 g/j</span> — additionner comprimés, sachets grippaux et associations avant de délivrer.",
     "NeoCitran : grossesse et allaitement, enfant <14 ans — CI de la FI."
    ]
   },
   "warn": [
    "Cumul silencieux : chaque sachet de NeoCitran adulte contient <span class='dose'>500 mg</span> de paracétamol — l'équivalent d'un comprimé. D'autres présentations grippales dosent différemment : vérifier chaque sachet avant d'ajouter un antalgique."
   ]
  },
  {
   "t": "AINS — ibuprofène",
   "open": true,
   "p": [
    "En automédication (>12 ans) : <span class='dose'>200–400 mg</span> par prise, intervalle <span class='dose'>4–6 h</span>, maximum <span class='dose'>1200 mg/j</span>, maximum <span class='dose'>3 j</span> (FI Algifor-L forte)."
   ],
   "table": {
    "head": [
     "Présentation vérifiée",
     "Composition",
     "Cat.",
     "Posologie / durée max"
    ],
    "rows": [
     [
      "Algifor-L forte cpr pell 400 mg, blister 10",
      "ibuprofène 400 mg",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>/prise, max <span class='dose'>1200 mg/j</span>, max <span class='dose'>3 j</span>"
     ],
     [
      "Pretufen rhume &amp; douleurs, blister 20",
      "ibuprofène 200 mg + pseudoéphédrine 30 mg",
      "<span class='cat cat-D'>D</span>",
      "> 15 ans : <span class='dose'>1–2 cp</span> au repas, ≥<span class='dose'>6 h</span>, max <span class='dose'>6 cp/j</span>, max <span class='dose'>3 j</span>"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "Grossesse 3ᵉ trimestre (1ᵉʳ et 2ᵉ : « IPr », arbitrage professionnel) ; allaitement — CI FI Algifor.",
     "Ulcère gastroduodénal évolutif, saignement gastro-intestinal, maladie intestinale inflammatoire — CI FI.",
     "Insuffisance rénale sévère (ClCr <span class='dose'>&lt;30 ml/min</span>) · insuffisance cardiaque sévère (NYHA III–IV) — CI FI.",
     "Patient sous IEC ou sartan + diurétique (« triple whammy ») : risque d'insuffisance rénale aiguë, surtout chez la personne âgée — à éviter quand c'est possible, orienter vers le paracétamol (Mattioli et al. 2023 — <b>source non suisse</b>, littérature internationale)."
    ]
   },
   "warn": [
    "AINS + anticoagulants oraux : vérifié le 31.08.2026 dans les IP suisses (AIPS) — risque hémorragique majoré sur toute la classe, AINS « à éviter absolument » sous AVK ; détail par produit et croisements en fiche R1.",
    "Asthme et AINS (bronchospasme) : <span class='nv'>non vérifié</span> — même rubrique, même complément à faire."
   ]
  },
  {
   "t": "Décongestionnants",
   "open": true,
   "p": [
    "Deux familles : topique nasale (xylométazoline) et orale (pseudoéphédrine). La HPC Swissmedic du <span class='dose'>30.04.2024</span> ajoute aux produits à pseudoéphédrine les risques SEPR/PRES et SVCR/RCVS et de nouvelles contre-indications."
   ],
   "table": {
    "head": [
     "Présentation vérifiée",
     "Composition",
     "Cat.",
     "Posologie / durée max"
    ],
    "rows": [
     [
      "Otrivin Rhume spray nasal 0.1 %",
      "xylométazoline 0.1 %",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>1 jet</span> max <span class='dose'>3×/j</span> par narine · max <span class='dose'>1 semaine</span>"
     ],
     [
      "Pretufen rhume &amp; douleurs",
      "pseudoéphédrine 30 mg + ibuprofène 200 mg",
      "<span class='cat cat-D'>D</span>",
      "voir section AINS · max <span class='dose'>3 j</span>"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "Pseudoéphédrine — HTA sévère ou non contrôlée · maladie rénale sévère aiguë ou chronique (HPC Swissmedic 30.04.2024).",
     "Pseudoéphédrine (FI Pretufen) — insuffisance coronarienne sévère, antécédent d'infarctus · antécédent d'AVC ou facteurs de risque · insuffisance cardiaque sévère · grossesse, allaitement · <15 ans.",
     "Xylométazoline (FI Otrivin) — rhinite sèche ou atrophique · glaucome à angle fermé · après chirurgie exposant la dure-mère · grossesse, allaitement sauf avis médical."
    ]
   },
   "warn": [
    "Signes d'alerte SEPR/SVCR sous pseudoéphédrine : céphalée brutale « en coup de tonnerre », nausées, vomissements, confusion, convulsions, troubles visuels → arrêt immédiat et prise en charge médicale (HPC Swissmedic).",
    "Xylométazoline au-delà d'une semaine : risque de dépendance/abus signalé par compendium — la rhinite médicamenteuse est traitée dans la fiche 2."
   ]
  },
  {
   "t": "Antitussifs — codéine et dextrométhorphane",
   "open": true,
   "p": [
    "Deux antitussifs opioïdes, tous deux <span class='cat cat-B'>B</span> avec « risque de dépendance ou d'abus » signalé par compendium. Anciens C reclassés B pour raisons de sécurité : consigner l'indication et l'exclusion d'un abus à l'anamnèse (art. 45 al. 1 let. c OMéd — voir fiches T1)."
   ],
   "table": {
    "head": [
     "Présentation vérifiée",
     "Composition",
     "Cat.",
     "Posologie / durée max"
    ],
    "rows": [
     [
      "Codicalm sirop 5 mg/5 ml",
      "codéine phosphate",
      "<span class='cat cat-B'>B</span>",
      "> 12 ans : <span class='dose'>15 ml 3×/j</span> après les repas"
     ],
     [
      "Bexine sirop 25 mg/10 ml, flacon 130 ml",
      "dextrométhorphane",
      "<span class='cat cat-B'>B</span>",
      "> 12 ans : <span class='dose'>10 ml 3(–4)×/j</span> · max <span class='dose'>4 j</span> sans ordonnance"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "Codéine — enfant <12 ans · allaitement · métaboliseur ultrarapide CYP2D6 connu · insuffisance ou dépression respiratoire, crise d'asthme · grossesse « IPr », menace d'accouchement prématuré (FI Codicalm).",
     "Dextrométhorphane — IMAO et médicaments sérotoninergiques, ISRS compris, jusqu'à <span class='dose'>14 j</span> après leur arrêt · enfant <1 an · allaitement · grossesse sauf contrôle médical · intolérance au fructose (FI Bexine)."
    ]
   },
   "warn": [
    "Demandes répétées, gros conditionnements, jeune âge : penser mésusage — les deux FI portent le marqueur dépendance/abus, et la remise B impose l'anamnèse documentée."
   ]
  },
  {
   "t": "Antihistaminiques sédatifs",
   "open": true,
   "p": [
    "La sédation est l'effet recherché (Benocten, hypnotique) ou embarquée discrètement (phéniramine du NeoCitran) — elle s'additionne d'une source à l'autre."
   ],
   "table": {
    "head": [
     "Présentation vérifiée",
     "Composition",
     "Cat.",
     "Posologie"
    ],
    "rows": [
     [
      "Benocten cpr 50 mg",
      "diphénhydramine 50 mg",
      "<span class='cat cat-B'>B</span>",
      "> 12 ans : <span class='dose'>1 cp</span>, <span class='dose'>15–30 min</span> avant le coucher · 2–12 ans : sur ordonnance uniquement"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "Épilepsie · crise d'asthme · glaucome · obstruction pyloroduodénale · HBP et troubles de la miction · alcoolisme · traitement IMAO · grossesse, allaitement · <2 ans (FI Benocten)."
    ]
   },
   "warn": [
    "Personne âgée polymédiquée : profil anticholinergique — les CI (glaucome, HBP, troubles de la miction) en sont la signature. Somnolence résiduelle et conduite : <span class='nv'>non vérifié</span> — rubrique info pro sous login HIN, à compléter."
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
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes par présentation : Dafalgan cpr 500 mg · Paracétamol Mepha cpr pell 500 mg · NeoCitran Grippe/refroid. pdr adultes · Algifor-L forte cpr pell 400 mg · Pretufen rhume &amp; douleurs · Otrivin Rhume spray nasal 0.1 % · Codicalm sirop · Bexine sirop 25 mg/10 ml · Benocten cpr 50 mg",
      "30.08.2026"
     ],
     [
      "Swissmedic",
      "HPC « Médicaments contenant de la pseudoéphédrine » — SEPR/PRES, SVCR/RCVS, nouvelles CI, 30.04.2024",
      "30.08.2026"
     ],
     [
      "Littérature internationale (<b>non suisse</b>)",
      "Mattioli et al., « Hospitalisations… Risks Associated with Triple Whammy », 2023, PMC",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f1": [
  {
   "t": "Contexte saisonnier — épidémiologie suisse",
   "open": true,
   "p": [
    "Fin août : pré-saison. Les infections respiratoires « surviennent en grand nombre en hiver, notamment pour la grippe et le VRS » ; la surveillance des agents pathogènes court toute l'année (OFSP). Le rapport hebdomadaire grippe n'est plus publié sur le site de l'OFSP : les indicateurs actuels vivent sur le portail idd.bag.admin.ch. Dernier rapport annuel : virus respiratoires 2024/25 (Bulletin OFSP 42/25, 24.11.2025)."
   ],
   "warn": [
    "Situation à date du 30.08.2026 : <span class='nv'>non vérifié</span> — le portail idd.bag.admin.ch est une application qui ne se laisse pas lire hors navigateur. Le consulter directement pour les chiffres de la semaine."
   ]
  },
  {
   "t": "Signes typiques et diagnostic différentiel",
   "open": true,
   "p": [
    "Transmission « par contact direct, par une exposition à des particules aéroportées ou par contact indirect » (CHUV). Maladie bénigne qui « guérit souvent spontanément » en quelques jours (ameli — <b>source non suisse</b>). Tableau habituel : rhinorrhée, éternuements, nez bouché, gorge qui gratte, état général conservé."
   ],
   "table": {
    "head": [
     "Ce qui doit faire penser à autre chose",
     "Fiche"
    ],
    "rows": [
     [
      "Douleur pharyngée au premier plan, fièvre, adénopathies",
      "3 — Mal de gorge"
     ],
     [
      "Douleur faciale, sécrétions purulentes persistantes, fièvre secondaire",
      "4 — Sinusite"
     ],
     [
      "Otalgie",
      "5 — Otite"
     ],
     [
      "Toux au premier plan ou traînante",
      "7 / 10"
     ],
     [
      "Début brutal, fièvre élevée, myalgies, état général touché",
      "12 — Grippe"
     ],
     [
      "Rhinorrhée claire + prurit oculaire/nasal, terrain atopique, pas de fièvre",
      "21 — Allergies"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — cadre LINDAAFF",
   "open": true,
   "p": [
    "Compléter systématiquement par les cinq questions de sécurité (fiche T1). La colonne de droite donne la réponse qui fait basculer, avec son niveau."
   ],
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Depuis quand ?",
      "Évolution attendue : quelques jours",
      "Pas de régression à <span class='dose'>15–20 j</span> (ameli, <b>non suisse</b>) <span class='n n3'>N3</span>"
     ],
     [
      "Fièvre ? Mesurée comment ?",
      "Fièvre modérée possible",
      "><span class='dose'>38.5 °C</span> persistante <span class='n n2'>N2</span> · nourrisson <3 mois : ≥<span class='dose'>38 °C</span> rectale <span class='n n1'>N1</span> (pédiatrie suisse)"
     ],
     [
      "La respiration ? La déglutition ?",
      "Libres",
      "Difficulté à respirer ou à avaler <span class='n n2'>N2</span> · détresse, cyanose <span class='n n1'>N1</span>"
     ],
     [
      "Douleur d'oreille ?",
      "Absente",
      "Otalgie forte <span class='n n2'>N2</span> → fiche 5"
     ],
     [
      "Douleur du visage, sécrétions purulentes qui durent ?",
      "Absentes",
      "Tableau de sinusite <span class='n n3'>N3</span> → fiche 4"
     ],
     [
      "État général ? Nuque ? Comportement de l'enfant ?",
      "Conservé",
      "Raideur de nuque, confusion, léthargie, douleur que rien ne calme <span class='n n1'>N1</span> (pédiatrie suisse)"
     ],
     [
      "Terrain ?",
      "Sain",
      "BPCO, immunosuppression, grand âge fragile <span class='n n2'>N2</span>–<span class='n n3'>N3</span> selon l'état"
     ],
     [
      "Déjà pris quelque chose ?",
      "Cumul paracétamol, doublons",
      "→ fiche T2 avant toute délivrance"
     ]
    ]
   },
   "warn": [
    "Développé lettre à lettre du LINDAAFF : <span class='nv'>non vérifié</span> — voir fiche T1. Les questions ci-dessus couvrent le fond sans prétendre à la lettre."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Détresse respiratoire, cyanose",
      "Raideur de nuque, confusion, convulsions — « les enfants atteints de méningite bactérienne sont une urgence médicale » (pédiatrie suisse)",
      "Nourrisson <3 mois avec ≥<span class='dose'>38 °C</span> rectale : présentation immédiate (pédiatrie suisse)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Fièvre ><span class='dose'>38.5 °C</span> persistante, difficulté à respirer ou à avaler, otalgie forte (ameli, <b>non suisse</b>)",
      "Enfant fébrile très pâle, léthargique, douleur non calmée (pédiatrie suisse)",
      "Terrain fragile qui se dégrade : BPCO, immunosuppression, grand âge"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Pas de régression des symptômes à <span class='dose'>15–20 j</span> (ameli, <b>non suisse</b>)",
      "Tableau de sinusite persistant sans signe de gravité → fiche 4",
      "Symptômes traînants chez un patient stable"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Rhume banal, état général conservé. Annoncer le délai : « si pas de mieux net ou si fièvre ><span class='dose'>38.5 °C</span>, médecin » — et rappeler que l'épisode dure quelques jours."
     ]
    }
   ],
   "warn": [
    "Un N3 un dimanche soir repart avec un conseil, pas vers les urgences — règle de l'outil, fiche T1."
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Triomer lavage nasal",
      "eau de mer, NaCl 0.9 %",
      "disp. méd.",
      "<span class='dose'>1–3 jets</span> jusqu'à <span class='dose'>6×/j</span> par narine",
      "—",
      "<3 ans : non (produit) · premier geste, pas d'effet rebond"
     ],
     [
      "Otrivin Rhume spray nasal 0.1 %",
      "xylométazoline",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>1 jet</span> max <span class='dose'>3×/j</span> par narine",
      "<span class='dose'>1 sem</span>",
      "rhinite sèche/atrophique, glaucome à angle fermé, grossesse/allaitement sauf avis — fiche T2"
     ],
     [
      "Otrivin Rhume Class spray 0.05 %",
      "xylométazoline",
      "<span class='cat cat-D'>D</span>",
      "2–12 ans : <span class='dose'>1–2 gttes</span> ou <span class='dose'>1 jet</span> <span class='dose'>1–2(–3)×/j</span>",
      "<span class='dose'>1 sem</span>",
      "1–2 ans : sur prescription médicale uniquement"
     ],
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span> (<span class='dose'>4 g</span>)",
      "—",
      "cumul toutes sources — fiche T2 · remise B documentée"
     ],
     [
      "Algifor-L forte cpr 400 mg",
      "ibuprofène",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>/prise, max <span class='dose'>1200 mg/j</span>",
      "<span class='dose'>3 j</span>",
      "blocs « ne pas délivrer » de la fiche T2 : grossesse 3ᵉ trim, ulcère, IR/IC sévères, triple whammy"
     ],
     [
      "NeoCitran Grippe/refroid. pdr adultes",
      "paracétamol 500 + phéniramine + phényléphrine",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>1 sachet</span>, ≥<span class='dose'>4 h</span>, max <span class='dose'>3×/j</span>",
      "<span class='dose'>3 j</span>",
      "> 14 ans · CI grossesse/allaitement · sédatif, cumul paracétamol — fiche T2"
     ],
     [
      "Pretufen rhume &amp; douleurs",
      "ibuprofène 200 + pseudoéphédrine 30",
      "<span class='cat cat-D'>D</span>",
      "> 15 ans : <span class='dose'>1–2 cp</span>, ≥<span class='dose'>6 h</span>, max <span class='dose'>6 cp/j</span>",
      "<span class='dose'>3 j</span>",
      "HPC Swissmedic SEPR/SVCR, CI cardiovasculaires — fiche T2"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium au moment de la remise",
      "—",
      "à défaut : lavage salin + antalgique simple"
     ]
    ]
   },
   "warn": [
    "L'assurance maladie française déconseille les AINS en première intention dans la rhinopharyngite (risque infectieux — position <b>non suisse</b>, ameli). En pratique de comptoir : paracétamol d'abord, dans la limite du cumul."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "<2 ans",
      "Fièvre <3 mois : ≥<span class='dose'>38 °C</span> rectale → présentation immédiate <span class='n n1'>N1</span> (pédiatrie suisse). Pas de vasoconstricteur en automédication (0.05 % dès 2 ans ; 1–2 ans sur prescription — FI). Lavage doux au sérum physiologique en gouttes (Triomer lavage : dès 3 ans seulement). Fièvre et douleur → fiche 15."
     ],
     [
      "2–6 ans",
      "Xylométazoline 0.05 % max <span class='dose'>1 sem</span>. Pas de NeoCitran (<14 ans), pas de Pretufen (<15 ans), pas d'antitussif opioïde (<12 ans — fiche T2). Pas d'association paracétamol + ibuprofène (pédiatrie suisse)."
     ],
     [
      "6–12 ans",
      "Comme 2–6 ans ; antalgique selon poids → fiche 15."
     ],
     [
      "Grossesse / allaitement",
      "Xylométazoline : sauf avis médical (FI). AINS : CI 3ᵉ trimestre et allaitement (FI Algifor) ; NeoCitran et Pretufen : CI. Paracétamol : rubrique grossesse de la FI <span class='nv'>non vérifié</span> cette session — vérifier avant délivrance."
     ],
     [
      "Personne âgée polymédiquée",
      "Phéniramine/diphénhydramine : charge anticholinergique (fiche T2). AINS : triple whammy si IEC/sartan + diurétique (T2). Pseudoéphédrine : HPC Swissmedic (T2)."
     ],
     [
      "Insuffisance rénale / hépatique",
      "AINS : CI si IR sévère (ClCr <span class='dose'>&lt;30</span>). Paracétamol : CI hépatopathie sévère, hépatite aiguë (T2)."
     ],
     [
      "Asthme",
      "AINS et bronchospasme : <span class='nv'>non vérifié</span> (T2). Codéine : CI en crise (T2)."
     ],
     [
      "Anticoagulés",
      "AINS + anticoagulants : <span class='nv'>non vérifié</span> (T2) — s'abstenir, paracétamol en premier dans la limite du cumul."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux et prévention",
   "ul": [
    "Boire régulièrement, dormir la tête surélevée, humidifier les voies nasales (ameli — <b>non suisse</b>).",
    "Lavage des mains, couvrir bouche et nez en toussant — gestes barrière (ameli — <b>non suisse</b>).",
    "Mouchage doux, une narine à la fois ; aérer les pièces.",
    "Annoncer la durée attendue — quelques jours — pour éviter la surconsommation d'OTC sur un épisode qui guérit seul."
   ]
  },
  {
   "t": "Phytothérapie et compléments — niveaux de preuve",
   "table": {
    "head": [
     "Produit / substance",
     "Cat.",
     "Posologie",
     "Preuve (Cochrane)"
    ],
    "rows": [
     [
      "Echinaforce résistance refroid. gouttes (Vogel)",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>20 gtt 3×/j</span> (prévention) · <span class='dose'>20–25 gtt 3–5×/j</span> (traitement) · 4–12 ans : <span class='dose'>10 gtt</span> · max <span class='dose'>2 mois</span>",
      "2014 : prévention — aucune des 12 comparaisons significative ; traitement — « bénéfice faible possible » de certains produits, preuves hétérogènes"
     ],
     [
      "Zinc per os",
      "—",
      "pas de spécialité vérifiée cette session",
      "2024 : preuves insuffisantes ; durée possiblement −<span class='dose'>2 j</span>, confiance faible à très faible ; troubles du goût et digestifs plus fréquents"
     ],
     [
      "Vitamine C",
      "—",
      "pas de spécialité vérifiée cette session",
      "2013 : pas de prévention en population générale (RR <span class='dose'>0.97</span>) ; en prise régulière, durée −<span class='dose'>8 %</span> (adulte) ; après le début des symptômes : pas d'effet cohérent ; exception : effort physique intense (RR <span class='dose'>0.48</span>)"
     ]
    ]
   },
   "warn": [
    "Echinaforce : CI maladies auto-immunes, leucémie, sclérose en plaques, nourrissons ; contient de l'éthanol 70 % (FI). Grossesse : non traitée sur la page publique — <span class='nv'>non vérifié</span>.",
    "Zinc et vitamine C : si délivrance, vérifier la présentation choisie sur compendium — aucune n'a été ouverte cette session. Revues Cochrane : <b>source non suisse</b> (littérature internationale)."
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
      "OFSP",
      "Page « Virus respiratoires » (surveillance annuelle, fin du rapport hebdomadaire, renvoi au portail idd) · rapport annuel 2024/25 référencé (Bulletin 42/25)",
      "30.08.2026"
     ],
     [
      "pédiatrie suisse",
      "« L'enfant qui a de la fièvre : comment la mesurer, agir, conseiller » — seuil <3 mois, signes d'alarme, antipyrétiques",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Triomer lavage nasal · Otrivin Rhume Class 0.05 % · Vogel Echinaforce résistance gouttes — plus réutilisation des pages du 30.08.2026 (fiche T2) : Otrivin 0.1 %, Dafalgan 500, Paracétamol Mepha 500, NeoCitran, Algifor-L forte, Pretufen",
      "30.08.2026"
     ],
     [
      "CHUV",
      "Page « Rhume - Rhinopharyngite » (transmission ; pas de contenu clinique exploitable)",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Rhinopharyngite de l'adulte : que faire et quand consulter »",
      "30.08.2026"
     ],
     [
      "Cochrane (<b>non suisse</b>)",
      "Échinacée CD000530 (2014) · Vitamine C CD000980 (2013) · Zinc CD014914 (2024)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f2": [
  {
   "t": "Rhinite médicamenteuse",
   "open": true,
   "p": [
    "Obstruction qui revient de plus belle à l'arrêt du vasoconstricteur : les experts ORL l'expliquent par « la réapparition de la congestion nasale induite par la pathologie rhinosinusienne » plus que par une toxicité propre, et signalent que les spécialités sans ordonnance « font l'objet d'un mésusage difficilement contrôlable » (Ann. fr. ORL 2013 — <b>source non suisse</b>). Le repère opérationnel suisse reste la FI : xylométazoline <b>max <span class='dose'>1 semaine</span></b>, marqueur « risque de dépendance ou d'abus » (compendium — fiche T2).",
    "Le tableau type au comptoir : pulvérisations depuis des semaines ou des mois, plusieurs fois par jour, nez bouché en permanence, flacons achetés en série."
   ],
   "ul": [
    "<b>Arrêter</b> le vasoconstricteur — d'un coup ou une narine à la fois, en annonçant que l'obstruction va durer quelques jours.",
    "<b>Substituer</b> : lavage salin plusieurs fois par jour (Triomer lavage — fiche 1), onguent nasal si muqueuse irritée (ci-dessous).",
    "<b>Revoir</b> : si l'obstruction persiste malgré un sevrage conduit → médecin sur rendez-vous <span class='n n3'>N3</span>.",
    "Refuser poliment le rachat en série : proposer le sevrage à la place — c'est exactement le mésusage décrit par la littérature."
   ],
   "warn": [
    "Corticoïde nasal en appui du sevrage : pratique répandue mais <b>hors des indications FI vérifiées</b> de la mométasone (rhinite allergique, polypes, rhinosinusite aiguë) — décision médicale, <span class='nv'>non vérifié</span> pour cette indication.",
    "Mometason Mepha spray 50 mcg est en <span class='cat cat-B'>B</span> (FI : rhinite allergique dès 6 ans · rhinosinusite aiguë non compliquée dès 12 ans · grossesse « IPr »). Sa remise sans ordonnance relève de l'art. 45 OMéd (fiche T1) ; son inscription précise à l'annexe 2 : <span class='nv'>non vérifié</span> — l'annexe n'est publiée que par renvoi, illisible cette session."
   ]
  },
  {
   "t": "Sécheresse nasale",
   "open": true,
   "p": [
    "Muqueuse sèche, croûtes, petites fissures — l'hiver du chauffage. L'air sec et le grattage sont aussi des causes classiques d'épistaxis (ameli — <b>non suisse</b>) : traiter la sécheresse, c'est prévenir le saignement."
   ],
   "ul": [
    "Humidifier l'air de la chambre, boire, éviter le grattage et le mouchage agressif.",
    "Croûtes hémorragiques persistantes, obstruction chronique unilatérale, échec des soins locaux → médecin <span class='n n3'>N3</span>."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Vigilance"
    ],
    "rows": [
     [
      "Bepanthen MED ong nasal 50 mg/g",
      "dexpanthénol",
      "<span class='cat cat-D'>D</span>",
      "dès 2 ans : <span class='dose'>1–3×/j</span>",
      "sécheresse, narines irritées, après chirurgie nasale (FI)"
     ],
     [
      "Triomer lavage nasal",
      "eau de mer, NaCl 0.9 %",
      "disp. méd.",
      "<span class='dose'>1–3 jets</span> jusqu'à <span class='dose'>6×/j</span>",
      "<3 ans : non — gouttes NaCl 0.9 % chez les plus petits"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—"
     ]
    ]
   }
  },
  {
   "t": "Épistaxis — gestes au comptoir",
   "open": true,
   "p": [
    "Technique à montrer, pas seulement à dire (ameli — <b>non suisse</b>) :"
   ],
   "ol": [
    "Asseoir le patient, tête <b>penchée en avant</b>, regard vers le sol — jamais en arrière.",
    "Moucher une fois, doucement, pour évacuer les caillots.",
    "Pincer les ailes du nez <span class='dose'>10 min</span> en continu, sans relâcher pour vérifier — « le temps normal de coagulation est d'au moins 7 minutes ».",
    "En appoint : glace sur le milieu du visage, au-dessus du nez.",
    "Après l'arrêt : pas de mouchage pendant <span class='dose'>12 h</span>, pas d'effort physique marqué pendant <span class='dose'>2 semaines</span>."
   ],
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Saignement des deux narines qui coule dans l'arrière-gorge (postérieur)",
      "Pâleur, malaise, sueurs, pouls rapide",
      "Épistaxis abondante sous <b>anticoagulant</b>",
      "Traumatisme grave (face, crâne)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Saignement qui ne cède pas malgré deux compressions correctes de <span class='dose'>10 min</span> — convention de l'outil",
      "Récidive rapprochée le jour même chez un patient fragile ou anticoagulé"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Épistaxis récidivantes sans cause évidente — surtout si toujours du même côté",
      "Sécheresse et croûtes qui résistent aux soins locaux"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Épistaxis antérieure banale, stoppée par la compression : prévention (humidification, onguent, pas de grattage) et consigne de revenir si récidive."
     ]
    }
   ],
   "warn": [
    "Causes fréquentes à évoquer en questionnant : infection respiratoire en cours, air sec, grattage, décongestionnants nasaux, traumatisme (ameli — <b>non suisse</b>). Le décongestionnant du rhume de la semaine passée peut être la cause du saignement de cette semaine."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Enfant",
      "Bepanthen MED : dès <span class='dose'>2 ans</span> (FI). Xylométazoline 0.05 % : 2–12 ans, 1–2 ans sur prescription (fiche 1). Lavage : gouttes NaCl 0.9 % chez les plus petits. Épistaxis récidivantes de l'enfant : médecin <span class='n n3'>N3</span>."
     ],
     [
      "Grossesse / allaitement",
      "Xylométazoline : sauf avis médical (FI — fiche T2). Mométasone : grossesse « IPr » (FI). Congestion de la grossesse : privilégier le lavage salin."
     ],
     [
      "Anticoagulés",
      "Épistaxis abondante = <span class='n n1'>N1</span> (ameli — <b>non suisse</b>). Même modérée mais répétée : consultation le jour même <span class='n n2'>N2</span>. Documenter au dossier."
     ],
     [
      "Personne âgée",
      "Air sec + anticoagulants + muqueuse fragile : la triade du saignement d'hiver. Prévention active (onguent, humidification) plutôt que gestion de crise."
     ]
    ]
   }
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
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Mometason Mepha spray nasal 50 mcg · Bepanthen MED ong nasal 50 mg/g — plus réutilisation (30.08.2026) : Otrivin 0.1 % et 0.05 %, Triomer lavage nasal",
      "30.08.2026"
     ],
     [
      "Ann. fr. d'ORL (<b>non suisse</b>)",
      "« Effet rebond et rhinite aux vasoconstricteurs nasaux en pratique clinique », revue d'experts, 2013 (résumé)",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Saignement de nez ou épistaxis » — technique, urgences, prévention",
      "30.08.2026"
     ],
     [
      "Fedlex",
      "RO 2025/602 — modification de l'annexe 2 OMéd du 25.09.2025 (contenu publié par renvoi uniquement, non lisible)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f3": [
  {
   "t": "Contexte et épidémiologie suisse",
   "open": true,
   "p": [
    "La pharyngite est la 3ᵉ cause de consultation ambulatoire (<span class='dose'>4.3 %</span>). La grande majorité est virale ; <span class='dose'>5–15 %</span> sont bactériennes, surtout à <em>Streptococcus pyogenes</em> (strep A / GABHS). L'antibiotique ne raccourcit les symptômes que de <span class='dose'>1–2 j</span> (HUG, stratégie IVRS 2021).",
    "Vague d'infections <b>invasives</b> à strep A depuis fin 2022 : <span class='dose'>194</span> cas pédiatriques recensés par la SPSU d'octobre 2022 à mars 2023, contre <span class='dose'>41</span> sur toute l'année 2019 ; co-infections virales fréquentes ; pas de déclaration obligatoire (UCMT Valais, avril 2023). Le contexte impose une vigilance particulière chez l'enfant — sans transformer chaque angine en urgence."
   ]
  },
  {
   "t": "Signes typiques et diagnostic différentiel",
   "open": true,
   "table": {
    "head": [
     "Tableau",
     "Ce qu'on voit",
     "Orientation"
    ],
    "rows": [
     [
      "Pharyngite virale",
      "mal de gorge + toux, rhinorrhée, enrouement ; fièvre modérée ; état général conservé",
      "comptoir <span class='n n4'>N4</span>"
     ],
     [
      "Angine à strep A",
      "fièvre ≥<span class='dose'>38 °C</span>, <b>pas de toux</b>, exsudat amygdalien, adénopathies cervicales antérieures douloureuses (= les critères de Centor)",
      "score de Centor ci-dessous"
     ],
     [
      "Scarlatine (enfant 5–10 ans)",
      "gorge rouge vif + fièvre/frissons + plaques rouges de minuscules boutons (visage, tronc, aines, aisselles), peau râpeuse, visage écarlate avec pâleur autour de la bouche, langue framboisée ou enduit blanchâtre, puis desquamation des mains (monenfantestmalade.ch — HUG)",
      "médecin aujourd'hui <span class='n n2'>N2</span>"
     ],
     [
      "À ne pas rater (HUG)",
      "mononucléose / primo-infection VIH (syndrome mononucléosique), gonorrhée pharyngée selon contexte",
      "médecin <span class='n n3'>N3</span>"
     ]
    ]
   }
  },
  {
   "t": "Score de Centor — 1 point par critère",
   "open": true,
   "p": [
    "<b><span class='dose'>0–2</span> points</b> : pas de test rapide, pas d'antibiotique. <b><span class='dose'>3–4</span> points</b> : test rapide strep A <em>si</em> une antibiothérapie est envisagée — et chez l'adulte, antibiotique uniquement si Centor 3–4 <b>et</b> test positif <b>et</b> après discussion (HUG 2021).",
    "Cadrage suisse : la prévention du RAA ou des complications suppuratives <b>ne justifie pas</b> l'antibiotique (nombre à traiter très élevé) ; l'observation avec traitement symptomatique est possible même en cas de strep A confirmé. Chez l'enfant, l'angine strep non compliquée se traite <b>symptomatiquement, sans antibiotique</b> (PIGS, 31.03.2023). L'art. 45 OMéd n'ouvre de toute façon aucun antibiotique systémique au comptoir (fiche T1)."
   ],
   "ul": [
    "Fièvre rapportée ou mesurée ≥<span class='dose'>38.0 °C</span>",
    "Absence de toux",
    "Exsudat amygdalien",
    "Adénopathies cervicales antérieures douloureuses"
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Toux ? Rhume associé ?",
      "Un tableau viral d'ensemble",
      "Pas de toux + fièvre + exsudat → compter Centor"
     ],
     [
      "Peut-il avaler ? Ouvrir la bouche ? La voix ?",
      "Abcès péri-amygdalien : trismus, asymétrie du voile, bombement amygdalien (HUG)",
      "<span class='n n1'>N1</span>"
     ],
     [
      "Bave-t-il ? Position assise penchée ? Dyspnée inspiratoire ?",
      "Épiglottite : état hautement fébrile, aspect toxique, difficulté à avaler la salive, péjoration rapide (HUG)",
      "<span class='n n1'>N1</span>"
     ],
     [
      "Éruption cutanée ? Langue framboisée ?",
      "Scarlatine",
      "<span class='n n2'>N2</span>"
     ],
     [
      "Adolescent : fièvre haute qui persiste + douleur du cou ?",
      "Syndrome de Lemierre — thrombose jugulaire (HUG : « au moindre doute, adresser aux urgences »)",
      "<span class='n n1'>N1</span>"
     ],
     [
      "Enfant : état général ? Varicelle en cours ?",
      "Risque iGAS : fièvre haute persistante, net fléchissement, difficultés respiratoires, douleurs ORL ou musculo-articulaires, peau rougie — <b>surtout si varicelle active</b> (PIGS)",
      "<span class='n n1'>N1</span>–<span class='n n2'>N2</span> selon l'état"
     ],
     [
      "Enfant : urine ?",
      "Déshydratation — pas d'urine depuis <span class='dose'>8 h</span> (monenfantestmalade.ch)",
      "<span class='n n1'>N1</span>"
     ],
     [
      "Depuis quand la fièvre ?",
      "Fièvre ><span class='dose'>38.5 °C</span> durant plus de <span class='dose'>3 j</span> (monenfantestmalade.ch)",
      "<span class='n n2'>N2</span>"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Trismus, asymétrie du voile, voix étouffée — suspicion d'abcès péri-amygdalien (HUG : référence ORL)",
      "Aspect toxique, bave, dyspnée inspiratoire, aggravation rapide — suspicion d'épiglottite : « hospitalisation en urgence » (HUG)",
      "Adolescent : pharyngite + fièvre haute persistante + douleur cervicale — suspicion de Lemierre (HUG)",
      "Enfant : difficultés respiratoires, fléchissement marqué, pas d'urine depuis <span class='dose'>8 h</span> (PIGS · monenfantestmalade.ch)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Éruption scarlatiniforme — l'antibiotique se décide en consultation, pas au comptoir",
      "Centor <span class='dose'>3–4</span> si une antibiothérapie mérite d'être discutée (test rapide chez le médecin)",
      "Enfant : fièvre haute persistante avec baisse de l'état général, varicelle active (PIGS) · fièvre ><span class='dose'>38.5 °C</span> plus de <span class='dose'>3 j</span>",
      "Dysphagie fébrile marquée sans signe d'abcès"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Mal de gorge qui traîne au-delà d'une semaine sans amélioration",
      "Suspicion de mononucléose (asthénie marquée), contexte à risque IST — dépistage (HUG)"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Mal de gorge dans un tableau viral, état général conservé : antalgique systémique ± topique de confort. Annoncer : « si trismus, difficulté à avaler la salive, éruption, ou fièvre au-delà de 3 jours → médecin »."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "Base du traitement (HUG) : <b>AINS ou analgésique par voie générale pour tous</b>, pharyngite virale ou bactérienne. Les topiques sont un appoint."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span>",
      "—",
      "cumul toutes sources — fiche T2"
     ],
     [
      "Algifor-L forte cpr 400 mg",
      "ibuprofène",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>, max <span class='dose'>1200 mg/j</span>",
      "<span class='dose'>3 j</span>",
      "« ne pas délivrer » de la fiche T2"
     ],
     [
      "neo-angin pastilles / junior",
      "lidocaïne 1.23 mg + cétylpyridinium 1.25 mg",
      "<span class='cat cat-D'>D</span>",
      "6–12 ans : <span class='dose'>1 cp</span> (ou junior) toutes les <span class='dose'>1–2 h</span> · >12 ans : <span class='dose'>1 cp 1–2 h</span> (forte <span class='dose'>1–3 h</span>)",
      "—",
      "CI allaitement (FI)"
     ],
     [
      "Mebucaïne N cpr à sucer",
      "cétylpyridinium 2 mg + lidocaïne 1 mg",
      "<span class='cat cat-D'>D</span>",
      "adultes : <span class='dose'>1 cp</span> toutes les <span class='dose'>2–3 h</span>, max <span class='dose'>6 cp/j</span>",
      "<span class='dose'>3 j</span>",
      "adultes seulement · CI allaitement · pas juste avant de manger/boire (FI)"
     ],
     [
      "neo-angin dolo spray",
      "flurbiprofène (AINS)",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>3 jets</span> toutes les <span class='dose'>3–6 h</span>, max <span class='dose'>15 jets/j</span>",
      "<span class='dose'>3 j</span>",
      "CI d'AINS complètes malgré la voie locale : ulcère (même ancien), hémorragies GI, diathèse hémorragique, IC/IR/IH sévères, grossesse, allaitement, <12 ans (FI)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Honnêteté due au patient (HUG) : les sprays et pastilles avec anesthésique local ou antiseptique sont « moins efficaces ou n'ont pas démontré leur efficacité ». Les vendre comme confort, jamais comme traitement — la base reste l'antalgique systémique."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Enfant",
      "Angine strep non compliquée : traitement symptomatique <b>sans antibiotique</b> (PIGS) — mais scarlatine ou signes iGAS → médecin (voir triage). neo-angin junior dès <span class='dose'>6 ans</span> ; Mebucaïne N : adultes seulement ; dolo spray : CI <12 ans (FI). Fièvre → fiche 15. <b>Varicelle en cours = terrain à risque iGAS</b> (PIGS)."
     ],
     [
      "Grossesse / allaitement",
      "Les trois topiques vérifiés : CI allaitement ; dolo spray : CI grossesse (FI). AINS systémiques : fiche T2. Paracétamol grossesse : <span class='nv'>non vérifié</span> — vérifier la FI avant délivrance (fiche 1)."
     ],
     [
      "Anticoagulés / troubles de la coagulation",
      "dolo spray : CI diathèse hémorragique et antécédents d'hémorragie GI (FI). AINS systémiques : <span class='nv'>non vérifié</span> — s'abstenir (fiche T2)."
     ],
     [
      "Personne âgée polymédiquée",
      "AINS : triple whammy (fiche T2). Dysphagie vraie chez la personne âgée : ne pas banaliser — évaluation médicale <span class='n n3'>N3</span>."
     ],
     [
      "Immunosupprimés",
      "Seuil d'orientation abaissé d'un cran : un mal de gorge fébrile → au minimum <span class='n n2'>N2</span>."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Hydratation régulière ; ménager la voix.",
    "Hygiène des mains — « le meilleur moyen de prévention » (HUG).",
    "Gargarismes : pas de bénéfice préventif démontré (HUG).",
    "Scarlatine sous antibiotique : plus contagieux <span class='dose'>24 h</span> après le début du traitement ; retour en collectivité une fois afébrile et en forme (monenfantestmalade.ch).",
    "Arrêt de travail possible selon la sévérité et l'activité professionnelle (HUG)."
   ]
  },
  {
   "t": "Phytothérapie et compléments — niveaux de preuve",
   "table": {
    "head": [
     "Substance",
     "Preuve",
     "Commentaire"
    ],
    "rows": [
     [
      "Zinc (<span class='dose'>75 mg/j</span>, dans les 24 premières heures)",
      "faible — « à confirmer avant de recommander de routine » (HUG)",
      "réduirait la durée de la toux et de la rhinorrhée ; cf. aussi Cochrane 2024 (fiche 1)"
     ],
     [
      "Échinacée, vitamines C, D, E",
      "non recommandées en traitement des IVRS — efficacité non démontrée ou incertaine (HUG)",
      "prévention : pas de bénéfice (HUG) ; détail Cochrane en fiche 1"
     ],
     [
      "Sauge (pastilles, gargarisme)",
      "<span class='nv'>non vérifié</span>",
      "aucune source ouverte cette session"
     ]
    ]
   }
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
      "HUG — Service de médecine de premier recours",
      "« Stratégie infections des voies respiratoires supérieures », 2021 — pharyngite, score de Centor, red flags, traitements",
      "30.08.2026"
     ],
     [
      "UCMT — Pharmacien/médecin cantonal VS",
      "Bulletin n° 3, avril 2023 — infections à SGA et invasives (SPSU 194 cas oct. 2022–mars 2023 vs 41 en 2019)",
      "30.08.2026"
     ],
     [
      "PIGS (infectiologie pédiatrique suisse)",
      "Statement iGAS enfants, 31.03.2023 — signes d'alerte, angine strep enfant sans antibiotique, varicelle",
      "30.08.2026"
     ],
     [
      "monenfantestmalade.ch (HUG)",
      "Fiche « Scarlatine » — clinique, quand consulter, contagiosité",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : neo-angin pastilles/junior · Mebucaïne N cpr à sucer · neo-angin dolo spray — plus réutilisation (30.08.2026) : Dafalgan 500, Algifor-L forte 400",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f4": [
  {
   "t": "Contexte et épidémiologie",
   "open": true,
   "p": [
    "Infection des muqueuses du nez et des sinus de moins de <span class='dose'>4 semaines</span>, dans la très grande majorité virale (rhinovirus, influenza, para-influenza — le SARS-CoV-2 peut se présenter ainsi). Seuls <span class='dose'>0.5–2 %</span> des patients ont une origine bactérienne (pneumocoque <span class='dose'>41 %</span>, <em>H. influenzae</em> <span class='dose'>35 %</span>), le plus souvent par surinfection d'une forme virale ; l'allergie, une obstruction mécanique ou une immunodéficience la favorisent. La forme virale se résout en <span class='dose'>7–10 j</span> (HUG, stratégie IVRS 2021).",
    "Conséquence de comptoir : la sinusite d'hiver est d'abord une complication du rhume (fiche 1) — et l'antibiotique, même en cas bactérien, n'a qu'une « efficacité modérée » (HUG)."
   ]
  },
  {
   "t": "Signes typiques — par localisation",
   "open": true,
   "p": [
    "Le trio caractéristique : rhinorrhée purulente, congestion ou obstruction nasale, douleur faciale <b>aggravée tête penchée en avant</b>. Signes plus inconstants : douleur dentaire maxillaire, fièvre, toux, hyposmie/anosmie, pression dans l'oreille, halitose (HUG)."
   ],
   "table": {
    "head": [
     "Localisation",
     "Ce que décrit le patient"
    ],
    "rows": [
     [
      "Maxillaire",
      "douleur infra-orbitaire uni- ou bilatérale, augmentée tête penchée en avant ; parfois pulsatile, maximale en fin d'après-midi et la nuit"
     ],
     [
      "Frontale",
      "céphalée sus-orbitale"
     ],
     [
      "Ethmoïdale",
      "comblement de l'angle interne de l'œil, <b>œdème palpébral</b>, céphalée rétro-orbitaire"
     ],
     [
      "Sphénoïdale",
      "céphalée rétro-orbitaire permanente irradiant au vertex, pouvant simuler une hypertension intracrânienne ; écoulement purulent sur la paroi pharyngée postérieure"
     ]
    ]
   }
  },
  {
   "t": "Virale ou bactérienne ? Les critères suisses",
   "open": true,
   "p": [
    "Haute probabilité bactérienne — c'est-à-dire discussion d'antibiothérapie <b>chez le médecin</b> — si l'un de ces tableaux est présent (HUG, recommandations suisses) :"
   ],
   "ul": [
    "Symptômes depuis ≥<span class='dose'>10 j</span> sans amélioration",
    "Fièvre élevée (≥<span class='dose'>39.0 °C</span>) <b>et</b> écoulement purulent ou douleur faciale pendant au moins <span class='dose'>3–4 j</span> consécutifs",
    "Aggravation après une amélioration initiale — le « double-sickening » vers <span class='dose'>5–6 j</span>",
    "Fièvre, céphalées ou sécrétions accrues survenant après une IVRS"
   ],
   "warn": [
    "Ni radiographie ni CT en première intention — le diagnostic est clinique (HUG). Et aucun antibiotique ne part du comptoir : art. 45 OMéd, fiche T1."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Depuis quand ? Amélioration puis rechute ?",
      "Le « double-sickening »",
      "Aggravation après mieux initial <span class='n n2'>N2</span> · ≥<span class='dose'>10 j</span> sans amélioration <span class='n n3'>N3</span>"
     ],
     [
      "Fièvre ? Combien ?",
      "Signe de gravité",
      "≥<span class='dose'>39 °C</span> + céphalées importantes <span class='n n1'>N1</span> · ≥39 °C + purulence/douleur ≥3–4 j <span class='n n2'>N2</span>"
     ],
     [
      "Les yeux ? La vision ?",
      "Cellulite orbitaire, complication",
      "Diplopie, œdème ou rougeur périorbitaire, baisse d'acuité visuelle <span class='n n1'>N1</span>"
     ],
     [
      "La tête ? Le comportement ?",
      "Méningite, complication intracrânienne",
      "Déficit neurologique, confusion <span class='n n1'>N1</span>"
     ],
     [
      "Enfant : paupière gonflée ?",
      "Ethmoïdite",
      "Œdème palpébral fébrile <span class='n n1'>N1</span>"
     ],
     [
      "Terrain ?",
      "Immunodéficience, allergie, obstruction connue",
      "Immunosupprimé fébrile <span class='n n2'>N2</span>"
     ],
     [
      "Déjà pris quoi ?",
      "Vasoconstricteur au long cours, cumul paracétamol",
      "→ fiches 2 et T2"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1)."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Fièvre ≥<span class='dose'>39 °C</span> avec céphalées importantes, diplopie, œdème ou érythème périorbitaire, baisse d'acuité visuelle, déficit neurologique ou confusion — « évaluation en urgence » : méningite ou cellulite orbitaire (HUG)",
      "Enfant avec œdème palpébral fébrile — ethmoïdite jusqu'à preuve du contraire"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Fièvre ≥<span class='dose'>39 °C</span> et écoulement purulent ou douleur faciale depuis <span class='dose'>3–4 j</span> (critère bactérien suisse)",
      "« Double-sickening » : rechute après amélioration initiale",
      "Immunosupprimé avec tableau de sinusite fébrile"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "≥<span class='dose'>10 j</span> sans amélioration malgré un traitement symptomatique bien conduit",
      "Sinusites à répétition — chercher l'allergie, l'obstruction, le terrain (fiche 21)"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Tableau viral <10 j sans signe de gravité : « attente vigilante » et traitement symptomatique (HUG). Annoncer la durée — <span class='dose'>7–10 j</span> — et les motifs de retour : fièvre ≥39, œil qui gonfle, rechute après mieux."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "Gestion initiale recommandée pour tous, virale ou bactérienne, sans signe de gravité : <b>watchful waiting</b> + symptomatique (HUG) — AINS/antalgique, vasoconstricteur nasal (<b>forme virale uniquement</b>), vasoconstricteur oral ± anti-H1, solution saline."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Triomer lavage nasal",
      "eau de mer, NaCl 0.9 %",
      "disp. méd.",
      "<span class='dose'>1–3 jets</span> jusqu'à <span class='dose'>6×/j</span>",
      "—",
      "<3 ans : non · option validée HUG"
     ],
     [
      "Otrivin Rhume spray nasal 0.1 %",
      "xylométazoline",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>1 jet</span> max <span class='dose'>3×/j</span>",
      "<span class='dose'>1 sem</span>",
      "forme <b>virale uniquement</b> (HUG) · CI fiche T2 · rebond fiche 2"
     ],
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span>",
      "—",
      "cumul — fiche T2"
     ],
     [
      "Algifor-L forte cpr 400 mg",
      "ibuprofène",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>, max <span class='dose'>1200 mg/j</span>",
      "<span class='dose'>3 j</span>",
      "« ne pas délivrer » — fiche T2"
     ],
     [
      "NeoCitran Grippe/refroid. pdr adultes",
      "paracétamol + phéniramine + phényléphrine",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>1 sachet</span> max <span class='dose'>3×/j</span>",
      "<span class='dose'>3 j</span>",
      "l'option « vasoconstricteur oral + anti-H1 » citée HUG · >14 ans · cumul paracétamol — fiche T2"
     ],
     [
      "Pretufen rhume &amp; douleurs",
      "ibuprofène 200 + pseudoéphédrine 30",
      "<span class='cat cat-D'>D</span>",
      "> 15 ans : <span class='dose'>1–2 cp</span>, max <span class='dose'>6 cp/j</span>",
      "<span class='dose'>3 j</span>",
      "indication FI : congestion + céphalées/fièvre de la rhinosinusite aiguë · HPC SEPR/SVCR — fiche T2"
     ],
     [
      "Mometason Mepha spray 50 mcg",
      "mométasone furoate",
      "<span class='cat cat-B'>B</span>",
      "HUG : <span class='dose'>2×1–2</span> nébulisations/narine/j (<span class='dose'>200–400 µg/j</span>)",
      "—",
      "FI : rhinosinusite aiguë non compliquée dès 12 ans · grossesse « IPr » · efficacité modérée, NPT <span class='dose'>15</span> (HUG)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Mométasone en <span class='cat cat-B'>B</span> : remise sans ordonnance par le pharmacien en personne, avec documentation (art. 45/47/48 OMéd — fiche T1) ; inscription à l'annexe 2 <span class='nv'>non vérifié</span> (fiche 2). La posologie « rhinosinusite » ci-dessus vient de la stratégie HUG — la page FI publique ne détaille que la rhinite allergique."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Enfant",
      "La sinusite de l'enfant est un terrain à part : <b>œdème palpébral fébrile = <span class='n n1'>N1</span></b>. Otrivin 0.05 % : 2–12 ans (fiche 1). Pas de NeoCitran (<14 ans), pas de Pretufen (<15 ans). Mométasone : rhinosinusite dès <span class='dose'>12 ans</span> seulement (FI)."
     ],
     [
      "Grossesse / allaitement",
      "Xylométazoline : sauf avis médical (FI). Mométasone : grossesse « IPr » (FI). Pseudoéphédrine et NeoCitran : CI (FI). AINS : fiche T2. Le lavage salin reste le premier geste."
     ],
     [
      "Personne âgée polymédiquée",
      "Pseudoéphédrine : HPC Swissmedic (T2). AINS : triple whammy (T2). Phéniramine : charge anticholinergique (T2)."
     ],
     [
      "Asthme / anticoagulés / IR-IH",
      "Renvois fiche T2 — AINS et paracétamol."
     ],
     [
      "Immunosupprimés",
      "Cas particulier des recommandations suisses (HUG) : seuil abaissé, sinusite fébrile → <span class='n n2'>N2</span>."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Lavages salins réguliers — l'option la plus sûre du traitement initial (HUG).",
    "Hydratation ; dormir la tête légèrement surélevée (la douleur augmente tête penchée en avant).",
    "Annoncer l'évolution attendue : <span class='dose'>7–10 j</span> pour une forme virale (HUG) — la purulence seule n'est pas un critère d'antibiotique.",
    "Inhalations de vapeur : <span class='nv'>non vérifié</span> — aucune source ouverte cette session."
   ]
  },
  {
   "t": "Phytothérapie et compléments",
   "table": {
    "head": [
     "Substance",
     "Preuve",
     "Commentaire"
    ],
    "rows": [
     [
      "Échinacée, vitamines C, D, E",
      "non recommandées (HUG — IVRS)",
      "détail Cochrane : fiche 1"
     ],
     [
      "Huiles essentielles, cinéole/myrtol per os",
      "<span class='nv'>non vérifié</span>",
      "aucune source ouverte cette session — ne pas improviser une posologie"
     ]
    ]
   }
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
      "HUG — Service de médecine de premier recours",
      "« Stratégie infections des voies respiratoires supérieures », 2021, section rhino-sinusite — épidémiologie, localisations, signes de gravité, critères bactériens suisses, watchful waiting, corticoïde intranasal",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Réutilisation des pages ouvertes le 30.08.2026 : Triomer lavage · Otrivin 0.1 % · Dafalgan 500 · Algifor-L forte 400 · NeoCitran · Pretufen · Mometason Mepha 50 mcg",
      "30.08.2026"
     ],
     [
      "Swissmedic",
      "HPC pseudoéphédrine du 30.04.2024 (fiche T2)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f5": [
  {
   "t": "Contexte et clinique",
   "open": true,
   "p": [
    "L'otite moyenne aiguë purulente (OMAP) est nettement plus fréquente chez l'enfant — pratiquement <span class='dose'>100 %</span> des enfants en ont fait une à 3 ans — et survient dans les suites d'une IVRS, par dysfonction de la trompe d'Eustache (HUG, stratégie IVRS 2021). Germes : pneumocoque, <em>H. influenzae</em>, <em>M. catarrhalis</em>.",
    "Anamnèse type : otalgie aiguë, hypoacousie, fièvre, rhume les jours précédents — et écoulement purulent si le tympan est perforé (HUG). Chez le petit : il se frotte les oreilles sans cesse, grincheux, pleure quand on le couche sur le dos (monenfantestmalade.ch — HUG)."
   ],
   "table": {
    "head": [
     "Tableau",
     "Ce qui le distingue",
     "Orientation"
    ],
    "rows": [
     [
      "Otite moyenne aiguë",
      "otalgie + fièvre après un rhume, hypoacousie",
      "triage ci-dessous"
     ],
     [
      "OMAP perforée",
      "<b>écoulement de l'oreille</b> (otorrhée)",
      "médecin aujourd'hui <span class='n n2'>N2</span> — c'est le cas où l'antibiotique immédiat est recommandé en Suisse (HUG)"
     ],
     [
      "Otite externe",
      "douleur à la <b>traction du pavillon</b>, prurit du conduit, écoulement trouble jaunâtre malodorant (monenfantestmalade.ch)",
      "gouttes antibiotiques = prescription → médecin <span class='n n2'>N2</span>–<span class='n n3'>N3</span> selon intensité"
     ],
     [
      "Otalgie référée",
      "oreille normale — penser dents, gorge (fiche 3), articulation temporo-mandibulaire",
      "selon la cause"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Derrière l'oreille ?",
      "Mastoïdite — la complication la plus fréquente (<span class='dose'>82 %</span> des complications, HUG)",
      "Rougeur et douleur <b>derrière le pavillon</b>, oreille décollée <span class='n n1'>N1</span> (monenfantestmalade.ch : « immédiatement »)"
     ],
     [
      "La nuque ? Le comportement ?",
      "Méningite, complication intracrânienne (HUG)",
      "Nuque raide, confusion, léthargie <span class='n n1'>N1</span>"
     ],
     [
      "Le visage bouge normalement ?",
      "Paralysie faciale (HUG)",
      "Asymétrie faciale <span class='n n1'>N1</span>"
     ],
     [
      "L'oreille coule ?",
      "Perforation tympanique",
      "Otorrhée <span class='n n2'>N2</span> — et <b>aucune goutte auriculaire</b>"
     ],
     [
      "Quel âge ?",
      "Le nourrisson ne bénéficie pas de l'attente",
      "<1 an avec tableau d'otite <span class='n n2'>N2</span> (monenfantestmalade.ch : antibiotique d'emblée)"
     ],
     [
      "Depuis quand ? Traité comment ?",
      "Échec de l'antalgie bien conduite",
      "Fièvre + otalgie persistantes après <span class='dose'>2 j</span> de traitement <span class='n n2'>N2</span> (monenfantestmalade.ch : dans les 24 h)"
     ],
     [
      "Baignade récente ? Traction du pavillon douloureuse ?",
      "Otite externe",
      "Douleur >3 j sous traitement, fièvre ><span class='dose'>38.5 °C</span>, rougeur rétro-auriculaire <span class='n n2'>N2</span>"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Rougeur/douleur derrière le pavillon, oreille décollée — suspicion de mastoïdite : « toute suspicion de complication doit être immédiatement référée pour hospitalisation en urgence » (HUG)",
      "Nuque raide, confusion, paralysie faciale, vertiges majeurs (labyrinthite) — complications (HUG · monenfantestmalade.ch)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Oreille qui coule — OMAP perforée : antibiotique immédiat recommandé (recommandation suisse, HUG)",
      "Nourrisson <span class='dose'><1 an</span> avec tableau d'otite (monenfantestmalade.ch)",
      "Fièvre et otalgie qui persistent après <span class='dose'>2 j</span> d'antalgie correcte",
      "Otite externe fébrile ou très douloureuse — les gouttes antibiotiques sont sur prescription"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Otalgie modérée de l'adulte sans red flag qui ne cède pas — c'est la fenêtre de la « prescription retardée » suisse (HUG : antibiotique initié à 48–72 h si persistance)",
      "Hypoacousie qui persiste après l'épisode",
      "Otites à répétition"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Otalgie dans une IVRS, état général conservé, pas d'otorrhée, enfant >1 an ou adulte : <b>antalgie pour tous</b> (paracétamol ou ibuprofène — HUG) + sérum physiologique nasal. Annoncer : « si l'oreille coule, si rougeur derrière l'oreille, ou pas mieux dans 48 h → médecin »."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "La base (HUG) : <b>antalgie chez tous les patients</b> — l'antibiotique, lui, attend 48–72 h sauf perforation. Le rôle du comptoir est de bien doser l'antalgique et de fixer le rendez-vous de réévaluation."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span> · enfant → fiche 15",
      "—",
      "cumul — fiche T2"
     ],
     [
      "Algifor-L forte cpr 400 mg",
      "ibuprofène",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>, max <span class='dose'>1200 mg/j</span> · enfant → fiche 15",
      "<span class='dose'>3 j</span>",
      "« ne pas délivrer » — fiche T2"
     ],
     [
      "Otalgan gouttes auriculaires",
      "phénazone 50 mg/g + procaïne 10 mg/g",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>5 gttes</span> · 2–12 ans : <span class='dose'>2–3 gttes</span> · toutes les <span class='dose'>2–4 h</span>, max <span class='dose'>4×/j</span>",
      "—",
      "<b>CI : tympan perforé</b> — jamais si l'oreille coule · CI grossesse, allaitement · <2 ans : prescription médicale (FI)"
     ],
     [
      "Triomer lavage nasal",
      "eau de mer, NaCl 0.9 %",
      "disp. méd.",
      "<span class='dose'>1–3 jets</span> jusqu'à <span class='dose'>6×/j</span>",
      "—",
      "décongestionner le nez au sérum physiologique (monenfantestmalade.ch) · <3 ans : gouttes NaCl"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Décongestionnants et antihistaminiques dans l'otite moyenne : « pas de bénéfice, non recommandés » (HUG) — malgré la mention « adjuvant de l'otite moyenne » dans la FI d'Otrivin. Si la famille y tient pour le confort du nez bouché : max <span class='dose'>5 j</span> (monenfantestmalade.ch), et jamais présenté comme traitement de l'oreille.",
    "Gouttes auriculaires chez l'enfant : les pédiatres demandent un avis préalable (« ne pas instiller de gouttes sans avis de votre pédiatre » — monenfantestmalade.ch). Chez l'adulte, Otalgan reste un appoint antalgique local, jamais un traitement de l'infection."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Nourrisson <1 an",
      "Tableau d'otite → médecin le jour même <span class='n n2'>N2</span> (antibiotique d'emblée — monenfantestmalade.ch). Otalgan : <2 ans sur prescription (FI). Fièvre <3 mois → <span class='n n1'>N1</span> (fiche 1)."
     ],
     [
      "Enfant 1–12 ans",
      "Antalgie dosée au poids → fiche 15. Otalgan possible dès 2 ans si tympan intact (FI) — avis pédiatre recommandé pour toute goutte (monenfantestmalade.ch). Réévaluation à <span class='dose'>48 h</span> ferme."
     ],
     [
      "Grossesse / allaitement",
      "Otalgan : CI (FI). AINS : fiche T2. Paracétamol grossesse : <span class='nv'>non vérifié</span> — vérifier la FI (fiche 1)."
     ],
     [
      "Anticoagulés / asthme / IR-IH",
      "Renvois fiche T2 pour l'antalgie systémique."
     ],
     [
      "Immunosupprimés / diabète",
      "Seuil d'orientation abaissé : otalgie fébrile → <span class='n n2'>N2</span>. Otite externe qui traîne sur ce terrain → médecin sans attendre."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Pas de coton-tige ni « boules Quiès » : ils repoussent le cérumen au fond du conduit (monenfantestmalade.ch).",
    "Otite externe : éviter piscine et jeux d'eau pendant toute la durée du traitement (monenfantestmalade.ch).",
    "Moucher, sérum physiologique nasal — la trompe d'Eustache se draine par le nez.",
    "Annoncer l'évolution : sous antibiotique, fièvre et douleur doivent diminuer en <span class='dose'>2 j</span> ; un tympan perforé cicatrise spontanément en quelques jours (monenfantestmalade.ch)."
   ]
  },
  {
   "t": "Phytothérapie et remèdes maison",
   "warn": [
    "Huile tiède, oignon, homéopathie auriculaire : <span class='nv'>non vérifié</span> — aucune source ouverte cette session. Ne rien instiller dans une oreille douloureuse sans certitude d'un tympan intact."
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
      "HUG — Service de médecine de premier recours",
      "« Stratégie infections des voies respiratoires supérieures », 2021, section otite moyenne aiguë — clinique, complications, antalgie pour tous, prescription retardée, perforation",
      "30.08.2026"
     ],
     [
      "monenfantestmalade.ch (HUG)",
      "Fiches « Otite » et « Otite externe » — signes, quand consulter, conseils parents",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Page produit ouverte : Otalgan gouttes — plus réutilisation (30.08.2026) : Dafalgan 500, Algifor-L forte 400, Triomer lavage, Otrivin 0.1 %",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f6": [
  {
   "t": "Contexte et clinique",
   "open": true,
   "p": [
    "Le <b>faux-croup</b> (laryngotrachéite virale) touche surtout l'enfant en bas âge : l'espace sous les cordes vocales est étroit et s'obstrue facilement. Chez le plus grand — et l'adulte — la même infection donne une simple <b>laryngite</b> : voix enrouée, gorge douloureuse (monenfantestmalade.ch — HUG).",
    "Chez l'adulte, la laryngite est « souvent d'origine virale », dans les suites d'un refroidissement, et guérit spontanément en <span class='dose'>~1 semaine</span> ; le surmenage vocal, les irritants et le tabac sont les autres causes classiques. Les formes bactériennes nécessitant un antibiotique sont « très rares » (Antibio'Malin/sante.fr — <b>sources non suisses</b>)."
   ],
   "table": {
    "head": [
     "Tableau",
     "Ce qui le distingue",
     "Orientation"
    ],
    "rows": [
     [
      "Faux-croup (enfant)",
      "quintes de toux « comme un chien qui aboie », voix enrouée, fièvre légère — <b>la nuit</b>, sur <span class='dose'>5–7 j</span> (monenfantestmalade.ch)",
      "gestes + triage ci-dessous"
     ],
     [
      "Laryngite (adulte, grand enfant)",
      "enrouement ou aphonie, gorge irritée, état général conservé",
      "comptoir <span class='n n4'>N4</span> — repos vocal"
     ],
     [
      "Épiglottite — à ne pas confondre",
      "état hautement fébrile, aspect toxique, <b>difficulté à avaler la salive</b>, dyspnée inspiratoire, aggravation rapide (HUG, fiche 3)",
      "<span class='n n1'>N1</span> — hospitalisation en urgence"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Comment respire-t-il, là, au calme ?",
      "Détresse respiratoire",
      "Respiration rapide, <b>musculature qui se creuse</b> (tirage), difficultés qui augmentent <span class='n n1'>N1</span> (monenfantestmalade.ch)"
     ],
     [
      "La couleur des lèvres ?",
      "Hypoxie",
      "Lèvres bleues <span class='n n1'>N1</span>"
     ],
     [
      "Avale-t-il ? Bave-t-il ?",
      "Épiglottite",
      "Peine à avaler, bave continuellement <span class='n n1'>N1</span>"
     ],
     [
      "Quelle fièvre ?",
      "Sévérité",
      "><span class='dose'>39 °C</span> <span class='n n1'>N1</span> (monenfantestmalade.ch : « consulter immédiatement »)"
     ],
     [
      "Quel âge ?",
      "Le tout-petit",
      "Nourrisson <<span class='dose'>6 mois</span> avec tableau laryngé <span class='n n1'>N1</span> (Antibio'Malin — <b>non suisse</b>)"
     ],
     [
      "Depuis quand chez l'enfant ?",
      "Évolution attendue 5–7 j",
      "Pas d'amélioration à <span class='dose'>2–3 j</span> <span class='n n3'>N3</span> (Antibio'Malin)"
     ],
     [
      "Adulte : ça s'aggrave ?",
      "Forme sévère",
      "Difficulté à respirer, fièvre <span class='n n2'>N2</span>"
     ],
     [
      "Adulte : depuis combien de temps la voix ?",
      "Lésion à exclure — nodules, RGO, autre",
      "><span class='dose'>15 j</span> <span class='n n3'>N3</span> · enrouement de plusieurs semaines, otalgie, dysphagie, tuméfaction cervicale <span class='n n3'>N3</span> (sante.fr — <b>non suisse</b>)"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Difficultés respiratoires qui augmentent : respiration rapide, tirage (« sa musculature se creuse ») — monenfantestmalade.ch",
      "Lèvres bleues · peine à avaler et bave continuelle · fièvre ><span class='dose'>39 °C</span> (monenfantestmalade.ch : « consulter immédiatement »)",
      "Nourrisson <<span class='dose'>6 mois</span> avec tableau laryngé (Antibio'Malin — <b>non suisse</b>)",
      "Adulte : suspicion d'épiglottite — aspect toxique, salive, dyspnée inspiratoire (HUG, fiche 3)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "<b>Premier épisode</b> de faux-croup, même calmé par l'air froid — avis médical le même jour (convention de l'outil)",
      "Adulte : laryngite qui s'aggrave — difficulté à respirer, fièvre (Antibio'Malin)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Enfant sans amélioration après <span class='dose'>2–3 j</span> (Antibio'Malin)",
      "Adulte : enrouement ><span class='dose'>15 j</span>, ou persistant avec otalgie, dysphagie ou tuméfaction cervicale — une lésion (nodules, RGO, autre) est à exclure (sante.fr)",
      "Faux-croups à répétition — en parler au pédiatre"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Laryngite banale de l'adulte : repos vocal, hydratation, antalgique si besoin. Annoncer : « la voix revient en une semaine — si dyspnée, fièvre, ou voix toujours cassée à 15 jours → médecin »."
     ]
    }
   ],
   "warn": [
    "La crise de faux-croup sévère se traite en milieu médical (corticoïdes) — rien au comptoir ne remplace le <span class='tel'>144</span> quand l'enfant tire ou bleuit."
   ]
  },
  {
   "t": "Traitement — peu de médicaments",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span> · enfant → fiche 15",
      "fièvre et douleur seulement — cumul, fiche T2"
     ],
     [
      "Pastilles de confort (neo-angin, Mebucaïne N)",
      "→ fiche 3",
      "<span class='cat cat-D'>D</span>",
      "→ fiche 3",
      "confort de la gorge, pas un traitement (HUG) · âges et CI en fiche 3"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—"
     ]
    ]
   },
   "warn": [
    "<b>Pas de sirop antitussif chez l'enfant</b> — la toux est protectrice (Antibio'Malin ; les HUG jugent d'ailleurs les antitussifs inefficaces, cf. fiche 7 à venir). Le faux-croup ne se traite pas avec un sirop.",
    "Ne pas délivrer « quelque chose pour la voix » à répétition à un adulte enroué depuis des semaines : c'est un motif de consultation, pas de vente (sante.fr — lésion à exclure)."
   ]
  },
  {
   "t": "Gestes et conseils non médicamenteux",
   "open": true,
   "ul": [
    "<b>Faux-croup, pendant la quinte</b> : apaiser l'enfant, le prendre dans les bras — « ce sont les premières mesures » ; l'<b>air froid</b> calme souvent la respiration : sortir faire quelques pas dehors, ou aérer grand la chambre (idéal <span class='dose'>18 °C</span>) (monenfantestmalade.ch).",
    "Miel : une cuillère, pure ou diluée, pour les quintes — <b>jamais avant 1 an</b> (risque de botulisme) (monenfantestmalade.ch).",
    "Adulte : <b>repos vocal</b> (parler peu, ne pas chuchoter fort), boire beaucoup — « l'eau aide les cordes vocales à rester humides » —, vapeur, et arrêt du tabac (sante.fr · Antibio'Malin — <b>non suisses</b>).",
    "Prévenir les parents : le faux-croup dure <span class='dose'>5–7 j</span> et les quintes reviennent la nuit — les gestes restent les mêmes, les critères d'urgence aussi."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Nourrisson <1 an",
      "Pas de miel (botulisme — monenfantestmalade.ch). <6 mois avec tableau laryngé : <span class='n n1'>N1</span> (Antibio'Malin)."
     ],
     [
      "Enfant",
      "Antalgique/antipyrétique dosé au poids → fiche 15. Pastilles : âges minimaux en fiche 3."
     ],
     [
      "Fumeur",
      "Enrouement qui persiste : ne pas banaliser — seuil <span class='n n3'>N3</span> ferme, consultation même si la voix « revient un peu »."
     ],
     [
      "Professionnels de la voix (enseignants, chanteurs)",
      "Récidives de surmenage vocal (nodules — sante.fr) : orienter vers médecin/phoniatrie plutôt que pastilles en série."
     ],
     [
      "Grossesse / allaitement",
      "Repos vocal et mesures non médicamenteuses d'abord ; antalgique : fiches T2 et 1."
     ]
    ]
   }
  },
  {
   "t": "Phytothérapie et compléments",
   "table": {
    "head": [
     "Substance",
     "Preuve",
     "Commentaire"
    ],
    "rows": [
     [
      "Miel (≥1 an)",
      "recommandé par la fiche parents HUG pour les quintes",
      "le seul « remède maison » sourcé de cette fiche"
     ],
     [
      "Inhalations de vapeur (adulte)",
      "conseillées par Antibio'Malin (<b>non suisse</b>)",
      "confort ; prudence brûlures chez l'enfant"
     ],
     [
      "Thym, plantes « pour la voix »",
      "<span class='nv'>non vérifié</span>",
      "aucune source ouverte cette session"
     ]
    ]
   }
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
      "monenfantestmalade.ch (HUG)",
      "Fiche « Faux croup » — signes, gestes, air froid, miel, critères immédiats, durée 5–7 j",
      "30.08.2026"
     ],
     [
      "Antibio'Malin — sante.fr (<b>non suisse</b>)",
      "« Laryngite » — origine virale, antibiotiques très rarement, seuils (aggravation, >15 j, enfant 2–3 j, nourrisson <6 mois), pas d'antitussif chez l'enfant",
      "30.08.2026"
     ],
     [
      "sante.fr (<b>non suisse</b>)",
      "« Enrouement de l'adulte » — causes, enrouement persistant/otalgie/dysphagie/tuméfaction → consulter, repos vocal, tabac",
      "30.08.2026"
     ],
     [
      "HUG — Service de médecine de premier recours",
      "Stratégie IVRS 2021 — épiglottite (réutilisation fiche 3)",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Réutilisation (30.08.2026) : Dafalgan 500 · pastilles gorge (fiche 3)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f7": [
  {
   "t": "Contexte — ce que disent les sources",
   "open": true,
   "p": [
    "La toux d'IVRS guérit avec l'infection. Le verdict des HUG est sans détour : antitussifs (dextrométhorphane, codéine) comme expectorants (guaifénésine) « ne sont pas recommandés car ils sont inefficaces ou d'efficacité controversée » — et il n'y a « que très rarement une justification de prescrire un antitussif » (stratégie IVRS 2021). Côté français, même ton : les antitussifs « sont souvent peu efficaces, voire nocifs » (ameli — <b>non suisse</b>).",
    "La distinction opérationnelle du comptoir reste sèche/grasse pour une seule raison : <b>« votre toux est grasse : ne prenez pas d'antitussifs »</b> (ameli) — on ne supprime pas une toux qui draine. Le reste est une hiérarchie d'honnêteté : gestes et miel d'abord, phyto à preuve faible ensuite, butamirate si le patient veut un antitussif, opioïdes en dernier recours documenté."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "La toux ramène-t-elle quelque chose ?",
      "Sèche ou grasse — le choix du rayon",
      "Grasse → <b>jamais d'antitussif</b> (ameli)"
     ],
     [
      "Du sang ? Douleur thoracique ?",
      "Urgence",
      "Crachats teintés de sang ou mousseux + douleur thoracique <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Comment respire-t-il ?",
      "Détresse",
      "Suffocation, cyanose, détresse fébrile <span class='n n1'>N1</span> · nourrisson : battement des ailes du nez, respiration bouche ouverte <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Début brutal en mangeant/jouant ?",
      "Corps étranger",
      "Toux sèche explosive après inhalation suspecte <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Enfant : toux bruyante + fièvre + dysphagie ?",
      "Croup sévère, épiglottite",
      "<span class='n n1'>N1</span> → fiche 6"
     ],
     [
      "Depuis quand ?",
      "La toux qui traîne",
      "><span class='dose'>3 semaines</span> ou aggravation progressive <span class='n n3'>N3</span> (ameli) → fiche 10 · enfant sans fièvre ><span class='dose'>8 j</span> <span class='n n3'>N3</span>"
     ],
     [
      "Quintes + reprise inspiratoire bruyante ?",
      "Coqueluche",
      "<span class='n n2'>N2</span>–<span class='n n3'>N3</span> → fiche 10"
     ],
     [
      "Terrain respiratoire ?",
      "Asthme, BPCO",
      "Toux + sifflements ou dyspnée sur ce terrain → fiche 11"
     ],
     [
      "Ses médicaments ?",
      "Toux médicamenteuse",
      "Toux sèche persistante sous IEC : <span class='nv'>non vérifié</span> — évoquer le médicament, à confirmer avec source"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Adulte fébrile avec suffocation, détresse respiratoire, cyanose (ameli — <b>non suisse</b>)",
      "Douleur thoracique + crachats sanglants ou mousseux (ameli)",
      "Nourrisson : battement des ailes du nez, respiration bouche ouverte (ameli)",
      "Toux explosive après inhalation suspecte de corps étranger (ameli)",
      "Enfant : toux bruyante et stridente + forte fièvre + difficulté à avaler → fiche 6"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Fièvre persistante avec toux productive et état général qui fléchit → fiche 8",
      "Suspicion de coqueluche chez un patient en contact avec un nourrisson → fiche 10"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Toux ><span class='dose'>3 semaines</span>, aggravation progressive ou passage à la chronicité (ameli) → fiche 10",
      "Enfant : toux sans fièvre depuis ><span class='dose'>8 j</span> (ameli)",
      "Toux qui perturbe les activités quotidiennes malgré les mesures (ameli)",
      "Persistance post-IVRS : penser hyperréactivité bronchique, asthme, coqueluche (HUG) → fiches 10–11"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Toux d'IVRS récente, état général conservé : gestes + option de la hiérarchie ci-dessous. Annoncer : « la toux suit le rhume — si elle dure au-delà de 3 semaines, sang, fièvre qui remonte ou souffle court → médecin »."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC — la hiérarchie honnête",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "<b>Toux grasse</b> — Fluimucil toux grasse cpr eff 600 mg",
      "acétylcystéine",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>600 mg/j</span> · 2–12 ans : <span class='dose'>200 mg 2×/j</span>",
      "—",
      "CI ulcère gastroduodénal évolutif, <2 ans (FI) · efficacité des expectorants « controversée » (HUG)"
     ],
     [
      "<b>Toux grasse</b> — Bexine Lierre sirop",
      "lierre extrait sec 35 mg/5 ml",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>5 ml 3×/j</span> · 6–12 : <span class='dose'>5 ml 2×/j</span> · 2–6 : <span class='dose'>2.5 ml 2×/j</span>",
      "—",
      "CI grossesse, allaitement, <2 ans (FI)"
     ],
     [
      "<b>Toux sèche</b> — Bexine Antitussif Butamirat sirop",
      "butamirate 1.5 mg/ml",
      "<span class='cat cat-D'>D</span>",
      "> 18 ans : <span class='dose'>15 ml 4×/j</span> · 12–18 : <span class='dose'>15 ml 3×/j</span> · 6–12 : <span class='dose'>10 ml 3×/j</span> · dès 3 ans : <span class='dose'>5 ml 3×/j</span>",
      "<span class='dose'>1 sem</span>",
      "le seul antitussif non opioïde du rayon · CI intolérance au fructose, allaitement (FI)"
     ],
     [
      "<b>Toux sèche</b> — Bexine sirop 25 mg/10 ml",
      "dextrométhorphane",
      "<span class='cat cat-B'>B</span>",
      "> 12 ans : <span class='dose'>10 ml 3(–4)×/j</span>",
      "<span class='dose'>4 j</span>",
      "« ne pas délivrer » fiche T2 : IMAO/sérotoninergiques 14 j, <1 an, grossesse/allaitement · dépendance/abus"
     ],
     [
      "<b>Toux sèche</b> — Codicalm sirop 5 mg/5 ml",
      "codéine",
      "<span class='cat cat-B'>B</span>",
      "> 12 ans : <span class='dose'>15 ml 3×/j</span>",
      "—",
      "dernier recours · « ne pas délivrer » fiche T2 : <12 ans, allaitement, CYP2D6 ultrarapides, asthme/insuffisance respiratoire · consigner indication + exclusion d'abus (KAV)"
     ],
     [
      "Umckaloabo gouttes",
      "pélargonium",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>30 gtt 3×/j</span> · 6–12 : <span class='dose'>20 gtt</span> · 2–6 : <span class='dose'>10 gtt</span>",
      "<span class='dose'>3 sem</span>",
      "indication FI : bronchite aiguë → fiche 8 · CI hépatopathie sévère, grossesse, allaitement (FI)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Règle absolue : <b>toux grasse = pas d'antitussif</b>, opioïde ou non (ameli — CI explicite). Et chez l'enfant, pas de sirop antitussif du tout : la toux est protectrice (Antibio'Malin, fiche 6).",
    "Vendre honnête : aucun de ces produits n'a de preuve solide (HUG : « inefficaces ou d'efficacité controversée »). Le dire au patient, proposer le miel et les gestes d'abord — et garder les opioïdes B pour l'adulte qui ne dort plus, avec anamnèse documentée."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Enfant",
      "Pas d'antitussif — toux protectrice (Antibio'Malin). Si les parents insistent sur une toux sèche épuisante : butamirate dès <span class='dose'>3 ans</span> (FI), en expliquant la preuve faible. NAC : CI <2 ans ; lierre : CI <2 ans. Codéine : CI <12 ans (T2). Nourrisson qui tousse mal → <span class='n n1'>N1</span>/<span class='n n2'>N2</span> selon l'état."
     ],
     [
      "Grossesse / allaitement",
      "Lierre : CI G/A (FI). Butamirate : CI allaitement (FI). Umckaloabo : CI G/A (FI). DXM : CI G/A (T2). Codéine : « IPr »/CI allaitement (T2). NAC grossesse : <span class='nv'>non vérifié</span>. Il reste : miel, hydratation, position — et le médecin si la toux épuise."
     ],
     [
      "Personne âgée polymédiquée",
      "Opioïdes antitussifs : sédation, interactions — T2. Vérifier IEC (toux médicamenteuse, <span class='nv'>non vérifié</span>) avant de vendre un énième sirop."
     ],
     [
      "Asthme / BPCO",
      "Toux + sifflements ou dyspnée : ce n'est plus un conseil de comptoir → fiche 11. Codéine : CI en crise d'asthme (T2)."
     ],
     [
      "Fumeur",
      "La « toux du fumeur » qui change de caractère ou traîne : <span class='n n3'>N3</span> ferme — fiche 10."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Miel — une cuillère, surtout avant le coucher : « effet apaisant » (ameli) ; jamais avant <span class='dose'>1 an</span> (fiche 6).",
    "Dormir la tête surélevée ; boire régulièrement (ameli).",
    "Gestes barrière : tousser dans le pli du coude ou un mouchoir jetable, lavage des mains <span class='dose'>30 s</span> (ameli).",
    "Air non enfumé, chambre aérée — et annoncer que la toux post-rhume peut mettre du temps à s'éteindre sans être inquiétante avant <span class='dose'>3 semaines</span>."
   ]
  },
  {
   "t": "Phytothérapie et compléments — niveaux de preuve",
   "table": {
    "head": [
     "Substance",
     "Preuve",
     "Commentaire"
    ],
    "rows": [
     [
      "Miel",
      "recommandé par ameli et la fiche parents HUG (fiche 6)",
      "le meilleur rapport preuve/risque du rayon toux — ≥1 an"
     ],
     [
      "Pélargonium (Umckaloabo)",
      "Cochrane 2013 : effet possible mais preuves « faibles à très faibles », essais d'une seule région, biais de publication suspecté",
      "FI : bronchite aiguë ; EI plus fréquents, non graves"
     ],
     [
      "Lierre",
      "<span class='nv'>non vérifié</span> — pas de revue ouverte cette session",
      "l'indication FI « toux avec mucus » est vérifiée, le niveau de preuve non"
     ],
     [
      "Zinc (75 mg/j, <24 h)",
      "faible — « à confirmer » (HUG)",
      "réduirait la durée de la toux — cf. fiches 1 et 3"
     ]
    ]
   }
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
      "HUG — Service de médecine de premier recours",
      "Stratégie IVRS 2021 — antitussifs et expectorants non recommandés, persistance post-IVRS (coqueluche, asthme), zinc",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Quand consulter et comment calmer la toux » — urgences, seuils 3 semaines/8 j enfant, CI antitussifs sur toux grasse, miel",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Fluimucil toux grasse 600 · Bexine Lierre · Bexine Antitussif Butamirat · Umckaloabo — plus réutilisation T2 (30.08.2026) : Bexine DXM, Codicalm",
      "30.08.2026"
     ],
     [
      "Cochrane (<b>non suisse</b>)",
      "Pelargonium sidoides CD006323 (2013) — preuves faibles à très faibles",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f8": [
  {
   "t": "Contexte et clinique",
   "open": true,
   "p": [
    "« La bronchite aiguë est une maladie presque toujours virale » qui « guérit spontanément en environ dix jours » ; un antibiotique est « inutile et inefficace : les antibiotiques ne réduisent ni la durée, ni l'évolution des symptômes » chez l'adulte comme chez l'enfant sans comorbidité (ameli — <b>source non suisse</b>).",
    "La toux, elle, prend son temps : « entre cinq et dix jours, voire plus de deux ou trois semaines » (ameli). C'est l'information qui désamorce le retour au comptoir de J+8 — l'annoncer d'emblée."
   ],
   "table": {
    "head": [
     "Tableau",
     "Ce qui le distingue",
     "Orientation"
    ],
    "rows": [
     [
      "Bronchite aiguë",
      "toux (sèche puis grasse), fièvre modérée qui cède, état général conservé",
      "comptoir <span class='n n4'>N4</span>"
     ],
     [
      "Pneumonie à suspecter",
      "fièvre qui persiste ou remonte, dyspnée, état général qui fléchit — la radiographie se prescrit en consultation (ameli)",
      "<span class='n n2'>N2</span>"
     ],
     [
      "Bronchiolite du nourrisson",
      "petit <2 ans, difficultés alimentaires ou respiratoires",
      "→ fiche 9"
     ],
     [
      "Coqueluche / toux traînante",
      "quintes, reprise bruyante, toux >3 semaines",
      "→ fiche 10"
     ],
     [
      "Exacerbation d'asthme ou de BPCO",
      "sifflements, dyspnée sur terrain connu — ce n'est pas une bronchite simple",
      "→ fiche 11"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Du sang dans les crachats ?",
      "Signal d'alarme",
      "Hémoptysie <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Nourrisson : mange-t-il ? respire-t-il bien ?",
      "Bronchiolite décompensée",
      "Difficultés d'alimentation ou de respiration <span class='n n1'>N1</span> (ameli) → fiche 9"
     ],
     [
      "Quel âge le bébé qui tousse ?",
      "Le tout-petit",
      "<<span class='dose'>3 mois</span> qui tousse <span class='n n2'>N2</span> (ameli)"
     ],
     [
      "La fièvre : combien, depuis quand ?",
      "Pneumonie",
      "Fièvre élevée qui persiste ou qui remonte après amélioration <span class='n n2'>N2</span>"
     ],
     [
      "Terrain ?",
      "Les patients qui ne peuvent pas attendre",
      "Insuffisance respiratoire chronique, grossesse fébrile, maladie chronique grave <span class='n n2'>N2</span> (ameli) · ><span class='dose'>75 ans</span> <span class='n n3'>N3</span> sous quelques jours"
     ],
     [
      "Depuis quand la toux ?",
      "La toux qui traîne",
      "><span class='dose'>3 semaines</span> <span class='n n3'>N3</span> → fiche 10 · enfant ≥<span class='dose'>8 j</span> <span class='n n3'>N3</span> (ameli)"
     ],
     [
      "Sifflements ? Souffle court à l'effort ?",
      "Composante bronchospastique",
      "→ fiche 11, pas d'automédication respiratoire"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Hémoptysie (ameli — <b>non suisse</b>)",
      "Nourrisson avec difficultés d'alimentation ou de respiration (ameli) → fiche 9",
      "Détresse respiratoire, cyanose, suffocation fébrile (fiche 7)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Bébé <<span class='dose'>3 mois</span> qui tousse (ameli)",
      "Fièvre élevée persistante ou qui remonte après amélioration — pneumonie à exclure",
      "Terrain fragile fébrile : insuffisance respiratoire chronique, grossesse, maladie chronique grave (ameli)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "><span class='dose'>75 ans</span> avec bronchite — consultation « sous quelques jours » (ameli)",
      "Toux ><span class='dose'>3 semaines</span>, ou ≥<span class='dose'>8 j</span> chez l'enfant → fiche 10",
      "Épisodes de bronchite à répétition chez un fumeur → fiche 10"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Adulte sain, bronchite simple — « une bronchite ne relève pas d'un appel d'urgence » (ameli) : paracétamol, gestes, patience. Annoncer : « guérison en ~<span class='dose'>10 j</span>, la toux peut durer jusqu'à <span class='dose'>2–3 semaines</span> ; fièvre qui remonte, souffle court ou sang → médecin »."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "« En général, le paracétamol est suffisant » (ameli). Le reste du rayon relève du confort — avec les mêmes réserves qu'en fiche 7."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span>",
      "—",
      "le traitement de fond de la fiche · cumul — fiche T2"
     ],
     [
      "Umckaloabo gouttes",
      "pélargonium",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>30 gtt 3×/j</span> · 6–12 : <span class='dose'>20 gtt</span> · 2–6 : <span class='dose'>10 gtt</span>",
      "<span class='dose'>3 sem</span>",
      "la seule spécialité du rayon dont la FI vise la bronchite aiguë · preuve « faible à très faible » (Cochrane) · CI hépatopathie sévère, G/A (FI)"
     ],
     [
      "Fluimucil toux grasse 600 / Bexine Lierre",
      "NAC / lierre",
      "<span class='cat cat-D'>D</span>",
      "→ fiche 7",
      "—",
      "expectorations gênantes ; « pas de recommandation scientifique » pour les fluidifiants (ameli)"
     ],
     [
      "Bexine Antitussif Butamirat",
      "butamirate",
      "<span class='cat cat-D'>D</span>",
      "→ fiche 7",
      "<span class='dose'>1 sem</span>",
      "phase sèche initiale seulement — <b>à arrêter dès que la toux devient grasse</b> (ameli)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Pas d'antibiotique, et le dire : « inutile et inefficace » dans la bronchite aiguë sans comorbidité (ameli) — et rien ne part du comptoir de toute façon (art. 45, fiche T1). Le patient qui « veut un antibiotique » repart avec l'explication, du paracétamol et les critères de retour.",
    "Codéine : CI <12 ans (ameli, cohérent avec la FI — T2) ; opioïdes antitussifs à éviter sur une toux qui produit — fiche 7."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Nourrisson / <2 ans",
      "Toute difficulté d'alimentation ou de respiration : <span class='n n1'>N1</span> ; <3 mois qui tousse : <span class='n n2'>N2</span> (ameli). Le tableau sifflant du petit → fiche 9, pas d'automédication."
     ],
     [
      "Enfant",
      "Pas d'antitussif (fiche 7) ; toux ≥<span class='dose'>8 j</span> → <span class='n n3'>N3</span>. Fièvre → fiche 15."
     ],
     [
      "> 75 ans",
      "Consultation sous quelques jours même sans red flag (ameli) — la pneumonie du grand âge est trompeuse."
     ],
     [
      "Grossesse / allaitement",
      "Grossesse fébrile → <span class='n n2'>N2</span> (ameli). Umckaloabo, lierre, butamirate, DXM : CI G/A (FI — fiche 7). Paracétamol grossesse : <span class='nv'>non vérifié</span> (fiche 1)."
     ],
     [
      "BPCO / asthme / insuffisance cardiaque",
      "« Bronchite » sur ces terrains = exacerbation jusqu'à preuve du contraire → fiche 11 et <span class='n n2'>N2</span> si fébrile ou dyspnéique."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Repos, hydratation fréquente ; limiter l'activité physique tant qu'il y a fièvre ou gêne respiratoire (ameli).",
    "Aucune fumée — ni active ni passive ; c'est le moment d'évoquer l'arrêt (→ fiche 24).",
    "Dormir la tête surélevée ; miel avant le coucher (ameli · ≥1 an).",
    "Gestes barrière : pli du coude, mouchoirs jetables, mains lavées <span class='dose'>30 s</span> (fiche 7)."
   ]
  },
  {
   "t": "Phytothérapie et compléments — niveaux de preuve",
   "table": {
    "head": [
     "Substance",
     "Preuve",
     "Commentaire"
    ],
    "rows": [
     [
      "Pélargonium (Umckaloabo)",
      "Cochrane 2013 : effet possible sur la bronchite aiguë (adulte et enfant), preuves « faibles à très faibles », biais suspectés",
      "c'est ici que sa FI l'indique — max <span class='dose'>3 sem</span>, CI en fiche 7"
     ],
     [
      "Miel",
      "recommandé (ameli · fiche parents HUG)",
      "≥1 an"
     ],
     [
      "Lierre, NAC",
      "preuve <span class='nv'>non vérifié</span> / « pas de recommandation scientifique » (ameli)",
      "confort des expectorations, à présenter comme tel"
     ]
    ]
   }
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
      "ameli.fr (<b>non suisse</b>)",
      "« Bronchite : que faire et quand consulter » + « Consultation et traitement de la bronchite aiguë » — virale, antibiotiques inutiles, paracétamol suffisant, seuils par terrain, durée de la toux",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Réutilisation (30.08.2026) : Umckaloabo · Fluimucil toux grasse 600 · Bexine Lierre · Bexine Antitussif Butamirat · Dafalgan 500",
      "30.08.2026"
     ],
     [
      "Cochrane (<b>non suisse</b>)",
      "Pelargonium sidoides CD006323 (2013)",
      "30.08.2026"
     ],
     [
      "Sources suisses tentées sans succès",
      "medix « Infectiologie » : contenu réservé aux membres · RevMed (bronchite subaiguë 2006) : délai d'attente dépassé ×2 · ssi.guidelines.ch : non lisible hors navigateur — la clinique de cette fiche repose donc sur ameli, étiquetée",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f9": [
  {
   "t": "Contexte et épidémiologie suisse",
   "open": true,
   "p": [
    "Le VRS « provoque des épidémies annuelles pendant la saison froide, entre la fin de l'automne et le début du printemps » — avec, en Suisse, « une épidémie plus forte généralement tous les deux ans ». C'est « la cause la plus fréquente d'hospitalisation chez les nouveau-nés et les nourrissons » : <span class='dose'>1–3 %</span> de tous les nourrissons et jeunes enfants sont hospitalisés (OFSP). L'infection à VRS donne une bronchiolite dans <span class='dose'>15–20 %</span> des cas, qui nécessite une hospitalisation dans <span class='dose'>2–3 %</span> des cas (Infovac).",
    "La bronchiolite est « la plus fréquente maladie infectieuse des voies respiratoires inférieures du nourrisson » (pédiatrie suisse) — et elle est « plus sérieuse chez les bébés de moins de <span class='dose'>6 mois</span>, qui n'ont pas encore de défenses immunes » (monenfantestmalade.ch). Durée habituelle : <span class='dose'>1–2 semaines</span>."
   ]
  },
  {
   "t": "Signes et progression",
   "open": true,
   "p": [
    "Le film typique : « depuis quelques jours il a un rhume, il tousse et a de la fièvre. Il développe progressivement de la difficulté à respirer » (monenfantestmalade.ch). Le nez bouché est central chez le tout-petit : « dégager son nez va l'aider à téter » — un nourrisson ne peut pas respirer par la bouche en tétant.",
    "Le rhume banal du nourrisson (fiche 1) peut donc devenir une bronchiolite vers J2–J4 : c'est la fenêtre où les consignes de surveillance données au comptoir prennent tout leur sens."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Comment respire-t-il, là ?",
      "Signes de lutte",
      "Respiration <b>rapide</b>, musculature qui <b>se creuse entre les côtes</b>, respiration <b>sifflante</b> <span class='n n1'>N1</span> (monenfantestmalade.ch)"
     ],
     [
      "Sa couleur ? Son énergie ?",
      "Épuisement, hypoxie",
      "Il se fatigue, <b>lèvres bleues</b> — ou « votre bébé vous inquiète » <span class='n n1'>N1</span>"
     ],
     [
      "Tète-t-il ? Boit-il ?",
      "L'hydratation, le meilleur marqueur",
      "Difficultés d'alimentation <span class='n n1'>N1</span> (ameli, fiche 8)"
     ],
     [
      "Quel âge ?",
      "Les plus fragiles",
      "<<span class='dose'>3 mois</span> qui tousse <span class='n n2'>N2</span> · fièvre <3 mois ≥<span class='dose'>38 °C</span> <span class='n n1'>N1</span> (fiche 1)"
     ],
     [
      "Né prématuré ? Cardiopathie, maladie pulmonaire ?",
      "Terrain à très haut risque",
      "Seuil abaissé d'office : <span class='n n2'>N2</span> dès le début du tableau"
     ],
     [
      "A-t-il reçu le nirsévimab cette saison ?",
      "Statut d'immunisation",
      "Non immunisé en début de saison → en parler, orienter vers le pédiatre (prévention ci-dessous)"
     ],
     [
      "Depuis quand ?",
      "Évolution attendue 1–2 sem",
      "Toux qui traîne au-delà <span class='n n3'>N3</span>"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences pédiatriques · <a href='tel:144'>144</a>",
     "items": [
      "Respiration rapide, tirage (« sa musculature se creuse entre ses côtes »), respiration sifflante (monenfantestmalade.ch : « immédiatement »)",
      "Il se fatigue, lèvres bleues — ou tout bébé qui inquiète ses parents",
      "Ne tète plus, ne boit plus (ameli)",
      "Fièvre ≥<span class='dose'>38 °C</span> rectale chez <3 mois (pédiatrie suisse, fiche 1)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "Pédiatre ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a> (pédiatrie incluse)",
     "items": [
      "Bébé <<span class='dose'>3 mois</span> qui tousse (ameli)",
      "Tableau de bronchiolite débutant chez <<span class='dose'>6 mois</span>, prématuré ou terrain fragile — même si l'enfant boit encore (convention de l'outil)",
      "Les repas diminuent nettement sans refus complet"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Pédiatre, sur rendez-vous",
     "items": [
      "Toux résiduelle au-delà de <span class='dose'>2 semaines</span>",
      "Épisodes sifflants à répétition — évoquer le terrain obstructif avec le pédiatre (fiche 11)"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Rhume du nourrisson qui boit bien, sans aucun signe de lutte : lavage de nez, surveillance, et consignes précises — « si la respiration devient rapide ou sifflante, si les côtes se creusent, s'il tète moins ou vous inquiète : urgences, même la nuit ». Reconvoquer à <span class='dose'>24–48 h</span>."
     ]
    }
   ]
  },
  {
   "t": "Ce qui ne se délivre pas",
   "open": true,
   "stop": {
    "t": "Ne pas délivrer — le rayon toux est fermé à cet âge",
    "ul": [
     "Bronchodilatateurs et corticoïdes : « ne pas utiliser de bronchodilatateurs ou stéroïdes pour le traitement de la bronchiolite aiguë » (pédiatrie suisse, Choosing Wisely) — et rien n'influence le cours de la maladie : le soutien, c'est « oxygène, apport liquidien adapté, soutien respiratoire » — à l'hôpital.",
     "Antitussifs : tous hors d'âge par leur propre FI — butamirate dès 3 ans, DXM CI <1 an, codéine CI <12 ans (fiches 7 et T2). Et la toux est protectrice (fiche 6).",
     "Mucolytiques et phyto toux : NAC CI <2 ans, lierre CI <2 ans (FI, fiche 7).",
     "Décongestionnants nasaux : xylométazoline 0.05 % dès 2 ans seulement, 1–2 ans sur prescription (FI, fiche 1)."
    ]
   },
   "warn": [
    "Ce qui reste — et suffit : le sérum physiologique en gouttes, la surveillance, et le <span class='tel'>144</span> au bon moment."
   ]
  },
  {
   "t": "Gestes des parents",
   "open": true,
   "ul": [
    "<b>Lavage de nez</b> au sérum physiologique, plusieurs fois par jour et <b>avant chaque repas</b> — « dégager son nez va l'aider à téter » (monenfantestmalade.ch) ; aspiration douce des sécrétions si besoin.",
    "Hydratation : proposer plus souvent, en plus petites quantités.",
    "<b>Zéro fumée</b> : « la fumée de cigarette aggrave la bronchiolite ! » (monenfantestmalade.ch).",
    "Tenir les tousseurs fébriles à distance du bébé (OFSP) ; lavage des mains avant de s'en occuper.",
    "Annoncer la durée — <span class='dose'>1–2 semaines</span> — et répéter les signes d'alarme à chaque contact."
   ]
  },
  {
   "t": "Prévention — immunisation VRS (saison 2026-27)",
   "open": true,
   "p": [
    "Deux voies de protection du nourrisson pour sa première saison VRS (OFSP · Infovac) :"
   ],
   "ul": [
    "<b>Nirsévimab (Beyfortus®)</b> — anticorps monoclonal, recommandé pour <b>tous les nourrissons</b> pour leur première saison, remboursé par l'AOS : nés d'avril à septembre → une dose <b>en octobre</b> ; nés d'octobre à mars → « au cours de la première semaine après la naissance » (Infovac).",
    "<b>Vaccination maternelle (Abrysvo®)</b> — entre <span class='dose'>32 et 36 SA</span> si l'accouchement est prévu entre début octobre et fin mars, au moins <span class='dose'>14 j</span> avant la naissance (Infovac). L'enfant d'une mère vaccinée n'a en général pas besoin du nirsévimab.",
    "Rôle du comptoir en début de saison : demander aux parents de nourrissons si la première saison VRS est couverte — sinon, orienter vers le pédiatre ou la maternité."
   ],
   "warn": [
    "Nirsévimab en 2ᵉ saison pour certains enfants à risque : mentionné par l'OFSP/Infovac, mais les critères exacts n'ont pas été ouverts cette session — <span class='nv'>non vérifié</span>, renvoyer au pédiatre.",
    "Le VRS touche aussi les <b>personnes âgées et immunodéprimées</b> (formes sévères, pneumonies — OFSP) : penser au VRS chez le grand-parent tousseur d'un nourrisson malade, et inversement."
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
      "monenfantestmalade.ch (HUG)",
      "Fiche « Bronchiolite » — progression, signes immédiats, gestes, tabac, durée 1–2 sem, <6 mois",
      "30.08.2026"
     ],
     [
      "pédiatrie suisse",
      "« Choosing Wisely — traitement de la bronchiolite aiguë » : pas de bronchodilatateurs ni stéroïdes, soutien seulement",
      "30.08.2026"
     ],
     [
      "Infovac",
      "Page VRS — bronchiolite 15–20 % des infections, hospitalisation 2–3 %, nirsévimab (calendrier par mois de naissance, AOS), Abrysvo 32–36 SA",
      "30.08.2026"
     ],
     [
      "OFSP",
      "Page VRS — saisonnalité, épidémie renforcée bisannuelle, 1–3 % des nourrissons hospitalisés, transmission, personnes âgées/immunodéprimées",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "Bronchite (fiche 8) — <3 mois qui tousse, difficultés d'alimentation/respiration",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f10": [
  {
   "t": "Contexte",
   "open": true,
   "p": [
    "Une toux d'IVRS peut durer jusqu'à <span class='dose'>2–3 semaines</span> (fiches 7–8). Au-delà — ou quand son allure change — deux suspects dominent le comptoir d'hiver : la <b>coqueluche</b>, à tout âge, et le <b>mycoplasme</b> chez l'enfant d'âge scolaire et le jeune adulte.",
    "Coqueluche en Suisse (OFSP) : après un niveau « historiquement bas pendant les années de la pandémie », la circulation est repartie — et la maladie reste « très contagieuse » (gouttelettes en parlant, toussant, éternuant). L'enjeu du comptoir n'est pas de la traiter : c'est de la <b>nommer à temps</b>, surtout quand un nourrisson gravite autour du patient."
   ]
  },
  {
   "t": "Coqueluche — la reconnaître",
   "open": true,
   "p": [
    "Trois phases (OFSP) : un début banal de type rhume pendant <span class='dose'>1–3 semaines</span>, puis « les quintes de toux typiques avec reprise inspiratoire (chant du coq) », qui « persistent pendant <span class='dose'>1 à 6 semaines</span> », et une convalescence « des semaines, voire des mois ». Infovac ajoute : accès violents, difficultés inspiratoires, <b>vomissements provoqués par les sécrétions</b>.",
    "Chez le petit nourrisson, c'est une maladie grave : les quintes peuvent « provoquer des pauses de la respiration ou même un arrêt respiratoire » ; convulsions chez <span class='dose'>2–4/100</span>, lésions cérébrales <span class='dose'>5/1000</span>, mortalité « environ <span class='dose'>1 cas sur 100 à 200</span> » chez les petits nourrissons (Infovac)."
   ],
   "warn": [
    "« Un traitement antibiotique ne protège pas contre les complications de la coqueluche » (Infovac) — le diagnostic précoce sert surtout à protéger l'entourage. Toute suspicion se confirme chez le médecin, pas au comptoir."
   ]
  },
  {
   "t": "Mycoplasme — y penser chez l'écolier",
   "open": true,
   "p": [
    "Indices en faveur de <em>Mycoplasma pneumoniae</em> chez l'enfant (pédiatrie suisse) : « âge ><span class='dose'>5 ans</span>, durée prolongée des symptômes (><span class='dose'>6 jours</span>), atteinte cutanée » — et « l'absence de réponse à l'amoxicilline est également un indice diagnostique fiable ». La bonne nouvelle : la pneumonie à mycoplasme « est la plupart du temps bénigne et auto-limitante ».",
    "Le tableau type au comptoir : le grand enfant ou l'adolescent qui tousse depuis dix jours, fébricule, état général à peine touché, et un parent qui « aimerait quelque chose de plus fort ». La réponse n'est pas un sirop plus fort — c'est une consultation programmée."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Comment tousse-t-il ? Par quintes ?",
      "Coqueluche",
      "Quintes + reprise inspiratoire bruyante, vomissements en fin de quinte <span class='n n2'>N2</span>"
     ],
     [
      "Y a-t-il un bébé à la maison ? Une grossesse ?",
      "L'entourage à protéger",
      "Suspicion de coqueluche + nourrisson <<span class='dose'>6 mois</span> ou femme enceinte au foyer <span class='n n2'>N2</span> ferme, le jour même"
     ],
     [
      "Nourrisson : pauses ? changement de couleur ?",
      "La coqueluche du tout-petit",
      "Pauses respiratoires, cyanose pendant les quintes <span class='n n1'>N1</span> (Infovac)"
     ],
     [
      "Enfant : respiration rapide ? Se creuse-t-il ?",
      "Pneumonie (pédiatrie suisse)",
      "FR > seuils d'âge (2–12 mois : ><span class='dose'>50/min</span> · 1–5 ans : ><span class='dose'>40</span> · >5 ans : ><span class='dose'>20</span>), tirage, geignement, état général réduit <span class='n n1'>N1</span>–<span class='n n2'>N2</span>"
     ],
     [
      "Depuis quand exactement ?",
      "Le seuil des 3 semaines",
      "><span class='dose'>3 semaines</span> <span class='n n3'>N3</span> (ameli, fiche 7) · enfant fébrile ><span class='dose'>6 j</span> sans mieux <span class='n n2'>N2</span>"
     ],
     [
      "La fièvre est-elle revenue après un mieux ?",
      "Surinfection, pneumonie",
      "<span class='n n2'>N2</span> (fiche 8)"
     ],
     [
      "Fumeur ? Toux qui change ?",
      "Ne pas banaliser",
      "<span class='n n3'>N3</span> ferme"
     ],
     [
      "Sous IEC ? Reflux connu ?",
      "Toux médicamenteuse ou RGO",
      "<span class='nv'>non vérifié</span> (fiche 7) — à évoquer en consultation <span class='n n3'>N3</span>"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Nourrisson avec quintes : pauses respiratoires, cyanose, épuisement (Infovac)",
      "Enfant : fréquence respiratoire au-dessus des seuils d'âge, tirage, geignement, état général réduit (pédiatrie suisse)",
      "Hémoptysie, détresse respiratoire (fiche 7)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Suspicion clinique de coqueluche — d'autant plus vite qu'un nourrisson <<span class='dose'>6 mois</span> ou une femme enceinte partage le foyer",
      "Enfant fébrile depuis ><span class='dose'>6 j</span> sans amélioration (pédiatrie suisse)",
      "Fièvre qui remonte après une amélioration (fiche 8)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Toux ><span class='dose'>3 semaines</span> sans signe de gravité — diagnostic à poser : coqueluche, mycoplasme, asthme, RGO, médicament (fiches 7 et 11)",
      "Suspicion de mycoplasme chez un grand enfant en bon état général",
      "Toux du fumeur qui se modifie"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Toux post-infectieuse en voie d'amélioration, état général conservé : patience expliquée, gestes de la fiche 7. <b>Aucun N4 pour une suspicion de coqueluche</b> — même bénigne en apparence."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "Il n'y en a pas pour cette fiche : aucune spécialité du rayon toux n'a d'indication dans la coqueluche ou le mycoplasme, et le traitement (macrolide, amoxicilline chez l'enfant selon le tableau — pédiatrie suisse) est une décision médicale. Pour le confort d'une toux traînante déjà investiguée → fiche 7, avec ses limites."
   ],
   "warn": [
    "Le sirop qui « couvre » une coqueluche non diagnostiquée retarde le diagnostic et expose l'entourage — position de l'outil : devant des quintes évocatrices, on oriente, on ne soulage pas d'abord."
   ]
  },
  {
   "t": "Vaccination — le vrai geste de comptoir",
   "open": true,
   "p": [
    "Calendrier suisse (OFSP) : <span class='dose'>2, 4, 12 mois</span>, <span class='dose'>4–7 ans</span>, <span class='dose'>11–15 ans</span> — puis une dose adulte unique (<span class='dose'>25–29 ans</span>, Infovac). Et deux recommandations que le comptoir est bien placé pour rappeler :"
   ],
   "ul": [
    "<b>À chaque grossesse</b>, « de préférence au cours du 2ᵉ trimestre », quel que soit le dernier rappel (OFSP · Infovac) — les anticorps passent au bébé avant ses premières doses.",
    "<b>Entourage d'un nourrisson <6 mois</b> : « tous les adolescents et adultes en contact régulier » (OFSP) — parents, grands-parents, fratrie aînée : « les parents ou les frères et sœurs peuvent contaminer (sans le savoir) le bébé » (Infovac).",
    "Réflexe comptoir : toute toux traînante chez un jeune parent ou un futur grand-parent = l'occasion d'ouvrir le carnet de vaccination."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Nourrisson <6 mois",
      "Le centre de gravité de la fiche : toute quinte chez lui ou suspicion de coqueluche autour de lui → voir triage. Vérifier que ses <span class='dose'>2</span> premières doses sont en route (2 et 4 mois)."
     ],
     [
      "Femme enceinte",
      "Toux traînante → médecin ; et vérifier la dose coqueluche <b>de cette grossesse</b> (2ᵉ trimestre — OFSP/Infovac)."
     ],
     [
      "Adolescent / jeune adulte",
      "Terrain du mycoplasme et des coqueluches atténuées du vacciné ancien — une toux de 3 semaines chez lui n'est pas « juste un rhume qui traîne »."
     ],
     [
      "Asthme / BPCO",
      "Toux traînante = d'abord exclure le terrain → fiche 11."
     ],
     [
      "Personne âgée",
      "Rappels souvent anciens ; en contact avec des petits-enfants nourrissons → vaccination de l'entourage (OFSP)."
     ]
    ]
   }
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
      "OFSP",
      "Page « Coqueluche / Pertussis » — phases cliniques et durées, contagiosité, épidémiologie, calendrier vaccinal, grossesse, entourage <6 mois",
      "30.08.2026"
     ],
     [
      "Infovac",
      "Page coqueluche — gravité du nourrisson (chiffres), vaccination 25–29 ans et à chaque grossesse, entourage, antibiotique et complications",
      "30.08.2026"
     ],
     [
      "pédiatrie suisse",
      "« Diagnostic et traitement de la pneumonie pendant l'enfance » — seuils de fréquence respiratoire par âge, signes de gravité, indices mycoplasme, amoxicilline 5 j",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "Seuil des 3 semaines (réutilisation fiche 7)",
      "30.08.2026"
     ],
     [
      "Source tentée sans succès",
      "Swiss Medical Forum, « Infections à Mycoplasma pneumoniae » — domaine injoignable (DNS) : le mycoplasme de l'adulte reste peu détaillé dans cette fiche",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f11": [
  {
   "t": "Reconnaître la déstabilisation",
   "open": true,
   "table": {
    "head": [
     "Tableau",
     "Ce qu'on voit / entend",
     "Source"
    ],
    "rows": [
     [
      "Crise d'asthme simple",
      "gêne respiratoire d'installation rapide, sensation d'étouffement, toux sèche, respiration sifflante",
      "ameli (<b>non suisse</b>)"
     ],
     [
      "Exacerbation",
      "« une crise d'asthme dure plusieurs heures voire plusieurs jours, malgré la prise répétée d'un traitement de crise »",
      "ameli"
     ],
     [
      "Asthme aigu grave",
      "grande difficulté à respirer, <b>lèvres et ongles qui bleuissent</b>, difficultés à parler ou à marcher, confusion ou perte de connaissance",
      "ameli — <span class='n n1'>N1</span>"
     ],
     [
      "Crise de l'enfant — gravité",
      "sifflement sévère + respiration difficile + lèvres bleues · ou « la crise ne réagit pas à <span class='dose'>6 doses</span> de bronchodilatateur »",
      "monenfantestmalade.ch (HUG) — <span class='n n1'>N1</span>"
     ],
     [
      "Exacerbation de BPCO",
      "aggravation de l'essoufflement, de la toux ou des expectorations au-delà des variations quotidiennes (><span class='dose'>24 h</span> ou nécessitant de modifier le traitement)",
      "ameli"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Peut-il parler en phrases entières ? Marcher ?",
      "Asthme aigu grave",
      "Parole ou marche difficiles, lèvres/ongles bleus, confusion <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Enfant : combien de pushs déjà donnés ?",
      "L'échec du bronchodilatateur",
      "≥<span class='dose'>6 doses</span> sans réponse <span class='n n1'>N1</span> (HUG)"
     ],
     [
      "La crise dure depuis quand malgré le spray ?",
      "Exacerbation",
      "Des heures malgré des prises répétées <span class='n n2'>N2</span> (ameli)"
     ],
     [
      "BPCO : les crachats changent ? Fièvre ? Jambes qui gonflent ?",
      "Exacerbation, décompensation",
      "Expectorations accrues/purulentes, fièvre, œdèmes des jambes, traitement qui ne fait plus effet <span class='n n2'>N2</span> (ameli)"
     ],
     [
      "Combien de Ventolin par semaine, en ce moment ?",
      "Le contrôle de fond",
      "Consommation qui grimpe, réveils nocturnes → maladie non contrôlée <span class='n n3'>N3</span> — plan d'action à revoir"
     ],
     [
      "Un rhume qui démarre sur ce terrain ?",
      "L'infection déclenchante",
      "« Traiter dès le début d'une infection » (HUG) — patient sans plan d'action <span class='n n2'>N2</span>–<span class='n n3'>N3</span> selon l'état"
     ],
     [
      "Que prend-il d'autre ?",
      "Les produits qui aggravent",
      "→ section vigilances ci-dessous"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Asthme aigu grave : grande difficulté à respirer, lèvres/ongles bleus, parole ou marche difficiles, confusion, perte de connaissance (ameli — <b>non suisse</b>)",
      "Enfant : crise sans réponse après <span class='dose'>6 doses</span>, sifflement sévère avec lèvres bleues (monenfantestmalade.ch)",
      "BPCO : détresse, perte de connaissance à la toux (ameli)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Exacerbation d'asthme : la crise dure des heures malgré le traitement de crise répété (ameli)",
      "Exacerbation de BPCO : aggravation ><span class='dose'>24 h</span>, purulence, fièvre, perte d'efficacité du traitement (ameli) — l'insuffisance respiratoire aiguë peut imposer l'hôpital",
      "Asthmatique fébrile ou infecté sans plan d'action clair"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Consommation croissante de bronchodilatateur, symptômes nocturnes — le contrôle est perdu, le « plan d'action personnalisé » se rédige chez le médecin (ameli)",
      "Technique d'inhalation défaillante constatée au comptoir — corriger, puis faire réviser le traitement"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Patient stable : dépannage documenté du traitement (ci-dessous), vérification de la technique, rappel des déclencheurs et des vaccinations de saison (fiches 12–13)."
     ]
    }
   ]
  },
  {
   "t": "Ventolin au comptoir — l'art. 45 en pratique",
   "open": true,
   "p": [
    "Ventolin aérosol doseur 100 mcg est en <span class='cat cat-B'>B</span> (FI compendium). Posologie FI : >12 ans, bronchospasme aigu <span class='dose'>100–200 µg</span>, prévention d'effort <span class='dose'>200 µg</span>, max <span class='dose'>8×/j</span> ; 4–12 ans : <span class='dose'>100 µg</span>, max <span class='dose'>800 µg/j</span>. CI notables : association aux <b>bêtabloquants non sélectifs</b> ; grossesse « IPr ».",
    "Le dépannage sans ordonnance passe par l'art. 45 al. 1 <b>let. b</b> OMéd : poursuite d'un traitement de longue durée pendant <span class='dose'>1 an</span> après la première prescription — remise par le pharmacien en personne, patient présent, documentation avec référence à l'ordonnance d'origine, CI et interactions revalidées à chaque remise (fiche T1, aide KAV)."
   ],
   "stop": {
    "t": "Ne pas délivrer tel quel",
    "ul": [
     "Patient <b>en crise au comptoir</b> : on ne « vend » pas, on gère une urgence — traitement de crise s'il l'a, et triage ci-dessus.",
     "Demande de salbutamol <b>sans prescription antérieure documentable</b> : ce n'est pas une poursuite de traitement — médecin (let. b non applicable).",
     "Renouvellements rapprochés qui dessinent une surconsommation : délivrer une fois si nécessaire, mais avec rendez-vous médical posé — un asthme qui consomme son spray est un asthme non contrôlé."
    ]
   }
  },
  {
   "t": "Technique d'inhalation — ce qui se vérifie au comptoir",
   "open": true,
   "p": [
    "Chez l'enfant, la chambre d'inhalation est la règle (monenfantestmalade.ch — HUG) : « appliquez le masque sur le visage de manière étanche », <b>1 push à la fois</b>, puis « comptez <span class='dose'>10 respirations</span> de l'enfant par dose ». Dès <span class='dose'>~5 ans</span> : chambre sans masque ; dès <span class='dose'>~10 ans</span> : poudre possible."
   ],
   "ul": [
    "Faire <b>montrer</b> le geste au patient avec son propre dispositif — c'est le seul contrôle qui vaille.",
    "Un push à la fois dans la chambre, jamais plusieurs d'un coup (HUG).",
    "Aérosol doseur sans chambre chez l'adulte : coordination main-inspiration difficile — en cas de doute, proposer une chambre."
   ],
   "warn": [
    "Check-list détaillée adulte (expiration préalable, apnée post-inhalation, rinçage de bouche après corticoïde inhalé) : <span class='nv'>non vérifié</span> — la Ligue pulmonaire, source naturelle de ces fiches techniques, bloque l'accès automatisé (403). À compléter à la main depuis leur matériel ou les FI des dispositifs."
   ]
  },
  {
   "t": "Vigilances produits sur ce terrain",
   "open": true,
   "table": {
    "head": [
     "Produit du comptoir",
     "Problème",
     "Source"
    ],
    "rows": [
     [
      "AINS (ibuprofène, dolo spray…)",
      "asthme et bronchospasme : <span class='nv'>non vérifié</span> — rubrique interactions sous login",
      "fiche T2"
     ],
     [
      "Codéine (Codicalm)",
      "CI : insuffisance respiratoire, dépression respiratoire, crise d'asthme",
      "FI — fiche T2"
     ],
     [
      "Diphénhydramine (Benocten)",
      "CI : crise d'asthme",
      "FI — fiche T2"
     ],
     [
      "Antitussifs en général",
      "chez le BPCO qui encombre, ne pas supprimer la toux qui draine — règle de la fiche 7",
      "ameli — fiche 7"
     ],
     [
      "Bêtabloquants non sélectifs (y c. prescrits ailleurs)",
      "CI d'association du salbutamol — à signaler au médecin si découverts à l'anamnèse",
      "FI Ventolin"
     ]
    ]
   }
  },
  {
   "t": "Populations particulières et conseils",
   "ul": [
    "« Absolument éviter la fumée de cigarette dans la maison, cela aggrave considérablement l'asthme » (monenfantestmalade.ch).",
    "Identifier et éviter les déclencheurs (allergènes → fiche 21) ; adapter le traitement avant l'effort (HUG).",
    "Demander au médecin un <b>plan d'action personnalisé</b> écrit (ameli) — et le garder avec le spray."
   ],
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Enfant",
      "Chambre d'inhalation adaptée à l'âge (HUG). Toute crise qui inquiète ou résiste → urgences pédiatriques. Bronchiolite du <2 ans : fiche 9, pas de Ventolin (Choosing Wisely)."
     ],
     [
      "Grossesse",
      "Ventolin : grossesse « IPr » (FI) — l'asthme de la femme enceinte se pilote avec le médecin, pas au comptoir ; ne jamais laisser « arrêter le traitement par prudence » sans avis."
     ],
     [
      "BPCO / fumeur",
      "« Maladie essentiellement liée au tabac » (ameli) : chaque passage est une occasion de sevrage → fiche 24. Vaccinations grippe/COVID prioritaires → fiches 12–13."
     ],
     [
      "Personne âgée",
      "Coordination et force des mains : vérifier le dispositif, penser chambre ou poudre selon les cas ; œdèmes des jambes + dyspnée = <span class='n n2'>N2</span> (ameli)."
     ]
    ]
   }
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
      "compendium.ch (HCI Solutions)",
      "Page produit ouverte : Ventolin aérosol doseur 100 mcg (B, posologies, CI bêtabloquants non sélectifs, grossesse IPr)",
      "30.08.2026"
     ],
     [
      "monenfantestmalade.ch (HUG)",
      "Fiche « Asthme » — signes de gravité (6 doses, lèvres bleues), technique chambre d'inhalation (10 respirations/push), âges, tabac",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Crise d'asthme, exacerbation, asthme aigu grave » + pages BPCO — définitions, signes de gravité, exacerbation >24 h, plan d'action personnalisé",
      "30.08.2026"
     ],
     [
      "Fedlex / KAV",
      "Art. 45 al. 1 let. b OMéd — poursuite de traitement (réutilisation fiche T1)",
      "30.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Ligue pulmonaire suisse (403, ×2) — technique d'inhalation à compléter · pédiatrie suisse « crise d'asthme aux urgences » : article complet non accessible en ligne (Paediatrica 2018)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f12": [
  {
   "t": "Contexte et épidémiologie suisse",
   "open": true,
   "p": [
    "Chaque épidémie annuelle cause en Suisse « environ <span class='dose'>100 000 à 300 000</span> cas, <span class='dose'>5 000 à 15 000</span> pneumonies, <span class='dose'>1 000 à 5 000</span> hospitalisations et jusqu'à <span class='dose'>1 500</span> décès par année » ; l'épidémie survient le plus souvent « de fin décembre à mars » et se déclare dès <span class='dose'>69</span> affections grippales pour <span class='dose'>100 000</span> habitants ; les complications sont <span class='dose'>2 à 5×</span> plus fréquentes au-dessus de <span class='dose'>65 ans</span> (HUG, stratégie IVRS 2021)."
   ],
   "warn": [
    "Situation de la semaine : <span class='nv'>non vérifié</span> — portail idd.bag.admin.ch, à consulter en direct (comme fiche 1)."
   ]
  },
  {
   "t": "Clinique — quand parler de grippe",
   "open": true,
   "p": [
    "« Cliniquement, la grippe est difficile à distinguer des autres IVRS. Le diagnostic doit être suspecté en période d'épidémie et lorsque le tableau clinique montre un <b>début brutal avec des symptômes généraux sévères</b> » (HUG). Attention aux présentations trompeuses : « la grippe peut se présenter <b>sans fièvre</b> » chez les ><span class='dose'>65 ans</span> et les immunosupprimés — et une co-infection avec le SARS-CoV-2 est possible (HUG, → fiche 13).",
    "Complications possibles : « angine, sinusite, otite moyenne, pneumonie, myocardite ou complications neurologiques » (OFSP) ; surinfections bactériennes et décompensation des maladies chroniques (HUG)."
   ]
  },
  {
   "t": "Patients à risque de complications",
   "open": true,
   "p": [
    "La liste qui décide du triage <b>et</b> de la vaccination (HUG · OFSP) :"
   ],
   "ul": [
    "≥<span class='dose'>65 ans</span> — et prématurés jusqu'à <span class='dose'>2 ans</span> (OFSP)",
    "Maladies chroniques : BPCO et pneumopathies, maladies cardiovasculaires (sauf HTA isolée), diabète, insuffisance rénale, atteinte hépatique, hémoglobinopathie, maladies rhumatologiques ou neurologiques, néoplasie (HUG)",
    "Femmes enceintes — à tout âge gestationnel — et jusqu'à <span class='dose'>2 semaines</span> post-partum (HUG)",
    "Résidents d'institutions ; obésité sévère (BMI ≥<span class='dose'>40</span>) ; immunosuppression significative (HUG)"
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Début brutal ? Depuis combien d'heures ?",
      "La fenêtre antivirale",
      "Patient à risque + symptômes <<span class='dose'>48 h</span> <span class='n n2'>N2</span> — l'oseltamivir se décide chez le médecin dans ce délai (HUG)"
     ],
     [
      "Fait-il partie de la liste à risque ?",
      "Le terrain",
      "Oui + syndrome grippal <span class='n n2'>N2</span>, même d'allure banale"
     ],
     [
      "Comment respire-t-il ?",
      "Pneumonie, myocardite",
      "Dyspnée, douleur thoracique, détresse <span class='n n1'>N1</span>"
     ],
     [
      "Confusion ? Raideur ?",
      "Complication neurologique",
      "<span class='n n1'>N1</span>"
     ],
     [
      "La fièvre était tombée et revient ?",
      "Surinfection bactérienne",
      "<span class='n n2'>N2</span> (fiche 8)"
     ],
     [
      "> 65 ans « juste pas en forme » ?",
      "La grippe sans fièvre",
      "État inhabituel en période épidémique <span class='n n2'>N2</span> (HUG)"
     ],
     [
      "Enceinte ?",
      "Double motif",
      "Fébrile <span class='n n2'>N2</span> — et vérifier la vaccination grippe de cette grossesse"
     ],
     [
      "Enfant : respiration rapide ? état ?",
      "Les seuils pédiatriques",
      "→ fiche 10 (FR par âge) <span class='n n1'>N1</span>–<span class='n n2'>N2</span>"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Dyspnée, douleur thoracique, cyanose, confusion — pneumonie, myocardite, atteinte neurologique (OFSP/HUG)",
      "Enfant au-dessus des seuils respiratoires d'âge, tirage, état réduit (fiche 10)",
      "Nourrisson <3 mois fébrile (fiche 1)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "<b>Patient à risque avec début <48 h</b> : la fenêtre de l'antiviral ne se rouvre pas (HUG : pas d'indication >48 h sans facteur de risque)",
      "Patient à risque avec syndrome grippal, quel que soit le délai",
      "Femme enceinte fébrile · fièvre qui remonte après amélioration",
      "> 65 ans : altération inhabituelle même sans fièvre (HUG)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Pas d'amélioration nette au-delà d'une semaine (convention de l'outil)",
      "Toux qui s'installe → fiches 7 et 10 · fatigue qui traîne → fiche 22"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Adulte sain, syndrome grippal typique : repos, hydratation, antipyrétique — et l'honnêteté : aucun produit du rayon ne raccourcit la grippe. Annoncer : « une semaine, dont quelques jours au lit ; si souffle court, douleur thoracique, confusion, ou fièvre qui revient → médecin »."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "Symptomatique uniquement — l'antiviral (oseltamivir) est une décision médicale dans les <span class='dose'>48 h</span> (HUG), rien au comptoir."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, max <span class='dose'>8 cp/j</span>",
      "—",
      "fièvre et courbatures — cumul, fiche T2"
     ],
     [
      "NeoCitran Grippe/refroid. pdr adultes",
      "paracétamol 500 + phéniramine + phényléphrine",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>1 sachet</span> max <span class='dose'>3×/j</span>, ≥<span class='dose'>4 h</span>",
      "<span class='dose'>3 j</span>",
      "> 14 ans · CI grossesse/allaitement · <b>compte dans le cumul paracétamol</b> — fiche T2"
     ],
     [
      "Algifor-L forte cpr 400 mg",
      "ibuprofène",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>, max <span class='dose'>1200 mg/j</span>",
      "<span class='dose'>3 j</span>",
      "« ne pas délivrer » fiche T2 — prudence accrue sur les terrains à risque de cette fiche"
     ],
     [
      "Nez bouché, toux",
      "→ fiches 1 et 7",
      "—",
      "—",
      "—",
      "mêmes produits, mêmes limites"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Le grog maison + NeoCitran + Dafalgan = trois sources de paracétamol en une soirée : compter <b>tout</b> (fiche T2)."
   ]
  },
  {
   "t": "Vaccination — la prestation d'officine",
   "open": true,
   "p": [
    "« La prévention la plus simple, efficace et économique pour se protéger soi-même et son entourage » (HUG). Recommandée par l'OFSP : personnes à risque (liste ci-dessus), <b>et tout leur entourage régulier</b> — proches, personnes s'occupant de nourrissons, personnel de santé ; également les personnes en contact régulier avec volailles et oiseaux sauvages.",
    "Période : « dès la mi-octobre et jusqu'au début de la vague » ; action nationale en novembre, généralement sans rendez-vous (OFSP). Pour les ≥<span class='dose'>75 ans</span> — et ≥<span class='dose'>65 ans</span> avec facteur de risque — « privilégier un vaccin antigrippal à dose élevée » (OFSP)."
   ],
   "ul": [
    "En pharmacie : plus de <span class='dose'>2/3</span> des officines suisses vaccinent ; adultes dès <span class='dose'>16 ans</span> sans risque particulier ; autorisation cantonale + certificat FPH « Vaccination et prélèvements sanguins » (intégré au cursus dès les diplômes 2022) + BLS-AED valide (pharmaSuisse).",
    "Le détail des vaccins autorisés <b>par canton</b> : tableau pharmaSuisse, mis à jour au <span class='dose'>27.08.2026</span> — à vérifier pour VD avant la campagne.",
    "Réflexe comptoir dès octobre : chaque patient de la liste à risque — et chaque proche d'un nourrisson ou d'un aîné — repart avec une proposition de rendez-vous vaccinal."
   ]
  },
  {
   "t": "Prévention — les 6 mesures HUG",
   "ol": [
    "Masque si la distance de <span class='dose'>1.5 m</span> ne peut pas être maintenue",
    "Lavage ou désinfection des mains",
    "Vaccination antigrippale saisonnière",
    "Vaccin antipneumococcique selon recommandations",
    "Arrêt du tabac — les fumeurs ont un risque d'IVRS <span class='dose'>×1.5</span> (→ fiche 24)",
    "Prophylaxie post-expositionnelle par oseltamivir chez l'immunosupprimé — décision médicale, dans les <span class='dose'>48 h</span> après l'exposition"
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Femme enceinte",
      "Groupe à risque à tout trimestre + 2 sem post-partum (HUG) : fébrile → <span class='n n2'>N2</span> ; vaccination recommandée ; NeoCitran CI ; AINS fiche T2 ; paracétamol grossesse <span class='nv'>non vérifié</span> (fiche 1)."
     ],
     [
      "≥ 65 ans / ≥ 75 ans",
      "Grippe possible sans fièvre (HUG) ; vaccin haute dose à privilégier (OFSP) ; complications ×2–5."
     ],
     [
      "Enfant",
      "Antipyrétiques au poids → fiche 15 ; seuils respiratoires → fiche 10 ; prématurés <2 ans = groupe à risque vaccinal (OFSP)."
     ],
     [
      "Asthme / BPCO",
      "La grippe décompense le terrain → fiche 11 ; vaccination prioritaire."
     ],
     [
      "Institutions / EMS",
      "Résidents = à risque (HUG) ; penser aussi à la vaccination du personnel et des proches visiteurs (OFSP)."
     ]
    ]
   }
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
      "HUG — Service de médecine de premier recours",
      "Stratégie IVRS 2021, §3.5 grippe — épidémiologie chiffrée, clinique, patients à risque, oseltamivir et fenêtre 48 h, 6 mesures de prévention",
      "30.08.2026"
     ],
     [
      "OFSP",
      "Page « Grippe saisonnière » — groupes cibles et entourage, période dès mi-octobre, action nationale de novembre, vaccin haute dose ≥75/≥65+FdR, complications",
      "30.08.2026"
     ],
     [
      "pharmaSuisse",
      "Page « Vaccination et conseils de vaccination » — cadre de la vaccination en officine, formation FPH, tableau cantonal (MAJ 27.08.2026)",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Réutilisation (30.08.2026) : Dafalgan 500 · NeoCitran · Algifor-L forte 400",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f13": [
  {
   "t": "Contexte — l'endémie au comptoir",
   "open": true,
   "p": [
    "Le SARS-CoV-2 circule désormais avec la grippe et le VRS ; cliniquement, il « peut se présenter » comme n'importe quelle IVRS, et la co-infection avec la grippe est décrite (HUG, fiche 12). En phase endémique, le tri du comptoir se réduit à une question centrale : <b>ce patient est-il à risque de forme sévère ?</b> — parce que pour lui, un test précoce a des conséquences thérapeutiques (OFSP).",
    "Groupes à risque selon l'OFSP : ≥<span class='dose'>65 ans</span> ; maladies respiratoires, cancer, diabète, immunodéficience, <b>hypertension</b>, maladies rénales et cardiovasculaires, obésité (BMI ≥<span class='dose'>35</span>) ; femmes enceintes ; trisomie 21."
   ],
   "warn": [
    "Situation épidémique à date : <span class='nv'>non vérifié</span> — portail idd.bag.admin.ch (fiche 1)."
   ]
  },
  {
   "t": "Tester qui, et pourquoi",
   "open": true,
   "p": [
    "« Un test peut se révéler utile pour les personnes présentant un risque accru de développer une forme sévère de la maladie, car il peut avoir des implications thérapeutiques » ; l'assurance prend le test en charge quand « le résultat de l'analyse détermine la suite du traitement » — typiquement la prescription d'un antiviral (OFSP).",
    "Traduction comptoir : l'adulte sain qui veut « savoir » peut prendre un autotest disponible à l'officine ; le patient <b>à risque et symptomatique</b>, lui, doit être testé <b>tôt</b> — chaque jour compte pour la fenêtre antivirale."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Fait-il partie des groupes à risque ?",
      "La ligne de partage de la fiche",
      "Oui + symptômes → « consulter votre médecin en cas de symptômes » (OFSP) <span class='n n2'>N2</span>"
     ],
     [
      "Depuis combien de jours ?",
      "La fenêtre Paxlovid",
      "À risque + <<span class='dose'>5 j</span> de symptômes <span class='n n2'>N2</span> le jour même — le remboursement vise le « traitement précoce, de préférence dans les 5 jours » (FI)"
     ],
     [
      "Comment respire-t-il ?",
      "Forme sévère",
      "Dyspnée, douleur thoracique, confusion, cyanose <span class='n n1'>N1</span> (fiches 7 et 12)"
     ],
     [
      "Enceinte ?",
      "Groupe à risque + CI Paxlovid",
      "Fébrile ou symptomatique <span class='n n2'>N2</span> — et vérifier ses vaccinations d'automne"
     ],
     [
      "La fièvre revient après un mieux ?",
      "Surinfection",
      "<span class='n n2'>N2</span> (fiche 8)"
     ],
     [
      "Symptômes qui traînent ? Fatigue, brouillard ?",
      "Suites post-infectieuses",
      "<span class='n n3'>N3</span> → fiche 22"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Dyspnée, douleur thoracique, cyanose, confusion (fiches 7 et 12)",
      "Enfant au-dessus des seuils respiratoires d'âge (fiche 10) · nourrisson <3 mois fébrile (fiche 1)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "<b>Patient à risque symptomatique</b> — d'autant plus vite que les symptômes ont <<span class='dose'>5 j</span> : test et décision antivirale chez le médecin (OFSP · FI Paxlovid)",
      "Femme enceinte symptomatique",
      "Fièvre qui remonte après amélioration"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Symptômes qui persistent au-delà d'une semaine sans amélioration (convention de l'outil)",
      "Fatigue, essoufflement d'effort ou troubles cognitifs qui traînent après l'épisode → fiche 22"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Adulte sain, tableau d'IVRS : symptomatique (fiches 1, 7, 12), repos — et par égard pour les autres, limiter les contacts avec les personnes vulnérables tant qu'il y a des symptômes (convention de phase endémique). Annoncer les motifs de retour : souffle, douleur thoracique, fièvre qui revient."
     ]
    }
   ]
  },
  {
   "t": "Paxlovid — le point pharmacien",
   "open": true,
   "p": [
    "Paxlovid (nirmatrelvir + ritonavir) est en <b>catégorie <span class='cat cat-A'>A</span></b> : ordonnance non renouvelable (art. 41 OMéd — fiche T1), remboursé de manière limitée (LIM) pour le « traitement précoce, de préférence dans les <span class='dose'>5 jours</span> suivant l'apparition des symptômes » chez les patients à risque de forme sévère, sans oxygénothérapie (FI compendium). Posologie : <span class='dose'>2 cp</span> nirmatrelvir + <span class='dose'>1 cp</span> ritonavir <span class='dose'>2×/j</span> pendant <span class='dose'>5 j</span> (≥40 kg).",
    "Le rôle de l'officine à la remise : la <b>chasse aux interactions</b>. Le ritonavir est contre-indiqué « en association aux substrats du CYP3A à marge thérapeutique étroite ou aux inducteurs puissants du CYP3A » (FI) — chaque délivrance impose de passer la médication complète du patient au crible. CI également : grossesse, allaitement (jusqu'à <span class='dose'>48 h</span> après le traitement)."
   ],
   "warn": [
    "La liste nominative des interactions (statines, anticoagulants, immunosuppresseurs et autres substrats critiques) : <span class='nv'>non vérifié</span> — rubrique interactions de la FI sous login HIN, à consulter <b>systématiquement</b> au moment de la remise. C'est l'ordonnance où le crible d'interactions n'est pas optionnel."
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "p": [
    "Identique au syndrome grippal — fiche 12 : Dafalgan <span class='cat cat-B'>B</span> en premier, associations avec leurs limites, nez et toux par les fiches 1 et 7. Aucun produit du comptoir ne modifie l'évolution du COVID-19.",
    "Autotests : disponibles à l'officine — proposer d'en garder à la maison en début de saison aux patients à risque et à leur entourage, pour tester dès les premiers symptômes."
   ]
  },
  {
   "t": "Vaccination d'automne",
   "open": true,
   "p": [
    "Recommandation OFSP : rappel en automne/hiver pour les personnes à risque — ≥<span class='dose'>65 ans</span>, dès <span class='dose'>16 ans</span> avec maladie préexistante, femmes enceintes, trisomie 21. Période idéale : « entre mi-octobre et mi-décembre », au plus tôt <span class='dose'>6 mois</span> après la dernière dose ou une infection connue (OFSP).",
    "À proposer dans le même rendez-vous d'automne (OFSP, communiqué du 16.10.2025) : la <b>grippe</b> pour les mêmes profils (fiche 12) et le <b>VRS</b> pour les ≥<span class='dose'>75 ans</span> et les ><span class='dose'>60 ans</span> avec maladie chronique ou immunodépression."
   ],
   "warn": [
    "Recommandation datée <b>saison 2025-26</b> : la version 2026-27 paraîtra à l'automne — à vérifier avant la campagne (cf. Maintenance du fichier)."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Femme enceinte",
      "Groupe à risque (OFSP) : symptomatique → <span class='n n2'>N2</span> ; vaccination recommandée ; <b>Paxlovid CI</b> (FI) ; symptomatique OTC prudent — fiches 1 et T2."
     ],
     [
      "≥ 65 ans / polymédiqué",
      "Le profil Paxlovid type — et le profil interactions type : anticiper en gardant la liste de médication à jour au dossier."
     ],
     [
      "Enfant",
      "Paxlovid possible dès <span class='dose'>6 ans</span>/<span class='dose'>20 kg</span> sur décision médicale (FI) ; sinon symptomatique → fiche 15."
     ],
     [
      "Immunodéprimés",
      "Seuil abaissé partout : symptômes → contact médical rapide <span class='n n2'>N2</span>, test précoce (OFSP)."
     ],
     [
      "Hypertendus",
      "Présents dans la liste à risque OFSP (contrairement à la grippe, où l'HTA isolée est exclue — HUG) : la fiche suit l'OFSP pour le COVID."
     ]
    ]
   }
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
      "OFSP",
      "Page COVID-19 — tests à visée thérapeutique et prise en charge, vaccination (groupes, mi-octobre à mi-décembre, ≥6 mois), liste des groupes à risque",
      "30.08.2026"
     ],
     [
      "OFSP",
      "Communiqué vaccination d'automne grippe/COVID/VRS du 16.10.2025 — rappel COVID dès octobre, VRS ≥75 ans et >60 ans à risque",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Page produit ouverte : Paxlovid cpr pell (catégorie A, LIM 5 jours, posologie, CI CYP3A/grossesse/allaitement)",
      "30.08.2026"
     ],
     [
      "HUG — Service de médecine de premier recours",
      "Stratégie IVRS 2021 — co-infection SARS-CoV-2/grippe (réutilisation fiche 12)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f14": [
  {
   "t": "Le cadre",
   "open": true,
   "p": [
    "La fièvre et la douleur de l'adulte traversent presque toutes les fiches de ce fichier — cette fiche pose la mécanique commune : trois molécules de palier 1 (paracétamol, ibuprofène, aspirine), un choix dicté par le <b>terrain</b> plus que par le symptôme, et une limite que les FI fixent elles-mêmes : l'automédication antalgique/antipyrétique se réévalue à <span class='dose'>3 j</span> (Algifor « max 3 j », Aspirine « en automédication pendant max 3 j », NeoCitran « max 3 j sans avis médical » — FI compendium).",
    "L'antipyrétique traite le confort, pas la maladie : « donner des antipyrétiques n'a aucune influence significative sur la durée de la maladie » (pédiatrie suisse, fiche 1) — vrai aussi chez l'adulte qui veut « casser la fièvre »."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "La nuque ? Le comportement ?",
      "Méningite, confusion fébrile",
      "Raideur de nuque, confusion, changement de comportement <span class='n n1'>N1</span> (ameli, fiche 7)"
     ],
     [
      "Cette céphalée, brutale comment ?",
      "Le coup de tonnerre",
      "Céphalée brutale « en coup de tonnerre », troubles visuels, convulsions <span class='n n1'>N1</span> (HPC Swissmedic, fiche T2)"
     ],
     [
      "Où exactement, la douleur ?",
      "Les douleurs qui ne sont pas du palier 1",
      "Douleur thoracique, douleur abdominale intense <span class='n n1'>N1</span>–<span class='n n2'>N2</span>"
     ],
     [
      "Voyage récent ?",
      "Fièvre au retour de zone tropicale",
      "<span class='n n2'>N2</span> sans attendre — convention de l'outil, le paludisme ne pardonne pas le retard"
     ],
     [
      "Depuis quand la fièvre ?",
      "La limite des 3 jours",
      "><span class='dose'>38.5 °C</span> persistante (ameli, fiche 1) ou fièvre au-delà de <span class='dose'>3 j</span> malgré antipyrétique <span class='n n2'>N2</span>"
     ],
     [
      "Terrain fragile ?",
      "Immunosuppression, grand âge, chimiothérapie",
      "Fébrile sur ce terrain <span class='n n2'>N2</span> (fiche 12)"
     ],
     [
      "Combien d'antalgiques par semaine, en temps normal ?",
      "La surconsommation",
      "Prises plusieurs jours par semaine, tous les mois → consultation <span class='n n3'>N3</span> — céphalée de surconsommation à évoquer : <span class='nv'>non vérifié</span>, seuils à sourcer"
     ],
     [
      "Que prend-il déjà ?",
      "Cumul et doublons",
      "→ fiche T2 avant toute délivrance"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Fièvre avec raideur de nuque, confusion, changement de comportement, détresse ou cyanose (ameli — <b>non suisse</b>, fiche 7)",
      "Céphalée brutale en coup de tonnerre (fiche T2) · déficit neurologique",
      "Douleur thoracique (fiche 12)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Fièvre ><span class='dose'>38.5 °C</span> qui persiste, ou fièvre au-delà de <span class='dose'>3 j</span> malgré traitement",
      "Fièvre au retour de zone tropicale — convention de l'outil",
      "Terrain fragile fébrile : immunosupprimé, chimiothérapie, grand âge qui décline (fiche 12)",
      "Douleur inexpliquée d'intensité inhabituelle"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Douleur qui nécessite encore un antalgique après <span class='dose'>3 j</span> — la borne des FI",
      "Antalgiques consommés plusieurs jours par semaine, mois après mois",
      "Fièvre récidivante sans explication"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Fièvre ou douleur banale, terrain sain : paracétamol d'abord, à la dose minimale efficace, et rendez-vous de réévaluation annoncé — « si ça dure plus de 3 jours, si ça monte au-dessus de 38.5, ou si quelque chose change → médecin »."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC — les trois molécules",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie adulte",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-B'>B</span>",
      "<span class='dose'>1–2 cp</span>, intervalle <span class='dose'>4–6 h</span>, max <span class='dose'>8 cp/j</span> (<span class='dose'>4 g</span>)",
      "réévaluer à <span class='dose'>3 j</span>",
      "1ᵉʳ choix par défaut · foie, cumul toutes sources — fiche T2"
     ],
     [
      "Paracétamol Mepha cpr 500 mg",
      "paracétamol",
      "<span class='cat cat-D'>D</span> (20 pce) · <span class='cat cat-B'>B</span> (100/300)",
      "idem",
      "idem",
      "la preuve vivante du « vérifier par présentation » — fiche T2"
     ],
     [
      "Algifor-L forte cpr 400 mg",
      "ibuprofène",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>200–400 mg</span>, intervalle <span class='dose'>4–6 h</span>, max <span class='dose'>1200 mg/j</span>",
      "<span class='dose'>3 j</span>",
      "2ᵉ choix — tout le bloc « ne pas délivrer » de la fiche T2 : grossesse dès 24 SA, ulcère, IR/IC sévères, triple whammy"
     ],
     [
      "Aspirine S cpr 500 mg",
      "acide acétylsalicylique",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>500 mg–1 g</span>, intervalle <span class='dose'>4–8 h</span>, max <span class='dose'>3 g/j</span>",
      "<span class='dose'>3 j</span>",
      "CI ulcère évolutif, saignements GI · grossesse : 3ᵉ trim CI, 1ᵉʳ–2ᵉ « IPr » (FI) — et CRAT : comme les AINS dès 24 SA · <12 ans : jamais en automédication, 12–18 sur prescription (FI)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même molécule, <b>catégorie revérifiée par présentation</b> sur compendium à la remise",
      "—",
      "—"
     ]
    ]
   },
   "warn": [
    "Aspirine + anticoagulants ou antiagrégants : la rubrique interactions est sous login HIN — <span class='nv'>non vérifié</span>. En pratique : chez l'anticoagulé, paracétamol d'abord, et aucune aspirine antalgique sans vérification de l'IP au comptoir.",
    "Ne jamais empiler deux AINS (ibuprofène + aspirine antalgique), ni ajouter un AINS aux associations qui en contiennent déjà (Pretufen — fiche T2)."
   ]
  },
  {
   "t": "Grossesse et allaitement — enfin sourcé",
   "open": true,
   "p": [
    "Le CRAT (référence française, <b>source non suisse</b>) permet de fermer le <em>non vérifié</em> qui traversait les fiches précédentes :"
   ],
   "ul": [
    "<b>Paracétamol</b> : « l'antalgique de palier 1 et l'antipyrétique de choix chez la femme enceinte », utilisable « quel que soit le terme de la grossesse » — à la posologie minimale efficace, pour la durée la plus brève (CRAT). Allaitement : possible — l'enfant reçoit au plus <span class='dose'>4 %</span> de la dose pédiatrique via le lait (CRAT).",
    "<b>AINS — tous, aspirine ≥<span class='dose'>500 mg/j</span> et coxibs compris</b> : « formellement contre-indiqués à partir du début du 6ᵉ mois (<span class='dose'>24 SA</span>) » ; avant 24 SA, usage ponctuel possible mais chronique à éviter (CRAT). Cohérent avec les FI suisses (3ᵉ trimestre CI, 1ᵉʳ–2ᵉ « IPr » — fiche T2), en plus précis sur le seuil.",
    "Réflexe comptoir : à toute femme en âge de procréer qui demande un AINS, poser la question de la grossesse — 24 SA, c'est avant le 3ᵉ trimestre que beaucoup ont en tête."
   ],
   "warn": [
    "Les fiches 1, 3, 5, 8 et 12 portent encore l'ancien marqueur « paracétamol grossesse <span class='nv'>non vérifié</span> » — à remplacer par un renvoi vers cette section lors d'une passe dédiée (signalé au rapport)."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Personne âgée polymédiquée",
      "Paracétamol en premier, dose minimale efficace (principe CRAT). AINS : triple whammy, IR — fiche T2. Une fièvre chez le grand âge peut être pauvre en symptômes : seuil d'orientation abaissé."
     ],
     [
      "Insuffisance rénale / hépatique",
      "IR sévère : pas d'AINS (FI). Hépatopathie : paracétamol CI si sévère (FI) — fiche T2."
     ],
     [
      "Anticoagulés",
      "Paracétamol. AINS et aspirine : <span class='nv'>non vérifié</span> (interactions sous login) — s'abstenir sans vérification."
     ],
     [
      "Asthme",
      "AINS et bronchospasme : <span class='nv'>non vérifié</span> — fiche T2 ; prudence, paracétamol d'abord."
     ],
     [
      "Enfant",
      "→ fiche 15 (doses au poids, et la question aspirine/Reye y sera traitée)."
     ]
    ]
   }
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Fièvre : boire, se découvrir, repos — l'antipyrétique vise le confort, pas le chiffre (pédiatrie suisse, fiche 1).",
    "Douleur : chaleur ou froid local selon le contexte, repos relatif — et réévaluation à <span class='dose'>3 j</span> plutôt qu'un renouvellement silencieux.",
    "Tenir le décompte du paracétamol de la journée <b>avec</b> le patient quand il prend des associations (fiche T2)."
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
      "compendium.ch (HCI Solutions)",
      "Page produit ouverte : Aspirine S cpr 500 mg (D, max 3 g/j, CI, automédication 3 j) — plus réutilisation (30.08.2026) : Dafalgan 500, Paracétamol Mepha 500, Algifor-L forte 400, NeoCitran",
      "30.08.2026"
     ],
     [
      "CRAT (<b>non suisse</b>)",
      "« Paracétamol – Grossesse » · « Paracétamol – Allaitement » · « Antalgiques – Grossesse » (AINS formellement CI dès 24 SA, aspirine ≥500 mg/j incluse)",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "Red flags fébriles adultes (réutilisation fiches 1 et 7)",
      "30.08.2026"
     ],
     [
      "Swissmedic / pédiatrie suisse",
      "Céphalée en coup de tonnerre (HPC, fiche T2) · antipyrétiques et confort (fiche 1)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f15": [
  {
   "t": "Le cadre",
   "open": true,
   "p": [
    "Fièvre de l'enfant : température ><span class='dose'>38 °C</span> — « un mécanisme naturel du corps pour combattre les microbes » (monenfantestmalade.ch, HUG). La mesure rectale reste le standard chez le petit (corrélation <span class='dose'>0.97</span> avec la température centrale — pédiatrie suisse, fiche 1).",
    "Et le message que le comptoir répète le plus : l'antipyrétique traite le <b>confort de l'enfant</b>, pas le thermomètre — « donner des antipyrétiques n'a aucune influence significative sur la durée de la maladie », mais les enfants traités « sont plus actifs et se sentent mieux » (pédiatrie suisse). L'objectif n'est pas 37.0."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Quel âge exactement ?",
      "Le nourrisson",
      "<<span class='dose'>3 mois</span> avec ≥<span class='dose'>38 °C</span> rectale <span class='n n1'>N1</span> (pédiatrie suisse · monenfantestmalade.ch : « immédiatement »)"
     ],
     [
      "La peau ? Le teint ?",
      "Purpura, sepsis",
      "<b>Taches violacées</b>, teint grisâtre <span class='n n1'>N1</span> (monenfantestmalade.ch)"
     ],
     [
      "Boit-il ? Urine-t-il ? Réveillable ?",
      "Déshydratation, altération",
      "Refuse de boire, somnolent, pas d'urine depuis <span class='dose'>8 h</span> <span class='n n1'>N1</span> (ameli · monenfantestmalade.ch, fiche 3)"
     ],
     [
      "Comment respire-t-il ?",
      "Détresse",
      "Respiration rapide et courte, pauses <span class='n n1'>N1</span> (ameli) — seuils par âge en fiche 10"
     ],
     [
      "La nuque ? Vomissements ?",
      "Méningite",
      "Raideur de nuque + vomissements <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "A-t-il convulsé ?",
      "Convulsion fébrile",
      "Crise en cours ou ><span class='dose'>quelques minutes</span> <span class='n n1'>N1</span> · crise terminée → informer le pédiatre le jour même <span class='n n2'>N2</span> (monenfantestmalade.ch)"
     ],
     [
      "Depuis combien de jours ?",
      "La fièvre qui dure",
      "><span class='dose'>2 j</span> avant 2 ans · ><span class='dose'>3 j</span> après 2 ans <span class='n n2'>N2</span> (ameli · monenfantestmalade.ch)"
     ],
     [
      "Varicelle en cours ?",
      "Terrain iGAS",
      "Fièvre haute persistante + varicelle active <span class='n n2'>N2</span> (PIGS, fiche 3)"
     ],
     [
      "Douleur que rien ne calme ? Très pâle ?",
      "Les signes d'alarme de fond",
      "<span class='n n1'>N1</span> (pédiatrie suisse, fiche 1)"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences pédiatriques · <a href='tel:144'>144</a>",
     "items": [
      "<3 mois fébrile · taches violacées, teint grisâtre · raideur de nuque avec vomissements · confusion",
      "Respiration difficile, pauses respiratoires · refuse de boire, somnolent · pas d'urine depuis <span class='dose'>8 h</span>",
      "Convulsion en cours ou qui « se prolonge au-delà de quelques minutes » (monenfantestmalade.ch)",
      "Fièvre ><span class='dose'>40 °C</span> avec état général qui se dégrade (ameli — <b>non suisse</b>)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "Pédiatre ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a> (pédiatrie incluse)",
     "items": [
      "Fièvre ><span class='dose'>2 j</span> avant 2 ans, ><span class='dose'>3 j</span> après 2 ans",
      "Après toute convulsion fébrile, même terminée et brève — le pédiatre doit en être informé",
      "Varicelle active avec fièvre haute persistante (PIGS, fiche 3)",
      "Douleurs associées qui inquiètent (oreille → fiche 5, gorge → fiche 3)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Pédiatre, sur rendez-vous",
     "items": [
      "Fièvres récidivantes sans explication",
      "L'enfant qui va bien mais dont le motif traîne — toux (fiche 10), rhume qui n'en finit pas"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Enfant fébrile >3 mois, qui boit, joue entre les pics, sans aucun signe d'alarme : antipyrétique au poids si l'enfant est inconfortable, mesures simples, et les seuils de retour donnés aux parents par écrit si besoin."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC — doses au poids",
   "open": true,
   "p": [
    "Toujours en <b>mg/kg</b>, toujours avec la pipette ou la seringue doseuse de la boîte — jamais la cuillère de cuisine."
   ],
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "Durée max",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Dafalgan sirop 30 mg/ml enfant (pipette doseuse)",
      "paracétamol",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>15 mg/kg</span> par prise, max <span class='dose'>3(–4)×/j</span>, intervalle <span class='dose'>6–8 h</span> · 9–12 ans : max <span class='dose'>2 g/j</span>",
      "<12 ans : <span class='dose'>3 j</span> sans avis (FI)",
      "1ᵉʳ choix · CI hépatiques, y c. maladie de Gilbert (FI) · cumul avec tout autre paracétamol — fiche T2"
     ],
     [
      "Algifor Junior susp 100 mg/5 ml (seringue doseuse)",
      "ibuprofène",
      "<span class='cat cat-B'>B</span>",
      "6 mois–12 ans : <span class='dose'>20–max 30 mg/kg/j</span> en <span class='dose'>3–4 prises</span>, intervalle <span class='dose'>6–8 h</span>",
      "réévaluer à <span class='dose'>3 j</span>",
      "2ᵉ choix · dès <span class='dose'>6 mois</span> (FI) · CI ulcère, IR/IC sévères (FI) · <b>remise B documentée</b> — et noter : la suspension junior est en B là où le comprimé adulte est en D"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même molécule pédiatrique, <b>catégorie revérifiée par présentation</b> à la remise",
      "—",
      "—"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "<b>Aspirine chez l'enfant : jamais</b> — « ne donnez pas d'aspirine® (acide acétylsalicylique) à un enfant » (monenfantestmalade.ch, HUG) ; la FI elle-même exclut l'automédication <12 ans et exige une prescription de 12 à 18 ans (fiche 14).",
     "AINS chez l'enfant qui ne boit plus ou vomit — la déshydratation est déjà un motif <span class='n n1'>N1</span>, pas un terrain à AINS."
    ]
   },
   "warn": [
    "AINS et varicelle : la prudence classique (risque de surinfections cutanées graves) n'a pas été retrouvée dans les pages ouvertes cette session — <span class='nv'>non vérifié</span>. Dans le doute : paracétamol seul chez l'enfant varicelleux, d'autant que la varicelle active est un terrain iGAS (PIGS, fiche 3)."
   ]
  },
  {
   "t": "La séquence antipyrétique — une molécule à la fois",
   "open": true,
   "ul": [
    "<b>Commencer par le paracétamol</b> (monenfantestmalade.ch), à <span class='dose'>15 mg/kg</span>, si l'enfant est inconfortable — pas au premier degré au-dessus de 38.",
    "S'il reste fébrile et mal <b>3–4 h après</b>, la fiche parents HUG prévoit le recours à l'ibuprofène (monenfantestmalade.ch) — en respectant ses propres intervalles.",
    "Mais pas de bithérapie systématique : l'association paracétamol-ibuprofène « n'est guère plus utile et peut même contribuer à une phobie de la fièvre » (pédiatrie suisse). Une molécule bien dosée d'abord ; la seconde en recours, pas en routine.",
    "Réévaluation ferme à <span class='dose'>3 j</span> — c'est aussi la limite des FI pédiatriques."
   ]
  },
  {
   "t": "Convulsion fébrile — le scénario qui terrifie",
   "open": true,
   "p": [
    "Fréquente, impressionnante, bénigne dans l'immense majorité : des secousses lors d'une montée brusque de température, qui « s'arrêtent après l'âge de 5 ans » et « ne causent aucun dommage permanent » (monenfantestmalade.ch)."
   ],
   "ol": [
    "Coucher l'enfant <b>sur le côté</b>.",
    "Ne pas le retenir : « n'essayez pas d'arrêter les secousses en le tenant fermement ; la convulsion s'arrêtera d'elle-même ».",
    "Regarder l'heure : au-delà de <b>quelques minutes</b>, c'est le <span class='tel'>144</span>.",
    "Crise terminée : informer le pédiatre le jour même — et rassurer : pas de séquelles, pas d'épilepsie annoncée, récidive possible.",
    "Déculpabiliser : « essayer de combattre la fièvre ne prévient pas toutes les convulsions fébriles » — l'antipyrétique n'est pas une assurance anti-crise."
   ]
  },
  {
   "t": "Conseils non médicamenteux",
   "ul": [
    "Dévêtir l'enfant, chambre fraîche et aérée (<span class='dose'>18–20 °C</span>), proposer à boire souvent (monenfantestmalade.ch · ameli).",
    "Ne pas réveiller un enfant qui dort pour mesurer sa température (monenfantestmalade.ch).",
    "Mesure rectale chez le petit — et noter les températures avec l'heure : le carnet de fièvre aide le pédiatre.",
    "Répéter les seuils de retour aux parents : 2 j / 3 j selon l'âge, boire, comportement."
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
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Dafalgan sirop 30 mg/ml enfant (D, 15 mg/kg, 3 j) · Algifor Junior susp 100 mg/5 ml (B, 20–30 mg/kg/j, dès 6 mois)",
      "30.08.2026"
     ],
     [
      "monenfantestmalade.ch (HUG)",
      "Fiches « Fièvre » (seuils, signes immédiats dont taches violacées, séquence antipyrétique, pas d'aspirine) et « Convulsion fébrile » (gestes, réassurance)",
      "30.08.2026"
     ],
     [
      "pédiatrie suisse",
      "« L'enfant qui a de la fièvre » — <3 mois, mesure rectale, antipyrétiques = confort, association déconseillée (réutilisation fiche 1)",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Fièvre de l'enfant : bons réflexes » — >40 °C + dégradation, seuils 2 j/3 j, mesures simples",
      "30.08.2026"
     ],
     [
      "PIGS",
      "Varicelle active = terrain iGAS (réutilisation fiche 3)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f16": [
  {
   "t": "Le cadre",
   "open": true,
   "p": [
    "La gastro-entérite d'hiver est le plus souvent virale et « les diarrhées et vomissements durent habituellement <span class='dose'>5 à 7 jours</span> et guérissent spontanément » (monenfantestmalade.ch — HUG). Le danger n'est pas la diarrhée, c'est la <b>déshydratation</b> — « plus l'enfant est jeune, plus elle s'installe vite », et la personne âgée n'est pas mieux lotie.",
    "Les deux objectifs du comptoir (ameli — <b>non suisse</b>) : « éviter la déshydratation et la contamination de l'entourage ». Tout le reste — ralentir le transit, couper la nausée — est du confort, parfois contre-productif."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Du sang dans les selles ou les vomissements ?",
      "Forme invasive, dysenterie",
      "Enfant : <span class='n n1'>N1</span> (monenfantestmalade.ch : « immédiatement ») · adulte : <span class='n n2'>N2</span> (ameli) — et CI du lopéramide dans les deux cas"
     ],
     [
      "Enfant : pleure-t-il avec des larmes ? Urine ?",
      "La déshydratation installée",
      "<b>Plus de larmes</b>, pas d'urine depuis <span class='dose'>8 h</span> <span class='n n1'>N1</span> (monenfantestmalade.ch)"
     ],
     [
      "À quoi ressemble-t-il ?",
      "Les signes qui précèdent",
      "Fatigué, couché, refuse de jouer, yeux cernés, bouche et langue sèches → SRO immédiat et réévaluation serrée <span class='n n2'>N2</span> si doute"
     ],
     [
      "Fièvre avec la diarrhée ?",
      "Forme bactérienne invasive",
      "<span class='n n2'>N2</span> (ameli) — pas de lopéramide"
     ],
     [
      "Retour de voyage ?",
      "Turista, parasites",
      "Diarrhée au retour de pays tropical <span class='n n2'>N2</span> (ameli)"
     ],
     [
      "Tout ressort, même les liquides ?",
      "Vomissements incoercibles",
      "Rien ne reste malgré le SRO à la cuillère <span class='n n2'>N2</span> — <span class='n n1'>N1</span> chez le nourrisson"
     ],
     [
      "Depuis quand ?",
      "La diarrhée qui traîne",
      "><span class='dose'>2 semaines</span> <span class='n n3'>N3</span> (monenfantestmalade.ch : consulter)"
     ],
     [
      "Ses médicaments habituels ?",
      "Le terrain qui décompense",
      "Diurétique, IEC/sartan, AINS, antidiabétiques — la gastro peut imposer une adaptation : contact médical <span class='n n2'>N2</span>–<span class='n n3'>N3</span> selon l'état (<span class='nv'>non vérifié</span> pour les règles précises ; cohérent avec le triple whammy, fiche T2)"
     ],
     [
      "Immunodéprimé ?",
      "Le terrain fragile",
      "<span class='n n2'>N2</span> (ameli) — et CI du Perenterol (FI)"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Enfant : plus de larmes, pas d'urine depuis <span class='dose'>8 h</span>, sang dans selles ou vomissements (monenfantestmalade.ch)",
      "Nourrisson chez qui rien ne reste, somnolent, teint gris (fiche 15)",
      "Signes de choc à tout âge : confusion, pouls rapide, malaise"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Adulte : sang dans les selles, fièvre, diarrhée sévère, immunodépression, suspicion d'intoxication alimentaire collective, retour de zone tropicale (ameli)",
      "Vomissements incoercibles malgré le SRO à petites doses",
      "Personne âgée sous diurétique/IEC/antidiabétiques qui ne compense plus ses pertes",
      "Grossesse avec vomissements et difficultés à s'hydrater"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Diarrhée ><span class='dose'>2 semaines</span> (monenfantestmalade.ch)",
      "Épisodes récidivants, alternance diarrhée-constipation — un diagnostic à poser"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Gastro banale, patient qui boit et garde : SRO en première intention, hygiène, alimentation légère — et annoncer <span class='dose'>5–7 j</span> avec les trois signes de retour : sang, plus de larmes/d'urines, rien ne reste."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Normolytoral pdr",
      "SRO : NaCl, KCl, citrate, glucose",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>1 sachet</span> dans <span class='dose'>200 ml</span> d'eau ou thé non sucré · réhydratation initiale <span class='dose'>40–50 ml/kg</span> sur <span class='dose'>4–6 h</span> · puis 4 sem–1 an : jusqu'à <span class='dose'>75 ml/kg/24 h</span> · 1–5 ans : <span class='dose'>60</span> · >5 ans : <span class='dose'>40</span> (FI)",
      "dès <span class='dose'>4 semaines</span> — LE traitement de la fiche"
     ],
     [
      "Imodium lingual cpr orodisp 2 mg",
      "lopéramide",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>4 mg</span> puis <span class='dose'>2 mg</span> après chaque selle, max <span class='dose'>16 mg/j</span> · 6–12 ans : <span class='dose'>2 mg</span>, max <span class='dose'>6 mg/20 kg/j</span> (FI)",
      "voir bloc rouge — confort de l'adulte qui doit voyager ou travailler, pas un traitement"
     ],
     [
      "Perenterol caps 250 mg",
      "Saccharomyces boulardii",
      "<span class='cat cat-D'>D</span>",
      "J1 : <span class='dose'>250 mg 2×/j</span>, puis <span class='dose'>1×/j</span> · tous âges, nourrisson : sur une purée (FI)",
      "CI : maladie grave, déficit immunitaire, cathéter veineux central (FI)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> à la remise",
      "—"
     ]
    ]
   },
   "stop": {
    "t": "Ne pas délivrer",
    "ul": [
     "Lopéramide si <b>sang dans les selles, fièvre ou diarrhée sévère</b> — il « ralentit l'élimination du virus ou de la bactérie » (ameli) et sa FI le contre-indique en thérapie primaire des dysenteries et colites aiguës.",
     "Lopéramide <<span class='dose'>6 ans</span> et pendant l'allaitement (FI) — et chez l'enfant tout court, le SRO fait le travail.",
     "Perenterol chez l'immunodéprimé ou le porteur de cathéter central (FI) — une levure vivante n'est pas anodine sur ces terrains."
    ]
   },
   "warn": [
    "Vomissements de l'enfant : pas d'antiémétique en automédication — aucune spécialité vérifiée cette session (<span class='nv'>non vérifié</span>) ; la réponse est le SRO à toutes petites doses rapprochées, pas un médicament qui masque."
   ]
  },
  {
   "t": "Le SRO, mode d'emploi — ce qui se montre au comptoir",
   "open": true,
   "ol": [
    "Diluer <span class='dose'>1 sachet</span> dans <span class='dose'>200 ml</span> d'eau (ou thé refroidi non sucré) — jamais « un peu moins d'eau pour que ce soit plus fort » (FI Normolytoral).",
    "Conserver au frigo — meilleur goût, meilleure acceptation (monenfantestmalade.ch).",
    "Chez l'enfant qui vomit : <b>à la cuillère ou à la seringue, toutes les <span class='dose'>3 minutes</span></b> — puis « augmentez les quantités tout doucement s'il ne vomit pas » (monenfantestmalade.ch).",
    "Viser les volumes de la FI sur 24 h selon l'âge (tableau ci-dessus).",
    "Déshydratation légère et enfant qui refuse le SRO : jus de pomme dilué moitié-moitié, « ou ce qu'il a envie de boire » (monenfantestmalade.ch).",
    "Reprise alimentaire dès que ça tient : « nourriture simple, légère, sans friture ou sauce » — pas de jeûne prolongé."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Nourrisson",
      "SRO possible dès <span class='dose'>4 semaines</span> (FI) ; compter les couches mouillées ; seuils N1 stricts (larmes, 8 h) ; allaitement à poursuivre entre les prises de SRO."
     ],
     [
      "Personne âgée polymédiquée",
      "Le SRO n'est pas que pédiatrique — ameli le recommande « pour les personnes âgées ou en cas de vomissements ». Diurétiques, IEC, AINS, antidiabétiques pendant la gastro : adaptation à discuter avec le médecin (<span class='nv'>non vérifié</span> pour les règles exactes) — ne pas laisser courir."
     ],
     [
      "Grossesse",
      "Hydratation prioritaire ; vomissements qui empêchent de boire → <span class='n n2'>N2</span>. Lopéramide : CI allaitement (FI), grossesse non documentée sur la page publique — <span class='nv'>non vérifié</span>, s'abstenir."
     ],
     [
      "Voyageur",
      "Diarrhée au retour de zone tropicale → <span class='n n2'>N2</span> (ameli) — pas d'automédication prolongée qui retarde un diagnostic de parasitose."
     ]
    ]
   }
  },
  {
   "t": "Hygiène et entourage",
   "ul": [
    "Lavage des mains au savon — désinfectant chez l'enfant malade — après chaque selle ou change (monenfantestmalade.ch).",
    "La contamination de l'entourage est l'un des deux enjeux nommés par ameli : linge et surfaces, cuisine séparée si possible.",
    "Collectivité : retour quand ça va mieux — et prévenir la crèche."
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
      "monenfantestmalade.ch (HUG)",
      "Fiche « Gastro-entérite » — signes de déshydratation, seuils immédiats (larmes, 8 h, sang), SRO à la cuillère toutes les 3 min, jus dilué, 5–7 j, hygiène",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Normolytoral pdr (D, 200 ml, ml/kg par âge, dès 4 semaines) · Imodium lingual 2 mg (D, CI complètes) · Perenterol 250 mg (D, CI immunodéprimé/cathéter)",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Gastro-entérite de l'adulte : consultation et traitement » — sang/fièvre/sévérité/voyage, SRO petites doses, lopéramide et élimination du germe",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f17": [
  {
   "t": "Le cadre",
   "open": true,
   "p": [
    "L'hiver agresse la peau des deux côtés de la porte : « entre le froid glacial dehors et l'air sec du chauffage dedans, les variations constantes mettent la peau à rude épreuve » — elle devient sèche et sensible (aha! Centre d'Allergie Suisse). Trois motifs se succèdent au comptoir : la peau sèche qui gratte, les mains et lèvres qui se fissurent, et — plus rare mais décisif — le couple engelure/gelure au retour du froid."
   ]
  },
  {
   "t": "Reconnaître — du banal à l'urgent",
   "open": true,
   "table": {
    "head": [
     "Tableau",
     "Ce qu'on voit",
     "Orientation"
    ],
    "rows": [
     [
      "Xérose hivernale",
      "peau sèche, squames fines, prurit — jambes, mains, visage",
      "comptoir <span class='n n4'>N4</span>"
     ],
     [
      "Dermatite d'irritation des mains",
      "mains sèches, rouges, fissurées — lavages répétés, désinfectants, froid",
      "comptoir <span class='n n4'>N4</span> · récidive ou extension → <span class='n n3'>N3</span>"
     ],
     [
      "Crevasses, gerçures",
      "fissures douloureuses — doigts, talons, lèvres, mamelon chez l'allaitante",
      "comptoir <span class='n n4'>N4</span> · terrain diabétique → voir populations"
     ],
     [
      "Engelure",
      "réaction inflammatoire au froid humide (<span class='dose'>8–10 °C</span>) <b>sans gel des tissus</b> : zones rouges-violacées, gonflées, qui démangent ou brûlent — orteils, doigts ; « guérit spontanément en quelques semaines » (ameli — <b>non suisse</b>)",
      "comptoir <span class='n n4'>N4</span> · ulcération ou récidives → <span class='n n3'>N3</span>"
     ],
     [
      "Gelure",
      "<b>gel des tissus</b> après froid extrême : peau qui blanchit, fourmillements <b>sans douleur</b>, puis zone rouge enflée, cloques claires puis sanglantes ; la perte de sensibilité signe l'atteinte profonde (ameli)",
      "<span class='n n1'>N1</span> dès cloques ou insensibilité"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Exposition au froid extrême ? La zone est-elle insensible ?",
      "Gelure profonde",
      "Peau blanche/dure, perte de sensibilité, cloques <span class='n n1'>N1</span> (ameli : soins hospitaliers)"
     ],
     [
      "Réchauffée — et ensuite ?",
      "L'aggravation post-réchauffement",
      "Lésions qui empirent après réchauffement <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Diabétique ? Où est la fissure ?",
      "Le pied à risque",
      "Crevasse du pied ou du talon chez un diabétique <span class='n n2'>N2</span>–<span class='n n3'>N3</span> selon l'aspect — convention de l'outil, le pied diabétique ne se gère pas au rayon"
     ],
     [
      "La plaie coule, croûte, chauffe ?",
      "Surinfection",
      "Rougeur extensive, douleur croissante, fièvre <span class='n n2'>N2</span>"
     ],
     [
      "Ces « engelures » reviennent chaque hiver ?",
      "Un terrain à explorer",
      "Récidives, doigts qui changent de couleur en trois phases <span class='n n3'>N3</span> — à faire trier par le médecin"
     ],
     [
      "Eczéma connu qui flambe ?",
      "La poussée qui dépasse le comptoir",
      "Étendue, suintante, résistante aux émollients <span class='n n3'>N3</span> — cf. aha! pour l'accompagnement"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Gelure avec cloques — « des soins hospitaliers sont nécessaires » (ameli — <b>non suisse</b>)",
      "Perte de sensibilité d'une extrémité après le froid, ou lésions qui s'aggravent après réchauffement"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Plaie ou crevasse surinfectée : rougeur qui s'étend, douleur croissante, fièvre",
      "Lésion du pied chez un diabétique — convention de l'outil"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Engelures ulcérées ou récidivantes chaque hiver — un terrain vasculaire est à trier",
      "Eczéma étendu ou résistant aux soins bien conduits",
      "Xérose sévère généralisée de la personne âgée avec prurit insomniant"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Peau sèche, mains abîmées, crevasses simples, engelures non compliquées : soins ci-dessous, protection du froid, et réévaluation si pas de mieux en <span class='dose'>1–2 semaines</span>."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Excipial U lipolotion",
      "urée <span class='dose'>40 mg/ml</span>",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>2–3×/j</span>, dès <span class='dose'>1 an</span> (FI)",
      "CI : plaies ouvertes, nourrissons <1 an (FI) — l'urée pique sur peau fissurée"
     ],
     [
      "Bepanthen MED Plus crème",
      "dexpanthénol 50 mg/g + chlorhexidine 5 mg/g",
      "<span class='cat cat-D'>D</span>",
      "<span class='dose'>1–plusieurs ×/j</span> (FI)",
      "plaies à risque d'infection, <b>crevasses du mamelon</b> (éliminer les résidus avant la tétée) · CI grossesse/allaitement sur grandes surfaces · pas de contact avec les yeux (FI)"
     ],
     [
      "Bepanthen MED ong nasal",
      "dexpanthénol",
      "<span class='cat cat-D'>D</span>",
      "→ fiche 2",
      "narines gercées, sécheresse nasale"
     ],
     [
      "Soins cosmétiques (cold cream, sticks lèvres, mains)",
      "—",
      "sans catégorie",
      "au choix — critères aha! : sans colorant, sans conservateur, sans parfum, pH <span class='dose'>5.5</span>",
      "les cosmétiques n'ont pas de catégorie de remise — le conseil porte sur la composition, pas sur un statut"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> à la remise",
      "—"
     ]
    ]
   },
   "warn": [
    "Cortisone topique en automédication sur un eczéma : aucune spécialité vérifiée cette session — <span class='nv'>non vérifié</span>. Une poussée qui réclame plus qu'un émollient réclame un avis, pas une crème plus forte vendue à l'aveugle."
   ]
  },
  {
   "t": "Gelures et engelures — les gestes",
   "open": true,
   "ol": [
    "Engelure ou gelure débutante : réchauffer <b>progressivement</b> — mains sous les aisselles, couverture, ou bain d'eau <b>progressivement</b> réchauffée jusqu'à <span class='dose'>42 °C</span> max, pendant <span class='dose'>20–30 min</span> (ameli).",
    "Grands mouvements circulaires des bras pour ramener le sang vers les extrémités (ameli).",
    "<b>Interdits</b> : frictionner, masser, frotter avec de la neige — et toute chaleur sèche (sèche-cheveux, radiateur, bouillotte) : « risque de dommages irréparables » (ameli).",
    "Cloques, insensibilité, aggravation après réchauffement → urgences, sans percer les cloques.",
    "Engelures : protéger ensuite systématiquement du froid <b>et de l'humidité</b> — c'est le couple qui les crée (<span class='dose'>8–10 °C</span> humides suffisent)."
   ]
  },
  {
   "t": "Prévention — la routine d'hiver (aha!)",
   "ul": [
    "Douche ou bain à <span class='dose'>≤35 °C</span>, courts — et crème <b>immédiatement après</b>, tous les jours.",
    "L'hiver, passer aux textures plus grasses ; garder les produits légers pour l'été.",
    "Produits sans colorant, sans conservateur, sans parfum, pH <span class='dose'>5.5</span> — le label aha! aide au choix.",
    "Lessive sans parfum, bien rincée, pas d'adoucissant (le vinaigre adoucit aussi) ; textiles lisses (coton, viscose, soie), pas de laine rugueuse à même la peau.",
    "Gants dès la sortie, stick lèvres dans la poche, et crème mains au poste de travail pour les métiers à lavages répétés."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Diabétique",
      "Le pied d'abord : inspection, pas d'automédication sur une fissure du talon ou une plaie — <span class='n n2'>N2</span>–<span class='n n3'>N3</span> (convention de l'outil). Émollients en prévention, oui ; « soigner » une plaie au comptoir, non."
     ],
     [
      "Personne âgée",
      "Xérose quasi constante : émollient quotidien, douche courte tiède — et penser aux causes qui grattent autrement (médicaments, cholestase) si le prurit résiste <span class='n n3'>N3</span>."
     ],
     [
      "Nourrisson / enfant",
      "Excipial U : CI <1 an (FI) — avant 1 an, produits dédiés nourrisson sans actif. Joues au froid : corps gras avant la sortie."
     ],
     [
      "Allaitante",
      "Crevasses du mamelon : Bepanthen MED Plus est indiqué (FI) — éliminer les résidus avant la tétée ; douleur persistante → penser position/frein/candidose avec la sage-femme <span class='n n3'>N3</span>."
     ],
     [
      "Mains professionnelles (soins, coiffure, cuisine)",
      "Dermatite d'irritation : gants adaptés, crème grasse le soir — récidive malgré tout → <span class='n n3'>N3</span>, l'eczéma chronique des mains se documente (aha!)."
     ]
    ]
   }
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
      "aha! Centre d'Allergie Suisse",
      "« Huit conseils pour la peau sensible » + pages eczéma — routine d'hiver, ≤35 °C, sans parfum/pH 5.5, textiles, lessive",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Excipial U lipolotion (D, urée 4 %, dès 1 an, CI plaies/nourrissons) · Bepanthen MED Plus crème (D, indications et CI) — plus réutilisation : Bepanthen MED ong nasal (fiche 2)",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Les gelures, des lésions à traiter rapidement » — gelure vs engelure, stades, réchauffement progressif ≤42 °C, gestes interdits, urgences",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f18": [
  {
   "t": "Le cadre",
   "open": true,
   "p": [
    "Le <b>bouton de fièvre</b> évolue en <span class='dose'>4–10 j</span> des prodromes (picotement, brûlure) aux vésicules puis aux croûtes — et « le traitement local n'élimine pas les virus dormants » : la crème antivirale « bloque la multiplication du virus et réduit la durée de la poussée », mais seulement si elle est commencée <b>dès les signes annonciateurs</b> (ameli — <b>non suisse</b>).",
    "L'<b>aphte</b> n'est pas contagieux et « guérit sans traitement en quelques jours » (ameli). Le travail du comptoir : soulager — et reconnaître l'aphte qui sort du cadre."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "L'œil : douleur, rougeur, lumière ?",
      "Kératite herpétique",
      "Douleur oculaire, œil rouge, photophobie pendant une poussée <span class='n n2'>N2</span> le jour même (ameli)"
     ],
     [
      "Fièvre élevée ? Douleur intense ?",
      "Poussée sévère",
      "<span class='n n2'>N2</span> (ameli)"
     ],
     [
      "Immunodéprimé ?",
      "Le terrain qui change tout",
      "Toute poussée <span class='n n2'>N2</span> (ameli)"
     ],
     [
      "Un nouveau-né à la maison ?",
      "L'herpès néonatal",
      "Bouton de fièvre actif + nouveau-né : hygiène stricte, <b>pas d'embrassade</b> — convention de l'outil ; lésions chez le nouveau-né lui-même <span class='n n1'>N1</span>"
     ],
     [
      "Eczéma atopique + vésicules qui s'étendent ?",
      "Eczéma herpéticum",
      "<span class='n n1'>N1</span> — convention de l'outil, extension rapide chez l'atopique"
     ],
     [
      "Combien de poussées par an ?",
      "Le candidat au traitement de fond",
      "Récidives fréquentes ou très invalidantes <span class='n n3'>N3</span> — traitement oral à discuter chez le médecin"
     ],
     [
      "L'aphte : taille, nombre, durée ?",
      "L'aphte qui n'en est pas un",
      "><span class='dose'>1 cm</span>, ><span class='dose'>10</span> lésions, ><span class='dose'>2 semaines</span> sans cicatriser <span class='n n3'>N3</span> (ameli)"
     ],
     [
      "Autres symptômes avec les aphtes ?",
      "Maladie générale",
      "Diarrhée, douleurs articulaires, céphalées, fatigue marquée <span class='n n3'>N3</span> · fièvre <span class='n n2'>N2</span> (ameli)"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Vésicules herpétiques qui s'étendent rapidement chez un atopique (eczéma herpéticum — convention de l'outil)",
      "Suspicion de lésions herpétiques chez un nouveau-né"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Œil douloureux, rouge ou photophobe pendant une poussée — « consulter le jour même » (ameli — <b>non suisse</b>)",
      "Poussée avec fièvre élevée ou douleur intense · patient immunodéprimé",
      "Aphtes fébriles"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Herpès très récidivant ou invalidant — traitement de fond à discuter",
      "Aphte ><span class='dose'>1 cm</span>, >10 lésions, >2 semaines, ou accompagné de signes généraux (ameli)",
      "Lésion buccale qui ne ressemble ni à l'un ni à l'autre — surtout chez le fumeur : ne pas laisser traîner"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Bouton de fièvre typique attrapé aux prodromes : antiviral topique + hygiène. Aphte banal : mesures locales et alimentaires. Dans les deux cas, annoncer la durée attendue — <span class='dose'>4–10 j</span> / quelques jours — et les motifs de retour."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Zovirax Lip crème 2 g",
      "aciclovir",
      "<span class='cat cat-D'>D</span>",
      "> 2 ans : <span class='dose'>5×/j</span> à intervalles de <span class='dose'>4 h</span>, pendant <span class='dose'>4–10 j</span> (FI)",
      "2–12 ans : <b>première utilisation sur prescription</b> (FI) · rubrique CI/grossesse sous login — <span class='nv'>non vérifié</span>"
     ],
     [
      "Fenivir crème teintée 2 g",
      "penciclovir",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : env. <b>toutes les <span class='dose'>2 h</span></b> en journée, pendant <span class='dose'>4 j</span> (FI)",
      "la teinte camoufle la lésion · CI sous login — <span class='nv'>non vérifié</span>"
     ],
     [
      "Pyralvex sol avec pinceau",
      "rhubarbe + acide salicylique (éthanol <span class='dose'>59.5 %</span>)",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>3–4×/j</span>, max <span class='dose'>14 j</span>, au pinceau sur l'aphte (FI)",
      "CI : <12 ans, grossesse (surtout 3ᵉ trim.), allaitement, alcoolisme (FI)"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> à la remise (Zovirax crème 10 g est en <span class='cat cat-B'>B</span> !)",
      "—"
     ]
    ]
   },
   "warn": [
    "La fenêtre fait le résultat : l'antiviral topique se commence <b>aux picotements</b>, pas sur les croûtes (ameli) — le patient récidivant devrait avoir son tube d'avance.",
    "Crèmes anesthésiantes sur l'herpès : « contre-indiquées chez l'enfant » (ameli). Et attention à la catégorie selon la présentation : le même aciclovir passe de D (Lip 2 g) à <span class='cat cat-B'>B</span> (crème 10 g, indications cutanées larges)."
   ]
  },
  {
   "t": "Hygiène et contagiosité",
   "open": true,
   "ul": [
    "<b>Se laver les mains avant et après chaque application</b> de crème (ameli) — le virus se déplace avec les doigts, notamment vers l'œil.",
    "Ne pas arracher les croûtes, pas d'alcool sur la lésion, pas de maquillage dessus (ameli).",
    "Poussée active : pas d'embrassades — <b>surtout pas un nouveau-né</b> ni un eczémateux — et pas de partage de rouge à lèvres, couverts ou serviettes (convention de l'outil, dans la ligne de l'hygiène ameli).",
    "Aphtes : nourriture froide (laitages frais, glaces), éviter noix, gruyère, épicé, acide ; brosse très souple et dentifrice <b>sans lauryl sulfate</b> (ameli)."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Enfant",
      "Zovirax Lip : dès 2 ans mais <b>première fois sur prescription</b> entre 2 et 12 ans (FI). Anesthésiques locaux : CI (ameli). Le petit enfant avec bouche douloureuse fébrile qui ne boit plus → <span class='n n2'>N2</span>, penser gingivostomatite (convention)."
     ],
     [
      "Grossesse / allaitement",
      "Pyralvex : CI (FI). Antiviraux topiques : rubriques sous login — <span class='nv'>non vérifié</span> ; vérifier l'IP au comptoir ou avis médical."
     ],
     [
      "Immunodéprimé",
      "Pas d'automédication d'une poussée : <span class='n n2'>N2</span> (ameli)."
     ],
     [
      "Fumeur",
      "Toute lésion buccale atypique ou qui ne guérit pas en 2 semaines → <span class='n n3'>N3</span> ferme."
     ]
    ]
   }
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
      "ameli.fr (<b>non suisse</b>)",
      "« Herpès labial : que faire et quand consulter » (prodromes, 4–10 j, œil, hygiène) · « Aphtes : que faire et quand consulter » (1 cm/10 lésions/2 semaines, alimentation, lauryl sulfate)",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Zovirax Lip crème (D, 5×/j, 2–12 ans 1ʳᵉ fois sur Rx) · Fenivir crème teintée (D, toutes les 2 h, >12 ans) · Pyralvex sol (D, >12 ans, CI grossesse/allaitement) — catégorie contrastée notée : Zovirax crème 10 g en B",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f19": [
  {
   "t": "Reconnaître",
   "open": true,
   "table": {
    "head": [
     "Tableau",
     "Ce qu'on voit",
     "Orientation"
    ],
    "rows": [
     [
      "Conjonctivite virale",
      "œil rouge, larmoiement, sécrétions claires, souvent bilatéralisation en quelques jours — très contagieuse",
      "comptoir <span class='n n4'>N4</span> : lavages + hygiène"
     ],
     [
      "Conjonctivite bactérienne",
      "sécrétions purulentes, cils collés au réveil",
      "adulte : lavages, réévaluation <span class='n n3'>N3</span> si persistance · <b><2 ans : <span class='n n2'>N2</span> le jour même</b> (ameli)"
     ],
     [
      "Conjonctivite allergique",
      "prurit dominant, bilatéral d'emblée, terrain — collyres antiallergiques sans ordonnance possibles (ameli)",
      "→ fiche 21"
     ],
     [
      "Œil sec",
      "sensation de grain de sable, brûlure, gêne à l'écran — chauffage et écrans d'hiver",
      "comptoir <span class='n n4'>N4</span> : substituts lacrymaux"
     ],
     [
      "<b>Pas une conjonctivite</b>",
      "douleur profonde, baisse de vision, photophobie, halos",
      "triage ci-dessous — l'œil rouge douloureux n'est pas un motif de collyre"
     ]
    ]
   }
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Voyez-vous moins bien ?",
      "L'acuité — la question n° 1",
      "Baisse d'acuité, vue brouillée, <b>halos</b>, lignes ondulées <span class='n n1'>N1</span> (ameli : urgence)"
     ],
     [
      "Douleur — ou gêne ?",
      "La vraie douleur oculaire",
      "Douleur intense, surtout avec céphalées, vomissements ou fièvre <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "La lumière est-elle supportable ?",
      "Photophobie",
      "<span class='n n1'>N1</span>–<span class='n n2'>N2</span> selon l'intensité (ameli)"
     ],
     [
      "Un choc ? Une projection ?",
      "Traumatisme, corps étranger",
      "Traumatisme, liquide projeté, particule à grande vitesse <span class='n n1'>N1</span> (ameli)"
     ],
     [
      "Opéré de l'œil récemment ?",
      "Endophtalmie",
      "Œil opéré récemment, rouge et douloureux <span class='n n2'>N2</span> jour même, ophtalmologue (ameli)"
     ],
     [
      "Porteur de lentilles ?",
      "Kératite du porteur",
      "Lentilles + œil rouge douloureux <span class='n n2'>N2</span> jour même · gêne persistante malgré retrait <span class='n n3'>N3</span> (ameli)"
     ],
     [
      "Un herpès en cours ?",
      "Kératite herpétique",
      "Poussée labiale + œil rouge/douloureux/photophobe <span class='n n2'>N2</span> → fiche 18"
     ],
     [
      "Quel âge ?",
      "Le nourrisson",
      "<<span class='dose'>2 ans</span> avec œil rouge purulent <span class='n n2'>N2</span> le jour même (ameli)"
     ],
     [
      "Terrain oculaire ? Corticoïdes locaux ?",
      "Les yeux déjà fragiles",
      "Œil unique fonctionnel, maladie oculaire, corticoïdes locaux <span class='n n2'>N2</span> (ameli)"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences ophtalmiques · <a href='tel:144'>144</a> si état général touché",
     "items": [
      "Baisse d'acuité, halos, vue brouillée (ameli — <b>non suisse</b>)",
      "Douleur oculaire intense — a fortiori avec céphalées, vomissements ou fièvre",
      "Traumatisme, corps étranger projeté, produit chimique dans l'œil (rincer abondamment sans attendre)",
      "Photophobie marquée"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "Ophtalmologue ou médecin · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Porteur de lentilles avec œil rouge douloureux",
      "<2 ans avec œil rouge purulent (ameli)",
      "Œil opéré récemment, rouge ou douloureux · immunodéprimé · œil unique, maladie oculaire, corticoïdes locaux",
      "Herpès labial actif avec signes oculaires (fiche 18)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant ou ophtalmologue",
     "items": [
      "Conjonctivite qui ne s'améliore pas malgré lavages — et retrait des lentilles chez le porteur (ameli : « dans les jours qui viennent »)",
      "Œil sec dont la gêne persiste malgré les substituts bien utilisés",
      "Sécrétions purulentes persistantes de l'adulte"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Conjonctivite simple sans aucun signe d'alarme : lavages au sérum physiologique plusieurs fois par jour + hygiène stricte. Œil sec : substituts lacrymaux en unidoses + gestes d'environnement. Annoncer les motifs de bascule : douleur vraie, vision, lumière."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Oculac SDU unidoses",
      "povidone K25, <b>sans conservateur</b>",
      "<span class='cat cat-D'>D</span>",
      "> 18 ans : <span class='dose'>1 gtte</span> jusqu'à <span class='dose'>4×/j</span> (FI)",
      "compatible lentilles — humidification directe possible (FI)"
     ],
     [
      "Lacrinorm F UD unidoses",
      "carbomère 980 (gel)",
      "<span class='cat cat-D'>D</span>",
      "> 18 ans : <span class='dose'>1 gtte 2–4×/j</span> ou selon besoin (FI)",
      "texture gel : vision brouillée passagère — plutôt le soir · compatibilité lentilles non documentée sur la page publique"
     ],
     [
      "Sérum physiologique NaCl 0.9 % (unidoses)",
      "lavage oculaire",
      "—",
      "lavages abondants, plusieurs fois par jour (ameli)",
      "le premier geste de toute conjonctivite"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> à la remise",
      "—"
     ]
    ]
   },
   "warn": [
    "« Préférez les doses uniques, sans conservateur, afin de réduire le risque d'infections oculaires » (ameli) — les flacons multidoses entamés se périment vite et se contaminent.",
    "Collyres vasoconstricteurs « anti-rougeur » : aucune spécialité vérifiée cette session — <span class='nv'>non vérifié</span>. Position de l'outil : blanchir un œil sans diagnostic masque le signal ; s'abstenir.",
    "Aucun collyre antibiotique ne part du comptoir — et pas de collyre corticoïde sans ophtalmologue, jamais."
   ]
  },
  {
   "t": "Lentilles — la règle complète",
   "open": true,
   "ul": [
    "Conjonctivite : <b>retirer les lentilles jusqu'à la guérison</b>, ne les remettre que <span class='dose'>24 h</span> après — paire neuve si jetables, désinfection sinon (ameli).",
    "Porteur avec œil rouge <b>douloureux</b> : jour même chez l'ophtalmologue — la kératite du porteur ne pardonne pas l'attente.",
    "Gêne sèche persistante sous lentilles : consulter ; en attendant, Oculac SDU peut humidifier (FI).",
    "Jeter le maquillage utilisé pendant l'infection (ameli)."
   ]
  },
  {
   "t": "Œil sec — les gestes qui comptent",
   "ul": [
    "Écran : le haut de l'écran <b>au niveau des yeux</b>, pauses régulières, cligner volontairement (ameli).",
    "Environnement : éviter l'air conditionné/chauffage direct, humidifier les pièces, aérer chaque jour (ameli) — le duo air sec + écrans est le même que pour le nez (fiche 2).",
    "Mains lavées avant de toucher les yeux, ne pas frotter les paupières (ameli).",
    "Médicaments asséchants : faire lire la notice — et lister le traitement au dossier ; certains psychotropes et antihypertenseurs assèchent (ameli, page traitement non ouverte — détail <span class='nv'>non vérifié</span>)."
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
      "ameli.fr (<b>non suisse</b>)",
      "« Conjonctivite : que faire et quand consulter » (lavages, lentilles 24 h, <2 ans, jour même) · « Œil rouge : que faire » (urgences : acuité, halos, douleur + vomissements, trauma) · « Yeux secs : bons réflexes » (unidoses sans conservateur, écrans, environnement)",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Oculac SDU (D, povidone sans conservateur, lentilles ok) · Lacrinorm F UD (D, carbomère, 2–4×/j)",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f20": [
  {
   "t": "Poux — confirmer, traiter, dédramatiser",
   "open": true,
   "p": [
    "Confirmer d'abord : après-shampooing démêlant en bonne quantité, puis <b>peigne fin anti-poux</b> de la racine aux pointes, essuyé sur du papier ménage à chaque passage (monenfantestmalade.ch — HUG). Pas de poux sur le peigne = pas de traitement.",
    "Traiter ensuite par <b>étouffement</b>, pas par insecticide : les insecticides sont « toxiques pour le système neurologique des petits enfants » (monenfantestmalade.ch). Deux schémas valides : produit à la diméticone avec contrôle et répétition à 1 semaine, ou après-shampooing + peigne répété à <span class='dose'>J5, J9 et J13</span>."
   ],
   "ul": [
    "Traiter <b>toute la famille simultanément</b> — c'est la rechute qui coûte cher (monenfantestmalade.ch).",
    "« Il n'est pas nécessaire de nettoyer la literie ou les vêtements » (monenfantestmalade.ch) — l'information qui désamorce la panique du dimanche soir. Ne pas partager les brosses, en revanche.",
    "École : retour possible « le lendemain du premier traitement », sans risque pour les autres (monenfantestmalade.ch).",
    "Contrôle au peigne à <span class='dose'>1 semaine</span>, et répéter si besoin (FI Hedrin)."
   ]
  },
  {
   "t": "Verrues — la patience, sauf cinq situations",
   "open": true,
   "p": [
    "« Les verrues guérissent spontanément en quelques mois, mais certaines peuvent persister des années » (ameli — <b>non suisse</b>). L'automédication kératolytique est légitime — mais <b>jamais</b> sur le visage, les organes génitaux, les grains de beauté ou une peau abîmée (ameli · FI Lebewohl), et <b>jamais chez le diabétique ou l'immunodéprimé</b>, surtout pour les verrues plantaires : « n'essayez pas de vous soigner vous-même » (ameli)."
   ],
   "table": {
    "head": [
     "Consulter si",
     "Niveau"
    ],
    "rows": [
     [
      "Brûlure ou signes d'infection (rougeur, gonflement, pus) après un traitement verrucide",
      "<span class='n n2'>N2</span> (ameli : « rapidement »)"
     ],
     [
      "Verrue du visage · douloureuse · qui se multiplie, change de couleur ou de forme · qui saigne · près des ongles",
      "<span class='n n3'>N3</span> (ameli)"
     ],
     [
      "Échec après un traitement bien conduit (jusqu'à <span class='dose'>4 semaines</span> — FI Lebewohl)",
      "<span class='n n3'>N3</span>"
     ],
     [
      "Diabète ou immunodépression + verrue, surtout plantaire",
      "<span class='n n3'>N3</span> d'emblée, sans essai d'automédication (ameli)"
     ]
    ]
   }
  },
  {
   "t": "Mycoses des pieds — courte, mais complète",
   "open": true,
   "p": [
    "Le pied d'athlète typique (macération entre les orteils, desquamation, prurit) se traite au comptoir : terbinafine topique <span class='dose'>1×/j pendant 1 semaine</span> — une cure courte mais à faire <b>entière</b>, même si ça ne gratte plus (FI Lamisil Pedisan).",
    "Deux sorties de route : l'<b>ongle</b> atteint (épaissi, jauni) — l'onychomycose ne cède pas aux topiques d'automédication, c'est un diagnostic et un traitement médical <span class='n n3'>N3</span> (position de l'outil) — et le <b>pied du diabétique</b>, qui ne se gère pas au rayon (fiche 17)."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Infection cutanée qui s'étend vite avec fièvre et douleur (convention de l'outil — penser dermohypodermite, surtout sur mycose ou plaie du pied)"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Brûlure ou signes d'infection après un verrucide (ameli — <b>non suisse</b>)",
      "Pied du diabétique : fissure, mycose macérée ou verrue douloureuse (fiche 17)"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Verrue : visage, ongles, douleur, multiplication, changement d'aspect, saignement, échec à 4 semaines (ameli)",
      "Mycose : atteinte de l'ongle, récidives, extension malgré traitement",
      "Poux « résistants » après deux cycles bien conduits — vérifier la technique avant de changer de produit"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Poux confirmés au peigne · verrue banale de la main ou de la plante chez un patient sain · pied d'athlète typique : les trois protocoles ci-dessus, avec leurs échéances de contrôle (1 semaine / 4 semaines / fin de cure)."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Hedrin xpress gel",
      "diméticone 4 %",
      "disp. méd.",
      "cheveux <b>secs</b>, faire pénétrer, poser ≥<span class='dose'>15 min</span>, shampooing + rinçage · contrôle à <span class='dose'>1 sem</span>, répéter si besoin (FI)",
      "dès <span class='dose'>6 mois</span> · pas sur peau lésée (FI) · mécanique — l'un des produits cités par la fiche HUG"
     ],
     [
      "Lebewohl liquide",
      "acide salicylique + acide lactique (<span class='dose'>105.7 mg</span> chacun)",
      "<span class='cat cat-D'>D</span>",
      "> 2 ans : bain de pieds préalable, <span class='dose'>1 gtte 2×/j</span> jusqu'à <span class='dose'>5 j</span>, retrait du ramolli après bain · verrues : max <span class='dose'>4 semaines</span> (FI)",
      "CI : visage, zones génitales, grains de beauté, peau abîmée, <b>grossesse, allaitement</b> (FI) · protéger la peau saine autour"
     ],
     [
      "Lamisil Pedisan crème",
      "terbinafine 1 %",
      "<span class='cat cat-D'>D</span>",
      "> 12 ans : <span class='dose'>1×/j pendant 1 sem</span> (FI)",
      "CI allaitement (FI) · finir la cure même asymptomatique"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "même classe, <b>catégorie revérifiée par présentation</b> à la remise",
      "attention : Verrumal contient du fluorouracile — autre registre, pas une alternative d'automédication"
     ]
    ]
   },
   "warn": [
    "Cryothérapie en vente libre (Wartner, EndWarts) : aucune page vérifiée cette session — <span class='nv'>non vérifié</span>. Mêmes interdits de zones et de terrains que les kératolytiques, au minimum."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Nourrisson <6 mois",
      "Hedrin : CI (FI) — peigne + après-shampooing seulement, et avis pédiatrique."
     ],
     [
      "Enfant <2 ans",
      "Lebewohl : CI (FI). Une verrue à cet âge se montre au pédiatre."
     ],
     [
      "Grossesse / allaitement",
      "Lebewohl : CI grossesse et allaitement (FI). Lamisil Pedisan : CI allaitement (FI). Poux : le traitement mécanique (peigne ± diméticone) est l'approche de choix — précautions spécifiques grossesse non listées sur la page Hedrin, <span class='nv'>non vérifié</span>."
     ],
     [
      "Diabétique / immunodéprimé",
      "Le double interdit de la fiche : pas de verrucide (ameli), pas de « petite mycose » négligée au pied — orientation systématique."
     ]
    ]
   }
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
      "monenfantestmalade.ch (HUG)",
      "Fiche « Poux » — peigne + après-shampooing, étouffement, J5/J9/J13, insecticides et neurotoxicité, famille, literie inutile à traiter, école dès le lendemain",
      "30.08.2026"
     ],
     [
      "ameli.fr (<b>non suisse</b>)",
      "« Verrues : que faire et quand consulter » — évolution spontanée, zones interdites, diabète/immunodépression, critères de consultation, infection post-traitement",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Pages produit ouvertes : Hedrin xpress gel (DM, ≥6 mois, 15 min, J7) · Lebewohl liq (D, mode d'emploi, CI) · Lamisil Pedisan crème (D, 1×/j 1 sem, >12 ans, CI allaitement)",
      "30.08.2026"
     ],
     [
      "Sources tentées sans succès",
      "Paranix spray+peigne et Clabin : pages compendium en 404 — produits remplacés par Hedrin et Lebewohl, vérifiés",
      "30.08.2026"
     ]
    ]
   }
  }
 ],
 "f21": [
  {
   "t": "Le cadre",
   "open": true,
   "p": [
    "Deux vagues se chevauchent au comptoir d'hiver. Les <b>acariens</b> : « c'est surtout en automne, lorsque la saison de chauffage recommence, qu'ils tourmentent les personnes allergiques » (aha!). Puis les <b>pollens précoces</b> : l'aulne pourpre libérait déjà son pollen « durant la période de Noël », et le noisetier s'envole « dès que le soleil brille et que les températures dépassent les cinq degrés » — souvent en plein janvier (aha!). MétéoSuisse gère le réseau de mesure ; le suivi en temps réel passe par pollenetallergie.ch et l'appli Pollen-News.",
    "Le patient de janvier qui « enchaîne les rhumes » est parfois un allergique qui s'ignore : « si l'on ne sait pas si le nez coule à cause du pollen ou d'un refroidissement, le mieux est de se renseigner auprès de son médecin » (aha!) — cf. le différentiel de la fiche 1."
   ]
  },
  {
   "t": "Questionnement — réponses qui font basculer",
   "open": true,
   "table": {
    "head": [
     "Question",
     "Ce qu'on cherche",
     "Réponse qui fait basculer"
    ],
    "rows": [
     [
      "Gonflement des lèvres, de la langue, de la gorge ? Malaise ?",
      "Anaphylaxie",
      "<span class='n n1'>N1</span> — convention de l'outil, le <span class='tel'>144</span> sans discussion"
     ],
     [
      "Sifflements ? Souffle court ?",
      "L'asthme derrière la rhinite",
      "<span class='n n2'>N2</span> et fiche 11 — pas d'automédication respiratoire"
     ],
     [
      "Urticaire étendue ? Signes généraux ?",
      "Réaction systémique",
      "<span class='n n2'>N2</span>"
     ],
     [
      "Ça dure malgré un traitement bien pris ?",
      "Le plafond de l'OTC",
      "Rhinite non contrôlée après <span class='dose'>4 sem</span> (borne FI Zyrtec en saisonnier) <span class='n n3'>N3</span> — bilan, désensibilisation à discuter"
     ],
     [
      "Quel âge ?",
      "Le petit enfant",
      "<<span class='dose'>6 ans</span> : hors indications FI vérifiées (Zyrtec et mométasone dès 6 ans) <span class='n n3'>N3</span> pédiatre"
     ],
     [
      "L'œil : douleur, vision, lumière ?",
      "Pas une conjonctivite allergique",
      "→ fiche 19, mêmes red flags"
     ],
     [
      "Rhume ou allergie, au fond ?",
      "Le doute de janvier",
      "Doute persistant → test/médecin (aha!) <span class='n n3'>N3</span>"
     ]
    ]
   },
   "warn": [
    "Compléter par les cinq questions de sécurité (fiche T1). Développé LINDAAFF : <span class='nv'>non vérifié</span> — fiche T1."
   ]
  },
  {
   "t": "Limites du conseil — orientation",
   "open": true,
   "triage": [
    {
     "n": 1,
     "quand": "Maintenant",
     "ou": "Urgences · <a href='tel:144'>144</a>",
     "items": [
      "Gonflement lèvres/langue/gorge, difficulté respiratoire ou malaise après exposition — anaphylaxie (convention de l'outil)",
      "Crise d'asthme sur terrain allergique → fiche 11"
     ]
    },
    {
     "n": 2,
     "quand": "Aujourd'hui",
     "ou": "En journée : médecin traitant ou permanence · Soir et week-end : CTMG <a href='tel:0848133133'>0848 133 133</a>",
     "items": [
      "Urticaire étendue ou signes généraux",
      "Rhinite allergique + sifflements ou souffle court nouveaux"
     ]
    },
    {
     "n": 3,
     "quand": "Sous 48–72 h",
     "ou": "Médecin traitant, sur rendez-vous",
     "items": [
      "Symptômes non contrôlés malgré antihistaminique bien pris — et toute rhinite saisonnière au-delà de <span class='dose'>4 semaines</span> de traitement (FI)",
      "Enfant <6 ans symptomatique",
      "Doute rhume/allergie qui persiste : test à organiser (aha! propose un test gratuit)"
     ]
    },
    {
     "n": 4,
     "quand": "Comptoir",
     "ou": "Conseil officinal",
     "items": [
      "Rhinite ou conjonctivite allergique typique chez un patient connu : antihistaminique + mesures d'éviction ci-dessous — et le conseil de saison : « commencer dès maintenant à prendre les médicaments » quand les pollens démarrent (aha!)."
     ]
    }
   ]
  },
  {
   "t": "Traitement OTC",
   "open": true,
   "table": {
    "head": [
     "Spécialité (présentation vérifiée)",
     "PA",
     "Cat.",
     "Posologie",
     "CI / vigilance"
    ],
    "rows": [
     [
      "Zyrtec cpr pell 10 mg",
      "cétirizine",
      "<span class='cat cat-B'>B</span> ou <span class='cat cat-D'>D</span> <b>selon la présentation</b> (FI)",
      "> 12 ans : <span class='dose'>10 mg</span> le soir (ou <span class='dose'>5 mg 2×/j</span>) · 6–12 ans : idem · max <span class='dose'>4 sem</span> en saisonnier (FI)",
      "CI : insuffisance rénale terminale (ClCr <span class='dose'>&lt;15</span>), <b>allaitement</b> (FI) · vérifier la catégorie du conditionnement en main"
     ],
     [
      "Mometason Mepha spray 50 mcg",
      "mométasone",
      "<span class='cat cat-B'>B</span>",
      "rhinite allergique dès <span class='dose'>6 ans</span> (FI — fiche 2) · posologie FI",
      "remise B documentée, art. 45 (fiche T1) · grossesse « IPr »"
     ],
     [
      "Collyres antiallergiques",
      "—",
      "—",
      "« disponibles sans ordonnance » (ameli, fiche 19)",
      "aucune spécialité vérifiée cette session — <span class='nv'>non vérifié</span>, vérifier par présentation avant remise"
     ],
     [
      "<b>Si rupture</b>",
      "→ alternative",
      "—",
      "génériques cétirizine nombreux — <b>catégorie revérifiée par présentation</b> à chaque fois",
      "—"
     ]
    ]
   },
   "warn": [
    "Antihistaminiques de 1ʳᵉ génération (sédatifs, anticholinergiques) en dépannage d'allergie : mauvaise idée chez la personne âgée et le conducteur — fiche T2 (Benocten). La 2ᵉ génération d'abord.",
    "Somnolence et conduite sous cétirizine : « faiblement sédatif » (CRAT) mais la rubrique FI détaillée est sous login — <span class='nv'>non vérifié</span> ; prévenir pour les premières prises."
   ]
  },
  {
   "t": "Acariens — les mesures qui marchent (aha!)",
   "open": true,
   "ul": [
    "<b>Housses anti-acariens</b> (encasings) sur matelas, oreiller et duvet — lavées <span class='dose'>1–2×/an</span> seulement.",
    "Draps : chaque semaine à ≥<span class='dose'>60 °C</span> · oreillers et couettes : au moins <span class='dose'>1×/mois</span> à 60 °C · pyjamas aussi à 60 °C.",
    "Chambre : aérer plusieurs fois par jour <span class='dose'>5–10 min</span>, humidité <<span class='dose'>50 %</span>, température ≤<span class='dose'>20 °C</span>.",
    "Peluches : <span class='dose'>24 h</span> au congélateur, puis lavage.",
    "Aspirateur avec filtre à poussière fine ; le lit en premier, le sol ensuite."
   ]
  },
  {
   "t": "Pollens précoces — les gestes de saison (aha!)",
   "ul": [
    "Suivre les concentrations en temps réel : pollenetallergie.ch, appli Pollen-News.",
    "Lunettes dehors ; aérer « brièvement, par à-coups » ; se laver les cheveux le soir.",
    "Commencer le traitement <b>dès le début de la saison</b>, pas au pic (aha!).",
    "Le duo air froid sec + pollens irrite doublement : les lavages nasaux de la fiche 1 restent utiles en fond."
   ]
  },
  {
   "t": "Populations particulières",
   "table": {
    "head": [
     "Population",
     "Conduite"
    ],
    "rows": [
     [
      "Grossesse",
      "Cétirizine : « utilisation possible quel que soit le terme de la grossesse, y compris à forte dose » (CRAT — <b>non suisse</b>) ; loratadine idem (CRAT). Mométasone : « IPr » (FI). L'éviction reste le premier traitement."
     ],
     [
      "Allaitement",
      "Zyrtec : <b>CI allaitement</b> (FI) — contraste avec la grossesse ; avis avant tout antihistaminique, page CRAT allaitement non ouverte (<span class='nv'>non vérifié</span>)."
     ],
     [
      "Enfant <6 ans",
      "Hors indications FI vérifiées → pédiatre. Les mesures d'éviction, elles, n'ont pas d'âge minimum."
     ],
     [
      "Personne âgée / IR",
      "Cétirizine : CI si ClCr <15 (FI), adaptation intermédiaire non lisible sans login (<span class='nv'>non vérifié</span>) ; jamais de 1ʳᵉ génération anticholinergique (T2)."
     ],
     [
      "Asthmatique",
      "La rhinite allergique non traitée déstabilise l'asthme — traiter le nez, surveiller le souffle (fiche 11)."
     ]
    ]
   }
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
      "aha! Centre d'Allergie Suisse",
      "« 10 conseils contre les acariens » (chiffres exacts) · « La saison du pollen débute » (noisetier janvier, aulne à Noël, MétéoSuisse, Pollen-News, commencer tôt) · page allergies de saison",
      "30.08.2026"
     ],
     [
      "compendium.ch (HCI Solutions)",
      "Page produit ouverte : Zyrtec cpr pell 10 mg (B/D selon présentation, dès 6 ans, max 4 sem saisonnier, CI IR terminale/allaitement) — plus réutilisation : Mometason Mepha (fiche 2)",
      "30.08.2026"
     ],
     [
      "CRAT (<b>non suisse</b>)",
      "« Cétirizine – Grossesse » — possible quel que soit le terme, y compris forte dose ; loratadine idem",
      "30.08.2026"
     ]
    ]
   }
  }
 ]
};
