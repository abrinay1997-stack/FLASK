/**
 * Captura la portada de cada proyecto publicado y la deja lista para la ficha.
 *
 *   npm run capturas              todos los proyectos de projects.ts
 *   npm run capturas -- livesync-pro acustica-superior    solo esos slugs
 *
 * Por qué un script y no cuatro capturas a mano: las portadas de los clientes
 * cambian. Una captura vieja en el portafolio es un caso que ya no se parece a
 * lo que el visitante encuentra al abrir el enlace de al lado — y esa
 * comparación la puede hacer cualquiera, porque la tarjeta enlaza al sitio en
 * vivo. Repetir esto cada cierto tiempo tiene que costar un comando.
 *
 * QUÉ HACE
 *   1. Lee `slug` y `url` de src/data/projects.ts (fuente única, igual que
 *      `npm run medir`).
 *   2. Abre cada sitio con Playwright, espera a que se asiente y captura el
 *      primer pantallazo — no la página entera: la tarjeta enseña una portada,
 *      y una captura de página completa sale como una cinta larguísima que al
 *      recortarla no se parece a nada.
 *   3. Escribe src/assets/proyectos/<slug>.jpg.
 *
 * DESPUÉS HAY QUE HACER DOS COSAS A MANO, y es a propósito:
 *
 *   a) MIRAR cada captura. El script no distingue una portada de un aviso de
 *      cookies a pantalla completa, de un "sitio en mantenimiento" ni de un
 *      pop-up de descuento. Publicar sin mirar es exactamente el tipo de dato
 *      sin verificar que este repo no admite (ver projects.ts).
 *   b) Enlazarla en src/data/projects.ts — dos líneas, el import arriba y
 *      `image` en la ficha. El script no toca ese archivo: que una captura
 *      exista no significa que valga.
 *
 * NECESITA PLAYWRIGHT, que no es dependencia del proyecto por el mismo motivo
 * que en check-mobile.mjs (arrastra la descarga de un navegador y encarecería
 * cada build de Netlify para algo que se corre a mano):
 *
 *   npm i -D playwright && npx playwright install chromium
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_TS = join(ROOT, 'src/data/projects.ts');
const OUT_DIR = join(ROOT, 'src/assets/proyectos');

/*
 * 1440×900 y sin escalado: la tarjeta pide como mucho 1200px de ancho
 * (`widths` en ProjectCard), así que un original de 1440 ya da de sobra y
 * `astro:assets` lo baja a WebP. Capturar al doble solo engordaría el repo con
 * píxeles que nadie llega a ver: en binarios eso no se deshace, se arrastra en
 * cada clon aunque después se borre el archivo.
 */
const VIEWPORT = { width: 1440, height: 900 };

/*
 * JPEG y no PNG. La tarjeta sirve WebP pase lo que pase (`format="webp"` en
 * ProjectCard), así que guardar el original sin pérdida no mejora ni un píxel
 * de lo que ve el visitante: solo mete ~800 KB por proyecto en el repo, para
 * siempre y en cada clon. A 88 la captura pesa una quinta parte y la diferencia
 * no se ve.
 */
const CALIDAD_JPEG = 88;

/** Margen tras `networkidle` para fuentes, imágenes diferidas y animaciones. */
const SETTLE_MS = 2500;

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
 * Los proyectos salen de projects.ts, que sigue siendo la fuente única
 * ------------------------------------------------------------------ */
function readProjects() {
  const src = readFileSync(PROJECTS_TS, 'utf8');
  const out = [];
  const re = /slug:\s*'([^']+)',[\s\S]*?url:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) out.push({ slug: m[1], url: m[2] });
  return out;
}

/* ------------------------------------------------------------------ *
 * Captura
 * ------------------------------------------------------------------ */
async function capture(browser, project) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    // Con las animaciones de entrada corriendo, cada ejecución sale distinta y
    // a veces pilla un titular a medio aparecer. Pedir reduce-motion deja la
    // portada quieta y hace la captura repetible.
    reducedMotion: 'reduce',
  });

  try {
    const res = await page.goto(project.url, { waitUntil: 'networkidle', timeout: 45_000 });
    const status = res?.status() ?? 0;
    if (status >= 400) throw new Error(`el sitio respondió HTTP ${status}`);

    await page.waitForTimeout(SETTLE_MS);
    // Arriba del todo: si algo dejó la página desplazada, la portada no es lo
    // que se captura.
    await page.evaluate(() => window.scrollTo(0, 0));

    const file = join(OUT_DIR, `${project.slug}.jpg`);
    await page.screenshot({ path: file, fullPage: false, type: 'jpeg', quality: CALIDAD_JPEG });
    return file;
  } finally {
    await page.close();
  }
}

/* ------------------------------------------------------------------ *
 * Cómo enlazarla después
 * ------------------------------------------------------------------ */
function comoEnlazar(slugs) {
  const imports = slugs
    .map((s) => `import ${camel(s)} from '../assets/proyectos/${s}.jpg';`)
    .join('\n');
  const fichas = slugs.map((s) => `  // en la ficha '${s}':\n  image: ${camel(s)},`).join('\n');
  return `Arriba de src/data/projects.ts:\n\n${imports}\n\nY en cada ficha:\n\n${fichas}`;
}

const camel = (slug) => slug.replace(/-(\w)/g, (_, c) => c.toUpperCase());

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */
async function main() {
  const filtros = process.argv.slice(2);
  const todos = readProjects();
  if (todos.length === 0) {
    console.error('No se encontró ningún proyecto en src/data/projects.ts');
    process.exit(1);
  }

  const projects = filtros.length ? todos.filter((p) => filtros.includes(p.slug)) : todos;
  if (projects.length === 0) {
    console.error(`Ningún proyecto coincide con: ${filtros.join(', ')}`);
    console.error(`Slugs disponibles: ${todos.map((p) => p.slug).join(', ')}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch();

  console.log(`Capturando ${projects.length} portada(s) a ${VIEWPORT.width}×${VIEWPORT.height}…\n`);
  const ok = [];
  const fallidos = [];

  try {
    for (const p of projects) {
      process.stdout.write(`→ ${p.url}\n`);
      try {
        const file = await capture(browser, p);
        console.log(`   ${file.replace(ROOT + '/', '')}\n`);
        ok.push(p.slug);
      } catch (err) {
        console.error(`   ✗ ${err.message}\n`);
        fallidos.push(p.slug);
      }
    }
  } finally {
    await browser.close();
  }

  if (ok.length > 0) {
    console.log('─'.repeat(64));
    console.log('ABRE LAS CAPTURAS ANTES DE PUBLICARLAS. El script no sabe si lo que');
    console.log('salió es la portada o un aviso de cookies tapándola.\n');
    console.log(comoEnlazar(ok));
    console.log('');
  }

  if (fallidos.length > 0) {
    console.error(`No se pudo capturar: ${fallidos.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
