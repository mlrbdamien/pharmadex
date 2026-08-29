#!/usr/bin/env python3
"""Import de la Liste des spécialités (OFSP) — dénominations françaises et prix.

Swissmedic ne publie sa liste des emballages qu'en allemand. L'OFSP publie sa
Liste des spécialités (médicaments remboursés) dans un classeur TRILINGUE :
la feuille « Données de base » porte les dénominations et formes galéniques
françaises officielles — y compris pour les marques (« Pregabalin Spirig HC »
devient « Prégabaline Spirig HC »).

Couverture : les seuls médicaments remboursés, soit ~54 % de la liste
Swissmedic. Le reste garde la traduction par table (scripts/formes_fr.py).
La jointure se fait par GTIN.

Le nom du fichier porte sa date de publication et l'API de découverte exige
une authentification : on sonde donc les dates à rebours depuis aujourd'hui.

Usage :
  python3 scripts/import_sl.py --dry-run
  python3 scripts/import_sl.py --out-dir /tmp/import
"""

from __future__ import annotations

import argparse
import csv
import datetime
import io
import sys
import urllib.error
import urllib.request
from pathlib import Path

import openpyxl

BASE = "https://epl.bag.admin.ch/static/sl/publication/excel/foph-sl-publication"
FEUILLE_FR = "Données de base"
JOURS_SONDES = 75
# Le serveur refuse les requêtes sans User-Agent (403).
ENTETES = {"User-Agent": "Pharmadex/1.0 (+outil interne d'officine)"}

# Colonnes de la feuille française (position vérifiée sur la publication
# 2026-08-13 ; l'en-tête est relu à chaque import pour détecter un décalage).
COLONNES = {
    "Nom de spécialité": "nom",
    "Forme gal./dosage": "forme",
    "Emballage": "emballage",
    "GTIN": "gtin",
    "Prix public actuel": "prix",
}


def trouver_publication(depuis: datetime.date) -> tuple[str, datetime.date]:
    """Sonde les dates à rebours et renvoie l'URL de la publication courante."""
    for i in range(JOURS_SONDES):
        jour = depuis - datetime.timedelta(days=i)
        url = f"{BASE}-{jour:%Y%m%d}-fr.xlsx"
        requete = urllib.request.Request(url, method="HEAD", headers=ENTETES)
        try:
            with urllib.request.urlopen(requete, timeout=30) as reponse:
                if reponse.status == 200:
                    return url, jour
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
            continue
    raise SystemExit(
        f"Aucune publication trouvée sur {JOURS_SONDES} jours — "
        "le format du nom de fichier a peut-être changé."
    )


def lire(url: str) -> list[dict]:
    with urllib.request.urlopen(
        urllib.request.Request(url, headers=ENTETES), timeout=300
    ) as reponse:
        classeur = io.BytesIO(reponse.read())

    wb = openpyxl.load_workbook(classeur, read_only=True, data_only=True)
    if FEUILLE_FR not in wb.sheetnames:
        raise SystemExit(f"Feuille « {FEUILLE_FR} » absente — feuilles : {wb.sheetnames}")

    lignes = wb[FEUILLE_FR].iter_rows(values_only=True)
    entete = [str(c).strip() if c else "" for c in next(lignes)]
    index = {}
    for libelle, champ in COLONNES.items():
        if libelle not in entete:
            raise SystemExit(f"Colonne « {libelle} » absente — en-tête : {entete[:8]}")
        index[champ] = entete.index(libelle)

    resultats: dict[str, dict] = {}
    for ligne in lignes:
        gtin = str(ligne[index["gtin"]] or "").strip()
        if len(gtin) != 13 or not gtin.isdigit():
            continue
        nom = str(ligne[index["nom"]] or "").strip()
        forme = str(ligne[index["forme"]] or "").strip()
        if not nom:
            continue
        prix = ligne[index["prix"]]
        resultats[gtin] = {
            "gtin": gtin,
            # « 3TC » + « cpr pell 150 mg » → « 3TC, cpr pell 150 mg », de même
            # structure que les noms Swissmedic (marque, virgule, forme).
            "name_fr": f"{nom}, {forme}" if forme else nom,
            "description_fr": str(ligne[index["emballage"]] or "").strip(),
            "price_public": f"{float(prix):.2f}" if isinstance(prix, (int, float)) else "",
        }
    return list(resultats.values())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", type=Path, default=Path("."))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    url, jour = trouver_publication(datetime.date.today())
    print(f"publication du {jour:%d.%m.%Y} : {url}", file=sys.stderr)

    lignes = lire(url)
    print(f"{len(lignes)} emballages remboursés, avec dénomination française", file=sys.stderr)

    if args.dry_run:
        for ligne in lignes[:5]:
            print(f"  {ligne['gtin']}  {ligne['name_fr'][:52]:<52} "
                  f"{ligne['description_fr'][:14]:<14} {ligne['price_public']}")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    chemin = args.out_dir / "sl_fr.csv"
    with chemin.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["gtin", "name_fr", "description_fr", "price_public"])
        writer.writeheader()
        writer.writerows(lignes)
    print(f"écrit : {chemin}", file=sys.stderr)


if __name__ == "__main__":
    main()
