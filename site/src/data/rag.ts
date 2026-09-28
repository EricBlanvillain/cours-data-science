/**
 * Les sorties de la séance 11, toutes issues d'un vrai passage, le 28/09/2026, du RAG du notebook 11_rag.ipynb, sur les
 * règles de Sardine Express qu'il fournit (15 paragraphes, un paragraphe = un chunk) :
 *   modèle      Qwen/Qwen2.5-0.5B-Instruct, sur CPU, transformers 5.16.1, torch 2.14.0, Python 3.12.13
 *   embeddings  sentence-transformers 6.1.0, modèle paraphrase-multilingual-MiniLM-L12-v2 (le chemin de Colab,
 *               USE_MODEL à True) : 384 dimensions ; similarité cosinus de scikit-learn ; k = 3
 *   réglages    ceux du notebook : demander() à max_new_tokens=150, temperature=0.7 ; prompt système de rag() tel quel
 *   graine      transformers.set_seed(0) avant chaque appel au modèle
 *   repli       TF-IDF du notebook (scikit-learn, mots vides STOP_FR) : meilleur score 0 pour les deux questions hors sujet,
 *               0,34 à 0,58 pour les questions sur le jeu ; il retrouve le paragraphe 15 pour « Qui a créé le jeu ? »
 * Les numéros de paragraphe vont de 1 à 15, dans l'ordre des règles. Un autre passage peut donner d'autres phrases.
 */
export const MODELE = "Qwen/Qwen2.5-0.5B-Instruct";
export const EMBEDDINGS = { nom: "paraphrase-multilingual-MiniLM-L12-v2", dimensions: 384 };
export const nbParagraphes = 15;
export const mots2d = {"chat": [0.9, 0.2], "chien": [0.9, 0.4], "lion": [0.95, 0.9], "souris": [0.85, 0.05], "pomme": [0.3, 0.1], "banane": [0.3, 0.15], "pastèque": [0.35, 0.5], "vélo": [0.05, 0.4], "voiture": [0.05, 0.7], "camion": [0.02, 0.95]};
export const sim2d = {"chat_chien": 0.98, "chat_camion": 0.237, "pomme_banane": 0.99};
export const mouette = {
  question: "Que se passe-t-il quand on pose une carte Mouette ?",
  sansRag: "Si on pose une carte Mouette dans Sardine Express, c'est qu'on a trouvé une carte d'argent et il est temps de commencer à jouer la partie !",
  toutLeTexte: "Si un joueur pose une carte Mouette, le joueur suivant doit alors poser 2 cartes et passer son tour.",
  avecRag: "Quand on pose une carte Mouette, le joueur suivant doit piocher 2 cartes et passer son tour.",
  verite: "Le joueur suivant pioche 2 cartes et passe son tour.",
  passages: [{"n": 6, "debut": "La carte Mouette peut être posée sur n'importe quelle…", "score": 0.616}, {"n": 3, "debut": "Au début de la partie, on mélange toutes les cartes. Chaque…", "score": 0.51}, {"n": 9, "debut": "Le premier joueur qui n'a plus de cartes gagne la manche…", "score": 0.51}],
};
export const meilleursScores = [
  { question: "Que fait la carte Mouette ?", score: 0.616, surLeJeu: true },
  { question: "Combien de temps dure une partie ?", score: 0.373, surLeJeu: true },
  { question: "Qui a gagné la Coupe du monde 2022 ?", score: 0.271, surLeJeu: false },
  { question: "Quelle est la capitale du Japon ?", score: 0.105, surLeJeu: false },
];
export const seuil = 0.3;
export const horsSujet = "Je ne find pas cette information dans les documents.";

