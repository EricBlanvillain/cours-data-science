/**
 * Les chiffres de la séance 6, obtenus en rejouant le notebook 06_premier_modele.ipynb sur ses données :
 *   manchots https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv (Palmer Penguins, 344 lignes)
 *   Pokémon  https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
 * Calculé le 27/09/2026 dans un environnement proche de Colab (pandas 2.2.3, numpy 2.0, scikit-learn 1.9) :
 *
 *   df.shape, df.dropna()                                          → 344 manchots, 333 après nettoyage (146 Adélie, 119 Gentoo, 68 Chinstrap)
 *   train_test_split(test_size=0.25, random_state=42)              → 249 pour apprendre, 84 cachés
 *   modèle bête (l'espèce la plus fréquente du train, Adélie)      → 47,6 % sur les cachés
 *   DecisionTreeClassifier(max_depth=3, random_state=42)           → 96,8 % train, 97,6 % test ; arbre (nœuds et effectifs du train)
 *   pd.crosstab(y_test, predictions)                               → 2 Chinstrap pris pour des Adélie, tout le reste juste
 *   KNeighborsClassifier(n_neighbors=5)                            → 85,7 % ; avec StandardScaler → 98,8 %
 *   max_depth de 1 à 20, exactitude train et test                  → courbeArbre
 *   n_neighbors de 1 à 30                                          → courbeVoisins ; 249 voisins → 47,6 %, le modèle bête
 *   LinearRegression, poids à partir de 3 mesures                  → erreur moyenne 316 g train, 296 g test ; bête 658 g
 *   DecisionTreeRegressor(random_state=42) sans limite             → 0 g train, 325 g test
 *   Pokémon, Legendary : « toujours non »                          → 91,9 %, 0 légendaire sur 65
 *   Pokémon, stratify=y : bête / arbre 3 / arbre 5 / k-NN 5        → 92,0 % / 92,0 % (3 sur 16) / 92,5 % (9 sur 16) / 93,5 % (7 sur 16)
 * Les trois lignes du tableau X / y sont les lignes 1, 153 et 250 du CSV ; le manchot inventé est celui de la solution
 * de l'exercice de la section 4. Aucune valeur n'est inventée ; pour en changer, rejouer le notebook et coller ici.
 */
export const manchots = { bruts: 344, propres: 333, adelie: 146, gentoo: 119, chinstrap: 68 };
export const colonnesX = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"];
export const lignesXY = [
  { x: [39.1, 18.7, 181, 3750], y: "Adelie" },
  { x: [46.5, 17.9, 192, 3500], y: "Chinstrap" },
  { x: [50.0, 15.3, 220, 5550], y: "Gentoo" },
];
export const invente = { x: [45.0, 15.0, 215, 5000], prediction: "Gentoo" };
export const coupe = { train: 249, test: 84 };
export const scores = { bete: 47.6, voisins: 85.7, voisinsEchelle: 98.8, arbre: 97.6, arbreTrain: 96.8 };
export const erreursArbre = { chinstrapPrisPourAdelie: 2 };

/** l'arbre de profondeur 3, lu sur le train ; les feuilles sœurs de même espèce sont regroupées (même prédiction) */
export const arbre = {
  racine: { question: "nageoire ≤ 206,5 mm ?", n: 249, detail: "106 Adélie, 53 Chinstrap, 90 Gentoo" },
  oui: { question: "bec ≤ 43,35 mm ?", n: 153 },
  ouiOui: { espece: "Adélie", n: 103, detail: "100 Adélie, 3 Chinstrap" },
  ouiNon: { espece: "Chinstrap", n: 50, detail: "45 Chinstrap, 4 Adélie, 1 Gentoo" },
  non: { question: "épaisseur du bec ≤ 17,55 mm ?", n: 96 },
  nonOui: { espece: "Gentoo", n: 89, detail: "89 Gentoo" },
  nonNon: { question: "bec ≤ 46,55 mm ?", n: 7, detail: "2 Adélie, 5 Chinstrap" },
};

