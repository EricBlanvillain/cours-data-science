# Projet B1 · L'assistant qui te fait réviser · ⭐⭐⭐

Piste agentique · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 9 à 11 (LLM, prompt, RAG)

## Objectif

Réviser en relisant ses notes, c'est passif : on croit connaître parce qu'on reconnaît le texte.
Cet assistant sert à celui qui doit apprendre un cours : il indexe **tes propres notes**, retrouve le bon passage (RAG) et te **pose des questions** dessus, au lieu de te les faire relire.
À la fin, tu as un notebook qui transforme n'importe quel cours collé dans une cellule en une interro corrigée, avec un score et le passage source de chaque question.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `scikit-learn` (`TfidfVectorizer`, `cosine_similarity`), `numpy`, `matplotlib`, `re`, `json` | déjà installés dans Colab, rien à faire |
| `transformers` + `accelerate` (le modèle Qwen2.5-0.5B) | `!pip install -q transformers accelerate` — la cellule le fait pour toi quand `USE_MODEL = True` |
| `sentence-transformers` (embeddings « par le sens », **optionnel**) | `!pip install -q sentence-transformers`, confortable seulement avec un GPU T4 |

**Aucune clé d'API.** L'interrupteur `USE_MODEL` de la séance 11 est en haut du notebook :
- `USE_MODEL = False` → un faux modèle (`llm_factice`) répond hors ligne, sans GPU. Tout le projet tourne, y compris la génération des questions : ce qui est vérifié, c'est **ton code** (découpage, recherche, correction), pas le talent du modèle.
- `USE_MODEL = True` → Qwen2.5-0.5B-Instruct tourne dans Colab, gratuitement, sans compte. Le reste du notebook ne change pas.
- La variante API (clé rangée dans les *Secrets* de Colab) est en commentaire, à décommenter si tu en as une.

## Déroulé (1 h 30)

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | Sections 0 et 1 : lancer la Préparation, lire la question du projet, choisir le cours que tu veux réviser |
| 10-20 min | Section 2 : coller tes notes dans `MES_NOTES` (au moins 10 paragraphes séparés par une ligne vide) — un extrait de cours d'exemple est fourni si tu n'as rien sous la main |
| 20-35 min | Section 3 : découper en chunks et construire l'index TF-IDF (exercices 1 et 2) |
| 35-50 min | Section 4 : la recherche et son seuil « je ne sais pas » (exercices 3 et 4) |
| 50-70 min | Sections 5 et 6 : générer les questions de révision (question / réponse attendue / passage source) et lancer le mode « interro » (exercices 5 et 6) |
| 70-85 min | Section 7 : l'évaluation — 8 questions de contrôle, taux de bonnes réponses, questions hors sujet |
| 85-90 min | Section 8 : remplir la fiche projet et montrer une question réussie et une ratée |

Si le temps manque : arrête-toi à la fin de la section 6 (tu as déjà un assistant qui interroge). L'évaluation de la section 7 se fait très bien dans un second créneau.

## Livrable

`B1_assistant_reviseur.ipynb` complété, exécutable de haut en bas (*Exécution → Tout exécuter*) avec **tes** notes dans `MES_NOTES`, et sa fiche projet finale remplie : le cours indexé, le nombre de chunks, le taux de bonnes réponses de ton interro, une question que l'assistant a bien posée, une qu'il a ratée et pourquoi.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. Le corpus** | Le notebook tourne encore sur le cours d'exemple | `MES_NOTES` contient ton cours, au moins 10 chunks, et tu dis d'où il vient | Deux corpus comparés (deux matières), ou un découpage par taille testé en plus des paragraphes |
| **2. La recherche** | La recherche renvoie des passages au hasard | Pour 5 questions écrites par toi, le bon passage est dans le top 3 | Le `k` et le seuil sont réglés avec des chiffres à l'appui (tableau ou courbe) |
| **3. Les questions générées** | Les questions ne sont pas exploitables (vides, hors sujet) | Au moins 5 questions avec leur réponse attendue **et** leur passage source | Les questions couvrent tout le cours (pas 5 fois le même paragraphe) et mélangent définitions et « pourquoi » |
| **4. La correction** | L'interro pose les questions mais ne corrige pas | `corriger()` compare ta réponse au passage source et donne un score justifié | Le barème est défendu : un contre-exemple montré où il se trompe (bonne réponse mal notée) |
| **5. L'honnêteté** | L'assistant invente sur une question hors sujet | Sous le seuil, il répond « je ne trouve pas cette information dans mes notes » | Le seuil est mesuré : scores des questions du cours vs hors sujet, et le choix est argumenté |
| **6. Ça tourne** | Des cellules plantent | Tout s'exécute dans un Colab vierge en `USE_MODEL = False` **et** en `True` | La fiche projet est remplie, avec une question ratée expliquée |

## Pour aller plus loin

- Remplace TF-IDF par **sentence-transformers** (`paraphrase-multilingual-MiniLM-L12-v2`) : la recherche comprend alors le sens, pas seulement les mots. Compare les deux sur les mêmes 5 questions — c'est un bon graphique de fin de projet.
- Ajoute des **cartes de révision espacée** : chaque question ratée revient dans l'interro suivante, les questions réussies deux fois sortent du paquet.
- Branche une petite interface **Streamlit** (`st.text_area` pour les notes, `st.chat_message` pour l'interro) et déploie-la depuis GitHub.

## Liens utiles

- Le modèle utilisé, gratuit et sans clé : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- TF-IDF expliqué dans la doc scikit-learn : https://scikit-learn.org/stable/modules/feature_extraction.html · la classe : https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
- Similarité cosinus : https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html
- Embeddings multilingues (option) : https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 · le classement des modèles : https://huggingface.co/spaces/mteb/leaderboard
- Un RAG pas à pas côté Kaggle : https://www.kaggle.com/code/markishere/day-2-document-q-a-with-rag
- Le même service, prêt à l'emploi, pour comparer avec ton assistant : https://notebooklm.google
- La leçon dont ce projet est la suite : [séance 11 · Le RAG](../../../seances/seance-11-rag/)
