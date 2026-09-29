import { useEffect, useRef, useState } from "react";
import { GRAPHIQUES, questionsGraphiques, type Graphique } from "../../data/graphiques";
import ImpressionJeu from "../ImpressionJeu";
import { jeuxImprimes } from "../../data/impression";

/**
 * « Quel graphique pour quelle question ? » : on choisit une question, puis l'un des trois graphiques ; le verdict et son
 * explication s'affichent. Frère de ClassifOuRegression (même geste : des questions en boutons, une réponse à trancher),
 * dont on n'a pas voulu changer le comportement. Cuivre sur « question ouverte » tant qu'elle n'est pas tranchée.
 * Clavier : Tab entre les boutons, 1 à 3 pour choisir le graphique quand une question est posée.
 */
const CHOIX: Graphique[] = ["barres", "nuage", "histogramme"];

export default function QuelGraphique() {
  const [q, setQ] = useState<number | null>(null);
  const [choix, setChoix] = useState<Graphique | null>(null);
  const racine = useRef<HTMLDivElement>(null);
  const question = q === null ? null : questionsGraphiques[q];
  const juste = question && choix ? choix === question.reponse : null;

  useEffect(() => {
    const el = racine.current; if (!el) return;
    function surTouche(e: KeyboardEvent) {
      if (question && choix === null && /^[1-3]$/.test(e.key)) { e.preventDefault(); setChoix(CHOIX[Number(e.key) - 1]); }
    }
    el.addEventListener("keydown", surTouche);
    return () => el.removeEventListener("keydown", surTouche);
  });

  return (
    <>
    <div ref={racine} className="large" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {questionsGraphiques.map((x, i) => (
          <button key={x.texte} type="button" className={"bouton" + (q === i ? " actif" : "")} aria-pressed={q === i} onClick={() => { setQ(i); setChoix(null); }}>
            {x.texte}
          </button>
        ))}
      </div>

      {question === null ? (
        <p className="discret"><span className="pastille-ouverte" aria-hidden="true" /><span className="ouvert">Aucune question choisie pour l'instant.</span> Clique sur une question, puis sur le graphique qui y répond.</p>
      ) : (
        <div className="carte" data-tranche={choix ? "oui" : "non"} style={{ display: "grid", gap: "0.8rem", maxWidth: "46rem" }}>
          <p className={"mono-caps" + (choix ? "" : " ouvert")} style={choix ? { color: "var(--encre-2)" } : undefined}>
            {!choix && <span className="pastille-ouverte" aria-hidden="true" />}
            {choix ? (juste ? "✓ juste" : "✗ pas celui-là") : "question ouverte : quel graphique ?"}
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: 1.3 }}>« {question.texte} »</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {CHOIX.map((g, i) => {
              const estBonne = choix !== null && g === question.reponse;
              const estFaux = choix === g && g !== question.reponse;
              return (
                <button key={g} type="button" className={"bouton" + (estBonne ? " actif" : "")} disabled={choix !== null} aria-pressed={choix === g}
                  style={estFaux ? { borderStyle: "dashed", color: "var(--encre-2)", textDecoration: "line-through" } : undefined}
                  onClick={() => setChoix(g)}>
                  {estBonne ? "✓ " : estFaux ? "✗ " : `${i + 1} · `}{GRAPHIQUES[g].nom}
                </button>
              );
            })}
          </div>
          {choix && (
            <p className="encart" aria-live="polite" style={{ fontSize: "0.95rem" }}>
              <b style={{ display: "block", marginBottom: "0.2rem" }}>{GRAPHIQUES[question.reponse].nom}, pour {GRAPHIQUES[question.reponse].sert}.</b>
              {question.pourquoi}
            </p>
          )}
          {!choix && <span className="discret">1, 2 ou 3 au clavier</span>}
        </div>
      )}
    </div>
      <ImpressionJeu jeu={jeuxImprimes.QuelGraphique} />
    </>
  );
}
