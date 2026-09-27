/**
 * Les chiffres de la séance 5, calculés une fois sur les deux CSV que le notebook 05_analyser_raconter.ipynb charge,
 * et en rejouant ses simulations avec les mêmes graines :
 *   Tips    https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv (244 additions)
 *   Pokémon https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
 * Calculé le 27/09/2026 avec pandas 2.3 et numpy 2.0 :
 *
 *   tips[["total_bill","tip"]]                                     → pointsTips (244 points)
 *   tips["total_bill"].corr(tips["tip"]) ; numpy.polyfit(…, 1)     → 0,68 ; pourboire ≈ 0,92 + 0,105 × addition
 *   tips["tip"].mean() ; dimanche soir (day == "Sun", time == "Dinner") → 3,00 $ ; 3,26 $, soit 8,6 % de plus
 *   pokemon["HP"].quantile([.25, .5, .75]), q3 + 1,5 × (q3 − q1)   → 50, 65, 80 ; limite 125 ; 18 Pokémon au-dessus
 *   moustaches (valeurs extrêmes dans les limites) ; sous q1 − 1,5 × (q3 − q1) = 5 → 10 et 125 ; Shedinja, 1 HP
 *   pokemon[pokemon["HP"] > 125]["HP"]                             → hpHorsLimite (Blissey 255, Chansey 250…)
 *   pokemon[stats].corr().round(2)                                 → correlations ; max Sp. Atk / Sp. Def 0,51, min Defense / Speed 0,02
 *   glaces / noyades, default_rng(0), 120 journées simulées        → corrélation 0,72
 *   sondage, default_rng(1), 1 000 personnes                       → 41,5 % de joueurs ; au hasard 38 % ; devant le magasin 90 %
 *   abonnés [1020, 1035, 1028, 1050, 1062, 1071]                   → + 5,0 % en six mois
 *   pokemon.groupby("Type 1")["HP"].mean().round(1)                → hpParType (menu « HP » du tableau de bord)
 *   pokemon["Generation"].value_counts().sort_index()              → parGeneration
 * Les glaces, les noyades et le sondage sont des données simulées par le notebook, pas des mesures.
 * Aucune valeur n'est inventée ; pour en changer, refaire le calcul et coller le résultat ici.
 */
