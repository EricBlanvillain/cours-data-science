# Séance optionnelle · Software engineering · ⭐

Niveau : ⭐ Débutant

Module optionnel · ne fait pas partie du parcours en 12 séances

Objectifs : mesurer soi-même la lenteur de Python et le gain de la vectorisation, mesurer la mémoire d'un jeu de données et savoir quoi faire quand un fichier dépasse la RAM, et choisir en connaissance de cause entre sa machine, Colab et un serveur cloud — en sachant rendre son projet reproductible ailleurs.

Déroulé (1 h 30)
- 15 min : au tableau, l'idée qui porte la séance : **on ne devine pas, on mesure**. Un chronomètre, un compteur de mémoire, un fichier de dépendances. Pourquoi Python est lent (interprété contre compilé) et pourquoi ça ne l'empêche pas d'être le langage de la data : le calcul est délégué à des moteurs écrits en C ou en Rust
- 60 min : notebook `SO_software_engineering.ipynb`
  - partie 1 (20 min) : la cellule chronométrée qui compare une boucle Python et NumPy sur 5 millions de valeurs et affiche le facteur d'accélération ; la vectorisation ; NumPy et pandas écrits en C, Polars écrit en Rust
  - partie 2 (18 min) : `df.info(memory_usage="deep")`, le passage d'une colonne en `category` mesuré avant/après, la lecture par morceaux avec `chunksize`, ramasse-miettes contre gestion explicite de la mémoire
  - partie 3 (14 min) : ma machine, Colab ou serveur cloud ; ce que Colab masque (`!pip list`), le `requirements.txt` écrit avec `%%writefile` et la reproductibilité ; les plateformes et leurs pages de tarifs
  - livrable (8 min) : le `requirements.txt` de son propre projet, et la fiche « où faire tourner mon projet » remplie dans la dernière cellule
- 15 min : chacun lit sa fiche — où tourne son projet, et le chiffre qui justifie la décision. On compare les facteurs d'accélération obtenus : ils ne sont pas les mêmes d'une machine à l'autre, et c'est instructif

Si le temps manque : on s'arrête à la fin de la partie 2 (la mémoire) et on reprend à la partie 3 et au livrable au créneau suivant. Rien n'est renvoyé à la maison.

Entre deux séances (à la maison) : `SO_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Google Colab, et sa comparaison gratuit / Pro : https://colab.research.google.com · https://colab.research.google.com/signup
- Les paquets Python disponibles : https://pypi.org
- Polars, le pandas écrit en Rust (mention seulement, rien à installer) : https://pola.rs
- Louer des machines : Amazon SageMaker https://aws.amazon.com/sagemaker/ ([tarifs](https://aws.amazon.com/sagemaker/pricing/)) · Google Vertex AI https://cloud.google.com/vertex-ai ([tarifs](https://cloud.google.com/vertex-ai/pricing))
- Appeler un modèle par API : console Anthropic https://console.anthropic.com ([tarifs](https://www.anthropic.com/pricing)) · plateforme OpenAI https://platform.openai.com ([tarifs](https://openai.com/api/pricing/)) · Google AI Studio https://aistudio.google.com ([tarifs](https://ai.google.dev/pricing))
- Un exemple de grille de prix de GPU à l'heure : https://www.runpod.io/pricing

Ils repartent avec : le `requirements.txt` de leur propre projet, et leur fiche « où faire tourner mon projet » — la décision, et le chiffre qui la justifie (durée estimée, taille des données, besoin d'un GPU).
