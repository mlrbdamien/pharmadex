#!/usr/bin/env python3
"""Import de la liste Swissmedic des emballages autorisés vers Pharmadex.

Produit trois CSV (products.csv, dosages.csv, packages.csv) à partir du
fichier « Zugelassene Packungen Humanarzneimittel », en calculant le GTIN de
chaque emballage.

Trois niveaux, parce que Swissmedic en a trois : l'AUTORISATION (un numéro,
une notice, un code ATC), le DOSAGE (« Dosisstärke » : Dafalgan supp 80, 150,
300 et 600 mg sont quatre dosages d'une seule autorisation) et l'EMBALLAGE
(un GTIN). Les fusionner au niveau de l'autorisation effaçait 38 % des
dosages — un scan de Dafalgan 300 affichait « 80 mg ». L'écriture en base est faite par le workflow (psql \\copy + upsert),
pas par ce script — il reste ainsi testable sans identifiants.

Usage :
  python3 scripts/import_products.py --dry-run [--file chemin.xlsx]
  python3 scripts/import_products.py --out-dir /tmp/import [--file chemin.xlsx]

Source : Swissmedic, « Médicaments autorisés » (données publiques, citer la
source). Le fichier est réécrit chaque mois, sans archivage.
"""

from __future__ import annotations

import argparse
import csv
import io
import re
import sys
import unicodedata
import urllib.request
from pathlib import Path

import openpyxl

from formes_fr import forme_non_traduite, traduire_emballage, traduire_nom
from libelles import libelle_commun, libelle_dosage, libelle_repli

URL = (
    "https://www.swissmedic.ch/dam/swissmedic/en/dokumente/internetlisten/"
    "zugelassene_packungen_human.xlsx"
)

# Libellés (fragments, insensibles à la casse et aux accents) → nom de champ.
# Le fichier commence par une légende sur les stupéfiants et des titres : la
# ligne d'en-têtes est DÉTECTÉE, jamais supposée à une position fixe, et les
# colonnes sont mappées par libellé — Swissmedic réordonne parfois les colonnes.
WANTED = {
    "zulassungs-nummer": "authorization_nr",
    "zulassungsnummer": "authorization_nr",
    "dosisstarke-nummer": "dosage_nr",
    "packungscode": "pack_code",
    "atc-code": "atc_code",
    "wirkstoff": "substances",
    "zulassungsinhaberin": "company",
    "packungsgrosse": "pack_size",
    "einheit": "unit",
    # Trois catégories de remise, une par niveau. Swissmedic agrège lui-même
    # vers le haut : « B/D » quand les niveaux inférieurs diffèrent. On lit
    # chacune à son niveau plutôt que d'en déduire une — Perenterol 250 est
    # en D, Perenterol 500 en B, le médicament en B/D.
    "abgabekategorie packung": "category_package",
    "abgabekategorie dosisstarke": "category_dosage",
    "abgabekategorie arzneimittel": "category_product",
}
NAME_HINTS = ("bezeichnung", "praparat", "arzneimittel des wirkstoffs", "heilmittel ")


def fold(text: str) -> str:
    text = unicodedata.normalize("NFD", str(text))
    return "".join(c for c in text if not unicodedata.combining(c)).lower()


def ean13_check_digit(douze: str) -> str:
    total = sum(int(d) * (3 if i % 2 else 1) for i, d in enumerate(douze))
    return str((10 - total % 10) % 10)


def build_gtin(auth_nr: str, pack_code: str) -> str:
    base = f"7680{auth_nr:0>5}{pack_code:0>3}"
    return base + ean13_check_digit(base)


