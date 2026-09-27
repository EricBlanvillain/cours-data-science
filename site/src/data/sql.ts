/**
 * Les chiffres de la séance 3, tous obtenus en SQL, dans une base SQLite en mémoire construite exactement comme le
 * notebook 03_sql_et_git.ipynb le fait : le CSV Pokémon
 *   https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
 * (Kaggle « Pokemon with stats », abcsds ; 800 lignes), colonnes renommées en français, table `pokemon` ; plus la table
 * `types` de dix lignes écrite à la main dans le notebook (section 5). Calculé le 27/09/2026 avec sqlite3 et pandas 2.3 :
 *
 *   SELECT name, type FROM sqlite_master                                              → pokemon, types
 *   SELECT nom, vitesse FROM pokemon WHERE type1 = 'Fire' ORDER BY vitesse DESC, nom LIMIT 3 → requeteExemple
 *   SELECT COUNT(*) FROM pokemon WHERE type1 = 'Fire'                                 → 52
 *   SELECT nom, vitesse FROM pokemon ORDER BY vitesse DESC, nom LIMIT 5               → DeoxysSpeed Forme 180 …
 *   SELECT COUNT(*) FROM pokemon WHERE legendaire = 1                                 → 65
 *   SELECT type1, ROUND(AVG(total), 1) FROM pokemon GROUP BY type1 ORDER BY 2 DESC    → Dragon 550.5, Steel 487.7, Flying 485.0
 *   SELECT COUNT(*) FROM pokemon AS p JOIN types AS t ON p.type1 = t.type             → 466
 *   SELECT COUNT(*) FROM pokemon AS p LEFT JOIN types AS t ON p.type1 = t.type WHERE t.type IS NULL → 334
 *   SELECT DISTINCT type1 … WHERE t.type IS NULL                                      → typesSansCorrespondance (8 types)
 *   SELECT t.faible_contre, COUNT(*) … GROUP BY t.faible_contre ORDER BY 2 DESC       → parFaiblesse (Water 128 en tête)
 *   SELECT COUNT(*) … WHERE t.fort_contre = 'Grass'                                   → 80
 *   SELECT generation, ROUND(AVG(pv), 1) FROM pokemon GROUP BY generation ORDER BY 2 DESC → pvParGeneration (4 : 73.1 … 1 : 65.8)
 *   SELECT nom, type1 FROM pokemon WHERE nom IN ('Charmander','Squirtle','Caterpie','Pikachu') → exempleJointure
 * Aucune valeur n'est inventée ; pour en changer, refaire la requête et coller le résultat ici.
 */
export const SOURCE = "https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv";
export const tables = [{ nom: "pokemon", lignes: 800, colonnes: 13 }, { nom: "types", lignes: 10, colonnes: 3 }];
/** la table `types` du notebook, telle quelle */
export const types = [
  { type: "Fire", fort_contre: "Grass", faible_contre: "Water" },
  { type: "Water", fort_contre: "Fire", faible_contre: "Electric" },
  { type: "Grass", fort_contre: "Water", faible_contre: "Fire" },
  { type: "Electric", fort_contre: "Water", faible_contre: "Ground" },
  { type: "Ground", fort_contre: "Electric", faible_contre: "Water" },
  { type: "Rock", fort_contre: "Fire", faible_contre: "Water" },
  { type: "Ice", fort_contre: "Grass", faible_contre: "Fire" },
  { type: "Psychic", fort_contre: "Fighting", faible_contre: "Bug" },
  { type: "Fighting", fort_contre: "Normal", faible_contre: "Psychic" },
  { type: "Flying", fort_contre: "Grass", faible_contre: "Electric" },
];
/** la requête du schéma « une requête se lit comme une phrase », et son résultat */
export const requeteExemple = {
  lignes: [
    { sql: "SELECT nom, vitesse", quoi: "quelles colonnes" },
    { sql: "FROM pokemon", quoi: "quelle table" },
    { sql: "WHERE type1 = 'Fire'", quoi: "quelle condition sur les lignes" },
    { sql: "ORDER BY vitesse DESC", quoi: "dans quel ordre" },
    { sql: "LIMIT 3", quoi: "combien de lignes" },
  ],
  resultat: [{ nom: "Talonflame", vitesse: 126 }, { nom: "Infernape", vitesse: 108 }, { nom: "Pyroar", vitesse: 106 }],
  surCombien: 52,
};
export const nbFeu = 52;
export const nbLegendaires = 65;
export const plusRapide = { nom: "DeoxysSpeed Forme", vitesse: 180 };
export const totalMoyenTop3 = [{ type: "Dragon", moyenne: 550.5 }, { type: "Steel", moyenne: 487.7 }, { type: "Flying", moyenne: 485.0 }];
/** quatre Pokémon du schéma de la jointure : trois trouvent leur type dans `types`, Caterpie non */
export const exempleJointure = [
  { nom: "Charmander", type1: "Fire" },
  { nom: "Squirtle", type1: "Water" },
  { nom: "Caterpie", type1: "Bug" },
  { nom: "Pikachu", type1: "Electric" },
];
export const nbJointure = 466;
export const nbSansCorrespondance = 334;
export const typesSansCorrespondance = ["Bug", "Dark", "Dragon", "Fairy", "Ghost", "Normal", "Poison", "Steel"];
export const parFaiblesse = [{ faible_contre: "Water", n: 128 }, { faible_contre: "Electric", n: 116 }, { faible_contre: "Fire", n: 94 }, { faible_contre: "Bug", n: 57 }, { faible_contre: "Ground", n: 44 }, { faible_contre: "Psychic", n: 27 }];
export const nbFortsContreHerbe = 80;
export const pvParGeneration = [{ generation: 4, pv: 73.1 }, { generation: 5, pv: 71.8 }, { generation: 2, pv: 71.2 }, { generation: 6, pv: 68.3 }, { generation: 3, pv: 66.5 }, { generation: 1, pv: 65.8 }];
