#!/usr/bin/env python3
"""Index des notices AIPS (format SIMIS) vers Pharmadex.

Le téléchargement AIPS n'est plus un dump de contenus mais un catalogue
d'URLs : chaque autorisation pointe vers sa notice HTML/PDF hébergée chez
Refdata. Ce script produit notices.csv ; l'écriture en base est faite par le
workflow (psql \\copy + upsert).

La page de téléchargement est une WebForm ASP.NET : il faut accepter les
conditions via un POST rejouant __VIEWSTATE / __EVENTVALIDATION.

Usage :
  python3 scripts/import_notices.py --dry-run [--file AipsDownload.xml]
  python3 scripts/import_notices.py --out-dir /tmp/import
"""

from __future__ import annotations

import argparse
import csv
import html
import io
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from http.cookiejar import CookieJar
from pathlib import Path

ACCEPT_URL = "https://download.swissmedicinfo.ch/"
NS = {"a": "https://simisinfo.refdata.ch/MedicinalDocuments/1.0/"}


def download() -> bytes:
    """GET la page d'acceptation, rejoue le formulaire, renvoie le XML."""
    jar = CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    page = opener.open(ACCEPT_URL, timeout=120).read().decode("utf-8", "replace")

    def field(name: str) -> str:
        m = re.search(rf'name="{re.escape(name)}"[^>]*value="([^"]*)"', page)
        if not m:
            raise SystemExit(f"Champ {name} introuvable — la page d'acceptation a changé")
        return html.unescape(m.group(1))

    form = urllib.parse.urlencode({
        "__VIEWSTATE": field("__VIEWSTATE"),
        "__VIEWSTATEGENERATOR": field("__VIEWSTATEGENERATOR"),
        "__EVENTVALIDATION": field("__EVENTVALIDATION"),
        "ctl00$MainContent$BtnYes": "Yes",
    }).encode()

    payload = opener.open(ACCEPT_URL, data=form, timeout=300).read()
    if payload[:2] != b"PK":
        raise SystemExit("La réponse n'est pas un zip — flux d'acceptation cassé ?")
    with zipfile.ZipFile(io.BytesIO(payload)) as z:
        name = next(n for n in z.namelist() if n.endswith(".xml"))
        return z.read(name)


def parse(xml_bytes: bytes) -> dict[tuple, dict]:
    rows: dict[tuple, dict] = {}
    root = ET.fromstring(xml_bytes)
    for bundle in root.findall("a:MedicinalDocumentsBundle", NS):
        doc_type = bundle.findtext("a:Type", "", NS)
        auth = bundle.findtext("a:RegulatedAuthorization/a:Identifier", "", NS).strip()
        date = bundle.findtext("a:Date", "", NS)
        if doc_type not in ("SmPC", "PIL", "PL") or not re.fullmatch(r"[0-9]{1,5}", auth):
            continue
        auth = auth.zfill(5)
        for doc in bundle.findall("a:AttachedDocument", NS):
            lang = doc.findtext("a:Language", "", NS)
            if lang not in ("de", "fr", "it", "en"):
                continue
            html_url = pdf_url = ""
            for ref in doc.findall("a:DocumentReference", NS):
                ctype = ref.findtext("a:ContentType", "", NS)
                url = ref.findtext("a:Url", "", NS)
                if ctype == "text/html":
                    html_url = url
                elif ctype == "application/pdf":
                    pdf_url = url
            if not html_url:
                continue
            rows[(auth, doc_type, lang)] = {
                "authorization_nr": auth,
                "doc_type": doc_type,
                "lang": lang,
                "description": (doc.findtext("a:Description", "", NS) or "").strip(),
                "html_url": html_url,
                "pdf_url": pdf_url,
                "updated_on": date,
            }
    return rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", type=Path, help="XML local (sinon téléchargement + acceptation)")
    ap.add_argument("--out-dir", type=Path, default=Path("."))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    xml_bytes = args.file.read_bytes() if args.file else download()
    rows = parse(xml_bytes)
    langs = {}
    for (_, _, lang) in rows:
        langs[lang] = langs.get(lang, 0) + 1
    print(f"{len(rows)} notices · par langue {langs}", file=sys.stderr)

    if args.dry_run:
        for row in list(rows.values())[:3]:
            print(f"  {row['authorization_nr']} {row['doc_type']:4} {row['lang']}  {row['description'][:60]}")
        return

    args.out_dir.mkdir(parents=True, exist_ok=True)
    fields = ["authorization_nr", "doc_type", "lang", "description", "html_url", "pdf_url", "updated_on"]
    with (args.out_dir / "notices.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows.values())
    print(f"écrit : {args.out_dir}/notices.csv", file=sys.stderr)


if __name__ == "__main__":
    main()
