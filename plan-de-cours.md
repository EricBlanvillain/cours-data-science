# Plan de cours · Atelier Data & IA en 12 séances

**Public :** débutants en programmation, curieux de la data et de l'IA. Avoir déjà touché à un langage (Python, Scratch, JavaScript…) aide, mais tout est repris depuis le début.
**Objectif :** consolider les bases de Python, découvrir le métier de data scientist, puis comprendre les principes derrière l'IA d'aujourd'hui (LLM, SLM, RAG, agents) et apprendre à bien utiliser les principaux outils.
**Format :** une séance 0 de prise de contact, puis 12 séances de 1 h 30 découpées en 4 blocs. Chaque séance suit le même rythme **15 / 60 / 15** : 15 min d'explication, 60 min de pratique sur un projet, 15 min de partage de ce que chacun a construit (détail dans [docs/deroule-type-seance.md](docs/deroule-type-seance.md)).

**Le notebook de leçon se fait toujours ensemble, en séance.** Ce qui n'a pas été fini n'est jamais renvoyé à la maison : chaque séance a un **point de reprise** noté dans son README, et on repart de là au créneau suivant. Une séance dense peut donc s'étaler sur deux créneaux — compter 16 à 17 créneaux de 1 h 30 pour les 13 séances. Le seul travail personnel, c'est le notebook d'exercices `NN_exercices.ipynb` de la séance : 12 exercices ⭐ à ⭐⭐⭐ corrigés automatiquement.
**Outils :** Google Colab (Python sans installation), Kaggle (données et notebooks), SQLite (SQL), GitHub, ChatGPT / Claude / Mistral, Hugging Face. Tout est gratuit et tourne dans le navigateur.

**Le fil conducteur :** à la fin du parcours, chacun repart avec un portfolio GitHub de 4 projets réalisés de ses mains, dont un projet Kaggle et un assistant IA construit soi-même.

---

## Comment lire les niveaux

> Chaque séance, chaque exercice et chaque projet porte un niveau :
>
> | Niveau | Ce que ça veut dire |
> |---|---|
> | ⭐ Débutant | Tout est guidé. On recopie, on modifie, on observe. Aucun prérequis. |
> | ⭐⭐ Intermédiaire | On combine plusieurs notions vues avant. Il faut chercher un peu, l'indice aide. |
> | ⭐⭐⭐ Avancé | On construit quelque chose de complet ou on résout un problème ouvert. La solution n'est pas unique. |
>
> Les niveaux montent au fil du parcours (⭐ au bloc 1, ⭐⭐⭐ au bloc 4), mais chaque notebook d'exercices contient les trois niveaux : on s'arrête là où on en est, et on revient plus tard. Un exercice ⭐⭐⭐ non fini n'est pas un échec, c'est une réserve pour la prochaine fois.

---

## Vue d'ensemble

| Séance | Titre | Niveau | Livrable | Projet alimenté |
|---|---|---|---|---|
| 0 | Faire connaissance | ⭐ | Un notebook Colab qui tourne, un compte GitHub avec un premier dépôt | — (mise en place) |
| 1 | Introduction à l'IA | ⭐ | Un modèle Teachable Machine, la fiche « mes 5 règles de prompt » | Projet 4 (prompting) |
| 2 | Python pour la data | ⭐ | 3 questions, 3 graphiques sur un dataset | Projet 1 |
| 3 | SQL et Git | ⭐ | Le projet 1 en ligne sur GitHub avec un README | Projet 1 |
| 4 | Collecter et nettoyer | ⭐⭐ | Un dataset nettoyé et le journal des corrections | Projet 2 |
| 5 | Analyser et raconter | ⭐⭐ | Un mini-dashboard présenté en 2 min | Projet 2 |
| 6 | Premier modèle | ⭐⭐ | Un modèle entraîné, évalué, expliqué en une phrase | Projet 2 |
| 7 | Kaggle Titanic 1/2 | ⭐⭐ | Une première soumission Kaggle et son score | Projet 3 |
| 8 | Kaggle Titanic 2/2 | ⭐⭐⭐ | Soumission finale, notebook sur GitHub, présentation de 5 min | Projet 3 |
| 9 | Comment fonctionne un LLM | ⭐⭐ | Un petit modèle qu'on a fait halluciner, la fiche « 3 limites » | Projet 4 |
| 10 | Parler à un LLM par le code | ⭐⭐ | Un chatbot personnalisé qui fonctionne | Projet 4 |
| 11 | Le RAG | ⭐⭐⭐ | Un assistant qui répond sur ses propres documents | Projet 4 |
| 12 | Agents et projet final | ⭐⭐⭐ | Un portfolio GitHub complet et une présentation finale | Projets 1 à 4 |

