# Projet A4 · Séries temporelles : prévoir la consommation électrique · ⭐⭐⭐

> ⚠️ Le notebook de ce projet reste à écrire. Cette fiche décrit ce qu'il contiendra.

Réserve « pour aller plus loin » · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 6 à 8 (premier modèle, Kaggle) et de préférence [A1](../A1-energie-batiments/) · **pensé pour le GPU T4 gratuit de Colab** (*Exécution → Modifier le type d'exécution → T4 GPU*) — SARIMA, Prophet et XGBoost tournent aussi très bien sur CPU, seul le LSTM y gagne

## Objectif

Un gestionnaire de réseau électrique doit dire aujourd'hui combien on consommera dans une semaine et dans un mois : trop bas, il achète en urgence au prix fort ; trop haut, il paie une production qui ne servira à personne.
Ce projet sert à l'équipe qui pilote l'achat d'énergie, et il pose une question que les projets tabulaires n'ont jamais : **on ne mélange pas les lignes**, l'ordre du temps est l'information, et une validation croisée classique est une fuite pure et simple.
À la fin, tu as cinq méthodes de prévision comparées sur le même protocole de backtesting, un tableau MAE / MAPE **par méthode et par horizon** (7 jours et 30 jours), et une réponse argumentée à « laquelle recommander, et à quel prix de complexité ».

## Les données

**Le jeu principal — PJM East.** `https://raw.githubusercontent.com/panambY/Hourly_Energy_Consumption/master/data/PJME_hourly.csv` : **145 366 relevés horaires** de la consommation électrique de la zone Est de PJM (le plus grand réseau américain), du 31 décembre 2002 au 2 janvier 2018, deux colonnes — `Datetime` et `PJME_MW` (mégawatts). Environ 4 Mo, chargé directement par `pandas.read_csv(url)`, puis mis en cache dans `data/`. C'est le miroir GitHub du [jeu Kaggle « Hourly Energy Consumption »](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption), qui, lui, demande un compte.

Les relevés horaires sont **agrégés en journalier** (moyenne des 24 heures) : ≈ 5 500 jours. On perd le cycle jour/nuit — qui n'intéresse pas la question posée — et on gagne une série sur laquelle SARIMA et Prophet tournent en secondes plutôt qu'en heures. Le notebook garde la série horaire de côté pour une piste « pour aller plus loin ».

**Le jeu d'introduction — passagers aériens.** `https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv` : 144 valeurs mensuelles (1949-1960), 4 Ko. C'est la série de manuel : une tendance nette, une saisonnalité annuelle nette, et une amplitude saisonnière qui **croît avec le niveau** (saisonnalité multiplicative). Elle sert à voir en trois graphiques ce qu'est une décomposition, avant d'attaquer les 5 500 jours de PJM.

**Sans réseau** : comme dans les autres projets de la réserve, un `DONNEES_SECOURS` intégré au notebook prend le relais — deux ans de série journalière synthétique fabriquée avec une tendance, une saisonnalité annuelle, un cycle hebdomadaire et du bruit. Tout le pipeline tourne, les chiffres n'ont juste plus de valeur métier.

**Nettoyage attendu** : un pas de temps régulier reconstruit avec `asfreq("D")`, les heures manquantes des changements d'heure et les rares trous comblés par interpolation temporelle (et **notés dans le journal** — un trou comblé n'est pas une donnée), les doublons d'horodatage traités, et une inspection des valeurs aberrantes (pannes, tempêtes) qu'on **garde** en les signalant plutôt que de les lisser : un modèle qui n'a jamais vu de pic n'en prévoira jamais.

## Ce que tu entraînes et règles

**Le protocole d'abord, parce que tout en dépend.** Le découpage est **chronologique** : les dernières 20 % de la série forment le test, jamais mélangées. Le backtesting utilise `TimeSeriesSplit` (5 plis à fenêtre croissante) : chaque pli s'entraîne sur le passé et prévoit le futur immédiat. Deux horizons sont évalués séparément, **7 jours** et **30 jours** — une méthode qui gagne à 7 jours peut perdre à 30, et c'est justement le résultat intéressant.

