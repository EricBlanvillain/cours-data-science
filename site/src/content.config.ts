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

export const collections = { lecons };
