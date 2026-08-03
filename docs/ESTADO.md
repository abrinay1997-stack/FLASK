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

**Dónde está el sitio hoy:** en beta. Publicado pero sin anunciar, sin dominio
propio y sin buscar clientes todavía. El dominio se compra cuando lo de abajo
esté hecho, no antes — y hay un punto (el 1) que **hay que hacer antes de
comprarlo** o se vuelve caro.

Cada pendiente lleva quién lo desbloquea:

| Marca | Significa |
|---|---|
| `[código]` | Se hace entero desde el repo. Cero dinero, cero cuentas nuevas |
| `[tuyo]` | Necesita contenido, una decisión o una gestión que solo puedes hacer tú |
| `[cuenta]` | Gratis en dinero, pero exige abrir una cuenta en un servicio externo |
| `[$]` | Cuesta dinero. Fuera de alcance mientras no haya presupuesto |

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
- **Datos estructurados ya emitidos:** `Organization` en todas las páginas
  (`BaseLayout`), `FAQPage` en `/ayuda`, `Service` + `Offer` en `/planes` y
  `CollectionPage` + `ItemList` en `/proyectos`.

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

# El plan hasta salir de beta

Ordenado por lo que de verdad mueve la aguja, no por lo que es fácil. El orden
de los bloques 1 a 5 es el orden de ejecución: el 1 tenía fecha límite y el 2
es el que decide si el sitio convence o no. El bloque 6 va aparte: no compite
con los otros, lo dispara la decisión de empezar a trabajar las redes.

## Bloque 1 — Antes de comprar el dominio

Hecho el 2026-08-03. El sitio ya sirve `/contacto/` en vez de `/contacto.html`,
con el canonical, el sitemap y `robots.txt` diciendo lo mismo.

**Queda una comprobación que solo se puede hacer en producción:** que el
formulario de `/contacto` siga apareciendo en *Netlify → Forms → Active forms*
después del primer despliegue con las rutas nuevas. Netlify detecta los
formularios leyendo el HTML publicado, y ese HTML ahora vive en
`contacto/index.html` en vez de `contacto.html`. En local el `<form>` conserva
`data-netlify`, el honeypot y el `action="/gracias/"`, así que no hay motivo
para que falle — pero es el punto 19 y conviene verificarlo antes que ningún
otro: si se rompe, se rompe en silencio y sin síntoma visible.

## Bloque 2 — Convertir promesa en prueba

Es el bloque que más pesa en la probabilidad de éxito, y casi todo es gratis.
Hoy el sitio afirma que es rápido y seguro, pero **no enseña una sola cifra
propia**. Todo lo de aquí convierte afirmación en evidencia.

| # | Pendiente | Quién |
|---|---|---|
| 2 | **Medir el propio sitio y publicarlo.** El sitio vende velocidad y no enseña la suya. Apuntar `npm run medir` a `cuatronodos.netlify.app` y poner la cifra donde se lee. Es autoevidencia y ya la tienes. | `[código]` |
| 3 | **Estructura de testimonios.** Hoy no existe ni el sitio donde ponerlos. Se puede dejar montado —tipo, componente, tarjeta— para que publicar uno sea añadir un objeto a un array. Los textos y los permisos son tuyos. | `[código]` + `[tuyo]` |
| 4 | **Quién está detrás.** El bloque vive en `/proceso` y está vacío. En un servicio de confianza el anonimato es una barrera de compra: la objeción real del comprador no es el precio, es «¿y este quién es?». | `[tuyo]` |
| 5 | **Qué significa «CuatroNodos».** El nombre no se explica en ninguna página. Es una línea de origen de marca y hoy es storytelling desaprovechado. | `[tuyo]` |
| 6 | **Reversión de riesgo.** La palabra «garantizado» aparece una vez en todo el sitio y es sobre PageSpeed ≥ 90: una especificación técnica, no una promesa comercial. Hoy el cliente pone el 50 % por adelantado y asume el 100 % del riesgo. Algo acotado y cumplible («si el primer diseño no te convence, devolvemos el adelanto») elimina de golpe la objeción más cara. | `[tuyo]` |
| 7 | **La estadística sin fuente.** «Cuatro de cada diez personas se van de una página que tarda más de tres segundos» (`services.ts`). No lleva fuente, y el sitio entero se vende sobre no publicar datos sin verificar. O se cita, o se suaviza. | `[código]` |
| 8 | **Datos legales visibles** (aviso de operación, RUC). Para un pago de $850–$1 200 por adelantado, la formalidad se lee como seguridad. | `[tuyo]` |
| 9 | **Fichas de `/proyectos` completas.** Ya tienen sector, resumen y captura; faltan año, reto, solución y capacidades. Marcado con `TODO` en `src/data/projects.ts`. Sin métricas: ver la decisión de abajo. | `[tuyo]` |

