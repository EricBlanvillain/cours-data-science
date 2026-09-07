# Guide GitHub

GitHub, c'est l'endroit où les développeurs rangent leur code, en gardant l'historique de chaque version. Pour toi, c'est ton **portfolio** : à la fin de l'atelier, tes 4 projets y seront, visibles par n'importe qui avec un lien.

## 1. Créer un compte

1. Va sur https://github.com et clique sur **Sign up**.
2. Adresse mail, mot de passe, nom d'utilisateur. Le nom d'utilisateur sera dans l'adresse de ton portfolio (`github.com/ton-nom`) : choisis-le sobre, tu le garderas longtemps.
3. Confirme ton adresse mail. Le compte gratuit suffit pour tout l'atelier.

## 2. Créer un dépôt (*repository*)

Un dépôt, c'est un dossier de projet sur GitHub.

1. Bouton **+** en haut à droite → **New repository**.
2. Nom : `mon-portfolio-ia`.
3. Description : « Mes projets de l'atelier Data & IA ».
4. **Public** (pour pouvoir le montrer).
5. Coche **Add a README file**.
6. **Create repository**.

Tu peux faire un seul dépôt avec un dossier par projet (le plus simple), ou un dépôt par projet.

## 3. Écrire un README

Le `README.md` est la page d'accueil de ton dépôt. Il est écrit en Markdown (le même que les cellules de texte de Colab). Pour l'éditer : clique sur le fichier, puis sur le crayon.

Un bon README de projet tient en 5 parties :

```markdown
# Projet 1 · Analyse des ventes de jeux vidéo

## Le problème
Quelles plateformes et quels genres vendent le plus, et est-ce que ça change avec le temps ?

## Les données
Dataset Kaggle « Video Game Sales » (16 000 jeux, 1980-2016). Lien : ...

## Ce que j'ai fait
- Nettoyage des années manquantes
- 3 questions, 3 graphiques (barres, courbe, histogramme)

## Ce que j'ai trouvé
Les ventes de jeux de sport explosent après 2005 avec la Wii. ...

## Comment le relancer
Ouvrir `01_analyse.ipynb` dans Colab et tout exécuter.
```

Markdown en 30 secondes : `# Titre`, `## Sous-titre`, `- liste`, `**gras**`, `` `code` ``, `[texte](lien)`, `![image](chemin.png)`.

## 4. Pousser un notebook depuis Colab (la méthode de l'atelier)

Pas besoin de ligne de commande :

1. Dans Colab : **Fichier → Enregistrer une copie dans GitHub**.
2. Autorise Colab la première fois.
3. Choisis le dépôt `mon-portfolio-ia`, le chemin (`projet-1/02_python_pour_la_data.ipynb`), un message de commit clair, et **OK**.

Va sur ton dépôt : le notebook y est, lisible directement dans le navigateur, avec un bouton « Open in Colab ».

Pour ajouter un fichier qui n'est pas un notebook (un `.csv`, une image) : sur la page du dépôt, **Add file → Upload files**.

## 5. Les 4 commandes Git (pour comprendre ce qui se passe)

Git, c'est l'outil ; GitHub, c'est le site qui héberge. Quand tu utilises la ligne de commande (dans Colab avec `!`, ou sur ton ordinateur), tout passe par 4 commandes :

| Commande | Ce qu'elle fait | Analogie |
|---|---|---|
| `git add fichier.ipynb` | Met le fichier dans la liste de ce qu'on va sauvegarder | Tu choisis ce que tu mets dans le carton |
| `git commit -m "message"` | Crée une version (un point de sauvegarde) avec un message | Tu fermes le carton et tu écris dessus |
| `git push` | Envoie tes versions sur GitHub | Tu envoies le carton au garde-meuble |
| `git pull` | Récupère les versions qui sont sur GitHub | Tu récupères ce que tu (ou un autre) as envoyé |

Avant tout ça, une seule fois : `git clone https://github.com/ton-nom/mon-portfolio-ia.git` pour copier le dépôt sur la machine.

Un cycle complet dans Colab :
```bash
!git clone https://github.com/ton-nom/mon-portfolio-ia.git
%cd mon-portfolio-ia
!cp ../mon_notebook.ipynb projet-1/
!git add projet-1/mon_notebook.ipynb
!git commit -m "Projet 1 : première analyse"
!git push
```
Le `push` demande ton nom d'utilisateur et un **token** (pas ton mot de passe) : Settings → Developer settings → Personal access tokens. C'est pour ça qu'à l'atelier on préfère « Enregistrer une copie dans GitHub », qui gère tout ça pour toi.

Le détail des commandes est dans [aide-memoire-git.md](aide-memoire-git.md).

## 6. Ce qu'on ne pousse jamais sur GitHub

- Les clés d'API et les fichiers de secrets (`kaggle.json`, `.env`).
- Les données personnelles (les tiennes ou celles des autres).
- Les gros fichiers de données (plus de 50 Mo) : mets un lien vers la source à la place.

Un dépôt public est lisible par tout le monde, pour toujours (même si tu supprimes un fichier, il reste dans l'historique).

## 7. Check-list du portfolio final (séance 12)

- [ ] Le dépôt est public et a un README d'accueil qui liste les 4 projets avec un lien vers chacun
- [ ] Chaque projet a son notebook et son README (problème, données, démarche, résultat, comment relancer)
- [ ] Les notebooks s'ouvrent dans Colab et s'exécutent de haut en bas sans erreur
- [ ] Aucune clé, aucun mot de passe, aucun fichier personnel
- [ ] Les messages de commit disent ce qui a été fait