export const pointsTips: [number, number][] = [[16.99,1.01],[10.34,1.66],[21.01,3.5],[23.68,3.31],[24.59,3.61],[25.29,4.71],[8.77,2],[26.88,3.12],[15.04,1.96],[14.78,3.23],[10.27,1.71],[35.26,5],[15.42,1.57],[18.43,3],[14.83,3.02],[21.58,3.92],[10.33,1.67],[16.29,3.71],[16.97,3.5],[20.65,3.35],[17.92,4.08],[20.29,2.75],[15.77,2.23],[39.42,7.58],[19.82,3.18],[17.81,2.34],[13.37,2],[12.69,2],[21.7,4.3],[19.65,3],[9.55,1.45],[18.35,2.5],[15.06,3],[20.69,2.45],[17.78,3.27],[24.06,3.6],[16.31,2],[16.93,3.07],[18.69,2.31],[31.27,5],[16.04,2.24],[17.46,2.54],[13.94,3.06],[9.68,1.32],[30.4,5.6],[18.29,3],[22.23,5],[32.4,6],[28.55,2.05],[18.04,3],[12.54,2.5],[10.29,2.6],[34.81,5.2],[9.94,1.56],[25.56,4.34],[19.49,3.51],[38.01,3],[26.41,1.5],[11.24,1.76],[48.27,6.73],[20.29,3.21],[13.81,2],[11.02,1.98],[18.29,3.76],[17.59,2.64],[20.08,3.15],[16.45,2.47],[3.07,1],[20.23,2.01],[15.01,2.09],[12.02,1.97],[17.07,3],[26.86,3.14],[25.28,5],[14.73,2.2],[10.51,1.25],[17.92,3.08],[27.2,4],[22.76,3],[17.29,2.71],[19.44,3],[16.66,3.4],[10.07,1.83],[32.68,5],[15.98,2.03],[34.83,5.17],[13.03,2],[18.28,4],[24.71,5.85],[21.16,3],[28.97,3],[22.49,3.5],[5.75,1],[16.32,4.3],[22.75,3.25],[40.17,4.73],[27.28,4],[12.03,1.5],[21.01,3],[12.46,1.5],[11.35,2.5],[15.38,3],[44.3,2.5],[22.42,3.48],[20.92,4.08],[15.36,1.64],[20.49,4.06],[25.21,4.29],[18.24,3.76],[14.31,4],[14,3],[7.25,1],[38.07,4],[23.95,2.55],[25.71,4],[17.31,3.5],[29.93,5.07],[10.65,1.5],[12.43,1.8],[24.08,2.92],[11.69,2.31],[13.42,1.68],[14.26,2.5],[15.95,2],[12.48,2.52],[29.8,4.2],[8.52,1.48],[14.52,2],[11.38,2],[22.82,2.18],[19.08,1.5],[20.27,2.83],[11.17,1.5],[12.26,2],[18.26,3.25],[8.51,1.25],[10.33,2],[14.15,2],[16,2],[13.16,2.75],[17.47,3.5],[34.3,6.7],[41.19,5],[27.05,5],[16.43,2.3],[8.35,1.5],[18.64,1.36],[11.87,1.63],[9.78,1.73],[7.51,2],[14.07,2.5],[13.13,2],[17.26,2.74],[24.55,2],[19.77,2],[29.85,5.14],[48.17,5],[25,3.75],[13.39,2.61],[16.49,2],[21.5,3.5],[12.66,2.5],[16.21,2],[13.81,2],[17.51,3],[24.52,3.48],[20.76,2.24],[31.71,4.5],[10.59,1.61],[10.63,2],[50.81,10],[15.81,3.16],[7.25,5.15],[31.85,3.18],[16.82,4],[32.9,3.11],[17.89,2],[14.48,2],[9.6,4],[34.63,3.55],[34.65,3.68],[23.33,5.65],[45.35,3.5],[23.17,6.5],[40.55,3],[20.69,5],[20.9,3.5],[30.46,2],[18.15,3.5],[23.1,4],[15.69,1.5],[19.81,4.19],[28.44,2.56],[15.48,2.02],[16.58,4],[7.56,1.44],[10.34,2],[43.11,5],[13,2],[13.51,2],[18.71,4],[12.74,2.01],[13,2],[16.4,2.5],[20.53,4],[16.47,3.23],[26.59,3.41],[38.73,3],[24.27,2.03],[12.76,2.23],[30.06,2],[25.89,5.16],[48.33,9],[13.27,2.5],[28.17,6.5],[12.9,1.1],[28.15,3],[11.59,1.5],[7.74,1.44],[30.14,3.09],[12.16,2.2],[13.42,3.48],[8.58,1.92],[15.98,3],[13.42,1.58],[16.27,2.5],[10.09,2],[20.45,3],[13.28,2.72],[22.12,2.88],[24.01,2],[15.69,3],[11.61,3.39],[10.77,1.47],[15.53,3],[10.07,1.25],[12.6,1],[32.83,1.17],[35.83,4.67],[29.03,5.92],[27.18,2],[22.67,2],[17.82,1.75],[18.78,3]];
export const tendanceTips = { correlation: 0.68, ordonnee: 0.92, pente: 0.105 };
export const pourboire = { moyen: 3.0, dimancheSoir: 3.26, ecartPct: 8.6 };

export const boiteHP = { q1: 50, mediane: 65, q3: 80, limiteHaute: 125, moustacheBasse: 10, moustacheHaute: 125, auDessus: 18 };
export const hpHorsLimite = [255, 250, 190, 170, 165, 160, 150, 150, 150, 150, 144, 140, 135, 130, 130, 130, 126, 126];
export const hpSous = { nom: "Shedinja", hp: 1 };
export const hpRecord = { nom: "Blissey", hp: 255 };

export const stats = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
/** matrice de corrélation des six stats, arrondie à 2 décimales, dans l'ordre de `stats` */
export const correlations = [
  [1.00, 0.42, 0.24, 0.36, 0.38, 0.18],
  [0.42, 1.00, 0.44, 0.40, 0.26, 0.38],
  [0.24, 0.44, 1.00, 0.22, 0.51, 0.02],
  [0.36, 0.40, 0.22, 1.00, 0.51, 0.47],
  [0.38, 0.26, 0.51, 0.51, 1.00, 0.26],
  [0.18, 0.38, 0.02, 0.47, 0.26, 1.00],
];
export const pairePlusCorrelee = { a: "Sp. Atk", b: "Sp. Def", r: 0.51 };
export const paireMoinsCorrelee = { a: "Defense", b: "Speed", r: 0.02 };

