# Projet 1 · Analyse d'un dataset de ton choix ⭐

Bloc 1 · Les bases solides (séances 2 et 3) · Niveau ⭐ Débutant

## Objectif

Choisir un vrai dataset publié sur Kaggle, l'explorer avec pandas, poser **3 questions** et y répondre avec **3 graphiques** matplotlib. C'est ton premier notebook de portfolio : à la séance 3, il part sur GitHub avec un README.

## Dataset (au choix)

| `DATASET` | Contenu | Page Kaggle | Miroir chargé par le notebook |
|---|---|---|---|
| `jeux_video` | 26 688 jeux Steam : prix, propriétaires, temps de jeu, metascore | https://www.kaggle.com/datasets/gregorut/videogamesales | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-07-30/video_games.csv |
| `netflix` | 7 787 films et séries : type, pays, année, genres, durée | https://www.kaggle.com/datasets/shivamb/netflix-shows | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-04-20/netflix_titles.csv |
| `spotify` | 32 833 morceaux : popularité, genre, danceability, energy, tempo | https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-01-21/spotify_songs.csv |
| `pokemon` | 800 Pokémon : types, PV, attaque, défense, vitesse, légendaire | https://www.kaggle.com/datasets/abcsds/pokemon | https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv |

Le notebook charge le miroir automatiquement (pas de compte Kaggle nécessaire). Pour utiliser le fichier téléchargé sur Kaggle, dépose-le dans Colab et renseigne `FICHIER_LOCAL`. Attention, pour les jeux vidéo, le fichier Kaggle `vgsales.csv` (ventes par région) n'a pas les mêmes colonnes que le miroir Steam.

## Étapes (2 h, plus le temps de publication à la séance 3)

| Étape | Durée | Ce que tu fais |
|---|---|---|
| 0. Choisir | 5 min | `DATASET = "..."` dans le notebook, lire la page Kaggle du dataset |
| 1. Découvrir | 10 min | lignes, colonnes, types, cases vides, une phrase « une ligne = ... » |
| 2. Préparer | 10 min | les colonnes utiles (année, nombres extraits du texte), `value_counts` |
| 3. Trois questions, trois graphiques | 45 min | compter une catégorie, comparer une moyenne, suivre une évolution ; puis une 4e question libre |
| 4. Raconter | 15 min | générer le README avec tes questions et réponses |
| 5. Publier (séance 3) | 20 min | sauvegarder le notebook et le README sur ton dépôt GitHub |

## Livrable

`projet_1_analyse.ipynb` exécuté (avec ses graphiques) et un `README.md`, sur ton dépôt GitHub.

## Critères de réussite

- [ ] Le notebook s'exécute de bout en bout sans erreur (*Exécution → Tout exécuter*).
- [ ] 3 questions écrites avec tes mots (pas les titres automatiques), chacune avec un graphique titré et une réponse en une phrase.
- [ ] Une phrase dit ce que représente une ligne du dataset.
- [ ] Le README indique la source Kaggle, les questions, les réponses et comment lancer le notebook.
- [ ] Bonus : une 4e question d'un type différent (nuage de points, histogramme, comparaison de deux groupes).

La cellule « Auto-vérification » du notebook affiche ✅/❌ pour la plupart de ces points.

## Pour aller plus loin

- Changer seulement `DATASET` et relancer : ton code marche-t-il encore sur un autre dataset ? Sinon, qu'est-ce qui dépend des colonnes ?
- Refaire une question en SQL (séance 3) : même réponse ?
- Reproduire un graphique vu dans un notebook Kaggle de référence.

## Notebooks Kaggle de référence

- Jeux vidéo : [EDA - Video Game Sales](https://www.kaggle.com/code/upadorprofzs/eda-video-game-sales) · [Video Games Sales : EDA + modelization](https://www.kaggle.com/code/aleatoire/video-games-sales-eda-modelization)
- Netflix : [Netflix Shows and Movies - Exploratory Analysis](https://www.kaggle.com/code/shivamb/netflix-shows-and-movies-exploratory-analysis) (par l'auteur du dataset) · [Netflix Data Visualization](https://www.kaggle.com/code/joshuaswords/netflix-data-visualization)
- Spotify : [Spotify Songs Attributes - EDA](https://www.kaggle.com/code/cnic92/spotify-songs-attributes-eda) · [Spotify EDA and Track Popularity Prediction](https://www.kaggle.com/code/mamxlam/spotify-eda-and-track-popularity-prediction)
- Pokémon : [Visualizing Pokémon Stats with Seaborn](https://www.kaggle.com/code/ndrewgele/visualizing-pok-mon-stats-with-seaborn)
- Pour apprendre : cours gratuits Kaggle [Pandas](https://www.kaggle.com/learn/pandas) et [Data Visualization](https://www.kaggle.com/learn/data-visualization) · [Data ScienceTutorial for Beginners](https://www.kaggle.com/code/kanncaa1/data-sciencetutorial-for-beginners)
