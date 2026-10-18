# Séance 3 · SQL : interroger une base de données · ⭐

Niveau : ⭐ Débutant

Bloc 1 · Les bases solides

Objectifs : comprendre où sont stockées les données d'une appli, et interroger une base SQLite en SQL (SELECT, WHERE, ORDER BY, GROUP BY, un premier JOIN), en vérifiant que pandas donne les mêmes réponses. Git et GitHub ont leur propre séance, la 5.

Déroulé (1 h 30)
- 15 min : où sont stockées les données d'une appli, tables et SQL (section 1 du notebook `03_sql_et_git.ipynb`), la phrase SQL qu'on lit presque comme du français
- 60 min : notebook `03_sql_et_git.ipynb`, sur le dataset Pokémon chargé dans SQLite en mémoire
  - sections 2-3 (20 min) : SELECT / WHERE, AND et OR, COUNT, ORDER BY et LIMIT
  - section 4 (10 min) : GROUP BY et les agrégations (COUNT, AVG, SUM, MAX)
  - section 5 (10 min) : un premier JOIN avec une petite table `types` (forces / faiblesses), et pourquoi LEFT JOIN
  - section 6 (20 min) : projet, mini-défi « même question en SQL et en pandas », trois fois, avec la fonction qui vérifie que les deux réponses concordent
- 15 min : partage : chacun lit sa requête préférée et dit laquelle des deux « langues » il préfère

Si le temps manque : on s'arrête après le premier des trois mini-défis (section 6), les deux autres ouvrent la séance suivante.

Entre deux séances (à la maison) : `03_exercices.ipynb` — 12 exercices de SQL ⭐ à ⭐⭐⭐, sur une autre base (une appli de musique), avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- Dataset Pokémon (chargé automatiquement par le notebook) : https://www.kaggle.com/datasets/abcsds/pokemon
- S'entraîner au SQL : https://sqlbolt.com (interactif, en anglais) · https://sql.sh (en français)

Ils repartent avec : leurs requêtes SQL, et le défi « même question en SQL et en pandas » résolu trois fois.
