/**
 * Le jeu « quel graphique pour quelle question ? » de la séance 2. Trois réponses possibles : barres, nuage de points,
 * histogramme. Les chiffres cités viennent de src/data/pokemon.ts (calculés sur le CSV du notebook).
 */
import { quartilesVitesse } from "./pokemon";

export type Graphique = "barres" | "nuage" | "histogramme";
export const GRAPHIQUES: Record<Graphique, { nom: string; sert: string }> = {
  barres: { nom: "Barres", sert: "comparer des catégories" },
  nuage: { nom: "Nuage de points", sert: "chercher un lien entre deux nombres" },
  histogramme: { nom: "Histogramme", sert: "voir comment une valeur se répartit" },
};

export type QuestionGraphique = { texte: string; reponse: Graphique; pourquoi: string };

export const questionsGraphiques: QuestionGraphique[] = [
  { texte: "Quel type de Pokémon est le plus fréquent ?", reponse: "barres", pourquoi: "On compare des catégories : une barre par type, la plus haute gagne. Ici Water, 112 Pokémon." },
  { texte: "Les Pokémon forts en attaque sont-ils aussi solides en défense ?", reponse: "nuage", pourquoi: "Deux nombres par Pokémon, attaque et défense : un point chacun, et on regarde si le nuage monte. Il monte un peu, corrélation 0,44." },
  { texte: "Comment se répartissent les points de vie ?", reponse: "histogramme", pourquoi: "Une seule valeur, les HP, et on veut voir la forme : où sont la plupart des Pokémon, où sont les rares. La moitié a 65 HP ou moins, un seul monte à 255." },
  { texte: "Quelle génération a les Pokémon les plus rapides, en moyenne ?", reponse: "barres", pourquoi: "Une moyenne par génération, six catégories à comparer : des barres. La première génération est en tête, 72,6 de vitesse moyenne." },
  { texte: "Un Pokémon rapide est-il fragile ?", reponse: "nuage", pourquoi: "Vitesse contre défense, deux nombres : un nuage de points. S'il descendait nettement, les rapides seraient fragiles ; il est très dispersé." },
  { texte: "Les vitesses sont-elles serrées autour d'une valeur, ou très étalées ?", reponse: "histogramme", pourquoi: `Une seule valeur, la vitesse, et on veut voir sa forme. La moitié centrale des Pokémon tient entre ${quartilesVitesse.q1} et ${quartilesVitesse.q3}, mais la queue court jusqu'à 180 : étalée vers la droite.` },
];
