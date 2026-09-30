/**
 * Le quiz « IA ou pas ? » de l'écran 4 de la séance 0 (AccueilSeance0). Ici plutôt que dans le composant : la version
 * imprimée de la séance (src/data/impression.ts) en tire son corrigé.
 */
export const QUIZ_IA = [
  { id: "correcteur", titre: "Le correcteur orthographique du téléphone", ia: "oui",
    pourquoi: "Oui. Il a appris sur des millions de textes ce que tu vas probablement taper. C'est du machine learning, le même mécanisme que ChatGPT, en tout petit." },
  { id: "youtube", titre: "Les recommandations YouTube", ia: "oui",
    pourquoi: "Oui. Personne n'a écrit la règle « après cette vidéo, propose celle-là ». Un modèle l'a apprise sur ce que regardent des centaines de millions de personnes." },
  { id: "chatgpt", titre: "ChatGPT", ia: "oui",
    pourquoi: "Oui, dans sa version la plus récente : le deep learning. Il prédit le mot suivant, appris sur une bonne partie d'Internet. On le construit en miniature à la séance 9." },
  { id: "gps", titre: "Le GPS qui calcule l'itinéraire le plus rapide", ia: "oui",
    pourquoi: "Oui, mais rien n'est appris : un algorithme des années 1950, écrit à la main, cherche le plus court chemin. C'est de l'IA « classique », un raisonnement fait de règles." },
  { id: "snapchat", titre: "Un filtre Snapchat", ia: "oui",
    pourquoi: "Oui. Pour poser des oreilles de chat au bon endroit, il faut trouver le visage trente fois par seconde : c'est un réseau de neurones entraîné sur des millions de visages." },
  { id: "calculatrice", titre: "La calculatrice", ia: "non",
    pourquoi: "Non. Elle applique des règles fixes, et personne ne dit qu'une calculatrice « réfléchit ». C'est de l'informatique, très utile, mais pas de l'IA. Un tableur non plus." },
] as const;
