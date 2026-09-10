# Projet A6 · Génération de texte : du bigramme au LLM adapté avec LoRA · ⭐⭐⭐

Réserve « pour aller plus loin » · Niveau ⭐⭐⭐ Avancé · Prérequis : séances 6 à 8 (premier modèle, Kaggle) et surtout la séance 9 (comment fonctionne un LLM, le modèle bigramme) · **pensé pour le GPU T4 gratuit de Colab** (*Exécution → Modifier le type d'exécution → T4 GPU*) — en `MODE_RAPIDE`, un CPU suffit

## Objectif

Une maison d'édition anime des ateliers d'écriture autour des classiques et voudrait un outil qui, à partir d'une amorce (« Dantès regarda… »), propose une suite *dans le style de Dumas* : pour lancer les participants, illustrer un procédé, ou fabriquer des exercices « vrai ou faux Dumas ».
Ce projet sert à l'équipe technique qui doit trancher une question de coût : un petit modèle entraîné de zéro sur le livre, ou un grand modèle pré-entraîné qu'on spécialise ? Quelques minutes de CPU d'un côté, un GPU et 494 millions de paramètres de l'autre.
À la fin, tu as quatre générateurs comparés sur les **mêmes amorces** et la **même perplexité** mesurée sur un extrait jamais vu, un fine-tuning LoRA qui n'entraîne que 0,1 % des paramètres, et une mesure du taux de copie qui dit si le modèle crée ou recopie.

## Les données

*Le Comte de Monte-Cristo*, tome I (Alexandre Dumas, 1845), depuis le **Projet Gutenberg**, livre n° 17989 : ≈ **750 000 caractères** de texte brut, téléchargés une fois depuis `https://www.gutenberg.org/cache/epub/17989/pg17989.txt` et mis en cache dans `data/`. Dumas est mort en 1870 : le texte est dans le domaine public, on peut l'utiliser librement pour entraîner un modèle — ce qui n'est pas un détail, la section 8 y revient.

**Sans réseau**, un `TEXTE_SECOURS` d'une trentaine de lignes écrit pour le notebook (une scène de port, dialogues à tirets compris) prend le relais. Tout tourne, les résultats sont juste moins bons.

**Tu peux coller ton propre texte** : une cellule dédiée accepte n'importe quel corpus dont tu as le droit d'usage — tes écrits, un autre livre du domaine public, des paroles libres — à partir de 20 000 caractères. Les amorces de la section 5 s'adaptent automatiquement.

**Le nettoyage** retire l'en-tête et le pied de licence Gutenberg (délimités par `*** START` / `*** END`), les soulignés d'italique, les espaces multiples, les lignes vides en trop, puis les caractères apparaissant **moins de 20 fois** — un vocabulaire plus petit pour le modèle caractère par caractère, une perte négligeable. Chaque geste est noté dans un journal (`caractères avant → après → pourquoi`). En `MODE_RAPIDE`, le texte est coupé à **100 000 caractères**. Les **5 % finaux** sont mis de côté comme `texte_test` : aucun modèle ne les voit, et c'est là que la perplexité est mesurée pour tout le monde.

Une particularité du projet : le « feature engineering » d'un texte, c'est **choisir l'unité**. Le notebook construit et compare les trois — le **caractère** (petit vocabulaire, séquences longues : le LSTM), le **mot** (vocabulaire énorme, mots inconnus), et le **token sous-mot** du tokenizer de Qwen (le compromis des LLM, qui découpe « Dantès » en deux ou trois morceaux). Le tableau des trois découpages, avec taille de vocabulaire et longueur de séquence, est une slide à lui tout seul.

## Ce que tu entraînes et règles

Métrique : la **perplexité par caractère** sur `texte_test`. C'est « entre combien de possibilités le modèle hésite » à chaque caractère : 1 = il connaît la suite par cœur, ≈ 90 = il tire au hasard dans le vocabulaire. Elle est calculée **par caractère** pour tout le monde — y compris pour Qwen, dont on somme les log-probabilités par token avant de diviser par le nombre de caractères — sinon on comparerait des modèles qui ne découpent pas le texte de la même façon. Ses limites sont dites franchement : elle mesure la prédictibilité, pas la qualité littéraire, d'où la grille qualitative de la section 7.

| Modèle | Ce qu'il apprend | Paramètres |
|---|---|---|
| **Unigramme** | la fréquence de chaque caractère — la baseline « bête » | ≈ 90 |
| **Bigramme** (séance 9) | `P(caractère suivant \| caractère courant)`, avec lissage +1 | ≈ 8 000 |
| **LSTM caractère** (Keras) | une mémoire de 100 caractères | ≈ 350 000 |
| **Qwen2.5-0.5B-Instruct**, sans adaptation | le français, appris ailleurs | 494 000 000 |
| **Qwen2.5-0.5B + LoRA** | le style de Dumas, par-dessus le français | ≈ 0,1 % des 494 M |

Le **LSTM** est entraîné selon la recette classique : des fenêtres de 100 caractères qui se chevauchent, et `return_sequences=True` pour prédire le caractère suivant **à chaque position** — 100 cibles par fenêtre, un apprentissage bien plus riche que de ne prédire que le 101ᵉ.

Le **fine-tuning LoRA** est le cœur du projet. *Low-Rank Adaptation* ajoute, à côté de certaines matrices d'attention, deux petites matrices `A` (d × r) et `B` (r × d) dont seul le produit est appris — les 494 millions de paramètres d'origine ne bougent pas. Avec un rang `r = 8` sur les projections `q_proj` et `v_proj` des 24 couches, on entraîne **0,1 % du modèle**, ce qui tient sur un seul GPU (et, en version miniature, sur un CPU). L'exercice 6 demande de **retrouver le nombre exact de paramètres entraînables par le calcul**, à partir de `hidden_size`, `num_key_value_heads` et `num_attention_heads` — et de vérifier que `r = 16` en donne exactement le double. C'est le meilleur moyen de comprendre ce que LoRA fait vraiment.

L'entraînement passe par le `Trainer` de `transformers` (`TrainingArguments` avec `learning_rate=2e-4`, `warmup_ratio=0.1`, `fp16` quand un GPU est là) sur des exemples de 128 tokens — **64 exemples et 1 epoch** en `MODE_RAPIDE`, tout le corpus et 3 epochs en complet.

Les **réglages de génération** ont leur section : la **température** (exercice 5 : écrire le softmax avec température et vérifier qu'à `T = 0,5` le caractère le plus probable gagne, qu'à `T = 2` il perd) et le **top-p** (*nucleus sampling*, qui coupe la longue traîne des tokens absurdes). Ce sont exactement les curseurs de toutes les API de LLM.

L'**interprétation** répond à trois questions concrètes : le modèle **recopie-t-il** le livre (un `taux_copie` sur les 8-grammes, comparé au taux « naturel » mesuré sur un vrai extrait jamais vu — au-dessus, il recopie ; très en dessous, il invente des suites de lettres qui n'existent pas) ? Que fait la **température** à la diversité des 3-grammes ? Et **que pense le modèle** à un instant donné — les 8 caractères les plus probables selon le LSTM, à côté des 8 tokens les plus probables selon Qwen + LoRA. Puis une **grille qualitative** à remplir toi-même (français correct, cohérence, style Dumas, nouveauté, notés de 0 à 2 par modèle), à confronter au classement par perplexité : sont-ils d'accord ?