Chaque dossier `seances/seance-NN-<nom>/` contient un `README.md` (déroulé minuté), la leçon `NN_<nom>.ipynb` et les exercices `NN_exercices.ipynb` (au moins 10 exercices, des ⭐ aux ⭐⭐⭐, avec vérification automatique et solution cachée). Les 4 projets sont décrits dans `projets/`.

---

## Séance 0 · Faire connaissance ⭐ (1 h 30)

Objectif : comprendre le niveau réel de chacun, ce qui a déjà été fait et ce que chacun a envie de construire.

- Tour de table : les langages vus, les projets déjà réalisés, les outils déjà utilisés (ChatGPT ? un moteur de jeu ? Scratch ? des mods ?)
- Petit exercice diagnostic en Python (10 min) : variables, boucles, fonctions, listes. Pas noté, juste pour calibrer
- Brainstorm des projets que chacun aimerait faire (jeu, bot, appli, analyse de ses stats de jeux vidéo ou de musique…). Ces envies servent à choisir les datasets et les projets des blocs suivants
- Mise en place des comptes : Google Colab, Kaggle, GitHub (voir [docs/avant-la-premiere-seance.md](docs/avant-la-premiere-seance.md))
- Projet fil rouge de la séance : le jeu du nombre mystère, puis une amélioration au choix

Fichiers : `seances/seance-00-faire-connaissance/00_faire_connaissance.ipynb` (leçon) · `00_exercices.ipynb` (exercices)
Projet alimenté : aucun, c'est la mise en place. Le dépôt `mon-portfolio-ia` créé ici accueillera les 4 projets.

Livrable : chacun a un notebook Colab qui tourne et un compte GitHub avec un premier dépôt.

---

## Bloc 1 · Les bases solides (3 séances)

### Séance 1 · Introduction à l'intelligence artificielle ⭐

- Quiz d'ouverture : « est-ce de l'IA ou pas ? » (filtre anti-spam, recommandation YouTube, ChatGPT, calculatrice, GPS)
- Les trois cercles : IA, machine learning, deep learning. D'où vient l'IA générative
- Comment une machine « apprend » : exemples, erreurs, correction. Simulation d'un seuil qui s'ajuste, puis démo visuelle avec Teachable Machine : chacun entraîne en direct un modèle qui reconnaît ses gestes à la webcam
- Panorama des outils d'aujourd'hui : ChatGPT, Claude, Mistral, Gemini, Midjourney, Suno, Cursor. Ce que chacun fait bien, ce que chacun fait mal
- Atelier : les 5 règles d'un bon prompt (contexte, rôle, tâche, format, exemple). Concours du meilleur prompt sur un défi imposé (grille dans [docs/fiche-5-regles-du-prompt.md](docs/fiche-5-regles-du-prompt.md))

Fichiers : `seances/seance-01-introduction-ia/01_introduction_ia.ipynb` · `01_exercices.ipynb` (exercices de raisonnement : quiz IA ou pas, ML ou règles, score de prompt, simulation de seuil)
Projet alimenté : Projet 4 (les 5 règles de prompt resserviront pour le chatbot et le RAG).

Livrable : un modèle Teachable Machine entraîné, et une fiche « mes 5 règles de prompt ».

### Séance 2 · Python pour la data ⭐

- Rappels rapides : fonctions, listes, dictionnaires, boucles
- Découverte de pandas : charger un fichier CSV, regarder les colonnes, filtrer, trier, compter, regrouper
- Premiers graphiques avec matplotlib : barres, nuage de points, histogramme
- Projet : analyser un dataset choisi à la séance 0 (ventes de jeux vidéo, films Netflix, Pokémon, chansons Spotify…)

Fichiers : `seances/seance-02-python-pour-la-data/02_python_pour_la_data.ipynb` · `02_exercices.ipynb`
Projet alimenté : Projet 1, « 3 questions, 3 graphiques ».

