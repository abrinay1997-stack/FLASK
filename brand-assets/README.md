# Assets fuente de marca

Aquí viven los **originales** del logo tal como los pasó el usuario. No los
sirve nadie: el `public/` que sí se sirve lleva las versiones procesadas
(`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`).

Se guardan para poder rehacer los assets del favicon si mañana cambia el
tratamiento (color, tamaño, formato). Como los archivos originales están
exportados con contornos casi invisibles, el `favicon.svg` actual es el
resultado de:

1. Rasterizar `logo-original.svg` a 2048×2048.
2. Invertir + umbral + dilatación para recuperar la silueta.
3. Vectorizar la silueta limpia con `potrace -s -t 40 -a 1 -O 0.2`.
4. Pintar de `#FF5100` y comprimir para el `<svg>` final.

Si llega el logo definitivo del diseñador —trazado limpio en Illustrator o
Figma con relleno sólido— se pisa `public/favicon.svg` directo y se regeneran
los dos PNG con `rsvg-convert` a 32 y 180 px.
