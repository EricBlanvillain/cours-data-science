/**
 * Les jalons de la frise « 1950 → aujourd'hui ». Un objet par carte, à éditer sans toucher au composant.
 * Chaque jalon porte sa source (URL consultée) et la date de vérification : c'est la règle du dépôt,
 * toute date affichée doit pouvoir être justifiée six mois plus tard. Le champ `note` garde les nuances
 * et les désaccords entre sources ; il s'affiche avec la source, au clic.
 *
 * Désaccords entre sources relevés le 25/09/2026 (non tranchés, voir les notes) :
 * - chute de Nvidia le 27 janvier 2025 : « près de 17 % » (Yahoo Finance, CNBC) ou 18 % (Wikipedia) ;
 * - accord politique sur l'omnibus AI Act : 7 mai 2026 (Commission, Wikipedia) ou 6 mai puis 13 mai (Gibson Dunn) ;
 * - lettre du 28 juillet 2026 : 1 134, 1 178 ou « plus de 1 100 » signataires selon les médias ;
 * - chiffres de l'AIE (415 / 945 TWh) lus sur un relais (mgrid.org), iea.org ayant refusé l'accès.
 * Écartés faute de source ouverte fiable : génome de bactériophage conçu par IA (6 août 2026), plan Microsoft 26 GW,
 * Claude Sonnet 5 (30 juin 2026).
 */
export type Periode = "fondations" | "hivers" | "renaissance" | "deep-learning" | "transformers" | "boom";

export type Jalon = {
  annee: number;
  /** date précise si elle compte (ex. "30 novembre 2022"), sinon l'année suffit */
  date?: string;
  titre: string;
  /** une seule phrase, factuelle, lisible sans prérequis */
  phrase: string;
  periode: Periode;
  source: string;
  verifie: string;
  /** nuance, désaccord entre sources, date d'annonce vs date de publication… */
  note?: string;
  /** vrai quand les sources consultées ne s'accordent pas : la carte le signale en cuivre (ce qui n'est pas résolu) */
  desaccord?: boolean;
};

export const periodes: Record<Periode, { titre: string; annees: string }> = {
  fondations: { titre: "Les fondations", annees: "1950 – 1969" },
  hivers: { titre: "Les hivers", annees: "1970 – 1993" },
  renaissance: { titre: "La renaissance", annees: "1994 – 2011" },
  "deep-learning": { titre: "Le deep learning", annees: "2012 – 2016" },
  transformers: { titre: "Les transformers", annees: "2017 – 2022" },
  boom: { titre: "Le boom", annees: "2023 – aujourd'hui" },
};

