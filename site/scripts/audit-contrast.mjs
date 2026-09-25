/**
 * Audit de contraste sur les pages construites, porté depuis un site précédent, même méthode.
 *
 * Pourquoi : le typage, le build et la relecture ne regardent aucun pixel. Ce script sert dist/, ouvre chaque page
 * dans le Chrome de la machine (headless, pas de dépendance), FAIT CLIQUER pour atteindre chaque état où le cuivre
 * apparaît ou disparaît, et mesure la couleur calculée de chaque nœud de texte contre son fond composité, en clair
 * puis en sombre. Il vérifie aussi la règle du cuivre : jamais #c24a16 en texte, copper-ink sur les fonds clairs
 * seulement, copper-light sur les fonds sombres seulement.
 *
 * Un état qui ne peut pas être atteint est une FAUTE (pas une ligne de log) ; les états volontairement non couverts
 * sont listés en clair dans la sortie (NON_COUVERTS), pour ne jamais laisser croire à une couverture complète.
 *
 * Lancer :  npm run build && npm run audit        (ou node scripts/audit-contrast.mjs)
 * Sort en code 1 à la moindre faute AA, de règle ou d'état non atteint ; en code 2 s'il ne peut pas mesurer.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { palette, copperRules } from "../src/styles/palette.mjs";

const execFileP = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 4399;

/* ------------------------------------------------------------------------------------------------
   Les états. Chaque pilote est du JavaScript exécuté dans la page, après hydratation, avant la mesure.
   `w(ms)` attend ; `btn(root, texte)` trouve un bouton par son libellé ; `saisir(el, v)` remplit un champ React.
   Quand un composant change, c'est ici qu'on ajoute l'état correspondant.
   ------------------------------------------------------------------------------------------------ */
