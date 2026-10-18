# Séance 4 · Nettoyer les données · ⭐⭐

Niveau : ⭐⭐ Intermédiaire

Bloc 2 · Le métier de data scientist

Objectifs : comprendre à quoi ressemble un vrai jeu de données (sale, incomplet, plein de pièges), connaître les 5 étapes du métier, et réparer un dataset volontairement abîmé en documentant chaque correction dans un journal. Collecter des données soi-même avec une API, c'est la séance 6.

Déroulé (1 h 30)
- 15 min : une journée de data scientist, les 5 étapes du métier (collecte, nettoyage, analyse, modélisation, restitution), démo du tableau Pokémon abîmé par `abimer()` et des 5 types de dégâts
- 60 min : notebook `04_collecter_nettoyer.ipynb`
  - sections 1 à 3 (5 min) : les 5 étapes du métier, charger le tableau propre, l'abîmer, faire le diagnostic
  - section 4 (25 min) : réparer ensemble, une étape par cellule (regarder, compter, corriger, vérifier), en remplissant le journal : doublons, fautes de frappe, nombres en texte, valeurs manquantes, dates
  - section 5 (5 min) : vérifier son travail contre le tableau propre, relire le journal
  - section 6 (25 min) : projet, nettoyer le dataset Tips abîmé avec son propre journal, exporter `tips_propre.csv`
  - Après la ligne « Fin de l'heure » du notebook, si on a le temps : section 7, où passe le temps d'un data scientist (la barre des 5 étapes) ; section 8, le contrôle final des types ; section 9, la première et la dernière capture et les captures par mois (la séance suivante n'en dépend pas)
- 15 min : chacun lit son journal des corrections et explique un choix (supprimer ou remplir ?)

Si le temps manque : on s'arrête au milieu du projet Tips (section 6), qui ouvre la séance suivante, journal des corrections compris. Les sections 7 à 9 se sautent sans rien perdre.

Entre deux séances (à la maison) : `04_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ : la même recette sur deux fichiers que la leçon n'a pas vus (la caisse d'une brocante, une station météo), avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Liens (gratuits)
- Pokémon (chargé automatiquement) : https://www.kaggle.com/datasets/abcsds/pokemon
- Tips (chargé automatiquement) : https://github.com/mwaskom/seaborn-data
- pandas, guide « valeurs manquantes » : https://pandas.pydata.org/docs/user_guide/missing_data.html

Ils repartent avec : un dataset nettoyé et un notebook qui documente chaque correction faite.
