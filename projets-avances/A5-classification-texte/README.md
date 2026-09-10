# Projet A5 · Classification de texte : cette critique est-elle positive ? · ⭐⭐⭐

> ⚠️ Le notebook de ce projet reste à écrire. Cette fiche décrit ce qu'il contiendra.

Réserve « pour aller plus loin » · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 6 à 8 (premier modèle, Kaggle) ; la séance 9 (comment fonctionne un LLM) aide pour la partie CamemBERT · **pensé pour le GPU T4 gratuit de Colab** (*Exécution → Modifier le type d'exécution → T4 GPU*) — TF-IDF tourne sur CPU en secondes, le fine-tuning de CamemBERT veut le GPU

## Objectif

Un site de cinéma reçoit des milliers de critiques par jour et voudrait savoir, sans les lire, lesquelles sont positives — pour afficher une note agrégée, remonter les films qui déçoivent, ou repérer une campagne de dénigrement.
Ce projet sert à l'équipe éditoriale du site, et il pose une question de décision très concrète : trois approches donnent trois rapports qualité / coût radicalement différents, et la meilleure exactitude n'est pas toujours celle qu'on déploie.
À la fin, tu as trois modèles comparés sur les mêmes critiques — un sac de mots qu'on peut lire mot par mot, un réseau récurrent, et un modèle de langue français fine-tuné —, un tableau exactitude / F1 / temps, et une analyse d'erreurs qui montre où *toutes* les méthodes butent : l'ironie.

## Les données

**Allociné**, via Hugging Face : [`tblard/allocine`](https://huggingface.co/datasets/tblard/allocine) — **200 000 critiques de films en français**, écrites par de vrais spectateurs, réparties en 160 000 pour l'apprentissage, 20 000 pour la validation et 20 000 pour le test. Deux colonnes : `review` (le texte) et `label` (`0` = négatif, `1` = positif), classes équilibrées. ≈ 75 Mo au format parquet. C'est le jeu de référence francophone pour l'analyse de sentiment, celui sur lequel CamemBERT a été évalué à sa sortie.

Chargement : `load_dataset("tblard/allocine")` de la bibliothèque `datasets`. En `MODE_RAPIDE`, on tire un **sous-échantillon stratifié** — de l'ordre de 20 000 critiques pour l'apprentissage et 5 000 pour le test — pour que les trois modèles tiennent dans un créneau. La stratification est explicite et vérifiée : un sous-échantillon déséquilibré fausserait toute la comparaison.

**Si `datasets` ou le Hub sont indisponibles**, le notebook bascule sur la lecture directe du parquet du split de test par URL (`https://huggingface.co/datasets/tblard/allocine/resolve/main/allocine/test-00000-of-00001.parquet`, 7,5 Mo, 20 000 critiques) avec `pandas.read_parquet`. Et **sans réseau du tout**, un `DONNEES_SECOURS` d'une centaine de critiques courtes écrites pour le notebook prend le relais : tout le pipeline s'exécute, les scores n'ont plus de valeur (100 critiques ne suffisent à entraîner personne) mais le code, les vérifications et les exercices restent démontrables.

**Nettoyage attendu, et sa limite.** Les critiques réelles contiennent du HTML résiduel, des URLs, des répétitions de ponctuation (`!!!!`), des majuscules criées, des fautes. Le notebook nettoie ce qui est du bruit pur, **note chaque geste dans un journal**, et pose la question franchement : `!!!!` et les majuscules sont-ils du bruit, ou **du signal** ? On mesure les deux versions plutôt que de trancher au doigt mouillé — et on découvre que pour le sac de mots, retirer la ponctuation coûte des points.

## Ce que tu entraînes et règles

Métriques : **exactitude** (les classes sont équilibrées, elle est honnête ici), **F1 macro**, plus le rapport de classification complet et la matrice de confusion. Et une colonne qu'on oublie trop souvent au tableau : le **temps d'entraînement et le temps de prédiction**, parce que c'est lui qui décide de ce qu'on déploie.

| Modèle | Ce qu'il apporte | Ce qu'on règle |
|---|---|---|
| Classe majoritaire | le plancher : 50 % sur un jeu équilibré | rien |
| **TF-IDF + régression logistique** | un modèle qu'on peut **lire** : chaque mot a un coefficient | `ngram_range` (mots seuls vs bigrammes), `min_df`, `max_features`, `C` |
| **`TextVectorization` + `Embedding` + BiLSTM** (Keras) | l'ordre des mots, une représentation apprise | taille du vocabulaire, longueur de séquence, dimension d'embedding, unités LSTM, dropout |
| **`almanach/camembert-base` fine-tuné** | un modèle de langue pré-entraîné sur 138 Go de français | learning rate (`2e-5`), nombre d'epochs, longueur maximale de tokens, taille de lot |

**La ligne TF-IDF est la plus instructive du projet.** Une fois la régression logistique entraînée, on trie ses coefficients et on affiche les **20 mots les plus positifs et les 20 plus négatifs** : « chef-d'œuvre », « bouleversant », « magistral » d'un côté ; « navet », « ennui », « pénible » de l'autre. C'est un modèle qu'on peut montrer à un journaliste, défendre devant un juriste, et déboguer en le lisant — et il fait déjà l'essentiel du travail, en quelques secondes de CPU. Toute la suite du notebook doit se justifier **contre** cette référence.

**La ligne BiLSTM** montre ce que le sac de mots ne peut pas voir : « ce film n'est pas mauvais » et « ce film est mauvais » ont presque le même sac de mots. `TextVectorization` fait la tokenisation dans le modèle (donc une phrase brute peut lui être donnée telle quelle), `Embedding` apprend une représentation dense des mots, et le `Bidirectional(LSTM)` lit la phrase dans les deux sens. Avec `EarlyStopping` sur la perte de validation.

**La ligne CamemBERT** est le fine-tuning : `AutoTokenizer` + `AutoModelForSequenceClassification.from_pretrained("almanach/camembert-base", num_labels=2)`, entraîné avec la classe **`Trainer`** de `transformers` — `TrainingArguments` (learning rate `2e-5`, 1 epoch en mode rapide, `fp16` quand un GPU est disponible), `DataCollatorWithPadding`, et une fonction `compute_metrics` qui renvoie exactitude et F1 à chaque évaluation. On y voit que 110 millions de paramètres déjà entraînés sur du français battent tout ce qui précède — et ce que ça coûte en minutes de GPU.

**L'analyse d'erreurs** ferme le projet, et c'est elle qui sépare une bonne soutenance d'une bonne accuracy. On extrait les critiques que chaque modèle rate, on les lit, et on les range en familles :
- l'**ironie** (« un chef-d'œuvre… d'ennui ») — sur laquelle le sac de mots se trompe systématiquement, et où CamemBERT lui-même flanche ;
- les critiques **ambiguës** ou mitigées (« les acteurs sont excellents mais le scénario ne tient pas ») — où la vérité terrain elle-même est discutable ;
- les critiques **très courtes** (« bof. ») — peu de signal ;
- les critiques qui parlent **d'autre chose** que du film (la salle, le prix du billet).

Puis un **diagramme de recouvrement** : sur quelles critiques les trois modèles sont-ils d'accord ? Celles que les trois ratent sont-elles vraiment étiquetables ?

Le notebook suivra la structure et les conventions des autres projets de la réserve : interrupteur `MODE_RAPIDE` en tête, helper `verifier()` affichant ✅/❌, six à huit exercices « À toi » avec vérification et solution repliée, un `JOURNAL` de nettoyage, et une cellule « Rapport » à la fin de chaque section.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `pandas`, `numpy`, `matplotlib` | déjà dans Colab, rien à faire |
| `scikit-learn` (`TfidfVectorizer`, `LogisticRegression`, `classification_report`, `confusion_matrix`) | déjà dans Colab |
| `datasets` (chargement d'Allociné depuis le Hub) | `!pip install -q datasets`, fait par la cellule de préparation |
| `transformers` (`AutoTokenizer`, `AutoModelForSequenceClassification`, `Trainer`, `TrainingArguments`) | déjà dans Colab ; sinon `!pip install -q transformers` |
| `almanach/camembert-base` (110 M de paramètres, ≈ 440 Mo) | téléchargé automatiquement depuis le Hub au premier appel, **sans compte ni jeton** |
| `tensorflow` / `keras` (`TextVectorization`, `Embedding`, `Bidirectional`, `LSTM`) | déjà dans Colab |
| `pyarrow` (le repli parquet par URL) | déjà dans Colab |

**Aucune clé d'API, aucun compte Hugging Face, aucun paiement.** Le modèle et le jeu de données sont publics et se téléchargent anonymement. En local : `pip install -r ../requirements.txt`.

## Déroulé (≈ 3 h 30)

Le notebook sera bâti en 9 sections numérotées de 0 à 9, comme les autres projets de la réserve.

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | **§0 Préparation** : `MODE_RAPIDE`, les helpers, `!pip install datasets`, vérification du GPU |
| 10-25 min | **§1 Contexte** : la question métier, pourquoi l'exactitude suffit ici (classes équilibrées), et ce que « coût » veut dire quand on compare trois approches |
| 25-45 min | **§2 Les données** : chargement d'Allociné et ses trois portes de secours, dictionnaire des variables, sous-échantillon stratifié, quelques critiques lues en entier |
| 45-75 min | **§3 Nettoyage** : minuscules, HTML, URLs, ponctuation répétée — chaque geste au journal, et la question « bruit ou signal ? » tranchée par la mesure |
| 75-100 min | **§4 Analyse exploratoire** : longueur des critiques par classe, mots les plus fréquents de chaque camp, taille du vocabulaire, loi de Zipf, part des critiques très courtes |
| 100-145 min | **§5 Modèles candidats** : classe majoritaire, **TF-IDF + logistique** avec ses 20 mots les plus positifs et négatifs, puis le **BiLSTM** avec ses courbes |
| 145-185 min | **§6 Fine-tuning** : tokenisation CamemBERT, `Trainer`, entraînement, courbe de perte, et le tableau comparatif complet (exactitude, F1, temps) |
| 185-205 min | **§7 Interprétation** : matrices de confusion, analyse d'erreurs par famille, l'ironie disséquée sur des exemples, recouvrement entre les trois modèles |
| 205-210 min | **§8 Conclusion** (la recommandation et son coût) et **§9 Pour aller plus loin** |

En `MODE_RAPIDE = True`, compte **quelques minutes** de calcul sur GPU T4 (TF-IDF en secondes, le BiLSTM en une poignée de minutes, CamemBERT sur un sous-échantillon et 1 epoch) ; en version complète sur les 160 000 critiques, davantage — le fine-tuning est de loin le poste le plus lourd. Sur CPU, garde `MODE_RAPIDE = True` et attends-toi à ce que CamemBERT prenne l'essentiel du temps.

Si le temps manque : arrête-toi après **TF-IDF + logistique** et ses coefficients. C'est la référence contre laquelle tout se juge, et elle est déjà présentable. Le BiLSTM et CamemBERT font une reprise nette au créneau suivant.

## Livrable

`A5_classification_texte.ipynb` exécuté de bout en bout, les exercices en ✅, la cellule `MA_SYNTHESE` remplie — plus un **rapport de 10 à 15 slides** suivant [`../gabarit-rapport.md`](../gabarit-rapport.md), présenté en 10 minutes. Trois slides sont obligatoires ici : les **20 mots les plus positifs et négatifs** (c'est la slide que tout le monde retient), le **tableau comparatif exactitude / F1 / temps**, et une slide d'**analyse d'erreurs** avec trois critiques ratées et leur famille. La slide « démo » : deux critiques que tu écris toi-même, dont une ironique, passées dans les trois modèles.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. Les données et la baseline** | Le jeu est chargé, on entraîne | Sous-échantillon **stratifié** et vérifié, classe majoritaire mesurée, quelques critiques lues et citées dans le rapport | Le repli sans réseau est testé, et tu dis ce que le sous-échantillonnage coûte en points |
| **2. Le nettoyage** | Tout est nettoyé « parce qu'on nettoie » | Journal complet, et le choix de garder ou retirer la ponctuation et les majuscules est **mesuré**, pas supposé | Tu montres le cas où nettoyer fait perdre des points, et tu conclus que « bruit » dépend du modèle |
| **3. Le modèle lisible** | TF-IDF entraîné, coefficients jamais regardés | 20 mots les plus positifs et négatifs affichés, commentés, et le score sert de référence à tout le reste | Les bigrammes sont testés (`ngram_range=(1,2)`) et tu montres ce qu'ils rattrapent — « pas mauvais », « sans intérêt » |
| **4. Le réseau récurrent** | Un LSTM qui tourne, sans courbes | `TextVectorization` + `Embedding` + BiLSTM, courbes train / validation lues, `EarlyStopping` actif, gain vs TF-IDF chiffré | Tu expliques ce que le BiLSTM voit et que le sac de mots ne peut pas voir, exemple à l'appui |
| **5. Le fine-tuning** | `Trainer` lancé, aucun avant / après | CamemBERT fine-tuné avec `Trainer`, hyperparamètres affichés, exactitude et F1 comparés aux deux autres, **avec le temps** | Le rapport gain / coût est assumé : combien de points pour combien de minutes de GPU, et laquelle des trois approches tu déploies vraiment |
| **6. L'analyse d'erreurs** | « Le modèle se trompe parfois » | Les erreurs sont lues, rangées en familles (ironie, ambiguïté, critiques courtes, hors sujet), avec des exemples cités | Le recouvrement entre modèles est étudié, et tu montres une critique dont l'étiquette de référence est elle-même discutable |

## Pour aller plus loin

- **Passer à cinq classes.** Le sentiment binaire écrase toute la nuance : une critique tiède et une critique enthousiaste tombent dans le même sac. Les notes d'origine d'Allociné vont de 0 à 5 ; entraîne une classification ordinale (ou une régression) et regarde où l'exactitude s'effondre — c'est presque toujours entre les classes voisines.
- **Essayer un modèle plus léger, ou plus lourd.** `distilcamembert-base` divise le temps d'inférence par deux pour une poignée de points ; `camembert-large` fait l'inverse. Ajoute-les au tableau avec leur temps de prédiction par critique : c'est ce chiffre-là qui décide si on peut classer 10 000 critiques par jour.
- **Tester la robustesse.** Applique le modèle à des critiques d'un autre domaine (restaurants, livres, produits) : la chute d'exactitude mesure ce que le modèle a appris du *cinéma* plutôt que du *sentiment*. C'est le test qu'on oublie systématiquement avant une mise en production.

## Liens utiles

- Le jeu de données Allociné : https://huggingface.co/datasets/tblard/allocine · charger un jeu depuis le Hub : https://huggingface.co/docs/datasets/loading
- Le modèle : https://huggingface.co/almanach/camembert-base · l'article CamemBERT : https://arxiv.org/abs/1911.03894 · la documentation du modèle dans `transformers` : https://huggingface.co/docs/transformers/main/en/model_doc/camembert
- Fine-tuner un classifieur de texte, pas à pas (cours Hugging Face) : https://huggingface.co/learn/llm-course/chapter3/3 · la tâche complète : https://huggingface.co/docs/transformers/main/en/tasks/sequence_classification
- La classe `Trainer` et tous ses arguments : https://huggingface.co/docs/transformers/main/en/main_classes/trainer
- `TfidfVectorizer` : https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html · le rapport de classification : https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html
- `TextVectorization` dans Keras : https://keras.io/api/layers/preprocessing_layers/text/text_vectorization/ · un exemple complet de BiLSTM pour la classification : https://keras.io/examples/nlp/bidirectional_lstm_imdb/
- Le projet frère, qui fine-tune un modèle de langue pour **générer** au lieu de classer : [projet A6 · Génération de texte](../A6-generation-texte/)
- Le gabarit du rapport : [`../gabarit-rapport.md`](../gabarit-rapport.md)
