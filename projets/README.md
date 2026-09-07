# Les 4 projets du portfolio

Chaque bloc du parcours se termine par un projet qui va sur ton **GitHub**. À la fin des 12 séances, ton portfolio contient ces 4 projets, tous construits sur de vrais datasets **Kaggle**. Public : débutant en programmation, curieux de la data et de l'IA. Niveaux : ⭐ Débutant · ⭐⭐ Intermédiaire · ⭐⭐⭐ Avancé.

| # | Projet | Bloc | Niveau | Dataset Kaggle | Livrable |
|---|---|---|---|---|---|
| 1 | [Analyse d'un dataset de ton choix](projet-1-analyse-dataset/) | 1 · Les bases | ⭐ | au choix : [jeux vidéo](https://www.kaggle.com/datasets/gregorut/videogamesales), [Netflix](https://www.kaggle.com/datasets/shivamb/netflix-shows), [Spotify](https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs), [Pokémon](https://www.kaggle.com/datasets/abcsds/pokemon) | un notebook « 3 questions, 3 graphiques » + README sur GitHub |
| 2 | [Nettoyage, dashboard et premier modèle](projet-2-dashboard-et-modele/) | 2 · Le métier de data scientist | ⭐⭐ | le même dataset qu'au projet 1 | un dashboard Plotly + un modèle scikit-learn, présentés à l'oral en 2 min |
| 3 | [Compétition Kaggle Titanic](projet-3-kaggle-titanic/) | 3 · Projet Kaggle | ⭐⭐⭐ | [Titanic](https://www.kaggle.com/competitions/titanic) (ou [Spaceship Titanic](https://www.kaggle.com/competitions/spaceship-titanic)) | une soumission Kaggle avec un score, un journal des essais, une présentation de 5 min |
| 4 | [Mon assistant IA](projet-4-assistant-ia/) | 4 · IA générative | ⭐⭐⭐ | Pokémon (pour le quiz et l'agent) ou tes propres documents | un assistant (RAG, quiz, chatbot ou agent) qui fonctionne, avec ses tests |

Chaque dossier contient un `README.md` (objectif, étapes, livrable, critères) et un notebook `.ipynb` à ouvrir dans Google Colab. Tous les notebooks chargent les données automatiquement depuis un **miroir public** : pas besoin de compte Kaggle pour commencer.

## Récupérer un dataset Kaggle : 3 façons

**1. Téléchargement manuel + upload dans Colab** (le plus simple)
1. Crée un compte sur https://www.kaggle.com (gratuit).
2. Sur la page du dataset, bouton **Download** (un `.zip`, à décompresser).
3. Dans Colab, icône **dossier** dans la barre de gauche → glisse le fichier `.csv` dedans.
4. Dans le notebook : `pd.read_csv("vgsales.csv")`. Attention : les fichiers disparaissent quand la session Colab se ferme.

**2. L'outil en ligne de commande `kaggle`** (pratique pour les compétitions)
1. Sur Kaggle : ton avatar → **Settings** → section **API** → **Create New Token** : tu récupères un fichier `kaggle.json` (c'est ta clé : ne la partage jamais, ne la mets jamais sur GitHub).
2. Dans Colab, dépose `kaggle.json` puis :
   ```python
   !pip install -q kaggle
   !mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json
   !kaggle datasets download -d abcsds/pokemon --unzip          # un dataset
   !kaggle competitions download -c titanic                     # une compétition (après avoir cliqué "Join")
   ```
   Documentation : https://www.kaggle.com/docs/api · https://github.com/Kaggle/kaggle-api

**3. Un miroir public par URL** (aucun compte, c'est ce que font les notebooks)
```python
df = pd.read_csv("https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv")
```
Miroirs vérifiés utilisés dans les projets :

| Dataset | Page Kaggle | Miroir public (URL directe) |
|---|---|---|
| Jeux vidéo (Steam) | https://www.kaggle.com/datasets/gregorut/videogamesales | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-07-30/video_games.csv |
| Netflix | https://www.kaggle.com/datasets/shivamb/netflix-shows | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-04-20/netflix_titles.csv |
| Spotify | https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-01-21/spotify_songs.csv |
| Pokémon | https://www.kaggle.com/datasets/abcsds/pokemon | https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv |
| Titanic (`train.csv`) | https://www.kaggle.com/competitions/titanic | https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv |

Note : le miroir « jeux vidéo » est le dataset Steam de TidyTuesday (prix, propriétaires, temps de jeu, metascore) ; le fichier Kaggle `vgsales.csv` a des colonnes différentes (ventes par région). Les deux se prêtent aux mêmes questions, mais si tu charges le fichier Kaggle, adapte les noms de colonnes.

## Publier son projet sur GitHub

1. Crée un compte sur https://github.com et un **dépôt** (*New repository*) : nom `portfolio-data-ia`, public, coche *Add a README*.
2. Depuis Colab : *Fichier → Enregistrer une copie sur GitHub* → choisis ton dépôt, un dossier (`projet-1/`) et un message de commit qui dit **pourquoi** (« Ajoute l'analyse Netflix avec 3 graphiques »).
3. Ajoute à côté un `README.md` (chaque notebook génère un gabarit) : le titre, le dataset et sa source, tes questions et tes réponses, comment lancer le notebook.
4. Vérifie sur GitHub que le notebook s'affiche avec ses graphiques (exécute-le entièrement avant de sauvegarder, GitHub affiche les sorties).
5. En ligne de commande (séance 3) : `git add . ; git commit -m "..." ; git push`.

Guides : https://docs.github.com/fr/get-started/start-your-journey/hello-world · https://docs.github.com/fr/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Grille d'évaluation commune

| Critère | ⭐ Ça passe | ⭐⭐ Bien | ⭐⭐⭐ Excellent |
|---|---|---|---|
| **Problème clair** | la question est écrite | la question est précise et on comprend pourquoi elle intéresse | le README explique le contexte, la question et ce qu'on peut en faire |
| **Données propres** | les données se chargent | les cases vides et doublons sont traités | chaque correction est documentée et justifiée |
| **Résultat montré** | un graphique ou un score | 3 graphiques lisibles (titre, axes) ou un modèle comparé à une base | les résultats répondent aux questions et leurs limites sont dites |
| **Code lisible** | le notebook s'exécute de bout en bout sans erreur | noms de variables clairs, cellules courtes, commentaires utiles | fonctions réutilisables, pas de copier-coller |
| **Présentation** | on montre le résultat | 2 minutes structurées : problème, données, résultat, recommandation | on répond aux questions du « client » et on dit ce qu'on ferait ensuite |

Un projet est **terminé** quand il est sur GitHub, que le notebook s'exécute sans erreur (*Exécution → Tout exécuter*), et que le README permet à quelqu'un d'autre de le comprendre sans toi.
