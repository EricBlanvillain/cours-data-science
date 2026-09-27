/**
 * Lint des leçons (src/content/lecons/*.mdx). Lancé par `npm run lint:lecons` et au début de `npm run build`, donc par
 * Vercel : une leçon qui casse une règle ne se déploie pas. Aucune dépendance.
 * Le plafond de 625 mots visibles se mesure sur la page construite, après astro build : scripts/compte-prose.mjs.
 *
 * Règles, une par ligne de sortie quand elle casse :
 *  1. frontmatter : pour numero ≥ 1, livrable présent, objectifs 1 à 3, aRetenir 1 à 5 ;
 *  2. imports : seulement le vocabulaire des blocs (README, « Blocs d'une leçon ») ;
 *  3. chaque <details> a un <summary> ;
 *  4. titres en ## ou ### seulement ;
 *  5. un libellé de lien qui finit par → pointe dans le site, par ↗ hors du site ;
 *  6. aucune phrase n'annonce une figure (« ci-dessous », « ci-dessus », « le schéma suivant », « la figure suivante »,
 *     « voici un schéma ») : une figure remplace son explication, elle n'est jamais introduite par elle ;
 *  7. pour numero ≥ 1, une entrée de 4 questions existe dans src/data/quiz.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = path.join(ROOT, "src/content/lecons");
const QUIZ = path.join(ROOT, "src/data/quiz.ts");

/* Le vocabulaire des blocs : ce qu'une leçon a le droit d'importer. */
const VOCABULAIRE = [
  /^\.\.\/\.\.\/components\/schemas\/[A-Za-z0-9]+\.astro$/,                      // schémas et courbes SVG
  /^\.\.\/\.\.\/components\/islands\/(Frise|ClassifOuRegression|AccueilSeance0|QuelGraphique|QuelleCommande|SupprimerRemplirGarder|QuelPiege|CeModeleACompris)$/,  // îlots interactifs
  /^\.\.\/\.\.\/components\/(Causes|CartesNumerotees|BoutonsSeance)\.astro$/,     // blocs composés
  /^\.\.\/\.\.\/data\/[a-z0-9-]+$/,                                             // données typées
];
const ANNONCES = ["ci-dessous", "ci-dessus", "le schéma suivant", "la figure suivante", "voici un schéma"];

/* Frontmatter : un YAML minimal, clé: valeur et listes « - item ». */
function lireFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { data: {}, corps: src };
  const data = {}; let cle = null;
  for (const ligne of m[1].split("\n")) {
    const liste = ligne.match(/^\s+-\s+(.*)$/);
    if (liste && cle) { if (!Array.isArray(data[cle])) data[cle] = []; data[cle].push(liste[1].trim()); continue; }
    const kv = ligne.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) { cle = kv[1]; data[cle] = kv[2].trim() === "" ? [] : kv[2].trim(); }
  }
  return { data, corps: src.slice(m[0].length) };
}


function quizParSeance() {
  if (!fs.existsSync(QUIZ)) return {};
  const src = fs.readFileSync(QUIZ, "utf8");
  const compte = {};
  const blocs = src.split(/\n  (\d+): \[/);
  for (let i = 1; i < blocs.length; i += 2) compte[Number(blocs[i])] = (blocs[i + 1].split(/\n  \d+: \[|\n\};/)[0].match(/^\s*question:/gm) || []).length;
  return compte;
}

const quiz = quizParSeance();
const fichiers = fs.readdirSync(DOSSIER).filter((f) => f.endsWith(".mdx")).sort();
let total = 0;
for (const f of fichiers) {
  const src = fs.readFileSync(path.join(DOSSIER, f), "utf8");
  const { data, corps } = lireFrontmatter(src);
  const fautes = [];
  const numero = Number(data.numero);
  // 1. frontmatter
  if (numero >= 1) {
    if (!data.livrable) fautes.push("frontmatter : livrable manquant");
    const o = Array.isArray(data.objectifs) ? data.objectifs.length : 0; if (o < 1 || o > 3) fautes.push(`frontmatter : ${o} objectif(s), il en faut 1 à 3`);
    const r = Array.isArray(data.aRetenir) ? data.aRetenir.length : 0; if (r < 1 || r > 5) fautes.push(`frontmatter : ${r} ligne(s) « à retenir », il en faut 1 à 5`);
  }
  // 2. imports
  for (const m of corps.matchAll(/^import .* from "([^"]+)";?$/gm)) if (!VOCABULAIRE.some((re) => re.test(m[1]))) fautes.push(`import hors vocabulaire : ${m[1]}`);
  // 3. replis
  for (const m of corps.matchAll(/<details[\s\S]*?<\/details>/g)) if (!/<summary/.test(m[0])) fautes.push("un <details> sans <summary>");
  // 4. titres
  const sansCode = corps.replace(/```[\s\S]*?```/g, "");
  for (const m of sansCode.matchAll(/^(#{1,6})\s/gm)) if (m[1].length < 2 || m[1].length > 3) fautes.push(`titre en ${m[1]} : seuls ## et ### sont permis`);
  // 5. flèches des liens
  const interne = (u) => !/^https?:\/\//.test(u);
  for (const m of sansCode.matchAll(/\[([^\]]*)\]\(([^)\s]+)\)/g)) { const lab = m[1].trim(); if (lab.endsWith("→") && !interne(m[2])) fautes.push(`lien « ${lab} » : → mais destination externe`); if (lab.endsWith("↗") && interne(m[2])) fautes.push(`lien « ${lab} » : ↗ mais destination interne`); }
  for (const m of sansCode.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) { const lab = m[2].replace(/<[^>]+>/g, "").trim(); if (lab.endsWith("→") && !interne(m[1])) fautes.push(`lien « ${lab} » : → mais destination externe`); if (lab.endsWith("↗") && interne(m[1])) fautes.push(`lien « ${lab} » : ↗ mais destination interne`); }
  // 6. annonces de figure
  const texte = sansCode.toLowerCase();
  for (const a of ANNONCES) if (texte.includes(a)) fautes.push(`annonce de figure : « ${a} » (une figure remplace son explication)`);
  // 7. quiz
  if (numero >= 1) { const q = quiz[numero] || 0; if (q !== 4) fautes.push(`quiz : ${q} question(s) pour la séance ${numero} dans src/data/quiz.ts, il en faut 4`); }

  total += fautes.length;
  console.log(`${f}${fautes.length ? "\n   !! " + fautes.join("\n   !! ") : "  ✓"}`);
}
console.log(total ? `\nLINT — ${total} faute(s) dans ${fichiers.length} leçon(s)` : `\nLINT — ${fichiers.length} leçon(s), aucune faute`);
process.exit(total ? 1 : 0);
