# Pour aller plus loin · six projets complets ⭐⭐⭐

Six projets « pipeline complet », dans l'esprit d'une soutenance de data scientist : **données → nettoyage et feature
engineering → analyse → modèles candidats → tuning / fine-tuning → interprétation → recommandation**, avec
scikit-learn, XGBoost, TensorFlow/Keras et Hugging Face.

Ce n'est **pas un module** et ça ne fait partie d'aucun parcours : c'est une réserve, à piocher quand on veut creuser
un sujet, une fois les 4 projets du portfolio terminés. Prérequis conseillés : séances 6 à 8 (premier modèle, Kaggle).

| # | Projet | Question métier | Données (source publique, sans compte) | Ce que tu entraînes et règles | Outils |
|---|--------|-----------------|----------------------------------------|-------------------------------|--------|
| [A1](A1-energie-batiments/) | Consommation énergétique des bâtiments | Prédire l'énergie et les émissions d'un bâtiment à partir de ses caractéristiques | Seattle Open Data, benchmarking 2016, ≈3 400 bâtiments | Ridge → forêt → **XGBoost + RandomizedSearch**, SHAP | sklearn, xgboost, shap |
| [A2](A2-scoring-credit/) | Scoring crédit | Accorder ou refuser un prêt, et expliquer la décision | OpenML « Credit-Risk-Dataset », 32 k prêts | déséquilibre, **XGBoost + Optuna**, **seuil optimisé sur un coût métier**, SHAP | sklearn, xgboost, optuna, shap |
| [A3](A3-reconnaissance-images/) | Reconnaissance d'images | Reconnaître un vêtement, puis une fleur, sur une photo | Fashion-MNIST (Keras) + tf_flowers (3 670 photos) | CNN maison → augmentation → **transfer learning MobileNetV2 → fine-tuning**, Grad-CAM | TensorFlow/Keras |
| A4 | Séries temporelles *(en cours de rédaction)* | Prévoir la consommation électrique à 7 et 30 jours | PJM East, 145 k relevés horaires | baselines → **SARIMA, Prophet, XGBoost sur lags, LSTM**, backtesting | statsmodels, prophet, xgboost, Keras |
| A5 | Classification de texte *(en cours de rédaction)* | Dire si une critique de film est positive ou négative | Allociné (Hugging Face), critiques en français | TF-IDF → BiLSTM → **fine-tuning CamemBERT** | sklearn, Keras, transformers |
| [A6](A6-generation-texte/) | Génération de texte | Faire écrire un modèle « à la manière de » | *Le Comte de Monte-Cristo* (Gutenberg) ou ton propre texte | bigramme → **LSTM caractère** → **Qwen 0.5B + LoRA** | Keras, transformers, peft |

A1 et A2 tournent partout (CPU). A3 à A6 sont pensés pour **Google Colab avec GPU T4**.

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
