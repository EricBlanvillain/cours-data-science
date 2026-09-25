import { useMemo, useState } from "react";

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
  function aller(n: number) { setEcran(Math.max(1, Math.min(NB, n))); window.scrollTo(0, 0); }

  return (
    <div
      onKeyDown={(e) => {
        const tag = (e.target as HTMLElement).tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (e.key === "ArrowRight") aller(ecran + 1);
        if (e.key === "ArrowLeft") aller(ecran - 1);
      }}
    >
      {/* progression */}
      <div style={{ height: 4, background: "var(--fond-3)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(ecran / NB) * 100}%`, background: "var(--encre)", transition: "width .4s var(--ease)" }} />
      </div>
      <ol className="mono" style={{ display: "flex", justifyContent: "space-between", listStyle: "none", padding: 0, margin: "0.5rem 0 1.5rem", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--encre-2)" }}>
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
          <div className="encart">
            <p className="etiquette">Qui je suis</p>
            <p style={{ marginTop: "0.3rem" }}>Je suis consultant data et intelligence artificielle.</p>
            <p style={{ marginTop: "0.4rem" }}>Concrètement : les entreprises ont des données partout, dans des fichiers, des bases, des applications, et elles n'arrivent pas à s'en servir. Mon travail, c'est de rendre ces données utilisables et de construire les outils qui vont avec.</p>
            <p style={{ marginTop: "0.4rem" }}>Master en data science à CentraleSupélec, diplômé de l'ESSEC. Six ans à faire ça, dans la finance, l'assurance, et aujourd'hui l'industrie.</p>
            <p style={{ marginTop: "0.4rem" }}>Ce parcours, je l'ai écrit entièrement : les treize séances, les notebooks, les projets. Vous n'allez pas suivre un tutoriel. Vous allez construire vos propres outils, et vous les gardez.</p>
          </div>
        </section>
      )}

      {/* ---------------- Écran 2 ---------------- */}
      {ecran === 2 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>C'est quoi l'IA, pour toi ?</h2>
          <p style={{ color: "var(--encre-2)" }}>Pas de bonne réponse. Écris ce qui te vient, en une phrase ou en trois mots. On en reparle à la fin.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "1rem" }}>
            {([0, 1] as const).map((i) => (
              <div key={i} className="carte" style={{ display: "grid", gap: "0.4rem" }}>
                <label className="discret" htmlFor={`prenom${i}`}>Prénom</label>
                <input id={`prenom${i}`} className="champ" autoComplete="off" placeholder="Prénom" value={etat.prenoms[i]} onChange={(e) => setPaire("prenoms", i, e.target.value)} />
                <label className="discret" htmlFor={`ia${i}`} style={{ marginTop: "0.5rem" }}>L'IA, c'est…</label>
                <textarea id={`ia${i}`} className="champ" rows={5} placeholder="Par exemple : un robot qui parle, un programme qui devine, ChatGPT…" value={etat.ia[i]} onChange={(e) => setPaire("ia", i, e.target.value)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- Écran 3 ---------------- */}
      {ecran === 3 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>Est-ce de l'IA ?</h2>
          <p style={{ color: "var(--encre-2)" }}>Répondez ensemble, à l'instinct. Puis cliquez sur « Pourquoi ? » : la réponse n'est pas toujours celle qu'on croit.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "0.9rem", alignItems: "start" }}>
            {QUIZ.map((q) => {
              const rep = etat.quiz[q.id];
              const ouvert = !!pourquoiOuverts[q.id];
              return (
                <div key={q.id} className={"carte" + (rep ? "" : " ouvert-bord")} style={{ display: "grid", gap: "0.55rem" }}>
                  <h3 style={{ fontSize: "1.1rem" }}>{q.titre}</h3>
                  {!rep && <span className="etiquette ouvert"><span className="pastille-ouverte" />sans réponse</span>}
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {(["oui", "non"] as const).map((v) => (
                      <button key={v} type="button" className={"bouton" + (rep === v ? " actif" : "")} onClick={() => set("quiz", { ...etat.quiz, [q.id]: v })}>
                        {v === "oui" ? "Oui" : "Non"}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="lien-source" style={{ justifySelf: "start" }} onClick={() => setPourquoiOuverts((o) => ({ ...o, [q.id]: !ouvert }))}>
                    {ouvert ? "Masquer" : "Pourquoi ?"}
                  </button>
                  {ouvert && (
                    <p style={{ fontSize: "0.9rem", lineHeight: 1.4, padding: "0.6rem 0.75rem", borderRadius: 4, background: "var(--fond-3)", borderLeft: "2px solid var(--encre)" }}>
                      <b style={{ display: "block" }}>{q.ia === "oui" ? "C'est de l'IA" : "Ce n'est pas de l'IA"}</b>
                      <span>{q.pourquoi}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- Écran 4 ---------------- */}
      {ecran === 4 && (
        <section style={{ display: "grid", gap: "0.9rem" }}>
          <h2>Ce que tu as déjà fait</h2>
          <p style={{ color: "var(--encre-2)" }}>Coche tout ce qui te concerne. « Rien pour l'instant » est une réponse parfaitement normale : c'est le point de départ de tout le monde.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))", gap: "1rem" }}>
            {([0, 1] as const).map((i) => (
              <div key={i} className="carte" style={{ display: "grid", gap: "0.3rem" }}>
                <h3>{nom(i)}</h3>
                {([["langages", "Langages déjà touchés", LANGAGES], ["outils", "Outils d'IA déjà utilisés", OUTILS]] as const).map(([cle, label, valeurs]) => (
                  <fieldset key={cle} style={{ border: 0, padding: 0, margin: "0.4rem 0 0" }}>
                    <legend className="discret" style={{ marginBottom: "0.3rem" }}>{label}</legend>
                    <div style={{ display: "grid", gap: "0.35rem" }}>
                      {valeurs.map((v) => (
                        <label key={v} style={{ display: "flex", gap: "0.6rem", alignItems: "center", cursor: "pointer" }}>
                          <input type="checkbox" style={{ width: 20, height: 20, accentColor: "var(--accent)" }} checked={etat[cle][i].includes(v)} onChange={() => basculer(cle, i, v)} />
                          {v}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            ))}
          </div>
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

      {/* navigation */}
      <nav aria-label="Écrans" style={{ position: "sticky", bottom: 0, marginTop: "1.5rem", padding: "0.8rem 0 1rem", background: "linear-gradient(to top, var(--fond) 70%, transparent)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <button type="button" className="bouton" onClick={() => aller(ecran - 1)} disabled={ecran === 1}>← Précédent</button>
        <span className="discret">{ecran} / {NB}</span>
        <button type="button" className="bouton principal" onClick={() => aller(ecran + 1)} disabled={ecran === NB}>Suivant →</button>
      </nav>
    </div>
  );
}
