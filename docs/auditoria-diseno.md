# Auditoría del sitio CuatroNodos

> **Foto de un momento, no el estado actual.** Este documento se dejó tal como
> se escribió. Parte de lo que señala ya está resuelto y parte sigue abierto;
> lo que sigue vivo está en [`ROADMAP.md`](../ROADMAP.md).
>
> Fecha: 2026-08-01 · Medida sobre el build de producción servido en local
> (`npm run build && npm run preview`), con Chromium headless a 1440×900 y 390×844.
>
> Todo número de este documento sale de una medición, no de una impresión. Los
> scripts que las producen están descritos al final; se pueden volver a correr
> cuando cambie el diseño.

---

## Resumen

| Área | Estado | Lo más importante |
|---|---|---|
| Jerarquía visual | ✅ Corregido | Las imágenes ya no compiten con el texto: pasan a fondo con velo |
| Accesibilidad | ✅ Corregido | 3 fallos reales encontrados y arreglados (táctil ×2, salto de encabezado) |
| Intuitividad | ⚠️ 1 pendiente | Falta una señal de "dónde estoy" al bajar en páginas largas |
| Conversión | ⚠️ 2 pendientes | El formulario abre WhatsApp sin avisar; `/planes` tiene 16 CTA compitiendo |
| Animaciones | ✅ Limpio | Un solo bucle infinito en todo el sitio, solo `transform` y `opacity` |
| Branding | ✅ Corregido | 4 colores de texto en todo el sitio, un único acento |

---

## 1. Jerarquía visual — el mapa de calor

**El problema que había.** Las imágenes de Stitch estaban montadas como piezas de
producto: un marco de 1:1 al lado del texto, con borde, radio y sombra. En una
composición así el ojo va primero a la foto (alto contraste, alta saturación,
forma cerrada) y el titular queda como pie de imagen. En `/servicios` eso
significaba que el primer punto de fijación de cada pilar era un cohete, no la
frase "Velocidad como servicio".

**Lo que se cambió.** Las nueve imágenes pasaron a fondo de sección, a sangre,
con opacidad entre 0.32 y 0.5 y un degradado que abre un carril de lectura del
lado donde vive el texto. El titular subió a 700 de peso y ganó `text-shadow`.

**Cómo queda medido.** Contraste real (color declarado del texto contra la
luminancia del fondo bajo él, medida sobre píxeles renderizados):

| Elemento | Tamaño | Contraste | Mínimo AA |
|---|---|---|---|
| Titular de pilar (`/servicios`) | 68 px / 700 | 19.6 : 1 | 3.0 |
| Titular de vitrina (`/planes`) | 80 px / 700 | 19.6 : 1 | 3.0 |
| Titular de manifiesto (`/sobre`) | 42 px / 600 | 19.6 : 1 | 3.0 |
| Cuerpo sobre imagen (todas) | 16–17 px / 300 | ~10.4 : 1 | 4.5 |
| Bajada del hero | 20 px / 300 | 10.5 : 1 | 4.5 |

El titular está 2× por encima del cuerpo en contraste efectivo. Ese salto es lo
que hace que el orden de lectura sea titular → bajada → cuerpo → imagen, y no al
revés.

**Nota metodológica honesta.** La primera pasada usaba percentiles (p95 como
texto, p05 como fondo) y daba 4.67 en un párrafo de `/sobre`. Era un artefacto:
en bloques de dos líneas hay tan pocos píxeles de glifo que el p95 cae sobre
antialiasing, no sobre el trazo. Repetida con el modelo correcto de WCAG —color
declarado contra la moda del histograma del fondo— ese mismo párrafo da 10.5 : 1.
No había defecto.

**Pendiente.** El hero de la home ocupa 100 vh y el primer contenido real
(servicios) queda entero por debajo. Es una decisión de diseño defendible en un
sitio de agencia, pero conviene mirarlo con datos reales de scroll cuando haya
analítica.

