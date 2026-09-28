/**
 * Audit de mise en page sur les pages construites, dans le Chrome de la machine (headless, sans dépendance).
 *
 * Trois choses que le typage et le build ne voient pas :
 *  1. les grilles de cartes (.grille-cartes) : dans chaque rangée, la bande n démarre à la même hauteur d'une carte à
 *     l'autre, les cartes ont la même hauteur, le pied (.bande-pied) colle au bas, chaque carte a exactement --bandes enfants ;
 *  2. l'en-tête : le bord gauche du logo et le bord droit du dernier lien de navigation sont AU PIXEL PRÈS à la même place sur
 *     l'accueil, le glossaire, la séance 0 et la séance 1 ; le pied de page aussi. Le conteneur est le même partout (1360 px) ;
 *  3. la prose : aucun bloc de texte direct de .prose, ni hero-texte, ne dépasse son plafond (46 rem, 36 rem pour le hero) ;
 *  4. les écrans de la séance 0 : chacun, atteint aux flèches du clavier, se termine au-dessus de la barre épinglée dans une
 *     fenêtre de 1440 × 900 (zone visible), l'affirmation dépliée comprise (curseur à un bout, arguments visibles). 1280 × 720 est mesuré et rapporté, sans faire échouer.
 *
 * Lancer :  npm run build && npm run audit:mise-en-page       Sort en code 1 à la moindre faute, 2 s'il ne peut pas mesurer.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileP = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 4398;
const LARGEURS = [1280, 1470, 1920];
const LARGEUR_TELEPHONE = 390;   // simulée par html{width:390px} : le headless ne descend pas sous 500 px

/* Les pages, et pour les leçons les états atteints par clic qui changent une grille. */
const PAGES = [
  { page: "index.html", id: "accueil", pilote: "" },
  { page: "glossaire.html", id: "glossaire", pilote: "" },
  { page: "lecons/seance-00-faire-connaissance.html", id: "seance-0", pilote: "" },
  { page: "lecons/seance-00-faire-connaissance.html", id: "seance-0-ecran-4-quiz", pilote: `const r = ile("AccueilSeance0"); for (let i = 0; i < 3; i++) { btn(r, "Suivant").click(); await w(250); }` },
  { page: "lecons/seance-01-introduction-ia.html", id: "seance-1", pilote: "" },
  { page: "lecons/seance-01-introduction-ia.html", id: "seance-1-quiz-repondu", pilote: `const q = ile("ClassifOuRegression"); btn(q, "Combien de vues").click(); await w(300);` },
  { page: "lecons/seance-02-python-pour-la-data.html", id: "seance-2", pilote: "" },
  { page: "lecons/seance-02-python-pour-la-data.html", id: "seance-2-quel-graphique-juste", pilote: `const g = ile("QuelGraphique"); btn(g, "Quel type de Pokémon").click(); await w(300); btn(g, "Barres").click(); await w(300);` },
  { page: "lecons/seance-03-sql-et-git.html", id: "seance-3", pilote: "" },
  { page: "lecons/seance-03-sql-et-git.html", id: "seance-3-quelle-commande-juste", pilote: `const g = ile("QuelleCommande"); btn(g, "choisir quels fichiers").click(); await w(300); btn(g, "git add").click(); await w(300);` },
  { page: "lecons/seance-04-collecter-nettoyer.html", id: "seance-4", pilote: "" },
  { page: "lecons/seance-04-collecter-nettoyer.html", id: "seance-4-vides-juste", pilote: `const g = ile("SupprimerRemplirGarder"); btn(g, "Type 2").click(); await w(300); btn(g, "Garder").click(); await w(300);` },
  { page: "lecons/seance-05-analyser-raconter.html", id: "seance-5", pilote: "" },
  { page: "lecons/seance-05-analyser-raconter.html", id: "seance-5-piege-juste", pilote: `const g = ile("QuelPiege"); btn(g, "ordinateur portable").click(); await w(300); btn(g, "Causalité").click(); await w(300);` },
  { page: "lecons/seance-06-premier-modele.html", id: "seance-6", pilote: "" },
  { page: "lecons/seance-06-premier-modele.html", id: "seance-6-modele-juste", pilote: `const g = ile("CeModeleACompris"); btn(g, "un seul voisin").click(); await w(300); btn(g, "appris par cœur").click(); await w(300);` },
  { page: "lecons/seance-07-kaggle-titanic-1.html", id: "seance-7", pilote: "" },
  { page: "lecons/seance-07-kaggle-titanic-1.html", id: "seance-7-duel-juste", pilote: `const g = ile("QuiAPlusDeChances"); btn(g, "femme de 3e classe").click(); await w(300); btn(g, "1 · une femme").click(); await w(300);` },
  { page: "lecons/seance-08-kaggle-titanic-2.html", id: "seance-8", pilote: "" },
  { page: "lecons/seance-08-kaggle-titanic-2.html", id: "seance-8-fuite-juste", pilote: `const g = ile("FuiteOuPas"); btn(g, "colonne Canot").click(); await w(300); btn(g, "1 · Fuite").click(); await w(300);` },
];
const PAGES_EN_TETE = ["accueil", "glossaire", "seance-0", "seance-1", "seance-2", "seance-3", "seance-4", "seance-5", "seance-6", "seance-7", "seance-8"];

