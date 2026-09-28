/**
 * Le mini-quiz de fin de leçon, une entrée par séance. Quatre questions, écrites depuis le contenu réel de la page.
 * Ton : question courte, options plausibles, explication qui apprend quelque chose au lieu de dire « bravo ».
 * `bonne` est l'index de la bonne option. Une séance sans entrée n'a pas de quiz (la séance 0 se termine sur son notebook).
 * Réserve pour les séances 2 à 12 : les 20 questions de l'ancien site (introductioniagen/site/src/content/quiz.ts),
 * à réécrire séance par séance, jamais à porter mécaniquement.
 */
export type QuestionQuiz = {
  question: string;
  options: string[];
  bonne: number;
  explication: string;
};

export const quiz: Record<number, QuestionQuiz[]> = {
  1: [
    {
      question: "Sur la frise, pourquoi 2012 est-elle la vraie rupture, plutôt que 1957 ou 2022 ?",
      options: [
        "C'est l'année où l'idée du neurone artificiel est trouvée",
        "Un réseau de neurones gagne enfin, grâce aux cartes graphiques et à une grande base d'images",
        "C'est la sortie de ChatGPT",
        "Les chercheurs inventent le transformer",
      ],
      bonne: 1,
      explication: "L'idée date de 1957, ChatGPT de 2022 et le transformer de 2017. En 2012, AlexNet gagne le concours ImageNet, entraîné sur deux cartes de jeu vidéo : les moyens rattrapent enfin l'idée.",
    },
    {
      question: "Pourquoi une carte graphique entraîne-t-elle un réseau de neurones plus vite qu'un processeur ?",
      options: [
        "Ses cœurs sont plus rapides un par un",
        "Elle a plus de mémoire",
        "Elle a des milliers de petits cœurs qui font la même opération en même temps",
        "Elle est branchée directement à Internet",
      ],
      bonne: 2,
      explication: "Ses cœurs sont plus lents et plus bêtes pris un par un. Mais un réseau de neurones fait des millions de fois la même multiplication, et ça, des milliers de cœurs identiques le font d'un coup.",
    },
    {
      question: "Un GPS qui calcule l'itinéraire le plus rapide, où le places-tu dans les trois cercles ?",
      options: [
        "Dans le deep learning : il utilise un réseau de neurones",
        "Dans le machine learning : il apprend des trajets",
        "Dans l'intelligence artificielle seulement : des règles écrites à la main, rien d'appris",
        "Nulle part : ce n'est pas de l'IA",
      ],
      bonne: 2,
      explication: "Il imite une capacité humaine, trouver un chemin, donc c'est de l'IA. Mais l'algorithme est écrit à la main, sans exemples : ni machine learning, ni deep learning. Le grand cercle, pas les petits.",
    },
    {
      question: "Dans un réseau de neurones, qu'est-ce qui change pendant l'apprentissage ?",
      options: [
        "Le nombre de couches",
        "Les poids des liens entre neurones, un peu à chaque erreur",
        "Les données d'entrée",
        "La question posée au réseau",
      ],
      bonne: 1,
      explication: "L'architecture et les données sont fixées avant. Apprendre, c'est régler les poids : à chaque exemple raté, on les décale un peu, des millions de fois, jusqu'à ce que la sortie colle aux exemples.",
    },
  ],
  2: [
    {
      question: "Le notebook affiche (800, 13) quand tu tapes df.shape. Ça veut dire quoi ?",
      options: ["800 colonnes et 13 lignes", "800 lignes et 13 colonnes", "800 Pokémon dont 13 légendaires", "Une erreur : il manque une colonne"],
      bonne: 1,
      explication: "shape donne toujours (lignes, colonnes) dans cet ordre. 800 Pokémon, 13 mesures par Pokémon. Les légendaires, eux, sont 65 : ça se compte avec un filtre, pas avec shape.",
    },
    {
      question: "Tu veux savoir quel type de Pokémon a la meilleure vitesse moyenne. Quelle ligne ?",
      options: ["df.sort_values(\"Speed\")", "df[\"Type 1\"].value_counts()", "df.groupby(\"Type 1\")[\"Speed\"].mean()", "df[df[\"Speed\"] > 100]"],
      bonne: 2,
      explication: "« Par type » appelle groupby : un tas par type, puis la moyenne de la vitesse dans chaque tas. Trier donne les Pokémon un par un, value_counts compte les types, le filtre garde les rapides sans les regrouper.",
    },
    {
      question: "Quelle ligne garde les Pokémon à la fois rapides (Speed > 100) et forts (Attack > 100) ?",
      options: ["df[df[\"Speed\"] > 100 and df[\"Attack\"] > 100]", "df[(df[\"Speed\"] > 100) & (df[\"Attack\"] > 100)]", "df[df[\"Speed\"] > 100 & df[\"Attack\"] > 100]", "df.sort_values([\"Speed\", \"Attack\"])"],
      bonne: 1,
      explication: "pandas relie deux conditions avec &, chacune entre ses parenthèses. Sans elles, Python calcule d'abord 100 & df[\"Attack\"] et la ligne plante ; « and » ne sait pas comparer deux colonnes entières et plante aussi ; sort_values range, il ne filtre pas. La bonne ligne garde 38 Pokémon.",
    },
    {
      question: "Un graphique en barres, sans titre ni nom d'axe, montre trois barres de hauteurs différentes. Que peut-on en conclure ?",
      options: ["Que la première catégorie est la meilleure", "Que les données sont fausses", "Rien : on ne sait ni ce qui est compté, ni dans quelle unité", "Qu'il faut plus de barres"],
      bonne: 2,
      explication: "Sans titre ni axes, on ne sait pas à quelle question le graphique répond, ni ce que mesure la hauteur. C'est la règle de la séance : pas de graphique sans titre ni axes.",
    },
  ],
  3: [
    {
      question: "Tu veux les 3 Pokémon Feu les plus rapides. Quelle partie de la requête garde seulement les Pokémon Feu ?",
      options: ["SELECT nom, vitesse", "WHERE type1 = 'Fire'", "ORDER BY vitesse DESC", "LIMIT 3"],
      bonne: 1,
      explication: "SELECT choisit les colonnes, WHERE les lignes, ORDER BY l'ordre, LIMIT le nombre. Sans WHERE, la requête renverrait les trois plus rapides de tous les types, DeoxysSpeed Forme en tête avec 180.",
    },
    {
      question: "En pandas tu écrirais df.groupby(\"type1\")[\"total\"].mean(). En SQL ?",
      options: ["SELECT type1, total FROM pokemon ORDER BY total", "SELECT AVG(total) FROM pokemon WHERE type1", "SELECT type1, AVG(total) FROM pokemon GROUP BY type1", "SELECT COUNT(*) FROM pokemon GROUP BY total"],
      bonne: 2,
      explication: "GROUP BY fait les tas, un par type ; AVG calcule la moyenne dans chaque tas. Les deux langues donnent le même classement, Dragon en tête avec 550,5.",
    },
    {
      question: "Un JOIN entre pokemon (800 lignes) et types (10 types) renvoie 466 lignes. Où sont passés les 334 autres Pokémon ?",
      options: ["SQL les a perdus par erreur", "Leur type n'est pas dans la table types : un JOIN simple les laisse tomber", "Ce sont les Pokémon légendaires", "Ils étaient en double"],
      bonne: 1,
      explication: "Bug, Normal, Poison et cinq autres types n'ont pas de ligne dans types, donc pas de correspondance. Un JOIN simple ne garde que ce qui se recolle ; LEFT JOIN garderait les 800, avec des cases vides.",
    },
    {
      question: "Dans quel ordre tapes-tu ces trois commandes pour envoyer ton notebook sur GitHub ?",
      options: ["commit, add, push", "add, commit, push", "push, add, commit", "add, push, commit"],
      bonne: 1,
      explication: "add choisit les fichiers, commit crée le point de sauvegarde avec son message, push envoie les commits sur GitHub. Un push avant le commit n'a rien de nouveau à envoyer.",
    },
  ],
  4: [
    {
      question: "Dans le tableau abîmé, « fire », « Fire » suivi d'un espace, et « Fire » comptent comme trois types différents. Quelle ligne en fait un seul ?",
      options: ["df[\"Type 1\"].str.strip().str.capitalize()", "df[\"Type 1\"].dropna()", "df.drop_duplicates()", "df[\"Type 1\"].astype(float)"],
      bonne: 0,
      explication: "strip enlève l'espace invisible au bout, capitalize remet une majuscule devant et des minuscules derrière. Le tableau passe de 56 valeurs à 30 ; les lettres inversées comme « Fier » demandent ensuite un dictionnaire de corrections.",
    },
    {
      question: "Pour convertir la colonne HP, le notebook écrit astype(float) et pas astype(int). Pourquoi ?",
      options: ["Les points de vie ont des virgules", "Il reste des cases vides, et NaN ne rentre pas dans une colonne d'entiers", "float est plus rapide", "int ne sait pas lire le texte"],
      bonne: 1,
      explication: "NaN est lui-même un nombre à virgule : une colonne d'entiers ne peut pas le contenir. On passe par float, on remplit les vides, et seulement ensuite on repasse en int.",
    },
    {
      question: "Après réparation, le HP moyen vaut 69,1 contre 69,3 dans le tableau propre. Qu'est-ce que ça veut dire ?",
      options: ["Le nettoyage a raté", "Il manque des Pokémon", "Les 40 cases remplies par 65 ne valent pas les vraies valeurs effacées : la moyenne bouge un peu", "pandas arrondit mal"],
      bonne: 2,
      explication: "Remplir, c'est remplacer une valeur perdue par une valeur raisonnable, pas par la vraie. Un petit écart est normal ; ce qui compte, c'est que le journal dise d'où il vient.",
    },
    {
      question: "La PokéAPI renvoie data, un JSON. Quelle ligne donne le type de Pikachu ?",
      options: ["data[\"type\"]", "data[\"types\"][\"name\"]", "data[\"types\"][0][\"type\"][\"name\"]", "data.type"],
      bonne: 2,
      explication: "types est une liste (un Pokémon peut en avoir deux), d'où le [0] ; chaque élément est un dictionnaire qui contient type, lui-même un dictionnaire qui contient name. On descend niveau par niveau jusqu'à « electric ».",
    },
  ],
  5: [
    {
      question: "La corrélation entre la défense et la vitesse des Pokémon vaut 0,02. Qu'est-ce que ça veut dire ?",
      options: ["Les Pokémon rapides sont fragiles", "La vitesse ne dit presque rien de la défense", "La défense fait baisser la vitesse", "Il y a une erreur dans les données"],
      bonne: 1,
      explication: "Une corrélation proche de 0 veut dire qu'aucune direction ne se dégage : on trouve de tout, des lents solides, des rapides solides, des lents fragiles. Pour lire « les rapides sont fragiles », il faudrait une corrélation nettement négative.",
    },
    {
      question: "Blissey a 255 points de vie, bien au-delà de la limite de 125 de la boîte à moustaches. Que fais-tu de cette ligne ?",
      options: ["Je la supprime, c'est une erreur", "Je la remplace par la médiane", "Je la regarde de près : c'est peut-être la chose à raconter", "Je la cache dans le graphique"],
      bonne: 2,
      explication: "La règle des 1,5 écarts signale un suspect, pas un coupable. Blissey a vraiment 255 HP dans le jeu : une anomalie vraie est souvent le fait le plus intéressant du tableau.",
    },
    {
      question: "Quel titre donner au nuage « pourboire selon l'addition » dans ton tableau de bord ?",
      options: ["Pourboire vs addition", "Graphique 1", "Le pourboire suit l'addition", "Données Tips, colonnes total_bill et tip"],
      bonne: 2,
      explication: "Un titre de tableau de bord donne la réponse, pas le nom des colonnes : le client lit la conclusion avant même de regarder les points. Les autres titres l'obligent à tout décoder lui-même.",
    },
    {
      question: "Dans ton pitch, « mettre les meilleurs serveurs le dimanche soir », c'est quel temps ?",
      options: ["Le constat", "La preuve", "La recommandation", "La question"],
      bonne: 2,
      explication: "Le constat dit ce que tu as trouvé, avec un chiffre ; la preuve montre le graphique qui l'établit ; la recommandation dit au client quoi faire demain. Une action à mener, c'est toujours la recommandation.",
    },
  ],
  6: [
    {
      question: "Dans le tableau des manchots, quelle colonne est y ?",
      options: ["La longueur du bec", "Le poids", "L'espèce", "Toutes les mesures ensemble"],
      bonne: 2,
      explication: "y, c'est ce que la machine doit deviner : l'espèce. Les quatre mesures forment X, ce qu'elle voit. Pour la régression du poids, les rôles changent : le poids devient y.",
    },
    {
      question: "Un manchot a une nageoire de 215 mm et un bec épais de 15 mm. Que répond l'arbre ?",
      options: ["Adélie", "Chinstrap", "Gentoo", "L'arbre ne peut pas répondre"],
      bonne: 2,
      explication: "215 mm, c'est plus que 206,5 : on part à droite. Puis 15 mm d'épaisseur, c'est moins que 17,55 : la feuille Gentoo, où tombent 89 manchots d'entraînement, tous Gentoo.",
    },
    {
      question: "Le modèle répond juste sur 97,6 % des manchots cachés. Comment s'appelle ce pourcentage ?",
      options: ["La précision", "L'exactitude", "L'erreur moyenne", "Le rappel"],
      bonne: 1,
      explication: "La part de bonnes réponses s'appelle l'exactitude, accuracy en anglais. La précision existe aussi en machine learning, mais elle mesure autre chose ; l'erreur moyenne, elle, sert aux nombres.",
    },
    {
      question: "Les k plus proches voisins passent de 85,7 % à 98,8 % quand on met les mesures à la même échelle. Pourquoi ?",
      options: ["Le modèle a plus de données", "Le poids, en milliers de grammes, écrasait les longueurs en millimètres dans le calcul des distances", "On a changé la coupe train / test", "k a changé"],
      bonne: 1,
      explication: "k-NN compare des distances. Sans mise à l'échelle, 100 g d'écart pèsent autant que 100 mm, alors que les becs ne diffèrent que de quelques millimètres : le poids décidait presque seul.",
    },
  ],
  7: [
    {
      question: "Pourquoi ranger tout le nettoyage dans une seule fonction preparer() ?",
      options: ["Pour que le code soit plus court", "Pour appliquer exactement la même recette à train et à test", "Parce que Kaggle l'exige", "Pour aller plus vite"],
      bonne: 1,
      explication: "Le modèle apprend sur des colonnes préparées d'une certaine façon ; test doit arriver exactement pareil. L'erreur classique : nettoyer train à la main et oublier une étape sur test.",
    },
    {
      question: "Que garde la regex ,\\s*([^\\.]+)\\. dans le nom « Heikkinen, Miss. Laina » ?",
      options: ["Heikkinen", "Miss", "Laina", "Miss. Laina"],
      bonne: 1,
      explication: "Elle cherche une virgule, d'éventuels espaces, puis garde tout ce qui n'est pas un point, jusqu'au point : « Miss ». Les parenthèses marquent ce qu'on garde.",
    },
    {
      question: "Les cinq contrôles de la forêt donnent de 79,8 % à 85,5 %. Quel score annonces-tu ?",
      options: ["85,5 %, le meilleur", "79,8 %, le pire", "82,7 %, la moyenne des cinq", "Celui du premier contrôle"],
      bonne: 2,
      explication: "Chaque contrôle dépend du paquet tiré ; la moyenne des cinq est plus fiable qu'un seul. Annoncer le meilleur, ce serait choisir le sujet d'examen qui t'arrange.",
    },
    {
      question: "Pourquoi remplir les âges manquants avec l'âge médian du titre plutôt qu'avec 28 ans pour tout le monde ?",
      options: ["Parce que 28 ans est faux", "Parce qu'un petit garçon au titre « Master » recevrait 28 ans, et 177 passagers formeraient un pic artificiel", "Parce que la médiane est interdite", "Pour avoir moins de lignes"],
      bonne: 1,
      explication: "28 ans est bien l'âge médian du bateau, mais pas celui de chacun. Le titre donne un âge plausible : 3,5 ans pour un Master, 35 pour une Mrs.",
    },
  ],
  8: [
    {
      question: "L'arbre fait 82,3 % ± 2,2, la régression logistique 80,4 % ± 0,7. Lequel est le plus stable d'un paquet à l'autre ?",
      options: ["L'arbre, parce que sa moyenne est plus haute", "La régression logistique, parce que son écart-type est plus petit", "Les deux se valent", "On ne peut pas savoir"],
      bonne: 1,
      explication: "L'écart-type mesure combien le score varie d'un paquet à l'autre. Celui de la logistique bouge de moins d'un point, celui de l'arbre de plus de deux : sa moyenne est plus haute, mais moins sûre.",
    },
    {
      question: "Sans la variable Titre, la forêt passe seulement de 82,7 % à 82,0 %. Pourquoi si peu ?",
      options: ["Titre ne servait à rien", "Sex et Age portent presque la même information que Titre", "La forêt a ignoré la consigne", "Le score est faux"],
      bonne: 1,
      explication: "Un titre dit le sexe et, pour Master ou Miss, l'âge. Quand on le retire, le modèle retrouve l'essentiel dans les colonnes Sex et Age : une variable importante n'est pas forcément irremplaçable.",
    },
    {
      question: "Lequel de ces réglages est un hyperparamètre ?",
      options: ["Le seuil « nageoire ≤ 206,5 mm » trouvé par un arbre", "max_depth, la profondeur maximale de l'arbre", "Le score de validation croisée", "La colonne Survived"],
      bonne: 1,
      explication: "Un hyperparamètre se choisit avant l'entraînement, comme la profondeur maximale. Les seuils des questions, eux, le modèle les apprend tout seul pendant fit.",
    },
    {
      question: "Une grille de 4 profondeurs × 3 tailles de feuille, avec une validation croisée à 5 paquets : combien d'entraînements ?",
      options: ["12", "15", "20", "60"],
      bonne: 3,
      explication: "12 combinaisons, et chacune est entraînée 5 fois, une par paquet : 60 entraînements. C'est pour ça qu'une grille trop grande devient vite lente.",
    },
  ],
  9: [
    {
      question: "La même idée coûte 15 tokens en français et 12 en anglais. Pourquoi ?",
      options: ["Le français a plus de lettres", "Le découpage a été construit sur beaucoup plus de texte anglais : ses gros morceaux sont surtout des mots anglais", "Les accents comptent double", "C'est un hasard"],
      bonne: 1,
      explication: "Un tokenizer garde en un seul morceau les suites de lettres qu'il a le plus vues. Un mot français est plus souvent coupé en deux ou trois : la même phrase coûte plus de tokens, donc plus de calcul.",
    },
    {
      question: "Parti de « le », le bigramme écrit « le chat dort dans le chat dort dans le chat… ». Pourquoi tourne-t-il en rond ?",
      options: ["Il manque des phrases", "Il choisit toujours le mot le plus fréquent après le mot d'avant, et « dans » ramène toujours à « le »", "Le mot « chat » est interdit", "Il a trop de paramètres"],
      bonne: 1,
      explication: "Un bigramme ne regarde qu'un mot en arrière. Toujours prendre le plus fréquent l'enferme dans une boucle ; tirer au sort parmi les mots probables, c'est ce que règle la température.",
    },
    {
      question: "Trois fois la même question à température 0 : que se passe-t-il ?",
      options: ["Trois réponses différentes", "Trois fois la même réponse, le token le plus probable à chaque étape", "Le modèle refuse de répondre", "La réponse est plus juste"],
      bonne: 1,
      explication: "À température 0, il n'y a plus de tirage : le vrai modèle a répondu « Kitty » les trois fois. Plus haut, les réponses varient, parfois jusqu'à l'absurde.",
    },
    {
      question: "Avec le petit modèle du cours, dans Colab, où partent tes messages ?",
      options: ["Sur les serveurs d'une grande entreprise", "Nulle part : le modèle tourne dans ta session, tes données restent là", "Chez Hugging Face à chaque question", "Sur ton compte Google Drive"],
      bonne: 1,
      explication: "Le notebook télécharge le modèle une fois, puis tout se calcule dans ta session Colab. Avec l'API d'un gros modèle, au contraire, chaque message part sur le serveur de son éditeur.",
    },
  ],
  10: [
    {
      question: "Où ranges-tu la personnalité et les règles de ton chatbot ?",
      options: ["Dans le message user", "Dans le message system", "Dans le message assistant", "Dans le nom de la fonction"],
      bonne: 1,
      explication: "Le message system passe avant tout le reste et l'utilisateur ne le voit pas : c'est la fiche de poste. user, c'est toi ; assistant, ce que le modèle a déjà répondu.",
    },
    {
      question: "Ton chatbot se souvient de ton prénom au tour suivant. Comment ?",
      options: ["Le modèle a une mémoire", "Le programme renvoie toute la conversation à chaque tour", "Colab enregistre le prénom", "Le prénom est dans le prompt système"],
      bonne: 1,
      explication: "Le modèle repart de zéro à chaque appel. La classe Chatbot ajoute chaque message à sa liste et renvoie la liste entière : c'est elle, la mémoire.",
    },
    {
      question: "Le guide de Paris reçoit 47 tokens au premier tour et 285 au cinquième. Pourquoi ?",
      options: ["Les questions sont plus longues", "L'historique entier est renvoyé à chaque tour, et il grandit", "Le modèle ralentit", "Le prompt système change"],
      bonne: 1,
      explication: "Chaque tour ajoute une question et une réponse à ce qu'on renvoie. Une longue conversation coûte de plus en plus cher, et un petit modèle finit par perdre le fil.",
    },
    {
      question: "Pourquoi extraire_json garde-t-il seulement ce qui se trouve entre la première et la dernière accolade ?",
      options: ["Pour aller plus vite", "Parce que le modèle ajoute parfois du texte autour, qui ferait échouer json.loads", "Parce que JSON interdit les espaces", "Pour enlever les clés inutiles"],
      bonne: 1,
      explication: "« Voici le JSON : {…} » n'est pas du JSON valide. On isole la partie entre accolades, on essaie json.loads dans un try, et on redemande si ça rate.",
    },
  ],
  11: [
    {
      question: "Dans le dessin à deux axes, chat et camion ont une similarité cosinus de 0,24. Ça veut dire quoi ?",
      options: ["Ils sont presque identiques", "Leurs flèches partent dans des directions très différentes : ils ne parlent pas de la même chose", "Le camion est plus gros", "Il y a une erreur de calcul"],
      bonne: 1,
      explication: "La similarité cosinus regarde l'angle entre deux vecteurs : 1, même direction ; proche de 0, rien à voir. Chat et chien, eux, sont à 0,98.",
    },
    {
      question: "Pourquoi ne pas coller tout un livre de 300 pages dans le prompt, au lieu de chercher des passages ?",
      options: ["Le modèle refuse les livres", "Chaque token se paie, et un petit modèle se perd dans trop de texte", "Les livres sont protégés", "Le prompt système ne prend que des questions"],
      bonne: 1,
      explication: "Plus le prompt est long, plus il coûte, en temps ou en argent, et plus le modèle se disperse. Le RAG n'envoie que les quelques passages qui servent.",
    },
    {
      question: "« La carte qui fait piocher deux cartes » et « la carte Mouette » sont à 0,609 avec les embeddings. Pourquoi si proches ?",
      options: ["Elles ont beaucoup de mots en commun", "Le modèle d'embeddings rapproche les textes par leur sens, pas seulement par leurs mots", "Le mot « carte » compte double", "Par hasard"],
      bonne: 1,
      explication: "Seul « carte » est commun aux deux phrases. Le modèle d'embeddings a appris que des phrases de sens voisin donnent des vecteurs voisins ; TF-IDF, lui, ne voit que les mots.",
    },
    {
      question: "« Quelle est la capitale du Japon ? » obtient un meilleur score de 0,105, sous le seuil de 0,3. Que fait l'assistant ?",
      options: ["Il envoie quand même les passages au modèle", "Il répond « rien trouvé dans les documents » sans appeler le modèle", "Il cherche sur internet", "Il baisse le seuil"],
      bonne: 1,
      explication: "Sous le seuil, aucun passage ne parle vraiment de la question. Refuser avant d'appeler le modèle évite une réponse inventée et économise des tokens.",
    },
  ],
  12: [
    {
      question: "Pourquoi la calculatrice du notebook n'utilise-t-elle jamais eval() sur ce qu'écrit le modèle ?",
      options: ["eval est trop lent", "eval exécuterait n'importe quel code, même un ordre d'effacer des fichiers", "eval ne connaît pas les multiplications", "Python interdit eval"],
      bonne: 1,
      explication: "Le modèle, ou quelqu'un qui lui parle, peut écrire du code déguisé en calcul. calculer() lit l'expression avec ast et n'accepte que des nombres et + − × ÷ : un appel de fonction est refusé.",
    },
    {
      question: "Tu ajoutes un outil plus_rapide au dictionnaire OUTILS, mais l'agent ne l'appelle jamais. Qu'as-tu oublié ?",
      options: ["De redémarrer Colab", "De le décrire dans le prompt système : le modèle ne connaît que les outils qu'on lui présente", "De l'écrire en majuscules", "De baisser la température"],
      bonne: 1,
      explication: "Le dictionnaire sert à Python pour exécuter l'outil ; le modèle, lui, ne voit que le prompt système. Un outil qu'on ne lui décrit pas n'existe pas pour lui.",
    },
    {
      question: "Ton agent peut envoyer des mails. Quelle précaution prendre ?",
      options: ["Aucune, il sait ce qu'il fait", "Lui faire demander ton accord avant chaque envoi", "Lui donner plus d'outils", "Monter la température"],
      bonne: 1,
      explication: "Même un gros modèle se trompe. Pour les actions qu'on ne peut pas annuler, envoyer, payer, effacer, on garde un humain dans la boucle.",
    },
    {
      question: "Pendant ta présentation de trois minutes, que montres-tu dans la minute de démo ?",
      options: ["Le code de TF-IDF", "Ton projet en vrai : une question à ton assistant, un graphique ou ton score", "La liste des bibliothèques installées", "Rien, tu racontes"],
      bonne: 1,
      explication: "Les invités ne connaissent pas les outils : ce qui les convainc, c'est de voir le projet marcher, et même rater une fois, avec ce que tu en as compris.",
    },
  ],
};