Livrable : un notebook avec 3 questions posées sur le dataset et 3 graphiques qui y répondent.

### Séance 3 · SQL et Git, les outils du quotidien ⭐

- SQL : à quoi ça sert, où sont stockées les données d'une appli. SELECT, WHERE, ORDER BY, GROUP BY, un premier JOIN. Pratique sur SQLite directement dans Colab
- Git et GitHub : pourquoi les développeurs sauvegardent leur travail en versions. Les 4 commandes de base (add, commit, push, pull). Chacun pousse son projet de la séance 2 sur son dépôt
- Mini-défi : retrouver la même réponse à une question une fois en SQL, une fois en pandas

Fichiers : `seances/seance-03-sql-et-git/03_sql_et_git.ipynb` · `03_exercices.ipynb`
Projet alimenté : Projet 1 (mise en ligne sur GitHub avec README).

Livrable : le premier projet est en ligne sur GitHub, avec un README qui l'explique.

---

## Bloc 2 · Le métier de data scientist (3 séances)

### Séance 4 · Collecter et nettoyer les données ⭐⭐

- Une journée de data scientist : d'où viennent les données, à quoi ressemble un vrai jeu de données (sale, incomplet, plein de pièges)
- Les étapes du métier : collecte, nettoyage, analyse, modélisation, restitution
- Pratique : nettoyer un dataset volontairement abîmé (valeurs manquantes, doublons, formats de dates incohérents, fautes de frappe dans les catégories) en tenant un journal des corrections
- Récupérer des données soi-même : une API simple (météo Open-Meteo, PokéAPI, données publiques)

Fichiers : `seances/seance-04-collecter-nettoyer/04_collecter_nettoyer.ipynb` · `04_exercices.ipynb`
Projet alimenté : Projet 2, étape « nettoyage ».

Livrable : un dataset nettoyé et un notebook qui documente chaque correction faite.

### Séance 5 · Analyser et raconter une histoire avec les données ⭐⭐

- L'analyse exploratoire : quelles questions poser, comment repérer une tendance, une anomalie, une corrélation
- Ne pas se faire piéger : corrélation et causalité, graphiques trompeurs, biais dans les données
- Dashboarding : construire un petit tableau de bord interactif avec Plotly (Streamlit montré en lecture)
- Le pitch : constat, preuve, recommandation

Fichiers : `seances/seance-05-analyser-raconter/05_analyser_raconter.ipynb` · `05_exercices.ipynb`
Projet alimenté : Projet 2, étape « dashboard ».

Livrable : un mini-dashboard présenté à voix haute en 2 minutes, comme devant un « client ».

### Séance 6 · Modéliser, premier modèle de machine learning ⭐⭐

- Apprentissage supervisé expliqué simplement : on montre des exemples avec la réponse, la machine trouve la règle
- Classification vs régression avec des exemples du quotidien (ce mail est-il un spam ? combien de vues aura cette vidéo ?)
- Entraînement / test : pourquoi on cache une partie des données. Notion de précision d'un modèle, et du « modèle bête » à battre
- Pratique avec scikit-learn : arbre de décision, k plus proches voisins, la courbe du sur-apprentissage, une première régression. On mesure, on améliore

Fichiers : `seances/seance-06-premier-modele/06_premier_modele.ipynb` · `06_exercices.ipynb`
Projet alimenté : Projet 2, étape « premier modèle ».

Livrable : un premier modèle entraîné et évalué, avec une phrase pour expliquer ce qu'il a compris.

---

## Bloc 3 · Projet Kaggle en séance supervisée (2 séances)

### Séances 7 et 8 · Compétition Kaggle « Titanic » (ou « Spaceship Titanic » pour une version plus ludique)

C'est le grand projet du parcours. Kaggle est la plateforme où les data scientists du monde entier s'entraînent. La compétition Titanic est le point d'entrée classique : prédire quels passagers ont survécu à partir de leur âge, classe, sexe, famille à bord.

Pourquoi c'est un bon choix : les données sont petites, l'histoire est connue, il y a un classement public qui motive, et on progresse par étapes visibles.

Travail en binômes, le formateur passe de table en table. Chaque binôme présente sa démarche à la fin (grille dans [docs/grille-evaluation.md](docs/grille-evaluation.md)). Avant la séance 7 : compte Kaggle créé, compétition rejointe, `train.csv` et `test.csv` téléchargés (voir [docs/guide-kaggle.md](docs/guide-kaggle.md)).

