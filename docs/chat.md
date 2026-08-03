# El chat de CuatroNodos — cómo está armado y por qué

> Documento técnico. Si vas a tocar el chat, lee esto antes.

---

## El problema que resuelve el diseño

Vas a usar un modelo pequeño (Groq/Llama) o, como mucho, uno intermedio. Los
modelos pequeños fallan en tres cosas concretas: **recuerdan mal, calculan peor
y se inventan datos con total aplomo.** En un sitio cuya promesa entera es
"precio público, fijo y por escrito", un precio inventado no es un error
gracioso: contradice justo lo que vendes.

La respuesta no es un prompt más largo ni un modelo más caro. Es **quitarle
trabajo al modelo** hasta que lo único que aporte sea el lenguaje.

## El reparto

| Tarea | Quién la hace | Por qué |
|---|---|---|
| Buscar la información | **Código** — recuperación léxica sobre `kb.json` | Determinista y reproducible. El modelo no "recuerda" nada |
| Saber los precios | **Código** — vienen literales del build | Imposible que se desvíen de `/planes` |
| Sumar totales | **Nadie** — se deriva al cotizador | La aritmética es donde más fallan los modelos pequeños |
| Verificar lo dicho | **Código** — lista blanca de importes | No depende de que el modelo obedezca |
| Redactar | **Modelo** | Es lo único que hace bien de forma fiable |

Con este reparto, cambiar de Groq a Claude mejora el *tono*, no la *exactitud*.
Y eso es exactamente lo que queremos: que la corrección no dependa del proveedor.

---

## Las piezas

### 1. `src/pages/kb.json.ts` — la base de conocimiento

Se genera **en el build** desde los mismos archivos de datos que renderizan el
sitio (`plans.ts`, `modules.ts`, `care.ts`, `faq.ts`, `services.ts`, `site.ts`).

Una base escrita a mano se desincroniza el primer día que alguien cambia un
precio. Aquí no puede: si editas `$850` en `plans.ts`, cambia en `/planes`, en el
cotizador y en lo que responde el bot, en el mismo build.

Tres decisiones de formato, todas pensadas para modelos pequeños:

1. **Hechos atómicos y autocontenidos.** Cada entrada se entiende sola. El
   modelo no tiene que unir dos hechos para responder.
2. **Cada hecho trae sus propias `q`** — las formas naturales en que la gente
   pregunta por eso. Como la recuperación es léxica, las variantes las ponemos
   nosotros en vez de esperar que el modelo las infiera.
3. **`prices` es la lista blanca de cifras.** Es lo que permite bloquear
   importes inventados sin depender del prompt.

Estado actual: **38 hechos, 13,5 kB, 17 importes en lista blanca.**

### 2. `netlify/functions/_retrieval.mts` — la lógica determinista

Recuperación léxica con normalización (sin acentos, sin signos, sin palabras
vacías). Las `q` puntúan el triple que el cuerpo del hecho; a igualdad gana el
hecho más corto, que es el más específico.

**Por qué léxica y no vectorial:** con 38 hechos, los embeddings añadirían una
dependencia externa, latencia y coste por consulta para resolver un problema que
no tenemos. Medido: **22 de 22 consultas de prueba recuperan el hecho correcto**,
21 de ellas en primera posición.

Aquí también vive `invalidPrices()`, la barandilla.

### 3. `netlify/functions/chat.mts` — el endpoint

Publicado en `/api/chat`. Hace, en orden: límite de peticiones → validación →
carga de la KB (cacheada 10 min) → recuperación → prompt → proveedor →
**verificación de precios** → respuesta.

**Las claves viven solo en el servidor.** El navegador nunca las ve.

### 4. `src/components/ChatWidget.astro` — la interfaz

Dos decisiones que no son de estilo:

- **Las sugerencias iniciales dirigen la conversación** hacia preguntas que la
  KB responde bien. En un modelo pequeño, encauzar la pregunta rinde más que
  pulir el prompt.
- **Degrada a WhatsApp, no a un error.** Si `/api/chat` no existe (hoy, en
  un hosting estático sin funciones), el widget lo detecta al primer intento y se convierte en un
  atajo a WhatsApp y al cotizador. El mismo código sirve con funciones y sin ellas, hoy y en
  Netlify mañana.

---

## La barandilla de precios

Es la pieza más importante y cabe en diez líneas: se extraen todos los `$…` de
la respuesta y se comparan contra la lista blanca del build. Si aparece uno que
no salió de ahí, **la respuesta no se publica** — se sustituye por una que
remite a `/planes` y al cotizador.

Verificado:

| Caso | Resultado |
|---|---|
| `"Corporate cuesta $850 y el Start $295"` | pasa |
| `"Te lo dejo en $700, precio especial"` | **bloqueado** |
| `"El total sería $2,550"` (suma inventada) | **bloqueado** |
| `"$850 más $600 de reservas, total $1,450"` | **bloquea solo el $1,450** |

Nótese lo que esto significa: aunque el modelo ignore por completo el prompt, no
puede publicar un precio falso.

---

## Puesta en marcha en Netlify

1. Conecta el repositorio a Netlify. `netlify.toml` ya declara el directorio de
   funciones y el bundler.
2. En **Site settings → Environment variables**, añade **una** de estas:
   - `ANTHROPIC_API_KEY` — si está, tiene prioridad; mejores respuestas
   - `GROQ_API_KEY` — alternativa más barata y rápida
3. Opcional: `CHAT_MODEL` para fijar el modelo. Por defecto usa
   `claude-haiku-4-5-20251001` o `llama-3.3-70b-versatile` según el proveedor.
4. Despliega. La función queda en `/api/chat` y el widget la detecta sola.

**Sin ninguna clave el sitio no se rompe:** el endpoint responde derivando a
WhatsApp. Puedes desplegar primero y conectar el modelo después.

### Coste y protección

- Límite de 12 mensajes por minuto y por IP (por instancia de función).
- Historial recortado a 6 mensajes: el coste por turno no crece con la conversación.
- `max_tokens: 400` y `temperature: 0.2`.
- Prompt medido: **~357 tokens de media, 574 en el peor caso.** Un turno completo
  ronda los 600–800 tokens de entrada.

---

## Cómo mejorarlo (por orden de rendimiento)

1. **Añadir frases de intención a `kb.json.ts`.** Es la palanca más barata y la
   que más sube la precisión. Cuando el bot no encuentre algo, casi siempre la
   causa es vocabulario que falta, no el modelo. Ya pasó una vez: "quiero vender
   en línea" no recuperaba el plan Commerce hasta que se añadió ese vocabulario.
2. **Revisar `sources` en las respuestas.** El endpoint devuelve qué hechos usó.
   Si la respuesta es mala, mira primero si la recuperación trajo lo correcto —
   suele ser ahí, no en el modelo.
3. **Registrar preguntas sin respuesta.** Las consultas que recuperan 0 hechos
   son la lista de lo que le falta a la KB. Hoy no se registran: es el siguiente
   paso natural.
4. **Solo entonces, cambiar de modelo.** Es lo último que hay que tocar, no lo
   primero.

## Lo que este chat no hace, a propósito

- **No cotiza.** Deriva al cotizador, que sí calcula. Un bot que da totales es un
  bot que tarde o temprano da un total equivocado, y eso ya no es un fallo
  técnico: es un problema comercial.
- **No agenda ni cierra ventas.** Responde y pasa a WhatsApp.
- **No recuerda entre sesiones.** Cada conversación arranca limpia.
- **No inventa.** Si no está en la KB, lo dice y pasa el teléfono.