## Bloque 3 — Que quien llegue no se vaya

Todo esto es programable aquí y ninguna pieza necesita dinero.

| # | Pendiente | Quién |
|---|---|---|
| 10 | **Tabla comparativa de planes.** Cuatro listas distintas sin filas comunes; `Commerce` dice «Todo lo de Corporate» y obliga a subir con la vista, leer otra tarjeta y recordar. Aburrida, sí: es el formato que la gente sabe leer cuando decide. | `[código]` |
| 11 | **Care en el resultado del cotizador**, marcado por defecto. Es el ingreso recurrente y hoy aparece pasado el 70 % del scroll de `/planes`, nunca en el momento de decidir. Un mantenimiento no se vende aparte: se adjunta. | `[código]` |
| 12 | **Fila de comparación contra el WordPress barato en `/planes`.** El argumento está solo en la home, pero la comparación se decide mirando el precio. Quien llega directo a `/planes` lee $295 contra nada. | `[código]` |
| 13 | **Página propia para el Diagnóstico de $49.** Es la única oferta de fricción baja del sitio y vive como una banda debajo de la tabla, aplastada por cuatro planes de $295 a $1 200. Es el producto que debería recibir al tráfico frío. | `[código]` |
| 14 | **Captura de quien no está listo hoy.** El imán ya está escrito en la home —«te enviamos un reporte de velocidad de tu sitio actual»— y no está implementado: falta el campo donde pegar la URL. Se puede construir con la misma API de PageSpeed del punto 2 y la función de Netlify que ya existe para el chat. Sin coste. | `[código]` |
| 15 | **`/planes` tiene 13 acciones compitiendo** en el cuerpo (medido 2026-08-03). Cuando todo es prioritario, nada lo es. Que las 7 tarjetas de capacidad sean una lista con un solo CTA al cierre. | `[código]` |
| 16 | **Sin señal de progreso en `/proceso`** (6 713 px en móvil). `/planes` y `/ayuda` ya llevan índice con `<SectionNav>`. En `/proceso` se dejó a propósito para después: su destino más buscado es el bloque de quiénes están detrás, que sigue vacío (punto 4), y un índice que lleva a una sección en blanco resta en vez de sumar. | `[código]` |
| 17 | **El envío del cotizador solo sale por WhatsApp.** En escritorio sin WhatsApp Web el flujo se corta. `/contacto` ya no depende de eso. | `[tuyo]` + `[cuenta]` |
| 18 | **Revisar el mapeo respuesta → plan del cotizador.** Los precios son tuyos; las reglas que deciden qué plan corresponde a cada respuesta son una propuesta mía, no una decisión tomada. Vive entero en `src/data/quote.ts`. | `[tuyo]` |
| 19 | **Comprobar que los envíos del formulario llegan.** `formDestination` vale `'netlify'`: los envíos caen en Netlify Forms. Falta verlo en el panel, activar la notificación por correo y hacer un envío de prueba. | `[tuyo]` |

## Bloque 4 — Que te encuentren

| # | Pendiente | Quién |
|---|---|---|
| 20 | **Blog con Content Collections de Astro.** El motor se monta aquí y no cuesta nada; los artículos los escribes tú. Un competidor ya ranquea con «cuánto cuesta una página web en Panamá», que es exactamente la búsqueda de mayor intención del mercado. **Cero blogs vacíos:** el motor solo tiene sentido si van a existir posts. | `[código]` + `[tuyo]` |
| 21 | **`LocalBusiness` además de `Organization`.** El schema que ya se emite es correcto pero genérico; `LocalBusiness` con área de servicio es el que compite en búsquedas locales. | `[código]` |
| 22 | **Search Console.** Sitemap y canonical ya se emiten bien; falta darlos de alta y verificar. Hacerlo **después** del punto 1, no antes. | `[cuenta]` |

## Bloque 5 — Técnico y marca

