/**
 * Les trois causes du boom actuel (« Pourquoi maintenant »). Une idée par carte, et depuis le 25/09/2026 au soir une
 * SÉRIE TEMPORELLE par carte, dessinée en SVG (schemas/Courbe.astro) : le graphique porte l'information, la légende fait
 * une ligne, tout le reste (explication, détails, sources) est derrière un clic. Chaque point est sourcé ci-dessous.
 * Séries (vérifiées le 25/09/2026) :
 * - calcul : Epoch AI, base « Notable AI models » (notable_ai_models.csv), colonne Training compute (FLOP) ; GPT-4 : data
 *   insight « Over 30 AI models have been trained at the scale of GPT-4 » (2,1e25).
 * - données : IDC, estimations successives (Digital Universe 2011, 2012, 2014 ; Data Age 2025 de nov. 2018 ; Global
 *   DataSphere de mars 2021). Méthodes différentes d'une édition à l'autre : un ordre de grandeur, dit en légende.
 * - coût : prix OpenAI par million de tokens en entrée à niveau GPT-3.5 (annonces OpenAI des 1/3/2023, 25/1/2024,
 *   18/7/2024) et bornes de l'article a16z « LLMflation » (nov. 2024 : 60 $ en nov. 2021, 0,06 $ en 2024).
 *
 * Choix faits le 25/09/2026 :
 * - Cause 1 : pas de ratio de cœurs affiché (24 contre 21 760 aurait suggéré un ratio de performance) ; on dit
 *   « quelques dizaines contre des milliers », ce qui est vrai des deux côtés, et les valeurs exactes sont en détail.
 * - Cause 2 : un seul chiffre daté (64 zettaoctets en 2020, IDC) plutôt qu'une série 2011 → 2025 dont IDC a changé
 *   la méthode en cours de route. Les autres éditions sont en détail.
 * - Cause 3 : « ~8 mois » (article Epoch de mars 2024) ; le tableau de bord de février 2026 dit 7,6 mois, en détail.
 * - Le T4 de Colab : Google ne garantit pas le modèle, d'où « en général ».
 */
import type { Point } from "../components/schemas/Courbe.astro";

export type Serie = {
  titre: string;                 // pour le lecteur d'écran
  unite: string;                 // axe vertical
  log: boolean;                  // échelle logarithmique, annoncée sur le graphique
  points: Point[];               // triés par année (décimale) ; `prevision` = tracé en pointillé
  annotation?: { x: number; y: number; texte: string; ancre?: "start" | "end" };   // le seul cuivre du graphique
  legende: string;               // UNE ligne sous le graphique
};

export type Cause = {
  id: "calcul" | "donnees" | "algorithmes";
  titre: string;
  serie: Serie;
  /** l'ancienne explication (~50 mots), désormais derrière le clic */
  explication: string;
  /** puces factuelles derrière le dépliant, chacune vérifiable et parlante */
  details: string[];
  source: string;
  sourceTitre: string;
  verifie: string;
  sourcesComplementaires?: { titre: string; url: string }[];
};

