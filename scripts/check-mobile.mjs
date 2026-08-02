/**
 * Auditoría de layout en móvil, con números en vez de a ojo.
 *
 *   npm run build && npm run medir:movil
 *
 * Comprueba cuatro cosas sobre el sitio ya construido, en varios anchos:
 *
 *   A. El navbar queda centrado de verdad (márgenes iguales a izquierda y
 *      derecha) y no se sale de la pantalla.
 *   B. Ninguna página tiene espacio muerto después del footer ni desborda
 *      horizontalmente.
 *   C. El footer no se come más pantallas de la cuenta.
 *   D. La burbuja del chat no tapa los enlaces legales.
 *
 * Los tres primeros nacieron de fallos reales: el navbar descentrado por debajo
 * de 1120px y un footer de 1580px que en un teléfono eran dos pantallas y media
 * de scroll. Se quedan aquí como cepo para que no vuelvan sin avisar.
 *
 * Sale con código 1 si algo falla, así que sirve tal cual en CI.
 *
 * PLAYWRIGHT NO ES DEPENDENCIA DEL PROYECTO a propósito: arrastra la descarga
 * de un navegador y encarecería cada build de Netlify para algo que solo se
 * corre a mano. El script lo busca instalado en el proyecto o en el sistema:
 *
 *   npm i -D playwright && npx playwright install chromium
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/* ------------------------------------------------------------------ *
 * Presupuestos. Son cepos, no aspiraciones: se fijan un pelo por encima
 * de lo que hoy se cumple, para que un empeoramiento salte y una mejora
 * obligue a bajarlos.
 * ------------------------------------------------------------------ */
const BUDGET = {
  navAsymmetryPx: 1, // diferencia tolerable entre margen izquierdo y derecho
  deadSpaceAfterFooterPx: 2,
  /*
   * En píxeles y no en "pantallas": el iPhone SE tiene 568px de alto y con esa
   * vara cualquier footer decente ya va por 2 pantallas, así que el umbral
   * quedaba pegado al valor real y saltaría por ruido. El footer llegó a medir
   * 1580px; hoy anda por 1191 en el peor teléfono. 1300 separa las dos cosas
   * sin ambigüedad.
   */
  footerMaxPx: 1300,
};

const NAV_WIDTHS = [320, 360, 390, 430, 768, 900, 1024, 1120, 1280, 1440, 1920];
const PHONES = ['iPhone SE', 'iPhone 13', 'iPhone 14 Pro Max'];

/* ------------------------------------------------------------------ *
 * Playwright: del proyecto si está, si no del sistema
 * ------------------------------------------------------------------ */
async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {}
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return await import(pathToFileURL(join(globalRoot, 'playwright', 'index.mjs')).href);
  } catch {}
  console.error(
    'Falta Playwright. Instálalo con:\n' +
      '  npm i -D playwright && npx playwright install chromium'
  );
  process.exit(2);
}

/* ------------------------------------------------------------------ *
 * Servidor estático mínimo para dist/ (evita otra dependencia)
 * ------------------------------------------------------------------ */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p === '/' || p.endsWith('/')) p += 'index.html';
      const file = join(DIST, p);
      if (!file.startsWith(DIST)) {
        res.writeHead(403).end();
        return;
      }
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('404');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/* ------------------------------------------------------------------ *
 * Comprobaciones
 * ------------------------------------------------------------------ */
const fails = [];
const fail = (msg) => fails.push(msg);
const mark = (ok) => (ok ? 'ok' : 'FALLA');

async function checkNav(browser, base) {
  console.log('\nA. Centrado del navbar');
  console.log('   ancho │   izq    der │  pill │');
  const page = await (await browser.newContext()).newPage();
  for (const w of NAV_WIDTHS) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    const m = await page.evaluate(() => {
      const r = document.querySelector('.nav-pill').getBoundingClientRect();
      return {
        left: r.left,
        right: window.innerWidth - r.right,
        width: r.width,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    const asym = Math.abs(m.left - m.right);
    const ok = asym <= BUDGET.navAsymmetryPx && m.left >= 0 && m.right >= 0 && !m.overflow;
    if (!ok) fail(`navbar descentrado a ${w}px (asimetría ${asym.toFixed(1)}px)`);
    console.log(
      `   ${String(w).padStart(5)} │ ${m.left.toFixed(1).padStart(5)} ${m.right.toFixed(1).padStart(6)} │` +
        ` ${m.width.toFixed(0).padStart(5)} │ ${mark(ok)}`
    );
  }
  await page.context().close();
}

async function checkPages(browser, base, pages) {
  console.log('\nB. Espacio tras el footer y desborde horizontal (iPhone 13)');
  const { devices } = await loadPlaywright();
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`${base}/${p}`, { waitUntil: 'load' });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const d = document.documentElement;
      const f = document.querySelector('footer');
      const fb = f ? f.getBoundingClientRect().bottom + window.scrollY : d.scrollHeight;
      return {
        dead: Math.round(d.scrollHeight - fb),
        overflow: d.scrollWidth > window.innerWidth,
      };
    });
    const ok = r.dead <= BUDGET.deadSpaceAfterFooterPx && !r.overflow;
    if (!ok)
      fail(`${p}: ${r.dead}px tras el footer${r.overflow ? ' + desborda horizontalmente' : ''}`);
    console.log(
      `   ${p.padEnd(16)} muerto:${String(r.dead).padStart(4)}px  desborde:${r.overflow ? 'SÍ' : 'no'}  ${mark(ok)}`
    );
  }
  await ctx.close();
}

