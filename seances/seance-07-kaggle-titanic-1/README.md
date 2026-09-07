# Séance 7 · Compétition Kaggle Titanic (1/2) : explorer, préparer, première soumission · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 3 · Projet Kaggle en séance supervisée

Objectifs : découvrir Kaggle et mener la première moitié d'un vrai projet de data science en binôme : explorer les données du Titanic, vérifier 4 hypothèses avec des chiffres et des graphiques, nettoyer les cases vides, créer 3 nouvelles variables (dont le titre extrait du nom avec une regex), entraîner un premier modèle mesuré par validation croisée, et faire sa première soumission au classement.

Avant la séance : chacun crée un compte Kaggle (gratuit), rejoint la compétition et télécharge `train.csv` et `test.csv` (les étapes précises sont dans le notebook).

Déroulé (2h, en binômes)
- 10 min : Kaggle, la compétition, les 3 fichiers, comment on soumet (sections 1-2 du notebook)
- 10 min : formuler les hypothèses ensemble au tableau (femmes et enfants d'abord ? classe ? prix ? famille ?)
- 35 min : notebook `07_kaggle_titanic_1.ipynb`, sections 3 à 5 : vérifier les hypothèses, nettoyer, créer `Famille`, `Seul`, `Titre`
- 25 min : sections 6 et 7 : la fonction `preparer()`, régression logistique puis forêt, validation croisée
- 20 min : projet, section 8 : ajouter une variable, générer `submission.csv`, soumettre sur Kaggle, noter le score
- 20 min : partage, 2 min par binôme : l'hypothèse la plus surprenante, la variable ajoutée, le score

Liens
- Compétition : https://www.kaggle.com/competitions/titanic
- Dictionnaire des données : https://www.kaggle.com/competitions/titanic/data
- Copie publique de `train.csv` (chargée automatiquement si les fichiers Kaggle sont absents) : https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv
- Tester une regex : https://regex101.com
- Variante plus ludique : https://www.kaggle.com/competitions/spaceship-titanic

Ils repartent avec : une première soumission Kaggle et son score, noté dans le notebook.
