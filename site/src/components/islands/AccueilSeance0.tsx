import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/**
 * Les cinq écrans de la séance 0, portés depuis seances/seance-00-faire-connaissance/accueil.html.
 * Même contenu, même logique : tout ce qui est saisi vit dans l'état React, rien n'est stocké ailleurs.
 */

const QUIZ = [
  { id: "correcteur", titre: "Le correcteur orthographique du téléphone", ia: "oui",
    pourquoi: "Oui, aujourd'hui. Celui d'il y a quinze ans comparait tes mots à un dictionnaire. Celui de ton téléphone a appris sur des millions de textes ce que tu vas probablement taper : c'est du machine learning, et c'est le même mécanisme que ChatGPT, en tout petit." },
  { id: "youtube", titre: "Les recommandations YouTube", ia: "oui",
    pourquoi: "Oui. Personne n'a écrit la règle « après cette vidéo, propose celle-là ». Un modèle a appris, sur ce que regardent des centaines de millions de personnes, ce qui te fera rester. On en reparle : c'est aussi là que se cachent les biais." },
  { id: "chatgpt", titre: "ChatGPT", ia: "oui",
    pourquoi: "Oui, et c'est la version la plus récente : le deep learning. Il ne fait qu'une chose, prédire le mot suivant, mais il l'a appris sur une bonne partie d'Internet. On le construira en miniature à la séance 9." },
  { id: "gps", titre: "Le GPS qui calcule l'itinéraire le plus rapide", ia: "oui",
    pourquoi: "Oui, mais pas celle qu'on croit : rien n'est appris. Le plus court chemin est calculé par un algorithme écrit à la main dans les années 1950, avec des règles. C'est de l'IA « classique » : un programme qui imite un raisonnement humain, sans exemples." },
  { id: "snapchat", titre: "Un filtre Snapchat", ia: "oui",
    pourquoi: "Oui. Pour poser des oreilles de chat au bon endroit, il faut d'abord trouver le visage, les yeux, la bouche, trente fois par seconde. C'est un réseau de neurones entraîné sur des millions de visages." },
  { id: "calculatrice", titre: "La calculatrice", ia: "non",
    pourquoi: "Non. Elle applique des règles fixes et n'imite aucune capacité humaine : personne ne dit qu'une calculatrice « réfléchit ». C'est la frontière : de l'informatique, très utile, mais pas de l'IA. Un tableur non plus." },
] as const;

const LANGAGES = ["Scratch", "Python", "JavaScript", "Mods de jeu", "HTML", "Rien pour l'instant"];
const OUTILS = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Aucun"];
const ETAPES = ["Accueil", "C'est quoi l'IA ?", "IA ou pas ?", "Déjà fait", "Le parcours"];
const COLAB = "https://colab.research.google.com/github/EricBlanvillain/cours-data-science/blob/main/seances/seance-00-faire-connaissance/00_faire_connaissance.ipynb";

/* Qui je suis : quatre encarts, un libellé et une ligne. Le quatrième est là pour les parents ; s'il faut couper, c'est lui. */
const QUI: [string, string][] = [
  ["Conseil", "Banque, assurance, industrie"],
  ["Data et IA", "Modèles, agents, mise en production"],
  ["Terrain", "6 ans · 8 pays"],
  ["Formation", "CentraleSupélec · ESSEC"],
];

const BLOCS = [
  { n: "Bloc 1", s: "séances 1 à 3", quoi: "Les bases solides : ce qu'est l'IA, Python pour les données, SQL et Git.", gain: "Un premier projet d'analyse en ligne sur GitHub." },
  { n: "Bloc 2", s: "séances 4 à 6", quoi: "Le métier : collecter, nettoyer, analyser, raconter, puis entraîner un premier modèle.", gain: "Un tableau de bord présenté à l'oral et un modèle évalué." },
  { n: "Bloc 3", s: "séances 7 et 8", quoi: "La compétition Kaggle Titanic, en binôme, comme les data scientists du monde entier.", gain: "Un score au classement mondial." },
  { n: "Bloc 4", s: "séances 9 à 12", quoi: "Comprendre les LLM de l'intérieur, leur parler par le code, leur donner de la mémoire, en faire des agents.", gain: "Un assistant IA construit soi-même, et le portfolio complet." },
];

