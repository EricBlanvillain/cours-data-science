/**
 * La case « une affirmation, deux avis » de l'écran 1 de la séance 0. Pas de bonne réponse : les deux arguments
 * s'affichent côte à côte, même largeur, même poids, quel que soit le clic. Le cuivre marque l'affirmation tant que
 * rien n'est cliqué, plus rien ensuite. Chaque argument fait 30 mots au plus, vocabulaire de collège, aucun jargon.
 * Trois propositions ; `ACTIVE` choisit celle qui s'affiche (Eric tranche). Changer d'affirmation = changer un index.
 */
export type Affirmation = {
  texte: string;
  pour: string;     // « plutôt d'accord »
  contre: string;   // « plutôt pas d'accord »
  cloture: string;
};

export const affirmations: Affirmation[] = [
  {
    texte: "Il faudrait interdire l'IA pour les devoirs.",
    pour: "Si l'IA fait le devoir, on n'apprend pas : on rend un texte qu'on ne saurait pas refaire seul. Et le prof ne sait plus ce que tu sais vraiment.",
    contre: "Interdire n'empêche rien, ça cache. Mieux vaut apprendre à s'en servir : demander une explication, vérifier, refaire seul. C'est ce qu'on te demandera au travail.",
    cloture: "Les deux camps ont des arguments. On en reparlera au fil des séances, quand tu auras construit tes propres outils.",
  },
  {
    texte: "Une IA qui écrit un poème est créative.",
    pour: "Le poème est nouveau, personne ne l'avait écrit. Si on ne savait pas qui l'a fait, on le trouverait peut-être beau. Le résultat compte, pas la machine.",
    contre: "Elle recombine des millions de poèmes lus, sans rien vouloir dire. Créer, c'est avoir quelque chose à exprimer. La créativité est chez celui qui a écrit la consigne.",
    cloture: "Les deux camps ont des arguments. On en reparlera au fil des séances, quand tu auras fait écrire une machine toi-même.",
  },
  {
    texte: "Dans dix ans, une machine fera mieux que moi tout ce que j'apprends à l'école.",
    pour: "Elle calcule déjà plus vite, écrit plus vite, traduit mieux. La durée des tâches qu'une IA fait seule double tous les sept mois. Dix ans, c'est long.",
    contre: "Mieux à un exercice, peut-être. Mais l'école t'apprend à comprendre, choisir, travailler avec les autres. Et c'est toi qui décideras quoi lui demander.",
    cloture: "Les deux camps ont des arguments. On en reparlera au fil des séances, en regardant ce que les machines font vraiment.",
  },
];

/** index de l'affirmation affichée à l'écran 1 */
export const ACTIVE = 0;
