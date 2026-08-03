import type { Config, Context } from '@netlify/functions';

import { retrieve, invalidPrices, buildSystem, trimReply, type Kb } from './_retrieval.mts';

/**
 * Endpoint del chat de CuatroNodos.
 *
 * PREMISA DE DISEÑO: el modelo es la parte menos fiable del sistema, así que se
 * le da el trabajo más pequeño posible. No busca, no calcula y no recuerda: solo
 * redacta a partir de hechos que le ponemos delante ya resueltos.
 *
 * Reparto de responsabilidades:
 *
 *   Recuperación  → código (léxica sobre kb.json, determinista)
 *   Precios       → código (vienen literales del build)
 *   Aritmética    → NO se hace; se deriva al cotizador
 *   Verificación  → código (lista blanca de importes, post-respuesta)
 *   Redacción     → modelo
 *
 * Con este reparto un modelo pequeño (Groq/Llama, Haiku) responde igual de bien
 * que uno grande, porque lo único que aporta es el lenguaje. Y lo más importante:
 * la comprobación de precios NO depende de que el modelo obedezca el prompt.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/* ------------------------------------------------------------------ *
 * Base de conocimiento
 * ------------------------------------------------------------------ */

let kbCache: { kb: Kb; at: number } | null = null;
const KB_TTL_MS = 10 * 60 * 1000;

async function loadKb(origin: string): Promise<Kb> {
  if (kbCache && Date.now() - kbCache.at < KB_TTL_MS) return kbCache.kb;
  const res = await fetch(`${origin}/kb.json`);
  if (!res.ok) throw new Error(`kb.json devolvió ${res.status}`);
  const kb = (await res.json()) as Kb;
  kbCache = { kb, at: Date.now() };
  return kb;
}

/* ------------------------------------------------------------------ *
 * Proveedor
 * ------------------------------------------------------------------ */

interface Provider {
  url: string;
  headers: Record<string, string>;
  body: (system: string, msgs: ChatMessage[]) => unknown;
  extract: (json: any) => string;
}

