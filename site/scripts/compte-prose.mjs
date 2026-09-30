/**
 * Plafond de prose des leçons, mesuré là où l'élève la lit : la page construite. Lancé après `astro build` dans
 * `npm run build`, donc par Vercel : une leçon au-dessus de 625 mots visibles ne se déploie pas. Aucune dépendance.
 *
 * Ce qu'on compte, dans <article class="prose"> de dist/lecons/*.html et dist/modules/*.html (pages de module) : tout le texte visible, titres, tableaux et blocs de
 * code compris ; d'un repli <details>, seul le <summary> (c'est tout ce qu'on voit fermé) ; rien des îlots (<astro-island>)
 * ni des figures SVG, qui ont leurs propres budgets. Le cadre autour (objectifs, quiz, à retenir) n'est pas dans l'article.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER = path.join(ROOT, "dist/lecons");
const MODULES = path.join(ROOT, "dist/modules");
const MAX_MOTS = 625;
const MUETS = new Set(["astro-island", "svg", "script", "style", "template", "noscript"]);
const VIDES = new Set(["br", "hr", "img", "input", "meta", "link", "wbr", "source", "col", "area", "base", "embed", "param", "track"]);

const decode = (t) => t
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[e]);
const mots = (t) => (decode(t).match(/[\wÀ-ÿ'’-]+/g) || []).length;

/** Le texte visible de l'article de prose : on parcourt les balises, une pile pour savoir où l'on est. */
function proseVisible(html) {
  const debut = html.search(/<article\b[^>]*\bclass="[^"]*\bprose\b[^"]*"/);
  if (debut < 0) return null;
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w-]*)\b[^>]*>/g; re.lastIndex = debut;
  const pile = []; let texte = ""; let m; let dernier = 0;
  const muet = () => pile.some((b) => MUETS.has(b)) || (pile.includes("details") && !pile.includes("summary"));
  while ((m = re.exec(html))) {
    if (pile.length && !muet()) texte += " " + html.slice(dernier, m.index);
    dernier = re.lastIndex;
    if (m[0].startsWith("<!--")) continue;
    const nom = m[1].toLowerCase();
    if (m[0].startsWith("</")) {
      const i = pile.lastIndexOf(nom); if (i >= 0) pile.length = i;
      if (nom === "article" && pile.length === 0) break;
    } else if (!VIDES.has(nom) && !m[0].endsWith("/>")) pile.push(nom);
  }
  return texte;
}

if (!fs.existsSync(DOSSIER)) { console.error("compte-prose : dist/lecons absent, lancer astro build d'abord"); process.exit(1); }
let fautes = 0;
const pages = [DOSSIER, MODULES].filter((d) => fs.existsSync(d)).flatMap((d) => fs.readdirSync(d).filter((x) => x.endsWith(".html")).sort().map((f) => ({ d, f })));
for (const { d, f } of pages) {
  const t = proseVisible(fs.readFileSync(path.join(d, f), "utf8"));
  if (t === null) { fautes++; console.log(`${f} : pas d'article de prose`); continue; }
  const n = mots(t); const trop = n > MAX_MOTS; if (trop) fautes++;
  console.log(`${f} · ${n} mots visibles sur ${MAX_MOTS}${trop ? "  !! au-dessus du plafond" : "  ✓"}`);
}
console.log(fautes ? `\nPROSE — ${fautes} page(s) au-dessus de ${MAX_MOTS} mots` : `\nPROSE — toutes les pages (leçons et modules) sous ${MAX_MOTS} mots visibles`);
process.exit(fautes ? 1 : 0);
