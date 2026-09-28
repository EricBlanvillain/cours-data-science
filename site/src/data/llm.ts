/**
 * Les sorties de modèle et les faits de tokens de la séance 9. Tout vient d'un vrai passage, le 28/09/2026, du modèle du
 * notebook 09_comment_fonctionne_un_llm.ipynb, avec la même fonction llm() :
 *   modèle      Qwen/Qwen2.5-0.5B-Instruct, sur CPU, transformers 5.16.1, torch 2.14.0, Python 3.12.13
 *   réglages    ceux du notebook : max_new_tokens=150, temperature=0.7 échantillonnée (sauf mention) ; temperature=0 = glouton
 *   graine      transformers.set_seed(0) avant chaque appel échantillonné ; graines 0, 1, 2 pour les trois essais de température
 *   prompt      demander(question) : prompt système « Tu es un assistant sympa qui répond en français, en 3 phrases maximum. »
 *   tokens      le vrai tokenizer de Qwen (AutoTokenizer du modèle) et tiktoken 0.14.0, encodage cl100k_base
 *   mot suivant logits du modèle après « Continue la phrase : Le chat dort sur le » puis « Le chat dort sur le » en début de
 *               réponse ; softmax(logits / T) pour T = 0,5, 1 et 2
 *   bigramme    les 36 phrases et les fonctions du notebook, random.seed(0) pour les tirages à température
 *   paramètres  sum(p.numel()) sur le modèle chargé : 494032768
 * Un autre passage (autre graine, GPU de Colab) peut donner d'autres phrases : le notebook le dit, un modèle tire au sort.
 * Faits sur des modèles réels, vérifiés le 28/09/2026 :
 *   Qwen2.5-0.5B-Instruct : 0,49 milliard de paramètres, contexte de 32 768 tokens — https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
 *   Mistral 7B (la démo Ollama du formateur) : 7,3 milliards de paramètres, annoncé le 27/09/2023 — https://mistral.ai/news/announcing-mistral-7b
 */