| # | Pendiente | Quién |
|---|---|---|
| 23 | **Prueba con lector de pantalla real** (NVDA / VoiceOver). Lo auditado es estructura, no experiencia. Es el único hueco de accesibilidad que queda y no se puede cerrar desde el repo. | `[tuyo]` |
| 24 | **El `<select>` de `/contacto` usa `appearance:none`** con la flecha en `background-image`. En Windows con alto contraste puede desaparecer. Riesgo bajo. | `[código]` |
| 25 | **La marca es solo tipográfica.** El rayo del favicon no aparece en el nav, ni en el footer, ni en la imagen social, y no hay versión sobre fondo claro para facturas o propuestas. | `[código]` |
| 26 | **El shader es un `requestAnimationFrame` permanente** mientras el hero está en pantalla. Es la única animación corriendo del sitio. Ya se pausa fuera del viewport y no arranca con reduce-motion; si algún día importa la batería, baja a 30 fps sin que se note. | `[código]` |
| 27 | **Los 9 PNG de origen pesan 11,2 MB** y en WebP q90 pesarían 0,87 MB — un 92 % menos, imperceptible en pantalla porque se muestran al 32–50 % de opacidad bajo un velo. No afecta a lo que se sirve (Astro ya emite 1,19 MB de WebP), solo al peso del repo. | `[código]` |

## Bloque 6 — Smartlink para redes sociales

Una página nueva que no se enlaza desde ninguna parte del sitio pero forma
parte de él: el enlace único que va en la bio de Instagram y reparte hacia
WhatsApp, el cotizador, los planes y los proyectos. La idea es tenerlo en el
dominio propio en vez de en un acortador ajeno, y medir desde ahí en adelante.

**Lo que hay que entender antes de empezar**, porque cambia el orden de las
tareas:

- **El Smartlink solo no mide el recorrido.** Con la analítica únicamente en esa
  página se ve quién llega y qué botón toca, y ahí se acaba: en cuanto pasan a
  `/planes` o al cotizador se vuelven invisibles. Para ver el camino completo
  —red social → Smartlink → planes → cotizador → contacto— el tag tiene que
  estar en todo el sitio. Por eso GA4 se instala en todo el sitio (punto 28) y no
  solo aquí: es la única forma de que el recorrido se vea entero.
- **En el Smartlink no hay ninguna conversión que medir.** Solo un clic de
  salida. El píxel de Meta únicamente sirve para retargeting si dispara donde
  alguien completó algo, y eso es `/gracias/`.
- **Hoy el sitio carga cero scripts de terceros.** GA4 y el píxel serían los
  primeros. No es motivo para no hacerlo, sí para medir el antes y el después.

| # | Pendiente | Quién |
|---|---|---|
| 28 | **GA4 en todo el sitio.** Con una trampa que hay que resolver en el mismo momento: el sitio navega con View Transitions, así que GA4 cuenta la primera carga y **deja de contar** al cambiar de página. Hay que disparar la vista a mano en `astro:page-load` o todo el tráfico interno se pierde sin que nada parezca roto. El ID de medición es un identificador público, no un secreto — pero si se declara como variable de entorno hay que mirar el escáner de secretos de Netlify, que ya obligó a una excepción con `CHAT_PROVIDER`. | `[código]` + `[cuenta]` |
| 29 | **Píxel de Meta**, con el evento de conversión en `/gracias/`. Mismo problema de View Transitions que el punto 28. | `[código]` + `[cuenta]` |
| 30 | **`/privacidad` actualizada en el MISMO commit.** Hoy declara: «Del sitio web: ninguno. No usamos cookies propias, no hay herramientas de analítica instaladas y no creamos perfiles de navegación». En cuanto entre GA4 o el píxel, eso pasa a ser **falso**. El propio archivo ya lo dejó escrito en su cabecera: una política que no refleja lo que pasa no es un descuido de redacción, es una declaración falsa. Hay que decir qué se recoge, quién lo recibe (Google, Meta), para qué y cómo oponerse. Revisar también `/terminos`. | `[código]` |
| 31 | **Decidir si hace falta banner de consentimiento.** El píxel de Meta pone cookies. Panamá (Ley 81 de 2019) es menos exigente que la UE, pero el tráfico de redes puede llegar de cualquier país. Un banner añade fricción y peso justo en la página que vende velocidad; no ponerlo es un riesgo acotado. Es decisión tuya, no técnica. | `[tuyo]` |
| 32 | **Medir el coste en velocidad.** GA4 y el píxel rondan los 50 y 70 KB. El sitio vende abrir en menos de un segundo, así que la decisión de dejarlos se toma con el dato delante, no con la intuición: medir antes, medir después y comparar. | `[código]` |

