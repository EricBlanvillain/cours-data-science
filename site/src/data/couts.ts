/**
 * Séance optionnelle 1 · Les métiers de la data science : les prix et les chiffres montrés sur la page, chacun avec sa source
 * et sa date de vérification (règle du bloc 4). Les prix sont en dollars, comme sur les pages des fournisseurs ; les euros
 * se calculent ici, au taux de référence de la BCE du jour de vérification.
 *
 * Le notebook garde sa propre grille, « au 10/09/2026 » à 0,92 €/$ : on ne la recopie pas ici. Les écarts sont au compte
 * rendu du 30/09/2026 (même prix en dollars pour Haiku 4.5, Sonnet 5 et Opus 5 ; taux différent ; Sonnet 5 et Opus 5 passés
 * en « Legacy models », remplacés par Sonnet 5.5 et Opus 5.5).
 */
export const SOURCES = {
  claude: { titre: "tarifs de l'API Claude", url: "https://claude.com/pricing", verifie: "30/09/2026" },
  bce: { titre: "taux de référence de la BCE", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html", verifie: "30/09/2026" },
  runpod: { titre: "grille de prix de Runpod", url: "https://www.runpod.io/pricing", verifie: "30/09/2026" },
  pypi: { titre: "page d'accueil de PyPI", url: "https://pypi.org", verifie: "30/09/2026" },
};

/** 1 € = 1,1355 $ (BCE, 30/09/2026) */
export const DOLLARS_PAR_EURO = 1.1355;
export const enEuros = (dollars: number) => dollars / DOLLARS_PAR_EURO;

/** dollars par million de tokens, « Latest models » de la page de tarifs (prix de base, sans cache ni lot) */
export const modeles = [
  { taille: "petit", nom: "Claude Haiku 4.5", entree: 1, sortie: 5 },
  { taille: "moyen", nom: "Claude Sonnet 5.5", entree: 2, sortie: 10 },
  { taille: "grand", nom: "Claude Opus 5.5", entree: 4, sortie: 20 },
];

/** le cas du notebook (cellule 15) : 10 000 documents, 800 tokens en entrée et 60 en sortie par document */
export const CAS = { documents: 10_000, entree: 800, sortie: 60, echantillon: 100 };
export const coutEuros = (m: (typeof modeles)[number], documents: number) =>
  enEuros((documents * CAS.entree / 1e6) * m.entree + (documents * CAS.sortie / 1e6) * m.sortie);

/** une heure de GPU loué : A100 PCIe 80 Go, à la demande */
export const gpu = { nom: "A100 PCIe", dollarsHeure: 1.59 };

/** projets comptés sur la page d'accueil de PyPI */
export const projetsPypi = 904_513;

/** « 9,69 € » : deux décimales et la virgule, pour la page */
export const euros = (x: number, decimales = 2) => x.toFixed(decimales).replace(".", ",") + " €";
