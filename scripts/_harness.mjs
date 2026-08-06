/**
 * Lo que comparten las auditorías de navegador (`check-mobile`, `check-cotizador`).
 *
 * El guion bajo marca que esto no es un comando: no se corre solo, se importa.
 * Misma convención que `netlify/functions/_retrieval.mts`.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DIST = join(ROOT, 'dist');

/**
 * Playwright: el del proyecto si está, si no el del sistema.
 *
 * NO ES DEPENDENCIA DEL PROYECTO a propósito: arrastra la descarga de un
 * navegador y encarecería cada build de Netlify para algo que solo se corre a
 * mano.
 */
export async function loadPlaywright() {
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

/** Servidor estático mínimo para dist/ (evita otra dependencia). */
export function serveDist() {
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
