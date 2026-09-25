# Séance 8 · Compétition Kaggle Titanic (2/2) : améliorer le score et présenter · ⭐⭐⭐

Niveau : ⭐⭐⭐ Avancé

Bloc 3 · Projet Kaggle en séance supervisée

Objectifs : améliorer le score de la séance 7 en comparant 4 modèles dans un tableau, comprendre pourquoi l'un marche mieux (importance des variables), voir le sur-apprentissage sur une courbe train / validation, régler 2 hyperparamètres avec `GridSearchCV`, éviter les pièges (fuite de données, score trop beau), faire la soumission finale, comparer les scores du groupe et présenter sa démarche en 5 minutes.

Avant la séance : redéposer `train.csv` et `test.csv` dans Colab (ils disparaissent à la fermeture de la session) et retrouver son score de la séance 7.

Déroulé (1 h 30, en binômes)
- 15 min : rappel de la séance 7 et tour des scores ; le sur-apprentissage expliqué avec l'analogie de l'élève qui apprend les annales par cœur
- 60 min : notebook `08_kaggle_titanic_2.ipynb`
  - sections 1 à 4 (30 min) : tableau des 4 modèles, importance des variables, courbe train / validation, `GridSearchCV`
  - section 5 (10 min) : les pièges : démonstration d'une fuite de données, score sur ses propres données, la règle bête à battre (0.766)
  - section 6 (20 min) : projet, modèle final, `submission_finale.csv`, soumission, tableau des scores du groupe
- 15 min : premiers passages, 5 min par binôme : hypothèses → ce qu'on a essayé → score → ce qu'on referait

Si le temps manque : la préparation de la présentation (section 7) et les passages restants ouvrent la séance suivante. À partir de trois binômes, la reprise est à prévoir dès le calendrier : les présentations ne se coupent pas.

Notes d'animation (formateur)
- Quiz d'ouverture (2 min) : 1 question en tête de `08_exercices.ipynb`, à poser à voix haute avant de commencer
- Section 5, les pièges : « Un binôme à 0,98 a presque toujours mesuré sur le train ou laissé Survived dans X. Chercher l'erreur avec eux, devant le groupe si l'ambiance le permet. »
- Toute la séance : « Séance supervisée : rester en mouvement entre les tables, ne pas s'asseoir. »

Entre deux séances (à la maison) : `08_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens
- Classement : https://www.kaggle.com/competitions/titanic/leaderboard
- Notebooks des autres participants (idées de variables) : https://www.kaggle.com/competitions/titanic/code
- Le sur-apprentissage en images : https://mlu-explain.github.io/bias-variance/
- Copie publique de `train.csv` : https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv

Ils repartent avec : une soumission Kaggle finale avec son score, le notebook complet à pousser sur GitHub, et une présentation de 5 minutes.
