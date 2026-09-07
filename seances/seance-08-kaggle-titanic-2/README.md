# Séance 8 · Compétition Kaggle Titanic (2/2) : améliorer le score et présenter · ⭐⭐⭐

Niveau : ⭐⭐⭐ Avancé

Bloc 3 · Projet Kaggle en séance supervisée

Objectifs : améliorer le score de la séance 7 en comparant 4 modèles dans un tableau, comprendre pourquoi l'un marche mieux (importance des variables), voir le sur-apprentissage sur une courbe train / validation, régler 2 hyperparamètres avec `GridSearchCV`, éviter les pièges (fuite de données, score trop beau), faire la soumission finale, comparer les scores du groupe et présenter sa démarche en 5 minutes.

Avant la séance : redéposer `train.csv` et `test.csv` dans Colab (ils disparaissent à la fermeture de la session) et retrouver son score de la séance 7.

Déroulé (2h, en binômes)
- 10 min : rappel de la séance 7, tour des scores, ce qui distingue les 4 familles de modèles
- 10 min : le sur-apprentissage expliqué avec l'analogie de l'élève qui apprend les annales par cœur
- 40 min : notebook `08_kaggle_titanic_2.ipynb`, sections 1 à 4 : tableau des 4 modèles, importance des variables, courbe train / validation, `GridSearchCV`
- 15 min : section 5, les pièges : démonstration d'une fuite de données, score sur ses propres données, la règle bête à battre (0.766)
- 25 min : projet, section 6 : modèle final, `submission_finale.csv`, soumission, tableau des scores du groupe ; puis section 7, préparer la présentation
- 20 min : présentations, 5 min par binôme : hypothèses → ce qu'on a essayé → score → ce qu'on referait

Liens
- Classement : https://www.kaggle.com/competitions/titanic/leaderboard
- Notebooks des autres participants (idées de variables) : https://www.kaggle.com/competitions/titanic/code
- Le sur-apprentissage en images : https://mlu-explain.github.io/bias-variance/
- Copie publique de `train.csv` : https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv

Ils repartent avec : une soumission Kaggle finale avec son score, le notebook complet à pousser sur GitHub, et une présentation de 5 minutes.
