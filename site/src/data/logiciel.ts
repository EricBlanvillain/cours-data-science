/**
 * Séance optionnelle 2 · Software engineering : les mesures montrées sur la page, tirées de deux passages réels du notebook
 * seances-optionnelles/seance-optionnelle-2-software-engineering/SO2_software_engineering.ipynb (exécution complète,
 * solutions injectées comme par scripts/recette/recette.py --solutions), le même jour, sur la même machine.
 *
 * Machine : Apple M3, 16 Go de mémoire, macOS 26.6.2 · Python 3.13.12 · NumPy 2.1.3 · pandas 2.2.3 ·
 * compilateur C : Apple clang 21.0.0 (appelé par `gcc -O2`, cellule 7) · le 30/09/2026.
 * Un temps dépend de la machine, et même du passage : sur Colab, l'élève mesure les siens dans le notebook, et ils seront
 * différents. Aucun facteur de cette page ne vaut ailleurs que sur cette machine.
 */
export const MACHINE = { puce: "Apple M3", python: "3.13.12", numpy: "2.1.3", pandas: "2.2.3", date: "30/09/2026" };

/** le même calcul, somme de sqrt(i) × 2 + 1 pour i de 0 à 4 999 999 (cellules 3, 4, 8), en secondes, deux passages */
export const temps = [
  { qui: "boucle Python", passages: [0.373, 0.351] },
  { qui: "NumPy", passages: [0.013, 0.020] },
  { qui: "C compilé", passages: [0.017, 0.019] },
];
/** facteurs affichés par la cellule 4 (« NumPy est ×… plus rapide ») aux deux passages */
export const facteursNumpy = [30, 18];

/** le tableau de 300 000 lignes (cellules 23, 25, 27) : poids mesuré avec memory_usage(deep=True), identique aux deux passages */
export const memoire = [
  { etat: "texte en object", detail: "ville et categorie", mo: 38.6 },
  { etat: "ville en category", detail: "−42 %", mo: 22.5 },
  { etat: "les deux en category", detail: "−86 %", mo: 5.4 },
];

/** compiler calcul.c (cellule 7), en secondes, aux deux passages ; à comparer aux temps du C ci-dessus */
export const compilation = [0.439, 0.464];

/** les faits sur Colab cités par la page (règle du bloc 4 : source et date de vérification) */
export const SOURCES = {
  colab: {
    titre: "FAQ de Google Colab",
    url: "https://research.google.com/colaboratory/faq.html",
    verifie: "30/09/2026",
    dit: "gratuit, accès gratuit à des GPU ; dans la version gratuite, un notebook tourne au plus 12 heures ; la machine virtuelle est effacée après une période d'inactivité",
  },
};