#### Séance 7 · Kaggle Titanic 1/2 : explorer, préparer, première soumission ⭐⭐

- Explorer les données, formuler des hypothèses (les enfants ont-ils été sauvés en priorité ? la classe compte-t-elle ?) et les vérifier avec des chiffres et des graphiques
- Nettoyer les cases vides, créer de nouvelles variables (taille de la famille, voyage seul, titre extrait du nom)
- Premier modèle mesuré par validation croisée, première soumission au classement

Fichiers : `seances/seance-07-kaggle-titanic-1/07_kaggle_titanic_1.ipynb` · `07_exercices.ipynb`
Projet alimenté : Projet 3, première moitié.

Livrable : une première soumission Kaggle et son score, noté dans le notebook.

#### Séance 8 · Kaggle Titanic 2/2 : améliorer le score et présenter ⭐⭐⭐

- Comparer 4 modèles dans un tableau, comprendre pourquoi l'un marche mieux que l'autre (importance des variables)
- Voir le sur-apprentissage sur une courbe train / validation, régler des hyperparamètres avec `GridSearchCV`
- Les pièges : fuite de données, score trop beau pour être vrai, la règle bête à battre
- Soumission finale et comparaison des scores dans le groupe, présentation de 5 minutes par binôme

Fichiers : `seances/seance-08-kaggle-titanic-2/08_kaggle_titanic_2.ipynb` · `08_exercices.ipynb`
Projet alimenté : Projet 3, version finale.

Livrable : une soumission Kaggle avec un score, le notebook complet sur GitHub, et une présentation de 5 minutes.

---

## Bloc 4 · Comprendre et construire avec l'IA générative (4 séances)

### Séance 9 · Comment fonctionne un LLM ⭐⭐

- Du texte au nombre : les tokens, démo en direct avec un tokenizer
- L'idée centrale : prédire le mot suivant. On construit soi-même un mini-modèle (bigramme) pour le sentir, puis la température
- Ce qu'un LLM sait et ne sait pas : hallucinations, date de connaissance, pourquoi il se trompe en calcul
- LLM vs SLM : les gros modèles dans le cloud, les petits modèles qu'on fait tourner sur son propre ordinateur (démo Ollama sur la machine du formateur ; dans Colab, un petit modèle ouvert tourne sur le GPU gratuit)
- Pourquoi les anciennes méthodes de NLP (sacs de mots, classification de spam à la main) ont été remplacées par ces modèles

Fichiers : `seances/seance-09-comment-fonctionne-un-llm/09_comment_fonctionne_un_llm.ipynb` · `09_exercices.ipynb` (vérifiables sans modèle, `USE_MODEL = False`)
Projet alimenté : Projet 4, fondations.

Livrable : chacun fait tourner un petit modèle et le fait « halluciner » volontairement, et remplit une fiche « 3 limites d'un LLM » observées par lui-même.

### Séance 10 · Parler à un LLM par le code ⭐⭐

- Utiliser une API : envoyer une question à un modèle depuis Python et récupérer la réponse. Les 3 rôles system / user / assistant
- Le prompt système : donner une personnalité et des règles à son assistant
- Garder l'historique d'une conversation
- Sortie structurée : demander une réponse en JSON pour la réutiliser dans un programme (avec `try / except` et redemande)
- Projet : un bot à thème (coach de révisions, générateur de quiz, maître de jeu) dans un notebook, Streamlit en bonus

Fichiers : `seances/seance-10-parler-a-un-llm-par-le-code/10_parler_a_un_llm_par_le_code.ipynb` · `10_exercices.ipynb`
Projet alimenté : Projet 4, le chatbot.

Livrable : un chatbot personnalisé qui fonctionne, avec sa personnalité et ses règles.

### Séance 11 · Le RAG, donner de la mémoire à son IA ⭐⭐⭐

