# Module optionnel · Projet avancé : IA agentique ⭐⭐⭐

Quatre projets pour **construire avec un LLM** au lieu d'entraîner un modèle : un assistant qui lit tes propres cours,
un agent qui se sert d'outils Python, un analyste qui explore un fichier tout seul, et un banc de test pour rendre
tout ça fiable.

Module optionnel : il ne fait pas partie du parcours en 12 séances. Prérequis conseillés : les séances 9 à 12
(comment fonctionne un LLM, l'API par le code, le RAG, les agents).

**Rien à payer, rien à installer.** Le petit modèle tourne dans Colab sans clé d'API, et chaque notebook garde
l'interrupteur `USE_MODEL` de la séance 11 : à `False`, tout s'exécute avec un modèle simulé, sans GPU.

## Les projets

| # | Projet | Ce que tu construis | Durée | État |
|---|--------|---------------------|-------|------|
| [B1](B1-assistant-reviseur/) | **Assistant réviseur** | Un assistant qui indexe tes cours, retrouve le bon passage et te pose des questions de révision, puis corrige tes réponses | 1 h 30 | fiche + notebook |
| [B2](B2-agent-outille/) | **Agent outillé** | Un agent qui choisit le bon outil Python (calculatrice sécurisée, recherche dans un fichier, météo), et se rattrape quand un outil échoue | 1 h 30 | fiche |
| [B3](B3-analyste-automatique/) | **Analyste automatique** | Un agent qui reçoit un CSV, l'explore seul (colonnes, manquants, statistiques), écrit un mini-rapport et propose 3 graphiques — chaque étape validée par toi | 1 h 30 | fiche |
| [B4](B4-fiabiliser-un-assistant/) | **Fiabiliser un assistant** | Un banc de 15 questions avec leurs réponses attendues, le taux de bonnes réponses, la détection des hallucinations, des garde-fous, et le avant / après | 1 h 30 | fiche |

Chaque dossier contient sa fiche projet : objectif, outils et librairies, déroulé minuté, livrable, et une grille
d'évaluation en trois paliers **En route / Atteint / Dépassé**. B1 a en plus son notebook complet ; les notebooks de
B2, B3 et B4 restent à écrire — leur fiche suffit pour se lancer.

## Dans quel ordre

B1 puis B2 sont indépendants : l'un travaille la **recherche** dans des documents, l'autre l'**action** par des outils.
B3 combine les deux. B4 se fait en dernier, sur l'assistant de ton choix : c'est le projet qui transforme une démo
qui marche « quand on lui pose les bonnes questions » en quelque chose de mesuré.

## Pour entraîner des modèles plutôt que les utiliser

Voir la réserve [pour aller plus loin](../../projets-avances/README.md) : six projets complets avec scikit-learn,
XGBoost, TensorFlow et Hugging Face.
