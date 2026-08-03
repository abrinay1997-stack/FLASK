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

      /**
       * Con `format:'file'` cada página se sirve en `/ayuda.html` y declara ese
       * mismo `.html` como canonical, pero el sitemap las emitía sin extensión.
       * Era entregarle a Google una lista de URLs que ninguna página reconocía
       * como la buena, en las diez páginas indexables. Aquí se igualan.
       *
       * La home es la excepción: su canonical es la raíz del dominio, no
       * `/index.html`.
       */
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname === '/' || url.pathname === '/index.html') {
          return { ...item, url: `${url.origin}/` };
        }
        if (!url.pathname.endsWith('.html')) {
          return { ...item, url: `${url.origin}${url.pathname}.html` };
        }
        return item;
      },
    }),
  ],
});