async function checkFooter(browser, base) {
  console.log('\nC. Peso del footer  ·  D. Burbuja del chat sobre los enlaces legales');
  const { devices } = await loadPlaywright();
  for (const name of PHONES) {
    const ctx = await browser.newContext({ ...devices[name] });
    const page = await ctx.newPage();
    await page.goto(`${base}/index.html`, { waitUntil: 'load' });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const f = document.querySelector('footer').getBoundingClientRect();
      const fab = document.querySelector('.chat')?.getBoundingClientRect();
      const legal = document.querySelector('.foot-legal')?.getBoundingClientRect();
      const hit =
        fab && legal
          ? !(
              fab.right < legal.left ||
              fab.left > legal.right ||
              fab.bottom < legal.top ||
              fab.top > legal.bottom
            )
          : false;
      return { h: Math.round(f.height), screens: f.height / window.innerHeight, hit };
    });
    const okH = r.h <= BUDGET.footerMaxPx;
    const okOverlap = !r.hit;
    if (!okH) fail(`footer de ${r.h}px en ${name} (tope ${BUDGET.footerMaxPx}px)`);
    if (!okOverlap) fail(`la burbuja del chat tapa los enlaces legales en ${name}`);
    console.log(
      `   ${name.padEnd(20)} ${String(r.h).padStart(5)}px  ${r.screens.toFixed(2)} pantallas ${mark(okH)}` +
        `   ·  solape: ${r.hit ? 'SÍ' : 'no'} ${mark(okOverlap)}`
    );
    await ctx.close();
  }
}

async function checkChat(browser, base) {
  console.log('\nE. Panel del chat abierto, dentro de la pantalla');
  const { devices } = await loadPlaywright();

  /*
   * El último escenario no es un teléfono: es un viewport estrecho con canal de
   * barra de scroll reservado, de forma que el ancho utilizable queda por debajo
   * de lo que miden las unidades de viewport.
   *
   * Está aquí porque el fallo del panel apareció en Safari de iOS y Chromium no
   * lo reproducía: allí `100vw` no siempre coincide con lo que se ve. Sin este
   * caso, la comprobación pasaba igual con el código roto y no servía de nada.
   */
  const cases = [
    ...PHONES.map((n) => ({ name: n, opts: { ...devices[n] }, gutter: false })),
    { name: 'desajuste de 100vw', opts: { viewport: { width: 500, height: 700 } }, gutter: true },
  ];

  for (const c of cases) {
    const name = c.name;
    const ctx = await browser.newContext(c.opts);
    const page = await ctx.newPage();
    // En /proceso, que es donde apareció el fallo: el panel se abre sobre una
    // página larga y con el nav flotante encima.
    await page.goto(`${base}/proceso.html`, { waitUntil: 'load' });
    if (c.gutter) {
      await page.addStyleTag({
        content:
          'html{scrollbar-gutter:stable both-edges;overflow-y:scroll}' +
          '::-webkit-scrollbar{width:16px;background:#333}',
      });
    }
    await page.waitForTimeout(400);
    await page.click('.chat-launcher');
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const p = document.querySelector('.chat-panel').getBoundingClientRect();
      // Lo que de verdad duele es que se corten los controles, no el borde.
      const out = [];
      for (const el of document.querySelectorAll('.chat-panel *')) {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && (b.right > vw + 0.5 || b.left < -0.5)) {
          out.push(el.className ? String(el.className).trim().split(/\s+/)[0] : el.tagName);
        }
      }
      return {
        gapL: Math.round(p.left),
        gapR: Math.round(vw - p.right),
        w: Math.round(p.width),
        fitsV: p.top >= -0.5 && p.bottom <= vh + 0.5,
        cut: [...new Set(out)].slice(0, 4),
      };
    });
    const ok = Math.abs(r.gapL - r.gapR) <= 1 && r.gapL >= 0 && r.gapR >= 0 && r.cut.length === 0 && r.fitsV;
    if (!ok) {
      fail(
        `chat en ${name}: márgenes ${r.gapL}/${r.gapR}px` +
          (r.cut.length ? `, se cortan: ${r.cut.join(', ')}` : '') +
          (r.fitsV ? '' : ', no cabe de alto')
      );
    }
    console.log(
      `   ${name.padEnd(20)} ancho ${String(r.w).padStart(4)}  izq ${String(r.gapL).padStart(3)}  der ${String(r.gapR).padStart(3)}` +
        `  cortados:${r.cut.length}  ${mark(ok)}`
    );
    await ctx.close();
  }
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

  const { readdir } = await import('node:fs/promises');
  const pages = (await readdir(DIST)).filter((f) => f.endsWith('.html')).sort();

  const browser = await chromium.launch();
  try {
    await checkNav(browser, base);
    await checkPages(browser, base, pages);
    await checkFooter(browser, base);
    await checkChat(browser, base);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n' + '─'.repeat(60));
  if (fails.length === 0) {
    console.log('✅ Todo dentro de presupuesto.');
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