---

## 2. Accesibilidad

### Fallos encontrados y corregidos

**a) Áreas táctiles por debajo del mínimo.** WCAG 2.5.8 (AA) pide 24×24 px CSS.
A 390 px de ancho estaban por debajo:

| Elemento | Antes | Ahora |
|---|---|---|
| Marca `CuatroNodos.` del nav | 77 × **14** | 77 × 38 |
| Marca `CuatroNodos.` del footer | 77 × **14** | 77 × 38 |
| Teléfono del footer | 102 × **15** | 102 × 27 |
| WhatsApp del panel de `/contacto` | 132 × **20** | 132 × 28 |
| "Abrir chat en blanco" | 103 × **14** | 103 × 26 |

Tras el arreglo, el barrido de las 6 páginas a 390 px no encuentra ningún
objetivo interactivo por debajo de 24 px. El único elemento que sigue apareciendo
es el `input` del honeypot anti-spam, que está oculto a propósito y no es
alcanzable ni por puntero ni por teclado.

**b) Salto de nivel de encabezado en `/planes`.** La secuencia era
`h1 → h3 → h2…`: el `h3` del bloque "Diagnóstico CuatroNodos" venía justo detrás del
`h1`. Un lector de pantalla que navega por encabezados percibe ahí un nivel que
no existe. Corregido a `h2`. Las 6 páginas quedan sin saltos.

**c) Faltaba salto al contenido.** Añadido `Saltar al contenido` + `<main id="contenido">`
(ya estaba de la tanda anterior; se verifica aquí).

### Lo que ya estaba bien

- **0 imágenes sin `alt`** en las 6 páginas. Las decorativas (fondos de escena,
  shader) van con `alt=""` y `aria-hidden`, que es lo correcto: no se anuncian.
- **Un solo `<h1>` y un solo `<main>`** por página, incluidas 404 y gracias.
- **`:focus-visible`** con contorno naranja de 2 px y `outline-offset` en todo el sitio.
- **`aria-current="page"`** correcto tras navegar con View Transitions.
- **`prefers-reduced-motion`**: con la preferencia activa el navegador reporta
  **0 animaciones** en la página. No es que se aceleren: no existen.

### Pendiente

- **Sin probar con lector de pantalla real** (NVDA/VoiceOver). Lo medido aquí es
  estructura, no experiencia. Es la única parte de accesibilidad que no se puede
  cerrar desde el repo.
- El `<select>` de `/contacto` usa `appearance:none` con la flecha dibujada en
  `background-image`. Funciona, pero en Windows con alto contraste la flecha
  puede desaparecer. Bajo, pero conviene saberlo.

---

## 3. Intuitividad

### Lo que funciona

- **Nav persistente con estado.** El enlace de la página actual va marcado y el
  nav sobrevive a la navegación sin reconstruirse.
- **La rejilla de tres zonas** (marca · enlaces · CTA) es el patrón que la gente
  ya sabe leer. Los enlaces caen exactamente sobre el eje del viewport (medido:
  centro del bloque = 720 px en un viewport de 1440).
- **El encogido al hacer scroll** tiene histéresis (encoge a 40 px, vuelve a 12 px),
  así que no parpadea cuando el scroll se queda oscilando en el umbral.
- **`/planes` ahora abre con precios.** Quien entra a una página llamada "Planes"
  va a ver precios; el argumento de venta pasó a respaldarlos, no a retrasarlos.

### Pendiente

- **No hay señal de progreso en páginas largas.** `/planes` mide ~7000 px de alto
  con seis bloques distintos (planes, respaldo, dos escenas, capacidades, care,
  FAQ). No hay índice, ni anclas visibles, ni indicador de sección. Quien busca
  "el precio del mantenimiento" tiene que scrollear a ciegas. La solución barata
  es una fila de anclas bajo el titular (`Planes · Capacidades · Care · FAQ`);
  la cara, un índice lateral pegajoso.
