# Copies de secours des jeux de données

Les notebooks chargent leurs données depuis la source publique ; si elle ne répond pas, ils prennent la copie rangée ici (dans le dépôt cloné, puis en ligne sur GitHub). Une copie n'est rangée ici que si la licence du jeu de données permet de la redistribuer. Les fichiers sont identiques à la source, téléchargés le 18/10/2026 (le 19/10/2026 pour Pokémon, manchots et Netflix).

| Fichier | Utilisé par | Source | Licence |
|---|---|---|---|
| `spaceship-titanic-train.csv` | exercices des séances 10 et 11 | `train.csv` de la compétition Kaggle [Spaceship Titanic](https://www.kaggle.com/competitions/spaceship-titanic/data), données fictives fabriquées par Kaggle ; copie prise sur le miroir [AmirMAAI/Spaceship_Titanic_dataset](https://github.com/AmirMAAI/Spaceship_Titanic_dataset) (commit a277ca4), même empreinte MD5 que le miroir Hugging Face Hugo0133/Spaceship-Titanic | CC BY 4.0, la licence affichée sur la page des données de la compétition |
| `mpg.csv` | exercices de la séance 9 | [seaborn-data](https://github.com/mwaskom/seaborn-data) (commit 71e2436), tiré de [Auto MPG](https://archive.ics.uci.edu/dataset/9/auto+mpg) (Quinlan, 1993, UCI Machine Learning Repository) | CC BY 4.0 (UCI) |
| `diamonds.csv` | exercices de la séance 9 | seaborn-data (commit 71e2436), le jeu `diamonds` livré avec le paquet R [ggplot2](https://ggplot2.tidyverse.org/reference/diamonds.html) | MIT (licence du paquet ggplot2) |
| `tips.csv` | leçons 04, 07 et 08, exercices de la séance 9 | seaborn-data (commit 71e2436), le jeu `tips` livré avec le paquet R [reshape2](https://rdrr.io/cran/reshape2/man/tips.html), d'après Bryant et Smith (1995), *Practical Data Analysis: Case Studies in Business Statistics* | MIT (licence du paquet reshape2) |
| `pokemon.csv` | leçons 04, 07, 08 et 09 | [Pokemon with stats](https://www.kaggle.com/datasets/abcsds/pokemon), Alberto Barradas, sur Kaggle ; copie prise sur le gist [armgilles/pokemon.csv](https://gist.github.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6) (révision 92200bc), même taille que le fichier de Kaggle (44 028 octets) | CC0, domaine public (licence affichée par Kaggle) |
| `penguins.csv` | leçon 09 | seaborn-data (commit 71e2436), tiré de [palmerpenguins](https://github.com/allisonhorst/palmerpenguins) (Horst, Hill, Gorman, 2020), données de la station Palmer (LTER) | CC0 |
| `netflix_titles.csv` | exercices de la séance 7 | [TidyTuesday 2021-04-20](https://github.com/rfordatascience/tidytuesday/tree/master/data/2021/2021-04-20) (commit b2258ae), tiré de [Netflix Movies and TV Shows](https://www.kaggle.com/datasets/shivamb/netflix-shows), Shivam Bansal, sur Kaggle | CC0, domaine public (licence affichée par Kaggle ; dépôt TidyTuesday sous CC0) |

Attribution demandée par CC BY 4.0 : Spaceship Titanic, Kaggle ; Quinlan, R. (1993). Auto MPG [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5859H.

Citation demandée par palmerpenguins : Horst AM, Hill AP, Gorman KB (2020). palmerpenguins: Palmer Archipelago (Antarctica) penguin data. Les données CC0 n'imposent pas d'attribution ; les sources sont citées quand même.
