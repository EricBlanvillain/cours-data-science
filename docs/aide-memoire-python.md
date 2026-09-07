# Aide-mémoire Python

Une page pour retrouver la syntaxe des séances 0 à 2. Dans Colab, `Maj + Entrée` exécute la cellule.

## Variables et types

| Code | Ce que ça fait |
|---|---|
| `nom = "Pikachu"` | Une chaîne de caractères (texte) |
| `niveau = 25` | Un entier |
| `poids = 6.5` | Un nombre à virgule (float) |
| `legendaire = False` | Un booléen : `True` ou `False` |
| `type(niveau)` | Donne le type d'une valeur (`int`, `float`, `str`, `bool`, `list`, `dict`) |
| `int("42")`, `float("3.5")`, `str(42)` | Convertir d'un type à l'autre |
| `print(nom, niveau)` | Afficher |
| `print(f"{nom} est niveau {niveau}")` | f-string : insérer des variables dans un texte |
| `input("Ton nom ? ")` | Demander une saisie (renvoie toujours du texte) |

## Opérations

| Code | Ce que ça fait |
|---|---|
| `+ - * /` | Les 4 opérations (`/` donne toujours un float) |
| `//` et `%` | Division entière et reste : `17 // 5` → 3, `17 % 5` → 2 |
| `**` | Puissance : `2 ** 10` → 1024 |
| `== != < <= > >=` | Comparaisons, renvoient `True` ou `False` |
| `and`, `or`, `not` | Combiner des conditions |
| `"a" + "b"`, `"ab" * 3` | Coller des textes, répéter |
| `len(x)` | Longueur d'un texte, d'une liste, d'un dictionnaire |
| `round(3.14159, 2)` | Arrondir → `3.14` |
| `min(...)`, `max(...)`, `sum(...)` | Minimum, maximum, somme d'une liste |

## Conditions

```python
if hp < 50:
    print("fragile")
elif hp < 100:
    print("solide")
else:
    print("tank")
```
L'indentation (4 espaces) délimite le bloc. Pas d'accolades.

## Boucles

| Code | Ce que ça fait |
|---|---|
| `for i in range(5):` | i vaut 0, 1, 2, 3, 4 |
| `for i in range(1, 11):` | de 1 à 10 |
| `for x in ma_liste:` | Parcourt chaque élément |
| `for i, x in enumerate(ma_liste):` | L'indice et l'élément |
| `for cle, valeur in d.items():` | Parcourt un dictionnaire |
| `while essais < 10:` | Tant que la condition est vraie |
| `break` / `continue` | Sortir de la boucle / passer au tour suivant |

## Listes

| Code | Ce que ça fait |
|---|---|
| `l = [3, 1, 2]` | Créer |
| `l[0]`, `l[-1]` | Premier, dernier élément (on compte à partir de 0) |
| `l[1:3]` | Tranche : éléments 1 et 2 (le 3 est exclu) |
| `l.append(4)` | Ajouter à la fin |
| `l.remove(1)` | Retirer la première occurrence de 1 |
| `l.sort()`, `sorted(l)` | Trier sur place / trier en renvoyant une copie |
| `3 in l` | Tester la présence |
| `[x * 2 for x in l]` | Compréhension : nouvelle liste transformée |
| `[x for x in l if x > 1]` | Compréhension avec filtre |
| `", ".join(["a", "b"])` | Coller une liste de textes → `"a, b"` |
| `"a,b,c".split(",")` | Découper un texte → `["a", "b", "c"]` |

## Dictionnaires

| Code | Ce que ça fait |
|---|---|
| `d = {"nom": "Pikachu", "pv": 35}` | Créer (clé → valeur) |
| `d["nom"]` | Lire une valeur (erreur si la clé n'existe pas) |
| `d.get("taille", 0)` | Lire avec une valeur par défaut |
| `d["pv"] = 40` | Modifier ou ajouter |
| `"nom" in d` | Tester une clé |
| `d.keys()`, `d.values()`, `d.items()` | Les clés, les valeurs, les paires |
| `del d["pv"]` | Supprimer une clé |

## Fonctions

```python
def aire_rectangle(largeur, hauteur=1):
    """Calcule l'aire. hauteur vaut 1 si on ne la donne pas."""
    return largeur * hauteur

aire_rectangle(3, 4)      # 12
aire_rectangle(3)         # 3
```
Une fonction sans `return` renvoie `None`. Les variables créées dedans n'existent que dedans.

## Chaînes de caractères

| Code | Ce que ça fait |
|---|---|
| `s.lower()`, `s.upper()` | Minuscules, majuscules |
| `s.strip()` | Enlever les espaces au début et à la fin |
| `s.replace("a", "b")` | Remplacer |
| `s.startswith("Pi")` | Commence par ? |
| `"chu" in s` | Contient ? |
| `s[0]`, `s[-3:]` | Premier caractère, trois derniers |

## Erreurs et exceptions

```python
try:
    nombre = int(input("Un nombre : "))
except ValueError:
    print("Ce n'est pas un nombre.")
```

| Message d'erreur | Cause habituelle |
|---|---|
| `NameError` | Variable jamais définie (ou cellule pas exécutée) |
| `SyntaxError` | Deux-points, parenthèse ou guillemet oublié |
| `IndentationError` | Espaces en trop ou en moins au début d'une ligne |
| `TypeError` | Mélange de types : `"5" + 3` |
| `KeyError` / `IndexError` | Clé absente du dictionnaire / indice trop grand |
| `ZeroDivisionError` | Division par zéro |

## Importer

| Code | Ce que ça fait |
|---|---|
| `import random` puis `random.randint(1, 100)` | Un entier au hasard entre 1 et 100 |
| `random.choice(l)` | Un élément au hasard |
| `import math` puis `math.sqrt(16)` | Racine carrée |
| `import pandas as pd` | pandas avec son surnom habituel |
| `from datetime import date` puis `date.today()` | La date du jour |
| `!pip install nom` | Installer une bibliothèque manquante (Colab) |