def find_header(rows: list[tuple]) -> tuple[int, dict[str, int]]:
    """Repère la ligne d'en-têtes et le mapping libellé → index de colonne."""
    for idx, row in enumerate(rows[:30]):
        cols: dict[str, int] = {}
        name_col = None
        for col, cell in enumerate(row):
            if cell is None:
                continue
            label = fold(cell)
            for fragment, field in WANTED.items():
                if fragment in label and field not in cols:
                    cols[field] = col
            if name_col is None and any(h in label for h in NAME_HINTS):
                name_col = col
        if {"authorization_nr", "dosage_nr", "pack_code", "atc_code"} <= cols.keys():
            if name_col is None:
                # Repli : la colonne du nom est celle dont le libellé contient
                # « bezeichnung » seul ; si absent, on échoue explicitement.
                raise SystemExit("En-têtes trouvés mais pas la colonne du nom de préparation")
            cols["name"] = name_col
            return idx, cols
    raise SystemExit(
        "Ligne d'en-têtes introuvable — Swissmedic a probablement remanié le fichier. "
        "Vérifier les libellés dans WANTED."
    )


def parse(path: Path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    header_idx, cols = find_header(rows)

    products: dict[str, dict] = {}
    dosages: dict[tuple[str, str], dict] = {}
    packages: dict[str, dict] = {}
    skipped = 0

    def cell(row, field):
        value = row[cols[field]] if cols.get(field) is not None and cols[field] < len(row) else None
        if value is None:
            return ""
        return re.sub(r"\s+", " ", str(value)).strip()

    for row in rows[header_idx + 1 :]:
        auth = cell(row, "authorization_nr")
        dose = cell(row, "dosage_nr")
        pack = cell(row, "pack_code")
        name = cell(row, "name")
        # Les numéros arrivent parfois en float Excel (« 44447.0 »)
        auth = re.sub(r"\.0$", "", auth)
        dose = re.sub(r"\.0$", "", dose)
        pack = re.sub(r"\.0$", "", pack)
        if (not re.fullmatch(r"[0-9]{1,5}", auth) or not re.fullmatch(r"[0-9]{1,3}", dose)
                or not re.fullmatch(r"[0-9]{1,3}", pack) or not name):
            skipped += 1
            continue
        auth = auth.zfill(5)

        atc = cell(row, "atc_code")
        product = products.setdefault(
            auth,
            {
                "authorization_nr": auth,
                "company": cell(row, "company"),
                "atc_code": atc,
                "category": cell(row, "category_product"),
            },
        )
        # L'ATC ne varie jamais d'un dosage à l'autre (vérifié : 0 cas sur
        # 2 148 autorisations à plusieurs dosages) ; on garde le premier non vide.
        if not product["atc_code"] and atc:
            product["atc_code"] = atc

        # Un dosage a UN nom : toutes ses lignes le répètent. Les principes
        # actifs, eux, peuvent différer d'un dosage à l'autre (36 autorisations).
        dosages.setdefault(
            (auth, dose),
            {
                "authorization_nr": auth,
                "dosage_nr": dose,
                "name": name,
                "substances": cell(row, "substances"),
                "category": cell(row, "category_dosage"),
            },
        )

        gtin = build_gtin(auth, pack)
        size = " ".join(x for x in (cell(row, "pack_size"), cell(row, "unit")) if x)
        packages[gtin] = {
            "gtin": gtin,
            "authorization_nr": auth,
            "dosage_nr": dose,
            "pack_code": pack.zfill(3),
            "description": traduire_emballage(size),
            "category": cell(row, "category_package"),
        }

    # Le nom de l'autorisation n'existe pas chez Swissmedic : c'est le tronc
    # commun des noms de ses dosages (« Dafalgan, Suppositorien »). Le choisir
    # parmi eux — comme on le faisait — revient à élire un dosage au hasard.
    par_autorisation: dict[str, list[str]] = {}
    for d in dosages.values():
        par_autorisation.setdefault(d["authorization_nr"], []).append(d["name"])
    # Calculé AVANT la traduction, sur des noms de même source : traduire le
    # tronc puis le comparer à des noms encore allemands ne recouvre plus rien.
    for auth, noms in par_autorisation.items():
        products[auth]["name"] = libelle_commun(noms) or libelle_repli(noms)
    # Principes actifs de l'autorisation : l'UNION de ceux de ses dosages
    # (36 autorisations en ont de différents). Une note « principe actif »
    # doit trouver le produit quel que soit le dosage qui porte la substance.
    substances: dict[str, list[str]] = {}
    for d in dosages.values():
        liste = substances.setdefault(d["authorization_nr"], [])
        for sub in re.split(r"\s*,\s*", d["substances"]):
            if sub and sub not in liste:
                liste.append(sub)
    for auth, liste in substances.items():
        products[auth]["substances"] = ", ".join(liste)
    for d in dosages.values():
        d["label"] = libelle_dosage(d["name"], products[d["authorization_nr"]]["name"])
    # Swissmedic nomme parfois deux dosages à l'identique (Pamorelin, Salvacyl :
    # 12 autorisations). Deux puces pareilles seraient pires qu'une puce sèche :
    # on affiche alors le numéro officiel, la seule chose qui les distingue.
    par_puce: dict[tuple[str, str], list[dict]] = {}
    for d in dosages.values():
        par_puce.setdefault((d["authorization_nr"], d["label"]), []).append(d)
    for groupe in par_puce.values():
        if len(groupe) > 1:
            for d in groupe:
                d["label"] = f"dosage {d['dosage_nr']}"

    # Traduction des suffixes de forme, une fois le nom le plus court retenu.
    restes: dict[str, int] = {}
    for ligne in (*products.values(), *dosages.values()):
        reste = forme_non_traduite(ligne["name"])
        if reste:
            restes[reste] = restes.get(reste, 0) + 1
        ligne["name"] = traduire_nom(ligne["name"])
    if restes:
        top = sorted(restes.items(), key=lambda kv: -kv[1])[:12]
        print(f"formes restées en allemand : {sum(restes.values())} produits, "
              f"{len(restes)} formes — les plus fréquentes :", file=sys.stderr)
        for forme, n in top:
            print(f"    {n:4}  {forme[:70]}", file=sys.stderr)

    return products, dosages, packages, skipped, header_idx


def write_csv(path: Path, rows: dict, fields: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows.values():
            writer.writerow({k: row.get(k, "") for k in fields})


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", type=Path, help="xlsx local (sinon téléchargement)")
    ap.add_argument("--out-dir", type=Path, default=Path("."))
    ap.add_argument("--dry-run", action="store_true", help="compteurs et échantillon, aucun fichier écrit")
    args = ap.parse_args()

    if args.file:
        path = args.file
    else:
        print(f"Téléchargement : {URL}", file=sys.stderr)
        data = urllib.request.urlopen(URL, timeout=120).read()
        path = Path("/tmp/zugelassene_packungen_human.xlsx")
        path.write_bytes(data)

    products, dosages, packages, skipped, header_idx = parse(path)
    print(f"en-têtes ligne {header_idx} · {len(products)} autorisations · {len(dosages)} dosages · "
          f"{len(packages)} emballages · {skipped} lignes ignorées")

    if args.dry_run:
        sample = list(packages.values())[:3]
        for pkg in sample:
            dosage = dosages[(pkg["authorization_nr"], pkg["dosage_nr"])]
            product = products[pkg["authorization_nr"]]
            print(f"  {pkg['gtin']}  {dosage['name'][:50]:<50}  {product['atc_code'] or '—'}  {pkg['description']}")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    write_csv(args.out_dir / "products.csv", products,
              ["authorization_nr", "name", "company", "atc_code", "substances", "category"])
    write_csv(args.out_dir / "dosages.csv", {k: v for k, v in dosages.items()},
              ["authorization_nr", "dosage_nr", "name", "label", "substances", "category"])
    write_csv(args.out_dir / "packages.csv", packages,
              ["gtin", "authorization_nr", "dosage_nr", "pack_code", "description", "category"])
    print(f"écrit : products.csv, dosages.csv, packages.csv dans {args.out_dir}")


if __name__ == "__main__":
    main()
