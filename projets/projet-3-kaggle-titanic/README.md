# Projet 3 · Compétition Kaggle « Titanic » ⭐⭐⭐

Bloc 3 · Projet Kaggle en séance supervisée (séances 7 et 8) · Niveau ⭐⭐⭐ Avancé · En binôme

## Objectif

Participer à la compétition d'entrée de Kaggle : prédire quels passagers du Titanic ont survécu à partir de leur fiche (classe, sexe, âge, famille à bord, prix du billet). Mener le projet comme un data scientist : préparer les données avec une fonction unique, comparer **3 modèles** en validation croisée, tenir un **journal des essais**, soumettre au classement mondial et présenter sa démarche.

## Dataset

- Compétition : https://www.kaggle.com/competitions/titanic (bouton *Join Competition*, puis onglet *Data*)
- Dictionnaire des colonnes : https://www.kaggle.com/competitions/titanic/data
- Fichiers : `train.csv` (891 passagers avec la réponse `Survived`), `test.csv` (418 passagers à prédire), `gender_submission.csv` (exemple de soumission)
- Miroir public de `train.csv` (chargé automatiquement si les fichiers Kaggle sont absents) : https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv
- Sans `test.csv`, le notebook fabrique un faux test à partir de 20 % de `train` : tout fonctionne et il affiche un score local, mais la soumission réelle demande les fichiers Kaggle.
- Variante plus ludique, même démarche : https://www.kaggle.com/competitions/spaceship-titanic (colonnes différentes, à adapter dans `preparer()`)

Pour récupérer les fichiers : téléchargement manuel puis upload dans Colab, ou `kaggle competitions download -c titanic` (voir le [README des projets](../README.md)).

## Étapes (2 séances de 2 h)

| Étape | Séance | Durée | Ce que vous faites |
|---|---|---|---|
| 0. Kaggle | S7 | 10 min | compte, *Join Competition*, `train.csv` et `test.csv` dans Colab |
| 1. Explorer et poser 3 hypothèses | S7 | 20 min | survie par sexe, par classe, cases vides ; 3 hypothèses écrites |
| 2. Préparer les données | S7 | 30 min | lire `preparer()` (titre par regex, âge par médiane du titre, famille, encodage), ajouter une variable |
| 3. Trois modèles + validation croisée | S7 | 30 min | régression logistique, forêt, gradient boosting ; écart apprentissage / validation |
| 4. Première soumission | S7 | 15 min | `submission.csv`, *Submit Prediction*, score noté dans le journal |
| 5. Améliorer et journaliser | S8 | 60 min | au moins 3 essais supplémentaires : variables, profondeur de la forêt, retrait d'une variable |
| 6. Soumission finale et présentation | S8 | 30 min | meilleur modèle soumis, 5 minutes par binôme |

## Livrable

Une soumission Kaggle avec son score, le notebook `projet_3_titanic.ipynb` complet sur GitHub (journal des essais rempli), et une présentation de 5 minutes.

## Critères de réussite

- [ ] `preparer()` s'applique à `train` et `test` sans laisser de case vide et produit les mêmes colonnes.
- [ ] 3 modèles comparés en validation croisée, avec un commentaire sur le sur-apprentissage (écart apprentissage / validation).
- [ ] Journal d'au moins 6 essais (nom, variables, modèle, score CV, score Kaggle, commentaire).
- [ ] Au moins une variable créée par le binôme, avec son effet mesuré.
- [ ] `submission.csv` accepté par Kaggle (418 lignes, `PassengerId` et `Survived`) et score noté.
- [ ] Présentation : l'hypothèse la plus surprenante, la variable ajoutée, le tableau des essais, le score, ce que vous feriez avec une séance de plus.

Repères : le fichier d'exemple `gender_submission.csv` (« toutes les femmes survivent ») fait 0,766. Entre 0,77 et 0,80 c'est un bon travail honnête ; au-delà de 0,83, les notebooks utilisent souvent les réponses publiques, ce n'est plus de la prédiction.

## Pour aller plus loin

- `GridSearchCV` pour chercher automatiquement les meilleurs réglages de la forêt ou du gradient boosting.
- Ajouter le pont (`Cabin.str[0]`), le prix par personne, une tranche de tarif (`pd.qcut`), la taille du groupe de billet.
- Refaire tout le parcours sur Spaceship Titanic.

## Notebooks Kaggle de référence

- [Titanic Tutorial](https://www.kaggle.com/code/alexisbcook/titanic-tutorial) (Alexis Cook) : la première soumission en 10 minutes, la référence officielle pour débuter.
- [Titanic Data Science Solutions](https://www.kaggle.com/code/startupsci/titanic-data-science-solutions) (Manav Sehgal) : le fil complet exploration → variables → modèles, celui dont notre `preparer()` s'inspire.
- [A Data Science Framework: To Achieve 99% Accuracy](https://www.kaggle.com/code/ldfreeman3/a-data-science-framework-to-achieve-99-accuracy) : méthodologie détaillée (et lucide sur le titre).
- [EDA To Prediction (DieTanic)](https://www.kaggle.com/code/ash316/eda-to-prediction-dietanic) : beaucoup de graphiques d'exploration.
- [Introduction to Ensembling/Stacking in Python](https://www.kaggle.com/code/arthurtok/introduction-to-ensembling-stacking-in-python) : pour aller plus loin, combiner plusieurs modèles.
- Spaceship Titanic : [Spaceship Titanic: A complete guide](https://www.kaggle.com/code/samuelcortinhas/spaceship-titanic-a-complete-guide) · [Spaceship Titanic EDA + 27 different models](https://www.kaggle.com/code/odins0n/spaceship-titanic-eda-27-different-models)
- Validation croisée : [Cross-Validation](https://www.kaggle.com/code/alexisbcook/cross-validation) (cours Intermediate ML)
