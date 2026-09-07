# Fiche · Les 5 règles d'un bon prompt

Un prompt, c'est ce que tu écris à un modèle. Le modèle ne devine pas ce que tu as en tête : tout ce que tu ne dis pas, il l'invente. Cinq règles suffisent pour passer d'une réponse vague à une réponse utile.

| # | Règle | La question à se poser | Exemple de formule |
|---|---|---|---|
| 1 | **Le contexte** | Qui suis-je, dans quelle situation, pour quoi faire ? | « Je prépare un exposé de 5 minutes pour ma classe sur… » |
| 2 | **Le rôle** | Quel expert je voudrais avoir en face de moi ? | « Tu es un prof de SVT qui explique simplement. » |
| 3 | **La tâche précise** | Un verbe d'action et un objet, un seul à la fois | « Explique-moi la photosynthèse en 3 étapes. » |
| 4 | **Le format** | À quoi doit ressembler la réponse ? | « Une liste à puces, 5 lignes maximum, en français. » |
| 5 | **Un exemple** | À quoi ressemble une bonne réponse ? | « Par exemple, pour la respiration : “1. On inspire de l'oxygène…” » |

Un bon prompt n'est pas forcément long : il est **complet**. Souvent 4 à 6 phrases.

## Trois exemples, avant / après

### Exemple 1 · Réviser

| | Prompt | Ce qui manque / ce qui va |
|---|---|---|
| Mauvais | « Explique la Révolution française. » | Pas de contexte, pas de format : le modèle sort une page de Wikipédia |
| Bon | « Je suis en train de réviser l'histoire pour un contrôle demain (contexte). Tu es un prof d'histoire patient (rôle). Explique-moi les 3 causes principales de la Révolution française (tâche), sous forme de tableau à 2 colonnes : cause, exemple concret (format). Par exemple : “Crise financière : l'État est endetté par les guerres” (exemple). » | Les 5 règles sont là. La réponse est courte, structurée, réutilisable dans une fiche |

### Exemple 2 · Coder

| | Prompt | Ce qui manque / ce qui va |
|---|---|---|
| Mauvais | « Fais-moi un graphique pandas. » | Quel graphique ? Quelles données ? Quelles colonnes ? Le modèle invente un dataset |
| Bon | « J'ai un DataFrame pandas `df` avec les colonnes `Type 1` (texte) et `HP` (nombre), sur des Pokémon (contexte). Tu es un développeur Python qui écrit du code simple pour débutants (rôle). Écris le code qui trace un graphique en barres de la moyenne de HP par type, trié du plus grand au plus petit (tâche). Réponds uniquement avec le code, commenté en français, avec matplotlib (format). Le style attendu : `df.groupby(...)...plot(kind="bar")` (exemple). » | Le code tombe juste du premier coup et on comprend chaque ligne |

### Exemple 3 · Écrire

| | Prompt | Ce qui manque / ce qui va |
|---|---|---|
| Mauvais | « Écris un message pour mon club. » | Quel club ? Pour dire quoi ? À qui ? Quel ton ? |
| Bon | « Je suis responsable de la communication d'un club d'échecs qui organise un tournoi samedi (contexte). Tu es un rédacteur qui écrit des messages courts et chaleureux (rôle). Écris le message d'invitation pour le groupe de discussion du club (tâche) : 4 phrases maximum, tutoiement, avec la date, l'heure et un lien d'inscription à compléter (format). Le ton attendu : “Salut à tous ! Samedi, c'est le grand jour…” (exemple). » | Le message est prêt à envoyer, il reste juste à mettre le lien |

## Les pièges classiques

- **Deux tâches dans un prompt** (« résume et traduis ») : le modèle en bâcle une. Un prompt par tâche, ou une liste numérotée d'étapes.
- **Le format oublié** : on reçoit trois paragraphes quand on voulait une ligne.
- **Le contexte implicite** : « comme d'habitude », « mon projet », « le fichier ». Le modèle ne sait pas de quoi tu parles.
- **Croire la réponse** : un prompt parfait n'empêche pas une hallucination. Vérifie.
- **Les données personnelles** : jamais de nom, d'adresse, de mot de passe dans un prompt.

## Grille de score (le concours de la séance 1)

Un point par règle présente. Une règle est « présente » si on peut la souligner dans le prompt.

| Règle | 0 | 1 |
|---|---|---|
| Contexte | Aucune situation décrite | On sait qui écrit et pourquoi |
| Rôle | Aucun | Un rôle nommé (« tu es… ») |
| Tâche | Vague (« parle-moi de », « aide-moi ») ou plusieurs tâches mélangées | Un verbe d'action, un objet précis |
| Format | Aucun | Longueur, structure ou langue indiquée |
| Exemple | Aucun | Un exemple de réponse attendue, même court |

| Score | Lecture |
|---|---|
| 0-1 | Le modèle devine tout. Réponse longue, générique, souvent à côté |
| 2-3 | Correct : la réponse est utilisable après une ou deux relances |
| 4 | Bon : la réponse tombe juste du premier coup |
| 5 | Excellent : on peut réutiliser ce prompt tel quel, dans un prompt système par exemple |

Pour départager deux prompts à 5 : le plus court gagne.

## Ma fiche « mes 5 règles » (à remplir)

Le défi imposé : ____________________________________

Mon prompt :

> ...

Score : __ / 5 · Ce que j'ai ajouté après le premier essai : ____________________________________
