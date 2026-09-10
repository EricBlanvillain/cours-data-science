# Projet A2 · Scoring crédit : accorder ou refuser un prêt · ⭐⭐⭐

Réserve « pour aller plus loin » · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 6 à 8 (premier modèle, Kaggle) et de préférence [A1](../A1-energie-batiments/) · **CPU suffisant, pas de GPU**

## Objectif

Une banque en ligne reçoit des demandes de prêt personnel et doit trancher dossier par dossier : un défaut de paiement coûte bien plus cher qu'un bon client refusé, et 22 % seulement des dossiers finissent en défaut — l'exactitude (« accuracy ») est donc un piège complet.
Ce projet sert aux analystes crédit, qui traitent les dossiers à la main, et à la direction des risques, qui doit prouver au régulateur que chaque refus est **explicable** : un client refusé a le droit de savoir pourquoi.
À la fin, tu as un score de risque, un **seuil de décision calculé sur un coût métier** (et pas laissé à 0,5), la démonstration chiffrée que le seuil pèse plus lourd que le tuning, et une fiche « décision expliquée » lisible par un non-technicien.

## Les données

[Credit Risk Dataset sur OpenML, id 43454](https://www.openml.org/d/43454), licence CC0 — copie du [jeu Kaggle de Lao Tse](https://www.kaggle.com/datasets/laotse/credit-risk-dataset) : **32 581 dossiers × 12 colonnes**. Pour chaque demande : le demandeur (âge, revenu, logement, ancienneté d'emploi, historique de crédit, défaut antérieur) et le prêt (montant, taux, objet, note interne de A à G). La cible `loan_status` vaut 1 pour un défaut de paiement.

Le chargement essaie trois portes dans l'ordre : `fetch_openml(data_id=43454)`, puis un miroir GitHub du CSV, puis — **sans réseau** — un `DONNEES_SECOURS` de 500 dossiers écrit en dur dans le notebook. Le fichier est ensuite mis en cache dans `data/`.

Deux colonnes ont des trous : `loan_int_rate` (10 %) et `person_emp_length` (3 %). Elles ne sont **pas supprimées** : elles sont imputées dans le pipeline (médiane apprise sur l'apprentissage seulement), et XGBoost sait de toute façon gérer les valeurs manquantes. Le nettoyage ne retire que l'impossible (âge > 100 ans, ancienneté d'emploi > 60 ans, revenu ≥ 2 M$, doublons) et chaque coupe est inscrite dans un **journal** affiché en fin de section 3.

En `MODE_RAPIDE`, la modélisation travaille sur un **sous-échantillon stratifié de 2 000 dossiers** (même taux de défaut) ; l'exploration, elle, reste sur le jeu complet — elle ne coûte rien.

## Ce que tu entraînes et règles

Découpage **stratifié** 80 / 20, validation croisée stratifiée à 5 plis sur l'apprentissage, test intouché jusqu'à la fin. Métriques : **ROC-AUC** (capacité à classer, indépendante du seuil) et **PR-AUC** (plus sévère sur la classe rare), puis rappel / précision / F1 au seuil courant pour voir tout de suite pourquoi 0,5 est un mauvais choix.

| Modèle | Ce qu'il apporte |
|---|---|
| `DummyClassifier(strategy="stratified")` | le plancher : un tirage au sort à 22 % |
| `LogisticRegression` | la référence lisible, à coefficients interprétables |
| `RandomForestClassifier` | les interactions sans réglage |
| `XGBClassifier` (défaut) | le point de départ du tuning |
| **`XGBClassifier` réglé par Optuna** | le modèle retenu |

**Le déséquilibre** est traité en trois variantes comparées sur les mêmes données : `class_weight="balanced"` (chaque défaut pèse ~3,5 fois plus), **SMOTE** via `imblearn.pipeline` (des défauts synthétiques fabriqués **à chaque pli d'apprentissage seulement**, jamais sur le test), et `scale_pos_weight` côté XGBoost (exercice 4). La conclusion du notebook est franche : rééquilibrer revient surtout à **déplacer le seuil**, l'AUC ne bouge presque pas.

**Le tuning** : Optuna remplace le tirage aléatoire par une recherche bayésienne (échantillonneur TPE, chaque essai choisi d'après les précédents). La fonction `objectif(trial)` propose 8 hyperparamètres et renvoie l'AUC en validation croisée — **20 essais × 3 plis** en `MODE_RAPIDE`, **60 × 5** en complet. Un graphique montre la convergence (chaque essai, et le meilleur jusqu'ici).

**Le seuil**, le cœur du projet : avec l'hypothèse **FN = 10 × FP** (un défaut manqué coûte dix fois un bon client refusé), on calcule le coût total pour 91 seuils, sur des probabilités obtenues en **validation croisée sur l'apprentissage** (`cross_val_predict`) — jamais sur le test, sinon on règlerait le curseur sur les réponses. Le seuil retenu tombe vers 0,2-0,3 au lieu de 0,5. L'exercice 5 généralise : `seuil_pour(cout_fn)` et la vérification de l'intuition (plus le défaut coûte cher, plus le seuil descend).

**L'interprétation** est à deux niveaux : SHAP global (beeswarm, pour la direction des risques) et SHAP local — une **fiche « décision expliquée »** par dossier : la probabilité face au seuil, la décision, les 6 facteurs qui ont le plus pesé en rouge / vert, et la position du client dans la distribution. Puis une analyse des défauts **non détectés** : ce sont des dossiers propres (bonne note, ratio faible), aucune variable disponible ne permet de les distinguer.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `pandas`, `numpy`, `matplotlib` | déjà dans Colab, rien à faire |
| `scikit-learn` (`StratifiedKFold`, `cross_val_predict`, `RocCurveDisplay`, `PrecisionRecallDisplay`) | déjà dans Colab |
| `xgboost` (`XGBClassifier`) | déjà dans Colab |
| `imbalanced-learn` (`SMOTE`, `imblearn.pipeline.Pipeline`) | déjà dans Colab |
| `optuna` (recherche bayésienne TPE) | **pas préinstallé partout** — le notebook fait `import optuna` directement ; si l'import échoue : `!pip install -q optuna` |
| `shap` (beeswarm, waterfall, contributions par dossier) | déjà dans Colab ; sinon `!pip install -q shap` |
| Les données, par `fetch_openml` ou une URL CSV | rien à installer |

**Aucune clé d'API, aucun compte, aucun GPU.** En local : `pip install -r ../requirements.txt`.

## Déroulé (≈ 3 h)

Le notebook est bâti en 9 sections numérotées de 0 à 9.

| Temps | Ce que tu fais |
|---|---|
| 0-15 min | **§0 Préparation** et **§1 Contexte** : `MODE_RAPIDE`, les helpers, puis pourquoi l'accuracy ment ici et ce que veut dire « FN = 10 × FP » |
| 15-30 min | **§2 Les données** : chargement à trois portes, dictionnaire des 12 variables, taux de défaut, valeurs manquantes |
| 30-55 min | **§3 Nettoyage et feature engineering** : le journal, `grade_num` (une échelle ordonnée, surtout pas un one-hot), `age_premier_credit`, `revenu_log`, `ratio_verifie` — **exercices 1 et 2** |
| 55-85 min | **§4 Analyse exploratoire** : défaut par note, par objet, par logement, par décile de revenu, par part du revenu consacrée au prêt, matrice de corrélations — **exercice 3** |
| 85-115 min | **§5 Modèles candidats** : baseline, logistique, forêt, XGBoost, puis la comparaison `class_weight` / SMOTE / `scale_pos_weight` — **exercice 4** |
| 115-150 min | **§6 Tuning et seuil** : Optuna et sa courbe de convergence, puis la **courbe de coût métier**, les deux matrices de confusion (0,5 vs seuil optimal), ROC et précision-rappel — **exercice 5** |
| 150-172 min | **§7 Interprétation** : beeswarm global, la fiche « décision expliquée », le waterfall d'un refus, l'analyse des défauts manqués — **exercice 6** |
| 172-180 min | **§8 Conclusion** (ta synthèse, les limites, l'équité non traitée) et **§9 Pour aller plus loin** |

En `MODE_RAPIDE = True`, le calcul prend **quelques minutes** sur CPU (l'essentiel part dans les 20 essais Optuna) ; en `MODE_RAPIDE = False`, compte 10 à 15 minutes sur Colab pour les 32 000 dossiers et 60 essais. Le temps du tableau, c'est celui de lire et de faire les exercices.

Si le temps manque : arrête-toi après la **courbe de coût** de la section 6. C'est le résultat principal du projet ; SHAP et la fiche font une reprise nette au créneau suivant.

## Livrable

`A2_scoring_credit.ipynb` exécuté de bout en bout, les six exercices en ✅, la cellule `MA_SYNTHESE` remplie — plus un **rapport de 10 à 15 slides** suivant [`../gabarit-rapport.md`](../gabarit-rapport.md), présenté en 10 minutes, avec au moins une slide « démo » : une fiche de décision complète (un dossier, sa probabilité, ses 6 facteurs). Les cellules « Rapport » impriment les chiffres : taux de défaut, tableau des modèles, AUC avant → après Optuna, seuil retenu, coût au seuil 0,5 → au seuil optimal, rappel et précision aux deux seuils.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. La métrique** | L'accuracy est utilisée comme score principal | ROC-AUC **et** PR-AUC suivis, et tu expliques pourquoi l'accuracy est trompeuse à 22 % de positifs | Tu montres le chiffre : « tout refuser » donne 78 % d'exactitude, et tu en tires la conséquence sur le choix de la métrique |
| **2. Le déséquilibre** | Ignoré, ou SMOTE appliqué sur tout le jeu (fuite) | Les trois remèdes comparés, SMOTE **dans le pipeline** donc uniquement sur les plis d'apprentissage | Tu conclus que rééquilibrer ≈ déplacer le seuil, chiffres à l'appui (l'AUC ne bouge pas, le rappel oui) |
| **3. Le tuning** | Optuna tourne, aucun avant / après | AUC CV et AUC test avant → après, paramètres retenus affichés, courbe de convergence lue | Le gain est relativisé honnêtement face au gain du seuil — un tuning qui rapporte peu est un résultat |
| **4. Le seuil de décision** | Le seuil reste à 0,5 | Le seuil est calculé sur le coût métier, à partir de probabilités de **validation croisée** et non du test, et le coût baisse | `seuil_pour(cout_fn)` est écrit et la sensibilité au ratio de coûts est montrée (1, 2, 5, 10, 20) |
| **5. L'explicabilité** | Une importance de variables globale, rien de local | Beeswarm global **et** fiche par dossier : probabilité, décision, 6 facteurs signés | La fiche est lisible par un non-technicien (libellés, couleurs, position du client dans la distribution) et un refus est raconté en une phrase |
| **6. L'honnêteté du bilan** | « Le modèle marche bien » | Les défauts non détectés sont analysés (des dossiers propres), et les limites sont nommées : ratio 10:1 posé en hypothèse, aucune vérification d'équité | Une suite testable est proposée : coût **par dossier** (montant × probabilité), calibration des probabilités, ou audit du taux de refus par groupe |

## Pour aller plus loin

- **Un coût par dossier plutôt qu'un coût fixe.** Un défaut sur 25 000 $ ne coûte pas comme un défaut sur 2 000 $ : remplace `10 × FN + 1 × FP` par une somme de montants réels et recalcule le seuil. Le seuil devient alors **variable selon le dossier** — c'est ce que font les vrais moteurs de décision.
- **Calibrer les probabilités.** Un score de 0,3 doit vouloir dire « 30 % de ces dossiers font défaut ». Passe le modèle dans `CalibratedClassifierCV`, trace la courbe de calibration avant / après, et regarde si le seuil optimal bouge.
- **Auditer l'équité.** Compare le taux de refus et le taux d'erreur par situation de logement et par tranche d'âge. Si un groupe est systématiquement plus refusé à risque égal, le modèle n'est pas déployable tel quel — c'est le premier point que soulèvera le régulateur.

## Liens utiles

- Le jeu de données : https://www.openml.org/d/43454 · sa version Kaggle, avec des dizaines de notebooks publics à comparer au tien : https://www.kaggle.com/datasets/laotse/credit-risk-dataset
- Choisir un seuil directement avec scikit-learn (`TunedThresholdClassifierCV`) : https://scikit-learn.org/stable/modules/classification_threshold.html
- Tout sur le déséquilibre, et pourquoi SMOTE n'est pas toujours une bonne idée avec les arbres boostés : https://imbalanced-learn.org/stable/
- Optuna, tutoriel officiel (pruning, visualisations, multi-objectifs) : https://optuna.readthedocs.io/en/stable/tutorial/index.html
- SHAP (waterfall, force plot, interactions) : https://shap.readthedocs.io/en/latest/
- Les hyperparamètres de XGBoost : https://xgboost.readthedocs.io/en/stable/parameter.html
- Le projet frère, sur une régression et avec `RandomizedSearchCV` : [projet A1 · Énergie des bâtiments](../A1-energie-batiments/)
- Le gabarit du rapport : [`../gabarit-rapport.md`](../gabarit-rapport.md)
