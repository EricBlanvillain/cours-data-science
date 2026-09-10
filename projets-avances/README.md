# Pour aller plus loin · la réserve de projets ⭐⭐⭐

Une réserve dans laquelle piocher, pas un parcours. Chaque projet reprend la démarche complète d'un data scientist —
**données → nettoyage et feature engineering → analyse → modèles candidats → tuning ou fine-tuning → interprétation →
recommandation** — avec scikit-learn, XGBoost, TensorFlow/Keras et Hugging Face.

Le premier usage, c'est de **remplacer le projet Kaggle Titanic (séances 7 et 8)** quand il ne convient pas au groupe :
trop facile, trop ennuyeux, ou simplement pas le bon sujet. La dernière colonne est là pour ça — elle se lit en trente
secondes, en séance.

| # | Projet | État | Bon remplaçant du projet Kaggle si… |
|---|--------|------|--------------------------------------|
| [A1](A1-energie-batiments/) | Consommation énergétique des bâtiments | **notebook disponible** (20 s en `MODE_RAPIDE`) | … le groupe veut le même exercice sur un autre sujet : même démarche que Titanic, en régression, sur des données publiques réelles |
| [A2](A2-scoring-credit/) | Scoring crédit | **notebook disponible** (25 s) | … le groupe a trouvé Titanic facile : déséquilibre des classes, seuil optimisé sur un coût métier, explication SHAP de la décision |
| [A3](A3-reconnaissance-images/) | Reconnaissance d'images | **notebook disponible** (33 s, GPU T4 conseillé) | … le problème est l'ennui plutôt que le niveau : des images, du transfer learning, et Grad-CAM pour voir ce que le modèle regarde |
| [A4](A4-series-temporelles/) | Séries temporelles | *notebook à écrire* — la fiche décrit ce qu'il contiendra | … le groupe accroche sur l'idée de prévoir : la question n'est plus « qui a survécu ? » mais « combien demain ? », avec le piège de la validation temporelle |
| [A5](A5-classification-texte/) | Classification de texte | *notebook à écrire* — la fiche décrit ce qu'il contiendra | … le groupe préfère le texte aux tableaux : des critiques de films en français, du TF-IDF au fine-tuning de CamemBERT |
| [A6](A6-generation-texte/) | Génération de texte | **notebook disponible** (3 min 30, GPU T4 conseillé) | … le groupe veut voir un modèle *créer* plutôt que classer : du bigramme au LLM adapté avec LoRA |

Les temps indiqués sont ceux d'une exécution complète en `MODE_RAPIDE = True` sur un ordinateur portable, sans GPU.
A1 et A2 tournent partout ; A3 et A6 sont plus confortables avec le GPU T4 gratuit de Colab.

Chaque projet a sa fiche : question métier, données et leur source, ce que tu entraînes et règles, déroulé, livrable
et grille d'évaluation en trois paliers. Prérequis conseillés : séances 6 à 8 (premier modèle, Kaggle).

Pour construire avec un LLM plutôt qu'entraîner des modèles, va voir le module
[Projet avancé · IA agentique](../projets-optionnels/projet-optionnel-avance-ia-agentique/).

## Comment travailler

1. Ouvre le notebook dans Colab (bouton dans le README du cours) — *Exécution → Modifier le type d'exécution → T4 GPU* pour A3 à A6.
2. Laisse `MODE_RAPIDE = True` pour un premier passage complet en quelques minutes (sous-échantillons, 1-2 epochs).
   Passe à `False` quand tout marche : c'est la version complète, avec les temps indiqués dans chaque README.
3. Fais les exercices « À toi » (solutions cachées), puis remplis la cellule « ma synthèse » de la section 8.
4. Rédige le rapport avec [gabarit-rapport.md](gabarit-rapport.md) et présente-le en 10 minutes.

Chaque notebook a la même structure en 9 sections (préparation, question métier, données, nettoyage, analyse, modèles,
tuning, interprétation, conclusion) : le rapport se construit en recopiant les cellules « Rapport ».

## En local (optionnel)

```bash
python3.12 -m venv venv-dl && source venv-dl/bin/activate
pip install -r projets-avances/requirements.txt
jupyter lab
```
Tout tourne sur CPU en `MODE_RAPIDE`. Les données se téléchargent au premier lancement dans un dossier `data/`
(ignoré par git) ou dans les caches Keras / Hugging Face.

## Idées suivantes

Les mêmes recettes s'appliquent à : prix de maisons (Ames, Kaggle « House Prices »), segmentation de clients (RFM +
KMeans sur Online Retail), qualité nutritionnelle (OpenFoodFacts), produits image + texte (Flipkart), recommandation
(MovieLens), détection d'anomalies (fraude bancaire, autoencodeur). Choisis-en un pour ton portfolio.
