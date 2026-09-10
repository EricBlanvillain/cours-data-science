# Séance optionnelle 1 · Les métiers de la data science · ⭐

Niveau : ⭐ Débutant

Module optionnel · ne fait pas partie du parcours en 12 séances

Objectifs : savoir quel langage sert à quoi et pourquoi Python domine la data, traiter R sérieusement — là où il gagne (statistiques, `ggplot2`, recherche, biostatistique) et là où il coince (l'industrialisation), comprendre ce que la gestion de la mémoire dit de chaque langage (ramasse-miettes, `malloc`/`free`, garantie à la compilation) et ce qu'elle coûte au programmeur, et savoir chiffrer en euros ce que coûte un modèle appelé par API ou une heure de GPU — avant de lancer.

Cette séance répond à **« quel langage pour quel usage »**. La [séance optionnelle 2 · Software engineering](../seance-optionnelle-2-software-engineering/) répond à **« pourquoi celui-ci est lent, et où le faire tourner »** — la vitesse, la vectorisation, la mémoire d'un jeu de données, le choix entre sa machine, Colab et le cloud.

Déroulé (1 h 30)
- 15 min : au tableau, l'idée qui porte la séance : **on choisit un langage pour son écosystème, pas pour sa vitesse**. Les métiers de la data se distinguent d'abord par leurs outils — le statisticien dans R, l'ingénieur données dans SQL, le data scientist dans Python, et le C ou le Rust sous les moteurs que Python appelle. Ton temps coûte plus cher que le temps de calcul
- 60 min : notebook `SO1_metiers_data_science.ipynb`
  - partie 1 (24 min) : le comparatif honnête des six langages, avec sa colonne « gestion de la mémoire » ; R traité sérieusement — les statistiques, `ggplot2`, la recherche, la biostatistique, et le mur de l'industrialisation ; la preuve par les imports ; l'exercice « le bon outil pour le bon besoin »
  - partie 2 (14 min) : qui gère la mémoire — ramasse-miettes (Python, R), `malloc`/`free` à la main (C), garantie à la compilation (Rust) — et ce que chaque approche coûte au programmeur : de la performance, de l'attention, ou de la patience. Le ramasse-miettes de Python observé en direct, puis le tableau que chacun remplit lui-même
  - partie 3 (14 min) : le coût d'un modèle — tarifs par million de tokens (entrée et sortie), le calcul chiffré sur 10 000 documents, le prix d'une heure de GPU, et pourquoi on prototype toujours sur un échantillon de 100
  - livrable (8 min) : la fiche « choisir ses outils » remplie dans la dernière cellule — langage, modèle, coût de l'essai et coût total estimé, calculés
- 15 min : chacun lit sa fiche — son langage et la contrainte qui le justifie, son modèle et le coût en euros de son projet. On compare les budgets : ils vont du centime à la centaine d'euros, et la différence tient presque toujours au choix du modèle

Si le temps manque : on s'arrête à la fin de la partie 2 (la mémoire) et on reprend à la partie 3 et au livrable au créneau suivant. Rien n'est renvoyé à la maison.

Entre deux séances (à la maison) : `SO1_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Google Colab, rien à installer : https://colab.research.google.com · [gratuit / Pro](https://colab.research.google.com/signup)
- Les paquets Python disponibles : https://pypi.org
- R : https://www.r-project.org · ses paquets sur [CRAN](https://cran.r-project.org/) · `ggplot2` https://ggplot2.tidyverse.org
- La propriété de la mémoire en Rust (mention seulement, rien à installer) : https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html
- Les pages de tarifs, à aller lire soi-même : [Anthropic](https://www.anthropic.com/pricing) · [OpenAI](https://openai.com/api/pricing/) · [Google](https://ai.google.dev/pricing)
- Un exemple de grille de prix de GPU à l'heure : https://www.runpod.io/pricing

Livrable : [`docs/fiche-choisir-ses-outils.md`](../../docs/fiche-choisir-ses-outils.md)

Ils repartent avec : leur fiche « choisir ses outils » — le langage choisi et la contrainte qui le justifie, le modèle retenu, et le coût du projet en euros obtenu par un essai sur 100 documents suivi d'une règle de trois.
