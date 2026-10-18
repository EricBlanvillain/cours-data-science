# Copies de secours des jeux de données

Les notebooks chargent leurs données depuis la source publique ; si elle ne répond pas, ils prennent la copie rangée ici (dans le dépôt cloné, puis en ligne sur GitHub). Une copie n'est rangée ici que si la licence du jeu de données permet de la redistribuer. Les fichiers sont identiques à la source, téléchargés le 18/10/2026.

| Fichier | Utilisé par | Source | Licence |
|---|---|---|---|
| `spaceship-titanic-train.csv` | exercices des séances 10 et 11 | `train.csv` de la compétition Kaggle [Spaceship Titanic](https://www.kaggle.com/competitions/spaceship-titanic/data), données fictives fabriquées par Kaggle ; copie prise sur le miroir [AmirMAAI/Spaceship_Titanic_dataset](https://github.com/AmirMAAI/Spaceship_Titanic_dataset) (commit a277ca4), même empreinte MD5 que le miroir Hugging Face Hugo0133/Spaceship-Titanic | CC BY 4.0, la licence affichée sur la page des données de la compétition |
| `mpg.csv` | exercices de la séance 9 | [seaborn-data](https://github.com/mwaskom/seaborn-data) (commit 71e2436), tiré de [Auto MPG](https://archive.ics.uci.edu/dataset/9/auto+mpg) (Quinlan, 1993, UCI Machine Learning Repository) | CC BY 4.0 (UCI) |
| `diamonds.csv` | exercices de la séance 9 | seaborn-data (commit 71e2436), le jeu `diamonds` livré avec le paquet R [ggplot2](https://ggplot2.tidyverse.org/reference/diamonds.html) | MIT (licence du paquet ggplot2) |
| `tips.csv` | exercices de la séance 9 | seaborn-data (commit 71e2436), le jeu `tips` livré avec le paquet R [reshape2](https://rdrr.io/cran/reshape2/man/tips.html), d'après Bryant et Smith (1995), *Practical Data Analysis: Case Studies in Business Statistics* | MIT (licence du paquet reshape2) |

Attribution demandée par CC BY 4.0 : Spaceship Titanic, Kaggle ; Quinlan, R. (1993). Auto MPG [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5859H.