const ETATS = [
  { page: "index.html", id: "accueil-rien-fait", pilote: "" },
  { page: "index.html", id: "accueil-seance-0-terminee", pilote: `
      window.progression.terminer(0); await w(150);
      if (document.querySelector('[data-seance="1"]').getAttribute("data-etat") !== "ouverte") throw new Error("la séance 1 devrait être ouverte");` },
  { page: "index.html", id: "accueil-tout-termine", pilote: `
      for (let i = 0; i <= 12; i++) window.progression.terminer(i); await w(150);
      if (document.querySelector("[data-compteur]").getAttribute("data-fini") !== "oui") throw new Error("le compteur devrait être à zéro");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "lecon-1-a-venir-bandeau", pilote: `
      if (document.querySelector("[data-seance-page]").getAttribute("data-etat") !== "a-venir") throw new Error("la séance 1 devrait être à venir");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "lecon-1-ouverte-par-url", pilote: `
      window.progression.ouvrir(1); await w(150);
      if (document.querySelector("[data-seance-page]").getAttribute("data-etat") !== "ouverte") throw new Error("?ouvrir=1 devrait ouvrir la séance");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "lecon-1-terminee", pilote: `
      window.progression.terminer(1); await w(150);
      if (document.querySelector("[data-seance-page]").getAttribute("data-etat") !== "terminee") throw new Error("la séance 1 devrait être terminée");` },
  { page: "index.html", id: "pied-reinitialisation-confirmer", pilote: `
      document.querySelector("[data-reinit-1]").click(); await w(150);` },

  { page: "lecons/seance-01-introduction-ia.html", id: "lecon-initiale", pilote: "" },
  { page: "lecons/seance-01-introduction-ia.html", id: "frise-periode-active-boom", pilote: `
      const f = ile("Frise"); btn(f, "Le boom").click(); await w(400);` },
  { page: "lecons/seance-01-introduction-ia.html", id: "frise-carte-desaccord-source-ouverte", pilote: `
      const f = ile("Frise"); const ol = f.querySelector("ol");
      const carte = [...ol.querySelectorAll("li")].find((li) => li.textContent.includes("sources en désaccord"));
      if (!carte) throw new Error("aucune carte en désaccord");
      ol.scrollLeft = carte.offsetLeft - 24; await w(300);
      [...carte.querySelectorAll("button")].find((b) => b.textContent.trim() === "source").click(); await w(300);` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-avant-reponse", pilote: `
      ile("ClassifOuRegression").scrollIntoView(); await w(200);` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-repondu", pilote: `
      const q = ile("ClassifOuRegression"); btn(q, "Combien de vues").click(); await w(300);` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-question-ouverte", pilote: `
      const q = ile("ClassifOuRegression"); saisir(q.querySelector("input"), "Le meilleur film de tous les temps");
      await w(150); q.querySelector("form").requestSubmit(); await w(300);
      if (!q.textContent.includes("je ne devine pas")) throw new Error("état ouvert non atteint");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-question-ouverte-tranchee", pilote: `
      const q = ile("ClassifOuRegression"); saisir(q.querySelector("input"), "Le meilleur film de tous les temps");
      await w(150); q.querySelector("form").requestSubmit(); await w(300); btn(q, "Une étiquette").click(); await w(300);` },

  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran1", pilote: "" },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran2-affirmation-sans-avis", pilote: `
      const r = ile("AccueilSeance0"); btn(r, "Suivant").click(); await w(300);
      if (!r.querySelector(".debat-affirmation.ouvert")) throw new Error("l'affirmation devrait être cuivre avant le clic");` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran2-curseur-gauche", pilote: `
      const r = ile("AccueilSeance0"); btn(r, "Suivant").click(); await w(300); curseur(r.querySelector('input[type="range"]'), 0); await w(300);
      if (r.querySelector(".debat-affirmation.ouvert")) throw new Error("plus de cuivre une fois le curseur bougé");
      if (!r.textContent.includes("Les deux camps ont des arguments")) throw new Error("les arguments devraient être dépliés");` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran2-curseur-milieu", pilote: `
      const r = ile("AccueilSeance0"); btn(r, "Suivant").click(); await w(300); const c = r.querySelector('input[type="range"]'); curseur(c, 60); await w(120); curseur(c, 50); await w(300);   // un vrai geste passe par d'autres valeurs avant de revenir au milieu
      if (!r.textContent.includes("Les deux camps ont des arguments")) throw new Error("bouger puis revenir au milieu compte comme un avis");` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran2-curseur-droite", pilote: `
      const r = ile("AccueilSeance0"); btn(r, "Suivant").click(); await w(300); curseur(r.querySelector('input[type="range"]'), 100); await w(300);` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran3-champs-remplis", pilote: `
      const r = ile("AccueilSeance0"); for (let i = 0; i < 2; i++) { btn(r, "Suivant").click(); await w(250); }
      saisir(r.querySelector("#prenom0"), "Inès"); saisir(r.querySelector("#ia0"), "Un programme qui apprend"); await w(200);` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran4-sans-reponse", pilote: `
      const r = ile("AccueilSeance0"); for (let i = 0; i < 3; i++) { btn(r, "Suivant").click(); await w(250); }
      if (r.querySelectorAll(".grille-cartes .bouton.actif").length !== 0) throw new Error("aucun Oui/Non ne devrait être pressé");` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran4-repondu-pourquoi-ouvert", pilote: `
      const r = ile("AccueilSeance0"); for (let i = 0; i < 3; i++) { btn(r, "Suivant").click(); await w(250); }
      for (const b of [...r.querySelectorAll("button")].filter((x) => x.textContent.trim() === "Non")) { b.click(); await w(80); }
      btn(r, "Pourquoi").click(); await w(300);
      if (r.querySelectorAll(".grille-cartes .bouton.actif").length !== 6) throw new Error("les six réponses devraient être pressées");` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran5", pilote: `
      const r = ile("AccueilSeance0"); for (let i = 0; i < 4; i++) { btn(r, "Suivant").click(); await w(250); }
      r.querySelectorAll("input[type=checkbox]")[1].click(); await w(200);` },
  { page: "lecons/seance-00-faire-connaissance.html", id: "s0-ecran6-recap-ouvert", pilote: `
      const r = ile("AccueilSeance0"); for (let i = 0; i < 5; i++) { btn(r, "Suivant").click(); await w(250); }
      r.querySelector("#recap-details").open = true; await w(200);` },

  // La barre latérale : ses quatre états de pastille, repliée, et le menu du mobile (seul état mesuré à 420 px).
  { page: "lecons/seance-01-introduction-ia.html", id: "barre-quatre-pastilles", pilote: `
      window.progression.terminer(0); await w(150);
      const b = document.getElementById("laterale"); if (!b || b.offsetParent === null) throw new Error("barre absente ou repliée");
      for (const e of ["terminee", "ouverte", "a-venir"]) if (!b.querySelector('[data-etat="' + e + '"]')) throw new Error("pastille manquante : " + e);
      if (!b.querySelector(".sans-lecon")) throw new Error("aucune leçon en préparation dans la barre");
      if (!b.querySelector('[aria-current="page"][data-seance="1"]')) throw new Error("la séance de la page n'est pas mise en avant");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "barre-repliee", pilote: `
      document.querySelector("[data-bascule-barre]").click(); await w(200);
      if (document.getElementById("laterale").offsetParent !== null) throw new Error("la barre devrait être repliée");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "barre-menu-mobile-ouvert", largeur: 420, pilote: `
      if (document.getElementById("laterale").offsetParent !== null) throw new Error("sur mobile le menu est fermé par défaut");
      document.querySelector("[data-bascule-barre]").click(); await w(200);
      if (document.getElementById("laterale").offsetParent === null) throw new Error("le menu devrait être ouvert");` },
  // Le thème forcé : la page doit prendre le fond demandé quel que soit le réglage système (mesuré dans les deux passes).
  { page: "lecons/seance-01-introduction-ia.html", id: "theme-force-clair", fond: "clair", pilote: `
      window.theme.appliquer("clair"); await w(150);
      if (document.querySelector('[data-theme-choix="clair"]').getAttribute("aria-pressed") !== "true") throw new Error("bouton Clair pas pressé");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "theme-force-sombre", fond: "sombre", pilote: `
      window.theme.appliquer("sombre"); await w(150);` },
  { page: "glossaire.html", id: "glossaire", pilote: "" },

  // Le mini-quiz de fin de leçon : sans réponse (cuivre), juste, faux, score, et tout au clavier.
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-fin-sans-reponse", pilote: `
      const z = ile("Quiz"); z.scrollIntoView(); await w(200);
      if (!z.textContent.includes("sans réponse")) throw new Error("le cuivre « sans réponse » manque");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-fin-juste", pilote: `
      const z = ile("Quiz"); z.querySelectorAll(".quiz-option")[1].click(); await w(100); btn(z, "Valider").click(); await w(300);
      if (!z.textContent.includes("✓ juste")) throw new Error("réponse juste non reconnue");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-fin-faux", pilote: `
      const z = ile("Quiz"); z.querySelectorAll(".quiz-option")[0].click(); await w(100); btn(z, "Valider").click(); await w(300);
      if (!z.querySelector(".quiz-option.fausse") || !z.querySelector(".quiz-option.bonne")) throw new Error("le faux et la bonne réponse doivent être marqués");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-fin-score", pilote: `
      const z = ile("Quiz");
      for (let k = 0; k < 4; k++) { z.querySelectorAll(".quiz-option")[0].click(); await w(80); btn(z, "Valider").click(); await w(150); [...z.querySelectorAll("button")].find((b) => /suivante|score/.test(b.textContent)).click(); await w(150); }
      if (!z.textContent.includes("Fin de la série")) throw new Error("score final non atteint");` },
  { page: "lecons/seance-01-introduction-ia.html", id: "quiz-fin-clavier", pilote: `
      const z = ile("Quiz"); const root = z.classList.contains("quiz") ? z : z.querySelector(".quiz"); root.focus();
      const touche = (key) => root.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
      touche("2"); await w(80); touche("Enter"); await w(200);
      if (!z.textContent.includes("✓ juste")) throw new Error("clavier : 2 puis Entrée devrait valider la bonne réponse");
      touche("Enter"); await w(200);
      if (!z.textContent.includes("Question 2 / 4")) throw new Error("clavier : Entrée devrait passer à la question suivante");` },
];

/* Ce que l'audit ne mesure pas, dit explicitement. */
const NON_COUVERTS = [
  "états de survol (:hover) et de focus (:focus-visible) : non simulés",
  "boutons désactivés (Précédent au premier écran, Suivant au dernier) : mesurés mais exclus du verdict, WCAG les exempte",
  "transitions et animations : désactivées pendant la mesure, chaque état est mesuré à son terme",
  "sélection de texte (::selection) et zoom navigateur : non simulés",
  "largeurs mobiles : une seule largeur mesurée, 1280 px, sauf l'état barre-menu-mobile-ouvert (420 px)",
];

const hexOk = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
for (const [k, v] of [["ink", palette.ink.DEFAULT], ["cream", palette.cream.DEFAULT], ["copper", palette.copper.DEFAULT], ["copper.ink", palette.copper.ink], ["copper.light", palette.copper.light]]) {
  if (!hexOk(v)) { console.error(`PALETTE — « ${k} » manque ou n'est pas un hexa dans src/styles/palette.mjs. Refus de tourner.`); process.exit(2); }
}
if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("Pas de dist/index.html : lance `npm run build` d'abord."); process.exit(2); }
if (!fs.existsSync(CHROME)) { console.error(`Chrome introuvable (${CHROME}). Donne son chemin dans la variable CHROME.`); process.exit(2); }

