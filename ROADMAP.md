# Lo que falta

Ordenado por impacto. Si retomas el proyecto, empieza por P1.

Solo entra aquí lo que sigue abierto. Lo que se cierra se borra: un listado
donde conviven tareas hechas y pendientes deja de leerse a los dos meses.

El porqué de los puntos de auditoría está desarrollado en
[`docs/auditoria-conversion.md`](docs/auditoria-conversion.md) y
[`docs/auditoria-diseno.md`](docs/auditoria-diseno.md), que son fotos del
momento en que se escribieron, no el estado actual.

---

## P1 — Bloquea vender de verdad

| # | Pendiente | Quién lo desbloquea | Nota |
|---|---|---|---|
| 1 | **Las fichas de `/proyectos` están a medias.** La página existe y enlaza cuatro sitios reales, pero sin descripción ni cifras: solo nombre, dominio y enlace. | Contenido tuyo | Por proyecto: a qué se dedica, qué problema tenía, qué se construyó. Las métricas las saca `npm run medir`. Las capturas van a `src/assets/proyectos/`. Todo el hueco está marcado con `TODO` en `src/data/projects.ts`. |
| 2 | **Dominio propio.** `.netlify.app` en la barra resta credibilidad a todo lo demás. | Compra tuya | Al comprarlo: apuntarlo en Netlify y cambiar `site` en `astro.config.mjs`. **Leer antes el punto 3: el formulario cambia de comportamiento solo al cambiar de dominio.** No hace falta volver a correr `npm run brand`. |
| 3 | **El formulario decide su destino por el hostname.** El interceptor de WhatsApp solo se aparta si el host termina en `netlify.app` o `netlify.com`. Hoy eso significa que los envíos van a **Netlify Forms**, no a WhatsApp. | Decisión tuya | Dos consecuencias: (a) comprobar que estás recibiendo esos envíos, porque hoy caen en el panel de Netlify; (b) el día que pongas dominio propio la condición dará `false` y el formulario volverá solo a WhatsApp, en silencio. Elige un destino y fíjalo explícitamente en vez de deducirlo del dominio. Está en `src/pages/contacto.astro`. |
| 4 | **Cero reversión de riesgo.** El cliente pone el 50 % por adelantado y asume el 100 % del riesgo. | Decisión tuya | Algo acotado que puedas cumplir: "si el primer diseño no te convence, devolvemos el adelanto". |
| 5 | **Analítica.** No hay ninguna. Sin datos, todo lo de las auditorías es criterio informado, no certeza. | Decisión tuya | Decidir antes de anunciar el sitio, no después. Las métricas que importan están al final de `docs/auditoria-conversion.md`. |
| 6 | **El envío solo sale por WhatsApp** (formulario y cotizador). En escritorio sin WhatsApp Web el flujo se corta. | Decisión tuya + cuenta externa | Si eliges correo: cuenta en Formspree o Web3Forms, endpoint en el `action` de `contacto.astro`, borrar el interceptor `data-wa-fallback` y cambiar el envío del cotizador. |
| 7 | **Revisar el mapeo respuesta → plan del cotizador.** Los precios son tuyos, pero las reglas que deciden qué plan corresponde a cada respuesta son una propuesta, no una decisión tomada. | Validación tuya | Todo en `src/data/quote.ts`. No des por buena una cotización hasta revisarlo. |

## P2 — Contenido que no se puede inventar

| # | Pendiente | Dónde tocar |
|---|---|---|
| 8 | **Bio real.** El bloque de quiénes están detrás vive en `/proceso` y está pendiente de contenido: historia, foto y credenciales. | `proceso.astro` tiene un comentario marcando el punto exacto. La foto va a `src/assets/` y se registra en `src/data/images.ts`. |
| 9 | **`/blog`** — solo si van a existir posts reales. Cero blogs vacíos. | Contenido SEO local: "cuánto cuesta una página web en Panamá", comparativas, guías. |

## P3 — Ventas

Todo esto está argumentado en `docs/auditoria-conversion.md`.

| # | Pendiente | Nota |
|---|---|---|
| 10 | **El Diagnóstico de $49 está enterrado.** Es la oferta de entrada de menor fricción y vive como una banda debajo de la tabla de precios. | Darle página propia y tratarla como la puerta para tráfico frío. |
| 11 | **No hay captura para quien no está listo hoy.** Cero correo, cero lista, cero imán. | El imán ya está escrito en la home ("te enviamos un reporte de velocidad de tu sitio actual") y no está implementado: falta el campo donde pegar la URL. |
| 12 | **Los planes no se pueden comparar.** Cuatro listas distintas, sin filas comunes; `Commerce` dice "Todo lo de Corporate" y obliga a subir con la vista. | Una tabla comparativa con las mismas filas para los cuatro. |
| 13 | **Care está fuera del momento de venta.** Es el ingreso recurrente y aparece al 70 % del scroll de `/planes`. | Que aparezca en el resultado del cotizador y en la propuesta, marcado por defecto. |
| 14 | **El argumento contra el WordPress barato está solo en la home**, no en `/planes`, que es donde se compara. | Una fila de comparación junto a la tabla de precios, con datos. |
| 15 | **`/planes` tiene 16 CTA compitiendo.** | Las 7 tarjetas de capacidad no deberían ser enlaces individuales, sino una lista con un solo CTA al cierre. |
| 16 | **Sin señal de progreso en páginas largas** (`/planes` mide ~8000 px). | Barato: una fila de anclas bajo el titular. Caro: índice lateral pegajoso. |
| 17 | **El hero de la home no dice qué hace CuatroNodos hasta la bajada.** | Apuesta consciente por tono sobre claridad. Revisable si llega tráfico frío de búsqueda. |

## P4 — Técnico y de marca

| # | Pendiente | Nota |
|---|---|---|
| 18 | **Medir el sitio en vivo.** LCP, INP y CLS reales sobre el CDN. | `npm run medir` ya lo hace para los proyectos publicados; falta apuntarlo también al propio sitio. |
| 19 | **Search Console.** | Sitemap y canonical ya se emiten bien; falta darlos de alta y verificar. |
| 20 | **Prueba con lector de pantalla real** (NVDA / VoiceOver). | Lo auditado es estructura, no experiencia. Es el único hueco de accesibilidad que queda. |
| 21 | **La marca es solo tipográfica.** El rayo del favicon no aparece en el nav, ni en el footer, ni en la imagen social. Tampoco hay versión sobre fondo claro para facturas o propuestas. | — |
| 22 | **URLs limpias sin `.html`** (`trailingSlash:'always'` + `format:'directory'`). | Cambiaría todas las rutas de `links.ts`. Hacerlo **antes** de que el sitio tenga enlaces externos apuntándole, no después. |
| 23 | **El shader es un `requestAnimationFrame` permanente** mientras el hero está en pantalla. | Ya se pausa fuera del viewport y no arranca con reduce-motion. Si algún día importa la batería, se puede bajar a 30 fps sin que se note. |
| 24 | **La carpeta `stitch_3d_web_creation_hero/` pesa 13 MB** y se versiona como archivo de referencias visuales. | Encarece cada clon del repo. Si esas fuentes ya no se van a usar, sacarlas a almacenamiento aparte. |

---

## Fuera del repo por seguridad

Estos archivos existen en el disco local del owner y están bloqueados por
`.gitignore`. **Nunca commitearlos.**

- Documentos de estrategia comercial y metodología interna
- Prompts de trabajo
- Instrucciones internas del asistente
- `node_modules/`, `dist/`, `.astro/` — artefactos de build
