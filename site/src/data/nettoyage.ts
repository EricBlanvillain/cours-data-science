/**
 * Les chiffres de la séance 4, tous obtenus en rejouant les cellules du notebook 04_collecter_nettoyer.ipynb, sans rien
 * changer : la fonction abimer(…, seed=42) appliquée au CSV Pokémon
 *   https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
 * puis au CSV Tips https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv. Calculé le 27/09/2026 avec
 * numpy 2.0 et pandas 2.3 (default_rng et random_state donnent le même tirage dans Colab) :
 *
 *   df = abimer(pokemon_propre, col_categorie="Type 1", col_nombre="HP")
 *   len(df), df.isna().sum()                                  → 810 lignes ; Type 1 : 40 vides, HP : 41 vides
 *   df["Type 1"].nunique()                                    → 56 valeurs au lieu de 18
 *   df.duplicated().sum()                                     → 10 ; après drop_duplicates : 800 lignes
 *   .str.strip().str.capitalize(), puis nunique()             → 30 ; restent 12 fautes (lettres inversées) sur 27 lignes
 *   difflib.get_close_matches(…, cutoff=0.6)                  → 12 corrections, 18 types
 *   df["HP"].dtype, première valeur                           → object, "75 "
 *   après astype(float) : isna().sum(), median(), mean()      → 40 vides, médiane 65, moyenne 69,3
 *   pd.to_datetime(format=…) : ISO, jj/mm/aaaa, en lettres    → 255, 271, 274 dates lues ; 0 NaT
 *   vérification : HP moyen propre / réparé, nunique(Type 1)   → 69,3 / 69,1 ; 19 (dont « Inconnu »)
 *   df.head(8) et quelques lignes par nom                     → lignesAbimees
 *   pokemon_propre["Type 2"].isna().sum()                     → 386 (414 remplies sur 800)
 *   tips abîmé : len, puis après drop_duplicates               → 254, puis 244 ; day : 14 valeurs, 12 vides ; total_bill : 12 vides
 * Pikachu vient de https://pokeapi.co/api/v2/pokemon/pikachu (lu le 27/09/2026) : 21 clés, height 4 (décimètres),
 * weight 60 (hectogrammes), un type « electric », hp 35, attack 55, defense 40, speed 90.
 * Le temps passé à préparer les données : enquête Anaconda « 2020 State of Data Science », près de 2 400 répondants,
 * 45 % du temps à charger (19 %) et nettoyer (plus d'un quart) les données avant de s'en servir.
 * Aucune valeur n'est inventée ; pour en changer, rejouer le notebook et coller le résultat ici.
 */
export const SOURCE_POKEMON = "https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv";

export const avant = { lignes: 810, typesDifferents: 56, videsType1: 40, videsHP: 41 };
export const doublons = 10;
export const apresDoublons = 800;
export const typesApresStrip = 30;
export const fautesInversees = { valeurs: 12, lignes: 27, exemples: ["Fier", "Watre", "Dragno", "Psychci"] };
export const typesValides = 18;
export const hp = { typeAvant: "object", exemple: "75 ", vides: 40, mediane: 65, moyenne: 69.3 };
export const dates = { iso: 255, fr: 271, lettres: 274, nonLues: 0 };
export const verification = { hpMoyenPropre: 69.3, hpMoyenRepare: 69.1, typesAvecInconnu: 19 };
export const sansType2 = 386;
export const tips = { additions: 244, abimees: 254, joursDifferents: 14, joursValides: 4, videsJour: 12, videsMontant: 12 };

/** des lignes réelles du tableau abîmé, choisies pour montrer chaque dégât (la ligne Growlithe y est deux fois) */
export const lignesAbimees = [
  { nom: "Palpitoad", type1: "water", hp: "75 ", date: "05/03/2024", degats: ["casse"] },
  { nom: "Charizard", type1: "Fier", hp: "78 ", date: "10/05/2024", degats: ["faute"] },
  { nom: "Charmeleon", type1: "fire", hp: null, date: "2024-10-17", degats: ["casse", "vide"] },
  { nom: "Growlithe", type1: "Fire", hp: "55 ", date: "28 sept 2024", degats: ["doublon"] },
  { nom: "Growlithe", type1: "Fire", hp: "55 ", date: "28 sept 2024", degats: ["doublon"] },
  { nom: "Chandelure", type1: "Ghost", hp: "60 ", date: "14 mars 2024", degats: [] },
];