Métriques : **MAE** en mégawatts (lisible : « on se trompe de X MW en moyenne ») et **MAPE** en pourcentage (comparable d'une série à l'autre), plus le RMSE pour pénaliser les gros ratés. Le notebook dit aussi ce que le MAPE ne sait pas faire (il explose près de zéro) — ici la consommation ne s'approche jamais de zéro, donc il est utilisable.

**Section 4, avant tout modèle : comprendre la série.**
- **Décomposition saisonnière** (`seasonal_decompose` et `STL` de statsmodels) : tendance, saisonnalité, résidu, en additif puis en multiplicatif, sur les passagers aériens puis sur PJM.
- **Autocorrélation** : `plot_acf` / `plot_pacf` — les pics à 7 et 365 jours sautent aux yeux et se lisent directement comme des ordres candidats pour SARIMA.
- **Stationnarité** : test de **Dickey-Fuller augmenté** (`adfuller`) et test **KPSS**, avant et après différenciation. On établit combien de différenciations sont nécessaires (`d`) et si une différenciation saisonnière (`D`) l'est aussi. La phrase à retenir et à savoir dire en soutenance : SARIMA exige la stationnarité, XGBoost et les réseaux s'en moquent.

**Les cinq candidats**, tous évalués sur exactement le même backtesting :

| Modèle | Ce qu'il apporte | Ce qu'on règle |
|---|---|---|
| **Baseline naïve** (`y(t) = y(t-1)`) | le plancher absolu : « demain comme aujourd'hui » | rien — et c'est le but |
| **Baseline saisonnière** (`y(t) = y(t-7)`) | « comme la semaine dernière, même jour » : redoutablement dure à battre | rien |
| **SARIMA** (`statsmodels.tsa.statespace.SARIMAX`) | le modèle statistique classique, avec intervalles de confiance | `(p,d,q)(P,D,Q,s)` : d'abord lus sur l'ACF/PACF, puis affinés par une petite grille sur l'AIC |
| **Prophet** (Meta) | tendance à ruptures + saisonnalités multiples + jours fériés, sans réglage manuel | `yearly_seasonality`, `weekly_seasonality`, `changepoint_prior_scale`, et l'ajout des jours fériés américains |
| **XGBoost sur variables de calendrier et lags** | l'approche « machine learning » : la série devient un tableau | les lags retenus (1, 7, 14, 365), les moyennes glissantes (7, 30), et les hyperparamètres habituels |
| **LSTM** (Keras) | une mémoire apprise sur des fenêtres de 30 jours | longueur de fenêtre, nombre d'unités, epochs — et la **normalisation ajustée sur l'apprentissage seulement** |

Le **feature engineering** de la ligne XGBoost est le cœur pédagogique du projet : transformer une série en tableau, c'est fabriquer `jour_de_semaine`, `mois`, `jour_de_l_annee`, `est_week_end`, un encodage **cyclique** (`sin`/`cos` du jour de l'année, pour que le 31 décembre soit voisin du 1er janvier), les lags et les moyennes glissantes. Et le piège à nommer explicitement : **une moyenne glissante calculée sur la fenêtre courante est une fuite** ; tout doit être décalé d'au moins un pas.

Le **livrable chiffré** est le tableau final : une ligne par méthode, deux colonnes MAE (7 j, 30 j), deux colonnes MAPE, une colonne temps d'entraînement — plus un graphique qui superpose les prévisions des cinq méthodes sur le dernier mois de test.

