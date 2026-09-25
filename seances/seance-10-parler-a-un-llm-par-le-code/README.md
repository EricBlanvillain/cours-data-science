# Séance 10 · Parler à un LLM par le code · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre ce qu'est une API, envoyer des messages à un modèle depuis Python, écrire un prompt système (personnalité + règles), garder l'historique d'une conversation, et obtenir une réponse en JSON réutilisable dans un programme.

Déroulé (1 h 30)
- 15 min : c'est quoi une API (analogie du serveur de restaurant), les 3 rôles system / user / assistant, démo d'un appel à un gros modèle avec la clé du formateur
- 60 min : notebook `10_parler_a_un_llm_par_le_code.ipynb`
  - sections 1 à 3 (15 min) : API, premier appel, prompt système
  - sections 4 et 5 (20 min) : historique de conversation, sortie JSON avec try / except et redemande
  - section 6 (25 min) : projet, bot à thème au choix (coach de révisions, générateur de quiz, maître de jeu), squelette à compléter
- 15 min : démo des bots à tour de rôle

Si le temps manque : on s'arrête au bot qui répond (section 6) ; la sortie JSON du bot et le bonus Streamlit ouvrent la séance suivante.

Notes d'animation (formateur)
- Section 3, le prompt système : « Faire lire à voix haute une réponse du pirate qui oublie d'être un pirate. C'est le SLM en action, et c'est drôle. »
- Section 4, l'historique de conversation : « Le test « tu te souviens de mon prénom ? » à faire par chacun. Puis cinq messages pour voir le modèle perdre le fil. »

Entre deux séances (à la maison) : `10_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- En option, une clé d'API fournie par le formateur, rangée dans les Secrets de Colab (jamais dans le code)
- Streamlit : https://streamlit.io
- PokéAPI (exemple d'API) : https://pokeapi.co

Ils repartent avec : un chatbot personnalisé qui fonctionne, avec sa personnalité et ses règles écrites par eux.
