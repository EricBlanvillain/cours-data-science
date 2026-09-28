"""Recette des notebooks : chaque notebook doit s'exécuter de bout en bout, sans GPU ni clé d'API.

Pour chaque notebook donné (ou, sans argument, tous ceux du dépôt) :
- exécution en mémoire, depuis le dossier du notebook, avec USE_MODEL forcé à False et MODE_RAPIDE à True ;
- rien n'est réécrit dans le notebook ; les fichiers qu'il crée dans son dossier sont supprimés à la fin ;
- on vérifie que le notebook versionné ne contient aucune sortie ;
- un module introuvable (un paquet que Colab préinstalle, qu'on n'a pas pu installer ici) donne SKIP, jamais ❌ ;
- une solution injectée qui plante (un morceau à coller dans une autre cellule) est retirée : son squelette tourne à sa
  place, et la sortie le note.

Avec --solutions, chaque solution repliée (<details><summary>Solution …```python … ```) remplace son squelette
(la cellule « # À toi » qui la précède) AVANT que le squelette ne s'exécute : elle prend la place du premier trou
du squelette (une fonction à trous qu'elle redéfinit, un « x = None »). La préparation déjà écrite tourne avant,
les appels et les affichages du squelette tournent après, avec le vrai code ; les autres trous sont retirés.
Toutes les vérifications doivent alors afficher ✅.

Lancer (voir CLAUDE.md) :  python scripts/recette/recette.py [--solutions] [notebook.ipynb …]
Sort en code 1 si un notebook plante, contient des sorties, ou (avec --solutions) affiche un ❌ ; un SKIP ne fait pas échouer.
"""
import ast, glob, json, os, re, sys
import nbformat
from nbclient import NotebookClient
from nbclient.exceptions import CellExecutionError

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOSSIERS = ["seances", "seances-optionnelles", "projets", "projets-optionnels", "projets-avances"]


def definitions(code):
    """Ce qu'un bloc de code définit au premier niveau : noms, et cibles écrites (df["x"], obj.attr)."""
    cles = set()
    for n in ast.parse(code).body:
        if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            cles.add(n.name)
        cibles = n.targets if isinstance(n, ast.Assign) else [n.target] if isinstance(n, (ast.AnnAssign, ast.AugAssign)) else []
        for c in cibles:
            for e in (c.elts if isinstance(c, (ast.Tuple, ast.List)) else [c]):
                cles.add(ast.unparse(e))
    return cles


def fusionner(solution, squelette):
    """Le squelette, avec la solution à la place de son premier trou (voir `niveaux`). Ce qui précède le trou
    (la préparation déjà écrite) tourne avant la solution ; après, on garde les appels et les affichages, et on
    retire ce que la solution redéfinit."""
    try:
        arbre = ast.parse(squelette)
        deja = definitions(solution)
    except SyntaxError:
        return solution
    lignes = squelette.splitlines()

    def redefini(n):
        cles = definitions(ast.get_source_segment(squelette, n) or "")
        return bool(cles) and cles <= deja

    def affectation(n):
        return isinstance(n, (ast.Assign, ast.AnnAssign)) and n.value is not None and redefini(n)

    def litteral(n):
        try:
            ast.literal_eval(n.value)
            return True
        except ValueError:
            return False

    # Trois sortes de trous, par ordre de préférence : une fonction à trous ou un « x = None / ... » ;
    # sinon une valeur de départ littérale (« x = 0 », « "?" ») ; sinon la première ligne que la solution réécrit
    # (une requête volontairement fausse, par exemple).
    niveaux = [
        lambda n: (isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) and n.name in deja)
                  or (affectation(n) and isinstance(n.value, ast.Constant) and n.value.value in (None, Ellipsis)),
        lambda n: affectation(n) and litteral(n),
        redefini,
    ]
    premier = next((n for trou in niveaux for n in arbre.body if trou(n)), None)
    if premier is None:
        return squelette.rstrip() + "\n\n# --- solution injectée ---\n" + solution
    # Les dernières instructions de la solution qui ne sont que des expressions (ses affichages, un appel de
    # vérification) passent en fin de cellule : elles peuvent lire ce que la suite du squelette calcule (un
    # chronomètre arrêté après le trou, par exemple). Une boucle ou une affectation reste à sa place.
    corps = ast.parse(solution).body
    coupe = len(corps)
    while coupe > 0 and isinstance(corps[coupe - 1], ast.Expr):
        coupe -= 1
    sol = solution.splitlines()
    tete = sol[:corps[coupe - 1].end_lineno] if coupe else []
    fin = sol[corps[coupe].lineno - 1:] if coupe < len(corps) else []
    garde = [n for n in arbre.body if n.lineno > premier.lineno and not redefini(n)]
    return "\n".join(lignes[:premier.lineno - 1]
                     + ["# --- solution injectée ---"] + tete + ["# --- suite du squelette ---"]
                     + [l for n in garde for l in lignes[n.lineno - 1:n.end_lineno]]
                     + (["# --- fin de la solution ---"] + fin if fin else []))


