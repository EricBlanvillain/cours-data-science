# Aide-mémoire Git et GitHub

Git garde l'historique des versions d'un projet. GitHub héberge ce projet en ligne. Dans l'atelier, la plupart des envois passent par **Fichier → Enregistrer une copie dans GitHub** dans Colab ; cette page sert à comprendre ce qui se passe dessous et à s'en servir à la main.

## Le vocabulaire

| Mot | Ce que c'est |
|---|---|
| Dépôt (*repository*, *repo*) | Le dossier du projet avec tout son historique |
| Commit | Un point de sauvegarde, avec un message et une date |
| Branche | Une ligne de versions ; `main` est la branche principale |
| Remote (`origin`) | L'adresse du dépôt sur GitHub |
| Clone | Copier un dépôt GitHub sur une machine |
| Push / pull | Envoyer ses commits vers GitHub / récupérer ceux de GitHub |
| README | Le fichier d'accueil du dépôt, en Markdown |
| `.gitignore` | La liste des fichiers que Git doit ignorer (secrets, gros fichiers) |

## Les 4 commandes de base (séance 3)

| Commande | Ce qu'elle fait |
|---|---|
| `git add fichier` (ou `git add .` pour tout) | Prépare le fichier pour le prochain commit |
| `git commit -m "Message"` | Crée la version avec un message |
| `git push` | Envoie sur GitHub |
| `git pull` | Récupère depuis GitHub |

Le cycle habituel : modifier → `add` → `commit` → `push`.

## Démarrer

| Commande | Ce qu'elle fait |
|---|---|
| `git clone https://github.com/nom/depot.git` | Copier un dépôt existant (le plus courant) |
| `git init` | Transformer un dossier en dépôt (nouveau projet) |
| `git remote add origin https://github.com/nom/depot.git` | Relier un dépôt local à GitHub |
| `git config --global user.name "Ton Nom"` | Dire à Git qui tu es (une fois) |
| `git config --global user.email "toi@exemple.fr"` | Idem pour le mail |

## Regarder où on en est

| Commande | Ce qu'elle fait |
|---|---|
| `git status` | Fichiers modifiés, ajoutés, non suivis |
| `git log --oneline` | L'historique en une ligne par commit |
| `git diff` | Ce qui a changé depuis le dernier commit |
| `git diff --staged` | Ce qui est prêt à être commité |

## Revenir en arrière

| Commande | Ce qu'elle fait |
|---|---|
| `git restore fichier` | Annuler les modifications non commitées d'un fichier |
| `git restore --staged fichier` | Retirer un fichier du prochain commit (sans perdre les modifs) |
| `git revert <id>` | Créer un commit qui annule un commit passé (sûr) |
| `git checkout <id> -- fichier` | Récupérer la version d'un fichier à un commit donné |

`git reset --hard` efface définitivement : à éviter tant qu'on débute.

## Branches (pour aller plus loin)

| Commande | Ce qu'elle fait |
|---|---|
| `git branch` | Lister les branches |
| `git switch -c essai` | Créer et aller sur une branche `essai` |
| `git switch main` | Revenir sur `main` |
| `git merge essai` | Fusionner `essai` dans la branche courante |

## Dans Colab

```bash
!git clone https://github.com/ton-nom/mon-portfolio-ia.git
%cd mon-portfolio-ia
!git config user.name "Ton Nom"
!git config user.email "toi@exemple.fr"
!cp /content/mon_notebook.ipynb projet-1/
!git add projet-1/mon_notebook.ipynb
!git commit -m "Projet 1 : première analyse"
!git push          # demande ton nom d'utilisateur et un token GitHub
```

Le token : sur GitHub, **Settings → Developer settings → Personal access tokens → Generate new token** (coche `repo`). Il remplace le mot de passe. Range-le dans les Secrets de Colab (icône clé), jamais dans une cellule.

## Écrire un bon message de commit

- Dire **ce que ça change et pourquoi**, pas « modifs » ou « update ».
- Bien : `Projet 2 : ajout du dashboard Plotly et du pitch`, `Corrige le calcul de la moyenne par type`.
- Un commit par étape logique, plutôt qu'un gros commit en fin de séance.

## `.gitignore` minimal

```
kaggle.json
.env
*.zip
data/*.csv
__pycache__/
```

## Erreurs fréquentes

| Message | Cause et parade |
|---|---|
| `fatal: not a git repository` | Tu n'es pas dans le dossier du dépôt : `%cd mon-portfolio-ia` |
| `rejected ... fetch first` | GitHub a des commits que tu n'as pas : `git pull` puis `git push` |
| `Authentication failed` | Mot de passe utilisé à la place du token |
| `nothing to commit` | Aucun changement, ou `git add` oublié |
| Conflit lors d'un `pull` | Le même fichier modifié des deux côtés : ouvre-le, garde la bonne version, `add`, `commit` |