## Outils et librairies

| Ce qu'on utilise | D'où ça vient |
|---|---|
| `numpy`, `pandas`, `matplotlib`, `collections`, `re`, `math` | déjà dans Colab, rien à faire |
| `requests` (le téléchargement Gutenberg) | déjà dans Colab |
| `tensorflow` / `keras` (`Embedding`, `LSTM`, `Dense`) pour le modèle caractère | déjà dans Colab |
| `torch` et `transformers` (`AutoTokenizer`, `AutoModelForCausalLM`, `Trainer`) | déjà dans Colab |
| `peft` (LoRA) + `accelerate` | **pas préinstallé** : le notebook fait `import peft` dans un `try/except` qui lance `pip install -q peft accelerate` si besoin |
| `Qwen/Qwen2.5-0.5B-Instruct` (≈ 1 Go, licence Apache 2.0) | téléchargé automatiquement depuis Hugging Face, **sans compte ni jeton** |
| Le corpus, par URL Gutenberg | rien à installer |

**Aucune clé d'API, aucun compte, aucun paiement.** En local : `pip install -r ../requirements.txt`.

## Déroulé (≈ 3 h)

Le notebook est bâti en 9 sections numérotées de 0 à 9.

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | **§0 Préparation** : `MODE_RAPIDE`, les helpers, l'installation de `peft`, le choix de l'appareil (GPU ou CPU) |
| 10-25 min | **§1 Contexte** : la question métier, et surtout la métrique — ce qu'est une perplexité, pourquoi *par caractère*, ce qu'elle ne mesure pas |
| 25-40 min | **§2 Les données** : téléchargement Gutenberg, dictionnaire des variables manipulées, option « colle ton propre texte » |
| 40-70 min | **§3 Nettoyage et unités** : le journal, la coupe des caractères rares, le hold-out des 5 % finaux, le tableau caractère / mot / token — **exercices 1 et 2** (découper en phrases, encoder / décoder) |
| 70-95 min | **§4 Analyse exploratoire** : caractères les plus fréquents, longueur des mots et des phrases, mots de style hors mots vides (**exercice 3**), loi de Zipf, et la **matrice de transition** — qui *est* le modèle bigramme |
| 95-135 min | **§5 Modèles candidats** : unigramme et bigramme avec leur perplexité, génération bigramme (**exercice 4**), le LSTM caractère et sa courbe, la température (**exercice 5**), puis Qwen sans adaptation |
| 135-175 min | **§6 Fine-tuning LoRA** : la configuration `r=8` sur `q_proj`/`v_proj`, le calcul des paramètres entraînables (**exercice 6**), l'entraînement, la courbe de perte, l'avant / après sur les mêmes amorces, tes propres réglages (**exercice 7**) |
| 175-195 min | **§7 Interprétation** : taux de copie, diversité selon la température (**exercice 8**), ce que pense le modèle, la grille qualitative (**exercice 9**) |
| 195-200 min | **§8 Conclusion** (la recommandation, les limites juridiques et de mémorisation) et **§9 Pour aller plus loin** |

