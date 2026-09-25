/**
 * Les 13 séances du parcours, pour la page d'accueil.
 * `slug` pointe vers une leçon MDX de src/content/lecons/ ; sans slug, la carte dit « notebooks seuls »
 * et son action mène au dossier GitHub de la séance (`dossier`, sous seances/ dans le dépôt).
 * Source de vérité du plan : plan-de-cours.md à la racine du dépôt.
 */
export type Seance = {
  numero: number;
  titre: string;
  niveau: "⭐" | "⭐⭐" | "⭐⭐⭐";
  bloc: 0 | 1 | 2 | 3 | 4;
  resume: string;
  /** nom du dossier sous seances/ dans le dépôt */
  dossier: string;
  slug?: string;
};

export const DEPOT = "https://github.com/EricBlanvillain/cours-data-science";

export const blocs: Record<Seance["bloc"], string> = {
  0: "Prise de contact",
  1: "Bloc 1 · Les bases solides",
  2: "Bloc 2 · Le métier de data scientist",
  3: "Bloc 3 · Projet Kaggle",
  4: "Bloc 4 · Comprendre et construire avec l'IA générative",
};

export const seances: Seance[] = [
  { numero: 0, dossier: "seance-00-faire-connaissance", titre: "Faire connaissance", niveau: "⭐", bloc: 0, resume: "Les cinq écrans d'accueil, le diagnostic Python, le brainstorm de projets, les trois comptes, le jeu du nombre mystère.", slug: "seance-00-faire-connaissance" },
  { numero: 1, dossier: "seance-01-introduction-ia", titre: "Introduction à l'intelligence artificielle", niveau: "⭐", bloc: 1, resume: "D'où vient l'IA, pourquoi elle explose maintenant, les trois cercles, la carte du machine learning, un premier réseau de neurones.", slug: "seance-01-introduction-ia" },
  { numero: 2, dossier: "seance-02-python-pour-la-data", titre: "Python pour la data", niveau: "⭐", bloc: 1, resume: "Rappels Python, pandas, premiers graphiques : 3 questions, 3 graphiques sur un dataset." },
  { numero: 3, dossier: "seance-03-sql-et-git", titre: "SQL et Git", niveau: "⭐", bloc: 1, resume: "SELECT, WHERE, GROUP BY, un premier JOIN, puis le premier projet en ligne sur GitHub." },
  { numero: 4, dossier: "seance-04-collecter-nettoyer", titre: "Collecter et nettoyer", niveau: "⭐⭐", bloc: 2, resume: "Une journée de data scientist : nettoyer un dataset abîmé en tenant un journal, récupérer des données par une API." },
  { numero: 5, dossier: "seance-05-analyser-raconter", titre: "Analyser et raconter", niveau: "⭐⭐", bloc: 2, resume: "L'analyse exploratoire, les pièges (corrélation, graphiques trompeurs), un mini-dashboard et un pitch." },
  { numero: 6, dossier: "seance-06-premier-modele", titre: "Premier modèle", niveau: "⭐⭐", bloc: 2, resume: "Apprentissage supervisé, train / test, le modèle bête à battre, arbre de décision et k plus proches voisins." },
  { numero: 7, dossier: "seance-07-kaggle-titanic-1", titre: "Kaggle Titanic 1/2", niveau: "⭐⭐", bloc: 3, resume: "Explorer, préparer, première soumission au classement." },
  { numero: 8, dossier: "seance-08-kaggle-titanic-2", titre: "Kaggle Titanic 2/2", niveau: "⭐⭐⭐", bloc: 3, resume: "Comparer 4 modèles, éviter les fuites, régler les hyperparamètres, présenter." },
  { numero: 9, dossier: "seance-09-comment-fonctionne-un-llm", titre: "Comment fonctionne un LLM", niveau: "⭐⭐", bloc: 4, resume: "Tokens, prédiction du mot suivant, température, hallucinations, LLM et SLM." },
  { numero: 10, dossier: "seance-10-parler-a-un-llm-par-le-code", titre: "Parler à un LLM par le code", niveau: "⭐⭐", bloc: 4, resume: "Une API, les trois rôles, le prompt système, l'historique, la sortie JSON, un chatbot à soi." },
  { numero: 11, dossier: "seance-11-rag", titre: "Le RAG", niveau: "⭐⭐⭐", bloc: 4, resume: "Donner de la mémoire à son IA : découper, vectoriser, chercher, injecter, répondre." },
  { numero: 12, dossier: "seance-12-agents-et-projet-final", titre: "Agents et projet final", niveau: "⭐⭐⭐", bloc: 4, resume: "Un agent avec trois outils, les bonnes pratiques, le portfolio et la présentation finale." },
];
