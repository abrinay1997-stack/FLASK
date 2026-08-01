// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Cuando exista dominio propio, actualizar site:
  // site: 'https://flask.com.pa',
  build: {
    format: 'file', // /contacto.html en vez de /contacto/index.html — compatible con Netlify Forms
  },
  compressHTML: true,
});
