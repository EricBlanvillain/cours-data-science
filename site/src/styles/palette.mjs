/**
 * La palette, source unique pour le script d'audit (scripts/audit-contrast.mjs).
 * Les mêmes valeurs sont écrites dans global.css ; l'audit vérifie qu'elles n'ont pas divergé.
 *
 * Trois familles, assignées par rôle et non par teinte.
 * LA RÈGLE QUI GOUVERNE LA PAGE : LE CUIVRE MARQUE CE QUI N'EST PAS RÉSOLU — la question sans réponse,
 * l'exercice pas encore fait, la séance pas encore commencée, la source en désaccord. Rien d'autre n'est cuivre.
 *
 * Le cuivre ne passe pas 4,5:1 sur les deux fonds avec une seule valeur : il en porte trois, et LA VALEUR LÉGALE
 * DÉPEND DU FOND. Se tromper est un bug de contraste que seul l'audit attrape.
 *   copper        #c24a16  REMPLISSAGE UNIQUEMENT, jamais du texte (cream dessus = 4,70:1 ✅ ; en texte sur ink 3,67:1 ✗)
 *   copper-ink    #a33f13  TEXTE sur fond CLAIR   (6,14:1 sur cream, 5,58:1 sur cream-sunk)
 *   copper-light  #e06a33  TEXTE sur fond SOMBRE  (5,38:1 sur ink ; 3,21:1 sur cream ✗)
 */
export const palette = {
  ink: { DEFAULT: "#14171a", raised: "#1e2226", soft: "#2a2f34" },
  cream: { DEFAULT: "#fbfaf8", sunk: "#f1efea" },
  copper: { DEFAULT: "#c24a16", ink: "#a33f13", light: "#e06a33" },
};

/** Les couples texte/fond autorisés pour le cuivre, par fond. Il n'existe volontairement AUCUN fond cuivre atténué :
 *  l'état « question ouverte » se marque par un filet cuivre sur le fond de la page, jamais par une teinte de fond. */
export const copperRules = {
  onLight: palette.copper.ink,   // sur cream et cream-sunk
  onDark: palette.copper.light,  // sur ink, ink-raised, ink-soft
  fillOnly: palette.copper.DEFAULT,
};
