# FLASK — Progreso y pendientes

> Documento vivo. Cualquier sesión que retome el proyecto debería leer esto primero.
> Última actualización: 2026-08-01

---

## Stack

- **Astro 7.1** — output HTML estático puro, TypeScript strict
- **@fontsource/archivo** — fuente self-hosted (adiós Google Fonts)
- **@astrojs/sitemap** — genera `sitemap-index.xml` automático
- **GSAP + ScrollTrigger + Lenis + split-type** — motion (bundle ~52 KB gz)
- **WebGL nativo** — shader del hero, sin librerías 3D
- Deploy: **GitHub Actions → GitHub Pages** (workflow en `.github/workflows/deploy.yml`)
- Repo público: `github.com/abrinay1997-stack/FLASK`
- Sitio en vivo: `https://abrinay1997-stack.github.io/FLASK/`

## Comandos

```bash
npm run dev       # dev server en http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente (ojo: la URL lleva /FLASK)
npm run check     # astro check — tipos de TS + diagnósticos de .astro
npm run brand     # regenera favicons + og.png en public/ (solo al cambiar branding)
```

El chat necesita Netlify (funciones). En GitHub Pages el widget lo detecta y
degrada a WhatsApp — ver `CHATBOT.md`.

Deploy automático: `git push origin main` → GitHub Actions build → Pages en ~90s.

---

## Estructura

```
FLASK/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # meta + nav + footer + <slot/>
│   ├── components/
│   │   ├── Nav.astro              # pill flotante centrada
│   │   ├── Footer.astro
│   │   ├── PlanCard.astro
│   │   ├── ModuleCard.astro
│   │   ├── CareCard.astro
│   │   ├── HeroShader.astro       # fondo WebGL animado (mouse-reactivo)
│   │   ├── SceneBg.astro          # imagen a sangre como FONDO de sección + velo
│   │   ├── ChatWidget.astro       # burbuja de chat (degrada a WhatsApp sin backend)
│   │   ├── SmoothScroll.astro     # Lenis global
│   │   └── Reveal.astro           # fade-up por scroll (CSS transitions)
│   ├── data/                      # UNICA fuente de verdad de contenido
│   │   ├── site.ts                # nombre, tagline, WhatsApp, horario
│   │   ├── plans.ts               # 4 planes + Diagnóstico + planOptions
│   │   ├── modules.ts             # 7 capacidades avanzadas
│   │   ├── care.ts                # 3 planes Care
│   │   ├── faq.ts                 # 20 preguntas en 4 grupos (centro de ayuda)
│   │   ├── services.ts            # 3 servicios + procesoSteps + navLinks
│   │   ├── images.ts              # mapeo imagen ↔ sección + alt + encuadre
│   │   ├── quote.ts               # motor del cotizador (compone precios, no los inventa)
│   │   ├── footer.ts              # columnas, redes y garantías del pie
│   │   └── links.ts               # helper withBase() + routes.*
│   ├── pages/
│   │   ├── index.astro            # hero + previews + cita
│   │   ├── servicios.astro        # Care + Diagnóstico primero, luego los 3 pilares
│   │   ├── planes.astro           # precios → respaldo → vitrina → capacidades
│   │   ├── proceso.astro          # proceso + manifiesto + quiénes (fusionó la antigua /sobre)
│   │   ├── ayuda.astro            # centro de ayuda: 20 preguntas agrupadas por momento
│   │   ├── cotizador.astro        # 4 preguntas → precio → datos. Destino del CTA del nav
│   │   ├── contacto.astro         # WhatsApp destacado + formulario sobre imagen de fondo
│   │   ├── privacidad.astro       # política de privacidad
│   │   ├── terminos.astro         # términos del servicio
│   │   ├── kb.json.ts             # base de conocimiento del chat, generada en el build
│   │   ├── gracias.astro          # post-envío (noindex)
│   │   └── 404.astro              # error (noindex)
│   ├── assets/                    # imágenes que Astro optimiza a WebP responsive
│   │   ├── hero/hero-fallback.png # fallback del shader
│   │   ├── servicios/             # velocidad · seguridad · entrega
│   │   ├── sobre/                 # web-grid · interfaz
│   │   ├── proceso/flujo.png
│   │   └── planes/                # start · corporate
│   ├── scripts/
│   │   └── motion.ts              # registro GSAP + helpers reduce-motion
│   └── styles/
│       └── global.css             # tokens + estilos globales
├── public/
│   ├── robots.txt
│   ├── favicon.svg                # generados por `npm run brand` — no editar a mano
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── og.png                     # 1200×630, imagen social
│   └── images/README.md           # instrucciones para subir mockups
├── netlify/functions/
│   ├── chat.mts                   # endpoint /api/chat (claves solo en servidor)
│   └── _retrieval.mts             # recuperación léxica + barandilla de precios
├── scripts/
│   └── generate-brand-assets.mjs  # `npm run brand` → favicons + og.png
├── AUDITORIA.md                   # auditoría medida: jerarquía, a11y, intuitividad, animación, marca
├── AUDITORIA-CONVERSION.md        # auditoría de venta + diseño del cotizador
├── CHATBOT.md                     # arquitectura del chat y puesta en marcha
├── stitch_3d_web_creation_hero/   # VERSIONADO — referencias visuales del equipo (ver su README)
├── .github/workflows/deploy.yml   # deploy a Pages
├── astro.config.mjs               # site + base + sitemap + compressHTML
├── netlify.toml                   # alt deploy (Netlify) — headers de seguridad
└── PROGRESS.md                    # este archivo
```

