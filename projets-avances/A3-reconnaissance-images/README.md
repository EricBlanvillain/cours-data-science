# Projet A3 · Reconnaissance d'images · ⭐⭐⭐

Réserve « pour aller plus loin » · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 6 à 8 (premier modèle, Kaggle) · **pensé pour le GPU T4 gratuit de Colab** (*Exécution → Modifier le type d'exécution → T4 GPU*)

## Objectif

Une boutique en ligne reçoit chaque jour des milliers de photos de produits envoyées par ses vendeurs, et les classer à la main (« est-ce un pull ou un manteau ? ») coûte du temps et produit des erreurs ; une application de jardinage a exactement le même besoin avec des fleurs photographiées au téléphone.
Ce projet sert à l'équipe produit, qui doit décider si elle déploie l'étiquetage automatique et avec quel niveau de relecture humaine — donc il faut un score, mais aussi la preuve que le modèle regarde la bonne chose.
À la fin, tu as un CNN construit de zéro, un modèle pré-entraîné transféré puis fine-tuné sur de vraies photos, une matrice de confusion dont les erreurs sont compréhensibles, et des cartes Grad-CAM qui montrent où le modèle a regardé.

## Les données

**Deux jeux, dans cet ordre, parce qu'ils posent deux problèmes différents.**

**Fashion-MNIST** (Zalando, licence MIT) : intégré à Keras (`keras.datasets.fashion_mnist`), rien à télécharger à la main. 60 000 images d'apprentissage + 10 000 de test, **28 × 28 pixels en niveaux de gris**, 10 classes parfaitement équilibrées (T-shirt, pantalon, pull, robe, manteau, sandale, chemise, basket, sac, bottine). C'est le terrain idéal pour construire un réseau convolutif de A à Z et comprendre chaque couche. En `MODE_RAPIDE`, 10 000 images d'apprentissage et 2 000 de test.

**tf_flowers** : **3 670 photos JPEG** de tailles variées, 5 classes (`daisy`, `dandelion`, `roses`, `sunflowers`, `tulips`), licence CC-BY, crédits photo dans le `LICENSE.txt` de l'archive. Téléchargées une fois (218 Mo) depuis `https://storage.googleapis.com/download.tensorflow.org/example_images/flower_photos.tgz` avec `keras.utils.get_file`, et mises en cache dans `data/` — le second lancement ne retélécharge rien. Vraies couleurs, vrais fonds, vrais cadrages : là, un CNN maison ne suffit plus.

**Sans réseau**, le notebook le dit et bascule : Fashion-MNIST, converti en RVB et redimensionné, sert aussi de jeu « photos ». Le code est identique, seuls les résultats changent.

Le prétraitement : pixels ramenés entre 0 et 1 pour Fashion-MNIST (exercice 1) ; pour les photos, tout est redimensionné à `IMG_SIZE × IMG_SIZE × 3` — **96 px en mode rapide, 160 en complet** — et les pixels restent entre 0 et 255, la mise à l'échelle attendue par MobileNetV2 étant faite *dans* le modèle par une couche `Rescaling`. Avantage : une photo téléchargée du web en section 7 n'a besoin d'aucun prétraitement. Découpage stratifié 64 / 16 / 20 %, et chaque décision est notée dans un `JOURNAL`.

## Ce que tu entraînes et règles

Métrique : l'**accuracy** (les classes sont équilibrées, elle est honnête ici), complétée par la matrice de confusion et l'accuracy par classe. Repères annoncés : au-delà de 90 % sur Fashion-MNIST et de 85 % sur les fleurs, le modèle vaut un test en production avec relecture des cas incertains.

| Modèle | Jeu | Ce qu'il apporte |
|---|---|---|
| Régression logistique sur les 784 pixels | Fashion-MNIST | la baseline « bête » : ce qui est facile sans rien comprendre aux formes |
| **CNN maison** (`Conv2D` + `MaxPooling2D` → `Flatten` → `Dropout` → `Dense`) | Fashion-MNIST | ce qu'apporte d'apprendre des motifs locaux |
| CNN maison v2 (3 blocs 32/64/128, dropout 0,5) | Fashion-MNIST | l'effet de la profondeur (exercice 4) |
| CNN maison + augmentation | Fashion-MNIST | miroir, rotation ±10 %, zoom ±10 % (exercice 2) |
| Classe majoritaire | photos | le plancher : ≈ 20 % sur 5 classes |
| CNN maison | photos | la démonstration qu'entraîner de zéro sur 3 670 photos ne marche pas |
| **MobileNetV2 gelé** (ImageNet, `trainable = False`) | photos | le transfert : seule la petite tête de classification apprend |
| **MobileNetV2 fine-tuné** | photos | le modèle retenu |

Le **fine-tuning** est la section centrale : on dégèle les `NB_DEGEL = 30` dernières couches de MobileNetV2 (celles qui détectent les motifs les plus spécifiques à ImageNet) et on les réentraîne avec un learning rate **100 fois plus petit** (`1e-5` au lieu de `1e-3`). Les deux règles d'or sont énoncées et pratiquées : ne dégeler qu'**après** que la tête a convergé — sinon ses gradients aléatoires abîment des poids qui ont coûté des semaines de GPU — et recompiler après tout changement de `trainable`. Un graphique colle les courbes de validation « gelé » puis « fine-tuning » bout à bout, avec le trait vertical du dégel.

`EarlyStopping` (`patience=3`, `restore_best_weights=True`) surveille chaque entraînement. Huit exercices « À toi » avec vérification ✅/❌ et solution repliée ; chacun a un **filet de sécurité** qui remplit la variable si tu l'as laissée vide, donc le notebook ne casse jamais.

**Grad-CAM** ferme le projet : on prend la dernière carte de caractéristiques de MobileNetV2 (`out_relu`), on calcule le gradient de la probabilité prédite par rapport à cette carte, on pondère chaque canal, et on obtient une carte de chaleur. Si le modèle regarde l'herbe au lieu de la fleur, ça se voit immédiatement — c'est le premier test à faire avant de déployer un modèle d'images. Une cellule finale prédit et explique **une photo prise sur le web**, à partir de son URL.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `tensorflow` / `keras` (`layers`, `models`, `callbacks`) | déjà dans Colab, rien à faire |
| `keras.datasets.fashion_mnist` | intégré à Keras, téléchargé automatiquement |
| `keras.applications.MobileNetV2` (poids ImageNet) | téléchargés automatiquement au premier appel, ≈ 9 Mo |
| `scikit-learn` (`train_test_split`, `LogisticRegression`, `confusion_matrix`) | déjà dans Colab |
| `pandas`, `numpy`, `matplotlib` | déjà dans Colab |
| `requests` + `PIL` (la photo du web, section 7) | déjà dans Colab |
| L'archive `flower_photos.tgz` | `keras.utils.get_file`, mise en cache dans `data/` |

**Aucune clé d'API, aucun compte.** Le GPU T4 gratuit de Colab suffit largement ; en `MODE_RAPIDE`, tout tourne aussi sur CPU. En local : `pip install -r ../requirements.txt`.

## Déroulé (≈ 3 h)

Le notebook est bâti en 9 sections numérotées de 0 à 9.

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | **§0 Préparation** et **§1 Contexte** : `MODE_RAPIDE` et ses cinq réglages (epochs, tailles d'échantillon, `IMG_SIZE`), la question métier, ce que veut dire un bon résultat |
| 10-30 min | **§2 Les données** : Fashion-MNIST (dictionnaire des 10 classes, une image par classe), puis tf_flowers (téléchargement, une photo par classe à sa taille d'origine) |
| 30-55 min | **§3 Nettoyage** : normalisation des pixels (**exercice 1**), découpage validation, redimensionnement des photos, recette d'augmentation (**exercice 2**), le journal |
| 55-75 min | **§4 Analyse exploratoire** : image moyenne par classe, intensité par classe (**exercice 3**), ressemblance entre classes, équilibre et couleur moyenne des photos |
| 75-115 min | **§5 Modèles candidats** : baseline logistique, CNN maison, CNN v2 (**exercice 4**), CNN + augmentation, puis sur les photos : classe majoritaire, CNN maison, MobileNetV2 gelé |
| 115-145 min | **§6 Fine-tuning** : dégeler 30 couches (**exercice 5**), recompiler à `1e-5` (**exercice 6**), entraîner, lire la courbe avant / après dégel |
| 145-170 min | **§7 Interprétation** : matrices de confusion, accuracy par classe (**exercice 7**), erreurs typiques affichées, Grad-CAM sur une erreur (**exercice 8**), prédiction d'une photo du web |
| 170-180 min | **§8 Conclusion** (ta synthèse, la recommandation du seuil de confiance) et **§9 Pour aller plus loin** |

En `MODE_RAPIDE = True` (2 epochs, 15 % des photos, images en 96 px), compte **quelques minutes** de calcul, GPU ou non. En `MODE_RAPIDE = False` (12 epochs, toutes les photos, 160 px), compte davantage — c'est là que le T4 gratuit fait la différence, et c'est là seulement que l'augmentation et le fine-tuning montrent tout leur gain.

Si le temps manque : arrête-toi à la fin de la section 5, quand MobileNetV2 gelé a battu le CNN maison. C'est le résultat qui compte ; le fine-tuning et Grad-CAM font une reprise nette au créneau suivant.

## Livrable

`A3_reconnaissance_images.ipynb` exécuté de bout en bout, les huit exercices en ✅, la cellule `MA_SYNTHESE` remplie (la dernière cellule vérifie automatiquement qu'il y a au moins 6 modèles au tableau, que le transfert bat la classe majoritaire, que le CNN bat la baseline et que le fine-tuning a bien été mesuré avant / après) — plus un **rapport de 10 à 15 slides** suivant [`../gabarit-rapport.md`](../gabarit-rapport.md), présenté en 10 minutes, avec une slide « démo » : une photo prise sur le web, la prédiction, et sa carte Grad-CAM.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. Le prétraitement** | Les pixels partent bruts dans le réseau | Pixels normalisés, formes correctes, découpage **stratifié** train / validation / test, journal rempli | Le choix « pixels 0-255 + `Rescaling` dans le modèle » est expliqué, et tu montres qu'une photo du web n'a du coup besoin d'aucun prétraitement |
| **2. La baseline** | On commence directement par un CNN | Logistique sur pixels **et** classe majoritaire mesurées avant tout, présentes au tableau | L'écart baseline → CNN est chiffré, et tu dis ce que ça révèle : Fashion-MNIST est facile, les fleurs ne le sont pas |
| **3. Le CNN maison** | Un modèle qui s'entraîne, sans courbes | Architecture justifiée couche par couche, courbes loss / accuracy train **et** validation lues, `EarlyStopping` actif | L'effet de la profondeur et de l'augmentation est mesuré séparément, et tu constates honnêtement qu'en 2 epochs l'augmentation ne gagne pas encore |
| **4. Le transfert** | MobileNetV2 utilisé sans geler la base | Base gelée, tête entraînée, part de paramètres entraînables affichée, gain vs CNN maison mesuré | Tu expliques pourquoi le transfert gagne dès la première epoch : 1,3 million d'images d'ImageNet contre 3 670 photos |
| **5. Le fine-tuning** | Tout dégelé d'un coup, ou learning rate inchangé | 30 couches dégelées **après** convergence de la tête, recompilation à `1e-5`, accuracy avant → après en points | Plusieurs valeurs de `NB_DEGEL` (10 / 30 / 100) ou de learning rate sont essayées et notées au tableau, avec une conclusion |
| **6. Interprétation** | Un score global, rien d'autre | Matrice de confusion, accuracy par classe, pire classe nommée, erreurs typiques affichées | Grad-CAM est lu sur une **erreur** et tu dis si le modèle regardait le sujet ou le fond ; la recommandation (seuil de confiance + relecture humaine) en découle |

## Pour aller plus loin

- **Changer de squelette.** `EfficientNetB0` ou `ResNet50V2` à la place de MobileNetV2 : même code, `preprocess_input` différent. Compare accuracy, nombre de paramètres et temps par epoch — le meilleur modèle n'est pas toujours celui qu'on déploie sur un téléphone.
- **Ajouter une classe « autre ».** En production, les gens envoient des photos qui ne sont dans aucune des 5 classes. Un modèle qui doit choisir répondra toujours quelque chose, avec aplomb : ajoute une classe « autre » (ou un seuil de confiance sous lequel on refuse de répondre) et mesure ce que ça coûte en accuracy.
- **Tes propres photos.** Range des photos en dossiers (un dossier par classe) et charge-les avec `keras.utils.image_dataset_from_directory` : le reste du notebook fonctionne sans modification. C'est le moyen le plus rapide de transformer ce projet en projet de portfolio personnel.

## Liens utiles

- Fashion-MNIST, le jeu et son article : https://github.com/zalandoresearch/fashion-mnist
- L'archive des photos de fleurs (celle que le notebook télécharge) : https://storage.googleapis.com/download.tensorflow.org/example_images/flower_photos.tgz
- Le guide Keras sur le transfert et le fine-tuning, avec les mêmes règles d'or : https://keras.io/guides/transfer_learning/
- Tous les modèles pré-entraînés disponibles dans Keras : https://keras.io/api/applications/
- Grad-CAM : l'exemple officiel Keras https://keras.io/examples/vision/grad_cam/ et l'article d'origine https://arxiv.org/abs/1610.02391
- Voir une convolution fonctionner, de façon interactive : https://poloclub.github.io/cnn-explainer/
- Le projet qui reprend le même fine-tuning, mais sur du texte : [projet A6 · Génération de texte](../A6-generation-texte/)
- Le gabarit du rapport : [`../gabarit-rapport.md`](../gabarit-rapport.md)
