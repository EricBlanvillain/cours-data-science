# Séance 11 · Le RAG, donner de la mémoire à son IA · ⭐⭐⭐

Niveau : ⭐⭐⭐ Avancé

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre pourquoi un LLM ne connaît pas nos documents, ce qu'est un embedding (des textes proches = des points proches), puis construire un RAG pas à pas : découper, vectoriser, chercher, injecter dans le prompt, répondre.

Déroulé (2h)
- 20 min : le problème (démo : le modèle invente sur un jeu inventé), l'examen à livre ouvert, les embeddings avec le nuage de points, les 5 étapes du RAG au tableau
- 15 min : notebook `11_rag.ipynb`, sections 1 et 2 (le problème, embeddings 2D et similarité cosinus)
- 25 min : sections 3 à 6 (chunks, vectorisation sentence-transformers / repli TF-IDF, recherche, injection, réponse) sur les règles d'un jeu fourni
- 40 min : projet « pose une question à ton cours » : chacun colle ses propres notes (ou les règles d'un jeu, un résumé de livre), pose 5 questions, évalue et règle son assistant
- 20 min : démo des assistants, une bonne réponse et une erreur expliquée par chacun

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Embeddings multilingues : https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 (repli TF-IDF scikit-learn si l'installation échoue)
- Visualiser des embeddings : https://projector.tensorflow.org
- Pour comparer avec un RAG prêt à l'emploi : https://notebooklm.google

Ils repartent avec : un assistant RAG qui répond à des questions sur des documents qu'ils ont choisis.
