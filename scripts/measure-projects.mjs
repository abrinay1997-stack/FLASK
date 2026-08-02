/**
 * Mide los proyectos publicados con Lighthouse y devuelve las cifras listas
 * para pegar en `src/data/projects.ts`.
 *
 *   npm run medir
 *
 * Por qué existe este script y no se copian los números a mano: la página de
 * proyectos solo publica una métrica si va acompañada de su `measuredAt`. Eso
 * obliga a volver a medir cada cierto tiempo, y algo que hay que repetir a mano
 * se deja de hacer al segundo mes. Aquí es un comando.
 *
 * NECESITA UNA API KEY (gratis):
 *   1. https://console.cloud.google.com/ → crear un proyecto (o usar uno).
 *   2. Buscar "PageSpeed Insights API" en la biblioteca y darle a Habilitar.
 *   3. Credenciales → Crear credenciales → Clave de API. Copiarla.
 *   4. Correr:  PAGESPEED_API_KEY=xxxxx npm run medir
 *
 * Sin key también funciona, pero comparte una cuota anónima que suele estar
 * agotada: si ves 429 repetidos, es eso y no tu conexión.
 *
 * La medición la hace Google contra el sitio público, no esta máquina, así que
 * el resultado no depende de la red desde donde se lance el comando.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_TS = join(ROOT, 'src/data/projects.ts');
const KEY = process.env.PAGESPEED_API_KEY ?? '';

/* ------------------------------------------------------------------ *
 * 1. Los proyectos salen de projects.ts, que sigue siendo la fuente única
 * ------------------------------------------------------------------ */
function readProjects() {
  const src = readFileSync(PROJECTS_TS, 'utf8');
  const out = [];
  // Cada entrada del array declara slug y url; con eso basta para medir.
  const re = /slug:\s*'([^']+)',[\s\S]*?url:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) out.push({ slug: m[1], url: m[2] });
  return out;
}

/* ------------------------------------------------------------------ *
 * 2. Lighthouse vía PageSpeed Insights
 * ------------------------------------------------------------------ */
const API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function measure(url, { attempts = 4 } = {}) {
  const qs = new URLSearchParams({ url, strategy: 'mobile', category: 'performance' });
  if (KEY) qs.set('key', KEY);

  for (let i = 1; i <= attempts; i++) {
    const res = await fetch(`${API}?${qs}`);
    if (res.ok) return res.json();

    const body = await res.text().catch(() => '');
    // 429 = cuota. Con key es transitorio (por minuto); sin key suele ser diaria
    // y reintentar no arregla nada, así que se avisa en vez de insistir en vano.
    if (res.status === 429 && i < attempts) {
      const wait = 15_000 * i;
      console.warn(`   cuota agotada, reintento en ${wait / 1000}s (${i}/${attempts - 1})`);
      await sleep(wait);
      continue;
    }
    throw new Error(`HTTP ${res.status} — ${body.slice(0, 200)}`);
  }
  throw new Error('sin respuesta tras varios reintentos');
}

/* ------------------------------------------------------------------ *
 * 3. De la respuesta cruda a las dos cifras que el sitio publica
 * ------------------------------------------------------------------ */
/**
 * Se publican dos y no ocho. "Carga" es el LCP: el instante en que la página
 * se ve cargada, que es lo que promete la home ("abre en menos de un segundo").
 * El resto de métricas de Lighthouse le dicen algo a un desarrollador y nada a
 * quien va a contratar.
 *
 * La puntuación se etiqueta "Prueba de Google" y no "Lighthouse" por la regla
 * de copy del sitio (ver services.ts): fuera nombres de tecnología salvo los
 * que el cliente ya reconoce. Nadie fuera del oficio sabe qué es Lighthouse;
 * todo el mundo sabe qué es Google. Y la etiqueta sigue siendo exacta, porque
 * la prueba la corre Google.
 */
function extract(json) {
  const lh = json.lighthouseResult;
  if (!lh) throw new Error('respuesta sin lighthouseResult');

  const score = Math.round((lh.categories?.performance?.score ?? 0) * 100);
  const lcpMs = lh.audits?.['largest-contentful-paint']?.numericValue;

  const metrics = [];
  if (Number.isFinite(lcpMs)) {
    const s = lcpMs / 1000;
    metrics.push({ k: 'Carga', v: `${s < 10 ? s.toFixed(1) : Math.round(s)} s` });
  }
  metrics.push({ k: 'Prueba de Google', v: `${score}/100` });
  return metrics;
}

/* ------------------------------------------------------------------ *
 * 4. Salida lista para pegar
 * ------------------------------------------------------------------ */
const hoy = new Intl.DateTimeFormat('es-PA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

function block(slug, metrics) {
  const lines = metrics.map((m) => `      { k: '${m.k}', v: '${m.v}' },`).join('\n');
  return `  // ${slug}\n    metrics: [\n${lines}\n    ],\n    measuredAt: '${hoy}',`;
}

async function main() {
  const projects = readProjects();
  if (projects.length === 0) {
    console.error('No se encontró ningún proyecto en src/data/projects.ts');
    process.exit(1);
  }

  if (!KEY) {
    console.warn('⚠  Sin PAGESPEED_API_KEY: se usa la cuota anónima compartida.');
    console.warn('   Si sale 429 en todos, consigue una key (ver cabecera del script).\n');
  }

  console.log(`Midiendo ${projects.length} proyectos en móvil…\n`);
  const results = [];
  const failed = [];

  for (const p of projects) {
    process.stdout.write(`→ ${p.url}\n`);
    try {
      const metrics = extract(await measure(p.url));
      console.log(`   ${metrics.map((m) => `${m.k} ${m.v}`).join(' · ')}\n`);
      results.push({ slug: p.slug, metrics });
    } catch (err) {
      console.error(`   ✗ ${err.message}\n`);
      failed.push(p.slug);
    }
  }

  if (results.length > 0) {
    console.log('─'.repeat(64));
    console.log('Pega esto en la ficha correspondiente de src/data/projects.ts:\n');
    for (const r of results) console.log(block(r.slug, r.metrics), '\n');
  }

  if (failed.length > 0) {
    console.error(`No se pudo medir: ${failed.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
