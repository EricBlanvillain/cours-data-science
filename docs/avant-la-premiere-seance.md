# Avant la première séance

Tout l'atelier tourne dans le navigateur. Rien à installer, tout est gratuit. Il faut seulement trois comptes et un ordinateur.

## Les 3 comptes à créer

| Compte | Où | Pour quoi | Détail |
|---|---|---|---|
| Google | https://accounts.google.com | Google Colab (Python dans le navigateur) et Gemini | Un compte Gmail existant suffit |
| Kaggle | https://www.kaggle.com | Datasets et compétition Titanic | Inscription possible avec le compte Google ; la vérification par téléphone est demandée pour télécharger et soumettre | 
| GitHub | https://github.com | Le portfolio de projets | Choisis un nom d'utilisateur sobre : il restera dans l'adresse de ton portfolio |

Ces services demandent un âge minimum dans leurs conditions d'utilisation. Si nécessaire, l'adulte référent crée les comptes (ou les valide) avec le participant, et garde les identifiants quelque part de sûr.

Un compte ChatGPT, Claude ou Mistral (version gratuite) est utile à partir de la séance 1 mais pas indispensable : le formateur fait les démos, et à partir de la séance 9 un petit modèle tourne directement dans Colab sans compte ni clé.

Les guides pas à pas : [guide-colab.md](guide-colab.md), [guide-kaggle.md](guide-kaggle.md), [guide-github.md](guide-github.md).

## Le matériel

- Un ordinateur portable (Windows, Mac, Linux ou Chromebook, tout marche) avec un navigateur récent (Chrome ou Firefox de préférence) et un chargeur.
- Une connexion internet (wifi sur place).
- Une webcam (celle de l'ordinateur suffit) pour Teachable Machine à la séance 1.
- Une souris est confortable mais pas obligatoire. Une tablette ne suffit pas : Colab y est pénible.

Pas besoin d'un ordinateur puissant : tout le calcul se fait sur les serveurs de Google, y compris les modèles de langage.

## Ce qui est gratuit (tout)

| Outil | Gratuit ? | Limite à connaître |
|---|---|---|
| Google Colab | Oui | Le GPU gratuit est limité en temps par jour ; on l'active seulement pour les séances 9 à 12 |
| Kaggle | Oui | 10 soumissions par jour à la compétition |
| GitHub | Oui | Les dépôts publics sont illimités |
| ChatGPT / Claude / Mistral / Gemini | Oui (version gratuite) | Nombre de messages limité par jour, largement suffisant |
| Modèle de langage dans Colab | Oui | Un petit modèle ouvert ; moins doué que ChatGPT, mais sans clé ni coût |
| Clé d'API pour un gros modèle | Fournie par le formateur en séance 10 si besoin | Budget plafonné, jamais à mettre dans le code ni sur GitHub |

Aucun achat n'est nécessaire à aucun moment. Si un site propose une version payante, on n'en a pas besoin.

## À faire avant la séance 0 (15 minutes)

1. Créer (ou vérifier) les 3 comptes ci-dessus.
2. Ouvrir https://colab.research.google.com, faire **Fichier → Nouveau notebook**, taper `print("bonjour")` dans la cellule et appuyer sur `Maj + Entrée`. Si « bonjour » s'affiche, tout est prêt.
3. Noter ses identifiants quelque part de sûr (pas dans le notebook).
4. Réfléchir à 2 ou 3 sujets qui t'intéressent (jeux vidéo, musique, sport, cinéma, météo, animaux…) : on choisira les datasets de l'atelier en fonction.

## Ce qu'il n'est pas nécessaire de savoir

Pas besoin de connaître Python à l'avance : la séance 0 fait le point et tout est repris. Pas besoin de maths au-delà de la moyenne et du pourcentage. La curiosité et l'envie de construire quelque chose comptent plus que le reste.
