# Séance 9 · Comment fonctionne un LLM · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre ce qu'est un token, l'idée « prédire le mot suivant » (en construisant soi-même un mini-modèle bigramme), la température, les limites d'un LLM (hallucinations, date de connaissance, calcul), la différence LLM / SLM, et pourquoi les anciennes méthodes de NLP ont été remplacées.

Déroulé (1 h 30)
- 15 min : démo tokens en direct (tokenizer en ligne + tiktoken) et l'idée du mot suivant avec le bigramme ; démo Ollama sur l'ordinateur du formateur (Mistral ou Llama en local)
- 60 min : notebook `09_comment_fonctionne_un_llm.ipynb`
  - sections 1 à 3 (20 min) : tokens, bigramme, température
  - sections 4 à 6 (20 min) : ce qu'un LLM sait et ne sait pas, LLM vs SLM, sac de mots vs LLM
  - section 7 (20 min) : projet « fais halluciner le modèle », les 5 catégories de pièges, fiche « mes 3 limites »
- 15 min : chacun présente son piège préféré et ses 3 limites

Si le temps manque : on s'arrête après deux ou trois catégories de pièges (section 7) ; les autres et la fiche « mes 3 limites » ouvrent la séance suivante.

Entre deux séances (à la maison) : `09_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Tokenizer en ligne : https://platform.openai.com/tokenizer
- Ollama (LLM en local, démo du formateur) : https://ollama.com
- Modèles ouverts : https://huggingface.co/models

Ils repartent avec : un petit modèle qu'ils ont fait tourner et « halluciner » volontairement, et une fiche « 3 limites d'un LLM » observées par eux-mêmes.
