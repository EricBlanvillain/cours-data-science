# Séance 2 · Python pour la data · ⭐

Niveau : ⭐ Débutant

Bloc 1 · Les bases solides

Objectifs : rappels Python (fonctions, listes, dictionnaires, boucles), puis charger un fichier CSV avec pandas, filtrer, trier, compter, regrouper, et tracer trois types de graphiques avec matplotlib.

Déroulé (1 h 30)
- 15 min : rappels rapides fonctions / listes / dictionnaires / boucles (section 1 du notebook `02_python_pour_la_data.ipynb`), puis c'est quoi un DataFrame, démo sur le dataset Pokémon (section 2)
- 60 min : notebook `02_python_pour_la_data.ipynb`
  - sections 3-6 (30 min) : filtrer, trier et compter, `groupby`, les trois graphiques (barres, nuage de points, histogramme), un exercice par section
  - section 7 (25 min) : projet « 3 questions, 3 graphiques » sur le dataset Pokémon
  - section 8 (5 min) : charger son propre CSV dans Colab, pour ceux qui ont choisi un dataset à la séance 0
- 15 min : partage : chacun montre sa question préférée et son graphique

Si le temps manque : on s'arrête après la première ou la deuxième question du projet (section 7) ; les questions restantes et le CSV personnel (section 8) ouvrent la séance suivante.

Notes d'animation (formateur)
- Quiz d'ouverture (2 min) : 3 questions en tête de `02_exercices.ipynb`, à poser à voix haute avant de commencer
- Section 2, c'est quoi un DataFrame : « Ouvrir le CSV brut dans un éditeur de texte avant pandas, pour qu'ils voient que c'est juste du texte avec des virgules. »
- Section 2, la démo : « Les trois réflexes (head, shape, describe) à faire exécuter tout de suite. Demander : combien de lignes ? combien de colonnes ? quelle est la vitesse maximale ? »
- Sections 3 à 5, filtrer, trier, compter, regrouper : « Ne pas expliquer les cinq verbes d'un bloc. Un verbe, une cellule exécutée, une question posée au groupe. Le tableau sert de fiche à retrouver ensuite. »
- Section 5, groupby : « Le groupby est le moment où ça clique : « quel type est le plus puissant ? » résolu en une ligne. Laisser un silence après le résultat. »
- Section 6, les trois graphiques : « Refuser les graphiques sans titre ni axes. Demander à chaque fois : à quelle question ce graphique répond-il ? »
- Section 7, projet 3 questions / 3 graphiques : « Passer entre les tables. Ceux qui bloquent sur la syntaxe : donner le squelette de la ligne, pas la réponse. Ceux qui finissent : un autre dataset de la liste. »
- Toute la séance : « Le notebook charge les données tout seul : pas besoin de compte Kaggle aujourd'hui. »
- Pour la fin du parcours : « Garder trois graphiques d'élèves pour la restitution finale : un bon, un sans titre, un qui répond à une question surprenante. »

Entre deux séances (à la maison) : `02_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Datasets (gratuits)
- Pokémon (chargé automatiquement par le notebook) : https://www.kaggle.com/datasets/abcsds/pokemon
- Ventes de jeux vidéo : https://www.kaggle.com/datasets/gregorut/videogamesales
- Films et séries Netflix : https://www.kaggle.com/datasets/shivamb/netflix-shows
- Joueurs FIFA : https://www.kaggle.com/datasets/stefanoleone992/fifa-22-complete-player-dataset

Outils
- Aide-mémoire pandas : https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf
- Galerie matplotlib : https://matplotlib.org/stable/gallery/index.html

Ils repartent avec : un notebook avec 3 questions posées sur un dataset et 3 graphiques qui y répondent (poussé sur GitHub à la séance 3).
