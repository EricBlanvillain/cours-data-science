# Projet 4 · Mon assistant IA ⭐⭐⭐

Bloc 4 · Comprendre et construire avec l'IA générative (séances 10 à 12) · Niveau ⭐⭐⭐ Avancé

## Objectif

Construire **un assistant IA à toi**, qui fonctionne, avec ses tests, et le présenter au groupe à la séance 12. Quatre options, une seule à choisir (deux si tu avances vite) :

| Option | L'assistant | Ce qu'il mobilise | Séance |
|---|---|---|---|
| **A · RAG sur tes documents** | répond à des questions sur tes notes de cours, les règles d'un jeu, un résumé de livre, et avoue quand la réponse n'y est pas | découper, vectoriser (TF-IDF ou sentence-transformers), chercher, injecter, répondre | S11 |
| **B · Générateur de quiz** | fabrique des QCM en JSON à partir d'un thème ou des fiches d'un dataset Kaggle, les valide et corrige les réponses | sortie structurée, parsing JSON robuste, validation | S10 |
| **C · Chatbot à personnalité** | un personnage avec un prompt système (qui, comment, quoi faire, quoi ne pas faire) qui garde la mémoire de la conversation | prompt système, historique, tests de règles | S10 |
| **D · Agent avec un outil** | décide seul d'appeler une fonction Python qui interroge un dataset Kaggle (fiche d'un Pokémon, top d'une statistique...) puis répond | protocole `OUTIL: nom(arguments)` de la séance 12 (regex), boucle d'agent bornée | S12 |

## Dataset

- Options B et D : Pokémon, https://www.kaggle.com/datasets/abcsds/pokemon, miroir chargé automatiquement : https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv. Tu peux remplacer par le dataset de tes projets 1-2 (voir les miroirs dans le [README des projets](../README.md)).
- Option A : tes propres documents (10 à 30 paragraphes collés dans le notebook). Un exemple de notes de cours est fourni.
- Option C : pas de dataset, un prompt système.

## Le modèle

Le notebook reprend la cellule « Préparation » des séances 9 à 12 : `llm(messages)` appelle un petit modèle ouvert (Qwen2.5-0.5B-Instruct) sur le GPU de Colab, sans clé. `USE_MODEL = False` permet de développer sans modèle (réponses factices, y compris pour le RAG et le protocole d'outil). La variante API (clé fournie par le formateur, rangée dans les Secrets de Colab) est en commentaire : le reste du notebook ne change pas.

## Étapes (3 séances, ~30-40 min de projet par séance, puis la séance 12)

| Étape | Séance | Durée | Ce que tu fais |
|---|---|---|---|
| 0. Choisir | S10 | 10 min | option, nom de l'assistant, une phrase « il fait X pour Y » |
| 1. Squelette | S10-S11 | 40 min | faire tourner le squelette de ton option en mode démo, puis avec le modèle |
| 2. Personnaliser | S11 | 40 min | tes documents / ton thème / ton prompt système / ton 3e outil |
| 3. Tester | S12 | 20 min | 5 questions ou messages de test, dont des cas où l'assistant doit refuser ou avouer qu'il ne sait pas |
| 4. Présenter | S12 | 3 min par personne | problème, démo, ce qui marche, ce qui rate, la suite |

## Livrable

`projet_4_assistant_ia.ipynb` avec l'option complétée et ses tests, sur GitHub avec le README du portfolio finalisé (4 projets), et la présentation finale de 3 minutes.

## Critères de réussite

- [ ] L'assistant fonctionne de bout en bout (*Exécution → Tout exécuter* sans erreur, avec le modèle ou en mode démo).
- [ ] Il a un nom et une description en une phrase (ce qu'il fait, pour qui).
- [ ] Il a au moins 5 tests écrits dans le notebook, et tu sais lesquels passent.
- [ ] Il refuse ou avoue quand il ne sait pas : RAG hors documents, chatbot hors sujet ou demande interdite, agent sans outil adapté, quiz mal formé rejeté.
- [ ] Le prompt système (ou le contexte injecté) est écrit par toi, pas copié de la leçon.
- [ ] Présentation en 3 minutes avec une démo en direct et un cas qui rate.

La cellule d'auto-vérification du notebook affiche ✅/❌ selon l'option choisie.

## Pour aller plus loin

- Une petite interface Streamlit (`st.chat_input`, `st.chat_message`) déployée depuis GitHub.
- Combiner : un agent (D) dont un outil est ton RAG (A), comme la démo de la séance 12.
- Comparer le petit modèle et un modèle API sur les mêmes tests : où est la différence ?
- Bonnes pratiques à présenter : vérifier les réponses, aucune donnée personnelle dans les prompts, savoir dire quand l'IA se trompe.

## Notebooks et ressources Kaggle de référence

- Cours gratuit Kaggle « 5-Day Gen AI Intensive » : [guide](https://www.kaggle.com/learn-guide/5-day-genai) · [Day 1 - Prompting](https://www.kaggle.com/code/markishere/day-1-prompting) · [Day 2 - Document Q&A with RAG](https://www.kaggle.com/code/markishere/day-2-document-q-a-with-rag) · [Day 3 - Function calling](https://www.kaggle.com/code/markishere/day-3-function-calling-with-the-gemini-api) · [Day 3 - Building an agent with LangGraph](https://www.kaggle.com/code/markishere/day-3-building-an-agent-with-langgraph) (ces notebooks utilisent l'API Gemini : le principe est le même que notre `llm(messages)`)
- RAG : [Retrieval Augmented Generation (RAG)](https://www.kaggle.com/code/harshsinghal/retrieval-augmented-generation-rag) · [RAG with LangChain](https://www.kaggle.com/code/himanshunakrani/rag-retrieval-augmented-generation-with-langchain) · [ChatBot (RAG)](https://www.kaggle.com/code/mae01234/chatbot-rag)
- Agents : livre blanc Kaggle/Google [Agents](https://www.kaggle.com/whitepaper-agents)
- Éthique : cours gratuit [Intro to AI Ethics](https://www.kaggle.com/learn/intro-to-ai-ethics)
