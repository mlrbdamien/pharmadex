#!/usr/bin/env python3
"""Génère src/lib/atc-libelles.json depuis Wikipédia francophone.

Les libellés français des niveaux ATC intermédiaires n'ont pas de source
officielle librement téléchargeable (index OMS payant en masse, OFSP limité
aux substances de niveau 5). Wikipédia fr documente tous les niveaux : la
page « ATC code X » de chaque groupe anatomique liste le niveau 2, et chaque
sous-page « ATC code X01 » porte les niveaux 3 et 4 en titres de section.
Contenu CC BY-SA — attribution en tête du fichier généré.

À relancer occasionnellement (la classification OMS évolue en janvier) :
  python3 scripts/gen_atc_labels.py
"""

from __future__ import annotations

import datetime
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

LETTRES = "ABCDGHJLMNPRSV"
API = "https://fr.wikipedia.org/w/api.php"
ENTETES = {"User-Agent": "Pharmadex/1.0 (outil interne d'officine; mlrb.damien@gmail.com)"}

# Après nettoyage du balisage, une ligne utile devient « A01 : Libellé »
# (listes des pages de lettre) ou « A01A Libellé » (titres des sous-pages).
MOTIF = re.compile(r"^([A-Z][0-9]{2}[A-Z]{0,2})\s*[:\-–—]?\s+(.+)$")
# Variante rencontrée (lettre S) : « Classe ATC S01 dénommée « Libellé », »
MOTIF_DENOMME = re.compile(r"Classe ATC ([A-Z][0-9]{2}[A-Z]{0,2}) dénommée «\s*(.+?)\s*»")

GRAS = "'" * 3
ITALIQUE = "'" * 2


def nettoyer(texte: str) -> str:
    s = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]", r"\1", texte)
    s = re.sub(r"\{\{[^}]*\}\}", "", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace(GRAS, "").replace(ITALIQUE, "")
    s = s.strip("=*:;# ")
    s = re.sub(r"\s+", " ", s).strip(" .;:–—-")
    return s


def wikitext(page: str) -> str:
    params = urllib.parse.urlencode({
        "action": "parse", "page": page, "prop": "wikitext",
        "format": "json", "formatversion": "2", "redirects": "1",
    })
    try:
        with urllib.request.urlopen(
            urllib.request.Request(f"{API}?{params}", headers=ENTETES), timeout=60
        ) as reponse:
            charge = json.load(reponse)
    except Exception:
        return ""
    if "error" in charge:
        return ""
    return charge["parse"]["wikitext"]


def extraire(texte: str, lettre: str) -> dict[str, str]:
    libelles: dict[str, str] = {}
    for ligne in texte.splitlines():
        propre = nettoyer(ligne)
        m = MOTIF.match(propre) or MOTIF_DENOMME.search(propre)
        if not m:
            continue
        code, brut = m.group(1), m.group(2).strip(" .;:–—-")
        if 3 <= len(code) <= 5 and code.startswith(lettre) and 2 <= len(brut) <= 120:
            libelles.setdefault(code, brut)
    return libelles


def moissonner(lettre: str) -> dict[str, str]:
    """Page de lettre (niveau 2), puis chaque sous-page (niveaux 3 et 4)."""
    libelles = extraire(wikitext(f"ATC code {lettre}"), lettre)
    for code2 in [c for c in sorted(libelles) if len(c) == 3]:
        texte = wikitext(f"ATC code {code2}") or wikitext(f"Classe ATC {code2}")
        libelles.update(extraire(texte, lettre))
        time.sleep(0.3)  # courtoisie envers l'API Wikipédia
    return libelles


def main() -> None:
    tout: dict[str, str] = {}
    for lettre in LETTRES:
        partiel = moissonner(lettre)
        n2 = sum(1 for c in partiel if len(c) == 3)
        n3 = sum(1 for c in partiel if len(c) == 4)
        n4 = sum(1 for c in partiel if len(c) == 5)
        print(f"  {lettre} : {len(partiel):4} libellés (N2 {n2} · N3 {n3} · N4 {n4})",
              file=sys.stderr)
        tout.update(partiel)

    sortie = Path(__file__).parent.parent / "src/lib/atc-libelles.json"
    sortie.write_text(json.dumps({
        "_source": "Wikipédia francophone, pages « ATC code A » à « ATC code V » — CC BY-SA 4.0",
        "_genere": datetime.date.today().isoformat(),
        **dict(sorted(tout.items())),
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(tout)} libellés → {sortie}", file=sys.stderr)


if __name__ == "__main__":
    main()
