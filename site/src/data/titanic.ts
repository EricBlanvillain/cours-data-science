/**
 * Les chiffres de la séance 7, obtenus en rejouant le notebook 07_kaggle_titanic_1.ipynb sur la copie publique de train.csv
 * qu'il charge quand les fichiers Kaggle sont absents (mêmes 891 passagers, mêmes 12 colonnes) :
 *   https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv
 * Calculé le 27/09/2026 dans un environnement proche de Colab (pandas 2.2.3, scikit-learn 1.9) :
 *
 *   shape ; isna().sum() ; Survived.mean()                          → (891, 12) ; Age 177, Cabin 687, Embarked 2 ; 38,4 %
 *   groupby("Sex") ; Age < 12                                       → femmes 74 %, hommes 19 % ; enfants 57 % contre 37 %
 *   groupby("Pclass") ; × Sex                                       → 63 / 47 / 24 % ; femme 3e 50 %, homme 1re 37 %
 *   pd.qcut(Fare, 4)                                                → 20 / 30 / 45 / 58 %
 *   Famille = SibSp + Parch + 1                                     → seul 30 % (537), 2 : 55 %, 3 : 58 %, 4 : 72 %, 5 et plus 16 % (62)
 *   groupby("Embarked") ; crosstab(Embarked, Pclass)                → Cherbourg 55 %, Southampton 34 % ; 85 premières classes sur 168 à Cherbourg
 *   Name.str.extract(r",\s*([^\.]+)\.")                             → 17 titres ; regroupés : Mr 517, Miss 185, Mrs 126, Master 40, Autre 23
 *   groupby("Titre") : survie, âge médian                           → Mr 16 %, 30 ans ; Mrs 79 %, 35 ; Miss 70 %, 21 ; Master 57 %, 3,5 ; Autre 35 %, 48,5
 *   Age.median()                                                    → 28 ans (714 âges connus)
 *   modèle bête (toujours « n'a pas survécu »)                      → 61,6 %
 *   cross_val_score(cv=5) : régression logistique / forêt (200, 5)  → 80,4 % / 82,7 % ; paquets de la forêt 85,5 / 82,0 / 82,6 / 79,8 / 83,7
 *   forêt sans limite de profondeur                                 → 80,5 %
 * Le bilan du naufrage (1 502 morts sur 2 224 passagers et membres d'équipage) et la mesure du score (la part de passagers
 * bien prédits) sont ceux de la page de la compétition, https://www.kaggle.com/competitions/titanic, vérifiés le 27/09/2026.
 * Aucune valeur n'est inventée ; pour en changer, rejouer le notebook et coller le résultat ici.
 */
export const KAGGLE = "https://www.kaggle.com/competitions/titanic";
export const naufrage = { morts: 1502, abord: 2224 };
export const fichiers = { train: 891, test: 418, colonnes: 12 };
export const survieGlobale = 38.4;
export const vides = { age: 177, cabine: 687, port: 2 };

export const hypotheses = [
  { titre: "Les femmes et les enfants d'abord", barres: [{ l: "femmes", v: 74 }, { l: "hommes", v: 19 }], verdict: "confirmée", ligne: "74 % des femmes survivent, 19 % des hommes" },
  { titre: "La classe compte", barres: [{ l: "1re", v: 63 }, { l: "2e", v: 47 }, { l: "3e", v: 24 }], verdict: "confirmée", ligne: "63 % en 1re classe, 24 % en 3e" },
  { titre: "Le prix du billet", barres: [{ l: "bon marché", v: 20 }, { l: "moyen", v: 30 }, { l: "cher", v: 45 }, { l: "très cher", v: 58 }], verdict: "confirmée", ligne: "près de 3 fois plus de survivants chez les plus chers" },
  { titre: "La famille à bord", barres: [{ l: "seul", v: 30 }, { l: "2", v: 55 }, { l: "3", v: 58 }, { l: "4", v: 72 }, { l: "5+", v: 16 }], verdict: "nuancée", ligne: "mieux à 2, 3 ou 4 ; seul ou à 5 et plus, c'est pire" },
];

export const titres = {
  exemple: "Braund, Mr. Owen Harris",
  bruts: 17,
  groupes: [
    { titre: "Mr", n: 517, survie: 16, age: 30 },
    { titre: "Miss", n: 185, survie: 70, age: 21 },
    { titre: "Mrs", n: 126, survie: 79, age: 35 },
    { titre: "Master", n: 40, survie: 57, age: 3.5 },
    { titre: "Autre", n: 23, survie: 35, age: 48.5 },
  ],
  ageMedianGlobal: 28,
  agesConnus: 714,
};

export const validation = { bete: 61.6, logistique: 80.4, foret: 82.7, foretPaquets: [85.5, 82.0, 82.6, 79.8, 83.7], foretSansLimite: 80.5 };

/** le jeu « qui avait le plus de chances ? » : deux groupes réels de train.csv, leur taux de survie */
export type Duel = { a: { l: string; v: number; n: number }; b: { l: string; v: number; n: number }; pourquoi: string };
export const duels: Duel[] = [
  { a: { l: "une femme de 3e classe", v: 50, n: 144 }, b: { l: "un homme de 1re classe", v: 37, n: 122 }, pourquoi: "Le sexe pèse plus lourd que la classe : même en 3e, une femme avait plus de chances qu'un homme de 1re." },
  { a: { l: "un passager seul", v: 30, n: 537 }, b: { l: "un passager d'une famille de 4", v: 72, n: 29 }, pourquoi: "Une petite famille a sans doute pu s'entraider. Mais attention, 29 passagers seulement : un petit groupe fait des taux fragiles." },
  { a: { l: "un passager d'une famille de 6", v: 14, n: 22 }, b: { l: "un passager seul", v: 30, n: 537 }, pourquoi: "Au-delà de 4, la survie s'effondre. Ces grandes familles voyageaient surtout en 3e classe : 17 passagers sur 22 ici." },
  { a: { l: "un garçon au titre « Master »", v: 57, n: 40 }, b: { l: "un homme au titre « Mr »", v: 16, n: 517 }, pourquoi: "« Master » désignait les petits garçons (âge médian 3,5 ans) : enfants d'abord. Le titre dit à la fois le sexe et l'âge." },
  { a: { l: "un passager embarqué à Southampton", v: 34, n: 644 }, b: { l: "un passager embarqué à Cherbourg", v: 55, n: 168 }, pourquoi: "Le port ne sauve personne : à Cherbourg, 85 passagers sur 168 étaient en 1re classe. C'est la classe qui se cache derrière le port." },
  { a: { l: "un enfant de moins de 12 ans", v: 57, n: 68 }, b: { l: "une femme", v: 74, n: 314 }, pourquoi: "Les enfants s'en sortent mieux que la moyenne, mais les femmes plus encore : beaucoup d'enfants voyageaient en 3e classe." },
];
