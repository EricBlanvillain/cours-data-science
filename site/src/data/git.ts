/**
 * Git et GitHub pour la séance 3 : les quatre commandes du notebook (section 6) et le jeu « quelle commande git ? ».
 * Les messages de commit sont ceux du notebook (cellule README de la section 6 et exercice 11 du carnet d'exercices).
 * Ce que fait chaque commande : https://git-scm.com/docs (git-add, git-commit, git-push, git-pull), vérifié le 27/09/2026.
 * Ce que fait Colab d'un clic : « Fichier → Enregistrer une copie dans GitHub » écrit le commit directement dans le dépôt, sur
 * la branche choisie (Colab n'a pas de dépôt local) : cela revient à add, commit et push. Ouvrir un notebook depuis l'onglet
 * GitHub revient à un pull. https://colab.research.google.com/github/googlecolab/colabtools/blob/main/notebooks/colab-github-demo.ipynb.
 */
export type Commande = "add" | "commit" | "push" | "pull";
export const COMMANDES: Record<Commande, { nom: string; sert: string; jeu: string }> = {
  add: { nom: "git add", sert: "choisir les fichiers qui entreront dans la prochaine sauvegarde", jeu: "choisir ce qu'on met dans la sauvegarde" },
  commit: { nom: "git commit -m", sert: "créer le point de sauvegarde, avec un message qui dit pourquoi", jeu: "créer le point de sauvegarde" },
  push: { nom: "git push", sert: "envoyer ses sauvegardes sur GitHub", jeu: "envoyer la sauvegarde sur le cloud" },
  pull: { nom: "git pull", sert: "récupérer ce qui a changé sur GitHub", jeu: "récupérer la sauvegarde sur une autre console" },
};
export const ORDRE: Commande[] = ["add", "commit", "push", "pull"];

/** les points de sauvegarde du schéma : trois messages qui disent l'intention, pris dans le notebook */
export const commits = [
  "Ajoute mon analyse Pokémon : 3 questions, 3 graphiques",
  "Ajoute un README qui explique le projet",
  "Corrige le calcul de la moyenne des PV",
];
export const mauvaisMessages = ["modif", "test", "fichier final v2"];

export type Situation = { texte: string; reponse: Commande; pourquoi: string };
export const situations: Situation[] = [
  { texte: "Tu veux choisir quels fichiers modifiés entreront dans la prochaine sauvegarde.", reponse: "add", pourquoi: "add ne sauvegarde rien encore : il met de côté ce qui fera partie du prochain point de sauvegarde. Le commit vient après." },
  { texte: "Tu veux créer le point de sauvegarde, avec un message qui dit ce que tu as fait.", reponse: "commit", pourquoi: "Le commit enregistre une version. Son message est lu par celui qui relira l'historique : « Corrige le calcul de la moyenne des PV » dit tout, « modif » ne dit rien." },
  { texte: "Tes sauvegardes sont sur ton ordinateur ; tu veux qu'elles apparaissent sur GitHub.", reponse: "push", pourquoi: "Un commit reste sur la machine où il a été fait. push copie tes commits sur GitHub ; sans lui, ton dépôt en ligne ne bouge pas." },
  { texte: "Tu ouvres ton projet sur un autre ordinateur et tu veux la dernière version qui est sur GitHub.", reponse: "pull", pourquoi: "pull rapatrie ce qui a changé sur GitHub, dans l'autre sens que push. Dans Colab, ouvrir un notebook depuis l'onglet GitHub revient à un pull." },
  { texte: "Tu as trois fichiers modifiés, mais tu ne veux en sauvegarder qu'un seul.", reponse: "add", pourquoi: "C'est exactement le rôle de add : choisir. Tu ajoutes le seul fichier voulu, puis le commit ne contient que lui." },
  { texte: "Dans Colab, « Enregistrer une copie dans GitHub » revient à trois commandes d'un clic. Laquelle n'en fait pas partie ?", reponse: "pull", pourquoi: "Le clic revient à add, commit et push : Colab prend le notebook, écrit le point de sauvegarde avec ton message directement dans ton dépôt GitHub. pull, c'est l'inverse : récupérer." },
];