// 4. Les écrans de la séance 0 : on avance aux flèches, on mesure la hauteur de l'écran depuis le haut des écrans, et on la
//    compare à la zone visible moins la barre épinglée moins les 12 px de marge du retour en haut.
const ECRANS = (largeur) => ({ page: "lecons/seance-00-faire-connaissance.html", id: "ecrans-" + largeur, pilote: `
      const r = ile("AccueilSeance0"); const sec = () => r.querySelector("section"); const haut = () => r.getBoundingClientRect().top + window.scrollY;
      const barre = r.querySelector(".barre-ecrans").getBoundingClientRect().height; const dispo = window.innerHeight - barre - 12;
      const fleche = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      const noms = [...r.querySelectorAll("ol.mono li")].map((li) => li.textContent.trim()); const res = [];
      for (let n = 0; n < noms.length; n++) {
        if (n > 0) { fleche(); await w(250); }
        const h = Math.round(sec().getBoundingClientRect().bottom + window.scrollY - haut());
        let ouvert = null;
        if (noms[n] === "Une affirmation") { curseur(r.querySelector('input[type="range"]'), 100); await w(300); ouvert = Math.round(sec().getBoundingClientRect().bottom + window.scrollY - haut()); }
        if (noms[n] === "IA ou pas ?") { btn(r, "Pourquoi").click(); await w(250); ouvert = Math.round(sec().getBoundingClientRect().bottom + window.scrollY - haut()); }
        res.push({ nom: noms[n], hauteur: h, ouvert: ouvert });
      }
      window.__ecrans = { fenetre: window.innerHeight, barre: Math.round(barre), dispo: Math.round(dispo), ecrans: res };` });


if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("Pas de dist/index.html : lance `npm run build` d'abord."); process.exit(2); }
if (!fs.existsSync(CHROME)) { console.error(`Chrome introuvable (${CHROME}). Donne son chemin dans la variable CHROME.`); process.exit(2); }

