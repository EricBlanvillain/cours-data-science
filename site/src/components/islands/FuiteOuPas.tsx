import { useEffect, useRef, useState } from "react";
import { VERDICTS_FUITE, situationsFuite, type Fuite } from "../../data/competition";
import ImpressionJeu from "../ImpressionJeu";
import { jeuxImprimes } from "../../data/impression";

/**
 * « Fuite ou pas fuite ? » : on choisit une colonne ajoutée, puis l'un des deux verdicts ; le verdict et son
 * explication s'affichent. Frère de QuelGraphique, QuelleCommande, SupprimerRemplirGarder, QuelPiege et CeModeleACompris (même geste, mêmes classes), dont on n'a pas voulu
 * changer le comportement. Cuivre sur « colonne ouverte » tant qu'elle n'est pas tranchée. Clavier : 1 ou 2 pour le verdict.
 */
const ORDRE: Fuite[] = ["fuite", "propre"];

export default function FuiteOuPas() {
  const [s, setS] = useState<number | null>(null);
  const [choix, setChoix] = useState<Fuite | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const situation = s === null ? null : situationsFuite[s];
  const juste = situation && choix ? choix === situation.reponse : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (situation && choix === null && /^[12]$/.test(e.key)) { e.preventDefault(); setChoix(ORDRE[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <>
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {situationsFuite.map((x, i) => (
          <button key={x.texte} type="button" className={"bouton" + (s === i ? " actif" : "")} aria-pressed={s === i}
            onClick={() => { setS(i); setChoix(null); }}>
            {x.texte}
          </button>
        ))}
      </div>

      {situation === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune colonne choisie pour l'instant.</span> Clique sur une colonne, puis sur ton verdict.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas ce verdict-là") : "colonne ouverte : fuite ou pas ?"}
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
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{VERDICTS_FUITE[c].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p className="encart" aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{VERDICTS_FUITE[situation.reponse].nom} : {VERDICTS_FUITE[situation.reponse].definition}.</b>
              {situation.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1 ou 2 au clavier</span>}
        </div>
      )}
    </div>
      <ImpressionJeu jeu={jeuxImprimes.FuiteOuPas} />
    </>
  );
}
