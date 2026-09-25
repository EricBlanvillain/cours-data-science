import { useEffect, useRef, useState } from "react";
import { quiz } from "../../data/quiz";

/**
 * Le mini-quiz de fin de leçon : une question à la fois, validation explicite, l'explication reste lisible après
 * validation, score en fin de série, reprise possible.
 * Clavier, dès que le focus est dans le quiz : 1 à 4 choisissent une option, ↑ ↓ (ou ← →) déplacent le choix,
 * Entrée valide puis passe à la suivante.
 * Cuivre : sur la question en cours tant qu'elle n'est pas validée, plus après. Juste et faux se distinguent par la
 * forme et le libellé (✓ plein / ✗ barré), jamais par la couleur seule.
 */
export default function Quiz({ seance }: { seance: number }) {
  const questions = quiz[seance] ?? [];
  const [i, setI] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [valide, setValide] = useState(false);
  const [bonnes, setBonnes] = useState(0);
  const [fini, setFini] = useState(false);
  const racine = useRef<HTMLDivElement>(null);
  const q = questions[i];

  function valider() {
    if (choix === null || valide) return;
    setValide(true);
    if (choix === q.bonne) setBonnes((b) => b + 1);
  }
  function suivante() {
    if (i + 1 >= questions.length) { setFini(true); return; }
    setI(i + 1); setChoix(null); setValide(false);
  }
  function recommencer() { setI(0); setChoix(null); setValide(false); setBonnes(0); setFini(false); racine.current?.focus(); }

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (fini) { if (e.key === "Enter") { e.preventDefault(); recommencer(); } return; }
      const n = q.options.length;
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= n && !valide) { e.preventDefault(); setChoix(Number(e.key) - 1); return; }
      if ((e.key === "ArrowDown" || e.key === "ArrowRight") && !valide) { e.preventDefault(); setChoix((c) => (c === null ? 0 : (c + 1) % n)); return; }
      if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && !valide) { e.preventDefault(); setChoix((c) => (c === null ? n - 1 : (c - 1 + n) % n)); return; }
      if (e.key === "Enter") { e.preventDefault(); if (valide) suivante(); else valider(); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  if (!q) return null;
  const juste = valide && choix === q.bonne;

  return (
    <div ref={racine} tabIndex={-1} className="quiz carte" data-valide={valide ? "oui" : "non"} data-fini={fini ? "oui" : "non"} style={{ outline: "none", maxWidth: "46rem" }}>
      {fini ? (
        <div>
          <p className="mono-caps" style={{ color: "var(--encre-2)" }}>Fin de la série</p>
          <p className="chiffre" style={{ fontSize: "2.4rem", lineHeight: 1.1, marginTop: "0.4rem" }}>{bonnes} / {questions.length}</p>
          <p style={{ marginTop: "0.5rem" }}>{bonnes === questions.length ? "Tout est juste. Les explications valent quand même une relecture : elles disent pourquoi." : bonnes >= questions.length / 2 ? "L'essentiel est là. Reprends les questions ratées : l'explication dit ce qui manquait." : "Relis les schémas de la leçon, puis recommence : quatre questions, deux minutes."}</p>
          <button type="button" className="bouton principal" style={{ marginTop: "1rem" }} onClick={recommencer}>Recommencer</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <p className={"mono-caps" + (valide ? "" : " ouvert")} style={valide ? { color: "var(--encre-2)" } : undefined}>
            {!valide && <span className="pastille-ouverte" aria-hidden="true" />}
            Question {i + 1} / {questions.length} · {valide ? (juste ? "✓ juste" : "✗ faux") : "sans réponse"}
          </p>
          <h3 style={{ fontSize: "1.2rem" }}>{q.question}</h3>
          <ol role="radiogroup" aria-label="Réponses" style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.45rem" }}>
            {q.options.map((o, k) => {
              const estBonne = valide && k === q.bonne;
              const estChoixFaux = valide && choix === k && k !== q.bonne;
              return (
                <li key={k}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={choix === k}
                    disabled={valide}
                    className={"quiz-option" + (choix === k && !valide ? " choisi" : "") + (estBonne ? " bonne" : "") + (estChoixFaux ? " fausse" : "")}
                    onClick={() => setChoix(k)}
                  >
                    <span className="mono quiz-num" aria-hidden="true">{estBonne ? "✓" : estChoixFaux ? "✗" : k + 1}</span>
                    <span>{o}</span>
                    {estBonne && <span className="mono-caps quiz-verdict">bonne réponse</span>}
                    {estChoixFaux && <span className="mono-caps quiz-verdict">ton choix</span>}
                  </button>
                </li>
              );
            })}
          </ol>
          {valide && (
            <p className="encart" aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{juste ? "Juste." : "Faux."}</b>
              {q.explication}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            {!valide ? (
              <button type="button" className="bouton principal" disabled={choix === null} onClick={valider}>Valider</button>
            ) : (
              <button type="button" className="bouton principal" onClick={suivante}>{i + 1 < questions.length ? "Question suivante →" : "Voir le score →"}</button>
            )}
            <span className="discret">1 à {q.options.length}, flèches, Entrée</span>
          </div>
        </div>
      )}
    </div>
  );
}
