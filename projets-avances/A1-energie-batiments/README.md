# Projet A1 · Consommation énergétique des bâtiments · ⭐⭐⭐

Réserve « pour aller plus loin » · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 6 à 8 (premier modèle, Kaggle) · **CPU suffisant, pas de GPU**

## Objectif

Seattle oblige ses bâtiments de plus de 20 000 pieds carrés à déclarer chaque année leur consommation d'énergie : c'est cher à collecter, ça arrive avec un an de retard, et un tiers des bâtiments manque à l'appel.
Ce projet sert au service climat de la ville, qui doit cibler les bâtiments à rénover **avant** d'avoir le relevé — et justifier son choix devant des élus, donc avec un modèle qui explique ses prédictions.
À la fin, tu as un pipeline complet qui prédit la consommation (et les émissions de CO₂) à partir de la surface, de l'usage et de l'âge, un XGBoost réglé qui divise l'erreur de la baseline par deux, une lecture SHAP variable par variable, et une réponse chiffrée à « faut-il financer l'ENERGY STAR score ? ».

## Les données

[Seattle Open Data — Building Energy Benchmarking](https://data.seattle.gov/d/teqw-tu6e), licence publique, chargé par l'**API Socrata** (`data.seattle.gov/resource/teqw-tu6e.csv?datayear=2016&$limit=10000`) : **≈ 3 300 bâtiments × 18 colonnes** pour l'année 2016, dont deux cibles — `siteenergyuse_kbtu` (énergie sur site, en kBtu) et `totalghgemissions` (tonnes de CO₂e).

Le fichier est mis en **cache** dans `data/` au premier lancement : le second passage ne retélécharge rien. **Sans réseau**, la cellule bascule automatiquement sur un `DONNEES_SECOURS` de 300 bâtiments écrit en dur dans le notebook — tout le pipeline tourne, seuls les chiffres changent (et l'échantillon est trop petit pour que le tuning apporte grand-chose).

Après nettoyage il reste **≈ 1 500 bâtiments non résidentiels** : le notebook retire les `Multifamily` (hors périmètre), les cibles manquantes ou nulles, les surfaces impossibles, les 1 % d'intensité énergétique extrême de chaque côté, et les années de construction aberrantes. Chaque coupe est inscrite dans un **journal** (`lignes avant → après → supprimées`) affiché en fin de section 3 : c'est la slide « Nettoyage » du rapport.

## Ce que tu entraînes et règles

La cible est modélisée **en logarithme** (`np.log1p`) : les consommations s'étalent de 10⁴ à 10⁸ kBtu, et une erreur de 0,3 en log veut dire « à 35 % près » quel que soit le bâtiment. Métrique principale : **RMSE en log**, complétée par le MAE en MkBtu (lisible pour un décideur) et le R².

| Modèle | Ce qu'il apporte |
|---|---|
| `DummyRegressor(strategy="median")` | la baseline « bête » : tout modèle qui ne la bat pas nettement ne vaut pas son coût |
| `Ridge` | la relation surface ↔ consommation est quasi linéaire en log-log : le linéaire fait déjà beaucoup |
| `RandomForestRegressor` (200 arbres en rapide, 500 en complet) | les interactions usage × âge × étages |
| `XGBRegressor` (réglages par défaut) | le point de départ du tuning |
| **`XGBRegressor` réglé par `RandomizedSearchCV`** | le modèle retenu |

Tout passe par un `Pipeline` sklearn identique (imputation médiane + standardisation des numériques, one-hot avec regroupement des modalités rares pour les catégories), comparé en **validation croisée 5 plis** sur l'apprentissage ; les 20 % de test ne sont touchés qu'à la fin.

Le tuning tire **8 combinaisons × 3 plis** en `MODE_RAPIDE`, **40 × 5** en version complète, dans un espace de 7 hyperparamètres (`n_estimators`, `max_depth`, `learning_rate`, `subsample`, `colsample_bytree`, `min_child_weight`, `reg_lambda`). Une courbe « avant / après » suit le RMSE arbre par arbre et montre le sur-apprentissage du modèle par défaut. Six exercices « À toi » ponctuent le notebook (surface par étage, regroupement des usages rares, corrélations, seconde cible CO₂, ajout de `gamma`/`reg_alpha` à l'espace de recherche, analyse des 5 pires erreurs), chacun avec vérification ✅/❌ et solution repliée.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `pandas`, `numpy`, `matplotlib` | déjà dans Colab, rien à faire |
| `scikit-learn` (`Pipeline`, `ColumnTransformer`, `RandomizedSearchCV`, `KFold`) | déjà dans Colab |
| `xgboost` (`XGBRegressor`) | déjà dans Colab |
| `shap` (beeswarm, dépendance, importances) | déjà dans Colab ; le notebook fait `import shap` sans installation — si l'import échoue, `!pip install -q shap` |
| `scipy.stats` (`randint`, `uniform`, `loguniform`) pour l'espace de recherche | déjà dans Colab |
| Les données, par URL Socrata | rien à installer, `pandas.read_csv(url)` |

**Aucune clé d'API, aucun compte, aucun GPU.** En local : `pip install -r ../requirements.txt`.

## Déroulé (≈ 3 h)

Le notebook est bâti en 9 sections numérotées de 0 à 9.

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | **§0 Préparation** et **§1 Contexte** : l'interrupteur `MODE_RAPIDE`, les helpers `verifier()`, puis la question métier et le choix de la métrique (pourquoi le log, pourquoi le RMSE) |
| 10-25 min | **§2 Les données** : chargement Socrata, dictionnaire des 18 variables, dimensions, part de valeurs manquantes |
| 25-55 min | **§3 Nettoyage et feature engineering** : le journal des corrections, les variables créées (`age`, `surface_hors_parking`, `part_parking`, `part_usage1`, cibles en log) et les **exercices 1 et 2** |
| 55-85 min | **§4 Analyse exploratoire** : cinq indicateurs, une phrase de lecture chacun (asymétrie de la cible, intensité par usage et par quartier, décennie, matrice de corrélations) et l'**exercice 3** |
| 85-115 min | **§5 Modèles candidats** : baseline, Ridge, forêt, XGBoost par défaut, le tableau comparatif, et l'**exercice 4** sur la seconde cible (émissions) |
| 115-145 min | **§6 Tuning** : `RandomizedSearchCV`, la courbe avant / après réglage, les résidus, l'**exercice 5** (ajouter `gamma` et `reg_alpha`) |
| 145-170 min | **§7 Interprétation** : SHAP (beeswarm, dépendance), la question ENERGY STAR avec / sans, l'**exercice 6** (les 5 pires erreurs) |
| 170-180 min | **§8 Conclusion** (ta synthèse) et **§9 Pour aller plus loin** |

En `MODE_RAPIDE = True`, tout le calcul tient en **une vingtaine de secondes** sur un CPU d'ordinateur portable : le temps annoncé ci-dessus, c'est le temps de **lire, comprendre et faire les exercices**, pas celui d'attendre la machine. En `MODE_RAPIDE = False`, compte quelques minutes de plus pour la recherche 40 × 5.

Si le temps manque : arrête-toi à la fin de la section 5. Tu as déjà la baseline, quatre modèles comparés et le tableau — le tuning et SHAP font une reprise nette au créneau suivant.

## Livrable

`A1_energie_batiments.ipynb` exécuté de bout en bout, les six exercices en ✅, la cellule `MA_SYNTHESE` remplie — plus un **rapport de 10 à 15 slides** suivant [`../gabarit-rapport.md`](../gabarit-rapport.md), présenté en 10 minutes. Les cellules « Rapport » de chaque section impriment les chiffres à y recopier : journal de nettoyage, indicateurs, tableau des modèles, RMSE avant → après réglage, top 3 SHAP, gain ENERGY STAR.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. La question et la métrique** | « Je prédis la consommation », sans plus | La métrique est justifiée : cible en log, RMSE en log **et** MAE en unités réelles, avec ce que vaut une erreur de 0,3 | Tu montres que le classement des modèles change selon la métrique (Ridge devant en R² réel) et tu dis laquelle sert la décision |
| **2. Le nettoyage** | Des lignes supprimées sans trace | Le journal est complet : chaque coupe a une raison physique ou de périmètre, et le nombre de bâtiments restants est assumé | Une coupe est discutée (les 1 % d'intensité extrême : erreurs de saisie ou vrais bâtiments ?) et l'effet du seuil est mesuré |
| **3. L'exploration** | Des graphiques sans phrase de lecture | Cinq indicateurs, chacun avec une lecture d'une phrase, et une conclusion explicite « voilà pourquoi les arbres » | L'exploration prédit ce que le modèle trouvera (surface ≫ usage ≫ âge) et SHAP le confirme en section 7 |
| **4. Les modèles candidats** | Un seul modèle, sans baseline | Baseline médiane + 3 modèles, comparés en validation croisée 5 plis sur le **même** pipeline, tableau avec le temps d'entraînement | Le gain vs baseline est chiffré en pourcentage de RMSE, et la seconde cible (émissions) est traitée (exercice 4) |
| **5. Le tuning** | La recherche tourne mais rien n'est comparé | RMSE CV avant → après, paramètres retenus affichés, courbe apprentissage / validation lue | L'espace est élargi (`gamma`, `reg_alpha`) et tu conclus honnêtement — même si le gain est faible, c'est un résultat |
| **6. Interprétation et recommandation** | Un score, pas d'explication | Beeswarm SHAP lu, top 3 des variables, les 5 pires erreurs analysées, réponse chiffrée sur l'ENERGY STAR | La recommandation est actionnable (deux modèles avec / sans score, ou financer le score seulement pour les gros consommateurs) et les limites sont nommées |

## Pour aller plus loin

- **Donner une fourchette plutôt qu'un chiffre.** XGBoost sait faire de la régression quantile (`objective="reg:quantileerror"`) : entraîne trois modèles aux quantiles 0,1 / 0,5 / 0,9 et livre un intervalle. Un service climat préfère « entre 2 et 5 MkBtu » à un « 3,4 MkBtu » faussement précis.
- **Ajouter l'année 2015.** Le même jeu existe pour l'année précédente : deux fois plus de données, et surtout la possibilité de tester la **généralisation dans le temps** (entraîner sur 2015, tester sur 2016), ce qui est le vrai cas d'usage de la ville.
- **Un modèle par grande famille d'usage.** Les entrepôts et les hôpitaux n'obéissent pas aux mêmes lois : compare un modèle global à trois modèles spécialisés, et regarde si le gain justifie la complexité de maintenir trois modèles.

## Liens utiles

- Le jeu de données et ses autres années : https://data.seattle.gov/d/teqw-tu6e · le programme de la ville : https://www.seattle.gov/environment/climate-change/buildings-and-energy/energy-benchmarking
- Tous les hyperparamètres de XGBoost : https://xgboost.readthedocs.io/en/stable/parameter.html · les tutoriels : https://xgboost.readthedocs.io/en/stable/tutorials/index.html
- Pourquoi la recherche aléatoire bat la grille (Bergstra & Bengio, JMLR 2012) : https://www.jmlr.org/papers/v13/bergstra12a.html · la classe utilisée : https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html
- SHAP en profondeur (waterfall, interactions, modèles non arborescents) : https://shap.readthedocs.io/en/latest/
- La suite naturelle, avec Optuna et un seuil de décision : [projet A2 · Scoring crédit](../A2-scoring-credit/)
- Le gabarit du rapport : [`../gabarit-rapport.md`](../gabarit-rapport.md)
