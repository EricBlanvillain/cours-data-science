# Fiche · Choisir ses outils

Avant d'écrire la première ligne d'un projet data, il y a cinq questions à se poser. Elles prennent dix minutes et évitent des semaines perdues — ou une facture surprise. Personne ne les pose jamais ; c'est exactement pour ça qu'elles valent une fiche.

| # | Question | Ce qu'on regarde | La réponse par défaut |
|---|---|---|---|
| 1 | **Quel langage ?** | Où sont mes données, et qu'est-ce qui existe déjà comme bibliothèques ? | **Python**, sauf contrainte : données dans une base → SQL ; ça vit dans un navigateur → JavaScript |
| 2 | **Est-ce que ça va être trop lent ?** | Est-ce que j'écris une boucle sur mes données ? | Vectorise avec NumPy / pandas. On ne se sert pas de Python pour calculer, mais pour piloter du code C |
| 3 | **Est-ce que ça tient en mémoire ?** | `df.info(memory_usage="deep")` — combien de Mo, et pour quelles colonnes ? | `astype("category")` sur les textes répétitifs ; `chunksize` si le fichier dépasse la RAM |
| 4 | **Ça tourne où ?** | Combien d'heures, combien de Go, faut-il un GPU ? | **Colab** pour apprendre et pour un GPU gratuit ; le cloud seulement si c'est long ou énorme |
| 5 | **Combien ça coûte ?** | Le prix au million de tokens, ou le prix de l'heure de GPU | Toujours un essai sur **100 lignes** avant de lancer les 10 millions |

Ces cinq questions se répondent avec un chronomètre, un compteur de mémoire et une règle de trois. **On ne devine pas : on mesure.**

## Le langage, en une ligne chacun

