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

Notes d'animation (formateur)
- Quiz d'ouverture (2 min) : 4 questions en tête de `06_exercices.ipynb`, à poser à voix haute avant de commencer
- Section 1, l'apprentissage supervisé : « Faire trouver par le groupe d'autres exemples de classification et de régression dans leur quotidien (recommandation, note, temps de trajet). »
- Section 2, explorer les manchots : « Le nuage de points est à montrer avant tout code : « vous voyez déjà trois groupes ; la machine va-t-elle les voir aussi ? » »
- Sections 2 à 3, X et y : « Deux lettres, à répéter toute la séance. Quand un élève demande « c'est quoi le y ? », c'est le bon moment pour réexpliquer, pas un échec. »
- Section 3, train / test : « L'analogie du contrôle avec les corrigés marche à tous les coups. La faire dire par un élève. »
- Section 4, l'arbre de décision : « Lire l'arbre dessiné à voix haute, nœud par nœud, avec un manchot inventé. Demander : quelle question l'arbre pose-t-il en premier ? pourquoi celle-là ? »
- Section 5, k-NN : « Faire deviner à la main un point du nuage avec ses voisins avant de lancer le code. »
- Section 5, le sur-apprentissage : « L'exercice max_depth de 1 à 20 est le plus important de la séance : faire noter les scores dans un tableau au tableau, on voit la courbe apparaître. »
- Toute la séance : « Une seule notion nouvelle par tranche de dix minutes : supervisé, X/y, train/test, arbre. Pas plus. »
- Si le groupe est fatigué : « Si le groupe est fatigué, sauter le k-NN et garder le sur-apprentissage : c'est l'idée qui reste. »

Entre deux séances (à la maison) : `06_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- Palmer Penguins (chargé automatiquement) : https://allisonhorst.github.io/palmerpenguins/
- Pokémon (chargé automatiquement) : https://www.kaggle.com/datasets/abcsds/pokemon
- scikit-learn : https://scikit-learn.org/stable/getting_started.html

Ils repartent avec : un premier modèle entraîné et évalué, avec une phrase pour expliquer ce qu'il a compris.
