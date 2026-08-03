/**
 * Identificadores de medición.
 *
 * NO SON SECRETOS. Viajan dentro del HTML de todas las páginas y cualquiera los
 * lee con «ver código fuente»: así funcionan estas herramientas, porque el
 * navegador del visitante tiene que poder identificar la cuenta. Por eso viven
 * aquí y no en variables de entorno de Netlify — allí no estarían más ocultos y
 * sí obligarían a tocar el escáner de secretos, que ya hizo falta una vez con
 * `CHAT_PROVIDER`.
 *
 * DEJAR UNA CADENA VACÍA DESACTIVA ESA HERRAMIENTA: la etiqueta no se emite y
 * el sitio no carga ni un byte suyo. Es lo que sostiene la regla 4 del proyecto
 * —cero placeholders en producción—: nunca hay un `G-XXXXXXXXXX` esperando a
 * que alguien se acuerde de cambiarlo, porque un identificador falso mide en la
 * cuenta de nadie y lo parece todo menos roto.
 *
 * AL ACTIVAR O DESACTIVAR CUALQUIERA DE LOS DOS HAY QUE ACTUALIZAR
 * `/privacidad` EN EL MISMO COMMIT. La página declara qué se recoge y quién lo
 * recibe; si dice una cosa y el sitio hace otra, deja de ser un descuido de
 * redacción y pasa a ser una declaración falsa.
 */

/** Píxel de Meta. Activo desde 2026-08-03 para medir el tráfico de redes. */
export const metaPixelId = '1067898639025746';

/**
 * Google Analytics 4. Pendiente del identificador de medición (`G-…`), que se
 * saca de Analytics → Administrar → Flujos de datos.
 *
 * Hasta que esté, el recorrido solo se ve en Meta. Es la pieza que falta para
 * seguir a alguien desde que entra por `/smark/` hasta que envía el formulario.
 */
export const ga4MeasurementId = '';

/** ¿Hay algo que medir? Decide si `/privacidad` tiene que hablar de terceros. */
export const hasAnalytics = Boolean(metaPixelId || ga4MeasurementId);
