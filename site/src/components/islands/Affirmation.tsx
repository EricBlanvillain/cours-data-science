import type { CSSProperties } from "react";
import { affirmations, ACTIVE, type Affirmation as TypeAffirmation } from "../../data/affirmations";

/**
 * Une affirmation et un curseur, de « pas d'accord » (gauche) à « d'accord » (droite). Pas de bonne réponse : dès le
 * premier mouvement, quelle que soit la position, les deux arguments s'affichent côte à côte, même largeur, même poids,
 * le « contre » à gauche et le « pour » à droite comme sur le curseur ; puis la ligne de clôture. Rien n'est mis en avant.
 * Le pouce suit la position : gris neutre au milieu, il tire vers --avis-contre (ambre) à gauche et --avis-pour (bleu) à
 * droite, et grossit de 14 à 26 px en s'éloignant du centre. Le cuivre reste sur l'affirmation tant que rien n'a bougé.
 * Clavier : les flèches bougent le curseur quand il a le focus (natif), Échap ou Tab le quittent ; les flèches d'écran
 * ne réagissent pas quand un champ a le focus.
 * `avis` : la position 0-100, null tant que rien n'a bougé ; gardée dans l'état du parent.
 */
export type Avis = number | null;

export default function Affirmation({ avis, onAvis, texte }: { avis: Avis; onAvis: (a: Avis) => void; texte?: TypeAffirmation }) {
  const a = texte ?? affirmations[ACTIVE];
  const repondu = avis !== null;
  const pos = avis ?? 50;
  const ecart = Math.abs(pos - 50) / 50;                         // 0 au milieu, 1 aux deux bouts
  const cote = pos < 50 ? "var(--avis-contre)" : "var(--avis-pour)";
  const style = { "--melange": `${Math.round(ecart * 100)}%`, "--taille": `${(14 + 12 * ecart).toFixed(1)}px`, "--cote": cote } as CSSProperties;
  const valeurTexte = pos === 50 ? "au milieu" : pos < 50 ? `plutôt pas d'accord, ${50 - pos} sur 50` : `plutôt d'accord, ${pos - 50} sur 50`;
  return (
    <div className="carte debat" data-avis={repondu ? "donne" : "aucun"}>
      <p className="mono-caps" style={{ color: "var(--encre-2)" }}>Une affirmation, deux avis · pas de bonne réponse</p>
      <p className={"debat-affirmation" + (repondu ? "" : " ouvert")}>« {a.texte} »</p>
      <div className="curseur-avis" style={style}>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          aria-label="Ton avis, de pas d'accord à d'accord"
          aria-valuetext={valeurTexte}
          onChange={(e) => onAvis(Number(e.target.value))}
          onKeyDown={(e) => { if (e.key === "Escape") (e.currentTarget as HTMLInputElement).blur(); }}
        />
        <div className="curseur-bouts mono-caps" aria-hidden="true"><span>Pas d'accord</span><span>D'accord</span></div>
      </div>
      {repondu && (
        <div aria-live="polite">
          <div className="debat-arguments">
            <div><p className="mono-caps" style={{ color: "var(--encre-2)" }}>Pas d'accord</p><p>{a.contre}</p></div>
            <div><p className="mono-caps" style={{ color: "var(--encre-2)" }}>D'accord</p><p>{a.pour}</p></div>
          </div>
          <p className="discret debat-cloture">{a.cloture}</p>
        </div>
      )}
    </div>
  );
}
