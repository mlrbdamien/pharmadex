"""Traduction allemand → français des données Swissmedic.

Swissmedic ne publie sa liste des emballages qu'en allemand (les en-têtes sont
bilingues, les données non). Pharmadex étant destiné à une officine
francophone, l'import traduit les deux champs qui portent de l'allemand :

- le suffixe de forme pharmaceutique du nom (après la dernière virgule) ;
- la description d'emballage (« 50 Tablette(n) »).

La table suit la terminologie officielle (Standard Terms / termes attestés
dans le fichier même pour les produits enregistrés en français). Ce qui n'y
figure pas reste en allemand — le résumé d'import compte ces restes, la table
se complète au fil des mois. Déterministe et relu en revue de code : aucun
service de traduction, aucun aléa.

Les noms de marque, substances (latin) et titulaires ne sont jamais touchés.
"""

from __future__ import annotations

import re

# ---------------------------------------------------------------------------
# Formes pharmaceutiques — correspondance exacte sur le suffixe complet,
# insensible à la casse. Ordonnée par fréquence décroissante dans la liste
# de juillet 2026 (les ~150 premières couvrent ~85 % des produits).
# ---------------------------------------------------------------------------
FORMES: dict[str, str] = {
    "Filmtabletten": "comprimés pelliculés",
    "Filmtablette": "comprimé pelliculé",
    "Tabletten": "comprimés",
    "Tablette": "comprimé",
    "Injektionslösung": "solution injectable",
    "Kapseln": "capsules",
    "Pricktestlösung": "solution pour prick-test",
    "Konzentrat zur Herstellung einer Infusionslösung": "solution à diluer pour perfusion",
    "Hartkapseln": "gélules",
    "Tropfen zum Einnehmen": "gouttes buvables",
    "Retardtabletten": "comprimés retard",
    "Infusionslösung": "solution pour perfusion",
    "Injektionslösung in einer Fertigspritze": "solution injectable en seringue préremplie",
    "Injektionslösung in Fertigspritze": "solution injectable en seringue préremplie",
    "Augentropfen": "collyre",
    "Pulver für ein Konzentrat zur Herstellung einer Infusionslösung":
        "poudre pour solution à diluer pour perfusion",
    "Lösung": "solution",
    "Salbe": "pommade",
    "Arzneitee": "tisane",
    "Globuli": "globules",
    "Sirup": "sirop",
    "Weichkapseln": "capsules molles",
    "Injektionslösung im Fertigpen": "solution injectable en stylo prérempli",
    "Pulver und Lösungsmittel zur Herstellung einer Injektionslösung":
        "poudre et solvant pour solution injectable",
    "Injektionssuspension": "suspension injectable",
    "Lutschtabletten": "comprimés à sucer",
    "Lösung zum Einnehmen": "solution buvable",
    "Schmelztabletten": "comprimés orodispersibles",
    "Suspension": "suspension",
    "Pulver zur Herstellung einer Infusionslösung": "poudre pour solution pour perfusion",
    "Brausetabletten": "comprimés effervescents",
    "Injektions-/Infusionslösung": "solution injectable/pour perfusion",
    "Pulver zur Herstellung einer Lösung zum Einnehmen": "poudre pour solution buvable",
    "Spray zur Anwendung in der Mundhöhle": "spray buccal",
    "Suppositorien": "suppositoires",
    "Zäpfchen": "suppositoires",
    "Granulat": "granulés",
    "Pulver zur Herstellung einer Suspension zum Einnehmen": "poudre pour suspension buvable",
    "Kautabletten": "comprimés à croquer",
    "Suspension zum Einnehmen": "suspension buvable",
    "magensaftresistente Tabletten": "comprimés gastro-résistants",
    "magensaftresistente Tablette": "comprimé gastro-résistant",
    "magensaftresistente Hartkapseln": "gélules gastro-résistantes",
    "magensaftresistente Filmtabletten": "comprimés pelliculés gastro-résistants",
    "Lösung zur Anwendung auf der Haut": "solution cutanée",
    "Pulver zur Herstellung einer Injektionslösung": "poudre pour solution injectable",
    "Nasenspray": "spray nasal",
    "Pulver zur Herstellung einer Injektions-/Infusionslösung":
        "poudre pour solution injectable/pour perfusion",
    "Retardkapseln": "capsules retard",
    "Augensalbe": "pommade ophtalmique",
    "Augentropfensuspension": "collyre en suspension",
    "Emulsion zur Anwendung auf der Haut": "émulsion cutanée",
    "Tropfen": "gouttes",
    "Lutschpastillen": "pastilles à sucer",
    "Pastillen": "pastilles",
    "dispergierbare Tabletten": "comprimés dispersibles",
    "Granulat zur Herstellung einer Lösung zum Einnehmen": "granulés pour solution buvable",
    "Granulat zur Herstellung einer Suspension zum Einnehmen": "granulés pour suspension buvable",
    "Tropfen zum Einnehmen und Einreiben": "gouttes buvables et pour friction",
    "Injektionssuspension in einer Fertigspritze": "suspension injectable en seringue préremplie",
    "Pulver und Lösungsmittel zur Herstellung einer Injektions-/Infusionslösung":
        "poudre et solvant pour solution injectable/pour perfusion",
    "Pulver": "poudre",
    "Shampoo": "shampooing",
    "Spray": "spray",
    "Dosier-Aerosol": "aérosol doseur",
    "Vaginaltabletten": "comprimés vaginaux",
    "Infusionskonzentrat": "solution à diluer pour perfusion",
    "transdermales Pflaster": "patch transdermique",
    "Transdermales Pflaster": "patch transdermique",
    "wirkstoffhaltiges Pflaster": "emplâtre médicamenteux",
    "Infusionsemulsion": "émulsion pour perfusion",
    "Sublingualtabletten": "comprimés sublinguaux",
    "Peritonealdialyselösung": "solution pour dialyse péritonéale",
    "Emulsion zur Infusion": "émulsion pour perfusion",
    "Augengel": "gel ophtalmique",
    "Lyophilisat": "lyophilisat",
    "überzogene Tabletten": "comprimés enrobés",
    "Pulver zur Inhalation": "poudre pour inhalation",
    "Tabletten zur Herstellung einer Suspension zum Einnehmen":
        "comprimés pour suspension buvable",
    "Depot-Injektionssuspension": "suspension injectable dépôt",
    "Depot-Injektionssuspension in einer Fertigspritze":
        "suspension injectable dépôt en seringue préremplie",
    "Spray zur Anwendung auf der Haut": "spray cutané",
    "Injektionspräparat": "préparation injectable",
    "Kaugummi": "gomme à mâcher",
    "Halspastillen": "pastilles pour la gorge",
    "Ovula": "ovules",
    "Vaginalovula": "ovules vaginaux",
    "Vaginalcreme": "crème vaginale",
    "Vaginalgel": "gel vaginal",
    "Nasensalbe": "pommade nasale",
    "Nasentropfen": "gouttes nasales",
    "Ohrentropfen": "gouttes auriculaires",
    "Gurgellösung": "solution pour gargarisme",
    "Mundspüllösung": "solution pour bain de bouche",
    "Inhalationslösung": "solution pour inhalation",
    "Lösung zur Inhalation": "solution pour inhalation",
    "Suspension zur Inhalation": "suspension pour inhalation",
    "Badezusatz": "additif pour le bain",
    "Wundgaze": "gaze imprégnée",
    "Instillation": "instillation",
    "Klistier": "lavement",
    "Rektalgel": "gel rectal",
    "Rektalschaum": "mousse rectale",
    "Urethralgel": "gel urétral",
    "Paste": "pâte",
    "Mundgel": "gel buccal",
    "Hustensirup": "sirop contre la toux",
    "Brausegranulat": "granulés effervescents",
    "Retard-Filmtabletten": "comprimés pelliculés retard",
    "Kaudragées": "dragées à croquer",
    "Trinkampullen": "ampoules buvables",
    "Trinklösung": "solution buvable",
    "Injektionsemulsion": "émulsion injectable",
    "Fertigspritze": "seringue préremplie",
    "Fertigspritzen": "seringues préremplies",
    "Wirkstoffhaltiges Pflaster": "emplâtre médicamenteux",
    "Creme": "crème",
    "Gel": "gel",
    "Liniment": "liniment",
    "Emulsion": "émulsion",
    "Tinktur": "teinture",
    "Puder": "poudre pour application cutanée",
    "Kondensat": "condensat",
    "Essenz": "essence",
    "Elixier": "élixir",
    "Sirupus": "sirop",
    "Lacktabletten": "comprimés laqués",
    "Manteltabletten": "comprimés à enrobage",
    "Depottabletten": "comprimés dépôt",
    "Duotabletten": "comprimés duo",
    "Divitabletten": "comprimés divisibles",
    "Lösung oral": "solution buvable",
    "Lösung oral / rektal": "solution buvable / rectale",
    "Injektionslösung (s.c.)": "solution injectable (s.c.)",
    "Injektionslösung s.c.": "solution injectable s.c.",
    "Injektionslösung zur i.v. Applikation": "solution injectable pour application i.v.",
    "Markierungsbesteck": "nécessaire de marquage",
    "Tabletten mit veränderter Wirkstofffreisetzung": "comprimés à libération modifiée",
    "Injektionslösung in einem Fertigpen": "solution injectable en stylo prérempli",
    "Pulver zur Herstellung einer Injektionssuspension": "poudre pour suspension injectable",
    "Rektalsalbe": "pommade rectale",
    "Lösung zur Anwendung in der Mundhöhle": "solution buccale",
    "Hartkapseln mit Pulver zur Inhalation": "gélules avec poudre pour inhalation",
    "Intrauterines Wirkstofffreisetzungssystem": "système de diffusion intra-utérin",
    "Pulver zur Herstellung einer Infusionsdispersion": "poudre pour dispersion pour perfusion",
    "Dispersion zur Injektion/Infusion": "dispersion injectable/pour perfusion",
    "Pulver und Suspension zur Herstellung einer Injektionssuspension":
        "poudre et suspension pour suspension injectable",
    "Pulver und Lösungsmittel zur Herstellung einer Infusionslösung":
        "poudre et solvant pour solution pour perfusion",
}

