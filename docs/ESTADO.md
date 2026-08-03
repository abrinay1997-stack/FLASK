# Estado del repositorio

**El único sitio donde viven los hallazgos y los pendientes.** Si quieres saber
cómo está el sitio y qué falta, se lee esto y nada más.

Reglas de este documento:

- **Lo que se cierra se borra.** Un listado donde conviven tareas hechas y
  pendientes deja de leerse a los dos meses. El historial de git guarda lo
  cerrado; aquí solo entra lo que sigue abierto.
- **Ninguna cifra sin fecha de medición.** Es la misma regla que `projects.ts`
  aplica al contenido de cara al cliente, y vale igual para el diagnóstico
  interno: un número sin fecha deja de ser cierto sin que nadie lo toque.
- **Esto no es el manual.** Las reglas del proyecto y el troubleshooting están en
  [`convenciones.md`](convenciones.md); cómo funciona el chat, en
  [`chat.md`](chat.md). Aquí solo está el estado.

---

## Lo medido — 2026-08-03

Sobre el build de producción servido en local (`npm run build && npm run preview`),
Chromium headless a 1440×900 y 390×844.

| Página | Alto (escritorio / móvil) | Acciones en `<main>` | Sin scroll (escr. / móv.) |
|---|---|---|---|
| `/` | 3 607 / 4 927 px | 17 | 3 / 5 |
| `/servicios` | 4 765 / 5 675 px | 1 | 0 / 0 |
| `/planes` | 5 281 / **7 911** px | 13 | 0 / 1 |
| `/proceso` | 5 990 / 6 713 px | 2 | 0 / 0 |
| `/proyectos` | 3 332 / 4 421 px | 10 | 2 / 1 |
| `/contacto` | 1 777 / 3 051 px | 4 | 3 / 1 |
| `/cotizador` | 2 031 / 2 381 px | 1 | 0 / 0 |
| `/ayuda` | 3 632 / 4 692 px | 6 | 4 / 4 |

Lo que sigue verde y conviene no romper:

- **Un solo `<h1>` por página** en las ocho, y **cero saltos de nivel** de
  encabezado.
- **Cero imágenes sin `alt`.** Las decorativas van con `alt=""` y `aria-hidden`.
- **Ningún objetivo táctil por debajo de 24 px** (WCAG 2.5.8 AA) en las diez
  páginas, a 1440 y a 390. Lo que el barrido sigue señalando y **no** es fallo:
  el honeypot de `/contacto` (oculto a propósito, inalcanzable con puntero y con
  teclado), los cuatro `input` de 1×1 del cotizador —el objetivo real es la
  etiqueta que los envuelve, que sí mide de sobra— y los enlaces de WhatsApp de
  `/privacidad` y `/terminos`, que caen en la excepción explícita de la norma
  para enlaces dentro de una frase.
- **`prefers-reduced-motion: reduce` → 0 animaciones** en la home. No es que se
  aceleren: el navegador no reporta ninguna. Sin la preferencia son 13
  declaradas y **1 corriendo** (la flecha de «Scroll»).
- **Solo se animan `transform` y `opacity`** en todo el sitio.
- **Ninguna página deja al visitante sin salida:** el CTA del nav está en las
  doce, también en móvil.

### Cómo repetir esta medición

Playwright **no** es dependencia del proyecto a propósito: arrastra la descarga
de un navegador y encarecería cada build de Netlify para algo que solo se corre
a mano.

```bash
npm i -D playwright && npx playwright install chromium
npm run build && npm run medir:movil
```

`npm run medir:movil` vigila el navbar, el espacio muerto tras el footer, el
alto del footer en móvil y que el panel del chat no se corte — los cuatro
nacieron de fallos reales. Las medidas de la tabla de arriba (altos, acciones,
encabezados, animaciones) salen de `document.getAnimations()` y
`getBoundingClientRect()` sobre las mismas páginas ya construidas.

