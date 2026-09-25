# Site du cours

Le site porte l'explication (15 minutes par séance, devant l'écran) ; la pratique reste dans les notebooks du dépôt.
Astro en sortie statique, React uniquement pour les composants interactifs, Tailwind, contenu des leçons en MDX.
Polices IBM Plex (serif, sans, mono) installées en local via @fontsource : le site ne charge rien depuis un domaine externe.

## Commandes

```sh
cd site
npm install          # une fois
npm run dev          # http://localhost:4321, rechargement à chaud
npm run build        # construit dist/ puis le rend ouvrable hors ligne (scripts/relativize.mjs)
npm run preview      # sert dist/ comme le ferait un hébergeur
npm run audit        # après un build : audit de contraste et règle du cuivre sur 31 états (clics compris), en clair et en sombre
```

## Secours hors ligne (le wifi lâche pendant une séance)

```sh
./site/servir-local.sh
```

Le script affiche l'URL, ouvre le navigateur dessus et sert `dist/` sans réseau. Il faut avoir lancé `npm run build`
une fois avant, avec le réseau. Sans serveur du tout, `dist/index.html` s'ouvre aussi en double-cliquant : tout se lit,
mais les composants interactifs (frise, quiz, écrans de la séance 0) restent figés à leur rendu initial, parce que les
navigateurs bloquent les scripts de type module en `file://`.

## Où sont les choses

```
src/content/lecons/*.mdx        le texte des leçons : c'est là qu'on écrit, sans toucher au code
src/data/seances.ts             les 13 séances (titre, niveau, résumé, dossier GitHub, slug de la leçon)
src/data/frise.ts               les jalons de la frise 1950 → aujourd'hui, avec source et date de vérification
src/data/causes.ts              les trois cartes « Pourquoi maintenant », avec source et date de vérification
src/data/questions.ts           les exemples du quiz classification / régression
src/components/schemas/         les schémas SVG (trois cercles, carte du ML, réseau de neurones)
src/components/islands/         les composants React (frise, quiz, écrans de la séance 0)
src/pages/                      accueil et page de leçon générique (la séance 0 est une leçon MDX qui pose l'îlot des cinq écrans)
src/styles/global.css           thème clair / sombre, registres typographiques, classes partagées
src/styles/palette.mjs          la palette, source unique pour l'audit
scripts/relativize.mjs          post-build : chemins relatifs (pages, polices) + vérification des cibles et de l'absence de ressource externe
scripts/audit-contrast.mjs      mesure chaque texte contre son fond composité dans Chrome headless, sans dépendance
```

## Écrire une leçon

Un fichier `src/content/lecons/seance-NN-titre.mdx` avec en tête :

```yaml
---
numero: 2
titre: Python pour la data
niveau: ⭐
resume: Une phrase.
livrable: Ce qu'on repart avec.
---
```

puis du Markdown. Un composant s'importe en tête du fichier et se pose dans le texte
(`<TroisCercles />`, ou `<Frise client:load />` pour un composant React). Ajoute ensuite le `slug`
dans `src/data/seances.ts` pour que la carte de la page d'accueil devienne cliquable.

## Une figure remplace son explication

Règle structurante des leçons : après un schéma ou un graphique, au plus une légende d'une ligne ; aucun récapitulatif en
puces de ce que la figure montre. Si le lecteur a besoin d'un paragraphe pour comprendre la figure, c'est la figure qu'on
refait. Budget par bloc : une idée, un chiffre, moins de 80 mots visibles ; nuances, chiffres secondaires et sources vont
derrière un repli (`<details><summary>…</summary>` dans le MDX, stylé par `.prose > details`). Les séries chiffrées sont des
courbes SVG écrites à la main (`schemas/Courbe.astro`, données et sources dans `src/data/causes.ts`), échelle logarithmique
annoncée sur le graphique quand elle sert, cuivre réservé à l'annotation du point mis en avant.

## Le cadre d'une leçon

Trois champs optionnels du frontmatter, pour pouvoir les lister ailleurs un jour : `objectifs` (3 puces au plus, en
« tu sauras… », rendues en tête), `aRetenir` (5 lignes au plus, une idée par ligne, rendues en pied avant la navigation), et
`duree` (à écrire explicitement : « 1 h 30 »). Le mini-quiz de fin de leçon vient de `src/data/quiz.ts`, une entrée par
séance, quatre questions écrites depuis le contenu réel de la page ; une séance sans entrée n'a pas de quiz (séance 0).
Composant `islands/Quiz.tsx` : une question à la fois, validation explicite, explication qui reste lisible, score, reprise ;
clavier `1` à `4`, flèches, `Entrée` dès que le focus est dans le quiz ; cuivre sur la question tant qu'elle n'est pas validée,
juste et faux distingués par la forme et le libellé, jamais par la couleur seule.

