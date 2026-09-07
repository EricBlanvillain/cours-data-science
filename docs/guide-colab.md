# Guide Google Colab

Colab, c'est un carnet Python (un *notebook*) qui tourne dans ton navigateur, sur un ordinateur de Google. Rien à installer. Il te faut juste un compte Google.

## 1. Ouvrir un notebook

- Va sur https://colab.research.google.com et connecte-toi.
- **Fichier → Nouveau notebook** pour partir de zéro.
- **Fichier → Importer un notebook** pour ouvrir un fichier `.ipynb` de l'atelier (onglet « Importer » depuis ton ordinateur, ou onglet « GitHub » en collant l'adresse du dépôt).
- Renomme le notebook en cliquant sur son nom en haut à gauche (`Untitled0.ipynb` → `02_python_pour_la_data.ipynb`).

## 2. Exécuter du code

| Action | Comment |
|---|---|
| Exécuter la cellule et passer à la suivante | `Maj + Entrée` |
| Exécuter la cellule et rester dessus | `Ctrl + Entrée` (`Cmd + Entrée` sur Mac) |
| Ajouter une cellule de code | bouton **+ Code** ou `Ctrl + M` puis `B` |
| Ajouter une cellule de texte | bouton **+ Texte** |
| Tout exécuter depuis le début | **Exécution → Tout exécuter** |
| Arrêter une cellule qui tourne trop longtemps | le bouton carré à gauche de la cellule |
| Repartir de zéro (mémoire vidée) | **Exécution → Redémarrer la session** |

Le petit numéro `[3]` à gauche d'une cellule dit dans quel ordre elle a été exécutée. Si une variable est « inconnue », c'est souvent que la cellule qui la définit n'a pas encore tourné : remonte et exécute-la.

Les cellules qui commencent par `!` lancent une commande système, par exemple `!pip install plotly` pour installer une bibliothèque.

## 3. Activer le GPU T4 (séances 9 à 12)

Les modèles de langage ont besoin d'une carte graphique. Colab en prête une gratuitement.

1. **Exécution → Modifier le type d'exécution**
2. Accélérateur matériel : **T4 GPU**
3. **Enregistrer**. La session redémarre, il faut relancer les cellules.

Pour vérifier : une cellule avec `!nvidia-smi` doit afficher « Tesla T4 ». Le GPU gratuit est limité en temps : ferme le notebook quand tu as fini, ne le laisse pas tourner pour rien.

## 4. Uploader un fichier (par exemple `train.csv` de Kaggle)

Méthode 1, par le panneau :
1. Clique sur l'icône **dossier** dans la barre de gauche.
2. Clique sur l'icône **upload** (feuille avec une flèche) et choisis ton fichier.
3. Le fichier apparaît dans la liste. Dans le code : `pd.read_csv("train.csv")`.

Méthode 2, par le code :
```python
from google.colab import files
files.upload()   # ouvre une fenêtre pour choisir le fichier
```

Attention : les fichiers uploadés **disparaissent quand la session se ferme**. Il faut les redéposer à chaque fois, ou passer par Drive.

## 5. Enregistrer sur Google Drive

Colab enregistre automatiquement ton notebook dans ton Drive, dossier **Colab Notebooks**. Tu peux aussi faire **Fichier → Enregistrer une copie dans Drive**.

Pour lire ou écrire des fichiers de données depuis Drive :
```python
from google.colab import drive
drive.mount("/content/drive")
df = pd.read_csv("/content/drive/MyDrive/atelier/train.csv")
```
Une fenêtre demande l'autorisation d'accéder à ton Drive : accepte.

## 6. Enregistrer sur GitHub (séances 3, 8, 12)

1. **Fichier → Enregistrer une copie dans GitHub**
2. La première fois, Colab demande l'autorisation d'accéder à ton compte GitHub : accepte.
3. Choisis le dépôt (`mon-portfolio-ia`), garde la branche `main`, vérifie le chemin du fichier et écris un message de commit qui dit ce que tu as fait (« Ajout du projet 1 : analyse Pokémon »).
4. **OK**. Le notebook est en ligne. Le lien « Open in Colab » ajouté en haut permet à n'importe qui de le rouvrir.

Le détail des commandes Git est dans [guide-github.md](guide-github.md).

## 7. Les problèmes classiques

| Ce qui se passe | Ce qu'il faut faire |
|---|---|
| `NameError: name 'df' is not defined` | Exécute la cellule qui crée `df` (plus haut). |
| `ModuleNotFoundError` | `!pip install <nom>` dans une cellule, puis relance. |
| « Votre session a planté » | La mémoire est pleine : **Exécution → Redémarrer la session**, relance depuis le début. |
| Le fichier a disparu | Normal après une fermeture. Redépose-le ou monte ton Drive. |
| Pas de GPU disponible | Réessaie plus tard ; en attendant, le notebook fonctionne en mode `USE_MODEL = False` avec des réponses factices. |
| Le code tourne sans fin | Bouton carré pour arrêter. Vérifie s'il y a une boucle infinie ou un `input()` qui attend. |