const MESURE = (pilote) => `
<script>
(async function () {
  var w = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var ile = function (nom) { var el = document.querySelector('astro-island[component-url*="' + nom + '"]'); if (!el) throw new Error("îlot introuvable : " + nom); return el.firstElementChild || el; };
  var curseur = function (el, v) { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  var btn = function (root, texte) { var b = Array.prototype.find.call(root.querySelectorAll('button'), function (x) { return x.textContent.indexOf(texte) >= 0; }); if (!b) throw new Error("bouton introuvable : " + texte); return b; };
  var st = document.createElement('style'); st.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }'; document.head.appendChild(st);
  try { localStorage.removeItem('cours-data-science-progression'); localStorage.removeItem('cours-data-science-barre'); document.documentElement.setAttribute('data-barre', 'depliee'); } catch (e) {}
  var erreur = null;
  await w(1600);
  try { await (async function () { ${pilote} })(); } catch (e) { erreur = String(e); }
  await w(200);
  var out = { erreur: erreur, grilles: [], enTete: null, pied: null, proseDebords: [], debordsHorizontaux: [] };
  // 0. au téléphone (largeur simulée) : rien ne dépasse à droite, sauf à l'intérieur d'un conteneur qui défile exprès
  var largeurPage = document.documentElement.getBoundingClientRect().width;
  if (largeurPage < window.innerWidth - 1) {
    // un ancêtre qui défile (overflow-x) ou qui est épinglé à la fenêtre (position: fixed, la barre des écrans) met hors jeu
    var defile = function (el) { for (var n = el; n && n !== document.body; n = n.parentElement) { var cs2 = getComputedStyle(n); var ov = cs2.overflowX; if (ov === 'auto' || ov === 'scroll' || ov === 'hidden' || cs2.position === 'fixed') return true; } return false; };
    document.querySelectorAll('body *').forEach(function (el) {
      if (el.namespaceURI === 'http://www.w3.org/2000/svg' && el.tagName !== 'svg') return;
      var cs = getComputedStyle(el); if (cs.position === 'fixed' || cs.display === 'none') return;
      var r = el.getBoundingClientRect(); if (r.width === 0 || r.right <= largeurPage + 1) return;
      if (defile(el)) return;
      out.debordsHorizontaux.push({ quoi: el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''), droite: Math.round(r.right), page: Math.round(largeurPage) });
    });
    out.debordsHorizontaux = out.debordsHorizontaux.slice(0, 8);
    // la séance 0 au téléphone : aucun libellé des étapes ni de la barre du bas n'en chevauche un autre, les flèches font
    // 44 × 44 au moins, la position tient sur une ligne
    out.libelles = [];
    var visibles = function (els) { return Array.prototype.filter.call(els, function (e) { var r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }); };
    var chevauche = function (a, b) { var r = a.getBoundingClientRect(), s = b.getBoundingClientRect(); return r.left < s.right - 0.5 && s.left < r.right - 0.5 && r.top < s.bottom - 0.5 && s.top < r.bottom - 0.5; };
    var paires = function (els, ou) { for (var i = 0; i < els.length; i++) for (var j = i + 1; j < els.length; j++) if (chevauche(els[i], els[j])) out.libelles.push(ou + ' : « ' + els[i].textContent.trim() + ' » chevauche « ' + els[j].textContent.trim() + ' »'); };
    paires(visibles(document.querySelectorAll('.etapes-ecrans li')), 'étapes');
    var ligne = document.querySelector('.barre-ecrans-ligne');
    if (ligne) {
      paires(visibles(ligne.children), 'barre du bas');
      visibles(ligne.querySelectorAll('button')).forEach(function (b) { var r = b.getBoundingClientRect(); if (r.width < 44 - 0.5 || r.height < 44 - 0.5) out.libelles.push('barre du bas : bouton « ' + b.getAttribute('aria-label') + ' » de ' + Math.round(r.width) + ' × ' + Math.round(r.height) + ' px, 44 × 44 au moins'); });
      var pos = ligne.querySelector('.barre-ecrans-position'); if (pos) { var lh = parseFloat(getComputedStyle(pos).lineHeight) || parseFloat(getComputedStyle(pos).fontSize) * 1.5; if (pos.getBoundingClientRect().height > lh * 1.5) out.libelles.push('barre du bas : la position tient sur ' + Math.round(pos.getBoundingClientRect().height / lh) + ' lignes'); }
    }
  }

  // 1. les grilles
  document.querySelectorAll('.grille-cartes').forEach(function (g, gi) {
    var cartes = Array.prototype.filter.call(g.children, function (c) { return c.classList.contains('carte'); });
    var bandes = parseInt(getComputedStyle(g).getPropertyValue('--bandes')) || 0;
    var rangees = {};
    cartes.forEach(function (c) { var t = Math.round(c.getBoundingClientRect().top); (rangees[t] = rangees[t] || []).push(c); });
    var rapport = { grille: gi, cartes: cartes.length, bandes: bandes, rangees: 0, fautes: [] };
    Object.keys(rangees).forEach(function (t) {
      var r = rangees[t]; rapport.rangees++;
      var hauteurs = r.map(function (c) { return c.getBoundingClientRect().height; });
      var ecartH = Math.max.apply(null, hauteurs) - Math.min.apply(null, hauteurs);
      if (ecartH > 0.5) rapport.fautes.push('rangée à ' + t + 'px : hauteurs différentes (' + ecartH.toFixed(1) + 'px)');
      for (var b = 0; b < bandes; b++) {
        if (r.some(function (c) { var e = c.children[b]; return e && e.classList.contains('bande-pied'); })) continue;   // le pied se juge au bas
        var tops = r.map(function (c) { var e = c.children[b]; return e ? e.getBoundingClientRect().top : null; }).filter(function (x) { return x !== null; });
        if (tops.length < 2) continue;
        var e = Math.max.apply(null, tops) - Math.min.apply(null, tops);
        if (e > 0.5) rapport.fautes.push('rangée à ' + t + 'px, bande ' + (b + 1) + ' : écart ' + e.toFixed(1) + 'px');
      }
      r.forEach(function (c) {
        if (c.children.length !== bandes) rapport.fautes.push('carte « ' + c.textContent.trim().slice(0, 30) + ' » a ' + c.children.length + ' enfants pour ' + bandes + ' bandes');
        var p = c.querySelector(':scope > .bande-pied');
        if (p) { var cr = c.getBoundingClientRect(), pr = p.getBoundingClientRect(); var pad = parseFloat(getComputedStyle(c).paddingBottom) + parseFloat(getComputedStyle(c).borderBottomWidth); var d = cr.bottom - pad - pr.bottom; if (Math.abs(d) > 1) rapport.fautes.push('pied décollé du bas de ' + d.toFixed(1) + 'px'); }
      });
    });
    out.grilles.push(rapport);
  });

  // 2. l'en-tête et le pied
  var logo = document.querySelector('header a'); var liens = document.querySelectorAll('header nav a'); var dernier = liens[liens.length - 1]; var pied = document.querySelector('footer');
  if (logo && dernier) out.enTete = { logoGauche: +logo.getBoundingClientRect().left.toFixed(2), dernierLienDroite: +dernier.getBoundingClientRect().right.toFixed(2), largeurEnTete: +document.querySelector('header .conteneur').getBoundingClientRect().width.toFixed(2) };
  if (pied) out.pied = { gauche: +pied.getBoundingClientRect().left.toFixed(2), largeur: +pied.getBoundingClientRect().width.toFixed(2) };

  // 3. la prose sous son plafond
  var rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  document.querySelectorAll('.prose > *').forEach(function (el) {
    if (el.tagName === 'ASTRO-ISLAND' || el.classList.contains('large') || el.tagName === 'FIGURE' || el.tagName === 'DETAILS' || el.tagName === 'TABLE') return;
    var wdt = el.getBoundingClientRect().width; if (wdt > 46 * rem + 1) out.proseDebords.push({ quoi: el.tagName + ' « ' + el.textContent.trim().slice(0, 40) + ' »', largeur: Math.round(wdt), plafond: Math.round(46 * rem) });
  });
  document.querySelectorAll('.hero-texte').forEach(function (el) { var wdt = el.getBoundingClientRect().width; if (wdt > 36 * rem + 1) out.proseDebords.push({ quoi: 'hero-texte', largeur: Math.round(wdt), plafond: Math.round(36 * rem) }); });

  var pre = document.createElement('pre'); pre.id = '__mep'; pre.textContent = JSON.stringify(out); document.body.appendChild(pre);
  if (window.__ecrans) { var pe = document.createElement('pre'); pe.id = '__ecrans'; pe.textContent = JSON.stringify(window.__ecrans); document.body.appendChild(pe); }
})();
</script></body>`;

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const [chemin, query = ""] = req.url.split("?");
  const p = path.join(DIST, decodeURIComponent(chemin));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  if (p.endsWith(".html")) { const idq = new URLSearchParams(query).get("etat"); const etat = PAGES.find((e) => e.id === idq) || (idq && idq.startsWith("ecrans-") ? ECRANS(Number(idq.slice(7))) : null); const sim = new URLSearchParams(query).get("simule"); res.end(fs.readFileSync(p, "utf8").replace("</body>", (sim ? `<style>html{width:${Number(sim)}px}.barre-ecrans{right:auto;width:${Number(sim)}px}</style>` : "") + MESURE(etat ? etat.pilote : ""))); }
  else fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

