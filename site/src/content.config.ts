import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Une leçon = un fichier MDX dans src/content/lecons/. Le nom du fichier est le slug.
const lecons = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/lecons" }),
  schema: z.object({
    numero: z.number().int().min(0).max(12),
    titre: z.string(),
    niveau: z.enum(["⭐", "⭐⭐", "⭐⭐⭐"]),
    resume: z.string(),
    duree: z.string().default("1 h 30"),
    /** Ce qu'on repart avec à la fin de la séance */
    livrable: z.string().optional(),
  }),
});

// Les pages transverses lues telles quelles depuis docs/ à la racine du dépôt : une seule source de vérité.
// Aujourd'hui : docs/glossaire.md → /glossaire. Corriger le fichier corrige la page.
const docs = defineCollection({
  loader: glob({ pattern: "glossaire.md", base: "../docs" }),
});

export const collections = { lecons, docs };