Le notebook suivra la structure et les conventions des autres projets de la réserve : interrupteur `MODE_RAPIDE` en tête (série tronquée à 2 ans, grilles réduites, 3 epochs pour le LSTM), helper `verifier()` affichant ✅/❌, six à huit exercices « À toi » avec solution repliée, un `JOURNAL` de nettoyage, et une cellule « Rapport » à la fin de chaque section.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `pandas` (index temporel, `resample`, `shift`, `rolling`), `numpy`, `matplotlib` | déjà dans Colab, rien à faire |
| `statsmodels` (`seasonal_decompose`, `STL`, `adfuller`, `kpss`, `plot_acf`, `SARIMAX`) | déjà dans Colab |
| `scikit-learn` (`TimeSeriesSplit`, `mean_absolute_error`, `mean_absolute_percentage_error`) | déjà dans Colab |
| `xgboost` (`XGBRegressor`) | déjà dans Colab |
| `prophet` | **pas préinstallé** : `!pip install -q prophet` (≈ 1 min, la cellule le fait) |
| `tensorflow` / `keras` (`LSTM`, `Dense`) | déjà dans Colab |
| Les deux CSV, par URL | rien à installer, `pandas.read_csv(url)` |

**Aucune clé d'API, aucun compte, aucun paiement.** En local : `pip install -r ../requirements.txt` (qui contient déjà `prophet` et `statsmodels`).

## Déroulé (≈ 3 h 30)

Le notebook sera bâti en 9 sections numérotées de 0 à 9, comme les autres projets de la réserve.

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | **§0 Préparation** : `MODE_RAPIDE`, les helpers, l'installation de `prophet` |
| 10-25 min | **§1 Contexte** : la question métier, les deux horizons, pourquoi le MAE **et** le MAPE, et l'avertissement central — ici, mélanger les lignes est une fuite |
| 25-45 min | **§2 Les données** : les passagers aériens en trois graphiques, puis PJM (145 366 relevés horaires), le dictionnaire des variables, l'agrégation en journalier |
| 45-70 min | **§3 Nettoyage et feature engineering** : pas de temps régulier, trous interpolés et notés au journal, variables de calendrier, encodage cyclique, lags et moyennes glissantes — **et la chasse à la fuite** |
| 70-105 min | **§4 Analyse exploratoire** : décomposition additive puis multiplicative, ACF / PACF, tests ADF et KPSS avant / après différenciation, profils par jour de semaine et par mois |
| 105-155 min | **§5 Modèles candidats** : les deux baselines, SARIMA, Prophet, XGBoost, LSTM — chacun entraîné et évalué avec la **même** fonction de backtesting |
| 155-185 min | **§6 Réglage** : ordres SARIMA affinés sur l'AIC, `changepoint_prior_scale` de Prophet, hyperparamètres et jeu de lags de XGBoost, avant → après pour chacun |
| 185-200 min | **§7 Interprétation** : les résidus (sont-ils du bruit ?), les dates où chaque méthode se plante, l'importance des variables XGBoost, les intervalles de confiance de SARIMA et Prophet |
| 200-210 min | **§8 Conclusion** (le tableau final, la recommandation par horizon) et **§9 Pour aller plus loin** |

En `MODE_RAPIDE = True`, compte **quelques minutes** de calcul (série tronquée, grilles réduites, LSTM à 3 epochs) ; en version complète sur GPU T4, davantage — surtout le LSTM et la grille SARIMA, qui sont les deux postes coûteux.

Si le temps manque : arrête-toi à la fin de la section 5, quand les cinq méthodes ont un chiffre. Le réglage et l'analyse des résidus font une reprise nette au créneau suivant.

## Livrable