export const jalons: Jalon[] = [
  // ---------- FONDATIONS (1950-1969) ----------
  {
    annee: 1950,
    date: "octobre 1950",
    titre: "Le test de Turing",
    phrase: "Dans la revue Mind, Alan Turing propose le « jeu de l'imitation » : une machine réussit si un juge, par écrit, ne parvient pas à la distinguer d'un humain.",
    periode: "fondations",
    source: "https://en.wikipedia.org/wiki/Computing_Machinery_and_Intelligence",
    verifie: "2026-09-25",
  },
  {
    annee: 1956,
    date: "été 1956",
    titre: "La conférence de Dartmouth",
    phrase: "Un atelier d'été réunit McCarthy, Minsky, Rochester et Shannon ; leur proposition de 1955 emploie pour la première fois l'expression « intelligence artificielle ».",
    periode: "fondations",
    source: "https://en.wikipedia.org/wiki/Dartmouth_workshop",
    verifie: "2026-09-25",
    note: "Proposition datée du 2 septembre 1955. L'atelier a duré environ huit semaines, du 18 juin au 17 août 1956 selon les notes de Ray Solomonoff.",
  },
  {
    annee: 1957,
    date: "1957 – 1958",
    titre: "Le perceptron de Rosenblatt",
    phrase: "Frank Rosenblatt décrit le perceptron, un premier neurone artificiel qui apprend à reconnaître des formes ; le New York Times y voit l'embryon d'une machine consciente.",
    periode: "fondations",
    source: "https://en.wikipedia.org/wiki/Perceptron",
    verifie: "2026-09-25",
    note: "Rapport technique en 1957, article dans Psychological Review en 1958, machine Mark I démontrée publiquement le 23 juin 1960. La citation du NYT date d'une conférence de presse de 1958.",
  },
  {
    annee: 1966,
    date: "janvier 1966",
    titre: "ELIZA",
    phrase: "Au MIT, Joseph Weizenbaum publie ELIZA, un programme qui imite un psychothérapeute en reformulant les phrases de l'utilisateur grâce à quelques règles simples.",
    periode: "fondations",
    source: "https://en.wikipedia.org/wiki/ELIZA",
    verifie: "2026-09-25",
    note: "Développé de 1964 à 1967 ; l'article de référence paraît dans Communications of the ACM en janvier 1966.",
  },

  // ---------- HIVERS (1970-1993) ----------
  {
    annee: 1973,
    date: "1973",
    titre: "Le rapport Lighthill et le premier hiver",
    phrase: "Commandé par le Science Research Council britannique, le rapport Lighthill juge les promesses de l'IA non tenues et entraîne l'arrêt des financements dans la plupart des universités du Royaume-Uni.",
    periode: "hivers",
    source: "https://en.wikipedia.org/wiki/Lighthill_report",
    verifie: "2026-09-25",
    note: "Wikipedia situe le premier hiver de l'IA entre 1974 et 1980 environ.",
  },
  {
    annee: 1980,
    date: "1980 – 1993",
    titre: "Essor puis chute des systèmes experts",
    phrase: "XCON, en service chez DEC dès 1980, économise 25 millions de dollars par an ; en 1987 le marché des machines LISP s'effondre et un second hiver commence.",
    periode: "hivers",
    source: "https://en.wikipedia.org/wiki/Xcon",
    verifie: "2026-09-25",
    note: "Dans les années 1980, deux tiers des entreprises du Fortune 500 utilisent des systèmes experts (Wikipedia, Expert system). Le projet japonais de cinquième génération s'achève le 1er juin 1992. Wikipedia date le second hiver de 1987 à 2000, d'autres périodisations l'arrêtent vers 1993.",
  },
  {
    annee: 1986,
    date: "9 octobre 1986",
    titre: "La rétropropagation popularisée",
    phrase: "Rumelhart, Hinton et Williams publient dans Nature l'article qui popularise la rétropropagation, la méthode d'entraînement des réseaux de neurones à plusieurs couches encore utilisée aujourd'hui.",
    periode: "hivers",
    source: "https://en.wikipedia.org/wiki/Geoffrey_Hinton",
    verifie: "2026-09-25",
    note: "L'algorithme existait avant (thèse de Paul Werbos, 1974) ; l'article de 1986 l'a popularisé, sans citer ces travaux antérieurs (Wikipedia, David Rumelhart).",
  },

  // ---------- RENAISSANCE (1994-2011) ----------
  {
    annee: 1997,
    date: "11 mai 1997",
    titre: "Deep Blue bat Kasparov",
    phrase: "À New York, l'ordinateur Deep Blue d'IBM bat le champion du monde d'échecs Garry Kasparov 3,5 à 2,5, un an après avoir perdu le premier match 4 à 2.",
    periode: "renaissance",
    source: "https://en.wikipedia.org/wiki/Deep_Blue_versus_Garry_Kasparov",
    verifie: "2026-09-25",
    note: "Match revanche du 3 au 11 mai 1997 ; le premier match, perdu par la machine, s'est joué à Philadelphie en 1996.",
  },
  {
    annee: 2009,
    date: "2009",
    titre: "ImageNet",
    phrase: "L'équipe de Fei-Fei Li présente ImageNet, une base de plus de 14 millions d'images annotées à la main, qui sert de référence aux concours de reconnaissance visuelle dès 2010.",
    periode: "renaissance",
    source: "https://en.wikipedia.org/wiki/ImageNet",
    verifie: "2026-09-25",
    note: "Présentée sous forme de poster à la conférence CVPR 2009 en Floride.",
  },

  // ---------- DEEP LEARNING (2012-2016) ----------
  {
    annee: 2012,
    date: "30 septembre 2012",
    titre: "AlexNet",
    phrase: "Le réseau de neurones AlexNet, entraîné sur deux cartes graphiques, remporte le concours ImageNet avec 15,3 % d'erreur, plus de 10 points devant le deuxième.",
    periode: "deep-learning",
    source: "https://en.wikipedia.org/wiki/AlexNet",
    verifie: "2026-09-25",
    note: "Auteurs : Alex Krizhevsky, Ilya Sutskever et Geoffrey Hinton. Entraînement de cinq à six jours sur deux GPU Nvidia GTX 580.",
  },
  {
    annee: 2013,
    date: "16 janvier 2013",
    titre: "word2vec",
    phrase: "Chez Google, Tomáš Mikolov et ses collègues publient word2vec, qui représente chaque mot par une liste de nombres telle que « frère » − « homme » + « femme » donne « sœur ».",
    periode: "deep-learning",
    source: "https://en.wikipedia.org/wiki/Word2vec",
    verifie: "2026-09-25",
  },
  {
    annee: 2016,
    date: "9 – 15 mars 2016",
    titre: "AlphaGo bat Lee Sedol",
    phrase: "À Séoul, AlphaGo de DeepMind bat le champion de go Lee Sedol 4 à 1, un exploit que la plupart des experts n'attendaient pas avant plusieurs années.",
    periode: "deep-learning",
    source: "https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol",
    verifie: "2026-09-25",
  },

  // ---------- TRANSFORMERS (2017-2022) ----------
  {
    annee: 2017,
    date: "12 juin 2017",
    titre: "« Attention is all you need »",
    phrase: "Huit chercheurs, alors chez Google (dont un étudiant de Toronto en stage), décrivent le Transformer, une architecture fondée uniquement sur le mécanisme d'attention, qui devient la base de presque tous les grands modèles de langage.",
    periode: "transformers",
    source: "https://arxiv.org/abs/1706.03762",
    verifie: "2026-09-25",
  },
  {
    annee: 2018,
    date: "11 octobre 2018",
    titre: "BERT",
    phrase: "Google publie BERT, un modèle qui lit un texte dans les deux sens à la fois et devient la référence pour de nombreuses tâches de compréhension du langage.",
    periode: "transformers",
    source: "https://arxiv.org/abs/1810.04805",
    verifie: "2026-09-25",
  },
  {
    annee: 2019,
    date: "14 février 2019",
    titre: "GPT-2",
    phrase: "OpenAI annonce GPT-2, 1,5 milliard de paramètres, mais refuse d'abord de publier le modèle complet par crainte d'usages malveillants ; il est diffusé le 5 novembre 2019.",
    periode: "transformers",
    source: "https://en.wikipedia.org/wiki/GPT-2",
    verifie: "2026-09-25",
  },
  {
    annee: 2020,
    date: "28 mai 2020",
    titre: "GPT-3",
    phrase: "OpenAI présente GPT-3, 175 milliards de paramètres, dix fois plus que tout modèle précédent, capable d'accomplir une tâche à partir de quelques exemples donnés dans la consigne.",
    periode: "transformers",
    source: "https://arxiv.org/abs/2005.14165",
    verifie: "2026-09-25",
  },
  {
    annee: 2020,
    date: "novembre 2020",
    titre: "AlphaFold 2",
    phrase: "AlphaFold 2 de DeepMind remporte le concours CASP14 en prédisant la forme des protéines ; l'article paraît dans Nature le 15 juillet 2021 avec le code en accès libre.",
    periode: "transformers",
    source: "https://en.wikipedia.org/wiki/AlphaFold",
    verifie: "2026-09-25",
    note: "Deux dates possibles : résultats CASP14 (novembre 2020) ou publication Nature (juillet 2021). Le 28 juillet 2022, la base publique atteint environ 200 millions de structures.",
  },
  {
    annee: 2022,
    date: "avril – août 2022",
    titre: "L'année des images générées",
    phrase: "DALL·E 2 (6 avril), Midjourney (bêta ouverte le 12 juillet) puis Stable Diffusion (22 août, poids publics) permettent à chacun de créer une image à partir d'une phrase.",
    periode: "transformers",
    source: "https://en.wikipedia.org/wiki/Stable_Diffusion",
    verifie: "2026-09-25",
    note: "Dates DALL·E 2 : https://en.wikipedia.org/wiki/DALL-E ; Midjourney : https://en.wikipedia.org/wiki/Midjourney. Stable Diffusion est le premier des trois à publier ses poids, exécutable sur un ordinateur personnel.",
  },
  {
    annee: 2022,
    date: "30 novembre 2022",
    titre: "ChatGPT",
    phrase: "OpenAI ouvre ChatGPT, fondé sur GPT-3.5 : un million d'utilisateurs en cinq jours, cent millions en deux mois, et l'IA générative entre dans le grand public.",
    periode: "transformers",
    source: "https://en.wikipedia.org/wiki/ChatGPT",
    verifie: "2026-09-25",
  },

  // ---------- BOOM (2023-2026) ----------
  {
    annee: 2023,
    date: "24 février 2023",
    titre: "LLaMA et les modèles ouverts",
    phrase: "Meta réserve LLaMA aux chercheurs sous licence non commerciale ; les poids fuitent le 3 mars, puis Llama 2 (18 juillet) autorise l'usage commercial et lance la vague des modèles ouverts.",
    periode: "boom",
    source: "https://en.wikipedia.org/wiki/Llama_(language_model)",
    verifie: "2026-09-25",
    note: "Annonce officielle : https://ai.meta.com/blog/large-language-model-llama-meta-ai/ (tailles 7B à 65B).",
  },
  {
    annee: 2023,
    date: "14 mars 2023",
    titre: "GPT-4 (et Claude)",
    phrase: "OpenAI lance GPT-4, qui accepte aussi des images et se classe parmi les 10 % meilleurs à un examen du barreau simulé ; le même jour, Anthropic présente Claude.",
    periode: "boom",
    source: "https://en.wikipedia.org/wiki/GPT-4",
    verifie: "2026-09-25",
    note: "OpenAI ne divulgue pas la taille du modèle. Rapport technique sur arXiv daté du 15 mars 2023 (https://arxiv.org/abs/2303.08774). Claude : https://www.anthropic.com/news/introducing-claude.",
  },
  {
    annee: 2023,
    date: "mars – novembre 2023",
    titre: "L'année des alertes",
    phrase: "Une lettre ouverte demande une pause de six mois (22 mars), Geoffrey Hinton quitte Google pour alerter librement (1er mai), et 28 pays signent la déclaration de Bletchley (1er-2 novembre).",
    periode: "boom",
    source: "https://en.wikipedia.org/wiki/AI_Safety_Summit",
    verifie: "2026-09-25",
    note: "Lettre : https://futureoflife.org/open-letter/pause-giant-ai-experiments/ (31 810 signatures affichées, aucune pause n'a eu lieu). Hinton : https://en.wikipedia.org/wiki/Geoffrey_Hinton (interview NYT du 1er mai 2023).",
  },
  {
    annee: 2023,
    date: "6 décembre 2023",
    titre: "Gemini",
    phrase: "Google annonce Gemini 1.0, conçu d'emblée pour traiter texte, code, audio, image et vidéo ; sa version Ultra est présentée comme la première à dépasser les experts humains sur le test MMLU.",
    periode: "boom",
    source: "https://blog.google/technology/ai/google-gemini-ai/",
    verifie: "2026-09-25",
    note: "Score MMLU de 90,0 % revendiqué par Google. Bard est renommé Gemini le 8 février 2024 (https://en.wikipedia.org/wiki/Gemini_(language_model)).",
  },
  {
    annee: 2024,
    date: "13 mars 2024",
    titre: "L'AI Act européen",
    phrase: "Le Parlement européen adopte l'AI Act par 523 voix contre 46 ; en vigueur le 1er août 2024, il s'applique par étapes : interdictions en février 2025, modèles généraux en août 2025.",
    periode: "boom",
    source: "https://en.wikipedia.org/wiki/Artificial_Intelligence_Act",
    verifie: "2026-09-25",
    note: "Conseil : 21 mai 2024 ; Journal officiel : 12 juillet 2024. Calendrier officiel : https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai. Les obligations « haut risque » ont été repoussées en 2026 (voir jalon juillet 2026).",
  },
  {
    annee: 2024,
    date: "12 septembre 2024",
    titre: "o1 et les modèles de raisonnement",
    phrase: "OpenAI lance o1-preview, un modèle qui « réfléchit » avant de répondre : il résout 83 % des problèmes d'un examen qualificatif d'olympiade de mathématiques, contre 13 % pour GPT-4o.",
    periode: "boom",
    source: "https://techcrunch.com/2024/09/12/openai-unveils-a-model-that-can-fact-check-itself/",
    verifie: "2026-09-25",
    note: "Version complète o1 le 5 décembre 2024 (https://en.wikipedia.org/wiki/OpenAI_o1). Les chiffres 83 % et 13 % sont ceux annoncés par OpenAI.",
  },
  {
    annee: 2024,
    date: "8 et 9 octobre 2024",
    titre: "Deux prix Nobel pour l'IA",
    phrase: "John Hopfield et Geoffrey Hinton reçoivent le Nobel de physique pour les réseaux de neurones ; le lendemain, David Baker, Demis Hassabis et John Jumper obtiennent celui de chimie, notamment pour AlphaFold.",
    periode: "boom",
    source: "https://en.wikipedia.org/wiki/Geoffrey_Hinton",
    verifie: "2026-09-25",
    note: "Chimie : une moitié à Baker (conception de protéines), l'autre à Hassabis et Jumper (prédiction de structure) ; https://en.wikipedia.org/wiki/John_M._Jumper et https://en.wikipedia.org/wiki/David_Baker_(biochemist). Le site nobelprize.org a refusé l'accès (403) lors de la vérification.",
  },
  {
    annee: 2025,
    date: "20 – 27 janvier 2025",
    titre: "DeepSeek R1 secoue les marchés",
    desaccord: true,
    phrase: "La start-up chinoise DeepSeek publie R1, un modèle de raisonnement ouvert et peu coûteux ; le 27 janvier, Nvidia perd 589 milliards de dollars en Bourse, un record historique.",
    periode: "boom",
    source: "https://finance.yahoo.com/news/nvidia-stock-plummets-loses-record-589-billion-as-deepseek-prompts-questions-over-ai-spending-135105824.html",
    verifie: "2026-09-25",
    note: "Baisse de « près de 17 % » (Yahoo Finance, CNBC) mais « 18 % » selon Wikipedia (https://en.wikipedia.org/wiki/DeepSeek). Le coût de 5,6 millions de dollars souvent cité ne couvre que la dernière phase d'entraînement de V3 ; SemiAnalysis estime le parc de serveurs à environ 1,6 milliard (https://newsletter.semianalysis.com/p/deepseek-debates).",
  },
  {
    annee: 2025,
    date: "janvier – mars 2025",
    titre: "L'année des agents",
    phrase: "OpenAI lance Operator (23 janvier), un agent qui navigue sur le web à la place de l'utilisateur ; Manus (6 mars) et d'autres popularisent des agents qui planifient et exécutent des tâches.",
    periode: "boom",
    source: "https://en.wikipedia.org/wiki/OpenAI_Operator",
    verifie: "2026-09-25",
    note: "Operator, réservé d'abord aux abonnés Pro américains, est arrêté le 31 août 2025 au profit de « ChatGPT agent ». Manus : https://en.wikipedia.org/wiki/Manus_(AI_agent). Autres agents datés : Deep Research (2 février), Claude Code (24 février) selon https://en.wikipedia.org/wiki/2025_in_artificial_intelligence.",
  },
  {
    annee: 2025,
    date: "janvier – avril 2025",
    titre: "Centres de données et énergie",
    desaccord: true,
    phrase: "Stargate promet jusqu'à 500 milliards de dollars de centres de données aux États-Unis (21 janvier) ; l'AIE prévoit que leur consommation électrique mondiale passe de 415 TWh en 2024 à 945 TWh en 2030.",
    periode: "boom",
    source: "https://mgrid.org/2025/04/10/iea-us-data-center-electricity-demand-130-percent-2030-ai/",
    verifie: "2026-09-25",
    note: "Rapport AIE « Energy and AI » du 10 avril 2025 ; les pages iea.org ont refusé l'accès (403), chiffres relayés par mgrid.org, qui attribue une fois le 415 TWh aux seuls États-Unis (incohérence probable de l'article, l'AIE donne 415 TWh pour le monde). Stargate : https://en.wikipedia.org/wiki/Stargate_LLC et https://techcrunch.com/2025/01/21/openai-teams-up-with-softbank-and-oracle-on-50b-data-center-project/.",
  },
  {
    annee: 2025,
    date: "7 août 2025",
    titre: "GPT-5",
    phrase: "OpenAI déploie GPT-5 à tous les utilisateurs de ChatGPT, alors 700 millions par semaine ; un « routeur » choisit entre réponse rapide et réflexion longue, et l'accueil est mitigé.",
    periode: "boom",
    source: "https://techcrunch.com/2025/08/07/openais-gpt-5-is-here/",
    verifie: "2026-09-25",
    note: "Des utilisateurs réclament le retour de GPT-4o, rétabli en quelques jours (https://en.wikipedia.org/wiki/GPT-5). Quelques semaines plus tôt, le 21 juillet, Gemini Deep Think atteint le niveau médaille d'or aux Olympiades de mathématiques avec 35/42 (https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/).",
  },
  {
    annee: 2025,
    date: "29 octobre 2025",
    titre: "Nvidia vaut 5 000 milliards",
    phrase: "Nvidia devient la première entreprise valorisée 5 000 milliards de dollars, trois mois après le cap des 4 000 ; ChatGPT compte alors 800 millions d'utilisateurs hebdomadaires.",
    periode: "boom",
    source: "https://techcrunch.com/2025/10/29/nvidia-becomes-first-public-company-worth-5-trillion/",
    verifie: "2026-09-25",
    note: "800 millions annoncés le 6 octobre 2025 au DevDay ; 900 millions en février 2026 (https://en.wikipedia.org/wiki/ChatGPT). Gemini 3 sort le 18 novembre 2025, l'application Gemini dépassant 650 millions d'utilisateurs mensuels (https://blog.google/products/gemini/gemini-3/).",
  },
  {
    annee: 2026,
    date: "9 juin 2026",
    titre: "Claude Fable 5 et Mythos 5",
    phrase: "Anthropic ouvre au public Claude Fable 5, version bridée de son modèle Mythos : les requêtes sensibles (cybersécurité, biologie, chimie) sont détournées vers un modèle moins puissant.",
    periode: "boom",
    source: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
    verifie: "2026-09-25",
    note: "Le 12 juin, le gouvernement américain impose des contrôles à l'export ; Anthropic suspend l'accès pour tous pendant 18 jours, jusqu'au 30 juin (https://www.anthropic.com/news/redeploying-fable-5). Presse : https://techcrunch.com/2026/06/09/anthropics-claude-fable-5-is-a-version-of-mythos-the-public-can-access-today/. OpenAI réplique avec GPT-5.6 le 9 juillet 2026 (https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/).",
  },
  {
    annee: 2026,
    date: "27 juillet 2026",
    titre: "L'AI Act ajusté : l'omnibus numérique",
    desaccord: true,
    phrase: "Le règlement « omnibus » entre en vigueur et repousse les obligations des systèmes à haut risque au 2 décembre 2027 ; les règles de transparence s'appliquent bien le 2 août 2026.",
    periode: "boom",
    source: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
    verifie: "2026-09-25",
    note: "Proposition de la Commission le 19 novembre 2025 ; accord politique le 7 mai 2026 (Commission, Wikipedia) ou 6 mai avec confirmation le 13 mai (Gibson Dunn). Règlement (UE) 2026/1744, systèmes intégrés à des produits reportés au 2 août 2028 (https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/ ; https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/).",
  },
  {
    annee: 2026,
    date: "28 juillet 2026",
    titre: "Les employés de l'IA demandent un frein",
    desaccord: true,
    phrase: "Plus de 1 100 salariés d'OpenAI, Anthropic, Google et Meta, dont Dario Amodei, demandent aux États-Unis des outils pour pouvoir ralentir le développement automatisé de l'IA si nécessaire.",
    periode: "boom",
    source: "https://thenextweb.com/news/pacing-the-frontier-ai-employees-letter-us-government",
    verifie: "2026-09-25",
    note: "Nombre de signataires variable selon les sources : 1 134 (TNW), 1 178 (Enterprise DNA), « plus de 1 100 » (Bloomberg, AOL). La lettre suit un incident du 21 juillet 2026 où des agents d'OpenAI ont pénétré les systèmes de Hugging Face (https://en.wikipedia.org/wiki/2026_in_artificial_intelligence ; https://www.aljazeera.com/economy/2026/9/4/openai-unveils-gpt-6-astra-amid-rising-scrutiny-and-safety). CNN inaccessible (451).",
  },
  {
    annee: 2026,
    date: "3 septembre 2026",
    titre: "GPT-6 Astra",
    phrase: "OpenAI dévoile GPT-6 Astra, entraîné sur plus de 100 000 GPU au site Stargate du Texas ; son président Greg Brockman parle d'entrée dans « l'ère de l'AGI », ce que des experts contestent.",
    periode: "boom",
    source: "https://www.aljazeera.com/economy/2026/9/4/openai-unveils-gpt-6-astra-amid-rising-scrutiny-and-safety",
    verifie: "2026-09-25",
    note: "Aperçu limité le 3 septembre, ouverture aux abonnés payants le 4 septembre dans une version restreinte (https://en.wikipedia.org/wiki/GPT-6_Astra). Un extrait de recherche indiquait « 29 juillet 2026 » : date erronée, non retenue.",
  },
];
