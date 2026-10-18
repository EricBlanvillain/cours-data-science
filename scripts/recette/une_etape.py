"""R4 : une étape par cellule de code dans les notebooks de leçon (voir CLAUDE.md, « Les quatre règles »).

Pour chaque notebook de leçon (seances/*/NN_*.ipynb sauf les exercices, SO1 et SO2, B1 à B4), une cellule de code échoue si :
- elle a plus de 8 lignes de code (lignes vides et lignes de pur commentaire non comptées) ;
- ou elle regarde ET modifie des données dans la même cellule.

« Regarder » : un print(...) ou un display(...), ou une dernière ligne que Jupyter affiche (une expression qui n'est pas
l'appel d'une fonction nommée, comme noter(...)). « Modifier » : écrire dans un tableau (df["x"] = ..., df.loc[...] = ...),
un appel avec inplace=True, un del de colonne, ou remplacer une variable par une version d'elle-même (df = df.drop_duplicates()).

Exceptions : la cellule de préparation (les cellules de code qui suivent « ## Préparation » ou « ## 0. Préparation », jusqu'au markdown suivant), les filets de sécurité (#@title), les
cellules de vérification (verifier(...) ou ✅), les squelettes d'exercice (# À toi), et une cellule qui ne contient qu'une
seule définition de fonction ou de classe (elle n'exécute rien : ni plafond de lignes, ni « regarde et modifie »).

Lancer :  python3 scripts/recette/une_etape.py [notebook.ipynb …]     (sans argument : tous les notebooks de leçon)
Sort en code 1 à la moindre cellule fautive.
"""
import ast, glob, json, os, re, sys

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAX_LIGNES = 8


def lecons():
    nbs = [p for p in glob.glob(os.path.join(RACINE, "seances", "*", "[0-9][0-9]_*.ipynb")) if not p.endswith("_exercices.ipynb")]
    nbs += [p for p in glob.glob(os.path.join(RACINE, "seances-optionnelles", "*", "SO[0-9]_*.ipynb")) if not p.endswith("_exercices.ipynb")]
    nbs += glob.glob(os.path.join(RACINE, "projets-optionnels", "*", "B[0-9]-*", "B[0-9]_*.ipynb"))
    return sorted(nbs)


def lignes_de_code(src):
    return [l for l in src.splitlines() if l.strip() and not l.strip().startswith("#")]


def sans_magies(src):
    """Les lignes « !commande » et « %magie » ne sont pas du Python : on les neutralise pour l'analyse."""
    return "\n".join(re.sub(r"^(\s*)[!%].*", r"\1pass", l) for l in src.splitlines())   # indentation gardée


def noms(noeud):
    return {n.id for n in ast.walk(noeud) if isinstance(n, ast.Name)}


def regarde(arbre):
    for n in ast.walk(arbre):
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in ("print", "display"):
            return True
    if arbre.body and isinstance(arbre.body[-1], ast.Expr):
        v = arbre.body[-1].value
        if isinstance(v, ast.Call) and isinstance(v.func, ast.Name) and v.func.id not in ("len", "sorted", "list", "dict", "set", "round", "sum", "max", "min"):
            return False      # noter(...), verifier(...), une fonction du notebook : rien d'affiché
        if isinstance(v, ast.Constant) and isinstance(v.value, str):
            return False      # une chaîne seule (un commentaire long)
        return True
    return False


def modifie(arbre):
    for n in ast.walk(arbre):
        if isinstance(n, (ast.Assign, ast.AugAssign, ast.AnnAssign)):
            cibles = n.targets if isinstance(n, ast.Assign) else [n.target]
            for c in cibles:
                if isinstance(c, (ast.Subscript, ast.Attribute)):
                    return True
                if isinstance(n, ast.Assign) and isinstance(c, ast.Name) and isinstance(n.value, ast.Call) and c.id in noms(n.value.func):
                    return True   # df = df.drop_duplicates() : la variable remplacée par une version d'elle-même
        if isinstance(n, ast.Call) and any(k.arg == "inplace" and isinstance(k.value, ast.Constant) and k.value.value is True for k in n.keywords):
            return True
        if isinstance(n, ast.Delete) and any(isinstance(t, ast.Subscript) for t in n.targets):
            return True
    return False


def une_seule_definition(arbre):
    corps = [n for n in arbre.body if not (isinstance(n, ast.Expr) and isinstance(n.value, ast.Constant))]
    return len(corps) == 1 and isinstance(corps[0], (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))


def fautes(chemin):
    cells = json.load(open(chemin, encoding="utf-8"))["cells"]
    sortie, apres_preparation = [], False
    for i, c in enumerate(cells):
        src = "".join(c["source"])
        if c["cell_type"] == "markdown":
            apres_preparation = bool(re.match(r"#+ (?:\d+\. )?Préparation", src.strip()))
            continue
        if apres_preparation:          # la préparation : les cellules de code qui suivent son titre, jusqu'au markdown suivant
            continue
        if src.lstrip().startswith("#@title") or "verifier(" in src or "✅" in src or re.search(r"^# À toi", src, re.M):
            continue
        try:
            arbre = ast.parse(sans_magies(src))
        except SyntaxError:
            continue
        if une_seule_definition(arbre):    # une définition n'exécute rien : ni plafond de lignes ni « regarde et modifie »
            continue
        n = len(lignes_de_code(src))
        if n > MAX_LIGNES:
            sortie.append((i, f"{n} lignes de code (8 au plus)"))
        if regarde(arbre) and modifie(arbre):
            sortie.append((i, "regarde et modifie dans la même cellule"))
    return sortie


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    nbs = args or lecons()
    total = 0
    for p in nbs:
        f = fautes(p)
        total += len(f)
        nom = os.path.relpath(p, RACINE)
        print(f"{'✗' if f else '·'} {nom} : {len(f)} cellule(s) fautive(s)")
        for i, raison in f:
            print(f"    cellule {i} : {raison}")
    print(f"\nR4 — {len(nbs)} notebook(s) de leçon, {total} faute(s)")
    sys.exit(1 if total else 0)


if __name__ == "__main__":
    main()
