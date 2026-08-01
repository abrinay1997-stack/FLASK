# Auditoría de conversión — sin anestesia

> Fecha: 2026-08-01 · Medido sobre el build de producción.
> Complementa `AUDITORIA.md` (jerarquía, accesibilidad, animación, marca).
> Aquí solo se habla de una cosa: **por qué alguien que entra no acaba pagando.**

---

## El veredicto en una línea

El sitio está muy bien construido para **explicar** un servicio y muy mal construido
para **venderlo**: tiene 17 precios distintos publicados y **cero pruebas de que
alguien haya pagado alguno**, cero reversión de riesgo y cero forma de capturar a
quien no está listo hoy. Convierte a los que ya venían convencidos por un referido;
al tráfico frío lo pierde entero.

---

## Los agujeros, por dinero perdido

### 1. Cero prueba social. En todo el sitio. ← el más caro

**Medido:** 0 testimonios, 0 logos de cliente, 0 casos, 0 capturas de resultados,
0 nombres propios. Búsqueda de `testimoni|caso de éxito|reseña|cliente dice` en
todo `src/`: **0 coincidencias.**

Le estás pidiendo a un desconocido que transfiera el 50 % de $850 por adelantado
a un estudio del que no puede verificar nada. Ninguna cantidad de copy resuelve
eso. La objeción real de tu comprador no es el precio, es **"¿y este quién es?"**,
y el sitio no la responde ni una vez.

Peor: tu propio argumento comercial ("el de $199 te entrega un WordPress lento")
te obliga a demostrar que tú sí entregas rápido. Y no hay un solo enlace a un
sitio hecho por ti.

**Lo mínimo viable, hoy, sin cliente nuevo:** el PageSpeed de **este** sitio, en
grande, con enlace verificable a la medición de Google. Es autoevidencia y ya la
tienes. Cuesta una sección.

**Lo correcto:** las 3 demos verticales que ya están planificadas, en vivo, con su
PageSpeed al lado.

### 2. Cero reversión de riesgo

**Medido:** la palabra "garantizado" aparece **una vez** en todo el sitio, y es
sobre PageSpeed ≥90 — una especificación técnica, no una promesa comercial. Cero
menciones de devolución, prueba, o "si no te gusta".

Hoy el reparto de riesgo es: el cliente pone el 50 % por adelantado y asume el
100 % del riesgo. Tú no asumes ninguno. Eso es normal en una agencia con
portafolio; es letal en una sin él.

**Qué hacer:** algo concreto y acotado que puedas cumplir. Por ejemplo: *"Si el
primer diseño no te convence, te devolvemos el adelanto completo."* En Jamstack
productizado el coste real de esa promesa es una plantilla y unas horas — y
elimina de golpe la objeción que más lead te está costando.

### 3. El Diagnóstico de $49 está enterrado, siendo tu mejor arma

Es la única oferta del sitio con fricción baja: barata, concreta, entregable en
48 h y — lo importante — **convierte a un desconocido en un cliente que ya te
pagó**. Un cliente que pagó $49 compra un $850 con una facilidad que un
desconocido nunca va a tener.

**Dónde está:** una banda naranja debajo de la tabla de precios, sin página
propia, sin desglose de qué recibes exactamente, compitiendo visualmente con
cuatro planes de $295 a $1,200 que la aplastan.

**Qué hacer:** darle página propia y tratarla como la puerta de entrada, no como
un extra. Es el producto que debería estar en el CTA de la home para el tráfico
frío, con los planes reservados para quien ya sabe qué quiere.

### 4. Los planes no se pueden comparar

Cuatro tarjetas, cada una con su propia lista de características, sin alinear, sin
una fila común. `Commerce` dice "Todo lo de Corporate" — lo que obliga a la persona
a subir con la vista, leer otra tarjeta y recordar. Eso es trabajo cognitivo que
el visitante no va a hacer: se va.

**Qué hacer:** una tabla comparativa con las mismas filas para los cuatro planes.
Aburrida, sí. Es el formato que la gente sabe leer cuando está decidiendo.

### 5. El argumento contra el competidor está en el sitio equivocado

