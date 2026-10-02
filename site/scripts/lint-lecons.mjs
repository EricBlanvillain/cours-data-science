/**
 * Lint des leçons (src/content/lecons/*.mdx) et des pages de module (src/content/modules/*.mdx). Lancé par `npm run lint:lecons` et au début de `npm run build`, donc par
 * Vercel : une leçon qui casse une règle ne se déploie pas. Aucune dépendance.
 * Le plafond de 625 mots visibles se mesure sur la page construite, après astro build : scripts/compte-prose.mjs.
 *
 * Règles, une par ligne de sortie quand elle casse :
 *  1. frontmatter : pour une leçon de numero ≥ 1 et une séance optionnelle, livrable présent, objectifs 1 à 3, aRetenir 1
 *     à 5 ; pour un projet, livrable présent, objectifs 1 à 3, aRetenir 5 au plus ; chaque prérequis d'un module (numéro
 *     de séance ou code de module) existe ;
 *  2. imports : seulement le vocabulaire des blocs (README, « Blocs d'une leçon ») ;
 *  3. chaque <details> a un <summary> ;
 *  4. titres en ## ou ### seulement ;
 *  5. (les flèches des liens se vérifient sur les pages construites : scripts/fleches.mjs, après astro build) ;
 *  6. aucune phrase n'annonce une figure (« ci-dessous », « ci-dessus », « le schéma suivant », « la figure suivante »,
 *     « voici un schéma ») : une figure remplace son explication, elle n'est jamais introduite par elle ;
 *  7. pour une leçon de numero ≥ 1 et une séance optionnelle (type seance), une entrée de 4 questions existe dans
 *     src/data/quiz.ts (clé : le numéro, ou le code SO1, SO2) ; un projet (type projet) n'en a aucune ;
 *  8. chaque leçon et chaque page de module pose une rangée <BoutonsSeance /> et une seule (Colab et dossier GitHub).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = path.join(ROOT, "src/content/lecons");
const QUIZ = path.join(ROOT, "src/data/quiz.ts");
const MODULES = path.join(ROOT, "src/content/modules");

/* Le vocabulaire des blocs : ce qu'une leçon a le droit d'importer. */
const VOCABULAIRE = [
  /^\.\.\/\.\.\/components\/schemas\/[A-Za-z0-9]+\.astro$/,                      // schémas et courbes SVG
  /^\.\.\/\.\.\/components\/islands\/(Frise|ClassifOuRegression|AccueilSeance0|QuelGraphique|QuelleCommande|SupprimerRemplirGarder|QuelPiege|CeModeleACompris|QuiAPlusDeChances|FuiteOuPas|QuelleLimite|ConsigneTenue|OuARateLeRag|QuAtIlRate)$/,  // îlots interactifs
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
  const blocs = src.split(/\n  ([A-Za-z0-9]+): \[/);
  for (let i = 1; i < blocs.length; i += 2) compte[blocs[i]] = (blocs[i + 1].split(/\n  [A-Za-z0-9]+: \[|\n\};/)[0].match(/^\s*question:/gm) || []).length;
  return compte;
}

const quiz = quizParSeance();
const mdx = (dossier) => (fs.existsSync(dossier) ? fs.readdirSync(dossier).filter((f) => f.endsWith(".mdx")).sort() : []);
const lots = [...mdx(DOSSIER).map((f) => ({ dossier: DOSSIER, f })), ...mdx(MODULES).map((f) => ({ dossier: MODULES, f, module: true }))];
const numerosLecons = new Set(mdx(DOSSIER).map((f) => Number(lireFrontmatter(fs.readFileSync(path.join(DOSSIER, f), "utf8")).data.numero)));
const codesModules = new Set(mdx(MODULES).map((f) => lireFrontmatter(fs.readFileSync(path.join(MODULES, f), "utf8")).data.code));
const fichiers = lots.map((l) => l.f);
let total = 0;
for (const { dossier, f, module } of lots) {
  const src = fs.readFileSync(path.join(dossier, f), "utf8");
  const { data, corps } = lireFrontmatter(src);
  const fautes = [];
  const numero = Number(data.numero);
  const cle = module ? data.code : String(numero);
  const seance = module ? data.type === "seance" : numero >= 1;   // ce qui porte un quiz et un « à retenir » complet
  // 1. frontmatter
  if (seance || module) {
    if (!data.livrable) fautes.push("frontmatter : livrable manquant");
    const o = Array.isArray(data.objectifs) ? data.objectifs.length : 0; if (o < 1 || o > 3) fautes.push(`frontmatter : ${o} objectif(s), il en faut 1 à 3`);
    const r = Array.isArray(data.aRetenir) ? data.aRetenir.length : 0;
    if (seance && (r < 1 || r > 5)) fautes.push(`frontmatter : ${r} ligne(s) « à retenir », il en faut 1 à 5`);
    if (!seance && r > 5) fautes.push(`frontmatter : ${r} ligne(s) « à retenir », 5 au plus`);
  }
  if (module) {
    if (!["seance", "projet"].includes(data.type)) fautes.push(`frontmatter : type « ${data.type} », attendu seance ou projet`);
    for (const p of Array.isArray(data.prerequis) ? data.prerequis : []) {
      const ok = /^\d+$/.test(p) ? numerosLecons.has(Number(p)) : codesModules.has(p);
      if (!ok) fautes.push(`prérequis « ${p} » : ni une séance ni un module existant`);
    }
  }
  // 2. imports
  for (const m of corps.matchAll(/^import .* from "([^"]+)";?$/gm)) if (!VOCABULAIRE.some((re) => re.test(m[1]))) fautes.push(`import hors vocabulaire : ${m[1]}`);
  // 3. replis
  for (const m of corps.matchAll(/<details[\s\S]*?<\/details>/g)) if (!/<summary/.test(m[0])) fautes.push("un <details> sans <summary>");
  // 4. titres
  const sansCode = corps.replace(/```[\s\S]*?```/g, "");
  for (const m of sansCode.matchAll(/^(#{1,6})\s/gm)) if (m[1].length < 2 || m[1].length > 3) fautes.push(`titre en ${m[1]} : seuls ## et ### sont permis`);
  // 6. annonces de figure
  const texte = sansCode.toLowerCase();
  for (const a of ANNONCES) if (texte.includes(a)) fautes.push(`annonce de figure : « ${a} » (une figure remplace son explication)`);
  // 7. quiz : 4 questions pour une séance (leçon ou séance optionnelle), aucune pour un projet
  if (seance) { const q = quiz[cle] || 0; if (q !== 4) fautes.push(`quiz : ${q} question(s) pour ${cle} dans src/data/quiz.ts, il en faut 4`); }
  if (module && !seance && quiz[cle]) fautes.push(`quiz : un projet n'a pas de quiz, retirer l'entrée ${cle} de src/data/quiz.ts`);
  // 8. la rangée Colab / GitHub
  const rangees = (sansCode.match(/<BoutonsSeance\b/g) || []).length;
  if (rangees !== 1) fautes.push(`${rangees} rangée(s) <BoutonsSeance />, il en faut une (liens Colab et dossier GitHub)`);

  total += fautes.length;
  console.log(`${f}${fautes.length ? "\n   !! " + fautes.join("\n   !! ") : "  ✓"}`);
}
console.log(total ? `\nLINT — ${total} faute(s) dans ${fichiers.length} page(s)` : `\nLINT — ${fichiers.length} page(s) (leçons et modules), aucune faute`);
process.exit(total ? 1 : 0);
