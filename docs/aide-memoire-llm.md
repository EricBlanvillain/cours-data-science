# Aide-mémoire LLM

Une page pour les séances 9 à 12 : tokens, messages, prompt système, JSON, RAG, agent. Les exemples utilisent la fonction `llm(messages)` des notebooks, qui envoie une liste de messages au modèle et renvoie sa réponse en texte (avec `USE_MODEL = False`, une réponse factice).

## Tokens (séance 9)

| Idée | À retenir |
|---|---|
| Token | Un morceau de mot transformé en nombre. « manchots » = 3 tokens, « the » = 1. Un LLM ne lit que des tokens |
| Ordre de grandeur | En français, 1 token ≈ 3-4 caractères, 100 tokens ≈ 70 mots |
| Fenêtre de contexte | Le nombre maximum de tokens que le modèle peut lire d'un coup (de 4 000 à plus d'un million selon le modèle). Au-delà, il oublie le début |
| Coût | Les API facturent au token, en entrée et en sortie |
| Prédire le suivant | Le modèle calcule la probabilité de chaque token suivant et en choisit un. Il recommence. C'est tout |
| Température | 0 : toujours le token le plus probable (réponses stables). 1 et plus : plus de hasard (réponses créatives, parfois n'importe quoi) |

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
tokens = enc.encode("Les manchots aiment le froid.")
len(tokens), enc.decode(tokens[:3])
```

## Les trois rôles (séance 10)

| Rôle | Qui parle | Contenu |
|---|---|---|
| `system` | Toi, le concepteur | Les consignes permanentes : rôle, ton, règles, format. Le modèle ne le voit pas comme une question mais comme un cadre |
| `user` | L'utilisateur | La question ou la demande |
| `assistant` | Le modèle | Sa réponse. On la garde dans la liste pour qu'il se souvienne de la conversation |

```python
messages = [
    {"role": "system", "content": "Tu es un coach de révisions. Tu réponds en 3 phrases maximum, en français."},
    {"role": "user", "content": "Comment réviser la photosynthèse ?"},
]
reponse = llm(messages)
messages.append({"role": "assistant", "content": reponse})   # l'historique
messages.append({"role": "user", "content": "Et en 1 phrase ?"})
```
Le modèle n'a **aucune mémoire** entre deux appels : l'historique, c'est toi qui le renvoies à chaque fois.

## Écrire un prompt système

Les 5 règles d'un bon prompt s'appliquent (voir [fiche-5-regles-du-prompt.md](fiche-5-regles-du-prompt.md)) : contexte, rôle, tâche, format, exemple. En plus, pour un prompt système :

- Des règles courtes et numérotées (« 1. Ne donne jamais la réponse directement. 2. Pose une question en retour. »)
- Ce qu'il doit faire quand il ne sait pas (« Si la question sort de la SVT, dis-le et propose de revenir au sujet. »)
- La langue et la longueur attendues

## Réponse en JSON (séance 10)

Demander un format que le programme peut lire :

```python
system = """Tu réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, de la forme :
{"question": "...", "choix": ["...", "...", "...", "..."], "bonne_reponse": 0}"""

import json
texte = llm([{"role": "system", "content": system}, {"role": "user", "content": "Un quiz sur les volcans"}])
try:
    quiz = json.loads(texte)
except json.JSONDecodeError:
    quiz = None      # redemander, ou nettoyer le texte (enlever les ``` autour)
```

| Fonction | Ce qu'elle fait |
|---|---|
| `json.loads(texte)` | Texte → dictionnaire / liste Python |
| `json.dumps(objet, ensure_ascii=False, indent=2)` | Objet Python → texte JSON lisible |
| `texte.strip().removeprefix("```json").removesuffix("```")` | Enlever les barrières de code que le modèle ajoute parfois |

Toujours prévoir le cas où le modèle ne respecte pas le format : `try / except`, vérifier les clés (`"question" in quiz`), redemander une fois.

## RAG (séance 11)

Le modèle ne connaît pas tes documents. Le RAG (*Retrieval-Augmented Generation*) les lui donne au bon moment, comme un examen à livre ouvert.

| Étape | Ce qu'on fait | Outil |
|---|---|---|
| 1. Découper | Couper les documents en chunks (200-500 mots, avec un peu de chevauchement) | `texte.split("\n\n")` ou une fonction maison |
| 2. Vectoriser | Transformer chaque chunk en vecteur (embedding) : des textes proches donnent des points proches | `sentence-transformers` ou, en repli, `TfidfVectorizer` de scikit-learn |
| 3. Chercher | Vectoriser la question, calculer la similarité cosinus avec chaque chunk, garder les k meilleurs | `cosine_similarity` de scikit-learn, `argsort` |
| 4. Injecter | Mettre les chunks trouvés dans le prompt, avant la question | Un prompt système : « Réponds uniquement à partir du contexte ci-dessous. Si la réponse n'y est pas, dis-le. » |
| 5. Répondre | Appeler le modèle | `llm(messages)` |

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

vec = TfidfVectorizer().fit(chunks)
M = vec.transform(chunks)
q = vec.transform([question])
scores = cosine_similarity(q, M)[0]
meilleurs = [chunks[i] for i in scores.argsort()[::-1][:3]]
```

Ce qui fait la différence : la taille des chunks, le nombre k, et la consigne « si ce n'est pas dans le contexte, dis-le ». Une mauvaise réponse vient presque toujours d'une mauvaise recherche (le bon passage n'a pas été trouvé), pas du modèle.

## Agent (séance 12)

Un agent, c'est un LLM dans une boucle avec des outils :

1. On décrit les outils dans le prompt système (nom, à quoi ça sert, arguments) et le protocole : « Pour utiliser un outil, réponds exactement `OUTIL: nom(arguments)` ».
2. Le modèle répond soit une réponse finale, soit un appel d'outil.
3. Le programme détecte l'appel, exécute la fonction Python correspondante, et renvoie le résultat au modèle comme un nouveau message.
4. On recommence, avec un nombre maximum de tours (5) pour éviter la boucle infinie.

```python
outils = {"calcul": calcul, "chercher_pokemon": chercher_pokemon, "rag": chercher_dans_le_cours}

for tour in range(5):
    reponse = llm(messages)
    if not reponse.startswith("OUTIL:"):
        break                                        # réponse finale
    nom, args = parser_appel(reponse)                # "calcul", "12*7"
    resultat = outils[nom](args)
    messages.append({"role": "assistant", "content": reponse})
    messages.append({"role": "user", "content": f"RÉSULTAT: {resultat}"})
```

Ce qui peut rater : l'agent invente un outil qui n'existe pas, se trompe d'arguments, boucle, ou répond sans appeler l'outil alors qu'il fallait. D'où le banc de test de la séance 12.

## Les limites à garder en tête

| Limite | Ce que ça veut dire | Parade |
|---|---|---|
| Hallucination | Une réponse fausse dite avec assurance | Vérifier, demander la source, RAG |
| Date de connaissance | Le modèle ne sait rien après sa date d'entraînement | Lui donner l'info (RAG, recherche web) |
| Calcul | Il prédit des tokens, il ne calcule pas | Un outil calculatrice (agent) |
| Contexte limité | Au-delà de la fenêtre, il oublie | Résumer l'historique, chunks courts |
| Données personnelles | Ce que tu envoies part sur un serveur | Ne jamais envoyer de données perso ni de clés |

## Petit modèle dans Colab vs gros modèle par API

| | SLM dans Colab (Qwen 0.5B) | LLM par API (Claude, GPT, Mistral Large) |
|---|---|---|
| Coût | Gratuit | Payant au token (clé du formateur) |
| Qualité | Correcte sur des tâches simples, se trompe souvent | Bien meilleure |
| Vie privée | Tout reste dans ton Colab | Les messages partent chez le fournisseur |
| Vitesse | Lente sans GPU | Rapide |
| Dans les notebooks | `USE_MODEL = True` | Remplacer `llm()` par un appel au SDK du fournisseur |
