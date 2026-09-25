# Séance 1 · Introduction à l'intelligence artificielle · ⭐

Niveau : ⭐ Débutant

Bloc 1 · Les bases solides

Objectifs : situer IA, machine learning, deep learning et IA générative ; comprendre comment une machine apprend (exemples, erreurs, corrections) ; connaître les outils du moment et savoir bien prompter.

Déroulé (1 h 30)
- 15 min : sur le site du cours (leçon « Introduction à l'intelligence artificielle », voir Liens)
  - la frise 1950 → aujourd'hui (6 min) : on la fait défiler ensemble, on s'arrête sur trois cartes, 1957 (le perceptron), 2012 (AlexNet et les deux cartes graphiques) et 2022 (ChatGPT), puis on lit la période 2023 → aujourd'hui en accéléré ; message à faire passer : les idées sont anciennes, les moyens sont récents
  - « Pourquoi maintenant » (3 min) : les trois cartes, calcul, données, algorithmes
  - quiz « IA ou pas ? » (section 1 du notebook `01_introduction_ia.ipynb`) et les trois cercles (schéma du site ou section 2 du notebook) (6 min)
- 60 min : notebook `01_introduction_ia.ipynb`
  - section 3 (15 min) : « comment une machine apprend », simulation d'un seuil qui s'ajuste sur 20 fruits (pommes / melons), on compte les erreurs, on trace, on piège la machine avec une pomme géante
  - section 4 (20 min) : Teachable Machine, chacun entraîne un modèle qui reconnaît ses gestes à la webcam, le piège, l'améliore
  - section 5 (10 min) : panorama des outils (ChatGPT, Claude, Mistral, Gemini, Midjourney, Suno, Cursor), ce que chacun fait bien et mal, démo sur mon ordinateur
  - section 6 (15 min) : projet, les 5 règles d'un bon prompt, grille d'évaluation automatique (score /5), concours du meilleur prompt sur un défi imposé
- 15 min : partage : chacun montre son modèle Teachable Machine et lit son meilleur prompt

Si le temps manque : on s'arrête à la fin de Teachable Machine (section 4) ; le panorama des outils et le concours de prompts ouvrent la séance suivante.

Notes d'animation (formateur)
- Quiz d'ouverture (2 min) : 4 questions en tête de `01_exercices.ipynb`, à poser à voix haute avant de commencer
- Quiz « IA ou pas ? » (section 1) : « Poser les six cas à main levée. Le GPS fait débat : c'est de l'IA (un algorithme qui imite une capacité) mais pas du machine learning. C'est le bon moment pour introduire la différence. »
- Les trois cercles (section 2 ou schéma du site) : « Dessiner les cercles au tableau plutôt que projeter, en demandant où placer chaque exemple du quiz. ChatGPT va dans le plus petit cercle, le GPS dans le plus grand seulement. »
- La frise (site) : « Ne pas réciter les dates. Une question : pourquoi 2012 est-il la vraie rupture ? Réponse : la puissance de calcul des cartes graphiques et les grandes bases d'images. »
- Section 3, comment une machine apprend : « Insister sur « un tout petit peu » et « des millions de fois ». C'est ce qui rend l'entraînement long et cher, et ce qu'ils vont ressentir avec Teachable Machine. »
- Section 4, Teachable Machine : « Vérifier que la webcam est autorisée dans le navigateur avant de lancer tout le monde. Le défi « trouve un geste qu'il confond » est le cœur pédagogique : il fait comprendre le rôle des exemples. »
- Section 5, panorama des outils : « Démo sur l'ordinateur du formateur uniquement. »
- Section 6, concours du prompt : « Concours : même défi pour tous, on lit les réponses à voix haute, on vote, puis on regarde les prompts gagnants. Faire ressortir quelle règle a fait la différence. »

Entre deux séances (à la maison) : `01_exercices.ipynb` — 12 exercices ⭐ à ⭐⭐⭐ avec vérification automatique (✅/❌), indices et solutions dépliables. C'est le seul travail personnel : la leçon, elle, se fait toujours ensemble.

Fiche : les 5 règles d'un bon prompt
1. Le contexte : qui tu es, pour quoi faire
2. Le rôle : « tu es un prof de SVT »
3. La tâche précise : un verbe, un objet
4. Le format : liste, tableau, 3 phrases, code
5. Un exemple de ce que tu attends

Liens (gratuits, sans installation)
- Le site du cours, leçon de la séance 1 : `site/` du dépôt, `npm run dev` puis `/lecons/seance-01-introduction-ia`, ou hors ligne `./site/servir-local.sh` (voir `site/README.md`)
- Teachable Machine : https://teachablemachine.withgoogle.com
- Quick, Draw! (le réseau de neurones devine ce que tu dessines) : https://quickdraw.withgoogle.com
- ChatGPT : https://chat.openai.com · Claude : https://claude.ai · Mistral : https://chat.mistral.ai
- TensorFlow Playground (un réseau de neurones qui apprend sous tes yeux) : https://playground.tensorflow.org

Ils repartent avec : un modèle Teachable Machine entraîné, et une fiche « mes 5 règles de prompt ».