def squelette_de(cells, k):
    """Le squelette « # À toi » d'une solution : on remonte en ne traversant que du texte (ni titre ni autre solution,
    une check-list par exemple) et au plus une cellule de vérification. Une solution de projet qui couvre plusieurs
    cellules d'étapes n'a pas de squelette unique : elle n'est pas injectée."""
    verifs = 0
    for j in range(k - 1, -1, -1):
        c = cells[j]
        if c.cell_type == "code":
            if re.search(r"^# À toi", c.source, re.M):
                return j
            if "verifier(" in c.source and verifs == 0:
                verifs += 1
                continue
            return None
        if c.source.lstrip().startswith("#") or re.search(r"<summary>[^<]*Solution", c.source):
            return None
    return None


def injecter(nb, exclure=()):
    n = 0
    for k, c in enumerate(nb.cells):
        if c.cell_type != "markdown" or "<summary>Solution" not in c.source:
            continue
        blocs = re.findall(r"```python\n(.*?)```", c.source, re.S)
        if not blocs:
            continue
        cible = squelette_de(nb.cells, k)
        if cible is None or cible in exclure:
            continue
        nb.cells[cible].source = fusionner("\n".join(blocs), nb.cells[cible].source)
        nb.cells[cible].metadata["injecte"] = True
        n += 1
    return n


def fichiers(dossier):
    return {os.path.join(r, f) for r, _, fs in os.walk(dossier) for f in fs}


def recette(chemin, solutions):
    brut = json.load(open(chemin))
    sorties = sum(bool(c.get("outputs")) or c.get("execution_count") is not None for c in brut["cells"] if c["cell_type"] == "code")
    dossier = os.path.dirname(os.path.abspath(chemin))
    fragments = []   # solutions qui ne s'exécutent pas seules (un morceau à coller ailleurs) : on garde leur squelette
    while True:
        nb = nbformat.read(chemin, as_version=4)
        for c in nb.cells:
            if c.cell_type == "code":
                c.source = re.sub(r"^(\s*)USE_MODEL(\s*)=(\s*)True", r"\1USE_MODEL\2=\3False", c.source, flags=re.M)
                c.source = re.sub(r"^(\s*)MODE_RAPIDE(\s*)=(\s*)False", r"\1MODE_RAPIDE\2=\3True", c.source, flags=re.M)
        injectees = injecter(nb, fragments) if solutions else 0
        avant = fichiers(dossier)
        statut, erreur, reessayer = "OK", "", False
        try:
            NotebookClient(nb, timeout=1800, kernel_name="python3", resources={"metadata": {"path": dossier}}).execute()
        except CellExecutionError:
            statut = "PLANTE"
            for i, c in enumerate(nb.cells):
                err = [o for o in c.get("outputs", []) if o.get("output_type") == "error"]
                if err:
                    erreur = f"cellule {i} : {err[0].ename}: {err[0].evalue}"[:300]
                    if c.metadata.get("injecte"):
                        fragments.append(i); reessayer = True
                    elif err[0].ename == "ModuleNotFoundError":   # un paquet que Colab fournit, absent d'ici
                        statut, erreur = "SKIP", f"dépendance Colab absente de cet environnement ({err[0].evalue})"
                    break
        finally:
            for f in fichiers(dossier) - avant:
                os.remove(f)
        if not reessayer:
            break
    croix = []
    for i, c in enumerate(nb.cells):
        texte = "".join("".join(o.get("text", "")) for o in c.get("outputs", []))
        croix += [f"cellule {i} : {m.strip()}" for m in re.findall(r"❌([^\n]{0,70})", texte)]
    coches = sum("".join("".join(o.get("text", "")) for o in c.get("outputs", [])).count("✅") for c in nb.cells)
    return statut, erreur, sorties, injectees, coches, croix, fragments


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    solutions = "--solutions" in sys.argv
    nbs = args or sorted(p for d in DOSSIERS for p in glob.glob(os.path.join(RACINE, d, "**", "*.ipynb"), recursive=True))
    import pandas
    print(f"pandas {pandas.__version__} · {'solutions injectées' if solutions else 'notebooks tels quels'} · {len(nbs)} notebook(s)")
    echec = False
    for p in nbs:
        statut, erreur, sorties, injectees, coches, croix, fragments = recette(p, solutions)
        mauvais = statut == "PLANTE" or sorties or (solutions and croix)
        echec |= bool(mauvais)
        marque = "✗" if mauvais else "SKIP" if statut == "SKIP" else "·"
        print(f"{marque} {os.path.relpath(p, RACINE)} : {statut}, {sorties} sortie(s) versionnée(s)"
              + (f", {injectees} solution(s) injectée(s)" if solutions else "") + f", ✅ {coches}, ❌ {len(croix)}"
              + (f" — {erreur}" if erreur else ""), flush=True)
        if solutions:
            for k in fragments:
                print(f"    note : la solution de la cellule {k} ne s'exécute pas seule (un morceau à placer ailleurs) ; son squelette a tourné à sa place")
            for x in croix:
                print(f"    ❌ {x}")
    sys.exit(1 if echec else 0)


if __name__ == "__main__":
    main()
