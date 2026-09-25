import { useEffect, useMemo, useRef, useState } from "react";
import { jalons, periodes, type Periode } from "../../data/frise";

const ORDRE: Periode[] = ["fondations", "hivers", "renaissance", "deep-learning", "transformers", "boom"];

function hote(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

/**
 * Frise horizontale : une carte par jalon, défilement à la molette, aux boutons ou au clavier.
 * Sans JavaScript (ouverture depuis le disque), le rendu initial reste une bande déroulable.
 */
export default function Frise() {
  const bande = useRef<HTMLOListElement>(null);
  const [courant, setCourant] = useState(0);
  const liste = useMemo(() => [...jalons].sort((a, b) => a.annee - b.annee), []);
  const [sourceOuverte, setSourceOuverte] = useState<number | null>(null);

  // Suit la carte la plus proche du bord gauche pour surligner la période active.
  useEffect(() => {
    const el = bande.current;
    if (!el) return;
    const onScroll = () => {
      const cartes = Array.from(el.children) as HTMLElement[];
      const gauche = el.scrollLeft + 24;
      let meilleur = 0;
      cartes.forEach((c, i) => { if (c.offsetLeft <= gauche + 8) meilleur = i; });
      setCourant(meilleur);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function aller(i: number) {
    const el = bande.current;
    if (!el) return;
    const cible = Math.max(0, Math.min(liste.length - 1, i));
    const carte = el.children[cible] as HTMLElement | undefined;
    if (carte) el.scrollTo({ left: carte.offsetLeft - 24, behavior: "smooth" });
    setCourant(cible);
  }

  function allerPeriode(p: Periode) {
    const i = liste.findIndex((j) => j.periode === p);
    if (i >= 0) aller(i);
  }

  if (liste.length === 0) {
    return <p className="encart">La frise n'a pas encore de jalons : remplis <code>src/data/frise.ts</code>.</p>;
  }
  const periodeCourante = liste[courant]?.periode;

  return (
    <div className="large" style={{ display: "grid", gap: "0.9rem", gridTemplateColumns: "minmax(0, 1fr)", minWidth: 0 }}>
      {/* Les périodes : un raccourci et un repère */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }} role="tablist" aria-label="Périodes">
        {ORDRE.filter((p) => liste.some((j) => j.periode === p)).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={periodeCourante === p}
            className={"bouton" + (periodeCourante === p ? " actif" : "")}
            style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}
            onClick={() => allerPeriode(p)}
          >
            {periodes[p].titre} <span className="discret" style={{ fontSize: "0.75rem" }}>{periodes[p].annees}</span>
          </button>
        ))}
      </div>

      {/* La bande */}
      <div style={{ position: "relative", minWidth: 0 }}>
        <ol
          ref={bande}
          className="defile-x"
          tabIndex={0}
          aria-label="Frise chronologique, utilise les flèches du clavier"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); aller(courant + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); aller(courant - 1); }
            if (e.key === "Home") { e.preventDefault(); aller(0); }
            if (e.key === "End") { e.preventDefault(); aller(liste.length - 1); }
          }}
          style={{ display: "flex", gap: "0.9rem", listStyle: "none", padding: "0.25rem 1.5rem 1rem", margin: 0, scrollPaddingLeft: "1.5rem" }}
        >
          {liste.map((j, i) => {
            const nouvellePeriode = i === 0 || liste[i - 1].periode !== j.periode;
            return (
              <li
                key={`${j.annee}-${j.titre}`}
                className="carte"
                style={{
                  flex: "0 0 19rem",
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                  borderColor: i === courant ? "var(--encre)" : "var(--trait)",
                  transition: "border-color .25s var(--ease)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                  <span className="chiffre" style={{ fontSize: "1.7rem", lineHeight: 1 }}>{j.annee}</span>
                  {nouvellePeriode && <span className="etiquette" style={{ textAlign: "right" }}>{periodes[j.periode].titre}</span>}
                </div>
                {j.date && <span className="discret">{j.date}</span>}
                <h3 style={{ fontSize: "1.1rem" }}>{j.titre}</h3>
                {j.desaccord && <span className="etiquette ouvert"><span className="pastille-ouverte" />sources en désaccord</span>}
                <p style={{ fontSize: "0.95rem", lineHeight: 1.4 }}>{j.phrase}</p>
                <div style={{ marginTop: "auto", paddingTop: "0.4rem" }}>
                  <button
                    type="button"
                    className="lien-source"
                    aria-expanded={sourceOuverte === i}
                    onClick={() => setSourceOuverte(sourceOuverte === i ? null : i)}
                  >
                    source
                  </button>
                  {sourceOuverte === i && (
                    <p className="discret" style={{ marginTop: "0.35rem", wordBreak: "break-all" }}>
                      <a href={j.source} target="_blank" rel="noopener">{hote(j.source)} ↗</a>
                      <span> · vérifié le {j.verifie}</span>
                      {j.note && <span style={{ display: "block", marginTop: "0.3rem", fontStyle: "italic", wordBreak: "normal" }}>{j.note}</span>}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Boutons et position */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <button type="button" className="bouton" onClick={() => aller(courant - 1)} disabled={courant === 0} aria-label="Jalon précédent">← Précédent</button>
        <span className="discret">
          {liste[courant].annee} · {courant + 1} / {liste.length}
        </span>
        <button type="button" className="bouton principal" onClick={() => aller(courant + 1)} disabled={courant === liste.length - 1} aria-label="Jalon suivant">Suivant →</button>
      </div>
    </div>
  );
}
