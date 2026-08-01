# Stitch — Referencias visuales

Este directorio contiene el bundle generado por [Google Stitch](https://stitch.withgoogle.com/) al pedirle un diseño de agencia web cinemática con estética "Obsidian & Ember".

**No es código productivo.** Son referencias visuales y de código que el equipo puede consultar para:

1. Elegir imágenes de fondo para secciones
2. Copiar/adaptar snippets de código de referencia (con criterio)
3. Consultar el sistema de diseño Obsidian & Ember

Las imágenes ACTIVAS del sitio no se sirven desde aquí — se mueven a `src/assets/` y se importan con `<Image />` de `astro:assets` para que Astro las optimice a WebP responsive.

---

## Inventario

### Imágenes (9 × PNG, ~1-2 MB c/u)

| Carpeta (nombre parcial) | Contenido visual | Uso propuesto |
|---|---|---|
| `aesthetix_animated_hero_flow/` | **Screenshot completo** de una landing de agencia. Referencia macro. | No usar como imagen. Es la referencia global del proyecto. |
| `an_abstract_..._digital_speed/` | Formas rojas abstractas sobre negro, sensación de velocidad | **Ya en uso** como fallback del hero (`src/assets/hero/hero-fallback.png`) |
| `an_expansive_..._digital_architecture/` | Paisaje digital, líneas arquitectónicas | `/servicios` — Pilar 02 (Seguridad) |
| `a_close_up_..._structured_code/` | Macro de código estructurado, brillos rojos | `/servicios` — Pilar 03 (Entrega) |
| `a_futuristic_..._web_grid/` | Grid infinito, perspectiva futurista | `/sobre` — Manifiesto |
| `a_futuristic_..._interface_hand/` | Mano de humano estilizada tocando interfaz | `/sobre` — "quién está detrás" |
| `cinematic_..._digital_flow/` | Ribbons de energía, flow visual | `/proceso` — transición entre pasos |
| `a_cinematic_..._start_web_design/` | Visual del plan Start (elegante minimalista) | `/planes` — visual del plan Start |
| `a_professional_..._corporate_web/` | Visual del plan Corporate (formal, presencia) | `/planes` — visual del plan Corporate |

### Código de referencia

- **`aesthetix_animated_hero_flow/code.html`** (26 KB) — HTML completo generado por Stitch para el hero de Aesthetix. Referencia de composición y estructura.
- **`shader/code.html`** (5.5 KB) — Shader WebGL puro con simplex 2D noise. **Ya adaptado e integrado** en `src/components/HeroShader.astro` con colores del branding híbrido FLASK.

### Sistema de diseño

- **`obsidian_ember/DESIGN.md`** — sistema completo "Obsidian & Ember" generado por Stitch: paleta de colores, tipografía (Plus Jakarta Sans + Hanken Grotesk), spacing (grid de 4px, section gaps 160px), componentes, elevación y shape language. **FLASK adopta parcialmente este sistema:** mantenemos Archivo como tipografía y el naranja `#FF5100` como color de interfaz, pero incorporamos el rojo ember `#FF1E1E` como acento cinemático (usado en el hero shader y palabras destacadas del H1).

---

## Cómo usar una imagen de aquí en el sitio

**No la importes directamente desde `stitch_3d_web_creation_hero/`.** Astro Image API requiere que la imagen viva en `src/assets/`.

Pasos:

```bash
# 1. Copiar la imagen a src/assets/ con nombre limpio
cp "stitch_3d_web_creation_hero/an_expansive_..._digital_architecture/screen.png" src/assets/servicios/seguridad.png

# 2. En el componente Astro:
```

```astro
---
import { Image } from 'astro:assets';
import seguridadImg from '../assets/servicios/seguridad.png';
---
<Image
  src={seguridadImg}
  alt="Arquitectura digital que representa seguridad por diseño"
  widths={[640, 1280, 1920]}
  sizes="(max-width: 900px) 100vw, 50vw"
  format="webp"
  quality={75}
/>
```

Astro genera WebP responsive automáticamente (reduce 1.3 MB PNG → ~30-60 KB WebP por breakpoint).

**Regla:** al copiar una imagen, dale un nombre kebab-case sin acentos y en la subcarpeta correcta (`src/assets/servicios/`, `src/assets/planes/`, etc.).

---

## Peso y por qué SÍ está versionado

Total: ~13 MB. Está versionado a propósito para que cualquier desarrollador que clone el repo tenga las mismas referencias visuales, sin depender de un enlace externo que puede caducar. No afecta al build final (Astro solo bundlea las que se importan desde `src/`).

Si el peso empieza a ser problema (múltiples versiones de mockups, GIFs, etc.), considera:

1. Mover mockups históricos a una release de GitHub o rama separada
2. Usar Git LFS para binarios grandes
3. Mover a un bucket externo (S3, Cloudinary) con URLs versionadas