- **El hero de la home no dice qué hace CuatroNodos hasta la bajada.** "Sitios que
  encienden. Código tuyo." es memorable pero no informativo; el descriptor
  ("Agencia web · Panamá") se quitó a petición. Es una apuesta consciente por el
  tono sobre la claridad — bien mientras el tráfico venga de referidos, revisable
  si algún día llega tráfico frío de búsqueda.

---

## 4. Conversión

### Medido

| Página | CTA visibles sin scroll (escritorio / móvil) | CTA totales |
|---|---|---|
| index | 4 / 3 | 6 |
| servicios | 2 / 1 | 4 |
| planes | 2 / 2 | 16 |
| proceso | 2 / 1 | 3 |
| sobre | 2 / 1 | 4 |
| contacto | 2 / 1 | 2 |

Ninguna página deja al usuario sin salida: el "Cotizar" del nav está siempre
presente, incluso en móvil.

### Pendiente — por orden de impacto

**a) El formulario abre WhatsApp sin previo aviso suficiente.** Hoy el botón dice
"Enviar por WhatsApp" y el texto de apoyo lo explica, pero el salto a otra app
sigue siendo un momento de fricción alto: si la persona está en escritorio sin
WhatsApp Web abierto, el flujo se corta. **Recomendación:** ofrecer también un
correo real como alternativa visible, o mover el formulario a un endpoint que
envíe por correo (Formspree/Web3Forms) y dejar WhatsApp como segunda vía. Es la
decisión pendiente más cara del sitio: es el único punto donde se pierde un lead.

**b) `/planes` tiene 16 CTA compitiendo.** Cuatro tarjetas de plan, dos escenas de
vitrina, siete tarjetas de capacidad, el diagnóstico y el CTA final. Cuando todo
es prioritario, nada lo es. **Recomendación:** que las tarjetas de capacidad no
sean enlaces individuales sino una lista con un solo CTA al final del bloque.

**c) No hay prueba social en ninguna parte.** Cero testimonios, cero logos de
clientes, cero casos. Para una agencia nueva vendiendo contra WordPress barato,
la objeción real no es el precio, es "¿y este quién es?". Está bloqueado por
contenido tuyo, pero es lo que más movería la aguja.

**d) El precio ancla está bien puesto.** Corporate ($850, marcado "Recomendado")
va primero y Start ($295) al final: es la ordenación correcta para que el rango
se lea desde arriba. Nada que cambiar.

---

## 5. Animaciones

**Inventario completo** (`document.getAnimations()`, que sí incluye pseudoelementos):

| Página | Animaciones declaradas | Corriendo tras estabilizar | Bucles infinitos |
|---|---|---|---|
| index | 14 | 1 | 1 — la flecha de "Scroll", 2200 ms |
| planes | 27 | 0 | 0 |

**Propiedades animadas en todo el sitio: `transform` y `opacity`. Nada más.**
Eso es lo que mantiene las animaciones fuera del hilo de layout y evita repintados.
Se cumple la regla del proyecto sin excepciones.

**Con `prefers-reduced-motion: reduce` el navegador reporta 0 animaciones**, en
las dos páginas medidas. Los 16 `<Reveal>` de la home quedan visibles (opacidad 1),
no ocultos — que es el fallo clásico de este patrón y aquí no ocurre.

**Cambios de esta tanda:**

- **El destello del cohete al cargar** era un bug real: la imagen de respaldo del
  hero arrancaba con `opacity: .85` y solo se ocultaba cuando el JS confirmaba
  WebGL. Ahora arranca invisible y solo aparece si de verdad no va a haber shader
  (sin WebGL o con reduce-motion). De paso pasó a `loading="lazy"`: en el caso
  normal ya ni se descarga.
- **El seguimiento del cursor** bajó de lerp 0.045 a 0.018. El fondo persigue al
  ratón con más retardo y sin tirones al mover rápido.