export const glacesNoyades = { journees: 120, correlation: 0.72 };
export const sondage = { personnes: 1000, vraiePart: 41.5, auHasard: 38, devantMagasin: 90 };
export const abonnes = { mois: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"], valeurs: [1020, 1035, 1028, 1050, 1062, 1071], hausse: 5.0 };

export const hpParType = [{ type: "Dragon", hp: 83.3 }, { type: "Normal", hp: 77.3 }, { type: "Fairy", hp: 74.1 }, { type: "Ground", hp: 73.8 }, { type: "Water", hp: 72.1 }, { type: "Ice", hp: 72.0 }, { type: "Flying", hp: 70.8 }, { type: "Psychic", hp: 70.6 }, { type: "Fighting", hp: 69.9 }, { type: "Fire", hp: 69.9 }, { type: "Grass", hp: 67.3 }, { type: "Poison", hp: 67.2 }, { type: "Dark", hp: 66.8 }, { type: "Rock", hp: 65.4 }, { type: "Steel", hp: 65.2 }, { type: "Ghost", hp: 64.4 }, { type: "Electric", hp: 59.8 }, { type: "Bug", hp: 56.9 }];
export const parGeneration = [166, 106, 160, 121, 165, 82];

/** le jeu « quel piège ? » */
export type Piege = "causalite" | "graphique" | "biais";
export const PIEGES: Record<Piege, { nom: string; definition: string }> = {
  causalite: { nom: "Causalité", definition: "on lit une cause dans une corrélation, alors qu'une variable cachée peut expliquer les deux" },
  graphique: { nom: "Graphique trompeur", definition: "le dessin grossit ou écrase un écart : axe qui ne part pas de zéro, perspective, échelle trafiquée" },
  biais: { nom: "Biais", definition: "les données viennent d'un groupe qui ne ressemble pas à celui dont on parle" },
};
export type SituationPiege = { texte: string; reponse: Piege; pourquoi: string };
export const situationsPieges: SituationPiege[] = [
  { texte: "Les élèves qui ont un ordinateur portable ont de meilleures notes : donnons un portable à tout le monde !", reponse: "causalite", pourquoi: "Portable et bonnes notes vont ensemble, mais un troisième facteur peut produire les deux : le revenu du foyer, un endroit calme pour travailler. Distribuer des portables ne changerait pas ce facteur." },
  { texte: "Notre appli est passée de 4,1 à 4,3 étoiles : sur le graphique, la barre est deux fois plus haute.", reponse: "graphique", pourquoi: "De 4,1 à 4,3, la note gagne moins de 5 %. Une barre qui double veut dire que l'axe démarre juste sous 4 : c'est le dessin qui fabrique l'écart." },
  { texte: "95 % des avis sur notre jeu sont positifs ; seuls les joueurs qui l'ont fini ont été invités à noter.", reponse: "biais", pourquoi: "Ceux qui ont abandonné, sans doute les moins contents, n'ont jamais eu la parole. Le chiffre est exact pour ce groupe-là, faux pour l'ensemble des joueurs." },
  { texte: "Les enfants qui dorment avec une veilleuse deviennent plus souvent myopes : éteignons les veilleuses.", reponse: "causalite", pourquoi: "Une explication possible, cachée : des parents myopes laissent plus volontiers une lumière, et transmettent aussi leur myopie. Veilleuse et myopie peuvent venir de la même cause." },
  { texte: "Pour savoir si les élèves aiment la cantine, on interroge ceux qui y mangent, un jour de frites.", reponse: "biais", pourquoi: "Ceux qui fuient la cantine ne sont pas là pour répondre, et le jour choisi flatte le menu. On apprend l'avis des habitués un bon jour, pas celui des élèves." },
  { texte: "Sur un camembert en 3D penché, la part du premier plan paraît plus grosse qu'une part égale au fond.", reponse: "graphique", pourquoi: "Les deux parts valent autant ; la perspective agrandit ce qui est devant. Les données sont justes, c'est le dessin qui ment." },
];