## Vérifier un fait

Toute date et tout chiffre affichés viennent de `src/data/frise.ts` ou `src/data/causes.ts`, où chaque entrée porte
`source` (l'URL consultée) et `verifie` (la date). Pour corriger ou ajouter un fait : chercher la source, l'écrire
dans l'objet, mettre la date du jour. Le lecteur voit la source au clic sur « source », sous chaque carte.

## Le système visuel

- Trois familles de couleurs, assignées par rôle : `ink` (fond sombre, texte sur fond clair), `cream` (fond clair), `copper`.
- **Le cuivre marque ce qui n'est pas résolu**, jamais décoratif : une question de quiz sans réponse, la séance en cours (une
  seule), une source en désaccord. Classes : `.ouvert` (texte), `.ouvert-bord`, `.pastille-ouverte`.
- Le cuivre ne passe pas 4,5:1 sur les deux fonds avec une seule valeur : `--cuivre-texte` vaut copper-ink (#a33f13) sur fond
  clair et copper-light (#e06a33) sur fond sombre ; `--cuivre-plein` (#c24a16) est un remplissage, jamais du texte.
  `npm run audit` vérifie ces règles sur les pages construites, dans chaque état atteint par clic (quiz avec et sans réponse,
  carte de frise dépliée, période active, écrans de la séance 0) ; la liste des états vit dans `scripts/audit-contrast.mjs`
  (`ETATS`) et ce qui n'est pas couvert y est écrit noir sur blanc (`NON_COUVERTS`). Un nouvel état interactif = une entrée à ajouter.
- Le cuivre marque l'état, jamais le contenant : quand plusieurs éléments non résolus coexistent (les six cartes du quiz), seul
  le libellé de statut est cuivre, la bordure des cartes reste le filet neutre. Le libellé passe au neutre dès que c'est résolu,
  la carte ne change pas.
- Sur les séances, le cuivre marque **la séance en cours** (état « En cours », `ouverte` dans le code), et elle seule : pastille et libellé cuivre sur sa
  carte, pastille cuivre et texte appuyé dans la barre latérale. C'est le même fait montré à deux endroits. Les séances pas encore
  ouvertes sont neutres, pastille vide : douze séances futures en cuivre seraient douze faits distincts.
- Flèches : `→` mène à une page du site, `↗` à une destination externe (Colab, GitHub). Jamais l'une pour l'autre.
- Le pied d'une carte de séance a trois éléments, dans cet ordre, qui répondent à des questions distinctes :
  1. **disponibilité** : « Leçon en ligne · notebooks » ou « Notebooks seuls · leçon à écrire ». Un fait sur le site, il ne change
     jamais pour un élève donné, jamais cuivre.
  2. **état de l'élève** : « Pas encore ouverte » (pastille vide), « En cours » (pastille cuivre), « Terminée »
     (pastille pleine). Sa progression sur cet appareil ; c'est lui qui porte le cuivre, sur « En cours » seulement.
  3. **action** : vide si pas encore ouverte (le déblocage sert à ne pas commencer la suivante par accident, on n'annonce pas la
     porte ; le titre reste cliquable) ; « Ouvrir la leçon → » ou « Ouvrir les notebooks ↗ » si en cours ; « Relire la leçon → »
     ou « Revoir les notebooks ↗ » si terminée. La bande garde la hauteur d'un bouton même vide.
- Trois registres IBM Plex : le serif parle (titres), le sans explique (corps), le mono mesure (labels `.etiquette`, chiffres
  `.chiffre`, boutons). Interlettrage : label 0,14 em, wide 0,2 em, field 0,06 em. Transitions : `cubic-bezier(0.23, 1, 0.32, 1)`.
- Les états de survol sont limités aux appareils qui survolent (`@media (hover: hover)`, et Tailwind v4 fait de même pour `hover:`).
- **Toute rangée de cartes passe par la grille alignée** (`.grille-cartes`, composant `GrilleCartes.astro` côté Astro, les
  classes directement côté React). La rangée impose ses bandes à toutes ses cartes (subgrid) : titre, description, pied
  démarrent à la même hauteur quelle que soit la longueur des textes, et toutes les cartes d'une rangée font la même hauteur.
  Contrat : `--bandes` = nombre d'enfants directs de chaque carte, exactement ; un contenu optionnel vit dans la bande qui
  l'accueille ; le dernier enfant porte `.bande-pied` pour coller au bas. Pas de `grid`/`flex` posé à la main pour des cartes.

## Les largeurs

Le conteneur fait 1120 px sur l'accueil et 1360 px sur les pages à barre latérale (`body.page-barre`), en-tête et hero compris
pour garder la même verticale. La largeur en plus va aux cartes, à la frise et au sommaire ; la colonne de prose garde son
plafond de 46 rem quelle que soit la page : dans le texte lu, rien ne change.

## En séance : les raccourcis clavier

- **Écrans de la séance 0** : `←` et `→` changent d'écran, où que soit le focus (sauf dans un champ de saisie, où les flèches
  déplacent le curseur). La navigation est épinglée au bas de la fenêtre : jauge, position (« 2 / 5 · C'est quoi l'IA ? »),
  Précédent, Suivant. Changer d'écran ramène au début de l'écran, pas au haut de la page.
- **Frise de la séance 1** : cliquer une fois sur la bande, puis `←` `→` d'un jalon à l'autre, `Début` et `Fin` pour les bouts.
- **Mini-quiz** : `Tab` jusqu'au quiz, `1` à `4` pour choisir, `Entrée` pour valider puis passer à la suivante.
- **Terminer une séance** : bouton en bas de la leçon ; `?ouvrir=N` dans l'URL pour ouvrir une séance à la main.

## La barre latérale (leçons et pages transverses)

`src/components/Laterale.astro`, posée par `Base.astro` quand une page passe `barre` (et `courant={n}` pour mettre la séance
de la page en avant). Elle montre les blocs en sur-titre, les séances numérotées avec une pastille, un séparateur, les pages
transverses **qui existent** (aujourd'hui : Glossaire ; pas d'entrée grisée pour ce qui n'est pas écrit), et en bas
« Séances terminées · N / 13 » avec sa jauge. Mêmes faits et même vocabulaire que les cartes : terminée = pastille pleine, texte
neutre ; en cours = pastille cuivre, texte appuyé ; pas encore ouverte = pastille vide, texte neutre ; leçon en préparation =
titre en retrait sans lien, libellé « Notebooks seuls · leçon à écrire », la pastille suit la progression. Repliable (bouton en
tête du contenu, état gardé dans le navigateur, clé `cours-data-science-barre`) ; sous 900 px, c'est un menu en haut, fermé par
défaut. Sans JavaScript, dépliée sur grand écran.

## Le thème

Trois positions dans l'en-tête : Système (défaut), Clair, Sombre. Le choix est gardé dans le navigateur (clé
`cours-data-science-theme`) et posé sur `<html data-theme>` avant le premier rendu. En CSS, les valeurs sombres existent deux
fois, à l'identique : sous `prefers-color-scheme: dark` pour le mode système, et sous `[data-theme="sombre"]` pour le mode forcé ;
modifier l'une, c'est modifier l'autre. `npm run audit` mesure les deux thèmes forcés dans les deux passes.

## Les pages transverses

Le glossaire est `docs/glossaire.md` rendu tel quel (collection `docs`, `src/pages/glossaire.astro`) : on ne recopie rien, on
corrige le fichier. Infos pratiques, quiz final et recherche viendront plus tard ; ils n'apparaissent nulle part d'ici là.

## Progression des séances (déblocage)

Trois états par séance, gardés dans le navigateur (localStorage, clé `cours-data-science-progression`) : pas encore ouverte
(`a-venir` dans le code), en cours (`ouverte` dans le code), terminée. La séance 0 est ouverte d'office ; terminer la séance N (bouton en bas de la leçon)
ouvre la N+1. Rien n'est bloqué : une séance pas encore ouverte s'affiche avec un bandeau cuivre. Pour ouvrir une séance à la main : `?ouvrir=3` dans l'URL. Pour un nouveau
groupe : le lien « Réinitialiser » du pied de page, ou `?reinitialiser=1`. L'état est propre à l'appareil : une autre machine
repart de zéro, et c'est voulu. Le script vit dans `src/layouts/Base.astro` (classique, en ligne : il tourne aussi depuis le disque)
et expose `window.progression` (`etat`, `terminer`, `annuler`, `ouvrir`, `reinitialiser`, `restantes`).
