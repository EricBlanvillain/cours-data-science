# Séance 7 · Analyser : enquêter sur des données · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 2 · Le métier de data scientist

Objectifs : mener une analyse exploratoire comme une enquête (quelles questions poser, repérer une tendance, une anomalie, une corrélation) et reconnaître les pièges (corrélation et causalité, graphiques trompeurs, biais). Raconter ses résultats à un client, c'est la séance 8.

Déroulé (1 h 30)
- 15 min : l'analyse exploratoire comme une enquête, démo tendance / anomalie / corrélation sur Tips et Pokémon, les 3 pièges (glaces et noyades, axe tronqué, sondage devant le magasin de jeux vidéo)
- 60 min : notebook `07_analyser.ipynb`
  - section 1 (10 min) : trois bonnes questions, `describe`, `value_counts`, `groupby`
  - sections 2 à 4 (25 min) : une tendance (`regplot`), une anomalie (boîte à moustaches, règle des 1,5 écarts), une corrélation (`corr`, heatmap)
  - section 5 (10 min) : les trois pièges, et le mini-quiz « quel piège ? »
  - section 6 (15 min) : projet, l'enquête : trois questions pour un client, trois réponses chiffrées, trois graphiques, et pour chacune le piège vérifié
- 15 min : chacun présente sa meilleure question d'enquête, le chiffre et le graphique qui y répondent

Si le temps manque : l'enquête (section 6) se termine à la séance 8, qui en part pour construire le tableau de bord.

Entre deux séances (à la maison) : `07_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ sur des données que la leçon n'a pas vues (le catalogue Netflix, un sondage d'élèves, des villes et leurs pompiers, un sondage sur les réseaux sociaux), avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- Tips (chargé automatiquement) : https://github.com/mwaskom/seaborn-data
- Pokémon (chargé automatiquement) : https://www.kaggle.com/datasets/abcsds/pokemon
- Corrélations absurdes : https://www.tylervigen.com/spurious-correlations

Ils repartent avec : leur enquête, trois questions, trois réponses chiffrées, trois graphiques et les pièges vérifiés.
