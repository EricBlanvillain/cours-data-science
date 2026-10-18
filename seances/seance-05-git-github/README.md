# Séance 5 · Git et GitHub : sauvegarder son travail en versions · ⭐

Niveau : ⭐ Débutant

Bloc 2 · Le métier de data scientist

Objectifs : comprendre pourquoi les développeurs versionnent leur travail, taper les vraies commandes Git (status, add, commit, log, diff, restore, .gitignore, push, pull) dans un dossier d'entraînement, puis mettre ses notebooks des séances 2 à 4 en ligne sur GitHub avec un README.

Déroulé (1 h 30)
- 15 min : Git avec l'analogie de la sauvegarde de jeu vidéo, les commandes add / commit / push / pull, ce qu'est un bon message de commit ; démo de l'onglet Commits d'un vrai dépôt
- 60 min : notebook `05_git_github.ipynb`, dans un dossier d'entraînement créé par le notebook (Git est déjà installé dans Colab)
  - sections 1 à 3 (15 min) : un dépôt, `status`, le premier commit, `log`
  - sections 4 et 5 (15 min) : changer et voir la différence (`diff`), revenir en arrière (`restore`, `show`), le troisième commit fait par chacun
  - sections 6 et 7 (10 min) : `.gitignore` pour une clé d'API, puis `push`, `clone` et `pull` avec un faux GitHub (un deuxième dossier) et un « deuxième ordinateur »
  - sections 8 et 9 (20 min) : le vrai GitHub depuis Colab (Fichier → Enregistrer une copie dans GitHub) pour les notebooks des séances 2 à 4, puis le README généré et un deuxième commit
- 15 min : partage : chacun montre son dépôt GitHub (notebooks, README, onglet Commits) et lit son meilleur message de commit

Si le temps manque : le push GitHub (section 8) se termine en séance, c'est le livrable ; le README peut se finir chez soi.

Notes d'animation (formateur)
- Sections 1 à 7 : « Git répond en anglais. Faire lire à voix haute les mots à repérer (untracked, modified, deleted) la première fois qu'ils apparaissent. »
- Section 8 : « Vérifier que chacun est connecté au bon compte GitHub dans Colab avant de lancer tout le monde : l'autorisation se fait une fois, la première fois. »

Entre deux séances (à la maison) : `05_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ dans un autre dépôt (le club cuisine du lycée), avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- Git expliqué visuellement, en jouant : https://learngitbranching.js.org/?locale=fr_FR
- Guide GitHub pour débuter : https://docs.github.com/fr/get-started/start-your-journey/hello-world
- L'aide-mémoire Git du cours : [`docs/aide-memoire-git.md`](../../docs/aide-memoire-git.md)

Ils repartent avec : leurs notebooks des séances 2 à 4 en ligne sur GitHub, avec un README et au moins deux commits.
