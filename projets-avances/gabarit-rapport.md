# Gabarit de rapport · projets avancés

Chaque projet avancé se termine par un **rapport de 10 à 15 slides** (ou une page par section), présenté en 10 minutes.
Le notebook imprime dans ses cellules « Rapport » les chiffres à recopier ici. Une slide = une idée, un graphique, une phrase.

| # | Slide | Ce qu'on y met | Où le trouver dans le notebook |
|---|-------|----------------|--------------------------------|
| 1 | Titre | Nom du projet, ton nom, la date, le niveau ⭐ | cellule 1 |
| 2 | La question métier | Le problème en une phrase, à qui ça sert, ce qu'un bon résultat veut dire, la métrique choisie et pourquoi | section 1 |
| 3 | Les données | Source, taille (lignes × colonnes ou images / textes), période, licence, les 5 variables les plus importantes | section 2 |
| 4 | Nettoyage | Le **journal des corrections** : ce qui manquait, ce qui était faux, ce qu'on a fait, combien de lignes restent | section 3 |
| 5 | Feature engineering | Les variables créées et pourquoi (1 ligne chacune) | section 3 |
| 6-7 | Indicateurs clés | 2 slides, 1 graphique chacune, une phrase de lecture sous chaque graphique | section 4 |
| 8 | Modèles candidats | Le tableau comparatif : baseline « bête », puis chaque modèle, métrique(s), temps d'entraînement | section 5 |
| 9 | Tuning / fine-tuning | Ce qu'on a réglé, comment (grille, Optuna, dégel de couches, LoRA…), le gain avant → après | section 6 |
| 10 | Interprétation | Importances / SHAP / Grad-CAM / exemples d'erreurs, et 3 enseignements | section 7 |
| 11 | Réponse à la question | La réponse en 5 lignes, le chiffre clé, une recommandation concrète | section 8 |
| 12 | Limites et suite | Ce qui manque, ce qu'on ferait avec plus de temps ou de données | sections 8-9 |
| 13 | Démo | 1 prédiction en direct sur un nouvel exemple (image, phrase, ligne de tableau…) | fin de section 7 |

## Conseils
- Commence par la slide 11 quand tu répètes : si la réponse est claire, le reste suit.
- Aucun graphique sans titre, sans unités, sans phrase de lecture.
- Donne toujours la **baseline** avant le meilleur modèle : un score n'a de sens que comparé à « ne rien faire de malin ».
- Dis ce qui a raté. Un tuning qui n'apporte rien est un résultat.
- Vocabulaire : voir [docs/glossaire.md](../docs/glossaire.md) ; grille d'évaluation : [docs/grille-evaluation.md](../docs/grille-evaluation.md).
