# Projet B2 · Un agent qui sait choisir son outil · ⭐⭐⭐

Piste agentique · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 10 et 12 (API, prompt système, boucle d'agent)

## Objectif

Un LLM tout seul calcule mal, ne connaît pas tes fichiers et ne sait pas quel temps il fait : il répond quand même, et il invente.
Cet agent sert à quiconque veut une réponse **vérifiable** : il a une boîte à outils Python (une calculatrice sûre, une recherche dans un fichier de données, une météo simulée) et doit choisir le bon outil, l'appeler, lire le résultat, et recommencer si l'outil renvoie une erreur.
À la fin, tu as une boucle d'agent écrite par toi — sans framework — avec au moins quatre outils, une trace lisible de chaque décision, et une série de tests où les outils échouent exprès.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `re` (le protocole `OUTIL: nom(args)`), `ast` (la calculatrice sûre), `json`, `pandas` | déjà installés dans Colab, rien à faire |
| `transformers` + `accelerate` (Qwen2.5-0.5B) | `!pip install -q transformers accelerate`, fait par la cellule quand `USE_MODEL = True` |
| Un CSV public chargé par URL (Pokémon ou celui de ton projet 1) | rien à installer, `pandas.read_csv(url)` |

**Aucune clé d'API, aucun appel réseau obligatoire.** La météo est **simulée** : une fonction Python qui renvoie une réponse plausible et déterministe à partir du nom de la ville, pour que l'agent tourne partout, même sans réseau. Le vrai appel à https://open-meteo.com/en/docs (gratuit et sans clé) est donné en commentaire, en option.
L'interrupteur `USE_MODEL` de la séance 12 est en haut du notebook : en mode démo, le faux modèle suit le protocole `OUTIL: nom(arguments)` dès que le prompt système le décrit — donc c'est bien **ta boucle** qui est testée.

## Déroulé (1 h 30)

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | Sections 0 et 1 : la Préparation, et le schéma « question → LLM → OUTIL → Python → résultat → réponse » |
| 10-30 min | Section 2 : écrire les outils un par un et les tester **sans agent** — `calculer` (avec `ast`, pas `eval`), `chercher_ligne`, `meteo`, `aujourdhui` |
| 30-50 min | Section 3 : la boucle, le prompt système qui décrit les outils, l'extraction par expression régulière, la trace |
| 50-65 min | Section 4 : le choix du bon outil — 6 questions de types différents, tableau « question → outil attendu → outil choisi » |
| 65-80 min | Section 5 : ce qui rate — outil inconnu, arguments invalides, division par zéro, ville inconnue, boucle infinie : chaque erreur revient au modèle en texte, et on borne le nombre de tours |
| 80-90 min | Section 6 : ajouter **ton** outil, refaire tourner la série de tests, remplir la fiche projet |

Si le temps manque : arrête-toi à la fin de la section 4 (l'agent marche et choisit). La gestion des erreurs de la section 5 fait une très bonne reprise au créneau suivant.

## Livrable

`B2_agent_outille.ipynb` complété : au moins **4 outils** (dont un écrit par toi), la boucle bornée, le tableau des 6 questions de test avec l'outil choisi, les 4 cas d'échec traités, et la fiche projet finale (les outils, ce que l'agent choisit bien, ce qu'il choisit mal, ce que tu ajouterais).

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. Les outils** | Un seul outil, ou des outils qui plantent | 4 outils testés séparément avant d'être branchés, chacun avec sa docstring et son exemple d'appel | Un 5e outil de ton cru, utile et documenté dans le prompt système |
| **2. La calculatrice** | `eval()` brut sur le texte du modèle | `ast.literal_eval` ou un parseur limité aux 4 opérations : `calculer("import os")` refuse proprement | Les cas limites sont testés (division par zéro, texte vide, parenthèses non fermées) et renvoient un message que le modèle peut comprendre |
| **3. La boucle** | Le modèle répond mais l'outil n'est jamais exécuté | `OUTIL: nom(args)` est extrait, exécuté, le résultat repart au modèle, la boucle est bornée (`max_tours`) | La trace affiche chaque tour (pensée, appel, résultat) et la boucle s'arrête proprement quand la borne est atteinte |
| **4. Le choix de l'outil** | Toujours le même outil, quelle que soit la question | Sur 6 questions de types différents, au moins 5 bons choix, notés dans un tableau | Les erreurs de choix sont analysées (description d'outil ambiguë ?) et corrigées en réécrivant le prompt système |
| **5. Les ratés** | Une erreur d'outil fait planter la cellule | Outil inconnu, mauvais arguments et exception sont renvoyés au modèle sous forme de message, sans planter | L'agent se rattrape : après un échec, il réessaie avec un autre outil ou d'autres arguments, et tu montres la trace |
| **6. Ça tourne** | Des cellules plantent | Tout s'exécute dans un Colab vierge en `USE_MODEL = False` **et** en `True` | La fiche projet est remplie, avec un cas d'échec expliqué et une piste de correction |

## Pour aller plus loin

- Remplace la météo simulée par le vrai appel **Open-Meteo** (gratuit, sans clé) et gère les cas réels : ville inconnue, réseau coupé, réponse lente.
- Passe du protocole texte `OUTIL: nom(args)` au **JSON** (`{"outil": "...", "arguments": {...}}`) : plus robuste à parser, c'est ce que font les vraies API de *function calling*.
- Ajoute un outil qui est lui-même un assistant : la recherche RAG du projet [B1](../B1-assistant-reviseur/) branchée comme outil `chercher_dans_mes_notes`. Un agent qui appelle un RAG, c'est l'architecture de la plupart des assistants d'entreprise.

## Liens utiles

- Le modèle utilisé, gratuit et sans clé : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Évaluer une expression sans `eval` : https://docs.python.org/fr/3/library/ast.html · les expressions régulières : https://docs.python.org/fr/3/library/re.html
- API météo gratuite et sans clé (option) : https://open-meteo.com/en/docs
- Ce qu'est un agent, en 40 pages : https://www.kaggle.com/whitepaper-agents
- Des patrons d'agents simples qui marchent mieux que les frameworks : https://www.anthropic.com/engineering/building-effective-agents
- Le *function calling* côté Kaggle : https://www.kaggle.com/code/markishere/day-3-function-calling-with-the-gemini-api
- Le CSV Pokémon utilisé par l'outil de recherche : https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
- La leçon dont ce projet est la suite : [séance 12 · Agents](../../../seances/seance-12-agents-et-projet-final/)
