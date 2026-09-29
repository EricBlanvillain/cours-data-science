import { useEffect, useRef, useState } from "react";
import { duels } from "../../data/titanic";
import ImpressionJeu from "../ImpressionJeu";
import { jeuxImprimes } from "../../data/impression";

/**
 * « Qui avait le plus de chances ? » : on choisit un duel entre deux groupes de passagers, puis celui qui a le mieux
 * survécu ; les deux taux réels de train.csv et l'explication s'affichent. Même geste et mêmes classes que QuelGraphique
 * et ses frères, avec deux choix propres à chaque duel. Cuivre sur « duel ouvert » tant qu'il n'est pas tranché.
 * Clavier : 1 ou 2 pour le groupe.
 */
export default function QuiAPlusDeChances() {
  const [d, setD] = useState<number | null>(null);
  const [choix, setChoix] = useState<"a" | "b" | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const duel = d === null ? null : duels[d];
  const gagnant = duel ? (duel.a.v > duel.b.v ? "a" : "b") : null;
  const juste = duel && choix ? choix === gagnant : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (duel && choix === null && /^[12]$/.test(e.key)) { e.preventDefault(); setChoix(e.key === "1" ? "a" : "b"); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <>
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {duels.map((x, i) => (
          <button key={i} type="button" className={"bouton" + (d === i ? " actif" : "")} aria-pressed={d === i} onClick={() => { setD(i); setChoix(null); }}>
            {x.a.l} ou {x.b.l} ?
          </button>
        ))}
      </div>

      {duel === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucun duel choisi pour l'instant.</span> Clique sur un duel, puis sur le groupe qui a le mieux survécu.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ c'est l'autre") : "duel ouvert : qui a le mieux survécu ?"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {(["a", "b"] as const).map((c, i) => {
              const g = duel[c];
              const estBonne = choix !== null && c === gagnant;
              const estFaux = choix === c && c !== gagnant;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{g.l}{choix ? ` : ${g.v} %` : ""}
                </button>
              );
            })}
          </div>
          {choix && (
            <p className="encart" aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{duel.a.l} : {duel.a.v} % sur {duel.a.n} · {duel.b.l} : {duel.b.v} % sur {duel.b.n}.</b>
              {duel.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1 ou 2 au clavier</span>}
        </div>
      )}
    </div>
      <ImpressionJeu jeu={jeuxImprimes.QuiAPlusDeChances} />
    </>
  );
}