---

## Convenciones no negociables

1. **Rutas internas: nunca hardcodear `href="/..."`.** Usar `routes.*` o `withBase('...')` de `src/data/links.ts`. GitHub Pages sirve bajo `/FLASK/`; hardcodear rompe todo.
2. **Datos siempre en `src/data/*.ts`.** Cambiar el precio de un plan = 1 sola edición. Cero copy-paste entre páginas.
3. **Un solo H1 por página** — respetado en las 11 páginas (verificado en las pruebas e2e).
4. **Cero placeholders** en producción: nada de `#`, `lorem`, `G-XXXXXXXXXX`.
5. **Solo animar `transform` y `opacity`** — regla del CLAUDE.md original.
6. **Máx 2 secciones con `pin` por página**, ningún `pin` en móvil sin adaptar.
7. **Un solo acento cromático:** naranja `--flash-orange #FF5100` para UI **y para los acentos de texto**; rojo `--ember-red #FF1E1E` reservado a fondos (shader del hero, vetas de las imágenes). Verificado: el ember no aparece en ningún texto del sitio.
8. **`prefers-reduced-motion: reduce`** debe desactivar todas las animaciones. Ya implementado en Reveal, SmoothScroll, HeroShader.
9. **Las imágenes van de fondo, nunca como pieza de producto.** Se montan con `<SceneBg>`: a sangre, apagadas y bajo un velo que abre carril al texto. Lo que brilla es el titular.
10. **Nada duplica los precios.** El cotizador (`quote.ts`) y la base del chat (`kb.json.ts`) los componen de `plans.ts` y `modules.ts`. Un cotizador o un bot que digan un número distinto al de `/planes` destruyen justo la confianza que el sitio vende.
11. **Estilos para nodos creados por JS: siempre `:global()`** colgando de un ancestro que sí esté en la plantilla. Ha mordido tres veces (raíces de componente, filas del cotizador, burbujas del chat).
12. **Cero jerga en el copy de cara al cliente.** Nada de Supabase, Railway, Next.js, Jamstack, CDN, LCP ni "scope creep". Solo se permiten los nombres que el cliente ya reconoce: WordPress, Google, WhatsApp, GitHub, Yappy. Si una frase solo la entiende un programador, está mal escrita para esta página. Verificado: `grep` de esos términos sobre `dist/*.html` da cero.
13. **El bloque de cierre ("¿Empezamos?") vive SOLO en /proceso.** Estaba repetido en cinco páginas con cinco titulares distintos que pedían lo mismo; repetir la misma petición cinco veces la convierte en ruido. La salida en el resto de páginas la dan el CTA del nav y el del footer.
14. **El cotizador no tiene precios propios.** `src/data/quote.ts` los compone de `plans.ts` y `modules.ts`. Un cotizador que diga un número distinto al de `/planes` destruye justo la confianza que el sitio vende.

---

## Fases completadas

### Fase 0 — Landing HTML plana
Sitio inicial en HTML puro. Deprecado.