// La palette écrite dans global.css doit être celle de palette.mjs (sinon l'audit policerait des couleurs absentes de la page).
const css = fs.readFileSync(path.join(ROOT, "src/styles/global.css"), "utf8").toLowerCase();
const derive = [palette.ink.DEFAULT, palette.ink.raised, palette.ink.soft, palette.cream.DEFAULT, palette.cream.sunk, palette.copper.DEFAULT, palette.copper.ink, palette.copper.light].filter((v) => !css.includes(v.toLowerCase()));
if (derive.length) { console.error("PALETTE — valeurs absentes de global.css : " + derive.join(", ")); process.exit(2); }

/* Le script de mesure, injecté dans chaque page servie. Fond composité, seuils AA. */
const MESURE = (pilote) => `
<script>
(async function () {
  var w = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var ile = function (nom) { var el = document.querySelector('astro-island[component-url*="' + nom + '"]'); if (!el) throw new Error("îlot introuvable : " + nom); return el.firstElementChild || el; };
  var btn = function (root, texte) { var b = Array.prototype.find.call(root.querySelectorAll('button'), function (x) { return x.textContent.indexOf(texte) >= 0; }); if (!b) throw new Error("bouton introuvable : " + texte); return b; };
  var curseur = function (el, v) { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  var saisir = function (el, v) { var proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
  // Les transitions CSS ne s'écoulent pas dans le temps virtuel du headless : sans ceci, un bouton qui vient de perdre
  // l'état actif garde son ancien fond et l'audit mesure un état intermédiaire qui n'existe pas à l'écran.
  var st = document.createElement('style'); st.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }'; document.head.appendChild(st);
  try { localStorage.removeItem('cours-data-science-progression'); if (window.progression) window.progression.reinitialiser(); } catch (e) {}
  try { localStorage.removeItem('cours-data-science-theme'); localStorage.removeItem('cours-data-science-barre'); if (window.theme) window.theme.appliquer('systeme'); document.documentElement.setAttribute('data-barre', 'depliee'); document.documentElement.removeAttribute('data-menu'); if (window.barre) window.barre.rafraichir(); } catch (e) {}
  var erreurPilote = null;
  await w(1600);
  try { await (async function () { ${pilote} })(); } catch (e) { erreurPilote = String(e); }
  await w(200);

  // Les couleurs calculées arrivent en rgb(), ou en oklab() quand elles sortent d'un color-mix(in oklab) : on convertit.
  var oklabVersRgb = function (c) { var m = c.match(/oklab\\(\\s*([\\d.\\-e]+)%?\\s+([\\d.\\-e]+)\\s+([\\d.\\-e]+)(?:\\s*\\/\\s*([\\d.]+))?\\)/); if (!m) return null; var L = +m[1], a = +m[2], b = +m[3], al = m[4] === undefined ? 1 : +m[4]; if (c.indexOf('%') > 0 && c.indexOf('%') < c.indexOf(' ')) L /= 100;
      var l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.2914855480 * b; var l = l_ * l_ * l_, mm = m_ * m_ * m_, s = s_ * s_ * s_;
      var lin = [4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * s];
      var gam = function (v) { v = Math.min(1, Math.max(0, v)); return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }; return [gam(lin[0]), gam(lin[1]), gam(lin[2]), al]; };
  var parse = function (c) { var m = c.match(/rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?\\)/); if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]; if (c.indexOf('oklab(') === 0) return oklabVersRgb(c); return null; };
  var over = function (fg, bg) { var a = fg[3]; return [fg[0]*a + bg[0]*(1-a), fg[1]*a + bg[1]*(1-a), fg[2]*a + bg[2]*(1-a), 1]; };
  var lum = function (c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126*f(c[0]) + 0.7152*f(c[1]) + 0.0722*f(c[2]); };
  var ratio = function (a, b) { var l = [lum(a), lum(b)].sort(function (p, q) { return q - p; }); return (l[0] + 0.05) / (l[1] + 0.05); };
  var hex = function (c) { return '#' + [c[0], c[1], c[2]].map(function (v) { return Math.round(v).toString(16).padStart(2, '0'); }).join(''); };
  var effBg = function (el) {
    var layers = [], n = el;
    while (n && n.nodeType === 1) { var c = parse(getComputedStyle(n).backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] === 1) break; } n = n.parentElement; }
    var bg = parse(getComputedStyle(document.documentElement).backgroundColor) || [255, 255, 255, 1];
    for (var i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    return bg;
  };
  var out = { ground: hex(effBg(document.body)), text: [], borders: {}, erreurPilote: erreurPilote };
  var SVG = 'http://www.w3.org/2000/svg';
  // Les textes des SVG (schémas, courbes) : la couleur est le fill, pas color ; le fond est la forme dessinée derrière
  // (rect, circle, path…), trouvée par elementsFromPoint après avoir fait défiler le SVG dans la fenêtre.
  var svgs = document.querySelectorAll('svg');
  for (var si = 0; si < svgs.length; si++) {
    var svg = svgs[si]; if (svg.getBoundingClientRect().width === 0) continue;
    svg.scrollIntoView({ block: 'center' }); await w(60);
    var vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal.width : svg.getBoundingClientRect().width;
    var echelle = svg.getBoundingClientRect().width / vb;
    var textes = svg.querySelectorAll('text');
    for (var ti = 0; ti < textes.length; ti++) {
      var tx = textes[ti], tcs = getComputedStyle(tx), tr = tx.getBoundingClientRect();
      if (!tx.textContent.trim() || tr.width === 0) continue;
      var fill = parse(tcs.fill); if (!fill || fill[3] === 0) continue;
      if (tr.left < 0 || tr.right > window.innerWidth) { tx.scrollIntoView({ block: 'center', inline: 'center' }); await w(30); tr = tx.getBoundingClientRect(); }
      var derriere = null, pile = document.elementsFromPoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
      for (var pi = 0; pi < pile.length; pi++) {
        var e2 = pile[pi]; if (e2 === tx || tx.contains(e2)) continue;
        if (e2.namespaceURI === SVG && /^(rect|circle|path|ellipse|polygon)$/i.test(e2.tagName)) { var f2 = parse(getComputedStyle(e2).fill); if (f2 && f2[3] > 0) { derriere = f2; break; } }
        if (e2.namespaceURI !== SVG) break;
      }
      var sbg = derriere ? over(derriere, effBg(svg)) : effBg(svg), sfg = over(fill, sbg);
      var ssize = parseFloat(tcs.fontSize) * echelle, sweight = +tcs.fontWeight || 400;
      var sneed = ssize >= 24 || (ssize >= 18.66 && sweight >= 700) ? 3.0 : 4.5, scr = ratio(sfg, sbg);
      out.text.push({ text: 'svg: ' + tx.textContent.trim().slice(0, 44), fg: hex(sfg), bg: hex(sbg), size: +ssize.toFixed(1), weight: sweight, ratio: +scr.toFixed(2), need: sneed, pass: scr >= sneed, disabled: false, cls: String(tx.className.baseVal || '').slice(0, 80) });
    }
  }
  // Les pouces de curseur (input[type=range]) : composants d'interface, 3:1 minimum contre le fond de leur case (WCAG 1.4.11).
  // Chrome n'expose pas le style calculé du pseudo-élément ::-webkit-slider-thumb : on résout --couleur (le color-mix du pouce)
  // sur une sonde posée dans le même conteneur, ce qui donne la couleur réellement peinte.
  document.querySelectorAll('input[type="range"]').forEach(function (el) {
    var conteneur = el.closest('.curseur-avis') || el.parentElement; var sonde = document.createElement('span');
    sonde.style.cssText = 'position:absolute;width:1px;height:1px;background:var(--couleur, transparent)'; conteneur.appendChild(sonde);
    var pouce = parse(getComputedStyle(sonde).backgroundColor); conteneur.removeChild(sonde);
    if (!pouce || pouce[3] === 0) { out.text.push({ text: 'curseur (pouce) valeur ' + el.value + ' : couleur introuvable', fg: '#000000', bg: '#000000', size: 26, weight: 400, ratio: 0, need: 3.0, pass: false, disabled: false, cls: 'range-thumb' }); return; }
    var pbg = effBg(el), pfg = over(pouce, pbg), pr = ratio(pfg, pbg);
    out.text.push({ text: 'curseur (pouce) valeur ' + el.value, fg: hex(pfg), bg: hex(pbg), size: 26, weight: 400, ratio: +pr.toFixed(2), need: 3.0, pass: pr >= 3.0, disabled: false, cls: 'range-thumb' });
  });
  window.scrollTo(0, 0); await w(60);
  var els = document.querySelectorAll('body *');
  for (var k = 0; k < els.length; k++) {
    var el = els[k]; if (el.namespaceURI === SVG) continue;
    var cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    if (r.width === 0 || r.height === 0) continue;
    var sides = ['Top', 'Right', 'Bottom', 'Left'];
    for (var s = 0; s < 4; s++) { if (parseFloat(cs['border' + sides[s] + 'Width']) > 0 && cs['border' + sides[s] + 'Style'] !== 'none') { var bc = parse(cs['border' + sides[s] + 'Color']); if (bc && bc[3] > 0) { var key = hex(over(bc, effBg(el))); out.borders[key] = (out.borders[key] || 0) + 1; } } }
    var own = Array.prototype.filter.call(el.childNodes, function (nd) { return nd.nodeType === 3 && nd.textContent.trim(); }).map(function (nd) { return nd.textContent.trim(); }).join(' ');
    if (!own) continue;
    var bg = effBg(el), fg = over(parse(cs.color), bg), size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
    var need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3.0 : 4.5, cr = ratio(fg, bg);
    var disabled = el.closest('button:disabled, [aria-disabled="true"]') !== null;
    out.text.push({ text: own.slice(0, 50), fg: hex(fg), bg: hex(bg), size: size, weight: weight, ratio: +cr.toFixed(2), need: need, pass: cr >= need, disabled: disabled, cls: String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').slice(0, 80) });
  }
  var pre = document.createElement('pre'); pre.id = '__audit'; pre.textContent = JSON.stringify(out); document.body.appendChild(pre);
})();
</script></body>`;

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const [chemin, query = ""] = req.url.split("?");
  const p = path.join(DIST, decodeURIComponent(chemin));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" });
  if (p.endsWith(".html")) {
    const id = new URLSearchParams(query).get("etat");
    const etat = ETATS.find((e) => e.id === id);
    res.end(fs.readFileSync(p, "utf8").replace("</body>", MESURE(etat ? etat.pilote : "")));
  } else fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

