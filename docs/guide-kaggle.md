# Guide Kaggle

Kaggle, c'est le terrain d'entraînement des data scientists : des milliers de jeux de données, des notebooks en ligne et des compétitions avec un classement mondial. Tout est gratuit.

## 1. Créer un compte

1. Va sur https://www.kaggle.com et clique sur **Register**.
2. Inscris-toi avec ton compte Google (le même que pour Colab, c'est plus simple) ou avec une adresse mail.
3. Choisis un nom d'utilisateur : il apparaîtra dans le classement.
4. Pour télécharger des datasets et participer à une compétition, Kaggle demande de **vérifier ton numéro de téléphone** (Settings → Phone verification). Sans ça, certaines actions restent bloquées.

## 2. Trouver un dataset

- Menu **Datasets**, puis la barre de recherche (« pokemon », « netflix », « spotify »…).
- Sur la page d'un dataset, regarde : la taille (préfère les fichiers de moins de 50 Mo), la **description des colonnes** (onglet Data), le nombre de votes (un dataset très voté est en général propre).
- Onglet **Code** : les notebooks des autres sur ce dataset, une mine d'idées.

Les datasets utilisés dans l'atelier sont listés dans [../liens-utiles.md](../liens-utiles.md).

## 3. Télécharger un dataset

- Bouton **Download** en haut à droite de la page : tu reçois un `.zip`, dézippe-le, tu obtiens un ou plusieurs `.csv`.
- Ensuite, dépose le `.csv` dans Colab (voir [guide-colab.md](guide-colab.md), section 4).

Astuce : pour les datasets de l'atelier, les notebooks chargent automatiquement une copie publique par URL. Le téléchargement n'est vraiment nécessaire que pour la compétition Titanic.

## 4. La compétition Titanic (séances 7 et 8)

1. Va sur https://www.kaggle.com/competitions/titanic
2. Clique sur **Join Competition** et accepte les règles.
3. Onglet **Data** : télécharge `train.csv` (les passagers avec la réponse, `Survived`), `test.csv` (les passagers à prédire) et `gender_submission.csv` (un exemple de fichier de réponse).
4. Dépose `train.csv` et `test.csv` dans Colab.

Le classement (**Leaderboard**) est public : ton score y apparaît à chaque soumission. La « règle bête » (toutes les femmes survivent, aucun homme) donne 0,766. Le but est de faire mieux.

## 5. Soumettre une prédiction

Ton notebook produit un fichier `submission.csv` avec exactement deux colonnes :

```
PassengerId,Survived
892,0
893,1
...
```
(418 lignes, une par passager de `test.csv`, `Survived` vaut 0 ou 1.)

1. Télécharge `submission.csv` depuis Colab (panneau dossier → clic droit → Télécharger).
2. Sur la page de la compétition : **Submit Prediction** (ou **Submissions → Make Submission**).
3. Dépose le fichier, écris une description (« forêt aléatoire + variable Titre ») et **Submit**.
4. Le score s'affiche au bout de quelques secondes. Note-le dans ton notebook. Tu as droit à 10 soumissions par jour.

Erreurs fréquentes : mauvais nombre de lignes (il faut 418), colonne `Survived` avec des décimales au lieu de 0/1, une colonne d'index en trop (utilise `to_csv("submission.csv", index=False)`).

## 6. La ligne de commande `kaggle` (optionnel)

Pour télécharger et soumettre directement depuis Colab, sans passer par le navigateur.

**Créer sa clé** : sur Kaggle, **Settings → API → Create New Token**. Un fichier `kaggle.json` se télécharge. Il contient ton nom d'utilisateur et une clé secrète : ne le partage jamais, ne le pousse jamais sur GitHub.

**Dans Colab** :
```python
from google.colab import files
files.upload()                      # choisis kaggle.json
!mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json
```

| Commande | Ce qu'elle fait |
|---|---|
| `!kaggle competitions download -c titanic` | Télécharge les fichiers de la compétition (un zip) |
| `!unzip -o titanic.zip` | Dézippe `train.csv`, `test.csv` |
| `!kaggle competitions submit -c titanic -f submission.csv -m "mon message"` | Soumet ton fichier |
| `!kaggle competitions submissions -c titanic` | Liste tes soumissions et leurs scores |
| `!kaggle datasets download -d abcsds/pokemon` | Télécharge un dataset (le nom est dans l'URL de sa page) |
| `!kaggle datasets list -s netflix` | Cherche des datasets |

Documentation : https://www.kaggle.com/docs/api

## 7. Les notebooks Kaggle

Kaggle propose aussi ses propres notebooks en ligne (bouton **New Notebook** sur un dataset ou une compétition). Ils ressemblent à Colab, avec le dataset déjà monté dans `/kaggle/input/`. Dans l'atelier on reste sur Colab pour ne pas jongler entre deux outils, mais les deux marchent.
