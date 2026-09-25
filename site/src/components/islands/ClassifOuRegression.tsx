import { useState, type CSSProperties } from "react";
import { questions, type Question } from "../../data/questions";

type Verdict = Question["reponse"] | "inconnu";

/** Devine la nature d'une question tapée librement, à partir de sa forme. */
function deviner(texte: string): { verdict: Verdict; indice: string } {
  const q = texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, " ")
    .trim();
  if (!q) return { verdict: "inconnu", indice: "" };

  const NOMBRE = "(temperature|prix|montant|note|taille|age|duree|distance|vitesse|poids|hauteur|score|salaire|nombre|pourcentage|chiffre|cout|consommation|recette|benefice|valeur|quantite|budget|delai|audience|frequentation|population|loyer|tarif)";
  const regression: [RegExp, string][] = [
    [/\bcombien\b/, "« combien » appelle une quantité"],
    [new RegExp("\\b(quel|quelle)\\b[^?]{0,25}?\\b" + NOMBRE), "on demande une valeur numérique"],
    [/\b(a quelle heure|dans combien|jusqu a quel|a quel niveau)\b/, "on demande une valeur sur une échelle"],
    [new RegExp("\\b(estimer|predire|prevoir|calculer|deviner)\\b[^?]{0,20}?\\b" + NOMBRE), "on estime une grandeur"],
  ];
  const classification: [RegExp, string][] = [
    [/\b(est|va|a|montre|peut|doit|faut|sera|risque|s agit|contient|appartient)[- ]t[- ](il|elle|on)\b|\b(est|sont|vont|ont|peuvent|seront)[- ](il|elle|ils|elles|ce)\b|\b(dois|puis|vais)[- ]je\b/, "la question attend oui ou non"],
    [/\b(quel|quelle)\s+(type|genre|categorie|espece|classe|couleur|langue|animal|sorte|marque|equipe|pays|ville)\b/, "on choisit une étiquette dans une liste"],
    [/\b(spam|frauduleu|malade|malin|benin|survecu|resili|churn|vrai ou faux|oui ou non|lequel|laquelle|positif ou negatif|gagn\w* ou perd\w*)\b/, "la réponse est une case"],
    [/\b\w+\s+ou\s+\w+\s*\?\s*$/, "« X ou Y » : deux cases"],
  ];
  const r = regression.find(([re]) => re.test(q));
  const c = classification.find(([re]) => re.test(q));
  if (r && !c) return { verdict: "regression", indice: r[1] };
  if (c && !r) return { verdict: "classification", indice: c[1] };
  if (r && c && c[1] === "la question attend oui ou non") return { verdict: "classification", indice: c[1] };
  return { verdict: "inconnu", indice: "" };
}

const PANNEAUX = {
  classification: {
    titre: "Classification",
    def: "La réponse est une catégorie : une case parmi plusieurs.",
    exemples: "spam / pas spam · chat / chien / lapin · survécu / non",
    forme: "Une étiquette",
  },
  regression: {
    titre: "Régression",
    def: "La réponse est un nombre : une valeur sur une échelle.",
    exemples: "22,5 °C · 348 000 € · 12 minutes · 2 millions de vues",
    forme: "Un nombre",
  },
} as const;

