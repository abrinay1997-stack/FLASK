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
│   │   ├── DiagBand.astro
│   │   ├── HeroShader.astro       # fondo WebGL animado (mouse-reactivo)
│   │   ├── SceneBg.astro          # imagen a sangre como FONDO de sección + velo
│   │   ├── SmoothScroll.astro     # Lenis global
│   │   └── Reveal.astro           # fade-up por scroll (CSS transitions)
│   ├── data/                      # UNICA fuente de verdad de contenido
│   │   ├── site.ts                # nombre, tagline, WhatsApp, horario
│   │   ├── plans.ts               # 4 planes + Diagnóstico + planOptions
│   │   ├── modules.ts             # 7 módulos
│   │   ├── care.ts                # 3 planes Care
│   │   ├── faq.ts                 # 5 preguntas
│   │   ├── services.ts            # 3 servicios + procesoSteps + navLinks
│   │   ├── images.ts              # mapeo imagen ↔ sección + alt + encuadre
│   │   └── links.ts               # helper withBase() + routes.*
│   ├── pages/
│   │   ├── index.astro            # home aliviada (hero + previews + CTA)
│   │   ├── servicios.astro        # 3 escenas grandes (una por pilar)
│   │   ├── planes.astro           # precios → respaldo → vitrina → capacidades → care → FAQ
│   │   ├── proceso.astro          # banda a sangre + 3 escenas con número gigante
│   │   ├── sobre.astro            # manifiesto + "Hablas con quien programa" (bio pendiente)
│   │   ├── contacto.astro         # form → WhatsApp (o Netlify Forms) + panel lateral
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
├── scripts/
│   └── generate-brand-assets.mjs  # `npm run brand` → favicons + og.png
├── AUDITORIA.md                   # auditoría medida: jerarquía, a11y, conversión, animación, marca
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
3. **Un solo H1 por página** — respetado en las 8 páginas.
4. **Cero placeholders** en producción: nada de `#`, `lorem`, `G-XXXXXXXXXX`.
5. **Solo animar `transform` y `opacity`** — regla del CLAUDE.md original.
6. **Máx 2 secciones con `pin` por página**, ningún `pin` en móvil sin adaptar.
7. **Un solo acento cromático:** naranja `--flash-orange #FF5100` para UI **y para los acentos de texto**; rojo `--ember-red #FF1E1E` reservado a fondos (shader del hero, vetas de las imágenes). Verificado: el ember no aparece en ningún texto del sitio.
9. **Las imágenes van de fondo, nunca como pieza de producto.** Se montan con `<SceneBg>`: a sangre, apagadas y bajo un velo que abre carril al texto. Lo que brilla es el titular.
8. **`prefers-reduced-motion: reduce`** debe desactivar todas las animaciones. Ya implementado en Reveal, SmoothScroll, HeroShader.

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
- `<CineFrame>`: marco reutilizable con recorte, `ratio` distinto en desktop y móvil, baño de marca y zoom al hover
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

### Fase D — Contenido pendiente del cliente

Bloqueado por contenido real. NO inventar (regla CLAUDE.md original).

- **`/sobre`** — bio real, foto profesional y credenciales técnicas. El bloque "Detrás de FLASK"
  ya no muestra la nota interna: habla del estudio y de compromisos que ya están por escrito en
  `/planes` y `/proceso`. Cuando llegue la bio, sustituir el `<dl class="who-facts">` y añadir la
  foto en `src/assets/sobre/`. Hay un comentario en la página marcando el punto exacto.
- **`/proyectos`** — 3 demos verticales en vivo (inmobiliaria, clínica, restaurante) con casos de
  estudio. Página aún no creada; cuando existan las demos se crea.
- **`/blog`** — solo si van a existir posts reales. Cero blogs vacíos.

### Pendientes que salieron de la auditoría

Ordenados por impacto. El detalle y el porqué están en `AUDITORIA.md`.

1. **El formulario solo sale por WhatsApp.** Es el único punto donde se pierde un
   lead: quien esté en escritorio sin WhatsApp Web se queda a medias. Decidir si
   se añade un endpoint de correo (Formspree/Web3Forms) como vía principal.
2. **Cero prueba social en todo el sitio.** Ni testimonios, ni logos, ni casos.
   Contra WordPress barato la objeción real no es el precio, es "¿y este quién
   es?". Bloqueado por contenido del cliente.
3. **`/planes` tiene 16 CTA compitiendo.** Las tarjetas de capacidad no deberían
   ser enlaces individuales, sino una lista con un solo CTA al cierre del bloque.
4. **Sin señal de progreso en páginas largas** (`/planes` mide ~7000 px). Una
   fila de anclas bajo el titular lo resuelve barato.
5. **Sin probar con lector de pantalla real** (NVDA/VoiceOver). Lo auditado es
   estructura, no experiencia.
6. **La marca es solo tipográfica.** El rayo del favicon no aparece en el nav, ni
   en el footer, ni en la imagen social. Y no hay versión sobre fondo claro para
   facturas o propuestas en PDF.

### Fase G — Medición y decisiones abiertas

- **Lighthouse pass en el sitio en vivo** → LCP, INP y CLS reales. Es lo único que no se puede
  cerrar desde el repo: hay que medirlo en Pages con el CDN real.
- **Search Console** — sitemap y canonical ya se emiten bien; falta darlos de alta y verificar.
- **Analytics** — todavía no hay ninguno instalado. Decidir si va (y cuál) antes de anunciar el sitio.
- **URLs limpias sin `.html`** (`trailingSlash:'always'` + `format:'directory'`). Cambiaría todas
  las rutas de `links.ts`; hacerlo antes de que el sitio tenga enlaces externos apuntándole, no después.
- **Dominio propio** — al comprarlo: cambiar `site` en `astro.config.mjs`, borrar `base`, y volver a
  correr `npm run brand` no hace falta (los assets no llevan dominio dentro).

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

**"Toqué un `padding` en `global.css` y se rompió otra cosa"** → `.container` usa el shorthand `padding` y aparece dos veces (base y media query de 640 px). Cualquier otra regla con la misma especificidad que use `padding` sobre un `.container` va a perder por orden de aparición. Usa longhands (`padding-block`) y sube la especificidad, como hace `.hero .hero-inner`.