### Fase A — Infraestructura de motion
- GSAP + ScrollTrigger + Lenis + split-type integrados
- View Transitions API (`<ClientRouter />`) para navegación fluida entre páginas
- Componente `<Reveal>` reutilizable
- Componente `<SmoothScroll>` global
- `public/images/README.md` con formato requerido

### Fase B parte 1 — Migración a multipágina
- Astro + TypeScript strict
- Refactor de landing monolítica a 7 páginas dedicadas
- Nav flotante tipo pill (brand + links + CTA "Cotizar")
- Datos centralizados en `src/data/*.ts`
- Hero cinemático con shader WebGL (fondo animado, mouse-reactivo)
- Imagen fallback optimizada por Astro Image API (1.3 MB PNG → 20-57 KB WebP responsive)
- Deploy en GitHub Pages via Actions

### Fase C — Imágenes cinemáticas integradas ✅
- Las 8 imágenes utilizables de Stitch copiadas a `src/assets/<página>/` con nombre kebab-case
- `src/data/images.ts` como único mapeo imagen ↔ sección, con `alt` y `object-position` por imagen
- Marco reutilizable con recorte y baño de marca (`<CineFrame>`, **sustituido después por `<SceneBg>` en la fase H**)
- `/servicios`: los tres `.visual-placeholder` reemplazados por las imágenes reales
- `/sobre`: banda del manifiesto + visual en "Detrás de FLASK"
- `/proceso`: banda 21:8 entre el hero y los pasos
- `/planes`: vitrina Start / Corporate con enlace directo a `?plan=<slug>`
- Coste real: PNG de 1.0–1.4 MB → WebP responsive de 5–83 kB

### Fase E/F — Refinado técnico y social ✅
- **Imagen social real** (`public/og.png`, 1200×630) + favicon SVG, PNG 32 y apple-touch-icon,
  generados por `npm run brand` desde `scripts/generate-brand-assets.mjs`
- **JSON-LD**: `Organization` en la home, `Service` (catálogo con los 5 precios) y `FAQPage` en `/planes`
- **Preload** de Archivo 600 y 700 (los pesos de los H1/H2 above-the-fold)
- **`transition:persist` en el nav**, con `aria-current` re-sincronizado por JS tras cada navegación
  y guard `dataset.bound` para no duplicar listeners
- **Skip link** "Saltar al contenido" + `<main id="contenido">` en el layout
- `npm run check` (astro check) en verde: 0 errores

### Fase K — Reestructura de arquitectura y copy ✅

**Copy sin jerga.** Se reescribieron `modules.ts`, `plans.ts`, `care.ts` y
`services.ts` para hablar de lo que el cliente consigue, no de con qué se
construye. "Supabase Auth + RLS" pasó a "Cada persona entra con su clave y ve
solo lo que le corresponde". El hero, la cita de la home y el hero de /proceso
("scope creep") se reescribieron al dolor concreto.

**Mapa del sitio.**
- `/sobre` desaparece: su manifiesto y su bloque de "quiénes" se fusionan en
  `/proceso`. Eran la misma conversación partida en dos.
- Nace `/ayuda`: centro de ayuda con 20 preguntas agrupadas por el momento en que
  surge la duda (antes de empezar / precio / durante / después), no por categoría
  interna. Antes eran 5 preguntas al final de `/planes`, donde solo las leía
  quien ya estaba decidido.
- `/servicios` abre con Care y con el Diagnóstico, igual que `/planes` abre con
  precios. Los tres pilares pasan detrás: son el porqué, y el porqué se lee
  después de lo que se compra.
- `/contacto` rediseñada: WhatsApp con peso de tarjeta arriba, formulario sobre
  imagen de fondo.

**Nav** con "Inicio" explícito (el logo no basta para quien no da por hecho que
lleva al inicio) y barra ensanchada a 1180 px para las 6 entradas.

**Chat**: longitud de respuesta ajustada a estándar de soporte — 2 a 4 frases,
40–70 palabras, con recorte duro a 600 caracteres por si el modelo se desborda.

**Auditoría móvil** en 320/390/414/768 px: cero desbordes horizontales, cero
áreas táctiles bajo 24 px, cero prosa por debajo de 13 px y el menú desplegado
cabe en un iPhone SE. Se corrigieron dos hallazgos reales: el H2 "¿Empezamos?" se
salía de su caja a 320 px, y la burbuja del chat tapaba los enlaces legales del
footer.