export default function ClassifOuRegression() {
  const [saisie, setSaisie] = useState("");
  const [question, setQuestion] = useState<string>("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [pourquoi, setPourquoi] = useState("");
  const [choixManuel, setChoixManuel] = useState(false);

  function poser(texte: string) {
    const connue = questions.find((x) => x.texte.toLowerCase() === texte.toLowerCase().trim());
    setQuestion(texte.trim());
    setChoixManuel(false);
    if (connue) {
      setVerdict(connue.reponse);
      setPourquoi(connue.pourquoi);
      return;
    }
    const d = deviner(texte);
    setVerdict(d.verdict);
    setPourquoi(
      d.verdict === "inconnu"
        ? ""
        : d.verdict === "regression"
          ? `Indice dans la formulation : ${d.indice}. La bonne réponse est un nombre, et une prédiction « pas loin » a de la valeur.`
          : `Indice dans la formulation : ${d.indice}. La bonne réponse est une case, et on a soit juste, soit faux.`,
    );
  }

  function trancher(v: Question["reponse"]) {
    setVerdict(v);
    setChoixManuel(true);
    setPourquoi(
      v === "regression"
        ? "Tu as dit que la réponse est un nombre : c'est donc une régression. Le modèle apprendra à s'approcher de la bonne valeur."
        : "Tu as dit que la réponse est une étiquette : c'est donc une classification. Le modèle apprendra à choisir la bonne case.",
    );
  }

  return (
    <div className="large" style={{ display: "grid", gap: "1.1rem" }}>
      {/* Les exemples */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {questions.map((q) => (
          <button
            key={q.texte}
            type="button"
            className={"bouton" + (question === q.texte ? " actif" : "")}
            onClick={() => poser(q.texte)}
          >
            {q.texte}
          </button>
        ))}
      </div>

      {/* La saisie libre */}
      <form
        style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (saisie.trim()) poser(saisie);
        }}
      >
        <input
          className="champ"
          style={{ flex: "1 1 18rem" }}
          placeholder="Ou écris ta propre question : « Combien de buts marquera l'équipe ? »"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          aria-label="Ta question"
        />
        <button type="submit" className="bouton principal">Classification ou régression ?</button>
      </form>

      {/* Les deux panneaux */}
      {/* Deux panneaux, cinq bandes alignées : forme, titre, définition, exemples, verdict. */}
      <ul className="grille-cartes" style={{ "--bandes": 5, "--carte-min": "16rem" } as CSSProperties}>
        {(["classification", "regression"] as const).map((k) => {
          const actif = verdict === k;
          const eteint = verdict !== null && verdict !== "inconnu" && !actif;
          return (
            <li
              key={k}
              className="carte"
              aria-live={actif ? "polite" : undefined}
              style={{
                borderColor: actif ? "var(--encre)" : "var(--trait)",
                boxShadow: actif ? "inset 0 0 0 1px var(--encre)" : "none",   /* trait épaissi sans bouger la mise en page */
                background: actif ? "var(--fond-3)" : "var(--fond-2)",
                opacity: eteint ? 0.45 : 1,
                transition: "opacity .25s var(--ease), border-color .25s var(--ease)",
              }}
            >
              <p className="etiquette">{PANNEAUX[k].forme}</p>
              <h3>{PANNEAUX[k].titre}</h3>
              <p>{PANNEAUX[k].def}</p>
              <p className="discret">{PANNEAUX[k].exemples}</p>
              <div>
                {actif && (
                  <p style={{ fontWeight: 600 }}>
                    « {question} » → {PANNEAUX[k].titre.toLowerCase()}.
                    <br />
                    <span style={{ fontWeight: 400 }}>{pourquoi}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Quand la forme de la question ne suffit pas : on fait trancher l'élève */}
      {verdict === "inconnu" && !choixManuel && (
        <div className="encart ouvert-bord">
          <p className="etiquette ouvert" style={{ marginBottom: "0.4rem" }}><span className="pastille-ouverte" />question ouverte : à toi de trancher</p>
          <p>
            Pour « {question} », je ne devine pas à la formulation. La vraie question à se poser est toujours la même :
            <strong> à quoi ressemble la bonne réponse ?</strong>
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "0.7rem" }}>
            <button type="button" className="bouton" onClick={() => trancher("classification")}>Une étiquette (oui/non, une catégorie)</button>
            <button type="button" className="bouton" onClick={() => trancher("regression")}>Un nombre (une quantité, un prix, une durée)</button>
          </div>
        </div>
      )}

      {verdict === null && (
        <p className="discret"><span className="pastille-ouverte" /><span className="ouvert">Aucune question posée pour l'instant.</span> Clique sur une question, ou écris la tienne. Le bon réflexe : regarder la forme de la réponse, pas le sujet.</p>
      )}
    </div>
  );
}
