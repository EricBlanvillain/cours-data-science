/**
 * `npm run pdf` : un PDF par leçon (public/pdf/seance-00.pdf … seance-12.pdf) et le cours complet
 * (public/pdf/cours-complet.pdf : couverture, sommaire cliquable, séances 0 à 12), imprimés par le Chrome de la machine,
 * le même que celui des audits, piloté par son protocole de débogage (WebSocket natif de Node, aucune dépendance).
 *
 * Étapes : construire le site (garde de fraîcheur désactivée) ; servir dist/ ; pour chaque page, émuler le média
 * « print » et une largeur de page A4, ouvrir les <details>, rendre les liens absolus (vers le site en ligne : un lien
 * relatif n'a aucun sens dans un PDF téléchargé), vérifier que rien ne dépasse à droite et que chaque jeu a son corrigé,
 * puis imprimer (A4, marges, pied de page avec le titre et le numéro de page, liens cliquables). Enfin : compter les pages,
 * écrire public/pdf/manifest.json (empreintes des sources, voir scripts/sources-pdf.mjs), et reconstruire le site, garde
 * active, pour que les liens de téléchargement apparaissent. Sort en code 1 à la moindre faute.
 */
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { SITE, empreintes } from "./sources-pdf.mjs";

const DIST = path.join(SITE, "dist");
const SORTIE = path.join(SITE, "public/pdf");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const EN_LIGNE = "https://cours-data-science.vercel.app";
const PORT = 4401;
const MM = 1 / 25.4;                                   // pouces par millimètre
const MARGES = { marginTop: 16 * MM, marginBottom: 18 * MM, marginLeft: 15 * MM, marginRight: 15 * MM };
const LARGEUR_UTILE = Math.round((210 - 30) * 96 / 25.4);   // 680 px : la largeur de texte d'une page A4 à 15 mm de marge

console.log("1. construction du site (garde de fraîcheur désactivée)");
execFileSync("npm", ["run", "build"], { cwd: SITE, stdio: "inherit", env: { ...process.env, PDF_EN_COURS: "1" } });

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
const PREPARER = (enLigne, largeur) => `(() => {
  document.querySelectorAll("details").forEach((d) => { d.open = true; });
  document.querySelectorAll("a[href]").forEach((a) => {
    const h = a.getAttribute("href");
    if (/^(https?:|mailto:|#)/.test(h)) return;
    const absolu = new URL(h, location.href);
    a.setAttribute("href", ${JSON.stringify(enLigne)} + absolu.pathname + absolu.hash);
  });
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
    js.forEach((j, i) => { const c = cs[i]; if (!c || c.titre !== j.titre || c.n !== j.n) sansCorrige.push(prefixe + j.titre + " (" + j.n + " situations, corrigé : " + (c ? c.titre + ", " + c.n + " réponses" : "aucun") + ")"); });
    if (cs.length > js.length) sansCorrige.push(prefixe + (cs.length - js.length) + " corrigé(s) sans jeu imprimé");
  }
  // un îlot interactif dont l'interface s'imprimerait : un enfant visible autre que sa version papier
  const ilotsVisibles = [...document.querySelectorAll("astro-island")].filter((i) => [...i.children].some((c) => !c.classList.contains("imprime-seul") && visible(c))).map((i) => (i.getAttribute("component-url") || "").split("/").pop());
  return JSON.stringify({ coupes, jeux, corriges, sansCorrige, ilotsVisibles });
})()`;

const echapper = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const pied = (titre) => `<div style="font-family: Helvetica, Arial, sans-serif; font-size: 8px; color: #555; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between;"><span>${echapper(titre)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
const pages = (fichier) => (fs.readFileSync(fichier, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

async function imprimer(url, fichier, titre) {
  await envoyer("Emulation.setEmulatedMedia", { media: "print" }, s);
  await envoyer("Emulation.setDeviceMetricsOverride", { width: LARGEUR_UTILE, height: 1100, deviceScaleFactor: 1, mobile: false }, s);
  const charge = evenement("Page.loadEventFired", s);
  await envoyer("Page.navigate", { url }, s);
  await charge;
  await new Promise((r) => setTimeout(r, 1500));      // îlots et polices
  const { result } = await envoyer("Runtime.evaluate", { expression: PREPARER(EN_LIGNE, LARGEUR_UTILE), returnByValue: true }, s);
  const controle = JSON.parse(result.value);
  await envoyer("Emulation.clearDeviceMetricsOverride", {}, s);
  const { data } = await envoyer("Page.printToPDF", {
    paperWidth: 210 * MM, paperHeight: 297 * MM, ...MARGES, printBackground: false, preferCSSPageSize: false,
    displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: pied(titre), generateDocumentOutline: true,
  }, s);
  fs.writeFileSync(fichier, Buffer.from(data, "base64"));
  return { ...controle, pages: pages(fichier), octets: fs.statSync(fichier).size };
}

fs.mkdirSync(SORTIE, { recursive: true });
const liste = empreintes();
const manifeste = { note: "Écrit par scripts/pdf.mjs ; vérifié par scripts/garde-pdf.mjs au début de chaque build.", pdfs: {} };
let fautes = 0;
console.log("\n2. impression");
for (const [fichier, e] of Object.entries(liste)) {
  const cours = fichier === "cours-complet.pdf";
  const url = `http://127.0.0.1:${PORT}/${cours ? "cours-complet.html" : `lecons/${e.slug}.html`}`;
  const titre = cours ? "Data Science & IA · cours complet" : `Séance ${String(e.numero).padStart(2, "0")} · ${e.titre}`;
  const r = await imprimer(url, path.join(SORTIE, fichier), titre);
  const problemes = [...r.coupes.map((c) => `texte coupé à droite : ${c}`), ...r.sansCorrige.map((c) => `corrigé manquant : ${c}`), ...r.ilotsVisibles.map((i) => `îlot interactif imprimé tel quel : ${i}`)];
  fautes += problemes.length;
  manifeste.pdfs[fichier] = { pages: r.pages, empreinte: e.empreinte, sources: e.sources };
  console.log(`${problemes.length ? "✗" : "·"} ${fichier.padEnd(18)} ${String(r.pages).padStart(3)} pages · ${(r.octets / 1024).toFixed(0).padStart(5)} Ko · ${r.jeux} jeu(x) imprimé(s), ${r.corriges} corrigé(s)`);
  problemes.slice(0, 12).forEach((p) => console.log("    !! " + p));
}
fs.writeFileSync(path.join(SORTIE, "manifest.json"), JSON.stringify(manifeste, null, 2) + "\n");

ws.close(); chrome.kill(); serveur.close();
fs.rmSync(profil, { recursive: true, force: true });

console.log("\n3. reconstruction, garde active (les liens de téléchargement apparaissent)");
execFileSync("npm", ["run", "build"], { cwd: SITE, stdio: "inherit" });
console.log(`\n${fautes ? "FAIL" : "PASS"} — ${Object.keys(liste).length} PDF dans public/pdf/, ${fautes} faute(s)`);
process.exit(fautes ? 1 : 0);