/** les lignes du journal, telles que le notebook les écrit */
export const journal = [
  "Départ : 810 lignes, 471 cases vides",
  "Doublons : 10 lignes identiques supprimées, il reste 800 lignes",
  "Type 1 : espaces et majuscules normalisés, 12 fautes corrigées → 18 types valides",
  "HP : texte converti en nombre (strip + astype)",
  "HP : 40 cases vides remplies par la médiane (65)",
  "Type 1 : cases vides remplacées par 'Inconnu'",
  "date_capture : 3 formats convertis en vraies dates (to_datetime)",
];
export const departVides = 471;

export const pikachu = { cles: 21, name: "pikachu", height: 4, weight: 60, type: "electric", hp: 35, attack: 55, defense: 40, speed: 90 };

export const ANACONDA = {
  titre: "Anaconda, 2020 State of Data Science",
  url: "https://www.anaconda.com/resources/whitepaper/state-of-data-science-2020",
  presse: "https://hpcwire.com/bigdatawire/2020/07/06/data-prep-still-dominates-data-scientists-time-survey-finds/",
  repondants: "près de 2 400",
  preparation: 45,
  chargement: 19,
  verifie: "27/09/2026",
};

/** le jeu « supprimer, remplir ou garder ? » */
export type Choix = "supprimer" | "remplir" | "garder";
export const CHOIX: Record<Choix, { nom: string; outil: string; quand: string }> = {
  supprimer: { nom: "Supprimer", outil: "dropna", quand: "la case vide rend la ligne inutile (dropna)" },
  remplir: { nom: "Remplir", outil: "fillna", quand: "on met quelque chose à la place de la valeur perdue : la médiane pour un nombre, l'étiquette « Inconnu » pour une catégorie, jamais une valeur devinée (fillna)" },
  garder: { nom: "Garder", outil: "rien", quand: "la case vide porte elle-même une information, comme Type 2 pour un Pokémon à un seul type ; on la laisse telle quelle" },
};
export type SituationVide = { texte: string; reponse: Choix; pourquoi: string };
export const situationsVides: SituationVide[] = [
  { texte: "386 Pokémon sur 800 n'ont rien dans la colonne Type 2.", reponse: "garder", pourquoi: "Ce n'est pas un trou : ces Pokémon n'ont qu'un seul type. Le vide porte une information, le remplir l'effacerait." },
  { texte: "40 Pokémon ont perdu leurs points de vie (HP).", reponse: "remplir", pourquoi: "Le reste de la ligne est précieux. La médiane des HP, 65, est une valeur raisonnable qui ne dépend pas des rares géants, jusqu'à 255." },
  { texte: "40 Pokémon ont perdu leur Type 1.", reponse: "remplir", pourquoi: "Ici le vide ne dit rien en soi : le type a été effacé. La ligne reste utile, mais on ne devine pas son type : la case reçoit l'étiquette « Inconnu ». Écrire « Water » au hasard serait mentir." },
  { texte: "Dans Tips, 12 additions n'ont plus de montant (total_bill).", reponse: "supprimer", pourquoi: "Une addition sans montant ne sert à rien pour étudier les pourboires. 12 lignes sur 244, on les retire et on l'écrit dans le journal." },
  { texte: "Dans Tips, 12 additions ont perdu leur jour de la semaine.", reponse: "remplir", pourquoi: "Le jour a été effacé, le vide ne dit rien en soi. Le montant et le pourboire restent utiles : le jour reçoit l'étiquette « Inconnu », et chaque calcul par jour le montrera à part." },
  { texte: "Une ligne n'a plus que son nom : toutes les autres cases sont vides.", reponse: "supprimer", pourquoi: "Il n'y a plus rien à analyser, et remplir toutes ces cases reviendrait à fabriquer un Pokémon. Une ligne vide va à la corbeille, avec sa ligne de journal." },
];
