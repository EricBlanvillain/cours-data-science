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
      question: "« Les Pokémon rapides sont-ils fragiles ? » Quel graphique ?",
      options: ["Des barres", "Un nuage de points", "Un histogramme", "Un camembert"],
      bonne: 1,
      explication: "Deux nombres par Pokémon, vitesse et défense : un point chacun. Si le nuage descendait nettement, les rapides seraient fragiles. Des barres comparent des catégories, un histogramme regarde une seule valeur.",
    },
    {
      question: "Un graphique en barres, sans titre ni nom d'axe, montre trois barres de hauteurs différentes. Que peut-on en conclure ?",
      options: ["Que la première catégorie est la meilleure", "Que les données sont fausses", "Rien : on ne sait ni ce qui est compté, ni dans quelle unité", "Qu'il faut plus de barres"],
      bonne: 2,
      explication: "Sans titre ni axes, on ne sait pas à quelle question le graphique répond, ni ce que mesure la hauteur. C'est la règle de la séance : pas de graphique sans titre ni axes.",
    },
  ],
};
