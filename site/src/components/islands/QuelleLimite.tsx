import { useEffect, useRef, useState } from "react";
import { LIMITES, ORDRE_LIMITES, situationsLimites, type Limite } from "../../data/llm";
import ImpressionJeu from "../ImpressionJeu";
import { jeuxImprimes } from "../../data/impression";

/**
 * « Quelle limite ? » : on choisit une question posée au vrai modèle, on lit sa réponse (réelle, src/data/llm.ts), puis on
 * dit quelle limite elle montre. Même geste et mêmes classes que QuelGraphique et ses frères. Cuivre sur « réponse
 * ouverte » tant qu'elle n'est pas tranchée. Clavier : 1 à 4 pour la limite.
 */
export default function QuelleLimite() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Limite | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const situation = s === null ? null : situationsLimites[s];
  const juste = situation && choix ? choix === situation.limite : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (situation && choix === null && /^[1-4]$/.test(e.key)) { e.preventDefault(); setChoix(ORDRE_LIMITES[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <>
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {situationsLimites.map((x, i) => (
          <button key={x.question} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i} onClick={() => { setS(i); setChoix(null); }}>
            {x.question}
          </button>
        ))}
      </div>

      {situation === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune question choisie pour l'instant.</span> Clique sur une question, lis la réponse du modèle, puis nomme sa limite.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas cette limite-là") : "réponse ouverte : quelle limite ?"}
          </p>
          <p className="encart" style={{ fontSize: "0.95rem" }}><span className="mono-caps" style={{ display: "block", color: "var(--encre-2)" }}>le vrai modèle répond</span>{situation.reponse}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ORDRE_LIMITES.map((c, i) => {
              const estBonne = choix !== null && c === situation.limite;
              const estFaux = choix === c && c !== situation.limite;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{LIMITES[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{LIMITES[situation.limite].nom} : {LIMITES[situation.limite].definition}.</b>
              {situation.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1, 2, 3 ou 4 au clavier</span>}
        </div>
      )}
    </div>
      <ImpressionJeu jeu={jeuxImprimes.QuelleLimite} />
    </>
  );
}