/** le jeu « où le RAG a-t-il raté ? » : question, passages vraiment trouvés, vraie réponse */
export type Verdict = "recherche" | "reponse" | "rien";
export const VERDICTS_RAG: Record<Verdict, { nom: string; definition: string }> = {
  recherche: { nom: "La recherche", definition: "la réponse est dans les règles, mais aucun des passages trouvés ne la contient" },
  reponse: { nom: "La réponse", definition: "un des passages trouvés contient la réponse, mais le modèle en écrit une autre" },
  rien: { nom: "Rien, c'est juste", definition: "la réponse est juste, et elle vient des passages trouvés" },
};
export type CasRag = { question: string; passages: { n: number; debut: string; score: number }[]; reponse: string; verdict: Verdict; pourquoi: string };
export const casRag: CasRag[] = [{"question": "Qui a créé le jeu ?", "passages": [{"n": 7, "debut": "La carte Tempête inverse le sens du jeu. Si elle est posée,…", "score": 0.485}, {"n": 4, "debut": "Le joueur le plus jeune commence. Ensuite, on joue dans le…", "score": 0.427}, {"n": 3, "debut": "Au début de la partie, on mélange toutes les cartes. Chaque…", "score": 0.411}], "reponse": "Le jeu Tempête est un jeu de société créé par l'artiste et designer de jeux David K. Sperber.", "verdict": "recherche", "pourquoi": "La réponse est au paragraphe 15 : Léa Marchand, en 2019. Aucun des trois passages trouvés ne la contient, et le modèle invente un auteur."}, {"question": "Qui a illustré le jeu ?", "passages": [{"n": 7, "debut": "La carte Tempête inverse le sens du jeu. Si elle est posée,…", "score": 0.527}, {"n": 4, "debut": "Le joueur le plus jeune commence. Ensuite, on joue dans le…", "score": 0.46}, {"n": 3, "debut": "Au début de la partie, on mélange toutes les cartes. Chaque…", "score": 0.433}], "reponse": "Le jeu a été illustré par l'artiste français Jean-François Millet.", "verdict": "recherche", "pourquoi": "Le paragraphe 15 dit Tom Ravel, mais la recherche ramène la Tempête et le premier joueur. Sans la bonne page, le modèle en fabrique une."}, {"question": "Que se passe-t-il si on oublie de crier Sardine ?", "passages": [{"n": 8, "debut": "Quand un joueur n'a plus qu'une seule carte en main, il…", "score": 0.46}, {"n": 5, "debut": "À son tour, un joueur doit poser une carte Sardine de la…", "score": 0.357}, {"n": 1, "debut": "Sardine Express est un jeu de cartes pour 2 à 5 joueurs, à…", "score": 0.335}], "reponse": "Si un joueur ose crier Sardine sans avoir déjà fait cela lors de sa première ronde, il devra alors se rappeler et se remettre en question.", "verdict": "reponse", "pourquoi": "Le premier passage est le bon : trois cartes de pénalité. Le modèle l'avait sous les yeux et a écrit autre chose."}, {"question": "Que se passe-t-il quand on fait 6 au dé après une Tempête ?", "passages": [{"n": 7, "debut": "La carte Tempête inverse le sens du jeu. Si elle est posée,…", "score": 0.45}, {"n": 13, "debut": "Si la pioche est vide, on mélange la défausse (sauf la…", "score": 0.262}, {"n": 3, "debut": "Au début de la partie, on mélange toutes les cartes. Chaque…", "score": 0.19}], "reponse": "Si on fait 6 au dé après avoir lancé un dé avec le sens inverse de la tempête, chaque joueur perd une carte, sauf celui qui était dans son poing droit.", "verdict": "reponse", "pourquoi": "Le paragraphe 7 est trouvé en premier : sur un 6, chacun passe sa main à son voisin de gauche. La réponse invente une perte de carte."}, {"question": "Que fait-on quand la pioche est vide ?", "passages": [{"n": 13, "debut": "Si la pioche est vide, on mélange la défausse (sauf la…", "score": 0.589}, {"n": 3, "debut": "Au début de la partie, on mélange toutes les cartes. Chaque…", "score": 0.314}, {"n": 7, "debut": "La carte Tempête inverse le sens du jeu. Si elle est posée,…", "score": 0.293}], "reponse": "On mélange la défausse (sauf la carte du dessus) pour former une nouvelle pioche.", "verdict": "rien", "pourquoi": "Le bon paragraphe arrive en tête, nettement, et la réponse le reprend presque mot pour mot."}, {"question": "Que risque un joueur qui triche ?", "passages": [{"n": 8, "debut": "Quand un joueur n'a plus qu'une seule carte en main, il…", "score": 0.636}, {"n": 14, "debut": "Il est interdit de regarder les cartes des autres joueurs…", "score": 0.631}, {"n": 9, "debut": "Le premier joueur qui n'a plus de cartes gagne la manche…", "score": 0.569}], "reponse": "Il risque de perdre la manche en cours.", "verdict": "rien", "pourquoi": "Le paragraphe 14 est parmi les trois passages, et la réponse dit ce qu'il dit : perdre la manche en cours."}];
