import { affirmations, ACTIVE, type Affirmation as TypeAffirmation } from "../../data/affirmations";

/**
 * Une affirmation, deux boutons, et au clic les deux arguments côte à côte, même largeur, même poids : pas de bonne
 * réponse, donc ni ✓ ni ✗ ni score, et le camp choisi n'est pas mis en avant. La case grandit à l'ouverture : elle est
 * la dernière de l'écran et la barre de navigation est épinglée, donc rien ne bouge au-dessus ni en dessous.
 * Clavier : 1 = plutôt d'accord, 2 = plutôt pas d'accord, ou Tab puis Entrée.
 */
export type Avis = "pour" | "contre" | null;

export default function Affirmation({ avis, onAvis, texte }: { avis: Avis; onAvis: (a: Avis) => void; texte?: TypeAffirmation }) {
  const a = texte ?? affirmations[ACTIVE];
  const repondu = avis !== null;
  return (
    <div
      className="carte debat"
      data-avis={avis ?? "aucun"}
      onKeyDown={(e) => {
        if (repondu) return;
        if (e.key === "1") { e.preventDefault(); onAvis("pour"); }
        if (e.key === "2") { e.preventDefault(); onAvis("contre"); }
      }}
    >
      <p className="mono-caps" style={{ color: "var(--encre-2)" }}>Une affirmation, deux avis · pas de bonne réponse</p>
      <p className={"debat-affirmation" + (repondu ? "" : " ouvert")}>« {a.texte} »</p>
      {!repondu ? (
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button type="button" className="bouton" onClick={() => onAvis("pour")}>1 · Plutôt d'accord</button>
          <button type="button" className="bouton" onClick={() => onAvis("contre")}>2 · Plutôt pas d'accord</button>
        </div>
      ) : (
        <div aria-live="polite">
          {/* les deux arguments, même largeur, même poids ; le camp choisi n'est pas mis en avant */}
          <div className="debat-arguments">
            <div><p className="mono-caps" style={{ color: "var(--encre-2)" }}>Plutôt d'accord</p><p>{a.pour}</p></div>
            <div><p className="mono-caps" style={{ color: "var(--encre-2)" }}>Plutôt pas d'accord</p><p>{a.contre}</p></div>
          </div>
          <p className="discret debat-cloture">{a.cloture}</p>
        </div>
      )}
    </div>
  );
}
