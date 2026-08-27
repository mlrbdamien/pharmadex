#!/usr/bin/env python3
"""Import de la liste Swissmedic des emballages autorisés vers Pharmadex.

Produit deux CSV (products.csv, packages.csv) à partir du fichier
« Zugelassene Packungen Humanarzneimittel », en calculant le GTIN de chaque
emballage. L'écriture en base est faite par le workflow (psql \\copy + upsert),
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
    "packungscode": "pack_code",
    "atc-code": "atc_code",
    "wirkstoff": "substances",
    "zulassungsinhaberin": "company",
    "packungsgrosse": "pack_size",
    "einheit": "unit",
    "abgabekategorie packung": "category",
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
        if {"authorization_nr", "pack_code", "atc_code"} <= cols.keys():
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
    packages: dict[str, dict] = {}
    skipped = 0

    def cell(row, field):
        value = row[cols[field]] if cols.get(field) is not None and cols[field] < len(row) else None
        if value is None:
            return ""
        return re.sub(r"\s+", " ", str(value)).strip()

    for row in rows[header_idx + 1 :]:
        auth = cell(row, "authorization_nr")
        pack = cell(row, "pack_code")
        name = cell(row, "name")
        # Les numéros arrivent parfois en float Excel (« 44447.0 »)
        auth = re.sub(r"\.0$", "", auth)
        pack = re.sub(r"\.0$", "", pack)
        if not re.fullmatch(r"[0-9]{1,5}", auth) or not re.fullmatch(r"[0-9]{1,3}", pack) or not name:
            skipped += 1
            continue
        auth = auth.zfill(5)

        atc = cell(row, "atc_code")
        product = products.setdefault(
            auth,
            {
                "authorization_nr": auth,
                "name": name,
                "company": cell(row, "company"),
                "atc_code": atc,
                "substances": cell(row, "substances"),
                "category": cell(row, "category"),
            },
        )
        # Un même n° d'autorisation couvre plusieurs dosages : on garde le nom
        # le plus court (généralement sans le dosage), et le premier ATC non vide.
        if name and len(name) < len(product["name"]):
            product["name"] = name
        if not product["atc_code"] and atc:
            product["atc_code"] = atc

        gtin = build_gtin(auth, pack)
        size = " ".join(x for x in (cell(row, "pack_size"), cell(row, "unit")) if x)
        packages[gtin] = {
            "gtin": gtin,
            "authorization_nr": auth,
            "pack_code": pack.zfill(3),
            "description": size,
        }

    return products, packages, skipped, header_idx


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

    products, packages, skipped, header_idx = parse(path)
    print(f"en-têtes ligne {header_idx} · {len(products)} produits · {len(packages)} emballages · {skipped} lignes ignorées")

    if args.dry_run:
        sample = list(packages.values())[:3]
        for pkg in sample:
            product = products[pkg["authorization_nr"]]
            print(f"  {pkg['gtin']}  {product['name'][:50]:<50}  {product['atc_code'] or '—'}  {pkg['description']}")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    write_csv(args.out_dir / "products.csv", products,
              ["authorization_nr", "name", "company", "atc_code", "substances", "category"])
    write_csv(args.out_dir / "packages.csv", packages,
              ["gtin", "authorization_nr", "pack_code", "description"])
    print(f"écrit : {args.out_dir}/products.csv, {args.out_dir}/packages.csv")


if __name__ == "__main__":
    main()
