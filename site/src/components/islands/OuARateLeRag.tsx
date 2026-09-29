import { useEffect, useRef, useState } from "react";
import { VERDICTS_RAG, casRag, type Verdict } from "../../data/rag";
import ImpressionJeu from "../ImpressionJeu";
import { jeuxImprimes } from "../../data/impression";

/**
 * « Où le RAG a-t-il raté ? » : pour une vraie question posée au RAG du notebook, on voit les trois paragraphes vraiment
 * trouvés et la vraie réponse du modèle (src/data/rag.ts), puis on dit ce qui a raté. Même geste et mêmes classes que
 * QuelGraphique et ses frères. Cuivre sur « diagnostic ouvert » tant qu'il n'est pas tranché. Clavier : 1 à 3.
 */
const ORDRE: Verdict[] = ["recherche", "reponse", "rien"];
const fr = (v: number) => v.toFixed(3).replace(".", ",");

export default function OuARateLeRag() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Verdict | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const cas = s === null ? null : casRag[s];
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
    <>
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {casRag.map((x, i) => (
          <button key={x.question} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i} onClick={() => { setS(i); setChoix(null); }}>
            {x.question}
          </button>
        ))}
      </div>

      {cas === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune question choisie pour l'instant.</span> Clique sur une question, lis les passages trouvés et la réponse, puis dis ce qui a raté.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas ce diagnostic-là") : "diagnostic ouvert : qu'est-ce qui a raté ?"}
          </p>
          <div>
            <p className="mono-caps" style={{ color: "var(--encre-2)" }}>les 3 paragraphes trouvés</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.3rem 0 0", display: "grid", gap: "0.2rem", fontSize: "0.9rem" }}>
              {cas.passages.map((p) => <li key={p.n}><span className="mono">¶{p.n} · {fr(p.score)}</span> {p.debut}</li>)}
            </ul>
          </div>
          <p className="encart" style={{ fontSize: "0.95rem" }}><span className="mono-caps" style={{ display: "block", color: "var(--encre-2)" }}>le vrai modèle répond</span>{cas.reponse}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ORDRE.map((c, i) => {
              const estBonne = choix !== null && c === cas.verdict;
              const estFaux = choix === c && c !== cas.verdict;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{VERDICTS_RAG[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{VERDICTS_RAG[cas.verdict].nom} : {VERDICTS_RAG[cas.verdict].definition}.</b>
              {cas.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1, 2 ou 3 au clavier</span>}
        </div>
      )}
    </div>
      <ImpressionJeu jeu={jeuxImprimes.OuARateLeRag} />
    </>
  );
}
