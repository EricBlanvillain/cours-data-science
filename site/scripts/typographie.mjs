/**
 * Typographie française, en un seul endroit, après `astro build` : une espace fine insécable (U+202F) après « et avant »,
 * et avant ; : ! ?. Elle remplace l'espace ordinaire ou insécable que le texte porte déjà ; rien n'est ajouté là où il
 * n'y a pas d'espace (une heure 10:30, une URL, du code collé).
 *
 * Deux passes, qui doivent rester identiques pour que les îlots React retrouvent au navigateur le texte du HTML :
 *  1. les pages (dist/**.html) : les nœuds de texte seulement, hors <script>, <style>, <pre>, <code>, <textarea>,
 *     <kbd>, <samp> (le code se copie tel quel) ;
 *  2. les bundles des îlots (dist/_astro/*.js) : l'intérieur des chaînes littérales seulement ("…", '…', `…`), jamais
 *     le code, les commentaires ni les expressions régulières.
 * Aucune dépendance. Lancé par `npm run build`, entre astro build et le compte de prose.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const FINE = " ";
const ESPACE = "(?: | |&nbsp;|&#160;|&#xa0;)";
const APRES_GUILLEMET = new RegExp(`(«|&laquo;)${ESPACE}`, "g");
const AVANT_PONCTUATION = new RegExp(`(^|\\S)${ESPACE}([;:!?»]|&raquo;)`, "g");   // ^ : juste après une balise (<b>GitHub</b> : …)
const fine = (t) => t.replace(APRES_GUILLEMET, `$1${FINE}`).replace(AVANT_PONCTUATION, `$1${FINE}$2`);

/* 1. HTML : on parcourt les balises ; le texte entre deux balises est traité sauf à l'intérieur d'un élément « code ». */
const SANS = new Set(["script", "style", "pre", "code", "textarea", "kbd", "samp", "template"]);
function html(src) {
  let out = "", dernier = 0, pile = 0;
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w-]*)\b[^>]*>/g;
  let m;
  while ((m = re.exec(src))) {
    const texte = src.slice(dernier, m.index);
    out += pile ? texte : fine(texte);
    out += m[0];
    dernier = re.lastIndex;
    const nom = (m[1] || "").toLowerCase();
    if (SANS.has(nom) && !m[0].endsWith("/>")) pile += m[0].startsWith("</") ? -1 : 1;
    if (pile < 0) pile = 0;
  }
  return out + (pile ? src.slice(dernier) : fine(src.slice(dernier)));
}

/* 2. JavaScript minifié : un lecteur de jetons juste assez fin pour distinguer chaînes, gabarits, commentaires et
   expressions régulières. Une expression régulière commence par « / » là où une valeur est attendue. */
const AVANT_REGEX = new Set([..."(,=:[!&|?{};+-*%<>~^"]);
const MOTS_AVANT_REGEX = new Set(["return", "typeof", "case", "in", "of", "void", "delete", "throw", "new", "do", "else", "yield", "await"]);
function js(src) {
  let i = 0, out = "";
  const n = src.length;
  let dernierSignificatif = "", dernierMot = "";
  const chaine = (q) => {                      // lit une chaîne "…" ou '…' à partir de src[i] === q
    let j = i + 1;
    while (j < n && src[j] !== q) { if (src[j] === "\\") j++; j++; }
    out += q + fine(src.slice(i + 1, j)) + q; i = j + 1;
  };
  const gabarit = () => {                      // lit un gabarit `…${…}…` ; seules les parties fixes sont traitées
    out += "`"; i++;
    let debut = i;
    while (i < n && src[i] !== "`") {
      if (src[i] === "\\") { i += 2; continue; }
      if (src[i] === "$" && src[i + 1] === "{") {
        out += fine(src.slice(debut, i)) + "${"; i += 2;
        expression(1);
        debut = i; continue;
      }
      i++;
    }
    out += fine(src.slice(debut, i)) + "`"; i++;
  };
  const regex = () => {
    let j = i + 1, classe = false;
    while (j < n) { const c = src[j]; if (c === "\\") { j += 2; continue; } if (c === "[") classe = true; else if (c === "]") classe = false; else if (c === "/" && !classe) break; else if (c === "\n") break; j++; }
    j++; while (j < n && /[a-z]/i.test(src[j])) j++;
    out += src.slice(i, j); i = j;
  };
  function expression(profondeur) {            // copie du code jusqu'à la fermeture d'un ${…} (profondeur > 0) ou la fin
    while (i < n) {
      const c = src[i];
      if (c === '"' || c === "'") { chaine(c); dernierSignificatif = c; dernierMot = ""; continue; }
      if (c === "`") { gabarit(); dernierSignificatif = "`"; dernierMot = ""; continue; }
      if (c === "/" && src[i + 1] === "/") { const j = src.indexOf("\n", i); const k = j < 0 ? n : j; out += src.slice(i, k); i = k; continue; }
      if (c === "/" && src[i + 1] === "*") { const j = src.indexOf("*/", i + 2); const k = j < 0 ? n : j + 2; out += src.slice(i, k); i = k; continue; }
      if (c === "/" && (dernierSignificatif === "" || AVANT_REGEX.has(dernierSignificatif) || MOTS_AVANT_REGEX.has(dernierMot))) { regex(); dernierSignificatif = ")"; dernierMot = ""; continue; }
      if (profondeur > 0) {
        if (c === "{") profondeur++;
        else if (c === "}") { profondeur--; if (profondeur === 0) { out += "}"; i++; return; } }
      }
      if (/[A-Za-z_$0-9]/.test(c)) {
        let j = i; while (j < n && /[A-Za-z_$0-9]/.test(src[j])) j++;
        const mot = src.slice(i, j); out += mot; i = j; dernierMot = mot; dernierSignificatif = mot[mot.length - 1]; continue;
      }
      out += c; i++;
      if (!/\s/.test(c)) { dernierSignificatif = c; dernierMot = ""; }
    }
  }
  expression(0);
  return out;
}

const fichiers = (dir, ext) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? fichiers(path.join(dir, e.name), ext) : e.name.endsWith(ext) ? [path.join(dir, e.name)] : []);
let pages = 0, bundles = 0, remplacements = 0;
const compte = (avant, apres) => (apres.match(/ /g) || []).length - (avant.match(/ /g) || []).length;
for (const f of fichiers(DIST, ".html")) { const a = fs.readFileSync(f, "utf8"); const b = html(a); if (b !== a) { fs.writeFileSync(f, b); pages++; remplacements += compte(a, b); } }
const ASTRO = path.join(DIST, "_astro");
for (const f of fs.existsSync(ASTRO) ? fichiers(ASTRO, ".js") : []) { const a = fs.readFileSync(f, "utf8"); const b = js(a); if (b !== a) { fs.writeFileSync(f, b); bundles++; remplacements += compte(a, b); } }
console.log(`typographie : ${remplacements} espaces fines posées, dans ${pages} page(s) et ${bundles} bundle(s)`);
