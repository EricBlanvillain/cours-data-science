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

Notes d'animation (formateur)
- Quiz d'ouverture (2 min) : 2 questions en tête de `07_exercices.ipynb`, à poser à voix haute avant de commencer
- Avant la séance : « Vérifier avant la séance que chaque binôme a train.csv et test.csv. Sinon, le notebook charge une copie publique : le projet reste faisable, seule la soumission saute. »
- Sections 1-2, la compétition et ses données : « Cinq minutes maximum. Le tableau des colonnes est à projeter et à laisser affiché. »
- Sections 3 à 5, les hypothèses : « Laisser chaque binôme choisir une hypothèse et la vérifier seul avant d'ouvrir la partie modèle. C'est ce qui donne du sens à la préparation. »
- Section 6, la fonction preparer() : « Insister sur la fonction preparer() appliquée aux deux fichiers. L'erreur classique : préparer train à la main et oublier test. »
- Section 8, première soumission : « La soumission est le moment fort. Prévoir que le site Kaggle mette une minute à calculer le score, et faire applaudir le premier score affiché. »
- Toute la séance : « Séance supervisée : rester en mouvement entre les tables, ne pas s'asseoir. »

Entre deux séances (à la maison) : `07_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens
- Compétition : https://www.kaggle.com/competitions/titanic
- Dictionnaire des données : https://www.kaggle.com/competitions/titanic/data
- Copie publique de `train.csv` (chargée automatiquement si les fichiers Kaggle sont absents) : https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv
- Tester une regex : https://regex101.com
- Variante plus ludique : https://www.kaggle.com/competitions/spaceship-titanic

Ils repartent avec : une première soumission Kaggle et son score, noté dans le notebook.
