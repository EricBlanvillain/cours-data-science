# Séance 6 · Collecter des données avec une API · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 2 · Le métier de data scientist

Objectifs : comprendre ce qu'est une API, appeler une API avec `requests`, lire une réponse en JSON (imbriquée), transformer plusieurs appels en tableau pandas, préciser une demande avec des paramètres, prévoir un plan B quand ça rate, et sauvegarder ce qu'on a collecté.

Déroulé (1 h 30)
- 15 min : une API comme un serveur de restaurant (la commande, le serveur, le plat), le JSON, les codes de réponse 200 et 404 ; démo d'une URL de la PokéAPI ouverte dans le navigateur
- 60 min : notebook `06_collecter_api.ipynb`
  - sections 1 et 2 (15 min) : la première requête, le code de réponse, le JSON, descendre dans un JSON imbriqué ; la vitesse de Pikachu
  - section 3 (10 min) : plusieurs appels, une liste de dictionnaires, un tableau, un graphique
  - section 4 (10 min) : des paramètres avec Open-Meteo, la journée de Paris heure par heure, puis trois villes
  - sections 5 à 7 (10 min) : quand ça rate (404, pas de réseau), la fonction `demander` et son plan B, sauvegarder en CSV
  - section 8 (15 min) : projet, collecter son propre jeu de données (son équipe Pokémon, la météo de 5 villes, ou une autre API sans clé)
- 15 min : partage : chacun montre ce qu'il a collecté, son graphique, et ce que son plan B a rattrapé

Si le temps manque : le projet (section 8) se termine à la séance suivante, avec le CSV sauvegardé.

Entre deux séances (à la maison) : `06_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec d'autres API gratuites et sans clé (jours fériés, bibliothèque en ligne, fausse liste de tâches, recherche de villes et météo de la semaine), avec vérification automatique (✅/❌), indices et solutions dépliables. Sans réseau, des données de secours prennent le relais. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- PokéAPI : https://pokeapi.co · Open-Meteo : https://open-meteo.com
- Liste d'API publiques gratuites : https://github.com/public-apis/public-apis

Ils repartent avec : leur propre jeu de données, collecté avec une API, rangé dans un tableau et sauvegardé en CSV.
