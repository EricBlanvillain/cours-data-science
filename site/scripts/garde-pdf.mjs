/**
 * Garde de fraîcheur des PDF, au début de `npm run build` (donc aussi sur Vercel) : recalcule l'empreinte des sources de
 * chaque PDF (scripts/sources-pdf.mjs) et la compare à public/pdf/manifest.json. Une leçon modifiée sans que son PDF
 * soit refait fait échouer le build : « PDF périmé : lancer npm run pdf ». scripts/pdf.mjs, qui construit le site avant
 * d'imprimer, désactive la garde avec PDF_EN_COURS=1.
 */
import fs from "node:fs";
import path from "node:path";
import { SITE, empreintes } from "./sources-pdf.mjs";

if (process.env.PDF_EN_COURS === "1") process.exit(0);
const MANIFESTE = path.join(SITE, "public/pdf/manifest.json");
if (!fs.existsSync(MANIFESTE)) { console.error("PDF périmé : lancer npm run pdf (public/pdf/manifest.json absent)"); process.exit(1); }
const manifeste = JSON.parse(fs.readFileSync(MANIFESTE, "utf8"));
const perimes = [];
for (const [fichier, e] of Object.entries(empreintes())) {
  const m = manifeste.pdfs?.[fichier];
  if (!m || m.empreinte !== e.empreinte || !fs.existsSync(path.join(SITE, "public/pdf", fichier))) perimes.push(fichier);
}
if (perimes.length) { console.error(`PDF périmé : lancer npm run pdf (${perimes.join(", ")})`); process.exit(1); }
console.log(`garde-pdf : ${Object.keys(manifeste.pdfs).length} PDF à jour`);
