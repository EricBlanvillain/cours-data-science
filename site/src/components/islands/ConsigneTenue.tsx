import { useEffect, useRef, useState } from "react";
import { VERDICTS_CONSIGNE, situationsConsigne, type Verdict } from "../../data/dialogue";
const ORDRE: Verdict[] = ["tenue", "oubliee"];

/**
 * « La consigne est-elle tenue ? » : on choisit une consigne donnée au vrai modèle, on lit sa réponse (réelle,
 * src/data/dialogue.ts), puis on dit si la consigne est tenue. Même geste et mêmes classes que QuelGraphique et ses frères. Cuivre sur « réponse
 * ouverte » tant qu'elle n'est pas tranchée. Clavier : 1 ou 2 pour le verdict.
 */
export default function ConsigneTenue() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Verdict | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const situation = s === null ? null : situationsConsigne[s];
  const juste = situation && choix ? choix === situation.reponseAttendue : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (situation && choix === null && /^[12]$/.test(e.key)) { e.preventDefault(); setChoix(ORDRE[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {situationsConsigne.map((x, i) => (
          <button key={x.consigne} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i} onClick={() => { setS(i); setChoix(null); }}>
            {x.consigne}
          </button>
        ))}
      </div>

      {situation === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune consigne choisie pour l'instant.</span> Clique sur une consigne, lis la réponse du modèle, puis tranche.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas ce verdict-là") : "réponse ouverte : consigne tenue ?"}
          </p>
          <p className="encart" style={{ fontSize: "0.95rem" }}><span className="mono-caps" style={{ display: "block", color: "var(--encre-2)" }}>le vrai modèle répond</span>{situation.reponse}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ORDRE.map((c, i) => {
              const estBonne = choix !== null && c === situation.reponseAttendue;
              const estFaux = choix === c && c !== situation.reponseAttendue;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{VERDICTS_CONSIGNE[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{VERDICTS_CONSIGNE[situation.reponseAttendue].nom} : {VERDICTS_CONSIGNE[situation.reponseAttendue].definition}.</b>
              {situation.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1 ou 2 au clavier</span>}
        </div>
      )}
    </div>
  );
}
