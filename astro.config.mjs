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
  site: 'https://panaclaw.netlify.app',
  /**
   * URLs de directorio: `/contacto/`, no `/contacto.html`.
   *
   * Aquí vivió `format:'file'` + `trailingSlash:'never'`. Se cambió estando el
   * sitio todavía en beta y a propósito: mientras nadie enlace desde fuera,
   * mover las rutas cuesta esta línea. Con dominio propio, Google indexando y
   * enlaces externos apuntando, el mismo cambio habría exigido redirecciones
   * 301, reindexación y una caída temporal de posiciones. Era la única tarea
   * del proyecto que se encarecía por esperar.
   *
   * Las dos opciones van juntas y no se tocan por separado: `directory` decide
   * qué archivo se emite (`contacto/index.html`) y `trailingSlash:'always'`
   * decide qué URL declaran el canonical y el sitemap. Si dicen cosas distintas,
   * Google recibe dos URLs para la misma página.
   */
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto', // CSS pequeño se inlinea; el grande queda como <link>
  },
  compressHTML: true,
  integrations: [
    sitemap({
      /*
       * Fuera del sitemap lo que ya va con noindex: pedirle a Google que
       * rastree una página que le decimos que no indexe es contradictorio.
       *
       * `smark` es el enlace de la bio en redes. Se llega a ella desde fuera,
       * nunca desde el sitio, y no debe competir con la home como puerta de
       * entrada en los resultados de búsqueda.
       *
       * Ojo: ninguna de las tres se bloquea en `robots.txt`. Sería
       * contraproducente — un rastreador que no puede entrar tampoco puede leer
       * el `noindex`, así que la página acabaría indexada igual, y encima sin
       * descripción.
       */
      filter: (page) => !/\/(gracias|404|smark)\/?$/.test(page),

      /**
       * Con `trailingSlash:'always'` el sitemap ya emite las mismas URLs que
       * declara el canonical de cada página, así que aquí no hace falta
       * reescribir nada. Se deja esta comprobación como red: si alguna URL sale
       * sin barra final, el build falla en vez de entregarle a Google una lista
       * de URLs que ninguna página reconoce como la buena. Es el bug que ya
       * ocurrió una vez, en las diez páginas indexables a la vez.
       */
      serialize: (item) => {
        const { pathname } = new URL(item.url);
        if (!pathname.endsWith('/')) {
          throw new Error(
            `Sitemap: ${item.url} no termina en barra. Debe coincidir con el canonical.`,
          );
        }
        return item;
      },
    }),
  ],
});