// Un Chrome headless qui ne rend pas la page à temps (machine chargée) ne compte pas comme une faute : on retente deux fois.
async function mesurer(etat, largeur, simulee) {
  for (let essai = 0; essai < 3; essai++) { const res = await mesurerUneFois(etat, largeur, simulee); if (res) return res; }
  return null;
}

async function mesurerUneFois(etat, largeur, simulee) {
  let stdout = "";
  try { ({ stdout } = await execFileP(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${largeur},900`, "--virtual-time-budget=8000", "--dump-dom", `http://127.0.0.1:${PORT}/${etat.page}?etat=${etat.id}${simulee ? "&simule=" + simulee : ""}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 60000 })); } catch (e) { stdout = e.stdout || ""; }
  const m = stdout.match(/<pre id="__mep">(.*?)<\/pre>/s);
  return m ? JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'")) : null;
}

let fautes = 0; const lignes = [];
// Le téléphone d'abord : chaque page à 390 px simulés, aucun débordement horizontal hors des conteneurs qui défilent.
for (const etat of PAGES) {
  const res = await mesurer(etat, 500, LARGEUR_TELEPHONE);
  const ou = `${etat.id} @${LARGEUR_TELEPHONE} (simulé)`;
  if (!res) { lignes.push(`${ou} : NON MESURÉ`); fautes++; continue; }
  if (res.libelles && res.libelles.length) { fautes += res.libelles.length; lignes.push(`${ou} · libellés :\n   !! ${res.libelles.join("\n   !! ")}`); }
  if (res.debordsHorizontaux.length) { fautes += res.debordsHorizontaux.length; lignes.push(`${ou} · déborde à droite :\n   !! ${res.debordsHorizontaux.map((d) => d.quoi + " jusqu'à " + d.droite + "px pour " + d.page).join("\n   !! ")}`); }
  else lignes.push(`${ou.padEnd(40)} rien ne déborde à droite`);
}
for (const largeur of LARGEURS) {
  const enTetes = {};
  for (const etat of PAGES) {
    const res = await mesurer(etat, largeur);
    const ou = `${etat.id} @${largeur}`;
    if (!res) { lignes.push(`${ou} : NON MESURÉ`); fautes++; continue; }
    if (res.erreur) { lignes.push(`${ou} : pilote en échec, ${res.erreur}`); fautes++; }
    for (const g of res.grilles) { if (g.fautes.length) { fautes += g.fautes.length; lignes.push(`${ou} · grille ${g.grille} (${g.cartes} cartes, ${g.bandes} bandes) :\n   !! ${g.fautes.join("\n   !! ")}`); } }
    for (const d of res.proseDebords) { fautes++; lignes.push(`${ou} · prose au-delà du plafond : ${d.quoi} fait ${d.largeur}px pour ${d.plafond}px`); }
    if (PAGES_EN_TETE.includes(etat.id)) enTetes[etat.id] = { ...res.enTete, piedGauche: res.pied && res.pied.gauche, piedLargeur: res.pied && res.pied.largeur };
    lignes.push(`${ou.padEnd(34)} grilles ${res.grilles.length}, cartes ${res.grilles.reduce((n, g) => n + g.cartes, 0)}, en-tête logo ${res.enTete ? res.enTete.logoGauche : "?"} → dernier lien ${res.enTete ? res.enTete.dernierLienDroite : "?"}`);
  }
  // l'en-tête doit être identique au pixel sur les quatre pages
  const ids = Object.keys(enTetes); if (ids.length === PAGES_EN_TETE.length) {
    const ref = enTetes[ids[0]];
    for (const id of ids.slice(1)) for (const k of ["logoGauche", "dernierLienDroite", "largeurEnTete", "piedGauche", "piedLargeur"]) {
      if (Math.abs((enTetes[id][k] ?? NaN) - (ref[k] ?? NaN)) > 0.5 || Number.isNaN(enTetes[id][k])) { fautes++; lignes.push(`@${largeur} : ${k} diffère entre ${ids[0]} (${ref[k]}) et ${id} (${enTetes[id][k]})`); }
    }
  } else { fautes++; lignes.push(`@${largeur} : en-tête mesuré sur ${ids.length} page(s) au lieu de ${PAGES_EN_TETE.length}`); }
}
const FENETRES = [[1440, 900], [1280, 720]];
for (const [L, H] of FENETRES) {
  const etat = ECRANS(L);
  let stdout = "";
  try { ({ stdout } = await execFileP(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${L},${H + 121}`, "--virtual-time-budget=9000", "--dump-dom", `http://127.0.0.1:${PORT}/${etat.page}?etat=${etat.id}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 60000 })); } catch (e) { stdout = e.stdout || ""; }
  const m = stdout.match(/<pre id="__ecrans">(.*?)<\/pre>/s);
  if (!m) { fautes++; lignes.push(`écrans de la séance 0 @${L}×${H} : non mesurés`); continue; }
  const r = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
  const strict = L === 1440;
  lignes.push(`écrans de la séance 0 @${L}×${r.fenetre} (barre ${r.barre} px, ${r.dispo} px disponibles)${strict ? "" : " · information, ne fait pas échouer"} :`);
  for (const e of r.ecrans) {
    const pire = Math.max(e.hauteur, e.ouvert ?? 0);
    const ok = pire <= r.dispo;
    lignes.push(`   ${ok ? "  " : "!!"} ${e.nom.padEnd(18)} ${String(e.hauteur).padStart(4)} px${e.ouvert !== null ? ` (déplié ${e.ouvert} px)` : ""} → ${ok ? "tient" : "déborde de " + (pire - r.dispo) + " px"}`);
    if (!ok && strict) fautes++;
  }
}
server.close();
console.log(lignes.join("\n"));
console.log(`\n${fautes === 0 ? "PASS" : "FAIL"} — ${PAGES.length * (LARGEURS.length + 1)} mesures sur ${LARGEUR_TELEPHONE} (simulé), ${LARGEURS.join(", ")} px : rien ne déborde au téléphone, grilles alignées, en-tête et pied identiques au pixel sur ${PAGES_EN_TETE.length} pages, prose sous son plafond, écrans de la séance 0 dans 1440 × 900${fautes ? ` · ${fautes} faute(s)` : ""}`);
process.exit(fautes === 0 ? 0 : 1);
