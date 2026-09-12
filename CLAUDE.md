# CLAUDE.md

Cours de data science et d'IA : 12 séances, deux séances optionnelles, des projets, et une réserve de projets avancés. Tout est en français, tutoiement, et tout doit tourner gratuitement dans Google Colab.

## Convention des notebooks

**Ordre des cellules d'un exercice**, sans exception :

1. l'énoncé (markdown) — avec son indice replié s'il y en a un
2. le squelette `# À toi` (code), qui s'exécute tel quel
3. la cellule de vérification, qui affiche ✅ / ❌ via `verifier(nom, condition)`
4. la solution, repliée
5. le filet de sécurité, replié

Règles :

- **La solution ne précède jamais le squelette.** Elle n'est pas non plus dans la cellule d'énoncé : un participant qui lit dans l'ordre ne doit pas croiser la réponse avant l'exercice.
- **Solution et filet sont tous deux repliés, jamais en texte clair — mais pas par le même mécanisme**, et ce n'est pas un caprice :
  - la **solution** est faite pour être *lue*, jamais exécutée → un bloc `<details><summary>Solution</summary>` dans une cellule **markdown**, replié par défaut, comme partout dans le dépôt ;
  - le **filet** doit *s'exécuter* pour que le notebook aille au bout → une cellule de **code** repliée, dont la première ligne est `#@title 🛟 Filet de sécurité — déplie seulement si tu n'as pas fait l'exercice { display-mode: "form" }` et dont les métadonnées portent `"cellView": "form"` et `"jupyter": {"source_hidden": true}`. Du code placé dans un `<details>` serait inerte : c'est pour ça qu'on ne peut pas traiter les deux de la même façon.
- **Un filet uniquement là où il sert** : sur les exercices dont le résultat alimente une cellule suivante ou une cellule « Rapport ». Ailleurs, il n'apporte rien et fait du bruit. Le filet réinjecte l'implémentation de référence sous condition (`if <l'exercice n'est pas fait>:`), enveloppée dans un `try/except` pour ne jamais lever.
- **Interrupteur `USE_MODEL` dès qu'un modèle est utilisé**, avec son `llm_factice` : à `False`, le notebook s'exécute entièrement sans GPU ni clé d'API. C'est la condition de recette.
- **Installation conditionnelle des dépendances en tête** si le notebook importe autre chose que ce que Colab fournit (`optuna`, `shap`, `peft`…) : on teste avec `importlib.util.find_spec` et on n'installe que ce qui manque.
- **Aucun output enregistré** dans les notebooks versionnés.

Un notebook lourd porte en plus un drapeau `MODE_RAPIDE` en tête : à `True`, il s'exécute en entier en quelques minutes sur CPU.

### Où en est le dépôt

La convention est respectée par les **4 notebooks de `projets-avances/`** (A1, A2, A3, A6) et par les **15 notebooks d'exercices** des séances (`NN_exercices.ipynb`, `SO1_exercices.ipynb`, `SO2_exercices.ipynb`).

**Dette restante : 12 notebooks embarquent encore la solution dans la cellule d'énoncé**, donc avant le squelette — les 4 projets de `projets-optionnels/` (B1 à B4), les 3 projets de `projets/` (projets 1, 2 et 3), et les 5 leçons des séances 04 à 08. À aligner quand on y touchera pour autre chose ; ce n'est pas un chantier à ouvrir pour lui-même.
