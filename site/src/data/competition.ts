/**
 * Les chiffres de la séance 8, obtenus en rejouant le notebook 08_kaggle_titanic_2.ipynb sur la copie publique de train.csv
 * qu'il charge (https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv, 891 passagers), avec la même
 * fonction preparer() que la séance 7. Calculé le 27/09/2026 (pandas 2.2.3, scikit-learn 1.9), validation croisée à 5 paquets :
 *
 *   logistique / arbre (profondeur 4) / forêt (200, 5) / boosting (100, 3) → 80,4 ± 0,7 ; 82,3 ± 2,2 ; 82,7 ± 1,9 ; 83,2 ± 1,6 %
 *   k-NN brut / mis à l'échelle                                              → 71,6 % / 81,4 %
 *   importances (forêt ; boosting)                                           → importances
 *   forêt sans Titre                                                         → 82,0 %
 *   arbre, profondeur 1 à 15, train et validation                           → courbe ; meilleure profondeur 4, 82,3 %
 *   GridSearchCV forêt (100 arbres), max_depth × min_samples_leaf          → grille ; meilleur (5, 3) : 82,9 %
 *   GridSearchCV boosting, n_estimators × learning_rate                     → (200, 0,1) : 84,1 %
 *   fuite (colonne Canot = Survived)                                         → 100,0 %
 *   forêt sans limite : score sur les données vues / validation croisée     → 98,1 % / 80,5 %
 *   « toutes les femmes survivent » sur train                               → 78,7 %
 * La règle « les femmes survivent » vaut 0.76555 sur Kaggle (320 bonnes réponses sur 418, chiffre donné par le notebook ;
 * 320 / 418 = 0,76555). Le classement de la compétition est calculé sur tout test.csv, et des équipes y affichent 1.00000
 * (page https://www.kaggle.com/competitions/titanic/leaderboard, lue le 27/09/2026).
 * Aucune valeur n'est inventée ; pour en changer, rejouer le notebook et coller le résultat ici.
 */
export const modeles = [
  { nom: "Régression logistique", moyenne: 80.4, ecart: 0.7 },
  { nom: "Arbre de décision", moyenne: 82.3, ecart: 2.2 },
  { nom: "Forêt aléatoire", moyenne: 82.7, ecart: 1.9 },
  { nom: "Gradient boosting", moyenne: 83.2, ecart: 1.6 },
];
export const regleFemmes = { train: 78.7, kaggle: 0.76555, bonnes: 320, sur: 418 };
export const voisins = { brut: 71.6, echelle: 81.4 };
export const importances = [
  { variable: "Titre", foret: 0.284, boosting: 0.492 },
  { variable: "Sex", foret: 0.272, boosting: 0.037 },
  { variable: "Fare", foret: 0.130, boosting: 0.178 },
  { variable: "Pclass", foret: 0.125, boosting: 0.117 },
  { variable: "Famille", foret: 0.079, boosting: 0.074 },
  { variable: "Age", foret: 0.075, boosting: 0.088 },
  { variable: "Embarked", foret: 0.021, boosting: 0.012 },
  { variable: "Seul", foret: 0.013, boosting: 0.001 },
];
export const sansTitre = 82.0;
export const courbe = {
  train: [78.4, 80.6, 83.5, 84.5, 85.9, 87.7, 89.1, 90.5, 92.4, 93.6, 95.0, 96.2, 96.7, 97.2, 97.7],
  validation: [77.9, 78.2, 82.2, 82.3, 80.7, 81.7, 80.0, 80.0, 79.7, 79.2, 78.0, 78.6, 77.9, 77.1, 77.3],
  meilleure: 4,
};
export const grille = {
  profondeurs: [3, 5, 7, 9],
  feuilles: [1, 3, 5],
  scores: [[82.5, 82.6, 82.4], [82.3, 82.9, 82.8], [82.5, 82.0, 82.6], [82.6, 82.7, 82.5]],
  meilleur: { profondeur: 5, feuille: 3, score: 82.9 },
  boosting: 84.1,
};
export const pieges = { fuite: 100.0, vues: 98.1, validation: 80.5 };

/** le jeu « fuite ou pas fuite ? » */
export type Fuite = "fuite" | "propre";
export const VERDICTS_FUITE: Record<Fuite, { nom: string; definition: string }> = {
  fuite: { nom: "Fuite", definition: "la colonne contient la réponse, ou n'existe qu'une fois la réponse connue : impossible de la calculer pour un passager de test.csv" },
  propre: { nom: "Pas de fuite", definition: "l'information existait avant le naufrage, ou se calcule à partir de train seul, pour n'importe quel passager de test.csv" },
};
export type SituationFuite = { texte: string; reponse: Fuite; pourquoi: string };
export const situationsFuite: SituationFuite[] = [
  { texte: "On ajoute une colonne Canot qui vaut 1 pour les passagers montés dans un canot.", reponse: "fuite", pourquoi: "Être monté dans un canot, c'est presque avoir survécu. Le notebook le montre : avec la réponse déguisée, la forêt fait 100 %, et test.csv n'a pas cette colonne." },
  { texte: "On remplit les âges manquants de test.csv avec la médiane calculée sur train.", reponse: "propre", pourquoi: "La médiane ne dépend que des passagers d'entraînement, et elle s'applique à n'importe qui. C'est même la bonne pratique : ne jamais regarder test pour préparer." },
  { texte: "On ajoute le nombre de survivants parmi les passagers qui ont le même numéro de billet.", reponse: "fuite", pourquoi: "Pour fabriquer cette colonne, il faut connaître Survived. Sur train le score s'envole ; sur test.csv, la colonne ne se calcule pas." },
  { texte: "On ajoute le titre, Mr, Mrs, Miss, Master, extrait du nom.", reponse: "propre", pourquoi: "Le nom figure sur le billet, bien avant le naufrage, et test.csv le contient. C'est une variable créée, pas une réponse cachée." },
  { texte: "On ajoute la taille de la famille à bord, SibSp + Parch + 1.", reponse: "propre", pourquoi: "Deux colonnes connues à l'embarquement, présentes dans les deux fichiers : aucune trace de la survie dans le calcul." },
  { texte: "On ajoute le numéro d'identification des corps retrouvés après le naufrage.", reponse: "fuite", pourquoi: "Cette information n'existe que pour les victimes, donc seulement une fois la réponse connue. Un modèle qui s'en sert triche sans le savoir." },
];
