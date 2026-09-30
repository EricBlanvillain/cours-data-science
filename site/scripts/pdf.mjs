/**
 * `npm run pdf:verifier` : contrôle local de l'impression, rien n'est versionné. Les élèves enregistrent eux-mêmes leurs
 * PDF depuis la fenêtre d'impression du navigateur (boutons « Enregistrer … en PDF ») ; ce script imprime les mêmes pages,
 * avec le Chrome de la machine piloté par son protocole de débogage (WebSocket natif de Node, aucune dépendance), dans
 * site/.verif-pdf/ (ignoré par git), en passant par la page d'export (enregistrer-pdf.html) comme l'élève : le cours
 * complet (séances 0 à 12), une séance seule (la 05), la séance 0 seule, la séance optionnelle SO1 seule et le projet B2 seul.
 *
 * Comme le navigateur de l'élève : média « print », taille de page, marges et pied de page tirés du CSS (@page et ses
 * boîtes de marge), <details> ouverts. Contrôles : rien ne dépasse à droite (à la largeur de texte d'une page A4), chaque
 * jeu et chaque mini-quiz imprimés ont leur corrigé avec autant de réponses que de situations, aucune interface
 * interactive imprimée telle quelle ; puis le nombre de pages de chaque PDF. Sort en code 1 à la moindre faute.
 * Portée : npm run pdf:verifier -- --pages seance-03,enregistrer-pdf (scripts/portee.mjs) ; --impression ne change rien
 * ici, tous ses contrôles sont des contrôles d'impression.
 */
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { portee } from "./portee.mjs";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(SITE, "dist");
const SORTIE = path.join(SITE, ".verif-pdf");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 4401;
const LARGEUR_UTILE = Math.round((210 - 30) * 96 / 25.4);   // 680 px : la largeur de texte d'une page A4 à 15 mm de marge

