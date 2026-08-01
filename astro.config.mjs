// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * URL pública del sitio.
 * - Netlify sirve en la raíz del dominio, así que no hay `base`.
 * - `site` se usa para sitemap y URLs canónicas. Cambiar cuando haya dominio propio.
 *   Netlify asigna un subdominio *.netlify.app tras conectar el repo; puedes reemplazar
 *   la URL de abajo por la real (Settings → Domain management en Netlify).
 */
export default defineConfig({
  site: 'https://cuatronodos.netlify.app',
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