- Le problème : le modèle ne connaît pas mes documents. La solution : lui donner les bons passages au bon moment (l'examen à livre ouvert)
- Les embeddings expliqués avec une image : des textes proches sont des points proches dans l'espace. La similarité cosinus
- Construire un RAG pas à pas : découper des documents en chunks, les transformer en vecteurs, chercher les passages pertinents, les injecter dans le prompt, répondre
- Projet : « pose une question à ton cours ». Chacun construit un assistant qui répond à partir de ses propres notes (ou des règles d'un jeu, ou d'un livre qu'il aime)

Fichiers : `seances/seance-11-rag/11_rag.ipynb` · `11_exercices.ipynb`
Projet alimenté : Projet 4, le RAG.

Livrable : un assistant RAG qui répond à des questions sur des documents choisis par chacun.

### Séance 12 · Les agents et projet final ⭐⭐⭐

- Un agent, c'est un LLM qui peut agir : appeler des outils, chercher dans des données, exécuter du code, enchaîner des étapes. On en construit un sans framework, avec 3 outils Python
- Démo : un agent qui reçoit une question, décide d'aller chercher dans le RAG de la séance 11, puis répond. Banc de test de ce qui peut rater
- Les bonnes pratiques : vérifier les réponses, ne pas partager de données personnelles, savoir quand l'IA se trompe, utiliser l'IA pour apprendre plutôt que pour copier
- Projet final : finaliser son portfolio GitHub (4 projets, un README chacun) et présenter son projet préféré au groupe et aux invités

Fichiers : `seances/seance-12-agents-et-projet-final/12_agents_et_projet_final.ipynb` · `12_exercices.ipynb`
Projet alimenté : Projet 4 (l'agent) et finalisation des projets 1 à 4.

Livrable : un portfolio GitHub complet et une présentation finale.

---

## Récapitulatif des projets réalisés

| Bloc | Projet | Séances | Niveau | Ce qu'on repart avec |
|---|---|---|---|---|
| 1 | Projet 1 · Analyse d'un dataset de son choix | 2, 3 | ⭐ | Premier notebook sur GitHub |
| 2 | Projet 2 · Nettoyage, dashboard et premier modèle | 4, 5, 6 | ⭐⭐ | Un dashboard présenté à l'oral, un modèle évalué |
| 3 | Projet 3 · Compétition Kaggle Titanic | 7, 8 | ⭐⭐⭐ | Un score au classement mondial |
| 4 | Projet 4 · Chatbot, RAG et agent | 1, 9 à 12 | ⭐⭐⭐ | Un assistant IA construit par soi-même |

Les énoncés détaillés, les datasets Kaggle et les critères de réussite sont dans `projets/`. L'évaluation commune (projets et présentations) est dans [docs/grille-evaluation.md](docs/grille-evaluation.md).

## Modules optionnels

Trois modules vivent en dehors du parcours en 12 séances — deux séances et un module de projets. Ils ne sont ni des prérequis ni des séances à rattraper : on les prend quand le groupe en a envie, ou quand il bute sur les questions qu'ils traitent.

### Module 1 · Les métiers de la data science ⭐ (1 h 30)

Une séance de culture technique, à prendre en amont : elle répond à « pourquoi Python, et pas un autre langage ? » et à « combien ça coûte, au juste ? ».

- Le comparatif honnête des langages de la data — Python, **R** (statistiques, `ggplot2`, recherche académique, biostatistique, et ses limites dès qu'il faut industrialiser), SQL, Rust/C++, JavaScript : ce que chacun sait faire, sa limite, qui l'utilise
- Qui gère la mémoire, et ce que ça coûte au programmeur : ramasse-miettes en Python et en R, gestion explicite en C, garantie à la compilation en Rust
- Le coût d'un modèle : tokens et euros, l'heure de GPU, et pourquoi on prototype toujours sur un échantillon

Fichiers : [`seances-optionnelles/seance-optionnelle-1-metiers-data-science/`](seances-optionnelles/seance-optionnelle-1-metiers-data-science/) — leçon, 12 exercices ⭐ à ⭐⭐⭐.

Ils repartent avec : leur fiche [`docs/fiche-choisir-ses-outils.md`](docs/fiche-choisir-ses-outils.md) remplie — le langage et le modèle qu'ils retiennent pour leur projet, avec leurs chiffres.

### Module 2 · Software engineering, limites et contraintes dans un contexte de développement ⭐ (1 h 30)

Une séance de culture technique, à prendre quand la question « pourquoi Python ? pourquoi c'est lent ? où je fais tourner ça ? » arrive d'elle-même — souvent après la séance 2 ou 4.

- Pourquoi Python est lent et comment on le contourne : une boucle contre NumPy sur 5 millions de valeurs, chronométrées ; la vectorisation ; pandas et NumPy écrits en C ; Polars, écrit en Rust
- La mémoire, en la mesurant : `df.info(memory_usage="deep")`, le gain du `dtype` `category`, la lecture par morceaux avec `chunksize`, ramasse-miettes contre gestion explicite
- Local ou cloud : sa machine, Colab, un serveur loué — mise en route, puissance, persistance, coût ; ce que Colab masque (`!pip list`) et la reproductibilité avec `requirements.txt`

Fichiers : [`seances-optionnelles/seance-optionnelle-2-software-engineering/`](seances-optionnelles/seance-optionnelle-2-software-engineering/) — leçon, 12 exercices ⭐ à ⭐⭐⭐.

Ils repartent avec : le `requirements.txt` de leur propre projet, et leur fiche « où faire tourner mon projet » avec la décision et le chiffre qui la justifie.

### Module 3 · Projet avancé IA agentique, de la conception à la production ⭐⭐⭐

Quatre projets pour construire avec un LLM, après les séances 9 à 12. Sans clé d'API et sans GPU obligatoire : le petit modèle tourne dans Colab, et l'interrupteur `USE_MODEL` permet de travailler hors ligne.

| Projet | Ce qu'on construit |
|---|---|
| B1 · Assistant réviseur | Un assistant qui lit ses propres cours et pose des questions de révision |
| B2 · Agent outillé | Un agent qui choisit le bon outil Python et se rattrape quand un outil échoue |
| B3 · Analyste automatique | Un agent qui explore un CSV seul, écrit un mini-rapport et propose 3 graphiques |
| B4 · Fiabiliser un assistant | Un banc de test de 15 questions, la mesure des hallucinations, des garde-fous |

Fichiers : [`projets-optionnels/projet-optionnel-avance-ia-agentique/`](projets-optionnels/projet-optionnel-avance-ia-agentique/) — un dossier par projet, avec sa fiche et sa grille En route / Atteint / Dépassé.

## Pour aller plus loin

Six projets « pipeline complet » restent dans le dépôt comme une réserve : nettoyage, feature engineering, analyse, modèles candidats, **tuning ou fine-tuning**, interprétation, recommandation — avec scikit-learn, XGBoost, TensorFlow et Hugging Face. Énergie des bâtiments, scoring crédit, reconnaissance d'images, séries temporelles, classification et génération de texte. Ils ne constituent pas un module et ne s'inscrivent dans aucun parcours : on en pioche un quand on veut creuser un sujet. Voir [projets-avances/README.md](projets-avances/README.md).

## Points d'attention

- Pas d'installation compliquée : tout tourne dans le navigateur (Colab, Kaggle). Les modèles en local (Ollama) sont une démo sur la machine du formateur, puis optionnels chez soi
- Chaque séance produit quelque chose de visible qu'on peut montrer
- Les datasets sont choisis avec le groupe à la séance 0 pour coller aux centres d'intérêt de chacun
- Les niveaux ⭐ permettent à un groupe hétérogène d'avancer ensemble : les exercices ⭐ pour tout le monde, les ⭐⭐⭐ pour ceux qui vont vite
- Les clés d'API, quand il y en a, sont fournies et gérées par le formateur, avec un budget plafonné. Le parcours fonctionne entièrement sans clé grâce à un petit modèle ouvert qui tourne dans Colab
- Le plan est modulable : si le groupe avance vite, on ajoute une séance sur la génération d'images ou sur le fine-tuning d'un petit modèle ; si un bloc demande plus de temps, on ajuste
- Une séance non terminée se poursuit au créneau suivant, jamais à la maison. Les séances 5, 8 et 12 débordent le plus souvent (dashboard et pitch, présentations en binômes, présentations finales) : leur prévoir une reprise dès le calendrier

## Supports existants réutilisés

Une partie du matériel vient de supports de formation existants : introduction à la data science et à l'IA, ateliers « Qu'est-ce que l'IA générative », modules Python pour la data, Data Analysis, SQL for Data Science, Dashboarding et NLP. Ils ont été adaptés et simplifiés pour un public débutant. Les aide-mémoires, guides et fiches qui en sont tirés sont dans `docs/`, et les liens dans [liens-utiles.md](liens-utiles.md).