La cita del WordPress de $199 está en la home. Pero la comparación se decide en
`/planes`, mirando tu $295 — y ahí no hay ni una palabra sobre la alternativa.
El visitante que llega a tus precios sin haber pasado por la home no tiene con
qué contrastar, y $295 se lee caro contra nada.

**Qué hacer:** una fila de comparación junto a la tabla de precios: qué te dan por
$199 y qué te damos por $295. Con datos, no adjetivos.

### 6. CuatroNodos Care ($35–$250/mes) está fuera del momento de venta

Es tu ingreso recurrente — lo único que hace que el negocio no dependa de vender
un sitio nuevo cada mes — y vive en el 70 % del scroll de una página de 7.000 px,
después de las capacidades. **Nunca se ofrece en el momento en que la persona
está decidiendo comprar.**

**Qué hacer:** que aparezca en el resultado del cotizador y en la propuesta, como
casilla marcada por defecto. Un mantenimiento no se vende aparte: se adjunta.

### 7. No existe forma de capturar a quien no está listo hoy

La inmensa mayoría de quien entra a una web de agencia no compra en esa visita.
El sitio no tiene **ninguna** forma de quedarse con esa persona: ni correo, ni
lista, ni descarga, ni recordatorio. Se va y no vuelve.

Y el imán obvio ya está escrito en tu propia home: *"Te enviamos un reporte
PageSpeed de tu sitio actual"*. Eso es un lead magnet perfecto y **no está
implementado en ninguna parte**: no hay campo donde poner tu URL.

**Qué hacer:** un campo único — "pega la URL de tu sitio y te mandamos el
reporte" — a cambio del correo. Fricción mínima, valor inmediato, y el mismo
reporte es la entrada natural al Diagnóstico de $49.

### 8. Nadie sabe qué pasa después de enviar

No hay en ningún punto un "qué recibes y cuándo". La promesa de respuesta en 24 h
está en el copy de varias páginas, pero nunca **junto al botón**, que es el único
sitio donde reduce ansiedad.

---

## Lo que ya estaba bien (no lo toques)

- **Precios públicos.** Es la decisión estratégica más fuerte del sitio y la
  mayoría de tu competencia no se atreve. Todo lo demás se apoya ahí.
- **El anclaje está bien ordenado.** Corporate ($850, "Recomendado") primero y
  Start ($295) al final: el rango se lee de arriba abajo y $295 aterriza como
  alivio, no como techo.
- **Salida siempre disponible.** El CTA del nav está en las 9 páginas, también en
  móvil. Ninguna página deja al visitante sin siguiente paso.
- **El primer precio aparece pronto.** 0,6 pantallas en la home, 0,2 en `/planes`.
  No escondes la cifra, que es coherente con lo que predicas.
- **Las objeciones están respondidas.** La FAQ cubre las cinco preguntas reales
  (qué incluye, quién es dueño, hosting, plazos, sistemas grandes). El problema no
  es el contenido: es que solo vive al final de `/planes`.

---

## La decisión: cotizador, no chatbot

Pediste que pensara qué convierte mejor. Descarté dos opciones antes de construir.

### Por qué NO un chatbot

1. **No tienes dónde correrlo.** El sitio es estático en GitHub Pages. Un chatbot
   con LLM necesita un servidor o una clave de API en el navegador — y una clave
   en el navegador es una clave que cualquiera te vacía. Significa montar una
   función serverless, o sea una dependencia de hosting nueva y coste por
   conversación, para un negocio que hoy paga $0 de infraestructura.
2. **Contradice tu propio posicionamiento.** Vendes "precio público, alcance por
   escrito, cero *consultar por interno*". Un bot al que hay que **preguntarle** el
   precio reintroduce exactamente la fricción contra la que compites. Sería el
   "consultar por interno" con otra ropa.
3. **Un precio alucinado es un pasivo.** Si el bot dice $600 y la propuesta dice
   $850, perdiste al cliente y la credibilidad. Una calculadora determinista no
   puede inventarse una cifra.
4. **La tarea es cerrada, no abierta.** Configurar un presupuesto tiene ~10
   variables conocidas. El chat gana en soporte y en preguntas imprevisibles;
   pierde en tareas acotadas, donde añade turnos, espera y ambigüedad frente a
   cuatro toques.

