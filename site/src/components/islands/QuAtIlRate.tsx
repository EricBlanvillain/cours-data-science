import { useEffect, useRef, useState } from "react";
import { VERDICTS_AGENT, casAgent, type Verdict } from "../../data/agent";

/**
 * « Qu'est-ce qui a raté ? » : pour une vraie question posée à l'agent du notebook, on voit ce qu'il a vraiment écrit et
 * sa réponse finale (src/data/agent.ts), puis on dit ce qui a raté. Même geste et mêmes classes que
 * QuelGraphique et ses frères. Cuivre sur « diagnostic ouvert » tant qu'il n'est pas tranché. Clavier : 1 à 3.
 */
const ORDRE: Verdict[] = ["format", "tete", "reussi"];


export default function QuAtIlRate() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Verdict | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const cas = s === null ? null : casAgent[s];
  const juste = cas && choix ? choix === cas.verdict : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (cas && choix === null && /^[1-3]$/.test(e.key)) { e.preventDefault(); setChoix(ORDRE[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {casAgent.map((x, i) => (
          <button key={x.question} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i} onClick={() => { setS(i); setChoix(null); }}>
            {x.question}
          </button>
        ))}
      </div>

      {cas === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune question choisie pour l'instant.</span> Clique sur une question, lis ce qu'a fait l'agent, puis dis ce qui a raté.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas ce diagnostic-là") : "diagnostic ouvert : qu'est-ce qui a raté ?"}
          </p>
          {cas.trace.length > 0 && (
            <div>
              <p className="mono-caps" style={{ color: "var(--encre-2)" }}>la boucle, étape par étape</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0.3rem 0 0", display: "grid", gap: "0.2rem", fontSize: "0.9rem" }}>
                {cas.trace.map((l) => <li key={l} className="mono" style={{ fontSize: "0.82rem" }}>{l}</li>)}
              </ul>
            </div>
          )}
          <p className="encart" style={{ fontSize: "0.95rem" }}><span className="mono-caps" style={{ display: "block", color: "var(--encre-2)" }}>{cas.trace.length ? "réponse finale" : "le vrai modèle écrit, et la boucle rend tel quel"}</span>{cas.reponse}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ORDRE.map((c, i) => {
              const estBonne = choix !== null && c === cas.verdict;
              const estFaux = choix === c && c !== cas.verdict;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{VERDICTS_AGENT[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{VERDICTS_AGENT[cas.verdict].nom} : {VERDICTS_AGENT[cas.verdict].definition}.</b>
              {cas.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1, 2 ou 3 au clavier</span>}
        </div>
      )}
    </div>
  );
}
