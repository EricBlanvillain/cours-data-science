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
npm run audit        # après un build : audit de contraste et règle du cuivre sur 14 états (clics compris), en clair et en sombre
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
src/data/seances.ts             les 13 séances de la page d'accueil (titre, niveau, résumé, slug)
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

## Vérifier un fait

Toute date et tout chiffre affichés viennent de `src/data/frise.ts` ou `src/data/causes.ts`, où chaque entrée porte
`source` (l'URL consultée) et `verifie` (la date). Pour corriger ou ajouter un fait : chercher la source, l'écrire
dans l'objet, mettre la date du jour. Le lecteur voit la source au clic sur « source », sous chaque carte.

## Le système visuel

- Trois familles de couleurs, assignées par rôle : `ink` (fond sombre, texte sur fond clair), `cream` (fond clair), `copper`.
- **Le cuivre marque ce qui n'est pas résolu**, jamais décoratif : une question de quiz sans réponse, une séance pas encore
  commencée, une source en désaccord. Classes : `.ouvert` (texte), `.ouvert-bord`, `.pastille-ouverte`.
- Le cuivre ne passe pas 4,5:1 sur les deux fonds avec une seule valeur : `--cuivre-texte` vaut copper-ink (#a33f13) sur fond
  clair et copper-light (#e06a33) sur fond sombre ; `--cuivre-plein` (#c24a16) est un remplissage, jamais du texte.
  `npm run audit` vérifie ces règles sur les pages construites, dans chaque état atteint par clic (quiz avec et sans réponse,
  carte de frise dépliée, période active, écrans de la séance 0) ; la liste des états vit dans `scripts/audit-contrast.mjs`
  (`ETATS`) et ce qui n'est pas couvert y est écrit noir sur blanc (`NON_COUVERTS`). Un nouvel état interactif = une entrée à ajouter.
- Trois registres IBM Plex : le serif parle (titres), le sans explique (corps), le mono mesure (labels `.etiquette`, chiffres
  `.chiffre`, boutons). Interlettrage : label 0,14 em, wide 0,2 em, field 0,06 em. Transitions : `cubic-bezier(0.23, 1, 0.32, 1)`.
- Les états de survol sont limités aux appareils qui survolent (`@media (hover: hover)`, et Tailwind v4 fait de même pour `hover:`).

## Progression des séances (déblocage)

Trois états par séance, gardés dans le navigateur (localStorage, clé `cours-data-science-progression`) : à venir, ouverte,
terminée. La séance 0 est ouverte d'office ; terminer la séance N (bouton en bas de la leçon) ouvre la N+1. Rien n'est bloqué :
une séance à venir s'affiche avec un bandeau cuivre. Pour ouvrir une séance à la main : `?ouvrir=3` dans l'URL. Pour un nouveau
groupe : le lien « Réinitialiser » du pied de page, ou `?reinitialiser=1`. L'état est propre à l'appareil : une autre machine
repart de zéro, et c'est voulu. Le script vit dans `src/layouts/Base.astro` (classique, en ligne : il tourne aussi depuis le disque)
et expose `window.progression` (`etat`, `terminer`, `annuler`, `ouvrir`, `reinitialiser`, `restantes`).
