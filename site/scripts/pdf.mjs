/**
 * `npm run pdf:verifier` : contrôle local de l'impression, rien n'est versionné. Les élèves enregistrent eux-mêmes leurs
 * PDF depuis la fenêtre d'impression du navigateur (boutons « Enregistrer … en PDF ») ; ce script imprime les mêmes pages,
 * avec le Chrome de la machine piloté par son protocole de débogage (WebSocket natif de Node, aucune dépendance), dans
 * site/.verif-pdf/ (ignoré par git) : une leçon par séance et le cours complet (séances 0 à 12).
 *
 * Comme le navigateur de l'élève : média « print », taille de page, marges et pied de page tirés du CSS (@page et ses
 * boîtes de marge), <details> ouverts. Contrôles : rien ne dépasse à droite (à la largeur de texte d'une page A4), chaque
 * jeu et chaque mini-quiz imprimés ont leur corrigé avec autant de réponses que de situations, aucune interface
 * interactive imprimée telle quelle ; puis le nombre de pages de chaque PDF. Sort en code 1 à la moindre faute.
 */
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

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
    js.forEach((j, i) => { const c = cs[i]; if (!c || c.titre !== j.titre || c.n !== j.n) sansCorrige.push(prefixe + j.titre + " (" + j.n + " situations, corrigé : " + (c ? c.titre + ", " + c.n + " réponses" : "aucun") + ")"); });
    if (cs.length > js.length) sansCorrige.push(prefixe + (cs.length - js.length) + " corrigé(s) sans jeu imprimé");
  }
  // un îlot interactif dont l'interface s'imprimerait : un enfant visible autre que sa version papier
  const ilotsVisibles = [...document.querySelectorAll("astro-island")].filter((i) => [...i.children].some((c) => !c.classList.contains("imprime-seul") && visible(c))).map((i) => (i.getAttribute("component-url") || "").split("/").pop());
  return JSON.stringify({ coupes, jeux, corriges, sansCorrige, ilotsVisibles });
})()`;

const pages = (fichier) => (fs.readFileSync(fichier, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

async function imprimer(url, fichier) {
  await envoyer("Emulation.setEmulatedMedia", { media: "print" }, s);
  await envoyer("Emulation.setDeviceMetricsOverride", { width: LARGEUR_UTILE, height: 1100, deviceScaleFactor: 1, mobile: false }, s);
  const charge = evenement("Page.loadEventFired", s);
  await envoyer("Page.navigate", { url }, s);
  await charge;
  await new Promise((r) => setTimeout(r, 1500));      // îlots et polices
  const { result } = await envoyer("Runtime.evaluate", { expression: PREPARER(LARGEUR_UTILE), returnByValue: true }, s);
  const controle = JSON.parse(result.value);
  await envoyer("Emulation.clearDeviceMetricsOverride", {}, s);
  // comme « Enregistrer au format PDF » : la page, les marges et le pied viennent du CSS, pas d'un gabarit Chrome
  const { data } = await envoyer("Page.printToPDF", { preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false, generateDocumentOutline: true }, s);
  fs.writeFileSync(fichier, Buffer.from(data, "base64"));
  return { ...controle, pages: pages(fichier), octets: fs.statSync(fichier).size };
}

fs.rmSync(SORTIE, { recursive: true, force: true });
fs.mkdirSync(SORTIE, { recursive: true });
const LECONS = path.join(SITE, "src/content/lecons");
const liste = fs.readdirSync(LECONS).filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(/\.mdx$/, ""), numero: Number((fs.readFileSync(path.join(LECONS, f), "utf8").match(/^numero:\s*(\d+)/m) ?? [])[1]) }))
  .filter((l) => l.numero >= 0 && l.numero <= 12).sort((a, b) => a.numero - b.numero)
  .map((l) => ({ fichier: `seance-${String(l.numero).padStart(2, "0")}.pdf`, url: `lecons/${l.slug}.html` }));
liste.push({ fichier: "cours-complet.pdf", url: "cours-complet.html?verifier" });   // le paramètre : pas de fenêtre d'impression automatique
let fautes = 0;
console.log("\n2. impression dans .verif-pdf/");
for (const { fichier, url } of liste) {
  const r = await imprimer(`http://127.0.0.1:${PORT}/${url}`, path.join(SORTIE, fichier));
  const problemes = [...r.coupes.map((c) => `texte coupé à droite : ${c}`), ...r.sansCorrige.map((c) => `corrigé manquant : ${c}`), ...r.ilotsVisibles.map((i) => `îlot interactif imprimé tel quel : ${i}`)];
  fautes += problemes.length;
  console.log(`${problemes.length ? "✗" : "·"} ${fichier.padEnd(18)} ${String(r.pages).padStart(3)} pages · ${(r.octets / 1024).toFixed(0).padStart(5)} Ko · ${r.jeux} jeu(x) imprimé(s), ${r.corriges} corrigé(s)`);
  problemes.slice(0, 12).forEach((p) => console.log("    !! " + p));
}
ws.close(); chrome.kill(); serveur.close();
fs.rmSync(profil, { recursive: true, force: true });
console.log(`\n${fautes ? "FAIL" : "PASS"} — ${liste.length} PDF dans site/.verif-pdf/ (non versionnés), ${fautes} faute(s)`);
process.exit(fautes ? 1 : 0);