### Fase J — Chat, footer, legales y hero móvil ✅

**Chat con IA** (ver `CHATBOT.md` para el detalle). Premisa: el modelo es la
parte menos fiable, así que se le da el trabajo más pequeño posible. No busca,
no calcula y no recuerda; solo redacta.

- `src/pages/kb.json.ts` genera la base de conocimiento **en el build** desde los
  mismos datos que renderizan el sitio: 38 hechos, 13,5 kB, imposible que se
  desincronice de `/planes`.
- Recuperación léxica determinista (`_retrieval.mts`). Medido: **22/22 consultas
  recuperan el hecho correcto**, 21 en primera posición.
- **Barandilla de precios**: cualquier importe de la respuesta que no esté en la
  lista blanca del build bloquea la respuesta. No depende de que el modelo
  obedezca el prompt — es la única defensa que no puede fallar por el modelo.
- Claves solo en Netlify, nunca en el front. Sin clave configurada el endpoint no
  se cae: deriva a WhatsApp.
- Prompt medido: ~357 tokens de media, 574 en el peor caso.

**Cotizador: precio por opción y total en vivo.** Sin precios visibles se
comportaba como un carrito sin etiquetas — marcar salía gratis y el total
aparecía de golpe al final. Las capacidades se reetiquetan según el plan
alcanzado ("Incluido" en vez de un precio que no se va a cobrar).

**Hero en móvil.** Debajo de 900 px el shader ya no se inicializa: en vertical
calculaba el ruido sobre un lienzo de proporción ~0.5 y las vetas salían
estiradas. Manda la imagen de fondo. También se corrigió la proporción dentro del
shader, así que tampoco se deforma en ventanas altas de escritorio.

**Footer y legales.** Footer reescrito (4 columnas, garantías, redes, barra
inferior) con la estructura en `data/footer.ts`. Nuevas `/privacidad` y
`/terminos`, escritas sobre lo que el sitio hace de verdad.

**Bug de base corregido:** `[hidden]` no ganaba a `display:flex`, así que el
panel del chat estaba invisible pero interceptando clics. Añadido
`[hidden]{display:none !important}` al reset, que blinda el patrón en todo el sitio.

### Fase I — Cotizador y auditoría de conversión ✅

Ver `AUDITORIA-CONVERSION.md` para el razonamiento completo.

**`/cotizador`** — cuatro preguntas, precio al final, datos después.
- Los precios se **componen** de `plans.ts` y `modules.ts`; el cotizador no tiene
  tabla propia. Verificado en pruebas: el $850 del cotizador y el de `/planes` son
  el mismo dato.
- Recomienda el plan **más pequeño** que cubre lo marcado y dice por qué.
- Las capacidades ya incluidas salen como "Incluido" en vez de ocultarse.
- Los rangos se propagan honestos (IA $250–$900 sobre Start → "$545 – $1,195").
- El envío compone el resumen completo por WhatsApp: no se repite nada.
- **El CTA "Cotizar" del nav apunta aquí**, no al formulario. Es el cambio de mayor
  alcance: ese botón está en las 9 páginas.

**Por qué no un chatbot:** el sitio es estático (no hay dónde correrlo sin exponer
una clave o montar serverless), contradice el posicionamiento de "precio público,
cero consultar por interno", y un precio alucinado es un pasivo comercial. La tarea
es cerrada (~10 variables): el wizard gana; el chat gana en soporte, no en esto.

**Por qué el precio va antes de pedir datos:** pedir el correo para "revelar" el
precio contradiría toda la promesa del sitio. Enseñarlo primero convierte el
formulario final de peaje en paso obvio.

**Bug encontrado:** las filas del desglose las crea el script con `innerHTML`, así
que nacen sin el `data-astro-cid-*` de la página y los estilos con scope no las
alcanzaban. Resuelto con `.cot-lines :global(.cot-line)`. Es el mismo patrón que ya
mordió en la fase C con los componentes.

### Fase H — Rediseño de jerarquía y auditoría ✅

Ronda pedida por el cliente sobre el resultado de la Fase C. Ver `AUDITORIA.md`
para los números completos.

