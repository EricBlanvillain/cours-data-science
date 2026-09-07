# Grille d'évaluation

Une grille commune pour les 4 projets et les présentations. Elle sert à **donner un retour**, pas à classer : aucune note chiffrée n'est obligatoire. Chaque ligne se lit en trois paliers, et on écrit une phrase de retour par ligne plutôt qu'un chiffre.

Elle est utilisable par le formateur, par les pairs (à la séance 12) et par soi-même avant de rendre.

## Les trois paliers

| Palier | Ce que ça veut dire |
|---|---|
| En route | Le point est abordé mais il manque quelque chose d'important |
| Atteint | Le point est là, on peut passer à la suite |
| Dépassé | Le point est là, et il y a une initiative en plus (une question de plus, une vérification, une explication claire) |

Le niveau ⭐ du projet compte : « Atteint » sur un projet ⭐⭐⭐ vaut plus que « Dépassé » sur un ⭐.

## Grille projet (notebook + README)

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. La question** : le projet répond à une question claire | La question est floue ou absente | Une question précise, écrite en une phrase en haut du notebook | Plusieurs questions qui s'enchaînent, avec une hypothèse formulée avant de regarder les données |
| **2. Les données** : on sait d'où elles viennent et ce qu'elles contiennent | Source non indiquée, colonnes non expliquées | Source citée, colonnes utiles décrites, taille du tableau donnée | Limites des données identifiées (biais, valeurs manquantes, ce qu'elles ne disent pas) |
| **3. La démarche** : les étapes sont visibles et dans l'ordre | Le notebook est un tas de cellules sans fil | Sections titrées, une étape par section, le code commenté aux endroits utiles | Chaque choix est justifié (pourquoi remplir plutôt que supprimer, pourquoi ce modèle) |
| **4. Ça tourne** : le notebook s'exécute de haut en bas | Des cellules plantent | Tout s'exécute sans erreur dans un Colab vierge | Les données se chargent automatiquement (URL) et les résultats sont reproductibles (`random_state`) |
| **5. Le résultat** : le projet produit quelque chose de lisible | Des sorties brutes sans commentaire | Un graphique / un score / une réponse par question, titré et commenté | Le résultat est comparé à une référence (modèle bête, autre méthode, attente initiale) |
| **6. L'esprit critique** : on sait ce qui est solide et ce qui ne l'est pas | Aucun recul | Une limite ou un piège nommé (corrélation, sur-apprentissage, hallucination) | Une vérification faite (test, contre-exemple, second dataset) et une piste pour la suite |
| **7. Le README** : quelqu'un d'extérieur comprend le projet en 1 minute | Absent ou une ligne | Problème, données, démarche, résultat, comment relancer | Un graphique ou un exemple dans le README, et un lien vers le notebook Colab |
| **8. Le dépôt** : le projet est propre sur GitHub | Pas en ligne, ou fichiers inutiles / secrets | Poussé sur GitHub, messages de commit clairs, pas de clé ni de données perso | Plusieurs commits qui racontent l'avancement |

Critères propres à chaque projet, en plus des 8 ci-dessus :

| Projet | On regarde aussi |
|---|---|
| Projet 1 · Analyse d'un dataset | Les 3 graphiques sont du bon type pour la question (barres pour comparer, nuage pour lier, histogramme pour répartir) et lisibles (titre, axes) |
| Projet 2 · Nettoyage, dashboard, modèle | Le journal des corrections est complet ; le pitch constat / preuve / recommandation tient en 2 minutes ; le modèle bat le modèle bête et la phrase « ce que mon modèle a compris » est juste |
| Projet 3 · Kaggle Titanic | Le score de soumission est noté et bat 0,766 ; au moins une variable créée ; la validation croisée est utilisée ; pas de fuite de données |
| Projet 4 · Chatbot, RAG, agent | Le prompt système est écrit et testé ; le JSON est parsé avec un `try / except` ; le RAG répond « je ne sais pas » quand la réponse n'est pas dans les documents ; l'agent a au moins un test de raté |

## Grille présentation (2 à 5 minutes)

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **Le message** : on retient une chose | On ne sait pas quoi retenir | Un message principal, dit au début et à la fin | Le message est appuyé par un chiffre ou un graphique montré |
| **La structure** : question → démarche → résultat → limites | Dans le désordre, ou une étape manque | Les 4 étapes dans l'ordre | Une transition claire entre chaque étape, une accroche |
| **Le temps** | Très en dessous ou très au-dessus | Dans la durée à 30 s près | Le temps est réparti : plus sur le résultat que sur le code |
| **La démo** | Pas de démo, ou elle plante | Une chose montrée qui marche (graphique, prédiction, réponse du bot) | La démo répond à une question posée par le groupe |
| **Les questions** | Pas de réponse | Répond à ce qu'on lui demande, sait dire « je ne sais pas » | Fait le lien avec ce qu'on pourrait faire ensuite |
| **Le partage** (présentation en binôme) | Une seule personne parle | Les deux parlent | Chacun présente la partie qu'il a faite, et ils se complètent |

## Comment s'en servir

- **Avant de rendre** (auto-évaluation) : coche un palier par ligne, honnêtement. Les lignes « En route » sont ta liste de choses à faire.
- **Pendant le partage** : le formateur ou un pair remplit une phrase par ligne, pas un chiffre. Le retour tient sur une demi-page : deux points forts, un point à améliorer, une idée pour la suite.
- **À la séance 12** : chacun relit les retours reçus sur les 4 projets et choisit celui qu'il présente.

Si une note chiffrée est nécessaire (cadre scolaire, attestation), compter 1 point par « Atteint » et 2 par « Dépassé », sur les 8 critères du projet : /16, à ramener à l'échelle voulue. Ce n'est pas la finalité de la grille.

## Fiche de retour (à imprimer ou copier)

```
Projet : ____________________   Niveau : ⭐ / ⭐⭐ / ⭐⭐⭐   Auteur(s) : ____________________

Deux points forts :
1.
2.

Un point à améliorer :
-

Une idée pour la suite :
-

Relu par : ____________________   Date : ________
```
