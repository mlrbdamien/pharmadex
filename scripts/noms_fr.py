#!/usr/bin/env python3
"""Rattache les dénominations françaises officielles aux DOSAGES.

Refdata et la Liste des spécialités (OFSP) nomment chaque article par son
GTIN : « DAFALGAN supp 300 mg ». Le GTIN désigne un emballage, l'emballage un
dosage — le nom français se rattache donc au dosage, jamais à l'autorisation.
C'était l'erreur du chargement précédent : il gardait, par autorisation, le
plus court des noms français, c'est-à-dire celui du dosage aux plus petits
chiffres (80 mg bat 300 mg d'un caractère).

Entrées  : products.csv, dosages.csv, packages.csv (import_products.py),
           refdata_fr.csv (import_refdata.py), sl_fr.csv (import_sl.py).
Sorties  : products.csv et dosages.csv réécrits, avec name_fr et fr_source.
Priorité : refdata > sl > table (la traduction par table de formes_fr).

Usage : python3 scripts/noms_fr.py --dir /tmp/import
"""

from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path

from libelles import libelle_commun, libelle_dosage


def lire(chemin: Path) -> list[dict]:
    if not chemin.exists():
        return []
    with chemin.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def ecrire(chemin: Path, lignes: list[dict], champs: list[str]) -> None:
    with chemin.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=champs)
        w.writeheader()
        for l in lignes:
            w.writerow({k: l.get(k, "") for k in champs})


_NOMBRE = re.compile(r"\d+(?:[.,]\d+)?")


def _sans_milliers(texte: str) -> str:
    """« 10'000 » → « 10000 » : l'apostrophe suisse des milliers coupait le
    nombre en deux (10 et 000), et Creon 10'000 ne se reconnaissait plus dans
    « Creon 10000 »."""
    return re.sub(r"(?<=\d)['’](?=\d{3})", "", texte)


def _nombres(texte: str) -> set[float]:
    return {float(n.replace(",", ".")) for n in _NOMBRE.findall(_sans_milliers(texte))}


def garde_la_dose(nom_fr: str, puce: str) -> bool:
    """Un nom français n'est retenu pour un dosage que s'il porte la dose que
    Swissmedic donne à ce dosage (le nombre qui ouvre sa puce).

    >>> garde_la_dose("DAFALGAN supp 300 mg", "300 mg")
    True
    >>> garde_la_dose("XANAX cpr 0.25 mg", "0,25 mg")
    True
    >>> garde_la_dose("XYZ cpr", "400 mg")
    False
    >>> garde_la_dose("MYDOCALM cpr pell", "mite")
    True
    >>> garde_la_dose("Creon 10000, caps", "10'000")
    True

    Indépendant de toute expression régulière d'élagage : quelle que soit la
    façon dont un nom a perdu sa dose, il ne passe pas. Une puce sans nombre
    (« mite ») n'a rien à vérifier.
    """
    m = _NOMBRE.match(_sans_milliers(puce or ""))
    if not m:
        return True
    return float(m.group(0).replace(",", ".")) in _nombres(nom_fr)


