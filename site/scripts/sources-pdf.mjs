/**
 * Les sources de contenu de chaque PDF, et leur empreinte : ce que scripts/pdf.mjs écrit dans public/pdf/manifest.json
 * et ce que scripts/garde-pdf.mjs recalcule au début de chaque build pour dire si un PDF est périmé.
 *
 * Sources d'une leçon : son MDX ; les fichiers de src/data/ qu'importent les composants que le MDX importe (schémas,
 * jeux) ; src/data/quiz.ts (son mini-quiz) et src/data/impression.ts (la forme imprimée des jeux et du quiz).
 * Le cours complet : la réunion des sources des leçons 0 à 12. Le style (CSS, mise en page) n'en fait pas partie.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LECONS = path.join(SITE, "src/content/lecons");
const TOUJOURS = ["src/data/quiz.ts", "src/data/impression.ts"];

const resoudre = (depuis, spec) => {
  const base = path.resolve(path.dirname(depuis), spec);
  return [base, `${base}.ts`, `${base}.tsx`, `${base}.astro`].find((p) => fs.existsSync(p) && fs.statSync(p).isFile()) ?? null;
};
const imports = (fichier) => [...fs.readFileSync(fichier, "utf8").matchAll(/^import\s[^;]*?from\s+"(\.{1,2}\/[^"]+)"/gm)].map((m) => m[1]);
const relatif = (p) => path.relative(SITE, p).split(path.sep).join("/");

function sourcesLecon(mdx) {
  const sources = new Set([relatif(mdx), ...TOUJOURS]);
  for (const spec of imports(mdx)) {
    const composant = resoudre(mdx, spec);
    if (!composant) continue;
    for (const s of imports(composant)) {
      const cible = resoudre(composant, s);
      if (cible && relatif(cible).startsWith("src/data/")) sources.add(relatif(cible));
    }
  }
  return [...sources].sort();
}

const empreinte = (sources) => {
  const h = crypto.createHash("sha256");
  for (const s of sources) h.update(s + "\0" + fs.readFileSync(path.join(SITE, s)) + "\0");
  return h.digest("hex").slice(0, 16);
};

/** { "seance-00.pdf": { numero, titre, slug, sources, empreinte }, …, "cours-complet.pdf": { sources, empreinte } } */
export function empreintes() {
  const out = {};
  const tous = new Set();
  for (const nom of fs.readdirSync(LECONS).filter((f) => f.endsWith(".mdx")).sort()) {
    const mdx = path.join(LECONS, nom);
    const texte = fs.readFileSync(mdx, "utf8");
    const numero = Number((texte.match(/^numero:\s*(\d+)/m) ?? [])[1]);
    if (!(numero >= 0 && numero <= 12)) continue;
    const titre = (texte.match(/^titre:\s*"?(.+?)"?\s*$/m) ?? [])[1];
    const sources = sourcesLecon(mdx);
    sources.forEach((s) => tous.add(s));
    out[`seance-${String(numero).padStart(2, "0")}.pdf`] = { numero, titre, slug: nom.replace(/\.mdx$/, ""), sources, empreinte: empreinte(sources) };
  }
  const sources = [...tous].sort();
  out["cours-complet.pdf"] = { sources, empreinte: empreinte(sources) };
  return out;
}