// Chrome est lancé en asynchrone : un appel bloquant empêcherait ce même processus de servir les pages à Chrome.
async function mesurer(etat, sombre) {
  const args = ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${etat.largeur || 1280},900`, "--virtual-time-budget=8000", "--dump-dom"];
  if (sombre) args.push("--force-dark-mode");
  let stdout = "";
  try { ({ stdout } = await execFileP(CHROME, [...args, `http://127.0.0.1:${PORT}/${etat.page}?etat=${etat.id}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 60000 })); } catch (e) { stdout = e.stdout || ""; }
  const m = stdout.match(/<pre id="__audit">(.*?)<\/pre>/s);
  if (!m) return null;
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'"));
}

const attendu = { clair: palette.cream.DEFAULT, sombre: palette.ink.raised };
const fautes = [], cuivreFautes = [], nonAtteints = [], lignes = [], bordures = {};
const coppers = [palette.copper.DEFAULT, palette.copper.ink, palette.copper.light].map((c) => c.toLowerCase());
const lights = [palette.cream.DEFAULT, palette.cream.sunk].map((c) => c.toLowerCase());
const darks = [palette.ink.DEFAULT, palette.ink.raised, palette.ink.soft].map((c) => c.toLowerCase());

for (const etat of ETATS) {
  for (const mode of ["clair", "sombre"]) {
    const ou = `${etat.id} [${mode}]`;
    const res = await mesurer(etat, mode === "sombre");
    if (!res) { nonAtteints.push(`${ou} : page non mesurée`); continue; }
    if (res.erreurPilote) { nonAtteints.push(`${ou} : ${res.erreurPilote}`); }
    const fondAttendu = attendu[etat.fond || mode];   // un thème forcé impose son fond quelle que soit la passe
    if (res.ground !== fondAttendu) fautes.push({ where: ou, text: "(fond de page)", bg: res.ground, note: `fond attendu ${fondAttendu}` });
    const vus = new Set(); let nbCuivre = 0;
    for (const t of res.text) {
      const k = t.text + t.fg + t.bg + t.size; if (vus.has(k)) continue; vus.add(k);
      if (!t.pass && !t.disabled) fautes.push({ where: ou, ...t });
      if (coppers.includes(t.fg)) {
        nbCuivre++;
        const bgLight = lights.includes(t.bg), bgDark = darks.includes(t.bg);
        const legal = (bgLight && t.fg === copperRules.onLight.toLowerCase()) || (bgDark && t.fg === copperRules.onDark.toLowerCase());
        if (!legal) cuivreFautes.push({ where: ou, text: t.text, fg: t.fg, bg: t.bg, ratio: t.ratio, regle: t.fg === copperRules.fillOnly.toLowerCase() ? "copper (#c24a16) est un remplissage, jamais du texte" : bgLight ? "sur fond clair, seul copper-ink est légal" : bgDark ? "sur fond sombre, seul copper-light est légal" : "fond hors palette (le cuivre n'a que deux fonds légaux)" });
      }
    }
    for (const [k, v] of Object.entries(res.borders)) bordures[k] = Math.max(bordures[k] || 0, v);
    const pouces = res.text.filter((t) => t.cls === 'range-thumb');
    lignes.push(`${ou.padEnd(52)} ${String(res.text.length).padStart(4)} textes  cuivre×${nbCuivre}${pouces.length ? "  pouce " + pouces.map((t) => t.fg + " " + t.ratio + ":1").join(", ") : ""}${res.erreurPilote ? "  !! pilote en échec" : ""}`);
  }
}
server.close();

