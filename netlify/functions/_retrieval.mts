/**
 * Lógica determinista del chat: recuperación y verificación de precios.
 *
 * Vive fuera del handler para que se pueda probar sin levantar Netlify ni
 * llamar a ningún modelo. Es justamente la parte que NO puede fallar: si la
 * recuperación trae el hecho equivocado, da igual lo bueno que sea el modelo.
 */

export interface KbFact {
  id: string;
  topic: string;
  q: string[];
  text: string;
}

export interface Kb {
  generatedAt: string;
  site: { name: string; location: string; whatsapp: string };
  prices: string[];
  facts: KbFact[];
}

const STOP = new Set(
  ('de la que el en y a los del se las por un para con no una su al es lo como mas pero sus le ya o ' +
    'este si porque esta entre cuando muy sin sobre tambien me hasta hay donde quien desde todo nos ' +
    'durante ni contra ese eso ante ellos e esto mi antes algunos cual poco ella tiene tienen hacer ' +
    'quiero necesito puedo puede son esta estan')
    .split(' ')
);

/** Sin acentos ni signos: "cuánto" y "cuanto" tienen que puntuar igual. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(s: string): string[] {
  return normalize(s)
    .split(' ')
    .filter((t) => t.length > 2 && !STOP.has(t));
}

/**
 * Puntúa cada hecho contra la consulta.
 *
 * Las `q` pesan el triple que el cuerpo: son las formas concretas en que
 * sabemos que la gente pregunta por esa cosa. Es recuperación léxica y no
 * vectorial a propósito — con 38 hechos, los embeddings añadirían una
 * dependencia externa, latencia y coste para resolver un problema que no
 * tenemos.
 */
export function retrieve(kb: Kb, query: string, k = 6): KbFact[] {
  const qt = tokens(query);
  if (!qt.length) return kb.facts.slice(0, k);

  const scored = kb.facts.map((fact) => {
    const qText = normalize(fact.q.join(' '));
    const body = normalize(fact.text);
    let score = 0;
    for (const t of qt) {
      if (qText.includes(t)) score += 3;
      if (body.includes(t)) score += 1;
    }
    // A igual puntuación gana el hecho más corto: es el más específico.
    return { fact, score: score - fact.text.length / 20000 };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.fact);
}

/**
 * Importes de la respuesta que NO están en la lista blanca del build.
 *
 * Es la única defensa que no depende de que el modelo obedezca el prompt. En un
 * sitio cuya promesa es "precio público y fijo", una cifra inventada es el peor
 * fallo posible: contradice justo aquello que se vende.
 */
export function invalidPrices(reply: string, allowed: string[]): string[] {
  const found = reply.match(/\$\s?[\d.,]+/g) ?? [];
  const ok = new Set(allowed);
  return found.map((f) => f.replace(/[^0-9,]/g, '')).filter((n) => n && !ok.has(n));
}

/**
 * Prompt de sistema. Corto a propósito: los modelos pequeños pierden
 * instrucciones cuando el prompt se alarga, así que aquí solo van las reglas
 * que el código no puede imponer por sí mismo.
 */
export function buildSystem(kb: Kb, facts: KbFact[]): string {
  const contexto = facts.map((f) => `- ${f.text}`).join('\n');
  return `Eres el asistente de ${kb.site.name}, un estudio de diseño y desarrollo web en ${kb.site.location}.

REGLAS
1. Responde SOLO con lo que diga el CONTEXTO. Si la respuesta no está ahí, dilo y ofrece el WhatsApp ${kb.site.whatsapp}.
2. Nunca inventes precios, plazos ni características. Copia las cifras tal cual aparecen.
3. No sumes ni calcules totales. Si te piden un total, di que el cotizador del sitio lo calcula en cuatro preguntas.
4. Máximo 3 frases. Español de Panamá, tuteo, directo y sin adornos.
5. No te disculpes ni digas "según el contexto". Responde y ya.

CONTEXTO
${contexto}`;
}
