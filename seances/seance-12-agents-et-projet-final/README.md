# Séance 12 · Les agents, et le projet final · ⭐⭐⭐

Niveau : ⭐⭐⭐ Avancé

Bloc 4 · Comprendre et construire avec l'IA générative

Objectifs : comprendre ce qu'est un agent (un LLM qui agit en appelant des outils), en construire un sans framework avec 3 outils Python (fichier Pokémon, calculatrice sécurisée, RAG de la séance 11), voir ce qui peut rater, fixer les bonnes pratiques avec l'IA, puis finaliser son portfolio GitHub et préparer la présentation finale.

Déroulé (1 h 30)
- 15 min : un agent = LLM + outils + boucle (le stagiaire brillant à qui on donne un téléphone et une calculatrice), démo d'un agent qui choisit d'aller chercher dans le RAG, les 4 bonnes pratiques
- 60 min : notebook `12_agents_et_projet_final.ipynb`
  - sections 1 à 3 (15 min) : le modèle invente et calcule mal, les 3 outils, la boucle `OUTIL: nom(args)`
  - sections 4 à 6 (15 min) : agent → RAG → réponse, banc de test des ratés, quiz des bonnes pratiques
  - section 7 (30 min) : projet final, check-list du portfolio (4 projets), README généré, fiche projet, répétition à deux avec le gabarit
- 15 min : premières présentations (3 min chacun)

Si le temps manque : les présentations finales méritent leur propre créneau. Prévoir une séance 12 bis devant le groupe et les invités, portfolio terminé — c'est la fin du parcours, elle ne se joue pas à la montre.

Notes d'animation (formateur)
- Section 5, ce qui peut rater : « Montrer une exécution où le petit modèle oublie le mot CHERCHER : c'est la meilleure introduction à la démo qui suit. »
- Section 4, démo de l'agent : « Cinq minutes chronométrées, sur l'ordinateur du formateur. Une seule tâche demandée à l'agent, montrée du début à la fin, avec une erreur si possible. »
- Présentations finales, le déroulé : « Tirer l'ordre au sort. Tenir le chrono visible : trois minutes, c'est strict, et c'est ce qui rend l'exercice juste. »
- Présentations finales, après chaque passage : « Rappeler les quatre temps avant chaque passage. Après chaque présentation, poser la première question soi-même si le groupe se tait. »
- Le bilan du parcours : « Faire dire à chacun une chose apprise et une chose qu'il veut faire ensuite. Donner les liens pour continuer. »

Entre deux séances (à la maison) : `12_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Outils (gratuits)
- Le modèle tourne dans Colab (GPU T4 gratuit), aucune clé nécessaire : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Dataset Pokémon (outil de l'agent) : https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv
- GitHub pour le portfolio : https://github.com
- Cours gratuit sur les agents (pour la suite) : https://huggingface.co/learn/agents-course

Ils repartent avec : un portfolio GitHub complet (4 projets) et une présentation finale faite devant le groupe et les invités.
