/**
 * Les sorties de la séance 12, toutes issues d'un vrai passage, le 28/09/2026, du notebook 12_agents_et_projet_final.ipynb
 * avec son propre code (ses trois outils, sa boucle agent(), son banc de test), exécuté cellule par cellule :
 *   modèle      Qwen/Qwen2.5-0.5B-Instruct, sur CPU, transformers 5.16.1, torch 2.14.0, Python 3.12.13
 *   réglages    ceux du notebook : demander() et agent() à temperature=0 (glouton, donc sans graine), max_new_tokens=60 pour
 *               l'agent, prompt SYSTEME_AGENT tel quel, max_etapes=4
 *   outils      chercher_pokemon lit le CSV Pokémon de la séance 2 ; calculer passe par ast ; chercher_dans_mes_notes est le
 *               TF-IDF du notebook sur ses 9 paragraphes de notes : leurs sorties sont celles des fonctions Python
 *   mode démo   la trace « mode démo » vient de llm_factice, les réponses écrites à la main dans le notebook (USE_MODEL à
 *               False) : elle montre ce que la boucle doit faire, pas ce que le modèle a fait
 * Vraies valeurs, dans le CSV : vitesse de Pikachu 90, défense de Charizard 78, PV de Snorlax 160 ; 348 × 27 = 9 396.
 */
export const MODELE = "Qwen/Qwen2.5-0.5B-Instruct";
export const sansOutil = [
  { question: "Quelle est la vitesse de Pikachu ?", reponse: "Pikachu se déplace à 100 km/h.", verite: "90, dans le fichier de la séance 2" },
  { question: "Combien font 348 * 27 ?", reponse: "348 * 27 = 9164", verite: "9 396" },
];
export const outils = [
  { nom: "chercher_pokemon", appel: "chercher_pokemon(\"Pikachu\")", sortie: "Pikachu : type Electric, 35 PV, attaque 55, défense 40, vitesse 90." },
  { nom: "chercher_pokemon", appel: "chercher_pokemon(\"Pikachou\")", sortie: "Aucun Pokémon appelé Pikachou." },
  { nom: "calculer", appel: "calculer(\"348 * 27\")", sortie: "348 * 27 = 9396" },
  { nom: "calculer", appel: "calculer('__import__(\"os\")…')", sortie: "Expression refusée (élément interdit : Call)." },
  { nom: "chercher_dans_mes_notes", appel: "chercher_dans_mes_notes(\"à quoi sert la température\")", sortie: "Séance 9 : un LLM fait une seule chose, prédire le token suivant, encore et encore. La température règle le hasard : 0 = toujours pareil, élevée = créatif puis délirant." },
];
export const traceReussie = { question: "Quels sont les PV de Snorlax ?", etapes: [{"etape": 1, "qui": "modèle", "texte": "OUTIL: chercher_pokemon(Snorlax)"}, {"etape": 1, "qui": "outil", "texte": "Snorlax : type Normal, 160 PV, attaque 110, défense 65, vitesse 30."}], reponse: "Le PV de Snorlax est 160." };
export const traceDemo = { question: "Combien fait la vitesse de Pikachu fois 3 ?", etapes: [{"etape": 1, "qui": "modèle", "texte": "OUTIL: chercher_pokemon(Pikachu)"}, {"etape": 1, "qui": "outil", "texte": "Pikachu : type Electric, 35 PV, attaque 55, défense 40, vitesse 90."}, {"etape": 2, "qui": "modèle", "texte": "OUTIL: calculer(90 * 3)"}, {"etape": 2, "qui": "outil", "texte": "90 * 3 = 270"}], reponse: "D'après mes outils : Pikachu : type Electric, 35 PV, attaque 55, défense 40, vitesse 90. ; 90 * 3 = 270" };
export const enchainementReel = "calculer(348 * 27)";
export const banc = [{"question": "Quelle est la défense de Charizard ?", "attendu": "chercher_pokemon", "obtenu": null, "ok": false}, {"question": "Combien font 12 * 12 + 1 ?", "attendu": "calculer", "obtenu": null, "ok": false}, {"question": "Dans mes notes de cours, c'est quoi un token ?", "attendu": "chercher_dans_mes_notes", "obtenu": null, "ok": false}, {"question": "Quels sont les PV de Snorlax ?", "attendu": "chercher_pokemon", "obtenu": "chercher_pokemon", "ok": true}, {"question": "Que disent mes notes de cours sur les trois rôles ?", "attendu": "chercher_dans_mes_notes", "obtenu": null, "ok": false}, {"question": "Combien font 1000 / 8 ?", "attendu": "calculer", "obtenu": null, "ok": false}];

/** le jeu « qu'est-ce qui a raté ? » : vraies réponses de l'agent */
export type Verdict = "format" | "tete" | "reussi";
export const VERDICTS_AGENT: Record<Verdict, { nom: string; definition: string }> = {
  format: { nom: "Format oublié", definition: "il essaie d'appeler un outil, mais sans écrire exactement OUTIL: nom(arguments) : la boucle ne reconnaît pas l'appel" },
  tete: { nom: "Répond de tête", definition: "il n'essaie aucun outil et répond directement, que ce soit juste ou faux" },
  reussi: { nom: "Réussi", definition: "il appelle le bon outil au bon format, puis répond à partir du résultat" },
};
export type CasAgent = { question: string; trace: string[]; reponse: string; verdict: Verdict; pourquoi: string };
export const casAgent: CasAgent[] = [
  { question: "D'après mes notes de cours, quelles sont les étapes du RAG ?", trace: [], reponse: "Chercher_dans_mes_notes(RAG)", verdict: "format", pourquoi: "Le bon outil, presque le bon nom, mais sans « OUTIL: » devant : la boucle ne voit pas d'appel et rend ce texte tel quel comme réponse finale." },
  { question: "Combien fait la vitesse de Pikachu fois 3 ?", trace: [], reponse: "calculer(348 * 27)", verdict: "format", pourquoi: "Il tente la calculatrice sans « OUTIL: », donc rien ne s'exécute. Et les arguments sont faux : il recopie l'exemple du prompt au lieu de 90 × 3." },
  { question: "Quelle est la défense de Charizard ?", trace: [], reponse: "150", verdict: "tete", pourquoi: "Aucun outil appelé : il invente un nombre. Le fichier dit 78." },
  { question: "Combien font 12 * 12 + 1 ?", trace: [], reponse: "145", verdict: "tete", pourquoi: "C'est juste, mais sans calculatrice : il a répondu de tête et il est tombé juste. Sur un calcul plus long, rien ne garantit la même chance." },
  { question: "Quels sont les PV de Snorlax ?", trace: ["modèle → OUTIL: chercher_pokemon(Snorlax)", "outil → Snorlax : type Normal, 160 PV, attaque 110, défense 65, vitesse 30."], reponse: "Le PV de Snorlax est 160.", verdict: "reussi", pourquoi: "OUTIL: chercher_pokemon(Snorlax), exactement le format demandé ; Python lit le fichier, et la réponse reprend les 160 PV." },
  { question: "Quelle est la vitesse de Snorlax ?", trace: ["modèle → OUTIL: chercher_pokemon(Snorlax)", "outil → Snorlax : type Normal, 160 PV, attaque 110, défense 65, vitesse 30."], reponse: "Snorlax : type Normal, 160 PV, attaque 110, défense 65, vitesse 30.", verdict: "reussi", pourquoi: "Le bon outil au bon format ; la réponse recopie toute la fiche au lieu d'une phrase, mais la vitesse, 30, y est bien." },
];
