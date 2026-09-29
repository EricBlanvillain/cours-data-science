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

### La recette

`scripts/recette/recette.py` exécute les notebooks en mémoire, depuis leur dossier, avec `USE_MODEL = False` et `MODE_RAPIDE = True` forcés. Il ne réécrit rien, supprime les fichiers que le notebook a créés dans son dossier, et signale un notebook versionné qui contient des sorties. Avec `--solutions`, chaque solution repliée prend la place du premier trou de son squelette (une fonction à trous, un `x = None`, une valeur de départ comme `x = 0`) avant que le squelette ne tourne : toutes les vérifications d'exercice doivent alors afficher ✅. Une solution qui ne s'exécute pas seule (un morceau à coller ailleurs) est signalée et son squelette tourne à sa place.

Deux environnements, un par version de pandas, en Python 3.13 et avec les versions de l'image Colab (sources dans les fichiers requirements). pip doit y être disponible : les installations conditionnelles des notebooks l'appellent, comme sur Colab. Commandes lancées depuis la racine du dépôt :

```bash
python3.13 -m venv ~/.venvs/recette-pandas2 && ~/.venvs/recette-pandas2/bin/pip install -r scripts/recette/requirements-pandas-2.2.3.txt
python3.13 -m venv ~/.venvs/recette-pandas3 && ~/.venvs/recette-pandas3/bin/pip install -r scripts/recette/requirements-pandas-3.0.6.txt

~/.venvs/recette-pandas2/bin/python scripts/recette/recette.py --solutions seances/seance-05-analyser-raconter/05_exercices.ipynb
~/.venvs/recette-pandas3/bin/python scripts/recette/recette.py --solutions        # sans chemin : tous les notebooks du dépôt
```

Sur Mac, deux réglages que Colab (Linux) n'a pas besoin : xgboost cherche la bibliothèque OpenMP (`brew install libomp`, puis `DYLD_FALLBACK_LIBRARY_PATH=$(brew --prefix libomp)/lib` si Homebrew n'est pas dans `/opt/homebrew`) ; et un Python qui n'utilise pas le trousseau du système peut refuser les certificats HTTPS (réseau d'entreprise) : exporter les racines avec `security find-certificate -a -p /Library/Keychains/System.keychain /System/Library/Keychains/SystemRootCertificates.keychain > racines.pem` et pointer `SSL_CERT_FILE` et `REQUESTS_CA_BUNDLE` dessus.

Après une modification de notebook, on rejoue sa recette sous les deux environnements, l'un après l'autre (deux passages en parallèle sur le même dossier effaceraient les fichiers l'un de l'autre). Le script sort en code 1 si un notebook plante, contient des sorties ou, avec `--solutions`, affiche un ❌. Un module introuvable donne « SKIP : dépendance Colab », qui ne fait pas échouer.

### Où en est le dépôt

La convention est respectée par les **4 notebooks de `projets-avances/`** (A1, A2, A3, A6) et par les **15 notebooks d'exercices** des séances (`NN_exercices.ipynb`, `SO1_exercices.ipynb`, `SO2_exercices.ipynb`).

**pandas 3** : les trois cassures connues (04 ex 6, 05 ex 6, partie mémoire de SO2) sont réparées le 28/09/2026 ; ces carnets passent leur recette sous pandas 2.2 (Colab) comme sous pandas 3.0, solutions injectées. Le 29/09/2026, tout le dépôt a été recetté sous les deux versions, solutions injectées : aucun notebook ne plante, et aucun écart ne vient de pandas 3.

**Ordre des cellules** : depuis le 28/09/2026, aucune solution ne précède plus son squelette dans le dépôt. Les leçons 04 à 08 et les projets 1 à 3 n'ont pas de cellule de vérification pour leurs exercices « À toi » : leur solution suit directement le squelette.
