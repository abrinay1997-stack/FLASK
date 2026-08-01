# Imágenes de CuatroNodos

Esta carpeta se sirve como `/images/*` (tanto en dev como en producción con Netlify).

Ejemplo de uso desde un `.astro`:

```astro
<img src={`${import.meta.env.BASE_URL}images/hero-dashboard.webp`} alt="Panel de administración" />
```

## Formatos recomendados

- **Hero / imágenes grandes:** `.webp` a 1920×1080 (≤180 KB).
- **Mockups de proyectos:** `.webp` a 1600×1000 (≤120 KB).
- **Iconos / logos:** `.svg` (vectoriales, cero peso).
- **Favicon / OG:** los generamos aparte, no van aquí.

## Qué necesito de ti (por sesión)

### Fase B — Home cinemática
- `hero-mockup.webp` — mockup principal del hero. Puede ser: navegador con un sitio de cliente encima, dashboard, gráfica de PageSpeed. Formato apaisado.
- `argument-before.webp` + `argument-after.webp` — comparativa velocidad (opcional).

### Fase C — Páginas nuevas
- `servicios/velocidad.webp` — imagen ilustrativa de "velocidad" (gráfica, cronómetro, lo que tengas).
- `servicios/seguridad.webp`
- `servicios/entrega.webp`
- `proyectos/{slug}-cover.webp` y `proyectos/{slug}-detail-{1,2,3}.webp` para cada caso de estudio.
- `sobre/team.webp` (si aplica) — foto tuya o del equipo.

## Reglas

1. **Nombres en minúsculas con guiones**, cero espacios, cero acentos.
2. **Optimiza antes de subir**: usa [Squoosh.app](https://squoosh.app) para exportar `.webp` con calidad 75-85.
3. **Peso máximo por archivo: 200 KB.** Si algo pesa más, avísame y lo trabajamos.
4. **Alt text**: cuando me pases una imagen, dime en 1 frase qué muestra. Es lo que va como `alt=""` para accesibilidad y SEO.