En `MODE_RAPIDE = True` (100 000 caractères, 8 epochs de LSTM, 64 exemples LoRA), compte **quelques minutes** de calcul, GPU ou non ; en version complète sur GPU T4 (tout le tome, 30 epochs, 3 epochs de LoRA), davantage. C'est en version complète seulement que le modèle prend vraiment l'accent de Dumas : tirets de dialogue, « Monsieur », vocabulaire de marine.

Si le temps manque : arrête-toi à la fin de la section 5, quand les quatre premières perplexités sont au tableau. Le résultat marquant est déjà là — Qwen, qui n'a jamais lu une ligne de Dumas, écrase le LSTM entraîné sur le livre. LoRA fait une reprise nette au créneau suivant.

## Livrable

`A6_generation_texte.ipynb` exécuté de bout en bout, les neuf exercices en ✅, la cellule `MA_SYNTHESE` remplie — plus un **rapport de 10 à 15 slides** suivant [`../gabarit-rapport.md`](../gabarit-rapport.md), présenté en 10 minutes. Deux slides sont obligatoires ici : le **tableau perplexité / paramètres / temps d'entraînement** pour les cinq lignes, et une slide **avant / après LoRA** sur la même amorce, texte généré à l'appui. La slide « démo » : ton amorce à toi, générée à trois températures.

## Critères d'évaluation

