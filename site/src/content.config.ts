import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Une leçon = un fichier MDX dans src/content/lecons/. Le nom du fichier est le slug.
const lecons = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/lecons" }),
  schema: z.object({
    numero: z.number().int().min(0).max(12),
    titre: z.string(),
    niveau: z.enum(["★", "★★", "★★★"]),
    resume: z.string(),
    duree: z.string().default("1 h 30"),
    /** Ce qu'on repart avec à la fin de la séance */
    livrable: z.string().optional(),
    /** En tête de leçon : 3 puces au plus, formulées « tu sauras… ». Absent pour une prise de contact. */
    objectifs: z.array(z.string()).max(3).optional(),
    /** En pied de leçon, avant la navigation : 5 lignes au plus, une idée par ligne, qui compressent l'heure et demie. */
    aRetenir: z.array(z.string()).max(5).optional(),
  }),
});

// Un module optionnel = un fichier MDX dans src/content/modules/ (séances optionnelles SO1, SO2 ; projets B1 à B4). Le
// nom du fichier, en minuscules, est le slug : /modules/<slug>. Hors du parcours : ni progression, ni compteur.
const modules = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/modules" }),
  schema: z.object({
    code: z.enum(["SO1", "SO2", "B1", "B2", "B3", "B4"]),
    /** « seance » : une leçon (quiz de 4 questions obligatoire) ; « projet » : une page de projet (aucun quiz) */
    type: z.enum(["seance", "projet"]),
    titre: z.string(),
    niveau: z.enum(["★", "★★", "★★★"]),
    resume: z.string(),
    duree: z.string().default("1 h 30"),
    livrable: z.string(),
    /** ce sur quoi le module s'appuie : des numéros de séance ou des codes de module ; la page en fait des liens */
    prerequis: z.array(z.union([z.number().int().min(0).max(12), z.enum(["SO1", "SO2", "B1", "B2", "B3", "B4"])])).optional(),
    /** une précision sur les prérequis, par exemple « l'un des deux suffit » */
    prerequisNote: z.string().optional(),
    objectifs: z.array(z.string()).min(1).max(3),
    aRetenir: z.array(z.string()).max(5).optional(),
  }),
});

// Les pages transverses lues telles quelles depuis docs/ à la racine du dépôt : une seule source de vérité.
// Aujourd'hui : docs/glossaire.md → /glossaire. Corriger le fichier corrige la page.
const docs = defineCollection({
  loader: glob({ pattern: "glossaire.md", base: "../docs" }),
});

export const collections = { lecons, modules, docs };
