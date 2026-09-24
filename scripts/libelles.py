"""Libellés d'autorisation et de dosage, déduits des noms officiels.

Swissmedic nomme les DOSAGES (« Dafalgan, Suppositorien 300 mg »), jamais
l'autorisation qui les regroupe. Le catalogue a besoin des deux : une ligne
« Dafalgan, Suppositorien » et des puces « 80 mg · 150 mg · 300 mg · 600 mg ».

Fonctions pures, sans dépendance : elles servent aux noms Swissmedic comme aux
dénominations françaises Refdata/OFSP, et se testent sur le fichier réel.
"""

from __future__ import annotations

import re
import unicodedata

# Ponctuation qui peut traîner en bord de libellé après une coupe entre mots.
_BORDS = " ,;:-–—/("


def _mots(nom: str) -> list[str]:
    return nom.split()


def _cle(mot: str) -> str:
    """Un mot sans la ponctuation qui s'y colle ni ses accents : « Mydocalm, »
    vaut « Mydocalm », « Quétiapine » vaut « Quetiapine »."""
    nfd = unicodedata.normalize("NFD", mot.rstrip(",;:").lower())
    return "".join(c for c in nfd if not unicodedata.combining(c))


def libelle_commun(noms: list[str]) -> str:
    """Tronc commun des noms, coupé à une frontière de mot.

    >>> libelle_commun(["Dafalgan, Suppositorien 80 mg", "Dafalgan, Suppositorien 300 mg"])
    'Dafalgan, Suppositorien'
    >>> libelle_commun(["Fluimucil 100, granulato", "Fluimucil 600, granulato"])
    'Fluimucil'
    >>> libelle_commun(["Aspégic 100", "Aspégic Mite"])
    'Aspégic'
    >>> libelle_commun(["Mydocalm mite, comprimés", "Mydocalm, comprimés"])
    'Mydocalm'
    >>> libelle_commun(["Seul dosage 5 mg"])
    'Seul dosage 5 mg'

    Sans aucun mot commun, on rend une chaîne VIDE, et l'appelant choisit son
    repli. Rendre le premier nom — comme la première version — donnait à tout
    un médicament le nom d'un seul de ses dosages (« Quetiapin-Mepha, cpr
    pell 25 mg » pour quatre dosages) : l'erreur même que ce module corrige.

    >>> libelle_commun(["Rocaltrol 0,25 µg", "Calcitriol 0,5 µg"])
    ''
    """
    distincts = list(dict.fromkeys(n.strip() for n in noms if n and n.strip()))
    if not distincts:
        return ""
    if len(distincts) == 1:
        return distincts[0]
    listes = [_mots(n) for n in distincts]
    commun: list[str] = []
    for groupe in zip(*listes):
        if all(_cle(m) == _cle(groupe[0]) for m in groupe):
            commun.append(groupe[0])
        else:
            break
    return " ".join(commun).strip(_BORDS)


def libelle_repli(noms: list[str]) -> str:
    """Tronc COMMUN AUX CARACTÈRES, pour quand aucun mot n'est partagé : le
    dosage est parfois collé à la marque par un trait (« Androcur-50 »).

    >>> libelle_repli(["Androcur-50, Tabletten", "Androcur-10, Tabletten"])
    'Androcur'
    >>> libelle_repli(["Olfen-25, Lactab", "Olfen-50, Lactab"])
    'Olfen'

    En dernier recours seulement, le premier nom : un libellé porteur d'un
    dosage vaut mieux qu'un libellé vide, et il ne concerne aucun cas réel
    aujourd'hui (2 autorisations sans mot commun, toutes deux couvertes).
    """
    distincts = list(dict.fromkeys(n.strip() for n in noms if n and n.strip()))
    if not distincts:
        return ""
    prefixe = distincts[0]
    for n in distincts[1:]:
        while not n.startswith(prefixe):
            prefixe = prefixe[:-1]
    # Couper au dernier séparateur : « Androcur-5 » (commun à -50 et -55)
    # ne doit pas garder un chiffre orphelin.
    coupe = re.match(r"^(.*[^\w])", prefixe)
    tronc = (coupe.group(1) if coupe else "").strip(_BORDS)
    return tronc or distincts[0]


def libelle_dosage(nom: str, commun: str) -> str:
    """Ce qui distingue un dosage de ses voisins : la puce du catalogue.

    >>> libelle_dosage("Dafalgan, Suppositorien 300 mg", "Dafalgan, Suppositorien")
    '300 mg'
    >>> libelle_dosage("Fluimucil 600, granulato per soluzione orale", "Fluimucil")
    '600'
    >>> libelle_dosage("DAFALGAN supp 80 mg", "DAFALGAN supp")
    '80 mg'
    >>> libelle_dosage("Xanax 0,25 mg, comprimés", "Xanax")
    '0,25 mg'
    >>> libelle_dosage("Mydocalm mite, comprimés pelliculés", "Mydocalm")
    'mite'

    Coupé à la première virgule SUIVIE D'UNE ESPACE : dans « 600, granulato… »
    la forme suit la virgule, mais « 0,25 mg » est un nombre décimal suisse.
    """
    mots = _mots(nom)
    tete = _mots(commun)
    # Retirer le tronc mot à mot, à la même clé que libelle_commun : une
    # comparaison de chaînes échouerait sur « Mydocalm, » face à « Mydocalm ».
    if tete and len(mots) >= len(tete) and all(
        _cle(a) == _cle(b) for a, b in zip(mots, tete)
    ):
        mots = mots[len(tete):]
    reste = " ".join(mots).strip(_BORDS)
    reste = reste.split(", ")[0].strip(_BORDS)
    return reste or nom.strip()


if __name__ == "__main__":
    import doctest
    import sys

    # Exécuté par le workflow d'import avant tout chargement : un libellé
    # faux se verrait sur chaque ligne du catalogue, mieux vaut échouer ici.
    echecs, total = doctest.testmod()
    print(f"{total - echecs}/{total} exemples vérifiés")
    sys.exit(1 if echecs else 0)
