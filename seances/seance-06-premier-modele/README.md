# Séance 6 · Modéliser, premier modèle de machine learning · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 2 · Le métier de data scientist

Objectifs : comprendre l'apprentissage supervisé (des exemples avec la réponse, la machine trouve la règle), distinguer classification et régression, savoir pourquoi on cache des données de test, entraîner et évaluer un premier modèle avec scikit-learn, puis le mesurer et l'améliorer.

Déroulé (1 h 30)
- 15 min : l'apprentissage supervisé expliqué avec les champignons et les spams, classification vs régression avec des exemples du quotidien, pourquoi cacher une partie des données, la précision et le « modèle bête »
- 60 min : notebook `06_premier_modele.ipynb`
  - sections 2 à 4 (25 min) : explorer et nettoyer les manchots, X / y, train / test, arbre de décision lu ensemble sur `plot_tree`
  - sections 5 à 7 (20 min) : k-NN, la courbe du sur-apprentissage (profondeur 1 → 20), une régression du poids en grammes, on mesure et on améliore
  - section 8 (15 min) : projet, la même recette sur les Pokémon (prédire `Legendary`)
- 15 min : chacun donne son score face au modèle bête et lit sa phrase « ce que mon modèle a compris »

Si le temps manque : on s'arrête à la préparation X / y du projet Pokémon (section 8) ; l'entraînement, le piège du « toujours non » et la phrase de synthèse ouvrent la séance suivante.

Entre deux séances (à la maison) : `06_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- Palmer Penguins (chargé automatiquement) : https://allisonhorst.github.io/palmerpenguins/
- Pokémon (chargé automatiquement) : https://www.kaggle.com/datasets/abcsds/pokemon
- scikit-learn : https://scikit-learn.org/stable/getting_started.html

Ils repartent avec : un premier modèle entraîné et évalué, avec une phrase pour expliquer ce qu'il a compris.
