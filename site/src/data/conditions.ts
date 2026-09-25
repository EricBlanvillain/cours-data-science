/**
 * Deux blocs de cartes numérotées de la séance 1, rendus par CartesNumerotees.astro.
 * - bilanFrise : ferme la frise (motif « chiffre » : numéro, mot, chiffre, une ligne).
 * - conditions : « Est-ce que ça va durer ? » (motif « verdict » : numéro, mot, question, verdict).
 *   Le cuivre va sur les verdicts ouverts (`ouvert: true`) et nulle part ailleurs : ici la règle porte de l'information.
 * Règles de contenu : vocabulaire de collège en visible ; aucun chiffre daté qui vieillira mal ; chaque chiffre du repli
 * porte sa source et sa date de vérification (25/09/2026).
 */
export type CarteNumerotee = {
  numero: string;
  mot: string;
  chiffre?: string;
  ligne?: string;
  question?: string;
  verdict?: string;
  ouvert?: boolean;
  /** « pour aller plus loin » : 3 lignes au plus */
  repli: string[];
  sources: { titre: string; url: string }[];
  verifie: string;
};

export const bilanFrise: CarteNumerotee[] = [
  {
    numero: "01",
    mot: "Hivers",
    chiffre: "2",
    ligne: "Deux fois, les promesses n'ont pas été tenues et les financements ont disparu. Ça peut arriver de nouveau.",
    repli: [
      "Premier hiver, vers 1974–1980 : le rapport Lighthill (1973) juge les promesses non tenues, les financements britanniques puis américains se tarissent.",
      "Second hiver, vers 1987–1993 : le marché des machines Lisp s'effondre en 1987, le projet japonais de cinquième génération s'achève en 1992 sans avoir tenu ses objectifs.",
    ],
    sources: [
      { titre: "Lighthill report (Wikipedia)", url: "https://en.wikipedia.org/wiki/Lighthill_report" },
      { titre: "AI winter (Wikipedia)", url: "https://en.wikipedia.org/wiki/AI_winter" },
    ],
    verifie: "2026-09-25",
  },
  {
    numero: "02",
    mot: "Accélération",
    chiffre: "1",
    ligne: "Une seule architecture depuis 2017, le transformer, derrière les modèles de texte, d'image, de son et de code.",
    repli: [
      "Un transformer lit tous les mots d'une phrase en même temps et apprend lesquels regarder pour comprendre chacun (le mécanisme d'attention), au lieu de les lire un par un.",
      "Décrit en juin 2017 par huit chercheurs alors chez Google, dans « Attention Is All You Need ».",
    ],
    sources: [{ titre: "Vaswani et al., arXiv:1706.03762 (2017)", url: "https://arxiv.org/abs/1706.03762" }],
    verifie: "2026-09-25",
  },
];

export const conditions: CarteNumerotee[] = [
  {
    numero: "01",
    mot: "Capacité",
    question: "Est-ce que les machines vont continuer à progresser ?",
    verdict: "on ne sait pas",
    ouvert: true,
    repli: [
      "La durée d'une tâche qu'une IA mène seule, sans aide, double environ tous les 7 mois depuis 2019 (METR, mars 2025).",
      "Une courbe qui double ne double jamais indéfiniment ; la vraie question est ce qui arrive au temps de doublement.",
    ],
    sources: [
      { titre: "METR, « Measuring AI Ability to Complete Long Tasks » (mars 2025)", url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/" },
      { titre: "Kwa et al., arXiv:2503.14499", url: "https://arxiv.org/abs/2503.14499" },
    ],
    verifie: "2026-09-25",
  },
  {
    numero: "02",
    mot: "Demande",
    question: "Est-ce que les gens vont s'en servir ?",
    verdict: "oui, déjà",
    ouvert: false,
    repli: [
      "Quand une ressource devient bon marché, on en consomme plus, pas moins : c'est le paradoxe de Jevons, observé sur le charbon en 1865.",
      "Des machines à vapeur plus économes n'ont pas fait baisser la consommation de charbon britannique : elle a triplé d'ici 1900.",
    ],
    sources: [
      { titre: "Jevons, « The Coal Question » (1865), Yale Energy History", url: "https://energyhistory.yale.edu/w-stanley-jevons-the-coal-question-1865/" },
      { titre: "Jevons paradox (Wikipedia)", url: "https://en.wikipedia.org/wiki/Jevons_paradox" },
    ],
    verifie: "2026-09-25",
  },
  {
    numero: "03",
    mot: "Ressources",
    question: "Est-ce que l'électricité et les usines suivent ?",
    verdict: "c'est le frein",
    ouvert: true,
    repli: [
      "Les data centers du monde ont consommé environ 415 TWh d'électricité en 2024 (IEA) ; l'Allemagne entière en a produit 489 TWh la même année : à peu près autant.",
      "Un modèle se déploie en semaines, une usine de puces se construit en années : l'usine TSMC de l'Arizona, annoncée en mai 2020, n'a produit en volume qu'à la fin 2024.",
    ],
    sources: [
      { titre: "IEA, « Energy and AI » (avril 2025)", url: "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai" },
      { titre: "Fraunhofer ISE, production électrique allemande 2024", url: "https://www.ise.fraunhofer.de/en/press-media/press-releases/2025/public-electricity-generation-2024-renewable-energies-cover-more-than-60-percent-of-german-electricity-consumption-for-the-first-time.html" },
      { titre: "TSMC Arizona (Wikipedia)", url: "https://en.wikipedia.org/wiki/TSMC_Arizona" },
    ],
    verifie: "2026-09-25",
  },
  {
    numero: "04",
    mot: "Capture",
    question: "Qui va gagner l'argent ?",
    verdict: "incertain",
    ouvert: true,
    repli: [
      "Le moteur électrique arrive dans les usines dans les années 1880 ; les usines américaines ne deviennent vraiment plus productives que dans les années 1920.",
      "Le gain ne vient pas de l'outil, il vient de la réorganisation autour de l'outil : il a fallu reconstruire les ateliers autour de petits moteurs au lieu d'un arbre central.",
    ],
    sources: [{ titre: "Paul David, « The Dynamo and the Computer », American Economic Review 80(2), 1990", url: "https://ideas.repec.org/a/aea/aecrev/v80y1990i2p355-61.html" }],
    verifie: "2026-09-25",
  },
];
