import { useEffect, useRef, useState } from "react";
import { CHOIX, situationsVides, type Choix } from "../../data/nettoyage";

/**
 * « Supprimer, remplir ou garder ? » : on choisit une case vide, puis l'une des trois stratégies ; le verdict et son
 * explication s'affichent. Frère de QuelGraphique et QuelleCommande (même geste, mêmes classes), dont on n'a pas voulu
 * changer le comportement. Cuivre sur « case ouverte » tant qu'elle n'est pas tranchée. Clavier : 1 à 3 pour la stratégie.
 */
const ORDRE: Choix[] = ["supprimer", "remplir", "garder"];

export default function SupprimerRemplirGarder() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Choix | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const situation = s === null ? null : situationsVides[s];
  const juste = situation && choix ? choix === situation.reponse : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (situation && choix === null && /^[1-3]$/.test(e.key)) { e.preventDefault(); setChoix(ORDRE[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {situationsVides.map((x, i) => (
          <button key={x.texte} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i}
            onClick={() => { setS(i); setChoix(null); }}>
            {x.texte}
          </button>
        ))}
      </div>

      {situation === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune case vide choisie pour l'instant.</span> Clique sur une situation, puis sur ce que tu en ferais.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas ce choix-là") : "case ouverte : supprimer, remplir ou garder ?"}
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: 1.3 }}>« {situation.texte} »</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ORDRE.map((c, i) => {
              const estBonne = choix !== null && c === situation.reponse;
              const estFaux = choix === c && c !== situation.reponse;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{CHOIX[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p className="encart" aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{CHOIX[situation.reponse].nom}, quand {CHOIX[situation.reponse].quand}.</b>
              {situation.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1, 2 ou 3 au clavier</span>}
        </div>
      )}
    </div>
  );
}
