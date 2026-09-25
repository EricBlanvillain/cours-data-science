# Glossaire

Les mots du parcours, dans l'ordre où on les rencontre.

## Bloc 0 · Les outils (séance 0)

| Terme | Définition |
|---|---|
| Notebook | Un document où le code s'exécute cellule par cellule, avec le résultat affiché sous chaque cellule. Google Colab en est une version dans le navigateur. |
| Cellule | Un morceau de notebook : quelques lignes de code ou du texte. Maj + Entrée l'exécute. |
| Colab | Google Colab, un service gratuit pour écrire et exécuter du Python dans le navigateur. Un GPU peut être demandé (menu *Exécution*), sans garantie d'en obtenir un aux heures chargées : les notebooks des séances 9 à 12 ont un repli sans GPU. |
| Variable | Une boîte avec un nom qui contient une valeur : `niveau = 15`. |
| Fonction | Un bout de code réutilisable avec un nom, qui prend des entrées et renvoie un résultat. |

## Bloc 1 · Les bases solides (séances 1 à 3)

| Terme | Définition |
|---|---|
| Intelligence artificielle | Tout programme qui imite une capacité humaine, que ce soit avec des règles écrites à la main, du calcul ou de l'apprentissage. |
| Machine learning | La machine trouve la règle toute seule à partir d'exemples, au lieu qu'un humain l'écrive. |
| Deep learning | Du machine learning avec des réseaux de neurones à beaucoup de couches. C'est ce qui a permis de reconnaître les images, la voix, le texte. |
| IA générative | Du deep learning qui produit du nouveau contenu : texte, image, son, code. ChatGPT, Claude, Mistral, les générateurs d'images. |
| Réseau de neurones | Un modèle fait de couches de petits calculs reliés entre eux, dont les réglages s'ajustent pendant l'apprentissage. |
| Prompt | Ce que tu écris à un modèle. Un bon prompt donne le contexte, un rôle, une tâche précise, un format et un exemple. |
| CSV | Un fichier texte qui contient un tableau : une ligne par ligne du tableau, les colonnes séparées par des virgules. |
| DataFrame | Le tableau de pandas : des lignes, des colonnes nommées, et des méthodes pour filtrer, trier, regrouper. |
| pandas | La bibliothèque Python qui manipule des tableaux de données. |
| matplotlib | La bibliothèque Python qui dessine les graphiques. |
| groupby | Faire des paquets selon une colonne, puis calculer quelque chose dans chaque paquet : une moyenne par type, par exemple. |
| Nuage de points | Un graphique avec un point par ligne du tableau, une colonne en x et une autre en y, pour voir si elles bougent ensemble. |
| Histogramme | Un graphique qui compte combien de lignes tombent dans chaque tranche de valeurs : la répartition d'une colonne. |
| SQL | Le langage pour poser des questions à une base de données : `SELECT … FROM … WHERE …`. |
| Git / GitHub | Git garde l'historique des versions d'un projet ; GitHub l'héberge en ligne. Les 4 commandes : add, commit, push, pull. |

## Bloc 2 · Le métier de data scientist (séances 4 à 6)

| Terme | Définition |
|---|---|
| Valeur manquante | Une case vide dans le tableau. On la retire, ou on la remplit avec une valeur raisonnable comme la médiane. |
| Encoder | Transformer du texte en nombres pour qu'un modèle puisse s'en servir : female devient 1, male devient 0. |
| API | Une porte d'entrée pour demander des données ou un service à un programme distant, par une URL. PokéAPI, Open-Meteo, l'API d'un LLM. |
| Corrélation | Deux colonnes qui bougent ensemble : quand l'une monte, l'autre monte (ou descend) aussi. Mesurée de -1 à 1 par `df.corr()`. Une corrélation n'est pas une cause : les ventes de glaces et les coups de soleil montent ensemble parce que c'est l'été. |
| Dashboard | Un tableau de bord : plusieurs graphiques sur une même page, choisis pour répondre aux questions de quelqu'un qui ne lira pas le notebook. Séance 5 : plusieurs graphiques matplotlib sur une même figure. |
| Apprentissage supervisé | On montre au modèle des exemples avec la bonne réponse, et il cherche une règle qui relie les deux. |
| Classification | Deviner une catégorie : spam ou pas, quelle espèce de manchot. |
| Régression | Deviner un nombre : un prix, un nombre de vues. |
| X et y | X, ce que la machine voit (les mesures). y, ce qu'elle doit deviner (la réponse). |
| Train / test | On coupe les données en deux : une partie pour apprendre, une partie cachée pour vérifier que le modèle a compris et pas appris par cœur. |
| Modèle bête (baseline) | Le modèle le plus simple possible, à battre avant tout : répondre toujours la classe la plus fréquente, ou la moyenne. Si ton modèle ne fait pas mieux, il n'a rien appris. |
| Exactitude (accuracy) | La part de bonnes réponses sur les données cachées : bonnes réponses / toutes les réponses. C'est ce que renvoie `modele.score` en classification. Trompeuse quand une classe est rare : « jamais légendaire » a 92 % d'exactitude et ne trouve aucun légendaire. |
| Précision | Parmi les cas que le modèle a déclarés positifs (« légendaire », « survivant »), la part qui l'est vraiment. Répond à : quand il dit oui, peut-on le croire ? Ce n'est pas l'exactitude. |
| Rappel | Parmi les vrais positifs, la part que le modèle retrouve. Répond à : en laisse-t-il passer ? Précision et rappel se paient l'un l'autre ; on règle le seuil selon ce qui coûte le plus cher (séance 8, projet A2). |
| Arbre de décision | Un modèle qui pose des questions en cascade sur les mesures jusqu'à une réponse. On peut le lire. |
| k plus proches voisins | Un modèle sans règle apprise : pour deviner un point, on regarde les k points connus les plus proches et on vote (ou on fait la moyenne, en régression). Il compare des distances, donc les colonnes doivent être à la même échelle (`StandardScaler`, ajusté sur le train). k est un hyperparamètre : petit, il apprend par cœur ; grand, il lisse tout. |
| Sur-apprentissage | Un modèle trop compliqué qui connaît ses exemples par cœur et se trompe sur les nouveaux. Parfait en entraînement, décevant sur le test. |
| Hyperparamètre | Un réglage choisi par toi, que le modèle n'apprend pas : la profondeur d'un arbre, le nombre de voisins. |
| scikit-learn | La bibliothèque Python de machine learning : des modèles prêts à entraîner avec fit et à évaluer avec score. |

