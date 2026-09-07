# Séance 10 · Parler à un LLM par le code · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre ce qu'est une API, envoyer des messages à un modèle depuis Python, écrire un prompt système (personnalité + règles), garder l'historique d'une conversation, et obtenir une réponse en JSON réutilisable dans un programme.

Déroulé (2h)
- 20 min : c'est quoi une API (analogie du serveur de restaurant), les 3 rôles system / user / assistant, démo d'un appel à un gros modèle avec la clé du formateur
- 15 min : notebook `10_parler_a_un_llm_par_le_code.ipynb`, sections 1 à 3 (API, premier appel, prompt système)
- 25 min : sections 4 et 5 (historique, sortie JSON avec try / except et redemande)
- 40 min : projet : bot à thème au choix (coach de révisions, générateur de quiz, maître de jeu), squelette à compléter + fonctionnalité JSON ; Streamlit en bonus
- 20 min : démo des bots à tour de rôle

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- En option, une clé d'API fournie par le formateur, rangée dans les Secrets de Colab (jamais dans le code)
- Streamlit : https://streamlit.io
- PokéAPI (exemple d'API) : https://pokeapi.co

Ils repartent avec : un chatbot personnalisé qui fonctionne, avec sa personnalité et ses règles écrites par eux.
