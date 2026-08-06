/**
 * Auditoría del cotizador, en un navegador de verdad.
 *
 *   npm run build && npm run medir:cotizador
 *
 * Existe por un fallo concreto: el envío final abría WhatsApp con
 * `window.open(url, '_blank', 'noopener')` y usaba el valor devuelto para
 * decidir si esta pestaña se iba a /gracias/. Esa llamada devuelve null
 * SIEMPRE, así que el recorrido terminaba en dos pestañas de WhatsApp y ni un
 * solo `Lead` contado — y el código parecía correcto leyéndolo. Se dio por
 * comprobado durante semanas. La respuesta a eso no es leer con más cuidado,
 * es este script.
 *
 * Lo que vigila:
 *
 *   A. El envío termina en /gracias/ —el único punto donde el píxel cuenta una
 *      conversión— y abre UNA sola pestaña de WhatsApp.
 *   B. "Ninguna de estas" desmarca lo que hay marcado, en vez de solo avanzar.
 *   C. La cifra no cambia por el camino: el total corriente, el del resultado y
 *      el del mensaje de WhatsApp son el mismo número.
 *   D. El precio de cada plan en el cotizador es el que dice /planes. Un
 *      cotizador que diga un número distinto destruye justo la confianza que el
 *      sitio vende.
 *
 * Sale con código 1 si algo falla, así que sirve tal cual en CI.
 *
 * PLAYWRIGHT NO ES DEPENDENCIA DEL PROYECTO a propósito:
 *
 *   npm i -D playwright && npx playwright install chromium
 */
import { stat } from 'node:fs/promises';
import { DIST, loadPlaywright, serveDist } from './_harness.mjs';

const fails = [];
const fail = (msg) => fails.push(msg);
const mark = (ok) => (ok ? 'ok' : 'FALLA');

/* ------------------------------------------------------------------ *
 * Recorrer el cotizador
 * ------------------------------------------------------------------ */

/** Índice del paso visible, leído de la propia página y no supuesto. */
async function pasoActual(page) {
  const txt = await page.locator('[data-count]').textContent();
  return Number(txt.match(/Paso (\d+)/)[1]) - 1;
}

const marcar = (page, value) =>
  // Las casillas reales miden 1×1 y son transparentes: lo clicable es la
  // etiqueta que las envuelve. `force` va por eso, no por tapar un fallo.
  page.locator(`input[value="${value}"]`).check({ force: true });

async function siguiente(page) {
  const i = await pasoActual(page);
  await page.locator('.cot-step').nth(i).locator('button[data-next]').click();
}

async function ninguna(page) {
  const i = await pasoActual(page);
  await page.locator('.cot-step').nth(i).locator('button[data-skip]').click();
}

/**
 * Recorre los cuatro pasos hasta el resultado.
 * Devuelve el total corriente justo antes de pedirlo, para poder compararlo.
 */
async function recorrer(page, base, { objetivo, alcance, capacidades = [], urgencia, saltar = false }) {
  await page.goto(`${base}/cotizador/`, { waitUntil: 'load' });
  await marcar(page, objetivo);
  await siguiente(page);
  await marcar(page, alcance);
  await siguiente(page);
  for (const c of capacidades) await marcar(page, c);
  const corriente = (await page.locator('[data-running-total]').textContent()).trim();
  if (saltar) await ninguna(page);
  else await siguiente(page);
  await marcar(page, urgencia);
  await siguiente(page);
  return { corriente };
}

const totales = (t) => t.replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------------ *
 * A · El envío llega a /gracias/
 * ------------------------------------------------------------------ */