# Retouches d'appoint appliquées APRÈS la table, pour les segments qui
# s'accrochent aux formes composées (« … zur i.v. Applikation »).
_RETOUCHES: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bzur i\.?\s?v\.?\s?Applikation\b", re.I), "pour application i.v."),
    (re.compile(r"\bzur intravenösen Anwendung\b", re.I), "pour voie intraveineuse"),
    (re.compile(r"\bzum Einnehmen\b", re.I), "par voie orale"),
    (re.compile(r"\bzur Anwendung auf der Haut\b", re.I), "pour application cutanée"),
]

_FORMES_FOLD = {k.lower(): v for k, v in FORMES.items()}
_FORMES_TRI = sorted(FORMES.items(), key=lambda kv: -len(kv[0]))


def traduire_nom(name: str) -> str:
    """Traduit le suffixe de forme d'un nom de produit, marque intacte."""
    if "," not in name:
        return name
    marque, suffixe = name.rsplit(",", 1)
    suffixe = suffixe.strip()
    traduit = _FORMES_FOLD.get(suffixe.lower())
    if traduit is None:
        # Repli : les entrées de la table, appliquées en sous-chaînes de la
        # plus longue à la plus courte, puis les retouches. « Injektionslösung
        # zur Behandlung von X » devient au moins « solution injectable … ».
        traduit = suffixe
        for de, fr in _FORMES_TRI:
            traduit = re.sub(re.escape(de), fr, traduit, flags=re.I)
        for motif, remplacement in _RETOUCHES:
            traduit = motif.sub(remplacement, traduit)
    return f"{marque}, {traduit}"


