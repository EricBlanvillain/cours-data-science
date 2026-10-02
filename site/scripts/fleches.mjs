/**
 * Les flèches des liens, vérifiées là où l'élève les voit : les pages construites (dist/**\/*.html : accueil, leçons, modules,
 * glossaire, page d'export). Lancé après compte-prose dans `npm run build`, donc par Vercel. Aucune dépendance.
 *
 * Convention du site : → mène dans le site, ↗ en sort. Un <a> dont le href sort du site (http ou https, hors du domaine du
 * cours) a un texte qui finit par ↗ ; un lien interne ne finit jamais par ↗. Couvre tout ce qui est rendu au build, MDX,
 * composants Astro (sources des figures, pied de page, BoutonsSeance) et le premier rendu des îlots ; ne voit pas ce qu'un
 * îlot n'affiche qu'après un clic.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const DOMAINE = "cours-data-science.vercel.app";

const decode = (t) => t
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[e]);
const pages = (dossier) => fs.readdirSync(dossier, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? pages(path.join(dossier, e.name)) : e.name.endsWith(".html") ? [path.join(dossier, e.name)] : []);
const sort = (href) => /^https?:\/\//.test(href) && new URL(href).hostname !== DOMAINE;

let fautes = 0;
const fichiers = pages(DIST).sort();
for (const f of fichiers) {
  const html = fs.readFileSync(f, "utf8").replace(/<script\b[\s\S]*?<\/script>/g, "");
  const lignes = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = decode((m[1].match(/\bhref="([^"]*)"/) || [])[1] ?? "");
    const texte = decode(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (sort(href) && !texte.endsWith("↗")) lignes.push(`« ${texte || "(sans texte)"} » sort du site (${href}) : il finit par ↗`);
    if (!sort(href) && texte.endsWith("↗")) lignes.push(`« ${texte} » reste dans le site (${href}) : pas de ↗`);
  }
  fautes += lignes.length;
  if (lignes.length) console.log(`${path.relative(DIST, f)}\n   !! ${lignes.join("\n   !! ")}`);
}
console.log(fautes ? `\nFLÈCHES — ${fautes} lien(s) à corriger dans ${fichiers.length} page(s)` : `\nFLÈCHES — ${fichiers.length} page(s), chaque lien qui sort du site finit par ↗`);
process.exit(fautes ? 1 : 0);