def noms_par_dosage(source, dosage_du_gtin, dosages):
    """GTIN → nom français, regroupé par dosage. Un dosage a plusieurs
    emballages ; leurs noms ne diffèrent que par la taille, retirée par
    l'import (« 30 pce »). Le plus court puis l'ordre alphabétique : un choix
    DÉTERMINISTE, pour que le nom ne change pas au hasard d'un import à
    l'autre — parmi les seuls noms qui gardent la dose du dosage."""
    candidats: dict[tuple[str, str], list[str]] = {}
    for ligne in source:
        cle = dosage_du_gtin.get(ligne["gtin"])
        nom = (ligne.get("name_fr") or "").strip()
        if cle and nom:
            candidats.setdefault(cle, []).append(nom)
    retenus: dict[tuple[str, str], str] = {}
    for cle, noms in candidats.items():
        puce = dosages[cle].get("label", "") if cle in dosages else ""
        valides = [n for n in noms if garde_la_dose(n, puce)]
        if valides:
            retenus[cle] = sorted(valides, key=lambda n: (len(n), n))[0]
    return retenus


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", type=Path, required=True)
    d = ap.parse_args().dir

    products = {p["authorization_nr"]: p for p in lire(d / "products.csv")}
    dosages = {(x["authorization_nr"], x["dosage_nr"]): x for x in lire(d / "dosages.csv")}
    packages = lire(d / "packages.csv")
    dosage_du_gtin = {k["gtin"]: (k["authorization_nr"], k["dosage_nr"]) for k in packages}

    refdata = noms_par_dosage(lire(d / "refdata_fr.csv"), dosage_du_gtin, dosages)
    sl = noms_par_dosage(lire(d / "sl_fr.csv"), dosage_du_gtin, dosages)

    for cle, x in dosages.items():
        if cle in refdata:
            x["name_fr"], x["fr_source"] = refdata[cle], "refdata"
        elif cle in sl:
            x["name_fr"], x["fr_source"] = sl[cle], "sl"
        else:
            x["name_fr"], x["fr_source"] = "", "table"

    par_autorisation: dict[str, list[dict]] = {}
    for x in dosages.values():
        par_autorisation.setdefault(x["authorization_nr"], []).append(x)

    # Deux dosages que Swissmedic DISTINGUE ne peuvent pas porter le même nom
    # français. Vitamine D3 Streuli : « Prophylax » (catégorie D) et « zur
    # Therapie » (catégorie B) recevaient tous deux « Vitamine D3 Streuli sol
    # buvable » — deux résultats identiques, de catégories différentes. On
    # retombe alors sur le nom Swissmedic traduit, qui les sépare.
    for groupe in par_autorisation.values():
        par_nom: dict[str, list[dict]] = {}
        for x in groupe:
            if x["name_fr"]:
                par_nom.setdefault(x["name_fr"], []).append(x)
        for memes in par_nom.values():
            if len(memes) > 1 and len({m["name"] for m in memes}) > 1:
                for m in memes:
                    m["name_fr"], m["fr_source"] = "", "table"

    for auth, groupe in par_autorisation.items():
        p = products[auth]
        officiels = [x["name_fr"] for x in groupe if x["name_fr"]]
        commun_fr = libelle_commun(officiels) if officiels else ""
        # Le libellé officiel de l'autorisation n'a de sens que tiré de TOUS
        # ses dosages — tiré d'un seul, il porterait son dosage (« … 80 mg »).
        # Et seulement s'il dit au moins autant que le tronc Swissmedic : les
        # noms OFSP placent le dosage AVANT la forme (« Dafalgan 80, supp »),
        # si bien que leur tronc commun tombe à « Dafalgan » quand Swissmedic
        # donne « Dafalgan, suppositoires ». Le plus riche l'emporte.
        # Et jamais, pour une autorisation à plusieurs dosages, le nom ENTIER de
        # l'un d'eux : sans mot commun (« Quétiapine-Mepha » d'un côté,
        # « Quetiapin-Mepha » de l'autre chez Refdata), libelle_commun rend
        # une chaîne vide — on garde alors le tronc Swissmedic.
        un_seul_dosage = len(groupe) > 1 and (not commun_fr or commun_fr in officiels)
        if (len(officiels) == len(groupe) and not un_seul_dosage
                and len(commun_fr.split()) >= len(p["name"].split())):
            p["name_fr"] = commun_fr
            p["fr_source"] = "refdata" if {x["fr_source"] for x in groupe} == {"refdata"} else "sl"
        else:
            p["name_fr"], p["fr_source"] = "", "table"

        if len(groupe) > 1 and len(officiels) == len(groupe) and commun_fr:
            for x in groupe:
                # Une puce Swissmedic qui commence par un chiffre (« 80 mg »)
                # est neutre en langue et porte son unité : on la garde. Sinon
                # elle contient une forme, souvent restée en allemand, et la
                # version tirée du nom français est meilleure.
                if not re.match(r"\d", x["label"]):
                    x["label"] = libelle_dosage(x["name_fr"], commun_fr)
            puces = [x["label"] for x in groupe]
            for x in groupe:
                if puces.count(x["label"]) > 1:
                    x["label"] = f"dosage {x['dosage_nr']}"

    # Ce que le filtre du catalogue doit voir : le catalogue liste des
    # autorisations, mais on y tape un dosage (« dafalgan 80 »).
    for auth, groupe in par_autorisation.items():
        morceaux: list[str] = []
        for x in groupe:
            for m in (x["name"], x["name_fr"], x["label"]):
                if m and m not in morceaux:
                    morceaux.append(m)
        products[auth]["noms_dosages"] = " | ".join(morceaux)

    ecrire(d / "products.csv", list(products.values()),
           ["authorization_nr", "name", "name_fr", "fr_source", "company", "atc_code",
            "substances", "category", "noms_dosages"])
    ecrire(d / "dosages.csv", list(dosages.values()),
           ["authorization_nr", "dosage_nr", "name", "name_fr", "fr_source", "label", "substances", "category"])

    n = len(dosages)
    f = {s: sum(1 for x in dosages.values() if x["fr_source"] == s) for s in ("refdata", "sl", "table")}
    print(f"{n} dosages · nom officiel : Refdata {f['refdata']} · OFSP {f['sl']} · table {f['table']}")
    print(f"{len(products)} autorisations · libellé officiel : "
          f"{sum(1 for p in products.values() if p['name_fr'])}")


if __name__ == "__main__":
    import sys

    if "--test" in sys.argv:
        import doctest

        echecs, total = doctest.testmod()
        print(f"{total - echecs}/{total} exemples vérifiés")
        sys.exit(1 if echecs else 0)
    main()
