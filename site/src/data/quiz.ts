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
};