## Bloc 3 · Projet Kaggle (séances 7 et 8)

| Terme | Définition |
|---|---|
| Kaggle | La plateforme où les data scientists partagent des jeux de données et participent à des compétitions avec un classement. |
| Forêt aléatoire | Cent arbres de décision entraînés sur des morceaux différents des données, qui votent. Moins d'erreurs et moins de sur-apprentissage qu'un arbre seul. |
| Validation croisée | Au lieu d'une seule coupe train / test, on en fait 5 différentes et on fait la moyenne des scores. Plus fiable, surtout avec peu de données. |
| GridSearch | Essayer toutes les combinaisons d'une grille de réglages (profondeur 3, 5, 8 × 50, 100, 200 arbres…) en validation croisée, et garder la meilleure. `GridSearchCV` dans scikit-learn. |
| Fuite de données | Quand une information qui « contient la réponse » se glisse dans X, ou quand la préparation utilise les données de test. Le score est trop beau, et faux. |
| Importance des variables | Pour un arbre ou une forêt, la part de chaque colonne dans les décisions. Dit ce que le modèle regarde vraiment. |
| Soumission | Le fichier `submission.csv` envoyé à Kaggle : une prédiction par passager du fichier test, qui donne un score au classement. |

## Bloc 4 · L'IA générative (séances 9 à 12)

| Terme | Définition |
|---|---|
| Token | Un morceau de mot transformé en nombre. Un modèle de langage ne lit que des tokens. Le découpage dépend du modèle : avec celui des modèles GPT, « manchots » fait trois tokens (man · ch · ots) et un mot anglais courant n'en fait souvent qu'un. |
| LLM | Large Language Model : un modèle de langage à des dizaines ou des centaines de milliards de paramètres, trop gros pour un ordinateur personnel. On l'utilise à distance, par une API. GPT, Claude, Mistral Large. |
| SLM | Small Language Model : un modèle assez petit pour tourner sur un ordinateur ou un téléphone. Moins doué, mais gratuit et privé. |
| Température | Le réglage du hasard quand le modèle choisit le token suivant. 0 : toujours le plus probable, réponses stables. Élevée : plus de surprise, plus d'erreurs. |
| Hallucination | Une réponse fausse dite avec assurance. Le modèle produit des mots probables, pas des faits vérifiés. |
| Prompt système | Les consignes permanentes données au modèle : le rôle, le ton, les règles. |
| Rôles (system / user / assistant) | Les trois étiquettes des messages envoyés au modèle : le cadre, la question, la réponse. L'historique de la conversation est la liste de ces messages. |
| JSON | Un format texte pour des données structurées (`{"question": "...", "choix": [...]}`), que Python lit avec `json.loads`. On le demande au modèle pour réutiliser sa réponse dans un programme. |
| Embedding | Un texte transformé en vecteur de nombres, de façon que deux textes proches par le sens donnent des points proches dans l'espace. |
| Similarité cosinus | La mesure de proximité entre deux embeddings, de -1 à 1. Proche de 1 : même sens. C'est elle qui classe les passages dans un RAG. |
| Chunk | Un morceau de document (quelques centaines de mots) découpé pour être vectorisé et retrouvé séparément. |
| RAG | Retrieval-Augmented Generation : donner ses notes au modèle avant de poser la question. Cinq étapes : découper les documents en chunks, les vectoriser (embeddings), chercher les passages les plus proches de la question (similarité cosinus), les injecter dans le prompt, laisser le modèle répondre. Le modèle n'apprend rien : il lit. |
| Agent | Un programme en boucle autour d'un LLM : le modèle choisit un outil à appeler, le code l'exécute, le modèle lit le résultat et recommence jusqu'à pouvoir répondre. Le LLM décide, le code agit. Séance 12 : trois outils, sans framework. |
| Outil | Une fonction Python (calculatrice, recherche dans un fichier, RAG) que l'agent peut appeler. Décrite dans le prompt système avec son nom et ses arguments. |
| Fenêtre de contexte | Le nombre maximum de tokens que le modèle peut lire d'un coup. Au-delà, il oublie le début. |
