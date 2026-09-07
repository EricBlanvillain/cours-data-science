# Liens utiles

Tous les liens ci-dessous sont gratuits (au moins dans leur version de base) et ont été vérifiés le 6 septembre 2026. Les sites marqués « compte » demandent de créer un compte : voir [docs/avant-la-premiere-seance.md](docs/avant-la-premiere-seance.md).

## Outils du parcours

| Outil | Lien | À quoi ça sert | Séances |
|---|---|---|---|
| Google Colab (compte Google) | https://colab.research.google.com | Écrire et exécuter du Python dans le navigateur, GPU gratuit | Toutes |
| Kaggle (compte) | https://www.kaggle.com | Datasets, notebooks, compétition Titanic | 2, 7, 8 |
| GitHub (compte) | https://github.com | Mettre son portfolio en ligne | 0, 3, 8, 12 |
| Teachable Machine | https://teachablemachine.withgoogle.com | Entraîner un modèle avec sa webcam, sans code | 1 |
| Quick, Draw! | https://quickdraw.withgoogle.com | Un réseau de neurones devine ce que tu dessines | 1 |
| TensorFlow Playground | https://playground.tensorflow.org | Un réseau de neurones qui apprend sous tes yeux | 1, 6 |
| Tokenizer OpenAI | https://platform.openai.com/tokenizer | Voir comment un texte est découpé en tokens | 9 |
| Tiktokenizer | https://tiktokenizer.vercel.app | Même chose, plusieurs modèles, sans compte | 9 |
| Hugging Face | https://huggingface.co | Les modèles ouverts (Qwen, Mistral, Llama…) et leurs docs | 9 à 12 |
| Modèle utilisé dans Colab | https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct | Le petit modèle qui tourne sur le GPU gratuit, sans clé | 9 à 12 |
| Embeddings multilingues | https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 | Le modèle d'embeddings du RAG | 11 |
| Embedding Projector | https://projector.tensorflow.org | Visualiser des embeddings en 3D | 11 |
| Ollama | https://ollama.com | Faire tourner un LLM sur son propre ordinateur (démo du formateur) | 9 |
| NotebookLM | https://notebooklm.google | Un RAG prêt à l'emploi de Google, pour comparer avec le sien | 11 |
| Streamlit | https://streamlit.io | Transformer un script Python en petite appli web | 5, 10 |
| regex101 | https://regex101.com | Tester une expression régulière | 7 |
| PokéAPI | https://pokeapi.co | Une API sans clé pour s'entraîner | 4, 10 |
| Open-Meteo | https://open-meteo.com | L'API météo sans clé | 4 |

### Assistants IA (chat)

| Assistant | Lien | Remarque |
|---|---|---|
| ChatGPT (OpenAI) | https://chatgpt.com | Version gratuite suffisante pour l'atelier |
| Claude (Anthropic) | https://claude.ai | Version gratuite suffisante pour l'atelier |
| Le Chat (Mistral, français) | https://chat.mistral.ai | Version gratuite suffisante pour l'atelier |
| Gemini (Google) | https://gemini.google.com | Fonctionne avec le compte Google de Colab |

