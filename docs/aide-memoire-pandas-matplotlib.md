# Aide-mémoire pandas et matplotlib

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
```

## Charger et regarder (séance 2)

| Code | Ce que ça fait |
|---|---|
| `df = pd.read_csv("fichier.csv")` | Charger un CSV (un chemin ou une URL) |
| `pd.read_csv(url, sep=";", encoding="latin-1")` | Séparateur point-virgule, encodage français |
| `df.head()`, `df.tail(3)` | Les 5 premières lignes, les 3 dernières |
| `df.shape` | (nombre de lignes, nombre de colonnes) |
| `df.columns` | Le nom des colonnes |
| `df.dtypes` | Le type de chaque colonne |
| `df.info()` | Colonnes, types, nombre de valeurs non vides |
| `df.describe()` | Moyenne, min, max, quartiles des colonnes numériques |
| `df.sample(5)` | 5 lignes au hasard |
| `df.to_csv("sortie.csv", index=False)` | Enregistrer (sans la colonne d'index) |

## Sélectionner

| Code | Ce que ça fait |
|---|---|
| `df["Name"]` | Une colonne (une *Series*) |
| `df[["Name", "HP"]]` | Plusieurs colonnes (un DataFrame) |
| `df.iloc[0]` | La première ligne (par position) |
| `df.loc[df["HP"] > 100]` ou `df[df["HP"] > 100]` | Filtrer par condition |
| `df[(df["HP"] > 100) & (df["Type 1"] == "Fire")]` | Deux conditions : `&` (et), `|` (ou), parenthèses obligatoires |
| `df[df["Type 1"].isin(["Fire", "Water"])]` | Valeur dans une liste |
| `df[df["Name"].str.contains("Mega")]` | Texte qui contient |
| `df["HP"].max()`, `.min()`, `.mean()`, `.median()`, `.sum()` | Statistiques d'une colonne |
| `df["Type 1"].unique()`, `.nunique()` | Valeurs distinctes, leur nombre |
| `df["Type 1"].value_counts()` | Compter chaque valeur |
| `df.sort_values("HP", ascending=False)` | Trier |
| `df.nlargest(5, "HP")` | Les 5 plus grands |

## Transformer

| Code | Ce que ça fait |
|---|---|
| `df["Total"] = df["HP"] + df["Attack"]` | Nouvelle colonne calculée |
| `df["Ratio"] = df["Attack"] / df["Defense"]` | Idem |
| `df["Nom_min"] = df["Name"].str.lower()` | Opérations texte : `.str.upper()`, `.str.strip()`, `.str.replace()`, `.str.len()` |
| `df["Cat"] = df["HP"].apply(lambda x: "fort" if x > 80 else "faible")` | Appliquer une fonction ligne par ligne |
| `df["Type 1"].map({"Fire": "Feu", "Water": "Eau"})` | Remplacer par un dictionnaire |
| `df.rename(columns={"Type 1": "Type"})` | Renommer |
| `df.drop(columns=["#"])` | Supprimer des colonnes |
| `df["Date"] = pd.to_datetime(df["Date"])` | Convertir en date, puis `.dt.year`, `.dt.month` |
| `pd.cut(df["HP"], bins=[0, 50, 100, 300], labels=["fragile", "solide", "tank"])` | Découper en tranches |

## Nettoyer (séance 4)

| Code | Ce que ça fait |
|---|---|
| `df.isna().sum()` | Nombre de valeurs manquantes par colonne |
| `df.dropna()` | Supprimer les lignes avec une valeur manquante |
| `df.dropna(subset=["Age"])` | Seulement si `Age` est vide |
| `df["Age"].fillna(df["Age"].median())` | Remplir par la médiane |
| `df["Type 2"].fillna("Aucun")` | Remplir par une valeur |
| `df.duplicated().sum()` | Nombre de doublons |
| `df.drop_duplicates()` | Supprimer les doublons |
| `df["Type 1"].str.strip().str.capitalize()` | Uniformiser des catégories (espaces, casse) |
| `pd.to_numeric(df["Prix"], errors="coerce")` | Convertir en nombre, les ratés deviennent `NaN` |
| `pd.to_datetime(df["Date"], errors="coerce", dayfirst=True)` | Dates au format français |
| `df = df.reset_index(drop=True)` | Renuméroter après un filtrage |

## Regrouper et croiser

| Code | Ce que ça fait |
|---|---|
| `df.groupby("Type 1")["HP"].mean()` | Moyenne de HP par type |
| `df.groupby("Type 1").size()` | Nombre de lignes par groupe |
| `df.groupby("Type 1")["HP"].agg(["mean", "max", "count"])` | Plusieurs statistiques |
| `df.groupby(["Type 1", "Legendary"])["HP"].mean()` | Deux niveaux |
| `.sort_values(ascending=False).head(10)` | À enchaîner après un groupby |
| `pd.crosstab(df["Type 1"], df["Legendary"])` | Tableau croisé des effectifs |
| `df.pivot_table(values="HP", index="Type 1", columns="Generation", aggfunc="mean")` | Tableau croisé avec une statistique |
| `df["HP"].corr(df["Attack"])` | Corrélation entre deux colonnes (de -1 à 1) |
| `df.corr(numeric_only=True)` | Matrice de corrélation |
| `pd.merge(df, types, on="Type 1", how="left")` | Joindre deux tableaux (comme un JOIN en SQL) |
| `pd.concat([df1, df2])` | Empiler deux tableaux |

## Les graphiques matplotlib (séance 2)

Toujours le même squelette :
```python
plt.figure(figsize=(8, 4))
# ... le graphique ...
plt.title("Titre")
plt.xlabel("axe x")
plt.ylabel("axe y")
plt.show()
```

| Graphique | Code | Quand |
|---|---|---|
| Barres | `plt.bar(categories, valeurs)` ou `serie.plot(kind="bar")` | Comparer des catégories |
| Barres horizontales | `serie.plot(kind="barh")` | Beaucoup de catégories |
| Courbe | `plt.plot(x, y)` | Une évolution dans le temps |
| Nuage de points | `plt.scatter(df["Attack"], df["Defense"])` | Deux colonnes numériques : bougent-elles ensemble ? |
| Histogramme | `plt.hist(df["HP"], bins=20)` | La répartition d'une colonne |
| Boîte à moustaches | `df.boxplot(column="HP", by="Type 1")` | Répartition par groupe, repérer les valeurs extrêmes |
| Camembert | `serie.plot(kind="pie")` | À éviter au-delà de 4 parts |

Options utiles : `color="orange"`, `alpha=0.5` (transparence), `label="…"` + `plt.legend()`, `plt.xticks(rotation=45)`, `plt.grid(True)`, `plt.savefig("figure.png")`.

Raccourci pandas : `df.plot(x="Attack", y="Defense", kind="scatter")`, `df["HP"].plot(kind="hist")`.

## seaborn (plus joli, plus direct)

| Code | Ce que ça fait |
|---|---|
| `sns.scatterplot(data=df, x="Attack", y="Defense", hue="Legendary")` | Nuage de points coloré par catégorie |
| `sns.histplot(data=df, x="HP", bins=20)` | Histogramme |
| `sns.boxplot(data=df, x="Type 1", y="HP")` | Boîtes par groupe |
| `sns.barplot(data=df, x="Type 1", y="HP")` | Moyenne par groupe avec barre d'erreur |
| `sns.countplot(data=df, x="Type 1")` | Effectifs par catégorie |
| `sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")` | Matrice de corrélation colorée |
| `sns.pairplot(df[["HP", "Attack", "Defense"]])` | Tous les nuages de points deux à deux |

## Plotly Express (dashboard interactif, séance 5)

```python
import plotly.express as px
fig = px.scatter(df, x="Attack", y="Defense", color="Type 1", hover_name="Name")
fig.show()
```
Même logique pour `px.bar`, `px.line`, `px.histogram`, `px.box`. Options : `facet_col="Generation"` (un sous-graphique par valeur), `animation_frame="Generation"` (un curseur), `title="…"`.

## Les 3 pièges d'un graphique (séance 5)

1. Un axe qui ne part pas de zéro exagère les écarts.
2. Deux courbes qui montent ensemble ne prouvent pas que l'une cause l'autre.
3. Un échantillon biaisé (qui a-t-on interrogé ?) donne des résultats biaisés, quel que soit le graphique.
