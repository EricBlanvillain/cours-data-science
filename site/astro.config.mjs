// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// Sortie statique. `format: "file"` produit `lecons/seance-01.html` plutôt que
// `lecons/seance-01/index.html` : indispensable pour ouvrir dist/ depuis le disque
// ou avec un serveur de fichiers minimal (voir scripts/relativize.mjs et servir-local.sh).
export default defineConfig({
  output: "static",
  build: { format: "file" },
  trailingSlash: "never",
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
