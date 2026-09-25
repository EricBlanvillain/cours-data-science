/**
 * Post-build : rend dist/ ouvrable depuis le disque (file://) ou depuis un serveur de
 * fichiers minimal (python3 -m http.server), sans dépendance.
 *
 * Ce qu'il fait, et vérifie :
 *  1. dans chaque .html, réécrit les URL internes commençant par "/" en chemins relatifs
 *     (href, src, et les attributs des îlots Astro : component-url, renderer-url…) ;
 *  2. ajoute ".html" aux liens de pages sans extension (build.format = "file"), "/" → "index.html" ;
 *  3. vérifie que chaque cible réécrite existe bien dans dist/ ;
 *  4. vérifie qu'aucun import absolu "/_astro/…" ne reste dans les scripts ;
 *  5. échoue (code 1) si quelque chose manque : pas de réussite silencieuse.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
if (!existsSync(DIST)) { console.error("relativize : dist/ introuvable, lance `astro build` d'abord."); process.exit(1); }

function fichiers(dir, ext) {
  const out = [];
  for (const nom of readdirSync(dir)) {
    const p = join(dir, nom);
    if (statSync(p).isDirectory()) out.push(...fichiers(p, ext));
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}

const ATTRS = "(href|src|component-url|renderer-url|before-hydration-url|content|action)";
const RE = new RegExp(`\\s${ATTRS}="/(?!/)([^"]*)"`, "g");
const manquants = [];
let totalReecrits = 0;

for (const html of fichiers(DIST, ".html")) {
  const profondeur = relative(DIST, dirname(html)).split(sep).filter(Boolean).length;
  const prefixe = profondeur ? "../".repeat(profondeur) : "./";
  let n = 0;
  const texte = readFileSync(html, "utf8").replace(RE, (tout, attr, cible) => {
    // sépare le chemin de l'ancre / de la requête
    const m = cible.match(/^([^?#]*)(.*)$/);
    let chemin = m[1];
    const suffixe = m[2];
    if (chemin === "") chemin = "index.html";
    else if (!/\.[a-z0-9]+$/i.test(chemin)) chemin = chemin.replace(/\/$/, "") + ".html";
    if (!existsSync(join(DIST, chemin))) manquants.push(`${relative(DIST, html)} → /${cible} (attendu : ${chemin})`);
    n++;
    return ` ${attr}="${prefixe}${chemin}${suffixe}"`;
  });
  writeFileSync(html, texte);
  totalReecrits += n;
  const restes = (texte.match(/\s(href|src)="\/(?!\/)/g) || []).length;
  console.log(`relativize : ${relative(DIST, html).padEnd(44)} ${String(n).padStart(3)} URL réécrites${restes ? `  !! ${restes} restent absolues` : ""}`);
  if (restes) manquants.push(`${relative(DIST, html)} : ${restes} URL absolues non réécrites`);
}

// Les feuilles de style référencent les polices en absolu (url(/_astro/x.woff2)) : on les rend relatives à la feuille.
for (const cssFile of fichiers(DIST, ".css")) {
  let n = 0;
  const texte = readFileSync(cssFile, "utf8").replace(/url\((["']?)\/(?!\/)([^"')]+)\1\)/g, (tout, q, cible) => {
    const rel = relative(dirname(cssFile), join(DIST, cible)).split(sep).join("/");
    if (!existsSync(join(DIST, cible.split(/[?#]/)[0]))) manquants.push(`${relative(DIST, cssFile)} → url(/${cible})`);
    n++;
    return `url(${q}${rel}${q})`;
  });
  writeFileSync(cssFile, texte);
  const externes = texte.match(/url\((["']?)https?:\/\/[^)]+\)/g) || [];
  if (externes.length) manquants.push(`${relative(DIST, cssFile)} : ${externes.length} url() externe(s) : ${externes.slice(0, 3).join(" ")}`);
  console.log(`relativize : ${relative(DIST, cssFile).padEnd(44)} ${String(n).padStart(3)} url() réécrites${externes.length ? "  !! externes" : ""}`);
}

// Aucune page ne doit charger de ressource externe (polices, CDN) : seuls les liens <a> sortants sont permis.
for (const html of fichiers(DIST, ".html")) {
  const t = readFileSync(html, "utf8");
  const ext = t.match(/<(link|script)[^>]+(href|src)="https?:\/\/[^"]+"/g) || [];
  if (ext.length) manquants.push(`${relative(DIST, html)} : ressource externe chargée : ${ext.slice(0, 2).join(" ")}`);
}

// Les scripts générés par Vite s'importent entre eux en relatif ; on le vérifie plutôt que de le supposer.
for (const js of fichiers(DIST, ".js")) {
  const src = readFileSync(js, "utf8");
  if (/["'`]\/_astro\//.test(src)) manquants.push(`${relative(DIST, js)} : import absolu /_astro/ dans un script`);
}

console.log(`relativize : ${totalReecrits} URL réécrites au total.`);
if (manquants.length) {
  console.error("\nrelativize : ÉCHEC, cibles introuvables ou URL absolues restantes :");
  for (const m of manquants) console.error("  - " + m);
  process.exit(1);
}
console.log("relativize : OK, toutes les cibles existent, aucun import absolu, aucune ressource externe.");
