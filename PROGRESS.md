# FLASK — Progreso y pendientes

> Documento vivo. Cualquier sesión que retome el proyecto debería leer esto primero.
> Última actualización: 2026-07-31

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
npm run preview   # sirve dist/ localmente
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
│   │   ├── SmoothScroll.astro     # Lenis global
│   │   └── Reveal.astro           # fade-up por scroll (CSS transitions)
│   ├── data/                      # UNICA fuente de verdad de contenido
│   │   ├── site.ts                # nombre, tagline, WhatsApp, horario
│   │   ├── plans.ts               # 4 planes + Diagnóstico + planOptions
│   │   ├── modules.ts             # 7 módulos
│   │   ├── care.ts                # 3 planes Care
│   │   ├── faq.ts                 # 5 preguntas
│   │   ├── services.ts            # 3 servicios + procesoSteps + navLinks
│   │   └── links.ts               # helper withBase() + routes.*
│   ├── pages/
│   │   ├── index.astro            # home aliviada (hero + previews + CTA)
│   │   ├── servicios.astro        # 3 escenas grandes (una por pilar)
│   │   ├── planes.astro           # planes + módulos + care + FAQ
│   │   ├── proceso.astro          # 3 escenas con número gigante
│   │   ├── sobre.astro            # manifiesto + bio pendiente
│   │   ├── contacto.astro         # form Netlify + panel WhatsApp
│   │   ├── gracias.astro          # post-envío (noindex)
│   │   └── 404.astro              # error (noindex)
│   ├── assets/
│   │   └── hero/hero-fallback.png # fallback del shader (Astro Image optimiza)
│   ├── scripts/
│   │   └── motion.ts              # registro GSAP + helpers reduce-motion
│   └── styles/
│       └── global.css             # tokens + estilos globales
├── public/
│   ├── robots.txt
│   └── images/README.md           # instrucciones para subir mockups
├── stitch_3d_web_creation_hero/   # IGNORADO por git — referencias visuales locales
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
7. **Un solo acento cromático:** naranja `--flash-orange #FF5100` para UI; rojo `--ember-red #FF1E1E` reservado al hero shader.
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

### Fase B parte 2 — Fixes y ajustes
- **Bug crítico de Reveal invisible corregido** (los `<script type="module">` son diferidos; `astro:page-load` se disparaba antes del listener → contenido en `opacity: 0` para siempre). Solución: bootstrap directo + CSS transitions puros + fallback triple.
- Shader del hero: menos animación autónoma (10× menos), más peso al mouse (5× más influencia + lerp 0.045)
- Navbar más ancho (min-width 760px), padding mayor, brand más prominente
- Cursor custom eliminado (era incómodo). Puntero nativo del sistema.

---

## Pendientes

### Fase C — Integrar imágenes de Stitch (siguiente sesión)

Las 9 imágenes cinemáticas están en `stitch_3d_web_creation_hero/` (ignoradas por git). Mapeo propuesto:

| Imagen (nombre parcial) | Destino |
|---|---|
| `an_expansive_...digital_architecture` | `/servicios` → Pilar 02 Seguridad |
| `a_close_up_...structured_code` | `/servicios` → Pilar 03 Entrega |
| `an_abstract_...digital_speed` | (ya usada como fallback del hero) |
| `a_futuristic_...web_grid` | `/sobre` → Manifiesto |
| `a_futuristic_..._interface_hand` | `/sobre` → "quién está detrás" |
| `cinematic_..._digital_flow` | `/proceso` → visual entre pasos |
| `a_cinematic_...start_web_design` | `/planes` → visual del plan Start |
| `a_professional_...corporate_web` | `/planes` → visual del plan Corporate |

Pasos:
1. Mover cada imagen a `src/assets/servicios/`, `src/assets/planes/`, etc.
2. Usar `<Image src={...} widths={[640,1280,1920]} format="webp">` de `astro:assets`
3. Reemplazar los `.visual-placeholder` de `/servicios` por las imágenes reales
4. Añadir mockups en `/planes` (Corporate, Start) y `/proceso` (flow)

### Fase D — Contenido pendiente del cliente

Bloqueado por contenido real. NO inventar (regla CLAUDE.md original).

- **`/sobre`** — bio real, foto profesional, credenciales técnicas. Hay un bloque marcado "Nota interna" en la página como recordatorio.
- **`/proyectos`** — 3 demos verticales en vivo (inmobiliaria, clínica, restaurante) con casos de estudio. Página aún no creada; cuando existan las demos se crea.
- **`/blog`** — solo si van a existir posts reales. Cero blogs vacíos.

### Fase E — Refinado técnico

- **Lighthouse pass** en el sitio en vivo → medir LCP real, INP, CLS, PageSpeed
- **Sitemap y canonical URLs** ya funcionan; verificar Search Console
- **JSON-LD** Organization schema ya emitido en home; añadir `Service` schema en `/planes`
- **Netlify Forms** activo en `/contacto` — necesita conectar el repo a Netlify si se opta por ese hosting (alt: mantener GitHub Pages y buscar otro endpoint para el form)
- **View Transitions** por elemento (persistir el nav entre navegaciones con `transition:persist`)
- **Preload de fuente crítica** (`<link rel="preload" as="font">` para el peso 600 usado en H1s)

### Fase F — Growth y SEO

- Meta OpenGraph con imagen social real (hoy solo texto)
- Favicon como PNG además del SVG data URI (compat vieja)
- Robots.txt: revisar cuándo activar/desactivar indexación de páginas concretas
- URLs limpias sin `.html` (Astro lo soporta con `trailingSlash: 'always'` + `format: 'directory'`) — decisión pendiente porque cambiaría los enlaces en el form Netlify

---

## Cosas que quedan afuera del repo público (por seguridad)

Estos archivos existen en tu disco local y están bloqueados por `.gitignore`:

- `PLANES PAGINAS WEBS.pdf` — documento de estrategia comercial interna
- `ZERA-DNA-MASTER.md` — metodología interna
- `SISTEMA-DE-PRODUCCION.md` — playbook interno
- `BIBLIOTECA-DE-PROMPTS.md` — prompts de trabajo (ventaja competitiva)
- `BRANDING.html` — mockup de referencia (Kontour Studios)
- `CLAUDE.md` — instrucciones internas para el asistente
- `stitch_3d_web_creation_hero/` — 12+ MB de referencias visuales de Stitch
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

**"El build falla por TypeScript"** → `tsconfig.json` extiende `astro/tsconfigs/strict`. Los data files tienen interfaces exportadas; respeta los tipos.
