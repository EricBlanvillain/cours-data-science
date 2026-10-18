# Séance 15 · Les agents : un LLM qui agit · ⭐⭐⭐

Niveau : ⭐⭐⭐ Avancé

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre ce qu'est un agent (un LLM qui agit en appelant des outils), en construire un sans framework avec 3 outils Python (fichier Pokémon, calculatrice sécurisée, RAG de la séance 14), voir ce qui peut rater, fixer les bonnes pratiques avec l'IA, et donner à l'agent un outil écrit par soi. Le projet final et les présentations, c'est la séance 16.

Déroulé (1 h 30)
- 15 min : un agent = LLM + outils + boucle (le stagiaire brillant à qui on donne un téléphone et une calculatrice), démo d'un agent qui choisit d'aller chercher dans le RAG, les 4 bonnes pratiques
- 60 min : notebook `15_agents.ipynb`
  - sections 1 et 2 (15 min) : le modèle invente et calcule mal, les 3 outils testés seuls, un quatrième outil
  - section 3 (10 min) : la boucle `OUTIL: nom(args)`, l'agent sur un Pokémon inconnu et sur une question sans outil
  - sections 4 et 5 (15 min) : agent → RAG → réponse, deux outils enchaînés, le banc de test des ratés, une boucle plus tolérante
  - section 6 (5 min) : le quiz des bonnes pratiques
  - section 7 (15 min) : projet, son propre outil, ajouté à l'agent et mesuré sur un banc de 4 questions
- 15 min : partage : chacun montre son outil, son score au banc de test, et une question ratée

Si le temps manque : le projet (section 7) se termine à la maison ; la séance 16 commence par le portfolio, pas par l'agent.

Notes d'animation (formateur)
- Section 5, ce qui peut rater : « Montrer une exécution où le petit modèle oublie le mot `OUTIL:` : c'est la meilleure introduction à la démo qui suit. »
- Section 4, démo de l'agent : « Cinq minutes chronométrées, sur l'ordinateur du formateur. Une seule tâche demandée à l'agent, montrée du début à la fin, avec une erreur si possible. »

Entre deux séances (à la maison) : `15_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ : un autre agent construit de zéro (l'assistant de la médiathèque du lycée, qui demande ses outils en JSON), avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Dataset Pokémon (outil de l'agent) : https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
- Cours gratuit sur les agents (pour la suite) : https://huggingface.co/learn/agents-course

Ils repartent avec : leur agent, avec un outil écrit par eux, testé sur un banc de questions.
