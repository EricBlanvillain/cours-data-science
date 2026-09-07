# Projet 2 · Nettoyage, dashboard et premier modèle ⭐⭐

Bloc 2 · Le métier de data scientist (séances 4, 5 et 6) · Niveau ⭐⭐ Intermédiaire

## Objectif

Refaire sur ton dataset du projet 1 le travail complet d'un data scientist : **nettoyer** en documentant chaque correction (S4), construire un **dashboard Plotly** de 3 graphiques interactifs (S5), entraîner et évaluer un **premier modèle scikit-learn** qui prédit quelque chose d'utile (S6), et **présenter** le tout à un « client » en 2 minutes.

## Dataset

Le même que ton projet 1 (variable `DATASET`), chargé depuis le miroir public. Ce que le modèle apprend à prédire :

| `DATASET` | Page Kaggle | Cible du modèle | Variables d'entrée |
|---|---|---|---|
| `jeux_video` | https://www.kaggle.com/datasets/gregorut/videogamesales (miroir Steam TidyTuesday) | le jeu a-t-il plus de 100 000 propriétaires ? (15 % des jeux) | prix, année, temps de jeu moyen et médian |
| `netflix` | https://www.kaggle.com/datasets/shivamb/netflix-shows | film (1) ou série (0) ? | année de sortie, année d'ajout, nombre de genres, taille du casting, longueur de la description |
| `spotify` | https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs | morceau populaire (popularité ≥ 50) ? | danceability, energy, loudness, valence, tempo, durée, année... |
| `pokemon` | https://www.kaggle.com/datasets/abcsds/pokemon | légendaire ? (8 % des Pokémon) | PV, attaque, défense, attaque et défense spéciales, vitesse, génération |

Les miroirs sont listés dans le [README des projets](../README.md). Les cibles sont volontairement de difficulté variable : sur Spotify ou Netflix, un modèle honnête ne dépasse que de quelques points le modèle « bête » ; c'est une bonne occasion de parler de ce qu'on peut et ne peut pas prédire.

## Étapes (3 séances, ~40-50 min de projet par séance)

| Étape | Séance | Durée | Ce que tu fais |
|---|---|---|---|
| 1. Nettoyer et documenter | S4 | 40 min | lire `nettoyer()`, ajouter au moins une correction, remplir `JOURNAL` |
| 2. Dashboard Plotly | S5 | 40 min | 3 graphiques interactifs avec une question en titre, remplacer au moins l'un d'eux par le tien, écrire le pitch constat / preuve / recommandation |
| 3. Premier modèle | S6 | 50 min | train/test, modèle bête vs régression logistique vs forêt, matrice de confusion, importance des variables, 2 essais d'amélioration notés dans `ESSAIS` |
| 4. Présentation client | S6 | 2 min par personne | problème, données, résultat, recommandation ; le groupe joue le client |

## Livrable

`projet_2_dashboard_modele.ipynb` exécuté (dashboard visible, journal de nettoyage, tableau des essais), un README mis à jour sur GitHub, et la présentation orale de 2 minutes.

## Critères de réussite

- [ ] Le journal de nettoyage contient au moins 2 corrections, dont une à toi, avec le nombre de lignes concernées.
- [ ] 3 graphiques Plotly avec un titre qui est une question, et un pitch constat / preuve / recommandation.
- [ ] Le modèle est comparé au modèle « bête » (classe majoritaire) et la matrice de confusion est commentée (combien de vrais « oui » trouvés).
- [ ] Au moins 2 essais d'amélioration notés (nouvelle variable ou réglage), avec la précision avant/après.
- [ ] Une phrase explique ce que le modèle a compris (quelles variables comptent).
- [ ] Présentation en 2 minutes : problème, données, résultat, recommandation.

La cellule d'auto-vérification du notebook affiche ✅/❌ pour ces points.

## Pour aller plus loin

- Transformer le dashboard en application Streamlit (`st.plotly_chart`) et la déployer depuis GitHub sur Streamlit Community Cloud.
- Passer en régression : prédire la valeur elle-même (prix, popularité, Total) avec `RandomForestRegressor` et mesurer l'erreur moyenne.
- Chercher les variables créées dans un notebook Kaggle de référence et tester si elles améliorent ton modèle.

## Notebooks Kaggle de référence

- Nettoyage : [Data Cleaning Challenge: Handling missing values](https://www.kaggle.com/code/rtatman/data-cleaning-challenge-handling-missing-values)
- Plotly : [Plotly Tutorial for Beginners](https://www.kaggle.com/code/kanncaa1/plotly-tutorial-for-beginners) · [Netflix Movies and Shows - Plotly + Recommender](https://www.kaggle.com/code/vikassingh1996/netflix-movies-and-shows-plotly-recommender-sys)
- Premier modèle : [Your First Machine Learning Model](https://www.kaggle.com/code/dansbecker/your-first-machine-learning-model) · [Underfitting and Overfitting](https://www.kaggle.com/code/dansbecker/underfitting-and-overfitting) · [Random Forests](https://www.kaggle.com/code/dansbecker/random-forests) (cours gratuit [Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning))
- Sur les datasets : [Spotify EDA and Track Popularity Prediction](https://www.kaggle.com/code/mamxlam/spotify-eda-and-track-popularity-prediction) · [Video Games Sales : EDA + modelization](https://www.kaggle.com/code/aleatoire/video-games-sales-eda-modelization) · [Machine Learning Tutorial for Beginners](https://www.kaggle.com/code/kanncaa1/machine-learning-tutorial-for-beginners)