| Langage | Ce qu'il sait faire | Sa limite | Gestion de la mémoire | Qui l'utilise |
|---|---|---|---|---|
| **Python** | Tout le chemin : lire, nettoyer, tracer, entraîner, servir | Lent dès qu'on écrit des boucles à la main | **Ramasse-miettes** : tu n'y penses jamais | Data scientists, ingénieurs IA, chercheurs |
| **R** | Statistiques et graphiques, avec une élégance rare ([`ggplot2`](https://ggplot2.tidyverse.org/)) | Sort mal de la stat ; industrialiser un modèle R est pénible | **Ramasse-miettes**, avec une copie du tableau à chaque modification | Statisticiens, biostatistique, recherche académique, marketing |
| **SQL** | Interroger des données déjà rangées, même des milliards de lignes | Ne sait que ça : pas de graphique, pas de modèle | **Ce n'est pas ton problème** : le moteur de la base s'en occupe | Tout le monde, en entreprise |
| **C / C++** | Aller très vite, contrôle total de la machine | Un oubli de mémoire = fuite ou plantage ; peu de bibliothèques data modernes | **À la main** : `malloc` pour prendre, `free` pour rendre | Ceux qui ont écrit les moteurs : NumPy, pandas |
| **Rust** | Aussi vite que le C, sans ses accidents de mémoire | Sévère à l'apprentissage : le compilateur refuse beaucoup | **Garantie à la compilation** : ni ramasse-miettes, ni `free` à écrire | Ceux qui écrivent les moteurs d'aujourd'hui : Polars, les serveurs de modèles |
| **JavaScript** | Faire vivre une page web, des graphiques interactifs | Écosystème data et IA très pauvre | **Ramasse-miettes** (celui du navigateur) | Développeurs web, tableaux de bord |

Le point à retenir : **on choisit un langage pour son écosystème, pas pour sa vitesse.** Rust est 50 fois plus rapide que Python, mais si tu dois écrire toi-même le chargement de CSV, l'algorithme de régression et la bibliothèque de graphiques, tu as mis trois mois là où Python demandait un après-midi. Ton temps coûte plus cher que le temps de calcul.

### R : là où il gagne, là où il coince

R est le langage qu'on cite le plus vite et qu'on traite le plus mal. Sur son terrain, **il gagne**.

- **Les statistiques.** Modèles linéaires et mixtes, tests, analyse de survie, séries temporelles : une ligne, et une sortie déjà lisible par un relecteur. En Python, il faut souvent chercher et assembler.
- **`ggplot2`.** Pas « une bibliothèque de graphiques de plus » : une **grammaire** — des données, une correspondance entre variables et propriétés visuelles, des couches. On décrit un graphique au lieu de le dessiner. `matplotlib` n'a pas d'équivalent.
- **La recherche et la biostatistique.** Essais cliniques, épidémiologie, génomique : les méthodes de référence sont publiées **en R**, sur [CRAN](https://cran.r-project.org/) et Bioconductor, souvent des années avant d'exister ailleurs. Là-bas, R est la langue commune, pas une préférence.

Et là où il coince, il faut le dire aussi :

- **L'industrialisation.** Faire répondre un modèle R à des milliers d'appels par jour, dans le système de l'entreprise, surveillé et redémarré tout seul, est nettement plus pénible qu'en Python — et les équipes d'ingénierie qui doivent le faire tourner ne parlent pas R. Le scénario classique : prototypé en R, **réécrit en Python** pour la production. Deux fois le travail, deux occasions de se tromper.
- **Tout ce qui n'est pas de la statistique.** Réseaux de neurones, images, appel d'un modèle de langage, scraping, mise en place d'une API : l'écosystème R existe, mais reste en retrait, moins maintenu, moins documenté.

**La règle honnête :** si ton livrable est une *analyse* — un article, un rapport, une étude — R est un excellent choix, parfois le meilleur. Si ton livrable est un *système* — quelque chose qui tourne tout seul et que quelqu'un d'autre appelle — prends Python.

### Qui gère la mémoire, et ce que ça coûte au programmeur

La colonne « gestion de la mémoire » du tableau n'est pas un détail d'implémentation : c'est ce qui explique la moitié des différences entre ces langages. Il y a exactement trois réponses, et chacune se paie dans une monnaie différente.

| Approche | Langages | Ce que ça te donne | Ce que ça te coûte |
|---|---|---|---|
| **Ramasse-miettes** | Python, R, JavaScript | Tu n'écris jamais de libération : quand plus personne ne pointe sur un objet, il est rendu tout seul | **De la performance** — le comptage tourne en permanence — et tu ne décides pas *quand*. Un objet oublié dans une liste qui grossit n'est jamais libéré |
| **À la main** (`malloc` / `free`) | C, C++ | Contrôle total, à l'octet près, sans rien qui tourne en arrière-plan | **De l'attention**, en permanence. Un `free` oublié = fuite ; un `free` en double ou une lecture après libération = plantage, voire faille de sécurité |
| **Garantie à la compilation** | Rust | Le compilateur suit qui possède quoi et insère la libération au bon endroit : les bugs de mémoire ne compilent pas | **De la patience.** Le compilateur refuse ton programme tant qu'il a un doute, même quand tu es sûr d'avoir raison |

En une phrase : **Python et R achètent ta tranquillité avec de la performance, le C achète la performance avec ton attention, Rust achète les deux avec ta patience à la compilation.** Il n'y a pas de gagnant — il y a une facture, et tu choisis dans quelle monnaie tu la règles.

Et remarque où se place Python : il paie en performance… puis il rattrape tout en appelant du C ou du Rust. C'est exactement le sujet de la question 2.

## Trois situations, avant / après

### Situation 1 · Nettoyer un fichier de 3 Go

| | Le choix | Ce qui va / ce qui manque |
|---|---|---|
| Mauvais | « Je charge le CSV avec `pd.read_csv()` sur mon portable et je fais une boucle sur les lignes. » | La machine sature (3 Go de texte peuvent occuper 10 Go en mémoire), et la boucle mettrait des heures |
| Bon | « Je lis par morceaux avec `chunksize=100_000`, je passe les colonnes de texte répétitives en `category`, et je vectorise le nettoyage. Je teste sur les 1 000 premières lignes. » | Ça tient sur n'importe quelle machine, ça tourne en minutes, et la coquille se découvre en 2 secondes au lieu de 4 heures |

### Situation 2 · Entraîner un modèle d'images

| | Le choix | Ce qui va / ce qui manque |
|---|---|---|
| Mauvais | « J'entraîne sur mon ordinateur portable, ça va bien se passer. » | Pas de GPU utilisable : ce qui prend 20 minutes sur un GPU en prend 12 heures, ventilateur à fond |
| Bon | « Colab avec le GPU T4 gratuit (*Exécution → Modifier le type d'exécution*). Je sauvegarde le modèle sur mon Drive, parce que Colab efface tout à la fermeture. Si l'entraînement doit dépasser 8 heures, je passe sur un GPU loué, et je l'éteins en partant. » | Gratuit, rapide, et rien n'est perdu. Un GPU à 2 €/h oublié un week-end coûte 96 € |

### Situation 3 · Classer 10 000 avis clients avec un modèle

| | Le choix | Ce qui va / ce qui manque |
|---|---|---|
| Mauvais | « Je prends le modèle le plus puissant et je lance les 10 000 d'un coup. » | On paie 5 fois le prix pour une tâche simple, et on découvre le bug après avoir dépensé 50 € |
| Bon | « Je lance 100 avis sur un petit modèle et sur un gros, je compare la qualité. Le petit suffit → j'estime le coût total par une règle de trois, et je lance. » | 10 centimes d'essai, une décision fondée sur des résultats, et une facture connue **avant** de s'engager |

## Les pièges classiques

- **La boucle `for` sur un DataFrame.** Presque toujours 50 fois plus lente qu'une ligne vectorisée. Cherche `np.where`, un masque booléen, un `groupby`.
- **Le `memory_usage()` sans `deep=True`.** Sans lui, pandas ne compte que les pointeurs et annonce un poids ridiculement bas pour les colonnes de texte.
- **Le `category` appliqué partout.** Sur une colonne où chaque valeur est unique (un identifiant, un e-mail), le dictionnaire devient aussi gros que la colonne : on a payé la conversion pour rien.
- **La machine cloud oubliée allumée.** Le vrai coût du cloud n'est pas le prix affiché, c'est le GPU qui tourne pendant que tu dors. Tout le monde se fait avoir une fois.
- **Le projet qui ne marche que dans Colab.** Colab a des centaines de paquets préinstallés ; ta machine n'en a aucun. Sans `requirements.txt` avec des versions épinglées (`pandas==2.3.3`), ton code casse dans six mois chez quelqu'un d'autre.
- **Les prix appris par cœur.** Les tarifs des modèles bougent vite, presque toujours à la baisse, et les noms changent tous les quelques mois. Apprends à aller lire la page de tarifs et à refaire le calcul — c'est la méthode qui reste vraie, pas le nombre.

## Où aller lire les prix

| Ce que tu veux | Où | Tarifs |
|---|---|---|
| Un GPU gratuit tout de suite | [Google Colab](https://colab.research.google.com) | [gratuit / Pro](https://colab.research.google.com/signup) |
| Louer des machines | [Amazon SageMaker](https://aws.amazon.com/sagemaker/) · [Google Vertex AI](https://cloud.google.com/vertex-ai) | [SageMaker](https://aws.amazon.com/sagemaker/pricing/) · [Vertex AI](https://cloud.google.com/vertex-ai/pricing) |
| Appeler un modèle par API | [console Anthropic](https://console.anthropic.com) · [plateforme OpenAI](https://platform.openai.com) · [Google AI Studio](https://aistudio.google.com) | [Anthropic](https://www.anthropic.com/pricing) · [OpenAI](https://openai.com/api/pricing/) · [Google](https://ai.google.dev/pricing) |
| Un GPU à l'heure | un loueur de GPU | [exemple de grille](https://www.runpod.io/pricing) |

Le réflexe professionnel : **ouvrir la page de tarifs avant de créer le compte**, pas après la première facture.

## Grille de décision (à cocher avant de lancer)

Un point par ligne où tu peux répondre par un chiffre, pas par une impression.

| | 0 | 1 |
|---|---|---|
| Langage | « Python parce que c'est ce que je connais » | Je sais dire quelle bibliothèque fait le travail à ma place, et pourquoi ce n'est pas R |
| Vitesse | Je n'ai pas chronométré | J'ai un temps mesuré, et je sais si une version vectorisée existe |
| Mémoire | Je ne sais pas ce que pèsent mes données | J'ai un nombre de Mo, et je sais quelle colonne est la plus lourde |
| Lieu | « ça tournera bien quelque part » | Je sais combien d'heures, combien de Go, et si un GPU est nécessaire |
| Coût | Aucune idée | J'ai un coût en euros, obtenu par un essai sur 100 lignes |

| Score | Lecture |
|---|---|
| 0-1 | Tu vas découvrir les problèmes en production. Refais un essai sur 100 lignes avant de continuer |
| 2-3 | Correct : tu peux lancer, en surveillant la mémoire et la facture |
| 4 | Bon : le projet est dimensionné, les surprises seront petites |
| 5 | Excellent : tu peux expliquer chaque choix à quelqu'un d'autre, chiffres à l'appui |

## Ma fiche « mes outils » (à remplir)

Mon projet : ____________________________________

| Question | Ma réponse | Mon chiffre mesuré |
|---|---|---|
| 1 · Langage | ____________________ | bibliothèque principale : ____________________ · pourquoi pas R : ____________________ |
| 2 · Vitesse | boucle / vectorisé | boucle : ______ s · NumPy : ______ s · **×______ plus rapide** |
| 3 · Mémoire | dtypes à changer : ____________________ | avant : ______ Mo → après : ______ Mo (gain ______ %) |
| 4 · Lieu | ma machine / Colab / cloud | ______ Go de données · ______ heures · GPU : oui / non |
| 5 · Coût | modèle : petit / moyen / grand | essai sur 100 : ______ € → total estimé : ______ € |

Score : __ / 5

Ce que j'ai changé après avoir mesuré : ____________________________________

La chose que je croyais et qui était fausse : ____________________________________