type Etat = {
  prenoms: [string, string];
  ia: [string, string];
  quiz: Record<string, "oui" | "non">;
  langages: [string[], string[]];
  outils: [string[], string[]];
  reve: [string, string];
};

const initial: Etat = { prenoms: ["", ""], ia: ["", ""], quiz: {}, langages: [[], []], outils: [[], []], reve: ["", ""] };

export default function AccueilSeance0() {
  const [ecran, setEcran] = useState(1);
  const [etat, setEtat] = useState<Etat>(initial);
  const [pourquoiOuverts, setPourquoiOuverts] = useState<Record<string, boolean>>({});
  const [copie, setCopie] = useState(false);
  const racine = useRef<HTMLDivElement>(null);

  const nom = (i: 0 | 1) => etat.prenoms[i].trim() || `Participant ${i + 1}`;
  const NB = ETAPES.length;

  function set<K extends keyof Etat>(cle: K, valeur: Etat[K]) { setEtat((e) => ({ ...e, [cle]: valeur })); }
  function setPaire<K extends "prenoms" | "ia" | "reve">(cle: K, i: 0 | 1, v: string) {
    const paire = [...etat[cle]] as [string, string]; paire[i] = v; set(cle, paire);
  }
  function basculer(cle: "langages" | "outils", i: 0 | 1, v: string) {
    const paire = [[...etat[cle][0]], [...etat[cle][1]]] as [string[], string[]];
    const pos = paire[i].indexOf(v);
    if (pos >= 0) paire[i].splice(pos, 1); else paire[i].push(v);
    set(cle, paire);
  }

  const recap = useMemo(() => {
    const date = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const l: string[] = [`Séance 0 · ${date}`, ""];
    ([0, 1] as const).forEach((i) => {
      l.push(`## ${nom(i)}`);
      l.push(`L'IA, c'est : ${etat.ia[i].trim() || "—"}`);
      l.push(`Langages : ${etat.langages[i].length ? etat.langages[i].join(", ") : "—"}`);
      l.push(`Outils d'IA : ${etat.outils[i].length ? etat.outils[i].join(", ") : "—"}`);
      l.push(`Outil rêvé : ${etat.reve[i].trim() || "—"}`);
      l.push("");
    });
    l.push("## Quiz « est-ce de l'IA ? » (réponses communes)");
    QUIZ.forEach((q) => {
      const r = etat.quiz[q.id];
      l.push(`- ${q.titre} : ${r ? r + (r === q.ia ? " ✓" : ` (réponse : ${q.ia})`) : "—"}`);
    });
    return l.join("\n");
  }, [etat]);

  function selectionner() {
    const el = document.getElementById("recap-seance0");
    if (!el) return;
    const plage = document.createRange(); plage.selectNodeContents(el);
    const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(plage);
  }
  async function copier() {
    selectionner();
    try { await navigator.clipboard.writeText(recap); } catch { try { document.execCommand("copy"); } catch {} }
    setCopie(true); setTimeout(() => setCopie(false), 2000);
  }
  // Changer d'écran ramène au début de l'écran (le haut des cinq écrans), pas au haut de la page : le hero est déjà lu.
  function aller(n: number) {
    setEcran(Math.max(1, Math.min(NB, n)));
    requestAnimationFrame(() => { const el = racine.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12 }); });
  }

  // Flèches ← → où que soit le focus (sauf dans un champ) : en séance on avance sans chercher le bouton.
  useEffect(() => {
    function surTouche(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement).tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowRight") { e.preventDefault(); aller(ecran + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); aller(ecran - 1); }
    }
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ecran]);

  // La barre épinglée en bas couvre la fin de la page : on rembourre le bas du <main> et du pied (voir .avec-barre-basse).
  useEffect(() => {
    document.body.classList.add("avec-barre-basse");
    return () => document.body.classList.remove("avec-barre-basse");
  }, []);

  return (
    <div ref={racine}>
      {/* les cinq étapes, en repère ; la jauge et les commandes sont dans la barre épinglée en bas */}
      <ol className="mono" style={{ display: "flex", justifyContent: "space-between", listStyle: "none", padding: "0 0 0.6rem", margin: "0 0 1.2rem", borderBottom: "1px solid var(--trait)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--encre-2)" }}>
        {ETAPES.map((t, i) => (
          <li key={t} style={i + 1 === ecran ? { color: "var(--encre)", fontWeight: 500 } : undefined}>{t}</li>
        ))}
      </ol>

      {/* ---------------- Écran 1 ---------------- */}
      {ecran === 1 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <p className="etiquette">Séance 0 · Faire connaissance</p>
          <h1 style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>Data Science &amp; IA<br />en 12 séances</h1>
          <p style={{ color: "var(--encre-2)" }}>Python, données, machine learning, puis l'IA générative. Tout dans le navigateur, rien à installer.</p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
            {[
              <>À la fin, vous aurez un <b>portfolio sur GitHub</b> : quatre projets faits de vos mains, visibles par n'importe qui avec un lien.</>,
              <>Un <b>modèle de prédiction</b> avec un vrai score dans un <b>classement mondial</b> (la compétition Kaggle Titanic).</>,
              <>Un <b>assistant IA</b> construit par vous, qui répond à des questions sur <b>vos propres cours</b>.</>,
            ].map((txt, i) => (
              <li key={i} className="carte" style={{ display: "flex", gap: "1rem", alignItems: "baseline", padding: "0.7rem 1.1rem" }}>
                <span className="chiffre" style={{ fontSize: "1.3rem", minWidth: "1.6rem" }}>{String(i + 1).padStart(2, "0")}</span>
                <span>{txt}</span>
              </li>
            ))}
          </ol>
          <p className="etiquette" style={{ marginTop: "0.4rem" }}>Qui je suis</p>
          <ul className="grille-cartes" style={{ "--bandes": 2, "--carte-min": "8.5rem", marginTop: "-0.3rem" } as CSSProperties}>
            {QUI.map(([libelle, ligne]) => (
              <li key={libelle} className="carte" style={{ padding: "0.75rem 0.9rem" }}>
                <p className="mono-caps" style={{ color: "var(--encre-2)" }}>{libelle}</p>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.35 }}>{ligne}</p>
              </li>
            ))}
          </ul>
          <p>Mon objectif : que vous compreniez les fondamentaux de l'IA, ce que ça change concrètement dans votre quotidien comme dans votre futur métier, et comment l'utiliser tous les jours.</p>
        </section>
      )}

      {/* ---------------- Écran 2 ---------------- */}
      {ecran === 2 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>C'est quoi l'IA, pour toi ?</h2>
          <p style={{ color: "var(--encre-2)" }}>Pas de bonne réponse. Écris ce qui te vient, en une phrase ou en trois mots. On en reparle à la fin.</p>
          <ul className="grille-cartes" style={{ "--bandes": 2, "--carte-min": "16rem" } as CSSProperties}>
            {([0, 1] as const).map((i) => (
              <li key={i} className="carte">
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  <label className="discret" htmlFor={`prenom${i}`}>Prénom</label>
                  <input id={`prenom${i}`} className="champ" autoComplete="off" placeholder="Prénom" value={etat.prenoms[i]} onChange={(e) => setPaire("prenoms", i, e.target.value)} />
                </div>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  <label className="discret" htmlFor={`ia${i}`}>L'IA, c'est…</label>
                  <textarea id={`ia${i}`} className="champ" rows={5} placeholder="Par exemple : un robot qui parle, un programme qui devine, ChatGPT…" value={etat.ia[i]} onChange={(e) => setPaire("ia", i, e.target.value)} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------------- Écran 3 ---------------- */}
      {ecran === 3 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>Est-ce de l'IA ?</h2>
          <p style={{ color: "var(--encre-2)" }}>Répondez ensemble, à l'instinct. Puis cliquez sur « Pourquoi ? » : la réponse n'est pas toujours celle qu'on croit.</p>
          {/* Quatre bandes alignées sur les six cartes : titre, statut, boutons, pied (« Pourquoi ? » et son explication).
              Le cuivre ne marque que le statut « sans réponse » ; la bordure reste le filet neutre, comme partout. */}
          <ul className="grille-cartes" style={{ "--bandes": 4, "--carte-min": "15rem" } as CSSProperties}>
            {QUIZ.map((q) => {
              const rep = etat.quiz[q.id];
              const ouvert = !!pourquoiOuverts[q.id];
              return (
                <li key={q.id} className="carte">
                  <h3 style={{ fontSize: "1.1rem" }}>{q.titre}</h3>
                  {rep ? (
                    <p className="mono-caps" style={{ color: "var(--encre-2)" }}>Répondu : {rep}</p>
                  ) : (
                    <p className="mono-caps ouvert"><span className="pastille-ouverte" />sans réponse</p>
                  )}
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {(["oui", "non"] as const).map((v) => (
                      <button key={v} type="button" className={"bouton" + (rep === v ? " actif" : "")} onClick={() => set("quiz", { ...etat.quiz, [q.id]: v })}>
                        {v === "oui" ? "Oui" : "Non"}
                      </button>
                    ))}
                  </div>
                  {/* pas .bande-pied : le lien reste sous les boutons, l'explication ouverte pousse vers le bas */}
                  <div>
                    <button type="button" className="lien-source" onClick={() => setPourquoiOuverts((o) => ({ ...o, [q.id]: !ouvert }))}>
                      {ouvert ? "Masquer" : "Pourquoi ?"}
                    </button>
                    {ouvert && (
                      <p style={{ marginTop: "0.6rem", fontSize: "0.9rem", lineHeight: 1.4, padding: "0.6rem 0.75rem", background: "var(--fond-3)", borderLeft: "2px solid var(--encre)" }}>
                        <b style={{ display: "block" }}>{q.ia === "oui" ? "C'est de l'IA" : "Ce n'est pas de l'IA"}</b>
                        <span>{q.pourquoi}</span>
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ---------------- Écran 4 ---------------- */}
      {ecran === 4 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>Ce que tu as déjà fait</h2>
          <p style={{ color: "var(--encre-2)" }}>Coche tout ce qui te concerne. « Rien pour l'instant » est une réponse parfaitement normale : c'est le point de départ de tout le monde.</p>
          <ul className="grille-cartes" style={{ "--bandes": 3, "--carte-min": "16rem" } as CSSProperties}>
            {([0, 1] as const).map((i) => (
              <li key={i} className="carte">
                <h3>{nom(i)}</h3>
                {([["langages", "Langages déjà touchés", LANGAGES], ["outils", "Outils d'IA déjà utilisés", OUTILS]] as const).map(([cle, label, valeurs]) => (
                  <fieldset key={cle} style={{ border: 0, padding: 0 }}>
                    <legend className="discret" style={{ marginBottom: "0.3rem" }}>{label}</legend>
                    <div style={{ display: "grid", gap: "0.35rem" }}>
                      {valeurs.map((v) => (
                        <label key={v} style={{ display: "flex", gap: "0.6rem", alignItems: "center", cursor: "pointer" }}>
                          <input type="checkbox" style={{ width: 20, height: 20, accentColor: "var(--encre)" }} checked={etat[cle][i].includes(v)} onChange={() => basculer(cle, i, v)} />
                          {v}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </li>
            ))}
          </ul>
          <div className="carte" style={{ borderColor: "var(--encre)", borderWidth: 2 }}>
            <h3>La question qui compte</h3>
            <p style={{ marginTop: "0.3rem" }}>Si tu pouvais construire un outil qui te simplifie la vie, ce serait quoi ?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "1rem", marginTop: "0.7rem" }}>
              {([0, 1] as const).map((i) => (
                <div key={i}>
                  <label className="discret" htmlFor={`reve${i}`}>{nom(i)}</label>
                  <textarea id={`reve${i}`} className="champ" rows={4} style={{ marginTop: "0.3rem" }} placeholder="Un truc qui trie mes photos, qui me rappelle mes entraînements, qui résume mes cours…" value={etat.reve[i]} onChange={(e) => setPaire("reve", i, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Écran 5 ---------------- */}
      {ecran === 5 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>Le parcours, en quatre blocs</h2>
          <p style={{ color: "var(--encre-2)" }}>Une séance de 1 h 30 à la fois. La leçon se fait toujours ensemble ; seul le carnet d'exercices se fait entre deux séances.</p>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {BLOCS.map((b) => (
              <div key={b.n} className="carte" style={{ display: "grid", gridTemplateColumns: "minmax(6rem, 8rem) 1fr 1fr", gap: "1rem", alignItems: "center", padding: "0.8rem 1.1rem" }}>
                <div className="mono" style={{ fontWeight: 500 }}>{b.n}<span className="discret" style={{ display: "block", fontWeight: 400 }}>{b.s}</span></div>
                <div style={{ fontSize: "0.95rem" }}>{b.quoi}</div>
                <div style={{ fontSize: "0.92rem", fontWeight: 600 }}>{b.gain}</div>
              </div>
            ))}
          </div>
          <h3 style={{ marginTop: "0.5rem" }}>Ce que vous avez répondu aujourd'hui</h3>
          <p className="discret">Le bloc ci-dessous se sélectionne d'un clic ; il servira à choisir les jeux de données des prochaines séances.</p>
          <pre id="recap-seance0" className="carte" style={{ whiteSpace: "pre-wrap", fontSize: "0.78rem", lineHeight: 1.5, margin: 0, userSelect: "all" }}>{recap}</pre>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="bouton" onClick={selectionner}>Tout sélectionner</button>
            <button type="button" className="bouton" onClick={copier}>Copier</button>
            {copie && <span className="mono" style={{ fontSize: "0.8rem" }}>Copié.</span>}
          </div>
          <p style={{ textAlign: "right", borderTop: "1px solid var(--trait)", paddingTop: "0.8rem", marginTop: "0.5rem" }}>
            <a href={COLAB} target="_blank" rel="noopener" className="discret" style={{ textDecoration: "none" }}>Ouvrir le notebook de la séance 0 dans Colab →</a>
          </p>
        </section>
      )}

      {/* navigation épinglée au bas de la fenêtre : jauge, position et commandes au même endroit, sans défiler */}
      <nav aria-label="Écrans" className="barre-ecrans">
        <div className="barre-ecrans-jauge" aria-hidden="true"><div style={{ width: `${(ecran / NB) * 100}%` }} /></div>
        <div className="conteneur barre-ecrans-ligne">
          <button type="button" className="bouton" onClick={() => aller(ecran - 1)} disabled={ecran === 1}>← Précédent</button>
          <span className="mono-caps" style={{ color: "var(--encre-2)" }}><span style={{ color: "var(--encre)" }}>{ecran} / {NB}</span> · {ETAPES[ecran - 1]}</span>
          <button type="button" className="bouton principal" onClick={() => aller(ecran + 1)} disabled={ecran === NB}>Suivant →</button>
        </div>
      </nav>
    </div>
  );
}