---

## P1 — Bloquea vender de verdad

| # | Pendiente | Quién lo desbloquea | Nota |
|---|---|---|---|
| 1 | **Las fichas de `/proyectos` están a medias.** Los cuatro proyectos ya tienen sector, resumen y captura; les falta año, reto, solución, capacidades y **métricas**. | Contenido tuyo | Lo que escribes tú: a qué se dedica, qué problema tenía, qué se construyó. Lo demás ya son comandos: `npm run medir` saca las métricas con su `measuredAt` y `npm run capturas` rehace las portadas. Todo el hueco está marcado con `TODO` en `src/data/projects.ts`. |
| 2 | **Dominio propio.** `.netlify.app` en la barra resta credibilidad a todo lo demás. | Compra tuya | Al comprarlo: apuntarlo en Netlify y cambiar `site` en `astro.config.mjs`. No hace falta volver a correr `npm run brand`, y el formulario ya no cambia de comportamiento al mudar de dominio. |
| 3 | **Comprobar que los envíos del formulario te están llegando.** El destino está declarado en `formDestination` (`src/data/site.ts`) y hoy vale `'netlify'`: los envíos caen en **Netlify Forms**, no en WhatsApp. | Comprobación tuya | En Netlify: Forms → que el formulario `contacto` aparezca en *Active forms*, y activar la notificación por correo. Haz un envío de prueba. Si prefieres que vuelva a WhatsApp, cambia el valor a `'whatsapp'`: arrastra solo el copy del botón y lo que declara `/privacidad`. |
| 4 | **Cero reversión de riesgo.** El cliente pone el 50 % por adelantado y asume el 100 % del riesgo. | Decisión tuya | La palabra «garantizado» aparece una vez en todo el sitio y es sobre PageSpeed ≥ 90: una especificación técnica, no una promesa comercial. Es normal en una agencia con portafolio; es letal en una sin él. Algo acotado que puedas cumplir: «si el primer diseño no te convence, devolvemos el adelanto». |
| 5 | **Analítica.** No hay ninguna. Sin datos, todo lo de este documento es criterio informado, no certeza. | Decisión tuya | Decidir **antes** de anunciar el sitio, no después. Las cuatro métricas que importan están al final. |
| 6 | **El envío del cotizador solo sale por WhatsApp.** En escritorio sin WhatsApp Web el flujo se corta. El formulario de `/contacto` ya no depende de eso (punto 3). | Decisión tuya + cuenta externa | Si eliges correo: cuenta en Formspree o Web3Forms, endpoint en el `action` del form, añadir el destino a `FormDestination` en `src/data/site.ts` y cambiar el envío del cotizador. |
| 7 | **Revisar el mapeo respuesta → plan del cotizador.** Los precios son tuyos, pero las reglas que deciden qué plan corresponde a cada respuesta son una propuesta, no una decisión tomada. | Validación tuya | Todo en `src/data/quote.ts`. No des por buena una cotización hasta revisarlo. Si el cotizador estima sistemáticamente por debajo de lo que acabas cobrando, estás generando expectativas que luego rompes. |

## P2 — Contenido que no se puede inventar

| # | Pendiente | Dónde tocar |
|---|---|---|
| 8 | **Bio real.** El bloque de quiénes están detrás vive en `/proceso` y está pendiente de contenido: historia, foto y credenciales. | `proceso.astro` tiene un comentario marcando el punto exacto. La foto va a `src/assets/` y se registra en `src/data/images.ts`. |
| 9 | **Prueba social de verdad.** `/proyectos` ya enseña cuatro sitios reales con captura y resumen — eso cerró el «cero enlaces a algo hecho por ti». Lo que sigue en cero: testimonios, nombres propios y **cifras medidas**. | La objeción real de tu comprador no es el precio, es «¿y este quién es?». Lo más barato que la responde hoy: el PageSpeed de estos cuatro proyectos, que es un comando (punto 1). |
| 10 | **`/blog`** — solo si van a existir posts reales. Cero blogs vacíos. | Contenido SEO local: «cuánto cuesta una página web en Panamá», comparativas, guías. |

