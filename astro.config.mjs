// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * URL pública del sitio.
 * - GitHub Pages: https://abrinay1997-stack.github.io/FLASK/
 * - Cuando exista dominio propio, cambiar `site` y borrar `base`.
 */
export default defineConfig({
  site: 'https://abrinay1997-stack.github.io',
  base: '/FLASK',
  trailingSlash: 'never',
  build: {
    format: 'file', // /contacto.html en vez de /contacto/index.html — compatible con Netlify Forms
    inlineStylesheets: 'auto', // CSS pequeño se inlinea; el grande queda como <link>
  },
  compressHTML: true,
  integrations: [
    sitemap({
      // Fuera del sitemap lo que ya va con noindex: pedirle a Google que
      // rastree una página que le decimos que no indexe es contradictorio.
      filter: (page) => !/\/(gracias|404)\/?$/.test(page),
    }),
  ],
});
