#!/usr/bin/env python3
"""Import des dénominations françaises officielles (Refdatabase-articles).

Refdata publie chaque nuit le fichier des articles suisses, avec le nom
officiel de chaque emballage dans les QUATRE langues nationales. C'est la
source de référence pour une officine francophone : Swissmedic ne publie
qu'en allemand, et la Liste des spécialités ne couvre que les remboursés.

Couverture : ~79 % de nos emballages. Le reste garde la Liste des spécialités
puis, à défaut, la traduction par table (scripts/formes_fr.py).

Deux fichiers dans l'archive :
  - Refdata.Articles.xml            articles commercialisés
  - Refdata.Articles.Zugelassen.xml articles autorisés (sur-ensemble)
On lit les deux, le second complétant le premier.

Le Pharmacode N'EST PAS dans ce fichier : Refdata a migré vers le GTIN comme
identifiant d'article, et la v2.0 ne l'expose plus.

Clé d'API : variable REFDATA_API_KEY (portail developer.refdata.ch,
produit « Refdata Public Files », en-tête X-API-Key).

Usage :
  REFDATA_API_KEY=… python3 scripts/import_refdata.py --dry-run
  REFDATA_API_KEY=… python3 scripts/import_refdata.py --out-dir /tmp/import
"""

from __future__ import annotations

import argparse
import csv
import io
import os
import sys
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import re

URL = "https://api.refdata.ch/articles/2.0/Refdata.Articles.zip"

# Taille d'emballage en fin de nom : « … 30 pce », « … 3 x 28 pce », « … 50 ml ».
# Elle appartient à l'emballage, pas au produit : le titre d'une fiche ne doit
# pas afficher la contenance d'un conditionnement parmi d'autres.
EMBALLAGE_FINAL = re.compile(
    r"\s+\d+(?:[.,]\d+)?\s*(?:x\s*\d+(?:[.,]\d+)?\s*)*"
    # Pas de « mg » : un milligramme est un DOSAGE, presque jamais une
    # contenance. L'avoir ici effaçait « 400 mg » des noms qui finissent par
    # leur dose — sans gravité tant qu'on nommait l'autorisation, fatal dès
    # qu'on nomme chaque dosage : deux dosages porteraient le même nom.
    r"(?:pce|pz|stk|ml|l|g|dose[s]?|amp|fl|ser|sach|cpr|caps|susp|inh)\.?\s*$",
    re.I)


def sans_emballage(nom: str) -> str:
    """« SPEDIFEN cpr pell 400 mg 30 pce » → « SPEDIFEN cpr pell 400 mg ».

    UNE seule passe, jamais en boucle : « 400 mg » ressemble à une taille
    d'emballage et se ferait dévorer au second tour, laissant un nom sans
    dosage — plus court, mais faux.
    """
    return EMBALLAGE_FINAL.sub("", nom).strip() or nom
NS = {"a": "https://simisinfo.refdata.ch/Articles/2.0/"}
FICHIERS = ("Refdata.Articles.xml", "Refdata.Articles.Zugelassen.xml")


def telecharger(cle: str) -> zipfile.ZipFile:
    requete = urllib.request.Request(
        URL,
        headers={
            "X-API-Key": cle,
            "Cache-Control": "no-cache",
            "User-Agent": "Pharmadex/1.0 (+outil interne d'officine)",
        },
    )
    with urllib.request.urlopen(requete, timeout=300) as reponse:
        return zipfile.ZipFile(io.BytesIO(reponse.read()))


def extraire(archive: zipfile.ZipFile) -> dict[str, dict]:
    articles: dict[str, dict] = {}
    for nom_fichier in FICHIERS:
        if nom_fichier not in archive.namelist():
            print(f"  {nom_fichier} absent de l'archive", file=sys.stderr)
            continue
        racine = ET.fromstring(archive.read(nom_fichier))
        for article in racine.findall("a:Article", NS):
            emballage = article.find("a:PackagedProduct", NS)
            if emballage is None:
                continue
            gtin = (emballage.findtext("a:DataCarrierIdentifier", "", NS) or "").strip()
            if len(gtin) != 13 or not gtin.isdigit() or gtin in articles:
                continue
            noms = {
                n.findtext("a:Language", "", NS): (n.findtext("a:FullName", "", NS) or "").strip()
                for n in emballage.findall("a:Name", NS)
            }
            nom_fr = noms.get("FR") or ""
            if not nom_fr:
                continue
            # ProductPrice est au niveau Article, pas PackagedProduct.
            prix = (article.findtext("a:ProductPrice/a:RetailPrice", "", NS) or "").strip()
            articles[gtin] = {
                "gtin": gtin,
                # Nom complet pour l'emballage, nom sans contenance pour le produit.
                "description_fr": nom_fr,
                "name_fr": sans_emballage(nom_fr),
                "price_public": prix,
            }
    return articles


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", type=Path, default=Path("."))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    cle = os.environ.get("REFDATA_API_KEY", "").strip()
    if not cle:
        raise SystemExit("REFDATA_API_KEY manquante (portail developer.refdata.ch)")

    articles = extraire(telecharger(cle))
    avec_prix = sum(1 for a in articles.values() if a["price_public"])
    print(f"{len(articles)} emballages avec dénomination française, "
          f"{avec_prix} avec prix public", file=sys.stderr)

    if args.dry_run:
        for a in list(articles.values())[:5]:
            print(f"  {a['gtin']}  {a['name_fr'][:44]:<44} | "
                  f"{a['description_fr'][:34]:<34} {a['price_public'] or '—'}")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    chemin = args.out_dir / "refdata_fr.csv"
    with chemin.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["gtin", "name_fr", "description_fr", "price_public"]
        )
        writer.writeheader()
        writer.writerows(articles.values())
    print(f"écrit : {chemin}", file=sys.stderr)


if __name__ == "__main__":
    main()