def forme_non_traduite(name: str) -> str | None:
    """Le suffixe resté en allemand, pour le décompte du résumé d'import."""
    if "," not in name:
        return None
    suffixe = name.rsplit(",", 1)[1].strip()
    if suffixe.lower() in _FORMES_FOLD:
        return None
    reste = suffixe
    for motif, _ in _RETOUCHES:
        reste = motif.sub("", reste)
    # Heuristique : s'il reste un mot typiquement allemand, c'est non traduit.
    if re.search(r"(?:ung|ösung|etten|apseln|ulver|albe|äfte|zur |einer )", reste):
        return suffixe
    return None


# ---------------------------------------------------------------------------
# Unités d'emballage — remplacement mot à mot dans la description
# (« 5 x 3 ml Durchstechflasche(n) » → « 5 x 3 ml flacon(s) »).
# ---------------------------------------------------------------------------
UNITES: dict[str, str] = {
    "Tablette(n)": "comprimé(s)",
    "Tabletten": "comprimés",
    "Kapsel(n)": "capsule(s)",
    "Durchstechflasche(n)": "flacon(s)",
    "Ampulle(n)": "ampoule(s)",
    "Fertigspritze(n)": "seringue(s) préremplie(s)",
    "Spritze(n)": "seringue(s)",
    "Stück": "pièce(s)",
    "Pflaster": "patch(s)",
    "Beutel": "sachet(s)",
    "Flasche(n)": "flacon(s)",
    "Suppositorien": "suppositoires",
    "Dragée(s)": "dragée(s)",
    "Einzeldose(n)": "unidose(s)",
    "Kombipackung(en)": "emballage(s) combiné(s)",
    "Inhalationen": "inhalations",
    "Inhalation(en)": "inhalation(s)",
    "Injektor(en), vorgefüllt/Pen": "injecteur(s) prérempli(s)/stylo",
    "Injektor(en)": "injecteur(s)",
    "Tube(n)": "tube(s)",
    "Dosen": "doses",
    "Dosis": "dose",
    "Sprühstösse": "pulvérisations",
    "Sprühstoss": "pulvérisation",
    "Applikator(en)": "applicateur(s)",
    "Ovula": "ovules",
    "Lutschtabletten": "comprimés à sucer",
    "Pastillen": "pastilles",
    "Bogen": "feuille(s)",
    "Set(s)": "set(s)",
    "Packung(en)": "emballage(s)",
    "vorgefüllt": "prérempli",
    "Zylinderampulle(n)": "cartouche(s)",
    "Patrone(n)": "cartouche(s)",
    "Stift(e)": "stylo(s)",
    "Pen(s)": "stylo(s)",
    "Kaugummi(s)": "gomme(s) à mâcher",
    "Wochen": "semaines",
    "Monatspackung": "boîte d'un mois",
    # Singuliers, pour les descriptions rédigées (« 1 Durchstechflasche mit Pulver »)
    "Durchstechflasche": "flacon",
    "Ampulle": "ampoule",
    "Kapsel": "capsule",
    "Flasche": "flacon",
    "Fertigspritze": "seringue préremplie",
    "mit Pulver": "avec poudre",
    "mit Lösungsmittel": "avec solvant",
}

_UNITES_TRI = sorted(UNITES.items(), key=lambda kv: -len(kv[0]))


def traduire_emballage(description: str) -> str:
    """« 5 x 3 ml Durchstechflasche(n) » → « 5 x 3 ml flacon(s) »."""
    resultat = description
    for de, fr in _UNITES_TRI:
        resultat = resultat.replace(de, fr)
    return resultat