| Critère | En route | Atteint | Dépassé |
|---|---|---|---|
| **1. La métrique** | Les textes sont jugés « à l'œil » | La perplexité est définie, calculée **par caractère** pour tous les modèles, sur un extrait que personne n'a vu | Ses limites sont montrées, pas seulement dites : la grille qualitative et le classement par perplexité sont comparés, et les désaccords sont commentés |
| **2. Les baselines** | On commence par le LSTM | Unigramme **et** bigramme mesurés d'abord, présents au tableau, et le bigramme génère vraiment du texte | Tu expliques ce que le bigramme capte (q → u, espace après ponctuation) et ce qu'il ne peut structurellement pas capter |
| **3. Le choix de l'unité** | Le découpage n'est pas discuté | Les trois unités sont comparées chiffres en main (taille de vocabulaire, longueur de séquence, caractères par unité) | Tu montres un mot découpé en sous-mots par le tokenizer et tu expliques pourquoi c'est le compromis qu'ont retenu tous les LLM |
| **4. LoRA** | `get_peft_model` appelé sans comprendre | Configuration expliquée (`r`, `alpha`, modules ciblés), part des paramètres entraînables affichée, perplexité avant → après | Le nombre de paramètres entraînables est **retrouvé par le calcul** et vérifié pour `r = 8` et `r = 16` |
| **5. Les réglages de génération** | Tout est généré avec les valeurs par défaut | Température et top-p expliqués et testés, avec au moins trois réglages sur la même amorce | La diversité est **mesurée** en fonction de la température (courbe), et tu recommandes un réglage pour l'usage métier visé |
| **6. Copie, limites et recommandation** | « Le modèle écrit comme Dumas » | Le taux de copie est mesuré et comparé à la référence, la recommandation est argumentée par le rapport gain / coût | Les limites sont nommées et hiérarchisées — mémorisation, hallucination, **droits d'auteur si le corpus n'était pas libre** — et un garde-fou concret est proposé |

## Pour aller plus loin

- **Monter le rang et élargir les cibles.** `r = 32` et les quatre projections (`q_proj`, `k_proj`, `v_proj`, `o_proj`) au lieu de deux : plus de capacité d'adaptation, plus de risque de mémorisation. Mesure les deux — perplexité **et** taux de copie — et regarde où est le bon compromis. C'est exactement l'arbitrage que fait une équipe en production.
- **Un garde-fou anti-copie.** Rejette automatiquement toute génération dont le taux de copie sur 8-grammes dépasse un seuil, et régénère. Mesure combien de générations sont rejetées à différents seuils : c'est la version « produit » du graphique de la section 7.
- **Une évaluation en aveugle.** Mélange des extraits vrais de Dumas et des générations du modèle, fais-les classer par plusieurs personnes, et compare leur taux de bonne réponse à ce que prédisait la perplexité. Si les gens se trompent une fois sur deux, tu as un résultat bien plus convaincant que n'importe quel chiffre.

## Liens utiles

- Le corpus : https://www.gutenberg.org/ebooks/17989 · le fichier texte utilisé : https://www.gutenberg.org/cache/epub/17989/pg17989.txt
- Le modèle, gratuit et sans clé : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- **LoRA** : l'article d'origine https://arxiv.org/abs/2106.09685 · la bibliothèque `peft` https://huggingface.co/docs/peft/index
- Entraîner un modèle de langue causal avec `Trainer` (cours Hugging Face) : https://huggingface.co/learn/llm-course/chapter3/3 · la classe `Trainer` en détail : https://huggingface.co/docs/transformers/main/en/main_classes/trainer
- La perplexité, expliquée et calculée : https://huggingface.co/docs/transformers/main/en/perplexity
- Tous les réglages de génération (température, top-k, top-p, beam search) : https://huggingface.co/docs/transformers/main/en/generation_strategies
- L'article fondateur sur les réseaux récurrents qui écrivent, de Karpathy : https://karpathy.github.io/2015/05/21/rnn-effectiveness/ · sa suite logique, écrire un GPT en 300 lignes : https://github.com/karpathy/nanoGPT
- La couche `LSTM` de Keras : https://keras.io/api/layers/recurrent_layers/lstm/
- Le projet frère, qui fine-tune un modèle de langue pour **classer** au lieu de générer : [projet A5 · Classification de texte](../A5-classification-texte/)
- Le gabarit du rapport : [`../gabarit-rapport.md`](../gabarit-rapport.md)
