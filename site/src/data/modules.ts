/**
 * Les modules optionnels (collection `modules`, src/content/modules/) : libellés et liens partagés par leur page,
 * l'accueil, la barre latérale et la page d'export. La collection est la seule liste des modules.
 */
import type { CollectionEntry } from "astro:content";
import { seances } from "./seances";

export const ORDRE_MODULES = ["SO1", "SO2", "B1", "B2", "B3", "B4"] as const;
export type CodeModule = (typeof ORDRE_MODULES)[number];
type Module = CollectionEntry<"modules">;

/** « Séance optionnelle 1 » ou « Projet B2 » */
export const libelleModule = (m: Module["data"]) => (m.type === "seance" ? `Séance optionnelle ${m.code.slice(2)}` : `Projet ${m.code}`);
/** le titre de la page, du pied imprimé et du fichier PDF : « Séance optionnelle 1 · Les métiers de la data science » */
export const titreModule = (m: Module["data"]) => `${libelleModule(m)} · ${m.titre}`;
export const objectifsModule = (m: Module["data"]) => (m.type === "seance" ? "À la fin de la séance" : "À la fin du projet");
export const trierModules = (liste: Module[]) => [...liste].sort((a, b) => ORDRE_MODULES.indexOf(a.data.code) - ORDRE_MODULES.indexOf(b.data.code));

/** Un prérequis (numéro de séance ou code de module) en lien : { libelle, href } ; null s'il n'existe pas. */
export function lienPrerequis(p: number | string, modules: Module[]) {
  if (typeof p === "number") {
    const s = seances.find((x) => x.numero === p);
    return s?.slug ? { libelle: `séance ${p}`, href: `/lecons/${s.slug}` } : null;
  }
  const m = modules.find((x) => x.data.code === p);
  return m ? { libelle: libelleModule(m.data).replace("Projet", "projet").replace("Séance", "séance"), href: `/modules/${m.id}` } : null;
}
