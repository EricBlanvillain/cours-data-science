import { useEffect, useRef, useState } from "react";
import { COMMANDES, ORDRE, situations, type Commande } from "../../data/git";

/**
 * « Quelle commande git ? » : on choisit une situation, puis l'une des quatre commandes ; le verdict et son explication
 * s'affichent. Frère de QuelGraphique (même geste, mêmes classes), dont on n'a pas voulu changer le comportement.
 * Cuivre sur « situation ouverte » tant qu'elle n'est pas tranchée. Clavier : Tab entre les boutons, 1 à 4 pour la commande.
 */
export default function QuelleCommande() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Commande | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const situation = s === null ? null : situations[s];
  const juste = situation && choix ? choix === situation.reponse : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (situation && choix === null && /^[1-4]$/.test(e.key)) { e.preventDefault(); setChoix(ORDRE[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {situations.map((x, i) => (
          <button key={x.texte} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i}
            onClick={() => { setS(i); setChoix(null); }}>
            {x.texte}
          </button>
        ))}
      </div>

      {situation === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune situation choisie pour l'instant.</span> Clique sur une situation, puis sur la commande qui lui répond.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas celle-là") : "situation ouverte : quelle commande ?"}
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: 1.3 }}>« {situation.texte} »</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ORDRE.map((c, i) => {
              const estBonne = choix !== null && c === situation.reponse;
              const estFaux = choix === c && c !== situation.reponse;
              return (
                <button key={c} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === c}
                  style={{ textTransform: "none", ...(estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : {}) }}
                  onClick={() => setChoix(c)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{COMMANDES[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p className="encart" aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{COMMANDES[situation.reponse].nom}, pour {COMMANDES[situation.reponse].sert}.</b>
              {situation.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1, 2, 3 ou 4 au clavier</span>}
        </div>
      )}
    </div>
  );
}
