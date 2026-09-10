# Projet B4 · Fiabiliser un assistant : banc de test, hallucinations, garde-fous · ⭐⭐⭐

Piste agentique · Niveau ⭐⭐⭐ Avancé · Prérequis : avoir fini [B1](../B1-assistant-reviseur/) **ou** [B2](../B2-agent-outille/)

## Objectif

« Ça marche » n'est pas un résultat : un assistant qui répond juste 6 fois sur 10 et invente le reste du temps a l'air parfaitement convaincant.
Ce projet sert à celui qui veut donner son assistant à quelqu'un d'autre : on mesure d'abord (un banc de 15 questions avec leur réponse attendue), on identifie les hallucinations, on pose des garde-fous, puis on **remesure** pour prouver que ça va mieux.
À la fin, tu as un tableau avant / après sur les mêmes 15 questions, un taux de bonnes réponses, un taux d'hallucinations, et trois garde-fous dont tu sais ce qu'ils ont coûté.

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `pandas` (le tableau de résultats), `matplotlib` (le graphique avant / après), `re`, `json` | déjà installés dans Colab, rien à faire |
| Ton notebook B1 ou B2, recopié dans les premières cellules | ton travail des séances précédentes |
| `transformers` + `accelerate` (Qwen2.5-0.5B) | `!pip install -q transformers accelerate`, fait par la cellule quand `USE_MODEL = True` |

**Aucune clé d'API.** Toute l'évaluation tourne en `USE_MODEL = False` : le faux modèle est même **plus pratique** ici, parce qu'il est déterministe — deux mesures identiques doivent donner deux fois le même chiffre, sinon on ne compare rien. Repasse en `USE_MODEL = True` à la fin pour mesurer le vrai modèle sur le même banc.

## Déroulé (1 h 30)

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | Section 0 et 1 : recopier l'assistant à fiabiliser (B1 ou B2), le faire tourner tel quel, sans rien changer |
| 10-30 min | Section 2 : écrire le **banc de test** — 15 questions en 4 familles : 8 dont la réponse est dans les documents (ou dans un outil), 3 pièges (formulées avec d'autres mots), 3 hors sujet (la bonne réponse est un refus), 1 ambiguë. Chaque ligne : question, réponse attendue, mots-clés obligatoires, comportement attendu |
| 30-45 min | Section 3 : la **mesure automatique** — `est_correcte()` compare la réponse aux mots-clés attendus, `est_un_refus()` reconnaît un aveu d'ignorance ; taux de bonnes réponses de départ |
| 45-60 min | Section 4 : la **détection d'hallucination** — une réponse affirmative dont le contenu n'est pas dans le contexte fourni ; taux d'hallucinations de départ, et les 3 pires exemples |
| 60-75 min | Section 5 : les **garde-fous** — (1) seuil de similarité : sous le seuil, on refuse avant même d'appeler le modèle ; (2) consigne de refus renforcée dans le prompt système ; (3) vérification après coup : la réponse doit reprendre des mots du contexte, sinon on la remplace par un refus |
| 75-90 min | Section 6 : le **avant / après** sur les mêmes 15 questions, le graphique, le coût des garde-fous (des bonnes réponses perdues ?), et la fiche projet |

Si le temps manque : arrête-toi à la fin de la section 4 (tu as déjà le chiffre de départ, ce qui est le plus dur). Les garde-fous et la remesure font une reprise nette au créneau suivant.

## Livrable

`B4_fiabiliser_un_assistant.ipynb` : le banc de 15 questions écrit par toi, le tableau pandas des résultats **avant** et **après**, le graphique de comparaison, les 3 garde-fous codés, et la fiche projet finale — taux de bonnes réponses avant → après, taux d'hallucinations avant → après, ce que les garde-fous ont coûté, et la question qui résiste encore.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. Le banc de test** | Moins de 15 questions, ou pas de réponse attendue | 15 questions avec réponse attendue et comportement attendu, dont 3 hors sujet et 3 pièges | Les questions sont écrites **avant** de voir les réponses de l'assistant, et le banc est rangé dans un fichier réutilisable (JSON ou CSV) |
| **2. La mesure** | Le jugement se fait à l'œil, question par question | `evaluer()` renvoie un taux reproductible : deux exécutions donnent le même chiffre | Les limites de la mesure sont dites : un cas où `est_correcte()` se trompe (bonne réponse comptée fausse) est montré |
| **3. Les hallucinations** | Le mot est employé sans être défini ni compté | Une définition opérationnelle (réponse affirmative sans appui dans le contexte) et un taux chiffré | Les hallucinations sont classées par cause : passage manquant, question ambiguë, consigne trop faible |
| **4. Les garde-fous** | Un seul garde-fou, ou aucun effet mesuré | Les 3 garde-fous sont codés et activables séparément, avec l'effet de chacun sur le taux | Le seuil est réglé sur des données (courbe refus / bonnes réponses selon le seuil), pas choisi au hasard |
| **5. Le avant / après** | Un seul chiffre, sans comparaison | Le même banc passé deux fois, tableau et graphique, l'écart commenté | Le **coût** est assumé : combien de bonnes réponses perdues pour combien d'hallucinations évitées, et pourquoi c'est un bon échange ici |
| **6. L'honnêteté du bilan** | « Ça marche mieux » sans chiffre | La fiche projet donne les 4 chiffres et nomme une faiblesse qui reste | Une piste concrète et testable est proposée pour la faiblesse restante |

## Pour aller plus loin

- Fais juger les réponses par un **second modèle** (« LLM juge ») au lieu des mots-clés, puis compare son verdict au tien sur les 15 questions : sur combien êtes-vous d'accord ? C'est la vraie question de cette méthode.
- Ajoute la **citation obligatoire** : l'assistant doit indiquer le numéro du passage utilisé, et on vérifie automatiquement que la citation existe et contient bien la réponse.
- Regarde comment les bibliothèques d'évaluation formalisent tout ça (fidélité, pertinence du contexte) : https://docs.ragas.io/en/stable/ — les métriques sont les tiennes, en plus habillées.

## Liens utiles

- Le modèle utilisé, gratuit et sans clé : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Faire juger un modèle par un modèle (recettes Hugging Face) : https://huggingface.co/learn/cookbook/en/llm_judge
- Évaluer un RAG (fidélité, pertinence) : https://docs.ragas.io/en/stable/ · le code : https://github.com/explodinggradients/ragas
- Un pipeline RAG de référence, pour comparer avec le tien : https://python.langchain.com/docs/tutorials/rag/
- Ce qu'est un agent, et pourquoi l'évaluer est le vrai travail : https://www.kaggle.com/whitepaper-agents
- La grille d'évaluation du cours (trois paliers) : [docs/grille-evaluation.md](../../../docs/grille-evaluation.md)
- Les leçons dont ce projet est la suite : [séance 9 · Comment fonctionne un LLM](../../../seances/seance-09-comment-fonctionne-un-llm/) et [séance 11 · Le RAG](../../../seances/seance-11-rag/)