`A4_series_temporelles.ipynb` exécuté de bout en bout, les exercices en ✅, la cellule `MA_SYNTHESE` remplie — plus un **rapport de 10 à 15 slides** suivant [`../gabarit-rapport.md`](../gabarit-rapport.md), présenté en 10 minutes. Deux slides sont obligatoires ici : le **tableau MAE / MAPE par méthode et par horizon**, et le graphique des cinq prévisions superposées sur le dernier mois de test. La slide « démo » : la prévision des 30 prochains jours, avec son intervalle.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. Le protocole** | `train_test_split` avec `shuffle=True`, ou une validation croisée classique | Découpage **chronologique**, backtesting avec `TimeSeriesSplit`, test jamais touché avant la fin | Le coût d'une fuite est **montré** : le même modèle évalué avec et sans mélange, et l'écart de score commenté |
| **2. Les baselines** | On commence par SARIMA | Naïve **et** saisonnière mesurées d'abord, présentes dans tous les tableaux | Tu constates que la baseline saisonnière bat certains modèles à 7 jours, et tu en tires la conséquence honnête |
| **3. Comprendre la série** | Un graphique de la série, rien de plus | Décomposition, ACF/PACF, ADF et KPSS ; les ordres SARIMA sont **justifiés** par ces graphiques, pas devinés | Additif vs multiplicatif est tranché sur les données, et la différenciation retenue est justifiée par les deux tests, y compris quand ils se contredisent |
| **4. Les cinq méthodes** | Deux ou trois méthodes, protocoles différents | SARIMA, Prophet, XGBoost et LSTM évalués avec la **même** fonction de backtesting et les mêmes horizons | Le temps d'entraînement figure au tableau, et tu discutes le rapport gain / complexité — pas seulement le meilleur MAE |
| **5. Le feature engineering** | Les lags copiés sans réfléchir | Calendrier, encodage cyclique, lags et moyennes glissantes, tous **décalés** : aucune variable ne connaît le futur | Tu testes plusieurs jeux de lags et montres lesquels comptent (importance XGBoost), et tu expliques ce que l'encodage cyclique répare |
| **6. La recommandation** | « SARIMA est le meilleur » | La recommandation dépend de l'horizon, chiffres à l'appui, et les limites sont nommées (une seule zone, pas de météo, pas de prix) | Une piste testable est proposée et son gain estimé : ajouter la température, prévoir en horaire, ou combiner les prévisions |

## Pour aller plus loin

- **Ajouter la météo.** La consommation électrique suit la température de très près (chauffage, climatisation). Récupère les températures journalières de la zone via une API gratuite et sans clé comme https://open-meteo.com/en/docs, ajoute-les comme variable exogène (`exog` dans SARIMAX, `add_regressor` dans Prophet, une colonne de plus pour XGBoost) et mesure le gain. C'est de loin la piste la plus rentable.
- **Combiner les prévisions.** La moyenne de plusieurs modèles bat très souvent le meilleur d'entre eux, parce que leurs erreurs ne sont pas corrélées. Teste une moyenne simple, puis une moyenne pondérée par l'inverse de l'erreur de backtesting.
- **Revenir à l'horaire.** Le jeu d'origine a 145 366 points et deux saisonnalités emboîtées (24 h et 7 jours) : c'est le terrain de `Prophet` avec `add_seasonality`, ou d'un LSTM à fenêtre longue. Beaucoup plus lourd, nettement plus proche du vrai métier d'un gestionnaire de réseau.

## Liens utiles

- Le CSV utilisé (miroir GitHub, sans compte) : https://raw.githubusercontent.com/panambY/Hourly_Energy_Consumption/master/data/PJME_hourly.csv · le dépôt : https://github.com/panambY/Hourly_Energy_Consumption · l'original Kaggle : https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption
- La série d'introduction (passagers aériens) : https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv
- **Le manuel de référence, gratuit et en ligne** — *Forecasting: Principles and Practice* : https://otexts.com/fpp3/ · le chapitre ARIMA : https://otexts.com/fpp3/arima.html
- SARIMAX dans statsmodels : https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html · un exemple complet : https://www.statsmodels.org/stable/examples/notebooks/generated/statespace_sarimax_stata.html
- Prophet : le démarrage rapide https://facebook.github.io/prophet/docs/quick_start.html · la saisonnalité et les jours fériés https://facebook.github.io/prophet/docs/seasonality,_holiday_effects,_and_regressors.html · le backtesting intégré https://facebook.github.io/prophet/docs/diagnostics.html
- `TimeSeriesSplit` et pourquoi une CV classique ne marche pas ici : https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html · les schémas de découpage : https://scikit-learn.org/stable/auto_examples/model_selection/plot_cv_indices.html
- La couche `LSTM` de Keras : https://keras.io/api/layers/recurrent_layers/lstm/
- Le gabarit du rapport : [`../gabarit-rapport.md`](../gabarit-rapport.md)
