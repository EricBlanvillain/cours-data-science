# Séance C · Le contexte du métier · ⭐

Niveau : ⭐ Débutant

Séance optionnelle, à faire avant la séance 0

Objectifs : comprendre pourquoi on code en Python plutôt qu'en R, en SQL ou en Rust (l'écosystème avant la vitesse), mesurer soi-même la lenteur de Python et le gain de la vectorisation, mesurer la mémoire d'un jeu de données et savoir quoi faire quand un fichier dépasse la RAM, choisir entre sa machine, Colab et un serveur cloud, et calculer ce que coûte un traitement avant de le lancer.

Déroulé (1 h 30)
- 15 min : au tableau, le tour des cinq langages (Python, R, SQL, Rust/C++, JavaScript) — ce que chacun sait faire, sa limite, qui l'utilise ; et l'idée qui porte toute la séance : **on choisit un langage pour son écosystème, pas pour sa vitesse**. Rust est 50 fois plus rapide, mais il faudrait écrire soi-même pandas, matplotlib et scikit-learn
- 60 min : notebook `C_contexte_du_metier.ipynb`
  - partie 1 (8 min) : le tableau comparatif des langages, en Python cette fois, et le bon outil pour le bon besoin
  - partie 2 (16 min) : interprété contre compilé ; la cellule chronométrée qui compare une boucle Python et NumPy sur 5 millions de valeurs et affiche le facteur d'accélération ; la vectorisation ; NumPy et pandas écrits en C, Polars écrit en Rust
  - partie 3 (13 min) : `df.info(memory_usage="deep")`, le passage d'une colonne en `category` mesuré avant/après, la lecture par morceaux avec `chunksize`, ramasse-miettes contre gestion explicite de la mémoire
  - partie 4 (16 min) : ma machine, Colab ou serveur cloud ; ce que Colab masque (`!pip list`) et le `requirements.txt` écrit avec `%%writefile` ; les plateformes et leurs pages de tarifs
  - partie 5 (7 min) : le prix d'un million de tokens, le coût d'une heure de GPU, et le calcul chiffré du traitement de 10 000 documents avec un petit puis un gros modèle
- 15 min : chacun lit sa fiche « choisir ses outils » — le langage, la machine et le modèle qu'il retient pour son projet, avec ses chiffres. On compare les facteurs d'accélération obtenus : ils ne sont pas les mêmes d'une machine à l'autre, et c'est instructif

Si le temps manque : on s'arrête à la fin de la partie 3 (la mémoire) et on reprend aux parties 4 et 5 au créneau suivant, en ouverture de la séance 0 — c'est justement le moment où on crée les comptes.

Entre deux séances (à la maison) : `C_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Google Colab, et sa comparaison gratuit / Pro : https://colab.research.google.com · https://colab.research.google.com/signup
- Les paquets Python disponibles : https://pypi.org
- Polars, le pandas écrit en Rust (mention seulement, rien à installer) : https://pola.rs
- Louer des machines : Amazon SageMaker https://aws.amazon.com/sagemaker/ ([tarifs](https://aws.amazon.com/sagemaker/pricing/)) · Google Vertex AI https://cloud.google.com/vertex-ai ([tarifs](https://cloud.google.com/vertex-ai/pricing))
- Appeler un modèle par API : console Anthropic https://console.anthropic.com ([tarifs](https://www.anthropic.com/pricing)) · plateforme OpenAI https://platform.openai.com ([tarifs](https://openai.com/api/pricing/)) · Google AI Studio https://aistudio.google.com ([tarifs](https://ai.google.dev/pricing))
- Un exemple de grille de prix de GPU à l'heure : https://www.runpod.io/pricing
- La fiche à remplir pendant la séance : [`docs/fiche-choisir-ses-outils.md`](../../docs/fiche-choisir-ses-outils.md)

Ils repartent avec : leur fiche « choisir ses outils » remplie avec leurs propres mesures — le facteur d'accélération qu'ils ont obtenu entre une boucle Python et NumPy, le poids de leurs données avant et après `category`, et le coût estimé de leur projet en euros.
