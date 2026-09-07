# Déroulé type d'une séance

Chaque séance dure 2 h et suit le même rythme **20 / 80 / 20** : 20 min d'explication, 80 min de pratique, 20 min de partage. La régularité rassure et fait gagner du temps : dès la séance 2, tout le monde sait ce qui vient.

## Vue d'ensemble

| Temps | Phase | Qui parle | Ce qui se passe |
|---|---|---|---|
| 0-5 | Accueil | Formateur | Ordinateurs ouverts, Colab lancé, notebook de la séance importé. Rappel en une phrase de ce qu'on a construit la dernière fois |
| 5-20 | Explication | Formateur | L'idée du jour, une analogie, une démo en direct. Pas de slides longs : le notebook est le support |
| 20-100 | Pratique | Participants | Leçon guidée (sections du notebook, un exercice par section), puis projet de la séance. Le formateur passe de table en table |
| 100-120 | Partage | Participants | Chacun (ou chaque binôme) montre ce qu'il a construit, en 1 à 2 min. Le formateur conclut et annonce la suite |

Le minutage précis de chaque séance est dans le `README.md` de son dossier.

## Les 20 premières minutes : expliquer

- **Une idée par séance.** Le token, le train / test, le prompt système. Le reste est dans le notebook, on n'a pas besoin de tout dire à l'oral.
- **Une analogie, toujours.** Git et la sauvegarde de jeu vidéo, le RAG et l'examen à livre ouvert, l'agent et le stagiaire à qui on donne un téléphone. L'analogie est ce que les participants retiennent ; le vocabulaire vient après (le glossaire est là pour ça).
- **Une démo qui peut rater.** Teachable Machine qu'on piège, le modèle qui hallucine, le graphique trompeur. Le raté est le moment où tout le monde regarde.
- **Un quiz de 2 minutes** pour ouvrir (« IA ou pas ? », « quel piège ? », « classification ou régression ? ») met tout le monde en action avant de parler.
- **Pas plus de 20 minutes.** Si on déborde, la pratique paie. Mettre une alarme.

## Les 80 minutes du milieu : pratiquer

Deux temps :

1. **La leçon guidée (30 à 40 min).** On avance dans le notebook section par section. Le formateur montre une section au vidéoprojecteur, les participants la rejouent et font l'exercice de la section. On attend que tout le monde soit passé avant la section suivante, mais on n'attend pas que tout le monde ait fini l'exercice : les exercices du notebook `NN_exercices.ipynb` servent de réserve pour ceux qui vont vite.
2. **Le projet (40 à 50 min).** Un énoncé court, un squelette à compléter, un livrable précis (« 3 questions, 3 graphiques », « un `submission.csv` », « un bot qui répond en JSON »). C'est ce qui sera montré au partage et poussé sur GitHub.

Le rôle du formateur pendant ces 80 minutes :

- **Circuler**, ne pas rester au vidéoprojecteur. Un tour complet toutes les 10 minutes.
- **Répondre par une question** avant de répondre par la solution : « qu'est-ce que dit le message d'erreur ? », « quelle cellule crée `df` ? ». L'indice du notebook vient en second, la solution en dernier.
- **Repérer les bloqués silencieux** : ceux qui n'écrivent plus depuis 5 minutes. Souvent une cellule non exécutée ou un fichier disparu.
- **Débloquer en public** quand trois personnes ont la même erreur : on la montre au vidéoprojecteur, on la corrige ensemble, on repart.
- **Laisser les niveaux faire le tri.** Les exercices ⭐ pour tous, ⭐⭐ pour la plupart, ⭐⭐⭐ pour ceux qui ont fini. Personne n'attend, personne n'est largué. Un ⭐⭐⭐ non fini n'est pas un échec.
- **Binômes** dès que c'est possible (obligatoire aux séances 7 et 8) : un qui tape, un qui lit l'énoncé, on inverse à la moitié.

## Les 20 dernières minutes : partager

- **Tout le monde montre quelque chose**, même inachevé. 1 à 2 minutes chacun, chrono visible. Le format est toujours le même : ce que j'ai voulu faire, ce que ça donne, ce qui a coincé.
- **Le formateur pose une question par passage**, jamais un jugement : « pourquoi ce graphique plutôt qu'un autre ? », « qu'est-ce que tu changerais ? ».
- **Les autres jouent un rôle** quand la séance s'y prête : le client (séance 5), le jury du concours de prompts (séance 1), les testeurs du bot (séance 10).
- **Conclure en 2 minutes** : l'idée du jour en une phrase, ce qu'on construit la prochaine fois, ce qu'il faut préparer (compte Kaggle avant la séance 7, `train.csv` avant la 8, ses propres notes avant la 11).
- **Pousser sur GitHub** avant de partir (à partir de la séance 3) : le partage est aussi le moment de « fermer » le projet.

## Conseils d'animation

| Situation | Ce qui marche |
|---|---|
| Niveaux très différents dans le groupe | Les niveaux ⭐ du notebook d'exercices ; mettre un rapide avec un moins rapide en binôme ; donner au plus rapide le rôle de « deuxième formateur » sur une table |
| Quelqu'un recopie sans comprendre | Lui demander de modifier une valeur et de prédire le résultat avant d'exécuter |
| Un participant coincé sur une erreur depuis longtemps | Lire le message d'erreur à voix haute ensemble ; 90 % des cas sont dans la table « erreurs fréquentes » des aide-mémoires |
| Le wifi ou Colab rame | Les datasets ont tous un miroir public ; les notebooks 9 à 12 tournent en `USE_MODEL = False` ; garder un notebook exécuté en local pour montrer les sorties |
| Le GPU n'est pas disponible (séances 9-12) | Mode `USE_MODEL = False` pour les exercices ; démo du modèle sur la machine du formateur (Ollama) |
| Utilisation de ChatGPT pour faire les exercices | L'autoriser, à une condition : expliquer chaque ligne obtenue au partage. Faire le lien avec les bonnes pratiques de la séance 12 |
| Quelqu'un termine tout, exercices ⭐⭐⭐ compris | Lui proposer de changer de dataset (liens-utiles) ou de commencer le projet suivant |
| Un participant ne veut pas présenter | Présenter en binôme, ou montrer son écran sans parler et laisser le formateur commenter la première fois |
| La séance déborde | Couper dans la leçon guidée, jamais dans le partage |

## Check-list du formateur

Avant la séance :
- [ ] Notebook de la séance testé dans un Colab vierge le matin même (les URLs de données, l'installation des bibliothèques)
- [ ] `README.md` de la séance relu, minutage en tête
- [ ] Vidéoprojecteur, wifi, multiprises
- [ ] Pour 7-8 : comptes Kaggle vérifiés, `train.csv` / `test.csv` disponibles sur une clé USB en secours
- [ ] Pour 9-12 : GPU T4 testé, clé d'API (si utilisée) dans les Secrets de Colab, jamais dans une cellule
- [ ] Une copie du notebook exécuté (avec les sorties) pour montrer le résultat attendu

Après la séance :
- [ ] Noter les points de blocage récurrents (pour ajuster le notebook)
- [ ] Vérifier que les projets sont sur GitHub
- [ ] Envoyer en une ligne ce qu'il faut préparer pour la prochaine fois
