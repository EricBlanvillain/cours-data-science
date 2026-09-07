# Aide-mémoire SQL (SQLite)

SQL sert à poser des questions à une base de données. Dans l'atelier, on utilise SQLite, une base qui tient dans un fichier (ou en mémoire) et qui est intégrée à Python.

## Ouvrir une base dans Colab (séance 3)

```python
import sqlite3
import pandas as pd

con = sqlite3.connect(":memory:")            # ou "ma_base.db" pour un fichier
df.to_sql("pokemon", con, index=False)       # un DataFrame devient une table
pd.read_sql("SELECT * FROM pokemon LIMIT 5", con)   # une requête devient un DataFrame
```

## Les mots-clés, dans l'ordre où on les écrit

```sql
SELECT   colonnes            -- quoi
FROM     table               -- d'où
JOIN     autre_table ON ...  -- avec quelle autre table
WHERE    condition           -- quelles lignes
GROUP BY colonne             -- regroupées comment
HAVING   condition           -- quels groupes garder
ORDER BY colonne DESC        -- triées comment
LIMIT    10                  -- combien
```

## SELECT et WHERE

| Requête | Ce qu'elle fait |
|---|---|
| `SELECT * FROM pokemon` | Toutes les colonnes, toutes les lignes |
| `SELECT Name, HP FROM pokemon` | Deux colonnes |
| `SELECT DISTINCT "Type 1" FROM pokemon` | Les valeurs distinctes (guillemets doubles si le nom contient un espace) |
| `SELECT * FROM pokemon WHERE HP > 100` | Filtrer |
| `WHERE "Type 1" = 'Fire' AND Legendary = 1` | Deux conditions (texte entre guillemets simples) |
| `WHERE "Type 1" IN ('Fire', 'Water')` | Valeur dans une liste |
| `WHERE HP BETWEEN 50 AND 80` | Intervalle (bornes incluses) |
| `WHERE Name LIKE 'Mega%'` | Commence par Mega (`%` = n'importe quoi, `_` = un caractère) |
| `WHERE "Type 2" IS NULL` | Valeur manquante (`IS NOT NULL` pour l'inverse) |
| `WHERE NOT Legendary` | Négation |

## Trier et limiter

| Requête | Ce qu'elle fait |
|---|---|
| `... ORDER BY HP DESC` | Du plus grand au plus petit (`ASC` ou rien : croissant) |
| `... ORDER BY "Type 1", HP DESC` | Deux critères |
| `... LIMIT 5` | Les 5 premières lignes |
| `SELECT * FROM pokemon ORDER BY HP DESC LIMIT 5` | Le top 5 |

## Calculer et regrouper

| Requête | Ce qu'elle fait |
|---|---|
| `SELECT COUNT(*) FROM pokemon` | Nombre de lignes |
| `SELECT AVG(HP), MAX(HP), MIN(HP), SUM(HP) FROM pokemon` | Moyenne, max, min, somme |
| `SELECT ROUND(AVG(HP), 1) FROM pokemon` | Arrondi |
| `SELECT "Type 1", COUNT(*) FROM pokemon GROUP BY "Type 1"` | Effectif par type |
| `SELECT "Type 1", AVG(HP) AS hp_moyen FROM pokemon GROUP BY "Type 1" ORDER BY hp_moyen DESC` | Moyenne par type, triée (`AS` = surnom) |
| `... GROUP BY "Type 1" HAVING COUNT(*) > 20` | Ne garder que les groupes assez gros |
| `SELECT HP + Attack AS total FROM pokemon` | Colonne calculée |

## JOIN (deux tables)

```sql
SELECT p.Name, p."Type 1", t.faiblesse
FROM pokemon AS p
JOIN types AS t ON p."Type 1" = t.type
WHERE t.faiblesse = 'Water'
```
`JOIN` (ou `INNER JOIN`) garde les lignes qui ont une correspondance des deux côtés. `LEFT JOIN` garde toutes les lignes de la table de gauche, même sans correspondance.

## Modifier des données (rarement dans l'atelier)

| Requête | Ce qu'elle fait |
|---|---|
| `CREATE TABLE types (type TEXT, faiblesse TEXT)` | Créer une table |
| `INSERT INTO types VALUES ('Fire', 'Water')` | Ajouter une ligne |
| `UPDATE pokemon SET HP = 50 WHERE Name = 'Pikachu'` | Modifier |
| `DELETE FROM pokemon WHERE HP < 10` | Supprimer (sans `WHERE`, tout est supprimé !) |
| `DROP TABLE types` | Supprimer la table |

## SQL ↔ pandas (le mini-défi de la séance 3)

| SQL | pandas |
|---|---|
| `SELECT Name, HP FROM p` | `df[["Name", "HP"]]` |
| `WHERE HP > 100` | `df[df["HP"] > 100]` |
| `ORDER BY HP DESC LIMIT 5` | `df.sort_values("HP", ascending=False).head(5)` |
| `SELECT COUNT(*) ... GROUP BY "Type 1"` | `df["Type 1"].value_counts()` |
| `SELECT AVG(HP) ... GROUP BY "Type 1"` | `df.groupby("Type 1")["HP"].mean()` |
| `SELECT DISTINCT "Type 1"` | `df["Type 1"].unique()` |
| `JOIN types ON ...` | `pd.merge(df, types, left_on="Type 1", right_on="type")` |

## Erreurs fréquentes

| Message | Cause |
|---|---|
| `no such table` | La table n'a pas été créée avec `to_sql`, ou la connexion a été refaite |
| `no such column` | Faute de frappe, ou nom avec espace sans guillemets doubles |
| `near "FROM": syntax error` | Virgule en trop après la dernière colonne du `SELECT` |
| Résultat vide | Comparaison de texte sensible à la casse : `'fire'` ≠ `'Fire'` |
