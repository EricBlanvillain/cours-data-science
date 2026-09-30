/**
 * La version imprimée des jeux et du mini-quiz, tirée de leurs fichiers de données : pas un mot de plus.
 * À l'écran, les jeux sont interactifs ; à l'impression (et dans les PDF), chacun devient une liste numérotée de ses
 * situations, à sa place dans la leçon (composant ImpressionJeu, rendu par l'îlot lui-même), et le « Corrigé » en fin
 * de leçon donne pour chaque situation la réponse et son explication (page de leçon, qui repère les jeux dans le MDX).
 * La clé est le nom du composant tel qu'il apparaît dans le MDX.
 */
import { VERDICTS, situationsModeles } from "./modele";
import { questions } from "./questions";
import { VERDICTS_CONSIGNE, situationsConsigne } from "./dialogue";
import { VERDICTS_FUITE, situationsFuite } from "./competition";
import { VERDICTS_RAG, casRag } from "./rag";
import { VERDICTS_AGENT, casAgent } from "./agent";
import { GRAPHIQUES, questionsGraphiques } from "./graphiques";
import { COMMANDES, ORDRE, situations } from "./git";
import { LIMITES, ORDRE_LIMITES, situationsLimites } from "./llm";
import { PIEGES, situationsPieges } from "./analyse";
import { duels } from "./titanic";
import { CHOIX, situationsVides } from "./nettoyage";
import { quiz } from "./quiz";
import { QUIZ_IA } from "./accueil";

export type ItemImprime = { enonce: string; options?: string[]; reponse: string; pourquoi: string };
export type JeuImprime = { titre: string; consigne: string; choix: string[]; items: ItemImprime[] };

const choixDe = (r: Record<string, { nom: string; definition: string }>) => Object.values(r).map((v) => `${v.nom} : ${v.definition}`);

