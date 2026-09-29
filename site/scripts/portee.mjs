/**
 * La portée d'un audit ou du vérificateur de PDF, lue sur la ligne de commande (voir CLAUDE.md, « Audits ciblés ») :
 *   --pages seance-03,index   seulement ces pages : « index » (ou « accueil ») pour l'accueil, sinon un morceau du chemin
 *                             de la page (seance-03, glossaire, cours-complet) ; les numéros de séance ont deux chiffres
 *   --impression              seulement les contrôles d'impression
 * Sans option : tout, comme avant. Avec npm : `npm run audit -- --pages seance-03`.
 */
export function portee(argv = process.argv) {
  const i = argv.indexOf("--pages");
  const pages = i >= 0 ? (argv[i + 1] ?? "").split(",").map((s) => s.trim()).filter(Boolean) : [];
  const impression = argv.includes("--impression");
  const vise = (page) => !pages.length || pages.some((t) => (t === "index" || t === "accueil" ? page === "index.html" : page.includes(t)));
  const libelle = [pages.length ? `pages ${pages.join(", ")}` : "toutes les pages", impression ? "impression seule" : "tous les modes"].join(" · ");
  return { pages, impression, vise, libelle, complete: !pages.length && !impression };
}
