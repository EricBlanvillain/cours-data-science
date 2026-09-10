# Projet B3 · L'analyste automatique (avec un humain dans la boucle) · ⭐⭐⭐

Piste agentique · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 4 et 5 (pandas, graphiques) et séance 12 (agents)

## Objectif

Devant un CSV inconnu, on refait toujours les mêmes gestes : regarder les colonnes, compter les valeurs manquantes, sortir des statistiques, puis choisir quoi tracer.
Cet agent sert à celui qui reçoit un fichier qu'il ne connaît pas : il fait ces gestes tout seul, écrit un mini-rapport en français et **propose** trois graphiques — mais il ne fait rien sans ton accord, tu valides ou tu refuses chaque étape.
À la fin, tu as un notebook qui prend n'importe quel CSV, en sort un rapport lisible, trois figures et un journal de tes décisions (accepté / refusé / modifié).

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `pandas` (`info`, `describe`, `isna`, `nunique`), `matplotlib`, `numpy` | déjà installés dans Colab, rien à faire |
| `transformers` + `accelerate` (Qwen2.5-0.5B) pour rédiger le rapport | `!pip install -q transformers accelerate`, fait par la cellule quand `USE_MODEL = True` |
| CSV publics chargés par URL (manchots, pourboires, Pokémon, ou le fichier de ton projet 1) | rien à installer, `pandas.read_csv(url)` |

**Aucune clé d'API.** Avec `USE_MODEL = False`, le faux modèle rédige le rapport à partir des chiffres que **ton** code a calculés : l'analyse est vraie, seule la rédaction est factice. Et surtout : **pas d'`input()`**. La validation humaine se fait en éditant une liste `DECISIONS` dans une cellule (`"oui"` / `"non"` / une consigne), puis en relançant — c'est reproductible et ça marche dans un notebook exécuté de haut en bas.

## Déroulé (1 h 30)

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | Sections 0 et 1 : la Préparation, le principe « l'agent propose, l'humain dispose », le plan en 4 étapes |
| 10-25 min | Section 2 : charger le CSV (le tien ou celui d'exemple) et écrire `decrire(df)` — forme, types, manquants, cardinalité — qui renvoie un **dictionnaire de faits**, pas du texte |
| 25-45 min | Section 3 : les statistiques utiles selon le type de colonne (numérique → moyenne, médiane, écart-type, extrêmes ; catégorielle → top 5 des valeurs) et les alertes automatiques (colonne vide, quasi-constante, identifiant, valeurs aberrantes) |
| 45-60 min | Section 4 : le mini-rapport — les faits sont donnés au modèle, qui les met en phrases ; tu vérifies qu'**aucun chiffre inventé** ne s'est glissé dedans |
| 60-80 min | Section 5 : les 3 graphiques proposés (une règle de choix : distribution, comparaison, relation), la validation `DECISIONS`, et le tracé de ceux que tu as acceptés |
| 80-90 min | Section 6 : le journal des décisions et la fiche projet |

Si le temps manque : arrête-toi à la fin de la section 4 (tu as le rapport écrit). Les propositions de graphiques et la validation font une reprise idéale au créneau suivant.

## Livrable

`B3_analyste_automatique.ipynb` complété sur **un CSV de ton choix** : le rapport automatique, les 3 graphiques proposés dont au moins 2 acceptés et tracés, le journal des décisions, et la fiche projet finale (ce que l'agent a bien vu, ce qu'il a raté, ce qu'un humain apporte encore).

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. L'exploration** | Un `df.head()` et rien d'autre | `decrire(df)` renvoie forme, types, manquants et cardinalité pour **n'importe quel** CSV, sans nom de colonne écrit en dur | Des alertes automatiques : colonne quasi-constante, identifiant déguisé, doublons, dates mal typées |
| **2. Les statistiques** | Un `describe()` brut recopié | Les statistiques sont choisies selon le type de colonne, et lues en une phrase chacune | Les valeurs aberrantes sont quantifiées (règle des 1,5 × écart interquartile) et discutées, pas seulement signalées |
| **3. Le rapport** | Du texte générique qui ne parle pas de ce fichier | Le rapport cite des chiffres qui viennent tous de ton code, et tient en 10 lignes lisibles | Tu as vérifié chaque chiffre du rapport contre le `dict` de faits, et tu montres un cas où le modèle a voulu en inventer un |
| **4. Les graphiques** | Trois graphiques au hasard | Trois types différents, justifiés par le type des colonnes, avec titre et axes nommés | Le graphique refusé est remplacé par un meilleur, et tu expliques la règle de choix que tu as codée |
| **5. L'humain dans la boucle** | L'agent fait tout sans demander | Chaque étape passe par `DECISIONS` : accepté, refusé, ou modifié — et le notebook respecte le refus | Le journal montre au moins un refus argumenté qui a changé le résultat final |
| **6. Ça tourne** | Ça marche sur un seul fichier | Le notebook tourne sur le CSV d'exemple **et** sur un second CSV, sans rien changer d'autre que l'URL | Un troisième fichier « difficile » (beaucoup de manquants, colonnes texte) est passé et l'agent ne plante pas |

## Pour aller plus loin

- Compare ton rapport à celui de **ydata-profiling** (`!pip install ydata-profiling`) : lui sort 100 pages, toi 10 lignes. Laquelle des deux sorties utiliserais-tu vraiment, et pourquoi ?
- Fais **écrire le code** du graphique au modèle plutôt que de le choisir dans une liste, et exécute-le seulement après relecture (c'est exactement le débat « l'agent qui exécute du code » en entreprise).
- Ajoute une étape « question métier » : l'agent propose 3 questions auxquelles ce fichier peut répondre, tu en choisis une, et il produit le graphique correspondant.

## Liens utiles

- Le modèle utilisé, gratuit et sans clé : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Prise en main de pandas en 10 minutes : https://pandas.pydata.org/docs/user_guide/10min.html · `describe()` : https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html
- Choisir son type de graphique (galerie matplotlib) : https://matplotlib.org/stable/plot_types/index.html · les cartes de chaleur : https://seaborn.pydata.org/generated/seaborn.heatmap.html
- CSV d'entraînement, sans compte : manchots https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv · pourboires https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv · Pokémon https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
- Ce qu'est un agent, en 40 pages : https://www.kaggle.com/whitepaper-agents
- Les leçons dont ce projet est la suite : [séance 5 · Analyser et raconter](../../../seances/seance-05-analyser-raconter/) et [séance 12 · Agents](../../../seances/seance-12-agents-et-projet-final/)