**Hecho el 2026-08-03:** la página existe en `/smark/`, con `noindex`, fuera del
sitemap y sin un solo enlace desde el resto del sitio. Va sin nav, sin pie, sin
chat y sin scroll suave: 6,9 KB de HTML y 15,7 KB de JavaScript, contra 33,5 y
39,7 de la home. Cuatro destinos y ni uno más — cada botón que se añada reparte
peor los clics entre todos los demás.

**Orden de lo que queda.** La analítica, el píxel y la privacidad (29–31) van
juntos, en un solo commit: publicar cualquiera de los dos primeros sin el
tercero deja el sitio declarando algo que no es cierto. Medir (33) va después.

**Cuándo pegarla en la bio:** cuando haya dominio propio. La página se construye
ahora y vive en `cuatronodos.netlify.app/…`; el día que cambie `site` en
`astro.config.mjs` funciona sin tocar nada más. Pero repartir un `.netlify.app`
en redes es exactamente el problema de credibilidad que se quiere evitar.

---

## Fuera de alcance mientras no haya presupuesto

No están olvidados: están descartados a propósito, y conviene no volver a
evaluarlos cada mes.

| Descartado | Por qué |
|---|---|
| Checkout / depósito en línea `[$]` | Exige cuenta de comercio y comisión por transacción. Hasta entonces el cierre es por WhatsApp o formulario |
| Panel de cliente `[$]` | Necesita servidor y base de datos con coste recurrente. Contradice el «$0 de infraestructura» que hoy sostiene el margen |
| BrowserStack o similar `[$]` | Ya cubierto gratis: `npm run medir:movil` mide el layout real en Chromium headless |
| Auditoría de seguridad formal `[$]` | Un sitio estático sin panel ni base de datos tiene una superficie de ataque mínima. Cuando haya panel de cliente, se replantea |
| Community manager, producción de vídeo, patrocinios `[$]` | Plan de redes, no de repo |

---

## Sobre el análisis externo del 2026-08-03

Ese informe se hizo desde el navegador, sin acceso al código. Acierta en lo
grande —la falta de prueba social y de dominio propio son los dos agujeros
reales— pero conviene no actuar sobre estos cuatro puntos:

- **«No detecté datos estructurados (schema.org)».** Sí los hay, y desde hace
  tiempo: `Organization`, `FAQPage`, `Service` + `Offer` y `CollectionPage`. Lo
  que falta es matizar `Organization` a `LocalBusiness` (punto 21), que es otra
  cosa y mucho más pequeña.
- **«URLs limpias» como fortaleza.** Es justo al revés: el sitio sirve
  `/contacto.html`. Es el punto 1, y es el único con fecha límite.
- **«Ocultar los íconos de redes “próximamente”».** Ya no enlazan a ningún
  sitio: se dibujan apagados, fuera del orden de foco y con `aria-hidden`,
  precisamente para no llevar a un 404. Si aun así se prefiere no anunciarlos,
  es un filtro de una línea en `Footer.astro` — pero no es el bug que describe.
- **«No pude verificar el responsive» y «auditar el contraste».** Los dos están
  medidos: el layout móvil con `npm run medir:movil`, y el contraste del texto
  secundario dio 10,4 : 1 sobre fondo real, muy por encima del 4,5 que pide AA.

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
- **No se miden los sitios de los clientes** (2026-08-03). `npm run medir` sigue
  existiendo y funcionando, pero las fichas de `/proyectos` se publican sin
  banda de métricas. El foco del trabajo es este sitio, no el rendimiento de
  proyectos ajenos que además pueden cambiar sin avisar y dejar publicada una
  cifra falsa. `publishedMetrics()` ya cubre ese caso: sin `measuredAt` no
  dibuja nada, así que no hay que tocar código para sostener esta decisión.

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
   están mal calibradas (punto 18).

---

## Fuera del repo por seguridad

Estos archivos existen en el disco local del owner y están bloqueados por
`.gitignore`. **Nunca commitearlos.**

- Documentos de estrategia comercial y metodología interna
- Prompts de trabajo
- Instrucciones internas del asistente
- `node_modules/`, `dist/`, `.astro/` — artefactos de build
