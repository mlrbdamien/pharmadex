import type { EntreeFiche } from './types';

/* Fichier généré depuis comptoir-otc.html — métadonnées des 36 fiches.
   Contenu rédigé une fiche à la fois, sources vérifiées en session, validé
   par Damien. Éditions ciblées uniquement : ne jamais régénérer en masse. */

export const CATALOGUE: EntreeFiche[] = [
  {
    "id": "t1",
    "code": "T1",
    "groupe": "Transversal",
    "titre": "Cadre légal et triage",
    "sous": "Catégories de remise · remise de liste B sans ordonnance · échelle N1–N4 · questionnement structuré",
    "volet": "otc"
  },
  {
    "id": "t2",
    "code": "T2",
    "groupe": "Transversal",
    "titre": "Sécurité transversale",
    "sous": "Paracétamol · AINS · décongestionnants · antitussifs · antihistaminiques sédatifs — les lignes rouges valables dans toutes les fiches",
    "volet": "otc",
    "remise": "Cette fiche cite des produits de <span class='cat cat-B'>B</span> : remise par le pharmacien en personne, patient présent, documentation obligatoire — art. 45, 47 et 48 OMéd, voir fiche T1."
  },
  {
    "id": "t3",
    "code": "T3",
    "groupe": "Transversal",
    "titre": "Validation d'ordonnance",
    "sous": "La démarche générale avant toute délivrance, et l'échelle V1–V4 — qui répond à « qu'est-ce que je fais de cette ordonnance », pas à « où j'envoie ce patient »",
    "volet": "rx"
  },
  {
    "id": "t4",
    "code": "T4",
    "groupe": "Transversal",
    "titre": "Cadre légal de l'ordonnance",
    "sous": "Qui peut prescrire, ce qui rend une ordonnance valable, les règles propres aux stupéfiants, la substitution — le droit fédéral, la position des pharmaciens cantonaux, et ce que Vaud laisse au devoir de diligence",
    "volet": "rx"
  },
  {
    "id": "t5",
    "code": "T5",
    "groupe": "Transversal",
    "titre": "Remboursement",
    "sous": "La LS et ses limitations, qui paie quoi — franchise, quote-part, les 40 % —, la garantie de prise en charge, et ce que la RBP V rémunère au pharmacien",
    "volet": "rx"
  },
  {
    "id": "t6",
    "code": "T6",
    "groupe": "Transversal",
    "titre": "Protection des données — nLPD",
    "sous": "L'officine manipule des données sensibles à longueur de journée : la nLPD (en vigueur depuis le 01.09.2023) et le secret professionnel encadrent ce qui se dit, se montre, se transmet et se conserve",
    "volet": "lpd"
  },
  {
    "id": "r1",
    "code": "R1",
    "groupe": "Cardiovasculaire",
    "titre": "Anticoagulants oraux — AVK et AOD",
    "sous": "Quatre AOD qui se ressemblent mais ne se valident pas pareil, deux AVK où tout interagit — et l'ordonnance la plus dangereuse du comptoir quand elle en croise une autre",
    "volet": "rx",
    "atc": [
      "B01AA",
      "B01AE",
      "B01AF"
    ]
  },
  {
    "id": "r2",
    "code": "R2",
    "groupe": "Cardiovasculaire",
    "titre": "Antiagrégants plaquettaires",
    "sous": "L'aspirine cardio qui ne se croque pas, le clopidogrel qui choisit son IPP, le prasugrel qui refuse les AVC, le ticagrélor qui essouffle — et la bithérapie qui doit avoir une date de fin",
    "volet": "rx",
    "atc": [
      "B01AC"
    ]
  },
  {
    "id": "r3",
    "code": "R3",
    "groupe": "Infectiologie",
    "titre": "Antibiotiques systémiques",
    "sous": "Six molécules du quotidien ambulatoire : l'amoxicilline qui déstabilise l'INR, le Klacid qui interdit la simvastatine et la dompéridone, la quinolone en dernier recours — et la cure qui se termine",
    "volet": "rx",
    "atc": [
      "J01"
    ]
  },
  {
    "id": "r4",
    "code": "R4",
    "groupe": "Système nerveux",
    "titre": "Antidépresseurs — ISRS, IRSN et autres",
    "sous": "Le QT de l'escitalopram, la paroxétine qui neutralise le tamoxifène, la duloxétine qui interdit la ciprofloxacine — et l'arrêt qui ne s'improvise jamais",
    "volet": "rx",
    "atc": [
      "N06A"
    ]
  },
  {
    "id": "r5",
    "code": "R5",
    "groupe": "Système nerveux",
    "titre": "Benzodiazépines et apparentés",
    "sous": "Quatre semaines maximum pour un hypnotique, un sevrage qui peut tuer après usage prolongé, l'aîné qui chute — et une asymétrie légale méconnue entre zolpidem et zopiclone",
    "volet": "rx",
    "atc": [
      "N05BA",
      "N05CD",
      "N05CF"
    ]
  },
  {
    "id": "r6",
    "code": "R6",
    "groupe": "Système nerveux",
    "titre": "Antipsychotiques",
    "sous": "Le Haldol qui interdit tout allongeur de QT, la quétiapine qui refuse la clarithromycine, la clozapine et ses prises de sang non négociables — et le café qui devient une interaction",
    "volet": "rx",
    "atc": [
      "N05A"
    ]
  },
  {
    "id": "r7",
    "code": "R7",
    "groupe": "Douleur",
    "titre": "Opioïdes et antalgiques de palier",
    "sous": "Du tramadol qui convulse au patch qui craint la fièvre : trois régimes légaux différents, une même règle d'or — jamais avec une benzodiazépine sans surveillance",
    "volet": "rx",
    "atc": [
      "N02A",
      "N02B"
    ]
  },
  {
    "id": "r8",
    "code": "R8",
    "groupe": "Cardiovasculaire",
    "titre": "IEC, sartans et diurétiques",
    "sous": "La triade rénale qui se joue au rayon AINS, le potassium qui monte par trois portes, l'HCT qui impose la crème solaire — et la grossesse en contre-indication partout",
    "volet": "rx",
    "atc": [
      "C09A",
      "C09B",
      "C09C",
      "C09D",
      "C03"
    ]
  },
  {
    "id": "r9",
    "code": "R9",
    "groupe": "Cardiovasculaire",
    "titre": "Bêtabloquants et antiarythmiques",
    "sous": "Le bêtabloquant qui ne s'arrête jamais d'un coup, l'amiodarone qui dérègle la thyroïde et craint le soleil, le sotalol aux quinze contre-indications — et le pouls comme premier réflexe",
    "volet": "rx",
    "atc": [
      "C07",
      "C01A",
      "C01B"
    ]
  },
  {
    "id": "f1",
    "code": "1",
    "groupe": "Voies respiratoires hautes",
    "titre": "Rhume / rhinopharyngite",
    "sous": "Infection virale bénigne des voies aériennes supérieures — le motif le plus fréquent du comptoir d'hiver",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f2",
    "code": "2",
    "groupe": "Voies respiratoires hautes",
    "titre": "Nez : rhinite médicamenteuse, sécheresse nasale, épistaxis",
    "sous": "Trois motifs liés — le vasoconstricteur qui dure, la muqueuse sèche d'hiver, le nez qui saigne. Souvent le même patient.",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (mométasone nasale) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f3",
    "code": "3",
    "groupe": "Voies respiratoires hautes",
    "titre": "Mal de gorge : pharyngite, angine à strep A, scarlatine",
    "sous": "La grande majorité est virale — le travail du comptoir est de repérer la minorité qui ne l'est pas",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f4",
    "code": "4",
    "groupe": "Voies respiratoires hautes",
    "titre": "Sinusite aiguë",
    "sous": "Rhino-sinusite : presque toujours virale, presque jamais un antibiotique — le comptoir gère l'attente vigilante",
    "volet": "otc",
    "remise": "Cette fiche cite des produits de <span class='cat cat-B'>B</span> (Dafalgan, mométasone) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f5",
    "code": "5",
    "groupe": "Voies respiratoires hautes",
    "titre": "Otite / otalgie",
    "sous": "Surtout l'enfant après un rhume — l'antalgie pour tous, l'antibiotique qui attend, et l'oreille qui coule qui n'attend pas",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2.",
    "atc": [
      "S02"
    ]
  },
  {
    "id": "f6",
    "code": "6",
    "groupe": "Voies respiratoires hautes",
    "titre": "Laryngite et faux-croup",
    "sous": "La toux qui aboie à minuit chez le petit, la voix qui casse chez l'adulte — peu de médicaments, beaucoup de gestes et un triage précis",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f7",
    "code": "7",
    "groupe": "Voies respiratoires basses",
    "titre": "Toux sèche / toux grasse",
    "sous": "Le rayon le plus demandé et le moins efficace de l'officine — vendre honnête, refuser juste, réorienter à temps",
    "volet": "otc",
    "remise": "Cette fiche cite des produits de <span class='cat cat-B'>B</span> (Codicalm, Bexine DXM) : remise par le pharmacien en personne, patient présent, documentation — voir fiches T1 et T2.",
    "atc": [
      "R05"
    ]
  },
  {
    "id": "f8",
    "code": "8",
    "groupe": "Voies respiratoires basses",
    "titre": "Bronchite aiguë",
    "sous": "Presque toujours virale, guérit seule en une dizaine de jours — le vrai travail : repérer ce qui n'est pas une bronchite",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f9",
    "code": "9",
    "groupe": "Voies respiratoires basses",
    "titre": "Bronchiolite et VRS du nourrisson",
    "sous": "La fiche où l'on ne vend presque rien : lavage de nez, surveillance armée, et un rayon toux fermé pour cet âge",
    "volet": "otc"
  },
  {
    "id": "f10",
    "code": "10",
    "groupe": "Voies respiratoires basses",
    "titre": "Toux traînante : coqueluche, mycoplasme",
    "sous": "La toux qui dépasse les trois semaines n'est plus un motif de sirop — c'est un motif de diagnostic",
    "volet": "otc"
  },
  {
    "id": "f11",
    "code": "11",
    "groupe": "Voies respiratoires basses",
    "titre": "Asthme et BPCO : exacerbation, technique d'inhalation",
    "sous": "Le patient à terrain obstructif qui vient « pour un rhume » — repérer la déstabilisation, dépanner le Ventolin dans les règles, verrouiller les produits qui aggravent",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Ventolin) : remise sans ordonnance possible en <b>poursuite de traitement</b> (art. 45 al. 1 let. b OMéd) — en personne, documentée, mode de prescription d'origine consigné. Voir fiches T1 et T2.",
    "atc": [
      "R03"
    ]
  },
  {
    "id": "f12",
    "code": "12",
    "groupe": "Voies respiratoires basses",
    "titre": "Grippe",
    "sous": "Le syndrome grippal au comptoir : symptomatique pour les uns, fenêtre de 48 h chez le médecin pour les autres — et la vaccination comme prestation d'officine",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2.",
    "atc": [
      "J05AH"
    ]
  },
  {
    "id": "f13",
    "code": "13",
    "groupe": "Voies respiratoires basses",
    "titre": "COVID-19",
    "sous": "Phase endémique : trier vite les patients à risque vers le test et l'antiviral, soigner les autres comme une IVRS — et tenir la campagne vaccinale d'automne",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f14",
    "code": "14",
    "groupe": "Fièvre, douleur, digestif",
    "titre": "Fièvre et douleur, adulte",
    "sous": "La mécanique commune à la moitié des fiches : trois molécules de palier 1, trois jours d'automédication, et les terrains qui décident du choix",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Dafalgan) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2.",
    "atc": [
      "N02B",
      "M01A"
    ]
  },
  {
    "id": "f15",
    "code": "15",
    "groupe": "Fièvre, douleur, digestif",
    "titre": "Fièvre et douleur, enfant",
    "sous": "Doses au poids, séquence antipyrétique raisonnée, convulsion fébrile expliquée — et pas d'aspirine, jamais",
    "volet": "otc",
    "remise": "Cette fiche cite un produit de <span class='cat cat-B'>B</span> (Algifor Junior) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2."
  },
  {
    "id": "f16",
    "code": "16",
    "groupe": "Fièvre, douleur, digestif",
    "titre": "Gastro-entérite, déshydratation, SRO",
    "sous": "Le traitement tient dans un sachet à 200 ml — le triage tient dans trois questions : du sang, des larmes, des urines",
    "volet": "otc",
    "atc": [
      "A07"
    ]
  },
  {
    "id": "f17",
    "code": "17",
    "groupe": "Peau et muqueuses",
    "titre": "Peau et froid",
    "sous": "Xérose, crevasses, engelures — et la seule vraie urgence du rayon : la gelure qu'on ne doit surtout pas frictionner",
    "volet": "otc"
  },
  {
    "id": "f18",
    "code": "18",
    "groupe": "Peau et muqueuses",
    "titre": "Herpès labial et aphtes",
    "sous": "Deux lésions banales de la bouche — l'une contagieuse, l'autre pas — et quatre situations qui quittent le comptoir : l'œil, le nouveau-né, l'immunodéprimé, l'aphte qui n'en est pas un",
    "volet": "otc",
    "atc": [
      "D06BB",
      "A01AB"
    ]
  },
  {
    "id": "f19",
    "code": "19",
    "groupe": "Peau et muqueuses",
    "titre": "Yeux : conjonctivite, sécheresse",
    "sous": "Petit périmètre, grands red flags — l'œil est le territoire où le comptoir gagne surtout en sachant dire non",
    "volet": "otc",
    "atc": [
      "S01"
    ]
  },
  {
    "id": "f20",
    "code": "20",
    "groupe": "Peau et muqueuses",
    "titre": "Poux, verrues, mycoses des pieds",
    "sous": "Le trio des vestiaires et de la rentrée — trois motifs à 90 % comptoir, avec un interdit commun : le pied du diabétique",
    "volet": "otc",
    "atc": [
      "P03A",
      "D01A"
    ]
  },
  {
    "id": "f21",
    "code": "21",
    "groupe": "Peau et muqueuses",
    "titre": "Allergies intérieures et pollens précoces",
    "sous": "L'hiver n'est pas une trêve : les acariens flambent au chauffage, l'aulne pollinise déjà à Noël, le noisetier suit en janvier",
    "volet": "otc",
    "remise": "Cette fiche cite des produits de <span class='cat cat-B'>B</span> (certaines présentations de cétirizine, mométasone) : remise par le pharmacien en personne, documentation — voir fiches T1 et T2.",
    "atc": [
      "R01A",
      "R06A"
    ]
  }
];