Documentation des API (pour aller plus loin après la séance 10, une clé est nécessaire) : [Claude](https://platform.claude.com/docs) · [OpenAI](https://platform.openai.com/docs) · [Mistral](https://docs.mistral.ai) · [Gemini](https://ai.google.dev/gemini-api/docs)

## Datasets

### Pages Kaggle (avec description des colonnes)

| Dataset | Lien | Utilisé en |
|---|---|---|
| Pokémon | https://www.kaggle.com/datasets/abcsds/pokemon | 2, 3, 4, 5, 6, 12 |
| Titanic (compétition) | https://www.kaggle.com/competitions/titanic | 7, 8 |
| Titanic : dictionnaire des données | https://www.kaggle.com/competitions/titanic/data | 7 |
| Titanic : classement | https://www.kaggle.com/competitions/titanic/leaderboard | 8 |
| Titanic : notebooks des autres | https://www.kaggle.com/competitions/titanic/code | 8 |
| Spaceship Titanic (variante ludique) | https://www.kaggle.com/competitions/spaceship-titanic | 7, 8 |
| Ventes de jeux vidéo | https://www.kaggle.com/datasets/gregorut/videogamesales | Projet 1 |
| Films et séries Netflix | https://www.kaggle.com/datasets/shivamb/netflix-shows | Projet 1 |
| Chansons Spotify (30 000) | https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs | Projet 1 |
| Jeux Steam | https://www.kaggle.com/datasets/nikdavis/steam-store-games | Projet 1 |
| Joueurs FIFA 22 | https://www.kaggle.com/datasets/stefanoleone992/fifa-22-complete-player-dataset | Projet 1 |
| Football européen | https://www.kaggle.com/datasets/hugomathien/soccer | Projet 1 |
| Films TMDB | https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata | Projet 1 |
| Vidéos YouTube tendances | https://www.kaggle.com/datasets/datasnaek/youtube-new | Projet 1 |
| Manchots de Palmer | https://www.kaggle.com/datasets/parulpandey/palmer-archipelago-antarctica-penguin-data | 6 |
| Iris | https://www.kaggle.com/datasets/uciml/iris | 6 |

### Miroirs publics (chargés directement par `pd.read_csv(url)`, sans compte)

| Dataset | URL brute |
|---|---|
| Pokémon | https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv |
| Manchots | https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv |
| Titanic (= `train.csv` de Kaggle) | https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv |
| Tips (pourboires) | https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv |
| Ventes de jeux vidéo | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-07-30/video_games.csv |
| Netflix | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-04-20/netflix_titles.csv |
| Spotify | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2020/2020-01-21/spotify_songs.csv |
| Jeux Steam | https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-03-16/games.csv |
| Voitures (mpg) | https://raw.githubusercontent.com/mwaskom/seaborn-data/master/mpg.csv |
| Diamants | https://raw.githubusercontent.com/mwaskom/seaborn-data/master/diamonds.csv |
| Vols | https://raw.githubusercontent.com/mwaskom/seaborn-data/master/flights.csv |
| Taxis | https://raw.githubusercontent.com/mwaskom/seaborn-data/master/taxis.csv |

Tous les datasets seaborn : https://github.com/mwaskom/seaborn-data · Page du projet manchots : https://allisonhorst.github.io/palmerpenguins/

### APIs sans clé

- PokéAPI : https://pokeapi.co/api/v2/pokemon/pikachu
- Open-Meteo : https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true
- Liste d'APIs publiques : https://github.com/public-apis/public-apis

### Données ouvertes françaises (pour un projet personnel)

- data.gouv.fr : https://www.data.gouv.fr/fr/
- INSEE : https://www.insee.fr/fr/accueil
- Open data Paris : https://opendata.paris.fr/pages/home/

## Documentation officielle

| Bibliothèque | Lien | Conseil |
|---|---|---|
| Python (en français) | https://docs.python.org/fr/3/ | Le tutoriel officiel : https://docs.python.org/fr/3/tutorial/index.html |
| pandas | https://pandas.pydata.org/docs/ | Commencer par « 10 minutes to pandas » : https://pandas.pydata.org/docs/user_guide/10min.html · Cheat sheet PDF : https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf |
| NumPy | https://numpy.org/doc/stable/ | Sous pandas et scikit-learn, rarement utilisé directement ici |
| matplotlib | https://matplotlib.org/stable/ | La galerie pour trouver un graphique et copier son code : https://matplotlib.org/stable/gallery/index.html |
| seaborn | https://seaborn.pydata.org/ | Galerie : https://seaborn.pydata.org/examples/index.html |
| plotly | https://plotly.com/python/ | Plotly Express, le plus simple : https://plotly.com/python/plotly-express/ |
| scikit-learn | https://scikit-learn.org/stable/ | Getting started : https://scikit-learn.org/stable/getting_started.html · Validation croisée : https://scikit-learn.org/stable/modules/cross_validation.html · GridSearchCV : https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html · Pièges classiques : https://scikit-learn.org/stable/common_pitfalls.html |
| SQLite | https://www.sqlite.org/lang.html | Le module Python `sqlite3` en français : https://docs.python.org/fr/3/library/sqlite3.html |
| requests | https://requests.readthedocs.io/en/latest/ | Pour appeler une API |
| git | https://git-scm.com/docs | Le livre Pro Git en français : https://git-scm.com/book/fr/v2 · Aide-mémoire GitHub en français : https://training.github.com/downloads/fr/github-git-cheat-sheet/ |
| GitHub | https://docs.github.com/fr | Premier dépôt pas à pas : https://docs.github.com/fr/get-started/start-your-journey/hello-world |
| Google Colab | https://research.google.com/colaboratory/faq.html | Tour des fonctionnalités : https://colab.research.google.com/notebooks/basic_features_overview.ipynb |
| Kaggle API | https://www.kaggle.com/docs/api | Le dépôt de l'outil `kaggle` : https://github.com/Kaggle/kaggle-api |
| transformers (Hugging Face) | https://huggingface.co/docs/transformers/index | Partie en français : https://huggingface.co/docs/transformers/fr/index |
| Streamlit | https://docs.streamlit.io/get-started | |

## Tutoriels et vidéos gratuits

### En français

| Ressource | Lien | Pour quoi |
|---|---|---|
| Science Étonnante (chaîne YouTube) | https://www.youtube.com/@ScienceEtonnante | Les meilleures vulgarisations sur le deep learning et ChatGPT |
| Science Étonnante · « Ce qui se cache derrière ChatGPT » | https://www.youtube.com/watch?v=7ell8KEbhJo | Comment fonctionne un LLM (séance 9) |
| Machine Learnia (chaîne YouTube) | https://www.youtube.com/@MachineLearnia | Python, pandas, scikit-learn, pas à pas |
| Documentation Python en français | https://docs.python.org/fr/3/tutorial/index.html | Le tutoriel officiel traduit |
| OpenClassrooms · Bases de Python | https://openclassrooms.com/fr/courses/7168871-apprenez-les-bases-du-langage-python | Reprendre les bases (séance 0) |
| OpenClassrooms · Bibliothèques Python pour la data | https://openclassrooms.com/fr/courses/4452741-decouvrez-les-librairies-python-pour-la-data-science | pandas, NumPy, matplotlib (séance 2) |
| Cours Python de l'université Paris Cité | https://python.sdv.univ-paris-diderot.fr/ | Cours complet, très clair |
| learnpython.org (français) | https://www.learnpython.org/fr/ | Exercices interactifs dans le navigateur |
| sql.sh | https://sql.sh | Le SQL en français, commande par commande (séance 3) |
| Learn Git Branching (français) | https://learngitbranching.js.org/?locale=fr_FR | Git expliqué visuellement, en jouant (séance 3) |
| Elements of AI (français) | https://course.elementsofai.com/fr | Cours d'introduction à l'IA sans code (séance 1) |
| Wikipédia · Grand modèle de langage | https://fr.wikipedia.org/wiki/Grand_mod%C3%A8le_de_langage | Une bonne synthèse (séance 9) |

### En anglais (mais très visuels)

| Ressource | Lien | Pour quoi |
|---|---|---|
| 3Blue1Brown · Neural networks | https://www.3blue1brown.com/topics/neural-networks | Les réseaux de neurones et les transformers en animation |
| 3Blue1Brown · « But what is a neural network? » | https://www.youtube.com/watch?v=aircAruvnKk | La vidéo de référence (sous-titres français) |
| 3Blue1Brown · « Transformers explained visually » | https://www.youtube.com/watch?v=wjZofJX0v4M | Comment un LLM prédit le mot suivant (séance 9) |
| Andrej Karpathy · « Intro to Large Language Models » | https://www.youtube.com/watch?v=zjkBMFhNj_g | 1 h pour tout comprendre des LLM |
| Kaggle Learn | https://www.kaggle.com/learn | Mini-cours gratuits : [Python](https://www.kaggle.com/learn/python), [pandas](https://www.kaggle.com/learn/pandas), [Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning) |
| Google ML Crash Course | https://developers.google.com/machine-learning/crash-course | Le cours de Google, avec exercices |
| MLU-Explain · Bias-variance | https://mlu-explain.github.io/bias-variance/ | Le sur-apprentissage en images (séance 8) |
| The Illustrated Transformer | https://jalammar.github.io/illustrated-transformer/ | L'article illustré de référence (séance 9) |
| LLM Visualization | https://bbycroft.net/llm | Un LLM en 3D, token par token (séance 9) |
| Transformer Explainer | https://poloclub.github.io/transformer-explainer/ | GPT-2 qui tourne dans le navigateur (séance 9) |
| Hugging Face · Agents Course | https://huggingface.co/learn/agents-course | Pour aller plus loin après la séance 12 |
| SQLBolt | https://sqlbolt.com | SQL interactif (séance 3) |
| SQLZoo | https://sqlzoo.net | Exercices SQL |
| Python Tutor | https://pythontutor.com/visualize.html | Voir son code s'exécuter ligne par ligne |
| Codewars | https://www.codewars.com | Réviser Python en jouant |
| Exercism · Python | https://exercism.org/tracks/python | Exercices avec mentorat gratuit |
| Spurious correlations | https://www.tylervigen.com/spurious-correlations | Corrélations absurdes (séance 5) |

## Pour installer Python chez soi (optionnel, tout l'atelier tourne dans Colab)

- Python : https://www.python.org/downloads/
- VS Code : https://code.visualstudio.com/
- Anaconda (Python + Jupyter + pandas en un seul installeur) : https://www.anaconda.com/download
- GitHub Student Developer Pack (outils gratuits pour les étudiants) : https://education.github.com/pack
