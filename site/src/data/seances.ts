/**
 * Les 17 séances du parcours, pour la page d'accueil, la barre latérale et la page d'export.
 * `slug` pointe vers une leçon MDX de src/content/lecons/ ; sans slug, la carte dit « notebooks seuls »
 * et son action mène au dossier GitHub de la séance (`dossier`, sous seances/ dans le dépôt).
 * Source de vérité du plan : plan-de-cours.md à la racine du dépôt.
 */
export type Seance = {
  numero: number;
  titre: string;
  niveau: "★" | "★★" | "★★★";
  bloc: 0 | 1 | 2 | 3 | 4 | 5;
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
  5: "Clôture",
};

export const seances: Seance[] = [
  { numero: 0, dossier: "seance-00-faire-connaissance", titre: "Faire connaissance", niveau: "★", bloc: 0, resume: "Les écrans d'accueil, Python répond, un petit bilan de ce que tu sais déjà, le brainstorm de projets, les trois comptes.", slug: "seance-00-faire-connaissance" },
  { numero: 1, dossier: "seance-01-introduction-ia", titre: "Introduction à l'intelligence artificielle", niveau: "★", bloc: 1, resume: "D'où vient l'IA, pourquoi elle explose maintenant, les trois cercles, la carte du machine learning, un premier réseau de neurones.", slug: "seance-01-introduction-ia" },
  { numero: 2, dossier: "seance-02-python-pour-la-data", titre: "Python pour la data", niveau: "★", bloc: 1, resume: "Rappels Python, pandas, premiers graphiques : 3 questions, 3 graphiques sur un dataset.", slug: "seance-02-python-pour-la-data" },
  { numero: 3, dossier: "seance-03-sql-et-git", titre: "SQL", niveau: "★", bloc: 1, resume: "Où une appli range ses données : SELECT, WHERE, GROUP BY, un premier JOIN, et la même question posée en SQL et en pandas.", slug: "seance-03-sql-et-git" },
  { numero: 4, dossier: "seance-04-collecter-nettoyer", titre: "Nettoyer les données", niveau: "★★", bloc: 2, resume: "Une journée de data scientist : réparer un dataset abîmé, une étape à la fois, en tenant le journal de chaque correction.", slug: "seance-04-collecter-nettoyer" },
  { numero: 5, dossier: "seance-05-git-github", titre: "Git et GitHub", niveau: "★", bloc: 2, resume: "Sauvegarder son travail en versions : status, add, commit, log, diff, restore, push, pull, puis ses notebooks en ligne sur GitHub.", slug: "seance-05-git-github" },
  { numero: 6, dossier: "seance-06-collecter-api", titre: "Collecter avec une API", niveau: "★★", bloc: 2, resume: "Demander des données à un site : une URL, du JSON, un tableau, des paramètres, et un plan B quand ça rate.", slug: "seance-06-collecter-api" },
  { numero: 7, dossier: "seance-07-analyser", titre: "Analyser", niveau: "★★", bloc: 2, resume: "L'analyse exploratoire comme une enquête : tendance, anomalie, corrélation, et les trois pièges à déjouer.", slug: "seance-07-analyser" },
  { numero: 8, dossier: "seance-08-raconter", titre: "Raconter", niveau: "★★", bloc: 2, resume: "Des titres qui répondent, des graphiques Plotly, un tableau de bord, et un pitch en deux minutes pour un client.", slug: "seance-08-raconter" },
  { numero: 9, dossier: "seance-09-premier-modele", titre: "Premier modèle", niveau: "★★", bloc: 2, resume: "Apprentissage supervisé, train / test, le modèle bête à battre, arbre de décision et k plus proches voisins.", slug: "seance-09-premier-modele" },
  { numero: 10, dossier: "seance-10-kaggle-titanic-1", titre: "Kaggle Titanic 1/2", niveau: "★★", bloc: 3, resume: "Explorer, préparer, première soumission au classement.", slug: "seance-10-kaggle-titanic-1" },
  { numero: 11, dossier: "seance-11-kaggle-titanic-2", titre: "Kaggle Titanic 2/2", niveau: "★★★", bloc: 3, resume: "Comparer 4 modèles, éviter les fuites, régler les hyperparamètres, présenter.", slug: "seance-11-kaggle-titanic-2" },
  { numero: 12, dossier: "seance-12-comment-fonctionne-un-llm", titre: "Comment fonctionne un LLM", niveau: "★★", bloc: 4, resume: "Tokens, prédiction du mot suivant, température, hallucinations, LLM et SLM.", slug: "seance-12-comment-fonctionne-un-llm" },
  { numero: 13, dossier: "seance-13-parler-a-un-llm-par-le-code", titre: "Parler à un LLM par le code", niveau: "★★", bloc: 4, resume: "Une API, les trois rôles, le prompt système, l'historique, la sortie JSON, un chatbot à soi.", slug: "seance-13-parler-a-un-llm-par-le-code" },
  { numero: 14, dossier: "seance-14-rag", titre: "Le RAG", niveau: "★★★", bloc: 4, resume: "Donner de la mémoire à son IA : découper, vectoriser, chercher, injecter, répondre.", slug: "seance-14-rag" },
  { numero: 15, dossier: "seance-15-agents", titre: "Les agents", niveau: "★★★", bloc: 4, resume: "Un modèle qui agit : des outils Python, une boucle, ce qui rate avec un petit modèle, et les bonnes pratiques avec l'IA.", slug: "seance-15-agents" },
  { numero: 16, dossier: "seance-16-projet-final", titre: "Projet final et présentation", niveau: "★★★", bloc: 5, resume: "Le portfolio GitHub de quatre projets, le README d'accueil, et la présentation de trois minutes devant les invités.", slug: "seance-16-projet-final" },
];