## P3 — Ventas

| # | Pendiente | Nota |
|---|---|---|
| 11 | **El Diagnóstico de $49 está enterrado.** Es la única oferta de fricción baja del sitio: barata, concreta, y convierte a un desconocido en alguien que ya te pagó. Hoy vive como una banda debajo de la tabla de precios, sin página propia y compitiendo con cuatro planes de $295 a $1 200 que la aplastan. | Darle página propia y tratarla como la puerta para tráfico frío, no como un extra. |
| 12 | **No hay captura para quien no está listo hoy.** Cero correo, cero lista, cero imán. La mayoría de quien entra a una web de agencia no compra en esa visita, y el sitio no tiene forma de quedarse con esa persona. | El imán ya está escrito en la home («te enviamos un reporte de velocidad de tu sitio actual») y **no está implementado**: falta el campo donde pegar la URL. Es además la entrada natural al Diagnóstico del punto 11. |
| 13 | **Los planes no se pueden comparar.** Cuatro listas distintas, sin filas comunes; `Commerce` dice «Todo lo de Corporate» y obliga a subir con la vista, leer otra tarjeta y recordar. | Una tabla comparativa con las mismas filas para los cuatro. Aburrida, sí: es el formato que la gente sabe leer cuando está decidiendo. |
| 14 | **Care está fuera del momento de venta.** Es el ingreso recurrente —lo único que hace que el negocio no dependa de vender un sitio nuevo cada mes— y aparece pasado el 70 % del scroll de `/planes`. Nunca se ofrece mientras la persona está decidiendo. | Que aparezca en el resultado del cotizador y en la propuesta, marcado por defecto. Un mantenimiento no se vende aparte: se adjunta. |
| 15 | **El argumento contra el WordPress barato está solo en la home**, no en `/planes`, que es donde se compara. Quien llega directo a tus precios lee $295 contra nada. | Una fila de comparación junto a la tabla de precios: qué te dan por $199 y qué te damos por $295. Con datos, no adjetivos. |
| 16 | **`/planes` tiene 13 acciones compitiendo** en el cuerpo de la página (medido 2026-08-03): 4 tarjetas de plan, 7 de capacidad y 2 botones. Cuando todo es prioritario, nada lo es. | Que las 7 tarjetas de capacidad no sean enlaces individuales, sino una lista con un solo CTA al cierre. |
| 17 | **Sin señal de progreso en páginas largas.** `/planes` mide 7 911 px en móvil y `/proceso` 6 713 px, con seis bloques distintos y sin índice, anclas ni indicador de sección. Quien busca «el precio del mantenimiento» scrollea a ciegas. | Barato: una fila de anclas bajo el titular (`Planes · Capacidades · Care · FAQ`). Caro: índice lateral pegajoso. |
| 18 | **El hero de la home no dice qué hace CuatroNodos hasta la bajada.** «Sitios que encienden. Código tuyo.» es memorable pero no informativo. | Apuesta consciente por el tono sobre la claridad: bien mientras el tráfico venga de referidos, revisable si llega tráfico frío de búsqueda. |

## P4 — Técnico, accesibilidad y marca