console.log("1. construction du site");
execFileSync("npm", ["run", "build"], { cwd: SITE, stdio: "inherit" });

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".json": "application/json", ".pdf": "application/pdf" };
const serveur = http.createServer((req, res) => {
  const p = path.join(DIST, decodeURIComponent(req.url.split("?")[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => serveur.listen(PORT, "127.0.0.1", r));

// Chrome sans écran, protocole de débogage sur un port libre ; on lit l'adresse du WebSocket sur sa sortie d'erreur.
const profil = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars", "--remote-debugging-port=0", `--user-data-dir=${profil}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
const adresse = await new Promise((ok, ko) => {
  let tampon = "";
  chrome.stderr.on("data", (d) => { tampon += d; const m = tampon.match(/DevTools listening on (ws:\/\/\S+)/); if (m) ok(m[1]); });
  setTimeout(() => ko(new Error("Chrome n'a pas ouvert son port de débogage")), 30000);
});
const ws = new WebSocket(adresse);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let prochain = 0; const attentes = new Map(); const ecoutes = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && attentes.has(m.id)) { const { ok, ko } = attentes.get(m.id); attentes.delete(m.id); m.error ? ko(new Error(m.error.message)) : ok(m.result); }
  else if (m.method) ecoutes.forEach((f) => f(m));
});
const envoyer = (method, params = {}, sessionId) => new Promise((ok, ko) => { const id = ++prochain; attentes.set(id, { ok, ko }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const evenement = (method, sessionId) => new Promise((ok) => { const f = (m) => { if (m.method === method && m.sessionId === sessionId) { ecoutes.splice(ecoutes.indexOf(f), 1); ok(m.params); } }; ecoutes.push(f); });

const { targetId } = await envoyer("Target.createTarget", { url: "about:blank" });
const { sessionId: s } = await envoyer("Target.attachToTarget", { targetId, flatten: true });
await envoyer("Page.enable", {}, s);
await envoyer("Runtime.enable", {}, s);

/* Préparation et contrôles, exécutés dans la page, au média « print », à la largeur utile d'une page A4. */
const PREPARER = (largeur) => `(() => {
  document.querySelectorAll("details").forEach((d) => { d.open = true; });
  const visible = (el) => { for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === "none" || cs.visibility === "hidden") return false; } return true; };
  // du texte coupé à droite : un nœud de texte visible dont la boîte sort de la largeur utile
  const coupes = [];
  const it = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = it.nextNode(); t; t = it.nextNode()) {
    if (!t.textContent.trim() || !t.parentElement || !visible(t.parentElement)) continue;
    const r = document.createRange(); r.selectNodeContents(t);
    for (const b of r.getClientRects()) if (b.width > 0 && b.right > ${largeur} + 1) { coupes.push(t.textContent.trim().slice(0, 50) + " (" + Math.round(b.right) + " px)"); break; }
  }
  // chaque jeu imprimé a son corrigé, dans la même leçon, avec autant de réponses que de situations
  const lecons = [...document.querySelectorAll(".lecon-imprimee")];
  const blocs = lecons.length ? lecons : [document.body];
  let jeux = 0, corriges = 0; const sansCorrige = [];
  for (const b of blocs) {
    const js = [...b.querySelectorAll(".jeu-imprime")].filter(visible).map((j) => ({ titre: j.querySelector(".mono-caps").textContent.replace(/ · sur papier$/, ""), n: j.querySelectorAll(".jeu-imprime-items > li").length }));
    const cs = [...b.querySelectorAll(".corrige-jeu")].filter(visible).map((c) => ({ titre: c.dataset.jeu, n: c.querySelectorAll("ol > li").length }));
    jeux += js.length; corriges += cs.length;
    const prefixe = b.id ? b.id + " : " : "";
    const meme = (x, y) => x.replace(/[\u202F\u00A0]/g, " ") === y.replace(/[\u202F\u00A0]/g, " ");   // la typographie a pu poser une espace fine dans l'un
    js.forEach((j, i) => { const c = cs[i]; if (!c || !meme(c.titre, j.titre) || c.n !== j.n) sansCorrige.push(prefixe + j.titre + " (" + j.n + " situations, corrigé : " + (c ? c.titre + ", " + c.n + " réponses" : "aucun") + ")"); });
    if (cs.length > js.length) sansCorrige.push(prefixe + (cs.length - js.length) + " corrigé(s) sans jeu imprimé");
  }
  // un îlot interactif dont l'interface s'imprimerait : un enfant visible autre que sa version papier
  const ilotsVisibles = [...document.querySelectorAll("astro-island")].filter((i) => [...i.children].some((c) => !c.classList.contains("imprime-seul") && visible(c))).map((i) => (i.getAttribute("component-url") || "").split("/").pop());
  return JSON.stringify({ coupes, jeux, corriges, sansCorrige, ilotsVisibles });
})()`;

// Relire un PDF avec PDFKit (macOS, via swift) : son titre (le nom de fichier que Chrome propose) et le texte de la bande
// du haut de la page 2, où l'en-tête de Chrome s'imprimerait. Sans swift, ce contrôle est signalé comme non fait.
const LIRE = path.join(os.tmpdir(), "lire-pdf.swift");
fs.writeFileSync(LIRE, `import PDFKit
let d = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
let titre = (d.documentAttributes?[PDFDocumentAttribute.titleAttribute] as? String) ?? ""
var haut = ""
if d.pageCount > 1, let p = d.page(at: 1) { let b = p.bounds(for: .mediaBox); haut = p.selection(for: CGRect(x: 0, y: b.height - 45, width: b.width, height: 45))?.string ?? "" }
let o = try! JSONSerialization.data(withJSONObject: ["titre": titre, "haut": haut.trimmingCharacters(in: .whitespacesAndNewlines)])
print(String(data: o, encoding: .utf8)!)
`);
const lire = (fichier) => { try { return JSON.parse(execFileSync("swift", [LIRE, fichier], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })); } catch { return null; } };
const pages = (fichier) => (fs.readFileSync(fichier, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

async function imprimer(url, fichier) {
  await envoyer("Emulation.setEmulatedMedia", { media: "print" }, s);
  await envoyer("Emulation.setDeviceMetricsOverride", { width: LARGEUR_UTILE, height: 1100, deviceScaleFactor: 1, mobile: false }, s);
  const charge = evenement("Page.loadEventFired", s);
  await envoyer("Page.navigate", { url }, s);
  await charge;
  await new Promise((r) => setTimeout(r, 1500));      // îlots et polices
  const { result } = await envoyer("Runtime.evaluate", { expression: PREPARER(LARGEUR_UTILE), returnByValue: true }, s);
  // comme le bouton « Enregistrer la sélection en PDF » : le titre du document devient le nom de fichier proposé
  await envoyer("Runtime.evaluate", { expression: "if (window.titrePdf) document.title = window.titrePdf();" }, s);
  const controle = JSON.parse(result.value);
  await envoyer("Emulation.clearDeviceMetricsOverride", {}, s);
  // comme « Enregistrer au format PDF » : la page, les marges et le pied viennent du CSS, pas d'un gabarit Chrome
  // En-têtes et pieds de page de Chrome ACTIVÉS (gabarits par défaut : date et titre en haut), comme chez un élève qui a
  // laissé l'option cochée : les boîtes de marge de @page doivent les remplacer.
  const { data } = await envoyer("Page.printToPDF", { preferCSSPageSize: true, printBackground: false, displayHeaderFooter: true, generateDocumentOutline: true }, s);
  fs.writeFileSync(fichier, Buffer.from(data, "base64"));
  return { ...controle, pages: pages(fichier), octets: fs.statSync(fichier).size };
}

fs.rmSync(SORTIE, { recursive: true, force: true });
fs.mkdirSync(SORTIE, { recursive: true });
// Le vérificateur passe par la page d'export, comme l'élève : le cours complet, une séance seule (la 05), la séance 0
// seule, la séance optionnelle SO1 seule (son quiz a un corrigé) et le projet B2 seul. Avec --pages : seance-XX imprime
// cette séance seule, un code de module (SO1, B2…) ce module seul, enregistrer-pdf (ou cours-complet) le cours complet.
const P = portee();
const seule = (n) => ({ fichier: `seance-${String(n).padStart(2, "0")}-seule.pdf`, url: `enregistrer-pdf.html?seances=${n}` });
const moduleSeul = (code) => ({ fichier: `module-${code}-seul.pdf`, url: `enregistrer-pdf.html?modules=${code}` });
const complet = { fichier: "cours-complet.pdf", url: "enregistrer-pdf.html" };
const retenus = !P.pages.length ? [complet, seule(5), seule(0), moduleSeul("SO1"), moduleSeul("B2")] : P.pages.flatMap((t) => {
  const m = t.match(/^seance-(\d{2})$/);
  if (m) return [seule(Number(m[1]))];
  if (/^(SO[12]|B[1-4])$/i.test(t)) return [moduleSeul(t.toUpperCase())];
  if (t === "enregistrer-pdf" || t === "cours-complet") return [complet];
  return [];
});
if (!retenus.length) { console.error(`Portée vide (${P.libelle}) : --pages attend seance-XX (deux chiffres), un code de module (SO1, B2…) ou enregistrer-pdf`); process.exit(2); }
let fautes = 0;
console.log(`\n2. impression dans .verif-pdf/ par la page d'export (portée : ${P.libelle}, ${retenus.length} PDF)`);
for (const { fichier, url } of retenus) {
  const r = await imprimer(`http://127.0.0.1:${PORT}/${url}`, path.join(SORTIE, fichier));
  const problemes = [...r.coupes.map((c) => `texte coupé à droite : ${c}`), ...r.sansCorrige.map((c) => `corrigé manquant : ${c}`), ...r.ilotsVisibles.map((i) => `îlot interactif imprimé tel quel : ${i}`)];
  const lu = lire(path.join(SORTIE, fichier));
  if (lu && lu.haut) problemes.push(`en-tête imprimé en haut de page : « ${lu.haut.slice(0, 80)} »`);
  fautes += problemes.length;
  console.log(`${problemes.length ? "✗" : "·"} ${fichier.padEnd(18)} ${String(r.pages).padStart(3)} pages · ${(r.octets / 1024).toFixed(0).padStart(5)} Ko · ${r.jeux} jeu(x) imprimé(s), ${r.corriges} corrigé(s) · ${lu ? `haut de page vide : ${lu.haut ? "non" : "oui"} · nom proposé : « ${lu.titre}.pdf »` : "PDFKit indisponible : en-tête et nom non vérifiés"}`);
  problemes.slice(0, 12).forEach((p) => console.log("    !! " + p));
}
ws.close(); serveur.close();
await new Promise((r) => { chrome.once("exit", r); chrome.kill(); });   // Chrome écrit dans son profil jusqu'à sa sortie
fs.rmSync(profil, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
console.log(`\n${fautes ? "FAIL" : "PASS"} — portée : ${P.libelle} · ${retenus.length} PDF dans site/.verif-pdf/ (non versionnés), ${fautes} faute(s)`);
process.exit(fautes ? 1 : 0);