### Por qué NO una sección-calculadora suelta

Menos fricción, pero **captura cero**: la persona obtiene el número y se va. Te
quedas sin el lead, que es justo lo que este sitio no puede permitirse.

### Por qué SÍ un cotizador paso a paso

- **Elimina la peor fricción que tenías.** El formulario obligaba a elegir plan
  antes de contactar: le exigía al visitante la respuesta que vino a buscar. El
  cotizador la **produce** en vez de pedirla.
- **Sustituye escribir por tocar.** El campo obligatorio "Cuéntanos sobre tu
  proyecto" (texto libre) era la mayor fuente de abandono del formulario. Ahora
  son cuatro toques.
- **Cada respuesta es un micro-compromiso.** Quien ya invirtió cuatro respuestas y
  tiene una cifra concreta delante llega al momento de dar sus datos en una
  posición radicalmente distinta a quien aterriza en un formulario en frío.
- **El precio va ANTES de pedir los datos.** Es la decisión de diseño clave, y es
  deliberadamente lo contrario de lo que hace casi todo el mundo. Pedir el correo
  para "revelar" el precio contradiría toda la promesa del sitio. Enseñarlo
  primero convierte el formulario final de peaje en paso obvio: ya viste la
  cifra, ahora quieres el papel.
- **Reduce el coste de responder mal.** Es reversible, hay botón "Atrás", y el
  paso de capacidades se puede saltar entero.

---

## Qué se construyó

**`/cotizador`** — cuatro preguntas, precio al final, datos después.

- Los precios salen de `plans.ts` y `modules.ts`: el cotizador **no** tiene tabla
  propia. Si cambias el precio de Corporate, cambia en los dos sitios a la vez.
  Verificado en las pruebas: el $850 del cotizador y el de `/planes` son el mismo dato.
- Recomienda **el plan más pequeño que cubre lo marcado**, y dice por qué: *"Lo
  pide 'editarlo tú mismo'. Es el plan más pequeño que lo cubre."* Recomendar de
  más se nota y quema la confianza que el resto del sitio construye.
- Las capacidades ya incluidas en el plan salen marcadas **"Incluido"** con precio
  cero, en vez de ocultarse. Ver que algo no te lo cobran vale más que no verlo.
- Los rangos se propagan honestamente: automatización IA ($250–$900) sobre Start
  da "$545 – $1,195", no una cifra falsamente exacta.
- Cierra con "Estimación, no factura" y el envío compone el resumen completo por
  WhatsApp: la persona no repite nada de lo que ya respondió.
- **El CTA "Cotizar" del nav ahora apunta aquí**, no al formulario. Es el cambio
  de mayor alcance: ese botón está en las 9 páginas.

**Verificado** (20 comprobaciones automatizadas): la aritmética en cinco escenarios,
la coherencia con `/planes`, la validación antes de enviar, el contenido del mensaje,
el foco de teclado entre pasos y que los radios sigan siendo navegables.

---

## Lo que hay que medir en cuanto haya analítica

Sin datos, todo lo de arriba es criterio informado, no certeza. Los cuatro números
que de verdad importan:

1. **Terminación del cotizador por paso.** Dónde se cae la gente dice qué pregunta
   está mal formulada.
2. **Vieron el precio → dejaron sus datos.** Es la métrica que valida o tumba toda
   la decisión de enseñar el precio primero.
3. **Cotizador vs formulario directo**, en leads que acaban en venta. No en leads:
   en ventas.
4. **Plan estimado vs plan vendido.** Si el cotizador sistemáticamente estima por
   debajo de lo que acabas cobrando, las reglas de mapeo están mal calibradas y
   estás generando expectativas que luego rompes.

**Aviso importante:** las reglas que deciden qué plan corresponde a cada respuesta
son una propuesta mía, derivada de cómo están descritos tus planes en `plans.ts`.
Los precios son tuyos y no se inventan, pero el mapeo respuesta → plan deberías
revisarlo tú antes de dar por buena una sola cotización. Vive todo en un único
sitio: `src/data/quote.ts`.