| # | Pendiente | Nota |
|---|---|---|
| 19 | **Prueba con lector de pantalla real** (NVDA / VoiceOver). | Lo auditado es estructura, no experiencia. Es el único hueco de accesibilidad que queda, y no se puede cerrar desde el repo. |
| 20 | **El `<select>` de `/contacto` usa `appearance:none`** con la flecha dibujada en `background-image`. | Funciona, pero en Windows con alto contraste la flecha puede desaparecer. Riesgo bajo; conviene saberlo. |
| 21 | **Medir el sitio en vivo.** LCP, INP y CLS reales sobre el CDN. | `npm run medir` ya lo hace para los proyectos publicados; falta apuntarlo también al propio sitio. |
| 22 | **Search Console.** | Sitemap y canonical ya se emiten bien y dicen lo mismo; falta darlos de alta y verificar. |
| 23 | **La marca es solo tipográfica.** El rayo del favicon no aparece en el nav, ni en el footer, ni en la imagen social. Tampoco hay versión sobre fondo claro para facturas o propuestas. | Todo el sistema asume fondo oscuro. |
| 24 | **URLs limpias sin `.html`** (`trailingSlash:'always'` + `format:'directory'`). | Cambiaría todas las rutas de `links.ts`. Hacerlo **antes** de que el sitio tenga enlaces externos apuntándole, no después. No corre prisa por coherencia —sitemap y canonical ya dicen lo mismo—: es cosmética de la barra de direcciones. |
| 25 | **El shader es un `requestAnimationFrame` permanente** mientras el hero está en pantalla. Es la única animación corriendo del sitio, y el mayor consumo de la home. | Ya se pausa fuera del viewport y no arranca con reduce-motion, que es lo correcto. Si algún día importa la batería, se puede bajar a 30 fps sin que se note. |

---

## Decisiones tomadas — no reabrir sin motivo nuevo

Esto no son pendientes: son cosas que se decidieron a propósito y que conviene
no deshacer por inercia.

- **Precios públicos.** Es la decisión estratégica más fuerte del sitio y la
  mayoría de la competencia no se atreve. Todo lo demás se apoya ahí.
- **El anclaje de `/planes` está bien ordenado.** Corporate ($850, «Recomendado»)
  primero y Start ($295) al final: el rango se lee de arriba abajo y $295
  aterriza como alivio, no como techo.
- **En el cotizador, el precio va ANTES de pedir los datos.** Es lo contrario de
  lo que hace casi todo el mundo, y es deliberado: pedir el correo para
  «revelar» el precio contradiría la promesa del resto del sitio.
- **El cotizador recomienda el plan más pequeño que cubre lo marcado**, y dice
  por qué. Recomendar de más se nota y quema la confianza que el resto
  construye.
- **Las imágenes van de fondo, nunca como pieza de producto.** Montadas como
  producto, el ojo iba primero a la foto y el titular quedaba de pie de imagen.
  Hoy el titular está 2× por encima del cuerpo en contraste efectivo, y ese
  salto es lo que fija el orden de lectura.
- **Sin librería de animación.** Aquí vivió GSAP + ScrollTrigger: 43 KB
  comprimidos, el 74 % de todo el JS del sitio, para poner un atributo cuando un
  elemento entraba en pantalla.
- **El bloque de cierre («¿Empezamos?») vive solo en `/proceso`.** Repetir la
  misma petición en cinco páginas la convierte en ruido.

---

## Qué medir en cuanto haya analítica

Sin datos, todo lo de arriba es criterio informado, no certeza. Los cuatro
números que de verdad deciden:

1. **Terminación del cotizador por paso.** Dónde se cae la gente dice qué
   pregunta está mal formulada.
2. **Vieron el precio → dejaron sus datos.** Valida o tumba la decisión de
   enseñar el precio primero.
3. **Cotizador vs. formulario directo**, en leads que acaban en venta. No en
   leads: en ventas.
4. **Plan estimado vs. plan vendido.** Si divergen, las reglas de `quote.ts`
   están mal calibradas (punto 7).

---

## Fuera del repo por seguridad

Estos archivos existen en el disco local del owner y están bloqueados por
`.gitignore`. **Nunca commitearlos.**

- Documentos de estrategia comercial y metodología interna
- Prompts de trabajo
- Instrucciones internas del asistente
- `node_modules/`, `dist/`, `.astro/` — artefactos de build