async function checkEnvio(browser, base) {
  console.log('\nA. El envío pasa por /gracias/ y abre una sola pestaña');
  const ctx = await browser.newContext();
  // wa.me no se visita de verdad: se sirve un sello local. Sin esto el script
  // dependería de tener salida a internet para comprobar una redirección.
  await ctx.route('**://wa.me/**', (r) =>
    r.fulfill({ status: 200, contentType: 'text/html', body: '<h1>wa.me</h1>' })
  );
  const page = await ctx.newPage();
  // `popup` y no `context.on('page')`: lo segundo cuenta también esta pestaña y
  // el arnés se acusaba a sí mismo de abrir dos.
  const abiertas = [];
  page.on('popup', (p) => abiertas.push(p));

  await recorrer(page, base, { objetivo: 'nuevo', alcance: 'una', urgencia: 'ya' });
  await page.fill('#cot-nombre', 'Prueba');
  await page.fill('#cot-contacto', '+507 6000 0000');
  await page.locator('[data-send]').click();
  await page.waitForURL(/\/gracias\//, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);

  const enGracias = page.url().includes('/gracias');
  const unaPestana = abiertas.length === 1 && abiertas.every((p) => p.url().includes('wa.me'));

  if (!enGracias)
    fail(`el envío no pasa por /gracias/ (terminó en ${page.url().slice(0, 60)}) — el Lead no se cuenta`);
  if (!unaPestana) fail(`el envío abrió ${abiertas.length} pestañas de WhatsApp, se espera 1`);

  console.log(`   destino final        ${page.url().replace(base, '').slice(0, 40).padEnd(22)} ${mark(enGracias)}`);
  console.log(`   pestañas de WhatsApp ${String(abiertas.length).padEnd(22)} ${mark(unaPestana)}`);
  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * B · "Ninguna de estas" desmarca
 * ------------------------------------------------------------------ */
async function checkNinguna(browser, base) {
  console.log('\nB. "Ninguna de estas" desmarca lo marcado');
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Se marcan dos capacidades caras ANTES de arrepentirse: es justo el caso que
  // cobraba $1,050 de más.
  await recorrer(page, base, {
    objetivo: 'nuevo',
    alcance: 'una',
    capacidades: ['reservas', 'login'],
    urgencia: 'ya',
    saltar: true,
  });

  const lineas = await page.locator('.cot-line').count();
  const total = totales(await page.locator('[data-total]').textContent());
  const ok = lineas === 1;
  if (!ok) fail(`"Ninguna de estas" dejó ${lineas} líneas (se espera solo el plan) y un total de ${total}`);
  console.log(`   líneas tras arrepentirse ${String(lineas).padEnd(18)} ${mark(ok)}`);
  console.log(`   total                    ${total.padEnd(18)} ${mark(ok)}`);
  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * C · La cifra no cambia por el camino
 * ------------------------------------------------------------------ */
async function checkCifraEstable(browser, base) {
  console.log('\nC. Total corriente = total del resultado = total del mensaje');
  const ctx = await browser.newContext();
  await ctx.route('**://wa.me/**', (r) =>
    r.fulfill({ status: 200, contentType: 'text/html', body: '<h1>wa.me</h1>' })
  );
  const page = await ctx.newPage();
  const abiertas = [];
  page.on('popup', (p) => abiertas.push(p));

  // Con un módulo de rango ($250–$900) para que el formato de intervalo también
  // pase por la comparación.
  const { corriente } = await recorrer(page, base, {
    objetivo: 'vender',
    alcance: 'catalogo',
    capacidades: ['ia', 'portal'],
    urgencia: 'mes',
  });
  const resultado = totales(await page.locator('[data-total]').textContent());

  await page.fill('#cot-nombre', 'Prueba');
  await page.fill('#cot-contacto', 'prueba@ejemplo.com');
  await page.locator('[data-send]').click();
  await page.waitForTimeout(600);

  const wa = abiertas.find((p) => p.url().includes('wa.me'));
  const texto = wa ? decodeURIComponent(new URL(wa.url()).searchParams.get('text') ?? '') : '';
  const enMensaje = totales(texto.match(/Total estimado: (.+)/)?.[1] ?? '(no aparece)');

  const ok = corriente === resultado && resultado === enMensaje;
  if (!ok) fail(`la cifra cambia por el camino: corriente ${corriente}, resultado ${resultado}, mensaje ${enMensaje}`);
  console.log(`   corriente ${corriente.padEnd(18)} resultado ${resultado.padEnd(18)} mensaje ${enMensaje.padEnd(18)} ${mark(ok)}`);
  await ctx.close();
}

/* ------------------------------------------------------------------ *
 * D · Los precios son los de /planes
 * ------------------------------------------------------------------ */
const RUTAS_A_PLAN = [
  { plan: 'PanaClaw Start', objetivo: 'nuevo', alcance: 'una' },
  { plan: 'PanaClaw Launch', objetivo: 'rehacer', alcance: 'landing' },
  { plan: 'PanaClaw Corporate', objetivo: 'sistema', alcance: 'multi' },
  { plan: 'PanaClaw Commerce', objetivo: 'vender', alcance: 'catalogo' },
];

async function checkPrecios(browser, base) {
  console.log('\nD. El precio de cada plan es el que dice /planes');
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(`${base}/planes/`, { waitUntil: 'load' });
  const publicados = Object.fromEntries(
    await page.locator('.plan').evaluateAll((cards) =>
      cards.map((c) => [
        c.querySelector('.plan-name')?.textContent.trim(),
        c.querySelector('.price')?.textContent.trim(),
      ])
    )
  );

  for (const caso of RUTAS_A_PLAN) {
    await recorrer(page, base, { ...caso, urgencia: 'flexible' });
    const nombre = (await page.locator('[data-plan-name]').textContent()).trim();
    const enCotizador = totales(
      await page.locator('.cot-line').first().locator('.cot-line-price').textContent()
    );
    const enPlanes = publicados[caso.plan];
    const ok = nombre === caso.plan && enCotizador === enPlanes;
    if (!ok) {
      fail(
        `${caso.plan}: /planes dice ${enPlanes} y el cotizador ${enCotizador}` +
          (nombre === caso.plan ? '' : ` (además recomendó ${nombre})`)
      );
    }
    console.log(
      `   ${caso.plan.padEnd(20)} /planes ${String(enPlanes).padStart(7)}   cotizador ${enCotizador.padStart(7)}   ${mark(ok)}`
    );
  }
  await ctx.close();
}

/* ------------------------------------------------------------------ */
async function main() {
  try {
    await stat(DIST);
  } catch {
    console.error('No existe dist/. Corre `npm run build` antes.');
    process.exit(2);
  }

  const { chromium } = await loadPlaywright();
  const { server, port } = await serveDist();
  const base = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch();
  try {
    await checkEnvio(browser, base);
    await checkNinguna(browser, base);
    await checkCifraEstable(browser, base);
    await checkPrecios(browser, base);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n' + '─'.repeat(60));
  if (fails.length === 0) {
    console.log('✅ El cotizador cuenta lo mismo por los tres caminos.');
  } else {
    console.log(`❌ ${fails.length} problema(s):`);
    for (const f of fails) console.log(`   · ${f}`);
  }
  process.exit(fails.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