export const causes: Cause[] = [
  {
    id: "calcul",
    titre: "La puissance de calcul",
    serie: {
      titre: "Calcul consacré à l'entraînement des modèles marquants, de 2012 à 2025",
      unite: "FLOP par entraînement",
      log: true,
      points: [
        { x: 2012.75, y: 4.7e17 },
        { x: 2017.45, y: 7.4e18, etiquette: "Transformer" },
        { x: 2018.78, y: 2.85e20 },
        { x: 2020.4, y: 3.14e23, etiquette: "GPT-3" },
        { x: 2022.25, y: 2.5e24 },
        { x: 2023.2, y: 2.1e25, etiquette: "GPT-4" },
        { x: 2025.12, y: 3.5e26, etiquette: "Grok 3" },
      ],
      annotation: { x: 2012.75, y: 4.7e17, texte: "AlexNet, 2 cartes de jeu vidéo" },
      legende: "Multiplié par 4 à 5 chaque année : de 10¹⁷ à plus de 10²⁶ opérations par entraînement en treize ans (Epoch AI).",
    },
    explication:
      "Un réseau de neurones passe son temps à faire la même multiplication sur des millions de nombres à la fois. Une carte graphique, conçue pour calculer les pixels des jeux vidéo, est faite exactement pour ça.",
    details: [
      "Les points de la courbe (Epoch AI, base des modèles notables, consultée le 25/09/2026) : AlexNet 2012, 4,7 × 10¹⁷ FLOP ; Transformer 2017, 7,4 × 10¹⁸ ; BERT-Large 2018, 2,9 × 10²⁰ ; GPT-3 2020, 3,1 × 10²³ ; PaLM 2022, 2,5 × 10²⁴ ; GPT-4 2023, 2,1 × 10²⁵ ; Grok 3 2025, 3,5 × 10²⁶.",
      "Un processeur grand public récent, l'Intel Core Ultra 9 285K (fin 2024), a 24 cœurs. Une carte graphique GeForce RTX 5090 (2025) en a 21 760. Les deux sortes de cœurs ne se valent pas un pour un : ce qui compte, c'est le nombre d'opérations menées en même temps.",
      "AlexNet (2012), le réseau qui a lancé le deep learning moderne, a été entraîné pendant cinq à six jours sur deux cartes de jeu vidéo GTX 580.",
      "D'après Epoch AI, le calcul consacré à l'entraînement des plus gros modèles est multiplié par 4 à 5 chaque année depuis 2010.",
      "Le GPU que Colab prête en général gratuitement, le NVIDIA T4 (2018) : 2 560 cœurs et 16 Go de mémoire. Google ne garantit pas le modèle attribué.",
    ],
    source: "https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf",
    sourceTitre: "Krizhevsky, Sutskever, Hinton, « ImageNet Classification with Deep Convolutional Neural Networks », NeurIPS 2012",
    verifie: "2026-09-25",
    sourcesComplementaires: [
      { titre: "Intel Core Ultra 9 285K, fiche technique Intel", url: "https://www.intel.com/content/www/us/en/products/sku/241060/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz/specifications.html" },
      { titre: "GeForce RTX 5090, fiche NVIDIA", url: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/" },
      { titre: "NVIDIA T4, fiche produit", url: "https://www.nvidia.com/en-us/data-center/tesla-t4/" },
      { titre: "Epoch AI, « Training Compute of Frontier AI Models Grows by 4-5x per Year » (mai 2024)", url: "https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year" },
      { titre: "NVIDIA, « What's the Difference Between a CPU and a GPU? »", url: "https://blogs.nvidia.com/blog/whats-the-difference-between-a-cpu-and-a-gpu/" },
      { titre: "Google Colab, FAQ (les GPU disponibles varient)", url: "https://research.google.com/colaboratory/faq.html" },
      { titre: "Epoch AI, base « Notable AI models » (CSV)", url: "https://epoch.ai/data/notable-ai-models" },
      { titre: "Epoch AI, « Over 30 AI models have been trained at the scale of GPT-4 » (2025)", url: "https://epoch.ai/data-insights/models-over-1e25-flop" },
    ],
  },
  {
    id: "donnees",
    titre: "Le déluge de données",
    serie: {
      titre: "Données créées ou copiées chaque année dans le monde, de 2011 à 2025",
      unite: "zettaoctets par an",
      log: false,
      points: [
        { x: 2011, y: 1.8 },
        { x: 2012, y: 2.8 },
        { x: 2013, y: 4.4 },
        { x: 2018, y: 33 },
        { x: 2020, y: 64.2 },
        { x: 2025, y: 181, prevision: true, etiquette: "prévision" },
      ],
      annotation: { x: 2020, y: 64.2, texte: "2020 : 64 zettaoctets", ancre: "end" },
      legende: "Un zettaoctet vaut mille milliards de gigaoctets ; estimations IDC successives, 2025 en pointillé car prévue en 2021.",
    },
    explication:
      "Un zettaoctet, c'est mille milliards de gigaoctets : de quoi remplir 8 milliards de smartphones de 128 Go. Textes, photos, vidéos, clics : c'est la matière première. Sans elle, les réseaux de neurones actuels n'auraient rien à apprendre, et c'est pour ça qu'ils ne pouvaient pas exister il y a vingt ans.",
    details: [
      "Les points de la courbe, d'après les études IDC successives : 1,8 zettaoctet en 2011 (Digital Universe 2011), 2,8 en 2012 (Digital Universe, déc. 2012), 4,4 en 2013 (Digital Universe 2014), 33 en 2018 (Data Age 2025, nov. 2018), 64,2 en 2020 et 181 prévus pour 2025 (Global DataSphere, mars 2021). Les méthodes ont changé d'une édition à l'autre : c'est un ordre de grandeur, pas une série continue.",
      "ImageNet, la base d'images qui a permis AlexNet : 14 millions d'images annotées à la main, dont 1,2 million dans 1 000 catégories pour le concours de 2012.",
      "Llama 3 (Meta, 2024) a été entraîné sur plus de 15 000 milliards de mots-morceaux (tokens), sept fois plus que la version précédente.",
    ],
    source: "https://rcpmag.com/blogs/scott-bekker/2021/03/data-creation-hit-64zb-in-2020.aspx",
    sourceTitre: "IDC, « Global DataSphere Forecast 2021–2025 », mars 2021, cité par Redmond Channel Partner (le communiqué IDC n'est plus accessible)",
    verifie: "2026-09-25",
    sourcesComplementaires: [
      { titre: "IDC, « The Digitization of the World » (nov. 2018) : la définition du zettaoctet", url: "https://www.seagate.com/files/www-content/our-story/trends/files/idc-seagate-dataage-whitepaper.pdf" },
      { titre: "Data Center Knowledge, « Digital Universe to Add 1.8 Zettabytes in 2011 »", url: "https://www.datacenterknowledge.com/archives/2011/06/28/digital-universe-to-add-1-8-zettabytes-in-2011" },
      { titre: "ImageNet, page « About »", url: "https://www.image-net.org/about.php" },
      { titre: "Meta, « Introducing Meta Llama 3 » (avril 2024)", url: "https://ai.meta.com/blog/meta-llama-3/" },
      { titre: "IDC, « The Digital Universe in 2020 » (déc. 2012) : 2,8 zettaoctets en 2012", url: "https://www.cs.princeton.edu/courses/archive/spring13/cos598C/idc-the-digital-universe-in-2020.pdf" },
      { titre: "IDC/EMC, Digital Universe 2014 : 4,4 zettaoctets en 2013 (cité par SecurityWeek)", url: "https://www.securityweek.com/digital-universe-creating-data-faster-we-can-properly-secure-it-says-emc/" },
    ],
  },
  {
    id: "algorithmes",
    titre: "Un coût divisé par mille",
    serie: {
      titre: "Prix d'un million de tokens à niveau constant (GPT-3.5), de 2021 à 2024",
      unite: "$ par million de tokens en entrée",
      log: true,
      points: [
        { x: 2021.85, y: 60, etiquette: "GPT-3" },
        { x: 2023.17, y: 2, etiquette: "GPT-3.5 Turbo" },
        { x: 2024.07, y: 0.5 },
        { x: 2024.55, y: 0.15, etiquette: "GPT-4o mini" },
        { x: 2024.85, y: 0.06 },
      ],
      annotation: { x: 2024.85, y: 0.06, texte: "÷ 1 000 en trois ans", ancre: "end" },
      legende: "À niveau égal, le prix est divisé par dix chaque année : meilleurs algorithmes, meilleures puces (a16z, OpenAI).",
    },
    explication:
      "En juin 2017, un article de huit chercheurs, alors chez Google, propose le transformer : un réseau qui lit tous les mots d'une phrase en même temps au lieu d'un par un, donc exactement ce qu'un GPU sait accélérer. Presque tous les grands modèles actuels en descendent. Et les idées continuent de s'améliorer : à puissance égale, on fait deux fois mieux tous les huit mois environ.",
    details: [
      "Les points de la courbe : GPT-3 davinci, 60 $ le million de tokens en novembre 2021 (a16z) ; GPT-3.5 Turbo, 2 $ le 1er mars 2023 (OpenAI : « 10 fois moins cher ») ; 0,50 $ en entrée le 25 janvier 2024 (OpenAI) ; GPT-4o mini, 0,15 $ en entrée le 18 juillet 2024 (OpenAI) ; Llama 3.2 3B, 0,06 $ fin 2024 (a16z). Même niveau de test MMLU, environ 42, d'un bout à l'autre.",
      "Vaswani et al., « Attention Is All You Need », soumis le 12 juin 2017 : huit auteurs, tous chez Google Brain ou Google Research à l'époque, l'un d'eux étudiant à l'université de Toronto en stage.",
      "Ho et al. (Epoch AI, mars 2024) : le calcul requis pour un niveau donné « a été divisé par deux environ tous les 8 mois » entre 2012 et 2023, avec une large incertitude (5 à 14 mois). Le tableau de bord Epoch de février 2026 donne 7,6 mois.",
      "Pour comparaison, le matériel progresse moins vite : la puissance des puces d'IA double tous les 2,3 ans environ (Epoch AI).",
    ],
    source: "https://arxiv.org/abs/1706.03762",
    sourceTitre: "Vaswani et al., « Attention Is All You Need », arXiv:1706.03762, 12 juin 2017",
    verifie: "2026-09-25",
    sourcesComplementaires: [
      { titre: "Ho et al., « Algorithmic progress in language models », arXiv:2403.05812, mars 2024", url: "https://arxiv.org/abs/2403.05812" },
      { titre: "Epoch AI, Trends dashboard (févr. 2026)", url: "https://epoch.ai/trends" },
      { titre: "University of Toronto, « U of T undergrad co-authors important machine learning study at Google »", url: "https://www.utoronto.ca/news/making-impact-u-t-undergrad-co-authors-important-machine-learning-study-google" },
      { titre: "a16z, « LLMflation: LLM inference cost is going down fast » (12 nov. 2024)", url: "https://a16z.com/llmflation-llm-inference-cost/" },
      { titre: "OpenAI, « Introducing ChatGPT and Whisper APIs » (1er mars 2023)", url: "https://openai.com/index/introducing-chatgpt-and-whisper-apis/" },
      { titre: "OpenAI, « New embedding models and API updates » (25 janv. 2024)", url: "https://openai.com/index/new-embedding-models-and-api-updates/" },
      { titre: "OpenAI, « GPT-4o mini: advancing cost-efficient intelligence » (18 juil. 2024)", url: "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/" },
    ],
  },
];