- **La lava bajó de intensidad**: las vetas de 0.85 a 0.52, el brillo de 0.32 a
  0.14, y un factor global de 0.62 sobre el color final. El elemento más brillante
  del hero es ahora el titular.

**Pendiente.** El shader es un bucle `requestAnimationFrame` permanente mientras
el hero está en pantalla. Ya se pausa al salir del viewport y no arranca con
reduce-motion, que es lo correcto, pero en un portátil con batería sigue siendo el
mayor consumo de la página. Si algún día importa, se puede bajar a 30 fps sin que
se note.

---

## 6. Branding

**Paleta de texto realmente usada en las 6 páginas** (recuento de elementos):

| Uso | Color | Veces |
|---|---|---|
| Texto principal | `--soft-white` `#FFF7F7` | 165 |
| Texto secundario | `--studio-gray` `#BABABA` | 120 |
| Acento | `--flash-orange` `#FF5100` | 69 |
| Texto sobre botón claro | `--deep-black` `#100101` | 24 |

**Cuatro colores. Un solo acento.** La regla del proyecto ("un único acento
cromático") se cumple ahora de verdad: `--ember-red` **no aparece en ningún texto**
del sitio. Quedó donde debe estar, que es el fondo — el shader del hero y las
vetas de las imágenes.

**Lo que se corrigió.** El titular del hero usaba `--ember-red` en "encienden" y
"tuyo", el mismo rojo que la lava de detrás. Dos rojos casi iguales, uno encima
del otro, aplanan la escena entera: el acento dejaba de leerse como acento.
Ahora esas palabras van en naranja de marca con un halo suave. El contraste entre
el naranja del texto y el rojo del fondo es lo que hace que la palabra salte.

**Lo que sostiene la marca.**

- Una sola tipografía (Archivo) en cinco pesos. Los titulares viven en 600–700 y
  el cuerpo en 300, y ese salto de peso hace casi todo el trabajo de jerarquía.
- Geometría consistente: radio 999 px en píldoras, 16–24 px en tarjetas y marcos.
- El sistema "Obsidian & Ember" se aplica con criterio: negro obsidiana de base,
  naranja para interfaz, rojo ember solo para atmósfera.

**Pendiente.**

- **La marca es solo tipográfica.** `CuatroNodos.` con el punto naranja funciona, pero
  no hay símbolo que sobreviva fuera del sitio. El rayo generado para el favicon
  es el candidato natural, pero hoy solo existe en el icono; no aparece en el nav,
  ni en el footer, ni en la imagen social.
- **Sin definición de marca en claro.** Todo el sistema asume fondo oscuro. El día
  que haga falta una factura, una propuesta en PDF o un perfil en un directorio,
  no hay versión que funcione sobre blanco.

---

## Cómo reproducir estas mediciones

Los scripts viven fuera del repo (son herramientas de auditoría, no de build).
Con el sitio servido en `http://localhost:4321` mediante
`npm run build && npm run preview`, cada bloque se mide así:

- **Contraste:** captura del recorte de cada elemento de texto → histograma de
  luminancia → la moda es el fondo → contraste WCAG contra el color declarado.
  Es la única forma honesta de medir texto sobre imagen: el color CSS del fondo
  no dice nada de lo que hay realmente detrás.
- **Áreas táctiles:** `getBoundingClientRect()` de todo `a[href]`, `button`,
  `summary`, `input`, `select`, `textarea` a 390 px de ancho.
- **Encabezados:** secuencia de niveles `h1..h6` en orden de documento, buscando
  saltos mayores a 1.
- **Animaciones:** `document.getAnimations()` con y sin `reducedMotion: 'reduce'`
  en el contexto del navegador.
- **Paleta:** recuento de `getComputedStyle(el).color` sobre todos los elementos
  con texto, agregado por las 6 páginas.