function pickProvider(): Provider | null {
  const groq = process.env.GROQ_API_KEY;
  const anthropic = process.env.ANTHROPIC_API_KEY;

  // Anthropic primero si está: con el mismo andamiaje da mejores respuestas.
  if (anthropic) {
    return {
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'content-type': 'application/json',
        'x-api-key': anthropic,
        'anthropic-version': '2023-06-01',
      },
      body: (system, msgs) => ({
        model: process.env.CHAT_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 260,
        temperature: 0.3,
        system,
        messages: msgs,
      }),
      extract: (j) => j?.content?.[0]?.text ?? '',
    };
  }

  if (groq) {
    return {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${groq}` },
      body: (system, msgs) => ({
        model: process.env.CHAT_MODEL || 'llama-3.3-70b-versatile',
        max_tokens: 260,
        temperature: 0.3,
        messages: [{ role: 'system', content: system }, ...msgs],
      }),
      extract: (j) => j?.choices?.[0]?.message?.content ?? '',
    };
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * Quién puede llamar
 * ------------------------------------------------------------------ */

/**
 * Solo se atiende lo que venga del propio sitio.
 *
 * El endpoint gasta la clave de Anthropic en cada llamada, así que sin esto
 * cualquiera puede apuntar un script contra `/api/chat` y facturarnos sus
 * conversaciones. Se compara contra el origen de la petición —no contra una
 * lista fija— para que las previews de Netlify, que viven en otro subdominio,
 * sigan funcionando sin mantener nada.
 *
 * Un `Origin` se puede falsificar con curl: esto no es autenticación, es quitar
 * de en medio el abuso barato. Lo que acota el gasto de verdad es el tope
 * diario de más abajo.
 */
function allowedOrigin(req: Request): boolean {
  const self = new URL(req.url).origin;
  const origin = req.headers.get('origin');
  if (origin) return origin === self;

  // Sin Origin (algunos navegadores en same-origin) miramos el Referer.
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).origin === self;
    } catch {
      return false;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Límites de uso (best-effort, por instancia)
 * ------------------------------------------------------------------ */

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const prev = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  prev.push(now);
  hits.set(ip, prev);
  if (hits.size > 500) hits.clear(); // no dejamos crecer el mapa sin límite
  return prev.length > MAX_PER_WINDOW;
}

/**
 * Techo de conversaciones al día para todo el sitio, no por visitante: es el
 * único límite que pone una cifra máxima a la factura del mes.
 *
 * Vive en memoria y cada instancia lleva su propia cuenta, así que Netlify
 * levantando varias lo multiplica. Es un tope aproximado a propósito: el
 * alternativo —un contador compartido— pide almacenamiento externo y una
 * llamada de red en cada mensaje, para proteger un endpoint que hoy responde
 * preguntas sobre precios. Si algún día el chat pesa más, se sube a Netlify
 * Blobs.
 */
const MAX_PER_DAY = Number(process.env.CHAT_MAX_PER_DAY || 300);
let day = '';
let dayCount = 0;

function dailyCapReached(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  dayCount += 1;
  return dayCount > MAX_PER_DAY;
}

/* ------------------------------------------------------------------ *
 * Handler
 * ------------------------------------------------------------------ */

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  if (!allowedOrigin(req)) return json({ error: 'Origen no permitido' }, 403);

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'anon';
  if (rateLimited(ip)) {
    return json({ reply: 'Vas muy rápido. Espera un momento y vuelve a preguntar.' }, 429);
  }

  let messages: ChatMessage[];
  try {
    const body = (await req.json()) as { messages?: ChatMessage[] };
    messages = (body.messages ?? [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))
      .slice(-6); // memoria corta a propósito: cada turno se re-recupera
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser?.content.trim()) return json({ error: 'Falta el mensaje' }, 400);

  const origin = new URL(req.url).origin;
  const provider = pickProvider();

  let kb: Kb;
  try {
    kb = await loadKb(origin);
  } catch {
    return json({
      reply: `Ahora mismo no puedo consultar los datos. Escríbenos por WhatsApp y te respondemos: ${
        process.env.FALLBACK_WHATSAPP || ''
      }`.trim(),
      degraded: true,
    });
  }

  // Sin clave configurada el chat no se cae: deriva a WhatsApp.
  if (!provider) {
    return json({
      reply: `El asistente todavía no está conectado. Escríbenos por WhatsApp al ${kb.site.whatsapp} y te contestamos directo.`,
      degraded: true,
    });
  }

  // Techo del día alcanzado: se deriva a la persona, no se devuelve un error.
  if (dailyCapReached()) {
    return json({
      reply: `El asistente ya no atiende más consultas por hoy. Escríbenos por WhatsApp al ${kb.site.whatsapp} y te contestamos directo.`,
      degraded: true,
    });
  }

  const facts = retrieve(kb, lastUser.content);
  const system = buildSystem(kb, facts);

  let reply = '';
  try {
    const res = await fetch(provider.url, {
      method: 'POST',
      headers: provider.headers,
      body: JSON.stringify(provider.body(system, messages)),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`proveedor devolvió ${res.status}`);
    reply = trimReply(provider.extract(await res.json()).trim());
  } catch {
    return json({
      reply: `Se me cayó la conexión. Escríbenos por WhatsApp al ${kb.site.whatsapp} y te respondemos al momento.`,
      degraded: true,
    });
  }

  if (!reply) {
    return json({
      reply: `No supe responder eso. Escríbenos por WhatsApp al ${kb.site.whatsapp}.`,
      degraded: true,
    });
  }

  // Barandilla: si aparece un importe que no salió del build, no se publica.
  const bad = invalidPrices(reply, kb.prices);
  if (bad.length) {
    return json({
      reply:
        `Prefiero no darte una cifra de memoria. Los precios están en la página de planes, ` +
        `y el cotizador calcula el tuyo exacto en cuatro preguntas.`,
      blocked: bad,
    });
  }

  return json({ reply, sources: facts.map((f) => f.id) });
};

export const config: Config = { path: '/api/chat' };
