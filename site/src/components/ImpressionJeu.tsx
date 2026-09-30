import type { JeuImprime } from "../data/impression";

/**
 * La version papier d'un jeu ou du mini-quiz, rendue par l'îlot lui-même, juste après son interface : masquée à
 * l'écran (.imprime-seul), elle remplace l'interface à l'impression. Les réponses sont dans le « Corrigé » en fin de
 * leçon, jamais ici.
 */
export default function ImpressionJeu({ jeu }: { jeu: JeuImprime | null }) {
  if (!jeu) return null;
  return (
    <div className="imprime-seul jeu-imprime">
      <p className="mono-caps">{jeu.titre} · sur papier</p>
      <p>{jeu.consigne}</p>
      {jeu.choix.length > 0 && (
        <ul className="jeu-imprime-choix">
          {jeu.choix.map((c) => <li key={c}>{c}</li>)}
        </ul>
      )}
      <ol className="jeu-imprime-items">
        {jeu.items.map((it, i) => (
          <li key={i}>
            {it.enonce}
            {/* une case à cocher par choix : les options propres à la situation (quiz, duels), sinon les choix du jeu */}
            {it.options ? (
              <ul className="jeu-imprime-options">{it.options.map((o) => <li key={o}><span className="case" aria-hidden="true" />{o}</li>)}</ul>
            ) : jeu.etiquettes.length > 0 && (
              <span className="jeu-imprime-cases">{jeu.etiquettes.map((e) => <span key={e}><span className="case" aria-hidden="true" />{e}</span>)}</span>
            )}
          </li>
        ))}
      </ol>
      <p className="discret">Les réponses sont dans le corrigé, en fin de leçon.</p>
    </div>
  );
}