export const courbeArbre = {
  train: [77.5, 96.0, 96.8, 99.2, 99.6, 99.6, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  test: [82.1, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6, 97.6],
};
export const courbeVoisins = {
  train: [100.0, 91.2, 89.2, 84.3, 83.9, 82.3, 82.7, 81.5, 80.7, 77.9, 79.1, 78.7, 78.7, 76.7, 77.9, 77.1, 79.1, 78.3, 79.1, 74.3, 74.3, 72.7, 73.5, 75.5, 75.1, 73.9, 74.7, 73.9, 73.9, 74.3],
  test: [82.1, 82.1, 78.6, 78.6, 85.7, 84.5, 83.3, 84.5, 82.1, 82.1, 82.1, 83.3, 83.3, 82.1, 83.3, 83.3, 81.0, 82.1, 82.1, 78.6, 76.2, 76.2, 77.4, 78.6, 78.6, 77.4, 79.8, 77.4, 78.6, 79.8],
};
export const regression = { erreurTrain: 316, erreurTest: 296, bete: 658, arbreTrain: 0, arbreTest: 325, poidsMin: 2900, poidsMax: 5950, formule: "poids ≈ 2,6 × bec + 11,2 × épaisseur + 51,4 × nageoire − 6 424" };
export const pokemonLegendaires = { toujoursNon: 91.9, total: 65, testLegendaires: 16, bete: 92.0, arbre3: 92.0, arbre3Trouves: 3, arbre5: 92.5, arbre5Trouves: 9, voisins: 93.5, voisinsTrouves: 7 };

/** le jeu « ce modèle a-t-il compris ? » */
export type Verdict = "compris" | "parcoeur" | "inutile";
export const VERDICTS: Record<Verdict, { nom: string; definition: string }> = {
  compris: { nom: "Il a compris", definition: "sur les cachés, il fait nettement mieux que le modèle bête, et presque aussi bien que sur les exemples" },
  parcoeur: { nom: "Il a appris par cœur", definition: "il est parfait ou presque sur les exemples, nettement moins bon sur les cachés : c'est le sur-apprentissage" },
  inutile: { nom: "Pas mieux que le modèle bête", definition: "sur les cachés, il ne fait pas mieux que le modèle bête, quel que soit son score" },
};
export type SituationModele = { texte: string; reponse: Verdict; pourquoi: string };
export const situationsModeles: SituationModele[] = [
  { texte: "Arbre de profondeur 3, manchots : 96,8 % sur les exemples, 97,6 % sur les cachés ; le modèle bête fait 47,6 %.", reponse: "compris", pourquoi: "Presque le même score des deux côtés, et deux fois celui du modèle bête : la règle apprise vaut aussi pour des manchots jamais vus." },
  { texte: "k-NN avec un seul voisin, manchots : 100 % sur les exemples, 82,1 % sur les cachés.", reponse: "parcoeur", pourquoi: "Avec un seul voisin, chaque manchot d'entraînement se reconnaît lui-même : 100 % garanti. Les 18 points perdus sur les cachés mesurent ce qu'il a retenu sans le comprendre." },
  { texte: "Arbre de profondeur 3, Pokémon légendaires : 92,0 % sur les cachés ; « jamais légendaire » fait aussi 92,0 %.", reponse: "inutile", pourquoi: "92 % a l'air excellent, mais répondre « non » à tout le monde fait pareil. Le tableau croisé le confirme : 3 légendaires retrouvés sur 16." },
  { texte: "Régression du poids : 316 g d'erreur moyenne sur les exemples, 296 g sur les cachés ; le modèle bête se trompe de 658 g.", reponse: "compris", pourquoi: "L'erreur est la même des deux côtés et deux fois plus petite que celle du modèle bête, qui répond toujours le poids moyen." },
  { texte: "Arbre de régression sans limite de profondeur : 0 g d'erreur sur les exemples, 325 g sur les cachés.", reponse: "parcoeur", pourquoi: "Zéro gramme d'erreur, c'est une feuille par manchot : l'arbre a recopié les exemples. Sur les cachés, il fait moins bien que la simple régression linéaire." },
  { texte: "k-NN qui consulte les 249 manchots d'entraînement comme voisins : 47,6 % sur les cachés.", reponse: "inutile", pourquoi: "Avec tout le monde pour voisin, la majorité est toujours Adélie : il répond Adélie à chaque fois, exactement comme le modèle bête." },
];