export const jeuxImprimes: Record<string, JeuImprime> = {
  AccueilSeance0: {
    titre: "Est-ce de l'IA ?",
    consigne: "Pour chaque exemple, réponds à l'instinct : oui ou non ?",
    choix: ["Oui : c'est de l'IA", "Non : ce n'est pas de l'IA"],
    items: QUIZ_IA.map((q) => ({ enonce: q.titre, reponse: q.ia === "oui" ? "Oui, c'est de l'IA" : "Non, ce n'est pas de l'IA", pourquoi: q.pourquoi })),
  },
  ClassifOuRegression: {
    titre: "Classification ou régression ?",
    consigne: "Pour chaque question, dis si elle demande une catégorie (classification) ou un nombre (régression).",
    choix: ["Classification : la réponse est une catégorie", "Régression : la réponse est un nombre"],
    items: questions.map((q) => ({ enonce: q.texte, reponse: q.reponse === "classification" ? "Classification" : "Régression", pourquoi: q.pourquoi })),
  },
  QuelleCommande: {
    titre: "Quelle commande ?",
    consigne: "Pour chaque situation, choisis la commande Git qui convient.",
    choix: ORDRE.map((c) => `${COMMANDES[c].nom} : ${COMMANDES[c].sert}`),
    items: situations.map((s) => ({ enonce: s.texte, reponse: COMMANDES[s.reponse].nom, pourquoi: s.pourquoi })),
  },
  SupprimerRemplirGarder: {
    titre: "Supprimer, remplir ou garder ?",
    consigne: "Pour chaque case vide, choisis ce qu'on en fait.",
    choix: Object.values(CHOIX).map((c) => `${c.nom} : ${c.quand}`),
    items: situationsVides.map((s) => ({ enonce: s.texte, reponse: CHOIX[s.reponse].nom, pourquoi: s.pourquoi })),
  },
  QuelGraphique: {
    titre: "Quel graphique ?",
    consigne: "Pour chaque question, choisis le graphique qui y répond.",
    choix: Object.values(GRAPHIQUES).map((g) => `${g.nom} : ${g.sert}`),
    items: questionsGraphiques.map((q) => ({ enonce: q.texte, reponse: GRAPHIQUES[q.reponse].nom, pourquoi: q.pourquoi })),
  },
  QuelPiege: {
    titre: "Quel piège ?",
    consigne: "Pour chaque affirmation, nomme le piège qui s'y cache.",
    choix: choixDe(PIEGES),
    items: situationsPieges.map((s) => ({ enonce: s.texte, reponse: PIEGES[s.reponse].nom, pourquoi: s.pourquoi })),
  },
  CeModeleACompris: {
    titre: "Ce modèle a-t-il compris ?",
    consigne: "Pour chaque modèle, tranche : a-t-il compris, appris par cœur, ou ne fait-il pas mieux que le modèle bête ?",
    choix: choixDe(VERDICTS),
    items: situationsModeles.map((s) => ({ enonce: s.texte, reponse: VERDICTS[s.reponse].nom, pourquoi: s.pourquoi })),
  },
  QuiAPlusDeChances: {
    titre: "Qui a plus de chances ?",
    consigne: "Pour chaque duel, dis quel passager avait le plus de chances de survivre.",
    choix: [],
    items: duels.map((d) => {
      const [haut, bas] = d.a.v >= d.b.v ? [d.a, d.b] : [d.b, d.a];
      return { enonce: `${d.a.l} ou ${d.b.l} ?`, reponse: `${haut.l} : ${haut.v} % de survie, contre ${bas.v} %`, pourquoi: d.pourquoi };
    }),
  },
  FuiteOuPas: {
    titre: "Fuite ou pas fuite ?",
    consigne: "Pour chaque colonne ajoutée, dis si elle fait fuiter la réponse.",
    choix: choixDe(VERDICTS_FUITE),
    items: situationsFuite.map((s) => ({ enonce: s.texte, reponse: VERDICTS_FUITE[s.reponse].nom, pourquoi: s.pourquoi })),
  },
  QuelleLimite: {
    titre: "Quelle limite ?",
    consigne: "Pour chaque réponse du modèle, nomme la limite qui explique l'erreur.",
    choix: ORDRE_LIMITES.map((l) => `${LIMITES[l].nom} : ${LIMITES[l].definition}`),
    items: situationsLimites.map((s) => ({ enonce: `« ${s.question} » · réponse du modèle : « ${s.reponse} »`, reponse: LIMITES[s.limite].nom, pourquoi: s.pourquoi })),
  },
  ConsigneTenue: {
    titre: "La consigne est-elle tenue ?",
    consigne: "Pour chaque consigne, lis la réponse du modèle et dis si elle la tient.",
    choix: choixDe(VERDICTS_CONSIGNE),
    items: situationsConsigne.map((s) => ({ enonce: `Consigne : « ${s.consigne} » · réponse : « ${s.reponse} »`, reponse: VERDICTS_CONSIGNE[s.reponseAttendue].nom, pourquoi: s.pourquoi })),
  },
  OuARateLeRag: {
    titre: "Où le RAG a-t-il raté ?",
    consigne: "Pour chaque question, regarde les passages trouvés et la réponse, puis dis où ça a raté.",
    choix: choixDe(VERDICTS_RAG),
    items: casRag.map((c) => ({
      enonce: `« ${c.question} » · passages trouvés : ${c.passages.map((p) => `n° ${p.n} (${String(p.score).replace(".", ",")})`).join(", ")} · réponse : « ${c.reponse} »`,
      reponse: VERDICTS_RAG[c.verdict].nom, pourquoi: c.pourquoi,
    })),
  },
  QuAtIlRate: {
    titre: "Qu'a-t-il raté ?",
    consigne: "Pour chaque question, lis ce que l'agent a fait, puis dis ce qui s'est passé.",
    choix: choixDe(VERDICTS_AGENT),
    items: casAgent.map((c) => ({ enonce: `« ${c.question} » · ${c.trace.join(" → ")} · réponse : « ${c.reponse} »`, reponse: VERDICTS_AGENT[c.verdict].nom, pourquoi: c.pourquoi })),
  },
};

/** Le mini-quiz d'une séance, dans la même forme : l'énoncé porte les options, le corrigé la bonne. */
export const quizImprime = (seance: number): JeuImprime | null => {
  const qs = quiz[seance] ?? [];
  if (!qs.length) return null;
  const lettre = (i: number) => "ABCD"[i] ?? String(i + 1);
  return {
    titre: "Mini-quiz",
    consigne: "Une seule bonne réponse par question.",
    choix: [],
    items: qs.map((q) => ({ enonce: q.question, options: q.options.map((o, i) => `${lettre(i)}. ${o}`), reponse: `${lettre(q.bonne)}. ${q.options[q.bonne]}`, pourquoi: q.explication })),
  };
};

/** Les jeux d'une leçon, dans leur ordre d'apparition, repérés dans le source MDX. */
export const jeuxDeLaLecon = (mdx: string): string[] =>
  [...mdx.matchAll(/<([A-Z]\w*)\s+client:load/g)].map((m) => m[1]).filter((n, i, t) => n in jeuxImprimes && t.indexOf(n) === i);
