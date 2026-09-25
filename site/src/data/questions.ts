/**
 * Exemples du quiz « classification ou régression ». À éditer librement : un objet par question.
 * `reponse` : "classification" (la réponse est une catégorie) ou "regression" (la réponse est un nombre).
 */
export type Question = {
  texte: string;
  reponse: "classification" | "regression";
  pourquoi: string;
};

export const questions: Question[] = [
  { texte: "Quelle température fera-t-il demain ?", reponse: "regression", pourquoi: "La réponse est un nombre sur une échelle continue : 14,5 °C, 22 °C… Entre deux valeurs, il y en a toujours une autre." },
  { texte: "Ce mail est-il un spam ?", reponse: "classification", pourquoi: "La réponse est l'une de deux cases : spam ou pas spam. Pas de « à moitié spam »." },
  { texte: "Combien de vues fera cette vidéo ?", reponse: "regression", pourquoi: "On prédit une quantité : 300, 12 000, 2 millions. La bonne réponse peut être « pas loin »." },
  { texte: "Cette photo montre-t-elle un chat ?", reponse: "classification", pourquoi: "Oui ou non : deux catégories. Avec chat, chien, lapin, on aurait trois catégories, c'est toujours une classification." },
  { texte: "À quel prix se vendra cet appartement ?", reponse: "regression", pourquoi: "Un montant en euros : un nombre, sur une échelle continue." },
  { texte: "Ce passager du Titanic a-t-il survécu ?", reponse: "classification", pourquoi: "Survécu ou non : c'est exactement la question du projet Kaggle des séances 7 et 8." },
  { texte: "Quel genre musical est ce morceau ?", reponse: "classification", pourquoi: "Rock, jazz, rap… : on choisit une étiquette dans une liste, même si la liste est longue." },
  { texte: "Dans combien de minutes arrivera le bus ?", reponse: "regression", pourquoi: "Une durée : 3 minutes, 7 minutes et demie. Un nombre, pas une case." },
];
