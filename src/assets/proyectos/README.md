# Capturas de los proyectos

Aquí va la portada de cada sitio publicado. Es lo que enseña la tarjeta en
`/proyectos`; sin ella la tarjeta cae a un tratamiento tipográfico que ya se ve
intencionado, así que **más vale ninguna captura que una mala**.

Este archivo existe para que la carpeta exista. Se puede borrar el día que haya
capturas dentro.

## Cómo se generan

```bash
npm run capturas                    # los cuatro proyectos
npm run capturas -- livesync-pro    # rehacer solo uno
```

El script abre cada sitio de `src/data/projects.ts` y deja aquí su portada. Al
terminar imprime los imports listos para pegar. Necesita Playwright, que no es
dependencia del proyecto (ver el README de la raíz).

También valen capturas hechas a mano, respetando el formato de abajo.

## El formato

| Archivo | Sitio |
|---|---|
| `bukoflow-play.jpg` | play.bukoflow.com |
| `livesync-pro.jpg` | livesyncpro.com |
| `acustica-superior.jpg` | acusticasuperior.com |
| `bukoflow-tienda.jpg` | tienda.bukoflow.com |

1. **El nombre es el `slug` de la ficha en `projects.ts`.** Es lo único que ata
   la imagen a su proyecto.
2. **JPEG, 1440 px de ancho, solo la portada** — no la página entera: una
   captura de scroll completo sale como una cinta que no se parece a una
   portada.
3. **No optimizar ni recortar antes de subir.** `astro:assets` las convierte a
   WebP en tres tamaños al construir; la tarjeta nunca sirve este archivo tal
   cual. PNG también funciona, pero entonces hay que cambiar la extensión del
   import.

## Después de subirla

Dos líneas en `src/data/projects.ts` — el script no las escribe a propósito, que
una captura exista no significa que valga:

```ts
import bukoflowPlay from '../assets/proyectos/bukoflow-play.jpg';

// …y dentro de la ficha correspondiente:
image: bukoflowPlay,
```

**Mírala antes.** El script no distingue una portada de un aviso de cookies
tapándola, de un pop-up de descuento o de un "sitio en mantenimiento". Publicar
una captura sin verla es el mismo dato sin verificar que el resto del repo se
niega a publicar.