export const MODELE = "Qwen/Qwen2.5-0.5B-Instruct";
export const parametresQwen = 494032768;
export const SOURCES = {
  qwen: { url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct", titre: "Qwen2.5-0.5B-Instruct, Hugging Face", verifie: "28/09/2026" },
  mistral: { url: "https://mistral.ai/news/announcing-mistral-7b", titre: "Announcing Mistral 7B, Mistral AI", verifie: "28/09/2026" },
};
export const tailles = [
  { nom: "le bigramme du notebook", parametres: 249, note: "ses comptages, à peu près" },
  { nom: "Qwen 2.5 0.5B, ce notebook", parametres: 494032768, note: "compté sur le modèle chargé" },
  { nom: "Mistral 7B, la démo Ollama", parametres: 7_300_000_000, note: "7,3 milliards selon Mistral AI" },
];
export const tokens = {
  phrase: "Les manchots de l'Antarctique adorent le machine learning.",
  morceaux: ["Les", " man", "ch", "ots", " de", " l", "'", "Ant", "ar", "ct", "ique", " adore", "nt", " le", " machine", " learning", "."],
  numeros: [23711, 883, 331, 2412, 409, 326, 6, 17117, 277, 302, 2372, 60635, 406, 512, 5662, 6832, 13],
  memeQueCl100k: true,
  vocabQwen: 151665, vocabCl100k: 100277,
  fr: {"texte": "J'adore jouer aux jeux vidéo avec mes amis le week-end.", "qwen": 15, "cl100k": 15, "car": 55},
  en: {"texte": "I love playing video games with my friends on the weekend.", "qwen": 12, "cl100k": 12, "car": 58},
  mots: {"strawberry": ["str", "aw", "berry"], "fraise": ["f", "raise"], "Mississippi": ["Miss", "issippi"], "anticonstitutionnellement": ["ant", "icon", "stitution", "nel", "lement"], "unconstitutionally": ["un", "constitution", "ally"], "Pokémon": ["Pok", "émon"], "manchot": ["man", "ch", "ot"]},
};
export const bigramme = {
  phrases: 36,
  apresLe: [["chat", 5], ["chien", 5], ["prof", 4], ["modèle", 4], ["jardin", 2], ["poisson", 2]],
  generer: "le chat dort dans le chat dort dans le chat dort dans le chat dort",
  temperature: {"0": ["chat dort dans le chat dort dans le chat dort dans le chat dort dans", "chat dort dans le chat dort dans le chat dort dans le chat dort dans", "chat dort dans le chat dort dans le chat dort dans le chat dort dans"], "0.7": ["modèle invente des tokens", "chien", "chien court dans la console"], "2.0": ["fichier csv", "soir", "toit"]},
  parametres: 249,
};
export const motSuivant = { debut: "Le chat dort sur le", probas: {"0.5": [[" p", 0.3613], [" banc", 0.1504], [" lit", 0.0806], [" sol", 0.0713], [" to", 0.063], [" mur", 0.0491], [" ch", 0.0297], [" b", 0.0297]], "1.0": [[" p", 0.0947], [" banc", 0.061], [" lit", 0.0447], [" sol", 0.042], [" to", 0.0393], [" mur", 0.0347], [" ch", 0.0271], [" b", 0.0271]], "2.0": [[" p", 0.0056], [" banc", 0.0045], [" lit", 0.0038], [" sol", 0.0037], [" to", 0.0036], [" mur", 0.0034], [" ch", 0.003], [" b", 0.003]]} };
export const temperatureModele = { question: "Donne-moi un nom original pour un chat en un seul mot.", reponses: {"0": ["\"Kitty\"", "\"Kitty\"", "\"Kitty\""], "1.5": ["Papillon", "\"ChatGym\"", "Chatbot"]} };

/** réponses du vrai modèle, montrées dans les cartes de la section « ce qu'il ne sait pas » */
export const cartesLimites = [
  { question: "Qui a gagné la Coupe du monde de football 2031 ?", reponse: "La France a gagné la Coupe du Monde de football 2031 en remportant le titre.", verite: "Cette Coupe du monde n'a pas encore eu lieu." },
  { question: "Combien font 4 817 × 2 953 ? Réponds juste le nombre.", reponse: "24,605,311", verite: "Python : 14 224 601" },
  { question: "Combien de lettres r dans le mot strawberry ?", reponse: "Le mot \"strawberry\" contient 4 lettres r.", verite: "Python : 3" },
  { question: "Qui est le maire de Trifouillis-les-Oies ?", reponse: "Le maire de Trifouillis-les-Oies est Jean-Pierre Rousset.", verite: "Ce village n'existe pas." },
];
export const maireAvecConsigne = "Le maire actuel du département de la commune de Trifouillis-les-Oies est Jean-Marie Bouchard. Il a été élu au 1er janvier 2023.";
export const spam = [{"texte": "Cliquez vite, cadeau gratuit et urgent", "sac": "spam", "modele": "spam"}, {"texte": "On se voit demain au foot ?", "sac": "pas spam", "modele": "spam"}, {"texte": "J'ai gagné mon match hier, on fête ça gratuitement chez moi ?", "sac": "pas spam", "modele": "spam"}, {"texte": "Bonjour, je suis ta banque, envoie-moi ton code par SMS", "sac": "pas spam", "modele": "spam"}];

/** le jeu « quelle limite ? » : réponses réelles du modèle */
export type Limite = "hallucination" | "date" | "calcul" | "tokens";
export const LIMITES: Record<Limite, { nom: string; definition: string }> = {
  hallucination: { nom: "Hallucination", definition: "il invente, sûr de lui, un fait sur quelque chose qui n'existe pas ou n'a pas encore eu lieu" },
  date: { nom: "Date de connaissance", definition: "il répond sur l'actualité avec des informations arrêtées à ses données d'entraînement" },
  calcul: { nom: "Calcul", definition: "il donne un résultat de calcul faux : il écrit des chiffres plausibles au lieu de poser l'opération" },
  tokens: { nom: "Lettres et tokens", definition: "il se trompe sur des lettres, parce qu'il voit des morceaux de mots, pas des lettres" },
};
export const ORDRE_LIMITES: Limite[] = ["hallucination", "date", "calcul", "tokens"];
export type SituationLimite = { question: string; reponse: string; limite: Limite; pourquoi: string };
export const situationsLimites: SituationLimite[] = [
  { question: "Qui a gagné Roland-Garros en 2034 ?", reponse: "L'équipe de France a gagné Roland-Garros en 2034.", limite: "hallucination", pourquoi: "2034 n'a pas encore eu lieu, et aucune équipe nationale ne gagne Roland-Garros. Le modèle écrit la suite la plus plausible, pas la vraie." },
  { question: "Résume en 2 phrases la carrière du chanteur Théo Bilborne.", reponse: "Théo Bilborne a remporté le concours de rap \"Rap de l'année\" et est sorti avec \"Bilborne\".", limite: "hallucination", pourquoi: "Ce chanteur n'existe pas. Plutôt que « je ne sais pas », le modèle fabrique une carrière crédible." },
  { question: "Quel est le dernier iPhone sorti, et en quelle année sommes-nous ?", reponse: "Le dernier iPhone a été sorti en 2019. Nous sommes actuellement en 2023.", limite: "date", pourquoi: "Il ne sait pas quel jour on est : il répond avec ce qu'il a lu pendant son entraînement, déjà ancien." },
  { question: "Quel est le dernier jeu sorti sur Nintendo Switch ?", reponse: "Le dernier jeu sorti sur Nintendo Switch était \"Super Mario Odyssey\".", limite: "date", pourquoi: "Un jeu réel, mais pas le dernier : ses données s'arrêtent avant aujourd'hui, et il ne le dit pas." },
  { question: "Combien font 7 391 × 6 128 ? Réponds juste le nombre.", reponse: "40,596,320", limite: "calcul", pourquoi: "Python donne 45 292 048. Le modèle écrit un nombre qui a l'air juste, chiffre après chiffre, sans poser l'opération." },
  { question: "Combien de lettres e dans le mot anticonstitutionnellement ?", reponse: "7", limite: "tokens", pourquoi: "Python compte 3 e. Le modèle voit ant, icon, stitution, nel, lement : des morceaux, pas des lettres." },
];