**Navbar**
- Rejilla de tres zonas (`1fr auto 1fr`): marca a la izquierda, enlaces centrados
  sobre el eje del viewport, CTA a la derecha. Con flex nunca quedaron centrados
  de verdad porque marca y CTA no miden lo mismo.
- Más ancho (980 px), más oscuro (`rgba(9,1,1,.88)`) y enlaces más juntos.
- Encoge al bajar (980×60 → 820×48) y vuelve al tope, con histéresis 40/12 px
  para que no parpadee en el umbral.

**Hero**
- **Bug del destello del cohete corregido**: la imagen de respaldo arrancaba
  visible y solo se ocultaba cuando el JS confirmaba WebGL. Ahora arranca
  invisible y solo entra si de verdad no habrá shader. Además pasó a `lazy`: en
  el caso normal ni se descarga.
- Seguimiento del cursor de lerp 0.045 → 0.018 (más pesado, sin tirones).
- Lava atenuada (vetas 0.85→0.52, brillo 0.32→0.14, factor global 0.62) para que
  el elemento más brillante sea el titular.
- Fuera el descriptor "Agencia web · Panamá"; los acentos del H1 pasan de
  `--ember-red` a `--flash-orange`.

**Imágenes como fondo** — nuevo `<SceneBg>` en `/servicios`, `/planes`, `/sobre`,
`/proceso` y la cita de la home (textura líquida).

**Contenido**
- `/planes` abre con los precios; "Cuatro planes. Cero letra chica." pasa debajo
  como respaldo, con tres garantías desarrolladas.
