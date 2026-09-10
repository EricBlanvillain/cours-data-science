# Séance 7 · Compétition Kaggle Titanic (1/2) : explorer, préparer, première soumission · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 3 · Projet Kaggle en séance supervisée

Objectifs : découvrir Kaggle et mener la première moitié d'un vrai projet de data science en binôme : explorer les données du Titanic, vérifier 4 hypothèses avec des chiffres et des graphiques, nettoyer les cases vides, créer 3 nouvelles variables (dont le titre extrait du nom avec une regex), entraîner un premier modèle mesuré par validation croisée, et faire sa première soumission au classement.

Avant la séance : chacun crée un compte Kaggle (gratuit), rejoint la compétition et télécharge `train.csv` et `test.csv` (les étapes précises sont dans le notebook).

Déroulé (1 h 30, en binômes)
- 15 min : Kaggle, la compétition, les 3 fichiers, comment on soumet (sections 1-2 du notebook) ; on formule les 4 hypothèses ensemble au tableau (femmes et enfants d'abord ? classe ? prix ? famille ?)
- 60 min : notebook `07_kaggle_titanic_1.ipynb`
  - sections 3 à 5 (30 min) : vérifier les hypothèses, nettoyer, créer `Famille`, `Seul`, `Titre`
  - sections 6 et 7 (20 min) : la fonction `preparer()`, régression logistique puis forêt, validation croisée
  - section 8 (10 min) : projet, générer `submission.csv` et faire sa première soumission sur Kaggle
- 15 min : partage, 2 min par binôme : l'hypothèse la plus surprenante, la variable ajoutée, le score

Si le temps manque : on s'arrête avant l'ajout d'une variable personnelle (section 8) ; la soumission se fait en tout début de séance 8, avant de chercher à améliorer le score.

Entre deux séances (à la maison) : `07_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens
- Compétition : https://www.kaggle.com/competitions/titanic
- Dictionnaire des données : https://www.kaggle.com/competitions/titanic/data
- Copie publique de `train.csv` (chargée automatiquement si les fichiers Kaggle sont absents) : https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv
- Tester une regex : https://regex101.com
- Variante plus ludique : https://www.kaggle.com/competitions/spaceship-titanic

Ils repartent avec : une première soumission Kaggle et son score, noté dans le notebook.
