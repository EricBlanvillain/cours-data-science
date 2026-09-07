# Séance 9 · Comment fonctionne un LLM · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre ce qu'est un token, l'idée « prédire le mot suivant » (en construisant soi-même un mini-modèle bigramme), la température, les limites d'un LLM (hallucinations, date de connaissance, calcul), la différence LLM / SLM, et pourquoi les anciennes méthodes de NLP ont été remplacées.

Déroulé (2h)
- 20 min : démo tokens en direct (tokenizer en ligne + tiktoken), l'idée du mot suivant avec le bigramme, démo Ollama sur l'ordinateur du formateur (Mistral ou Llama en local)
- 20 min : notebook `09_comment_fonctionne_un_llm.ipynb`, sections 1 à 3 (tokens, bigramme, température)
- 20 min : sections 4 à 6 (ce qu'un LLM sait / ne sait pas, LLM vs SLM, sac de mots vs LLM)
- 40 min : projet « fais halluciner le modèle » : 5 catégories de pièges, fiche « mes 3 limites »
- 20 min : chacun présente son piège préféré et ses 3 limites

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Tokenizer en ligne : https://platform.openai.com/tokenizer
- Ollama (LLM en local, démo du formateur) : https://ollama.com
- Modèles ouverts : https://huggingface.co/models

Ils repartent avec : un petit modèle qu'ils ont fait tourner et « halluciner » volontairement, et une fiche « 3 limites d'un LLM » observées par eux-mêmes.
