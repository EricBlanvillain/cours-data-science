# Aide-mémoire scikit-learn

La recette est toujours la même, quel que soit le modèle : **préparer X et y → couper train / test → `fit` → `predict` → mesurer**.

```python
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X = df[["bill_length_mm", "flipper_length_mm"]]   # ce que la machine voit
y = df["species"]                                  # ce qu'elle doit deviner

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

modele = DecisionTreeClassifier(max_depth=3)
modele.fit(X_train, y_train)          # apprendre
modele.score(X_test, y_test)          # exactitude (part de bonnes réponses) sur les données cachées
modele.predict(X_test.head())         # prédire
```

## Préparer les données (séances 6 et 7)

| Code | Ce que ça fait |
|---|---|
| `df = df.dropna(subset=[...])` | Retirer les lignes incomplètes (ou remplir, voir ci-dessous) |
| `df["Age"] = df["Age"].fillna(df["Age"].median())` | Remplir les cases vides par la médiane |
| `df["Sex"] = df["Sex"].map({"female": 1, "male": 0})` | Encoder une catégorie en nombre |
| `pd.get_dummies(df, columns=["Embarked"], drop_first=True)` | Une colonne 0/1 par catégorie (one-hot) |
| `train_test_split(X, y, test_size=0.2, random_state=42)` | 80 % pour apprendre, 20 % cachés ; `random_state` fixe le hasard |
| `from sklearn.preprocessing import StandardScaler` puis `scaler.fit_transform(X_train)` | Mettre les colonnes à la même échelle (utile pour k-NN et la régression logistique) |

Règle d'or : tout ce qu'on apprend des données (médiane, échelle, encodage) se calcule sur `X_train` seulement, puis s'applique à `X_test`. Sinon, **fuite de données**.

## Les modèles vus dans l'atelier

| Modèle | Import | Pour quoi | Réglage principal |
|---|---|---|---|
| Arbre de décision | `from sklearn.tree import DecisionTreeClassifier` | Classification lisible (on peut le dessiner) | `max_depth` |
| k plus proches voisins | `from sklearn.neighbors import KNeighborsClassifier` | Classification par ressemblance | `n_neighbors` |
| Régression logistique | `from sklearn.linear_model import LogisticRegression` | Classification, rapide, robuste | `max_iter=1000` si avertissement |
| Forêt aléatoire | `from sklearn.ensemble import RandomForestClassifier` | Classification, souvent la meilleure sur des tableaux | `n_estimators`, `max_depth` |
| Gradient boosting | `from sklearn.ensemble import GradientBoostingClassifier` | Classification, un cran au-dessus, plus lent | `n_estimators`, `learning_rate` |
| Régression linéaire | `from sklearn.linear_model import LinearRegression` | Prédire un nombre | — |
| Arbre / forêt de régression | `DecisionTreeRegressor`, `RandomForestRegressor` | Prédire un nombre | comme leurs versions classification |
| Modèle bête | `from sklearn.dummy import DummyClassifier` puis `DummyClassifier(strategy="most_frequent")` | La référence à battre | — |

Tous s'utilisent avec les mêmes méthodes : `.fit(X, y)`, `.predict(X)`, `.score(X, y)`, et `.predict_proba(X)` pour les probabilités.

## Mesurer

| Code | Ce que ça fait |
|---|---|
| `modele.score(X_test, y_test)` | Exactitude (classification) ou R² (régression) |
| `from sklearn.metrics import accuracy_score` puis `accuracy_score(y_test, y_pred)` | Exactitude (*accuracy*) : part de bonnes réponses. Pas la précision, qui est autre chose (voir `classification_report`) |
| `from sklearn.metrics import confusion_matrix` puis `confusion_matrix(y_test, y_pred)` | Qui a été confondu avec qui |
| `from sklearn.metrics import classification_report` puis `print(classification_report(y_test, y_pred))` | Précision, rappel, F1 par classe |
| `from sklearn.metrics import mean_absolute_error` puis `mean_absolute_error(y_test, y_pred)` | Régression : erreur moyenne, dans l'unité de y |
| `from sklearn.model_selection import cross_val_score` puis `cross_val_score(modele, X, y, cv=5).mean()` | Validation croisée : 5 coupes différentes, moyenne des scores (plus fiable qu'une seule coupe) |

## Comprendre le modèle

| Code | Ce que ça fait |
|---|---|
| `from sklearn.tree import plot_tree` puis `plot_tree(arbre, feature_names=X.columns, filled=True)` | Dessiner l'arbre |
| `modele.feature_importances_` | Importance de chaque variable (arbres, forêts, boosting) |
| `pd.Series(modele.feature_importances_, index=X.columns).sort_values().plot(kind="barh")` | La même chose en graphique |
| `modele.coef_` | Poids de chaque variable (régression linéaire / logistique) |

## Régler les hyperparamètres (séance 8)

```python
from sklearn.model_selection import GridSearchCV

grille = {"max_depth": [3, 5, 8, None], "n_estimators": [50, 100, 200]}
recherche = GridSearchCV(RandomForestClassifier(random_state=42), grille, cv=5)
recherche.fit(X_train, y_train)
recherche.best_params_      # le meilleur réglage
recherche.best_score_       # son score en validation croisée
meilleur = recherche.best_estimator_
```

La courbe du sur-apprentissage : pour `max_depth` de 1 à 20, tracer le score train et le score test. Quand le train monte et que le test redescend, on est trop profond.

## Les pièges

| Piège | Symptôme | Parade |
|---|---|---|
| Sur-apprentissage | 100 % en train, bien moins en test | Modèle plus simple (`max_depth` plus petit, plus de voisins), plus de données, forêt plutôt qu'arbre |
| Fuite de données | Score trop beau pour être vrai | Aucune colonne qui « contient la réponse » ; préparation calculée sur train seulement |
| Score sur les données d'entraînement | Score irréaliste | Toujours mesurer sur `X_test` ou en validation croisée |
| Classes déséquilibrées | 95 % d'exactitude alors que le modèle dit toujours « non » | Comparer au modèle bête, regarder la matrice de confusion |
| Hasard non fixé | Un score différent à chaque exécution | `random_state=42` partout |

## Soumettre sur Kaggle (séances 7 et 8)

```python
X_final = preparer(test)                    # même préparation que train
predictions = meilleur.predict(X_final)
pd.DataFrame({"PassengerId": test["PassengerId"], "Survived": predictions}).to_csv("submission.csv", index=False)
```