- Los "módulos" pasan a **capacidades avanzadas** ("¿Tu negocio necesita más?
  Súmale potencia"), con tarjetas rediseñadas.
- `/sobre` recortado a titular + una línea por punto.

**Bugs de maqueta encontrados midiendo**
1. **`.container` se encogía dentro de cualquier sección flex o grid**, y su
   `margin:0 auto` centraba el texto en vez de alinearlo al carril. Rompía la
   alternancia izquierda/derecha de las escenas. Corregido con `width:100%`.
2. **Áreas táctiles bajo el mínimo WCAG** (marca del nav y del footer a 14 px de
   alto, teléfono a 15, enlaces de `/contacto` a 14–20). Corregidas con padding
   vertical; el barrido a 390 px ya no encuentra ninguna por debajo de 24 px.
3. **Salto de encabezado `h1 → h3` en `/planes`** por el `h3` de `DiagBand`.

### Fase B parte 2 — Fixes y ajustes
- **Bug crítico de Reveal invisible corregido** (los `<script type="module">` son diferidos; `astro:page-load` se disparaba antes del listener → contenido en `opacity: 0` para siempre). Solución: bootstrap directo + CSS transitions puros + fallback triple.
- Shader del hero: menos animación autónoma (10× menos), más peso al mouse (5× más influencia + lerp 0.045)
- Navbar más ancho (min-width 760px), padding mayor, brand más prominente
- Cursor custom eliminado (era incómodo). Puntero nativo del sistema.

### Fase C parte 2 — Bugs de maqueta encontrados al integrar

Tres fallos silenciosos que llevaban tiempo en el código y no se veían hasta medirlos:

1. **La alternancia de `/servicios` no funcionaba.** `.service-grid.reverse .service-body{order:2}`
   apuntaba a un nieto: los hijos directos de la grid son los `<div>` que inyecta `<Reveal>`.
   Ahora el `order` va sobre `> :global(:first-child)` / `:last-child`.
2. **Las tarjetas de las grids no se estiraban.** Mismo origen: `<Reveal>` pasa a ser el item de la
   grid y la tarjeta ya no llega a la altura de la fila. Corregido en `global.css` con un bloque
   que estira el envoltorio y deja que la tarjeta lo llene.
3. **El H1 se metía debajo de `.year`/`.handle` en móvil** en las cinco páginas con `hero-short`.
   La regla móvil `.container{padding:0 22px}` (shorthand, misma especificidad, más abajo en el
   archivo) anulaba el `padding` vertical de `.hero-inner`. Ahora `.hero .hero-inner` usa
   `padding-block` y, bajo 640 px, las etiquetas fluyen sobre el H1 en vez de posicionarse absolutas.

**Lección para la próxima sesión:** un estilo con scope de página **no** alcanza la raíz de un
componente hijo — el `data-astro-cid-*` de la página no se propaga. Si hay que estilar la raíz de
un `<CineFrame>` o similar desde la página, usa `.ancestro :global(.clase)`.

---

## El formulario de contacto, explicado

Es el punto que más confusión ha generado, así que queda escrito:

**GitHub Pages sirve archivos estáticos. No hay nada que reciba un `POST`.** Netlify Forms
funciona porque Netlify intercepta el envío en su propio edge; en Pages ese `POST` no llega
a ningún sitio y el formulario queda muerto sin dar ningún error visible.

Solución actual en `src/pages/contacto.astro`: el `<form>` conserva los atributos
`data-netlify`, y además un script intercepta el `submit` **solo cuando el host no es Netlify**,
compone un mensaje con los campos y abre `wa.me` con el texto ya redactado.

- En GitHub Pages (hoy) → abre WhatsApp con el mensaje listo y redirige a `/gracias`.
- Si algún día se despliega en Netlify → el script se aparta y Netlify Forms recibe el `POST`.
- Si el navegador bloquea el pop-up → navega a `wa.me` en la misma pestaña.
- El honeypot `bot-field` se respeta en ambos caminos.

Si en el futuro se quiere recibir los envíos por **correo** en vez de WhatsApp, la vía limpia es
un endpoint externo (Formspree, Web3Forms): cambiar el `action` del form y quitar el interceptor.

---

## Pendientes

> Lista única y ordenada por impacto. Si retomas el proyecto, empieza por P1.
> El porqué de los puntos de auditoría está desarrollado en `AUDITORIA.md`.

### P1 — Bloquea vender de verdad

Los tres primeros salen de `AUDITORIA-CONVERSION.md` y están ordenados por dinero perdido.

| # | Pendiente | Quién lo desbloquea | Nota |
|---|---|---|---|
| 1 | **Cero prueba social.** 17 precios publicados y cero pruebas de que alguien haya pagado alguno. La objeción real no es el precio, es "¿y este quién es?". | Contenido tuyo | Lo mínimo hoy y sin cliente nuevo: el PageSpeed de **este** sitio, en grande, con enlace verificable a Google. Lo correcto: las 3 demos verticales en vivo. |
| 2 | **Cero reversión de riesgo.** "Garantizado" aparece 1 vez en todo el sitio y es sobre PageSpeed. El cliente pone el 50 % por adelantado y asume el 100 % del riesgo. | Decisión tuya | Algo acotado que puedas cumplir: "si el primer diseño no te convence, devolvemos el adelanto". En Jamstack productizado el coste real es bajo. |
| 3 | **Analítica.** No hay ninguna. Sin datos, todo lo de las auditorías es criterio informado, no certeza. | Decisión tuya | Decidir antes de anunciar el sitio, no después. Las 4 métricas que importan están al final de `AUDITORIA-CONVERSION.md`. |
| 4 | **El envío solo sale por WhatsApp** (formulario y cotizador). En escritorio sin WhatsApp Web el flujo se corta. | Decisión tuya + cuenta externa | Si eliges correo: cuenta en Formspree o Web3Forms, endpoint en el `action` de `contacto.astro`, borrar el interceptor `data-wa-fallback`, y cambiar el envío del cotizador. |
| 4b | **Migrar el deploy a Netlify.** El chat necesita funciones; en GitHub Pages el widget degrada a WhatsApp y nunca responde con IA. | Decisión tuya | `netlify.toml` ya está listo. Solo falta conectar el repo y poner `ANTHROPIC_API_KEY` o `GROQ_API_KEY` en el panel. Ver `CHATBOT.md`. |
| 5 | **Revisar el mapeo respuesta → plan del cotizador.** Los precios son tuyos, pero las reglas que deciden qué plan corresponde a cada respuesta son una propuesta mía. | Validación tuya | Todo en `src/data/quote.ts`. No des por buena una cotización hasta revisarlo. |

### P2 — Contenido tuyo que no se puede inventar

Regla del CLAUDE.md original: **no inventar contenido del cliente.**

| # | Pendiente | Dónde tocar |
|---|---|---|
| 6 | **Bio real de `/sobre`** — historia, foto profesional, credenciales. | Sustituir el bloque `.who-copy` de `sobre.astro`. Hay un comentario en la página marcando el punto exacto. La foto va a `src/assets/sobre/` y se registra en `src/data/images.ts`. |
| 7 | **`/proyectos`** — 3 demos verticales en vivo (inmobiliaria, clínica, restaurante). | Página aún no creada; se crea cuando existan las demos. Resuelve además el P1 #1. |
| 8 | **`/blog`** — solo si van a existir posts reales. Cero blogs vacíos. | — |

### P3 — Ventas: lo que queda por construir

Todo esto está argumentado en `AUDITORIA-CONVERSION.md`.

| # | Pendiente | Nota |
|---|---|---|
| 9 | **El Diagnóstico de $49 está enterrado.** Es la oferta de entrada de menor fricción y vive como una banda debajo de la tabla de precios. | Darle página propia y tratarla como la puerta para tráfico frío, con los planes reservados a quien ya sabe qué quiere. |
| 10 | **No hay captura para quien no está listo hoy.** Cero correo, cero lista, cero imán. | El imán ya está escrito en tu home ("te enviamos un reporte PageSpeed de tu sitio actual") y no está implementado: falta el campo donde pegar la URL. |
| 11 | **Los planes no se pueden comparar.** Cuatro listas distintas, sin filas comunes; `Commerce` dice "Todo lo de Corporate" y obliga a subir con la vista. | Una tabla comparativa con las mismas filas para los cuatro. |
| 12 | **Care ($35–$250/mes) está fuera del momento de venta.** Es el ingreso recurrente y aparece al 70 % del scroll de `/planes`. | Que aparezca en el resultado del cotizador y en la propuesta, marcado por defecto. |
| 13 | **El argumento contra el WordPress de $199 está solo en la home**, no en `/planes`, que es donde se compara. | Una fila de comparación junto a la tabla de precios, con datos. |
| 14 | **`/planes` tiene 16 CTA compitiendo.** | Las 7 tarjetas de capacidad no deberían ser enlaces individuales, sino una lista con un solo CTA al cierre. |
| 15 | **Sin señal de progreso en páginas largas** (`/planes` mide ~7000 px). | Barato: una fila de anclas bajo el titular. Caro: índice lateral pegajoso. |
| 16 | **El hero de la home no dice qué hace FLASK hasta la bajada.** | Apuesta consciente por tono sobre claridad. Revisable si llega tráfico frío de búsqueda. |

### P4 — Técnico y de marca

| # | Pendiente | Nota |
|---|---|---|
| 17 | **Lighthouse en el sitio en vivo** → LCP, INP y CLS reales. | Lo único que no se puede cerrar desde el repo: hay que medirlo en Pages con el CDN real. |
| 18 | **Search Console.** | Sitemap y canonical ya se emiten bien; falta darlos de alta y verificar. |
| 19 | **Prueba con lector de pantalla real** (NVDA/VoiceOver). | Lo auditado es estructura, no experiencia. Es el único hueco de accesibilidad que queda. |
| 20 | **La marca es solo tipográfica.** | El rayo del favicon no aparece en el nav, ni en el footer, ni en la imagen social. Tampoco hay versión sobre fondo claro para facturas o propuestas en PDF. |
| 21 | **URLs limpias sin `.html`** (`trailingSlash:'always'` + `format:'directory'`). | Cambiaría todas las rutas de `links.ts`. Hacerlo **antes** de que el sitio tenga enlaces externos apuntándole, no después. |
| 22 | **Dominio propio.** | Al comprarlo: cambiar `site` en `astro.config.mjs` y borrar `base`. No hace falta volver a correr `npm run brand` (los assets no llevan dominio dentro). |
| 23 | **El shader es un `requestAnimationFrame` permanente** mientras el hero está en pantalla. | Ya se pausa fuera del viewport y no arranca con reduce-motion. Si algún día importa la batería, se puede bajar a 30 fps sin que se note. |

---

## Cosas que quedan afuera del repo público (por seguridad)

Estos archivos existen en tu disco local y están bloqueados por `.gitignore`:

- `PLANES PAGINAS WEBS.pdf` — documento de estrategia comercial interna
- `ZERA-DNA-MASTER.md` — metodología interna
- `SISTEMA-DE-PRODUCCION.md` — playbook interno
- `BIBLIOTECA-DE-PROMPTS.md` — prompts de trabajo (ventaja competitiva)
- `BRANDING.html` — mockup de referencia (Kontour Studios)
- `CLAUDE.md` — instrucciones internas para el asistente
- `node_modules/`, `dist/`, `.astro/` — artefactos de build

**Nunca commitear estos.** El `.gitignore` los blinda.

---

## Contacto del proyecto

- WhatsApp del negocio: `+507 6227 2025` (ya integrado en `src/data/site.ts`)
- Correo del owner del repo: `abrinay1997@gmail.com`
- Repo: `https://github.com/abrinay1997-stack/FLASK`

---

## Troubleshooting rápido

**"Los reveals no muestran contenido"** → Verifica que Reveal.astro tenga el bootstrap `if (document.readyState !== 'loading') initReveals()` al final. Los `<script type="module">` son diferidos y `astro:page-load` se dispara antes; sin el bootstrap, el listener llega tarde.

**"El shader no aparece"** → Verifica que el navegador soporte WebGL (`chrome://gpu`). Si no, se muestra la imagen fallback automáticamente. Si tampoco, revisar console por errores.

**"Links a `/contacto.html` van al dominio raíz sin `/FLASK`"** → Alguien hardcodeó `href="/..."`. Usa `routes.contacto` o `withBase('contacto.html')` de `src/data/links.ts`.

**"Cambié un precio y no se actualiza en el formulario de contacto"** → Verifica que estés editando `src/data/plans.ts`. El `<select>` de `/contacto` se genera de `planOptions` que se construye de `plans`.

**"El build falla por TypeScript"** → `tsconfig.json` extiende `astro/tsconfigs/strict`. Los data files tienen interfaces exportadas; respeta los tipos. Ojo: `npm run build` **no** comprueba tipos — para eso está `npm run check`.

**"Puse un estilo en la página y no se aplica al componente"** → Los estilos con scope de Astro se compilan con el `data-astro-cid-*` de la página, y ese atributo **no** llega a la raíz de un componente hijo (`<CineFrame>`, `<Reveal>`, `<PlanCard>`…). Escribe `.ancestro :global(.clase)`, donde `.ancestro` sí sea un elemento de la página.

**"Cambié el `--ratio` de un CineFrame desde una media query y no pasa nada"** → `--ratio` se escribe inline en el `<figure>`, y lo inline gana a cualquier hoja de estilos. Usa la prop `ratioMobile`.

**"El formulario no envía nada"** → Es lo esperado en GitHub Pages: no hay backend. Ver la sección "El formulario de contacto, explicado" más arriba. El envío real hoy va por WhatsApp.

**"Cambié el logo / los colores y el favicon sigue igual"** → Los favicons y `og.png` son archivos generados, no se recalculan en el build. Corre `npm run brand` y commitea lo que cambie en `public/`.

**"El texto de una sección se me fue al centro en vez de al carril izquierdo"** → Esa sección es `display:flex` o `grid` y `.container` se convirtió en item. Ya está blindado con `width:100%` en `global.css`; si aparece otra vez, es que alguien lo quitó.

**"Puse `hidden` en un elemento y sigue ahí"** → Si el elemento tiene `display:flex` o `grid` propio, gana sobre el `display:none` del user agent. Ya está blindado con `[hidden]{display:none !important}` en `global.css`; si vuelve a pasar, alguien lo quitó.

**"Un `<section>` mío tiene un hueco enorme arriba y abajo"** → La regla global `section{padding:120px 0}` aplica a **todo** `<section>`, incluidos los que son chrome de interfaz (el panel del chat, por ejemplo). Ponle `padding:0` explícito.

**"El chat responde cosas raras o dice que no sabe algo que sí está"** → Mira primero `sources` en la respuesta del endpoint: casi siempre la recuperación trajo el hecho equivocado, y se arregla añadiendo frases de intención en `kb.json.ts`, no cambiando de modelo. Ver `CHATBOT.md`.

**"Toqué un `padding` en `global.css` y se rompió otra cosa"** → `.container` usa el shorthand `padding` y aparece dos veces (base y media query de 640 px). Cualquier otra regla con la misma especificidad que use `padding` sobre un `.container` va a perder por orden de aparición. Usa longhands (`padding-block`) y sube la especificidad, como hace `.hero .hero-inner`.