console.log("\n=== ÉTATS MESURÉS (clair et sombre) ===\n" + lignes.join("\n"));
console.log("\n=== ÉTATS NON ATTEINTS ===\n" + (nonAtteints.length ? nonAtteints.join("\n") : "aucun"));
console.log("\n=== NON COUVERTS PAR CET AUDIT (à vérifier à la main) ===\n" + NON_COUVERTS.map((n) => "- " + n).join("\n"));
console.log("\n=== FAUTES DE CONTRASTE (WCAG AA) ===\n" + (fautes.length ? JSON.stringify(fautes, null, 2) : "aucune"));
console.log("\n=== RÈGLE DU CUIVRE ===\n" + (cuivreFautes.length ? JSON.stringify(cuivreFautes, null, 2) : "respectée dans tous les états : copper-ink sur clair, copper-light sur sombre, jamais #c24a16 en texte"));
console.log("\n=== COULEURS DE BORDURE PEINTES (composées) ===\n" + Object.entries(bordures).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}  x${v}`).join("\n"));
const preflight = Object.keys(bordures).includes("#e5e7eb");
if (preflight) console.error("\n!! bordure #e5e7eb détectée : une opacité de filet est tombée sur le gris par défaut de Tailwind.");
const bad = fautes.length + cuivreFautes.length + nonAtteints.length + (preflight ? 1 : 0);
console.log(`\n${bad === 0 ? "PASS" : "FAIL"} — ${ETATS.length * 2} états mesurés, ${fautes.length} faute(s) de contraste, ${cuivreFautes.length} faute(s) de cuivre, ${nonAtteints.length} état(s) non atteint(s)`);
process.exit(bad === 0 ? 0 : 1);
