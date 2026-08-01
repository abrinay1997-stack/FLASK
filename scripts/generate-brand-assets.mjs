/**
 * Genera los assets de marca estáticos que viven en `public/`:
 *
 *   public/favicon.svg          — marca vectorial (rayo naranja sobre negro)
 *   public/favicon-32.png       — fallback para navegadores viejos
 *   public/apple-touch-icon.png — 180×180, iOS
 *   public/og.png               — 1200×630, imagen social (OpenGraph / Twitter)
 *
 * Se corre a mano cuando cambie el branding, NO en cada build:
 *
 *   npm run brand
 *
 * Los PNG resultantes se commitean. El build de Astro solo los copia.
 *
 * Nota sobre fuentes: @fontsource solo distribuye woff/woff2, y librsvg (el
 * renderer de SVG dentro de sharp) resuelve fuentes vía fontconfig, que no lee
 * woff. El script descomprime el woff a sfnt (un woff es un sfnt con las tablas
 * en zlib) y lo instala en ~/.fonts antes de render.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

/* ------------------------------------------------------------------ *
 * Tokens de marca — deben coincidir con src/styles/global.css
 * ------------------------------------------------------------------ */
const DEEP_BLACK = '#100101';
const FLASH_ORANGE = '#FF5100';
const EMBER_RED = '#FF1E1E';
const SOFT_WHITE = '#FFF7F7';
const STUDIO_GRAY = '#BABABA';

/* ------------------------------------------------------------------ *
 * 1. Fuentes: woff → sfnt → ~/.fonts
 * ------------------------------------------------------------------ */
function woffToSfnt(buf) {
  if (buf.toString('latin1', 0, 4) !== 'wOFF') throw new Error('no es un WOFF v1');
  const flavor = buf.readUInt32BE(4);
  const numTables = buf.readUInt16BE(12);

  const pad4 = (n) => (n + 3) & ~3;
  let cursor = 12 + numTables * 16;

  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 44 + i * 20;
    const tag = buf.toString('latin1', o, o + 4);
    const offset = buf.readUInt32BE(o + 4);
    const compLength = buf.readUInt32BE(o + 8);
    const origLength = buf.readUInt32BE(o + 12);
    const checksum = buf.readUInt32BE(o + 16);

    const raw = buf.subarray(offset, offset + compLength);
    const data = compLength === origLength ? Buffer.from(raw) : inflateSync(raw);
    if (data.length !== origLength) throw new Error(`tabla ${tag}: longitud inesperada`);

    tables.push({ tag, checksum, data, sfntOffset: cursor });
    cursor += pad4(origLength);
  }

  const out = Buffer.alloc(cursor, 0);
  const pow2 = Math.floor(Math.log2(numTables));
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  out.writeUInt16BE(16 * 2 ** pow2, 6);
  out.writeUInt16BE(pow2, 8);
  out.writeUInt16BE(numTables * 16 - 16 * 2 ** pow2, 10);

  // El directorio sfnt va ordenado alfabéticamente por tag
  [...tables]
    .sort((a, b) => (a.tag < b.tag ? -1 : 1))
    .forEach((t, i) => {
      const o = 12 + i * 16;
      out.write(t.tag, o, 4, 'latin1');
      out.writeUInt32BE(t.checksum, o + 4);
      out.writeUInt32BE(t.sfntOffset, o + 8);
      out.writeUInt32BE(t.data.length, o + 12);
    });
  tables.forEach((t) => t.data.copy(out, t.sfntOffset));
  return out;
}

function installFonts() {
  const dir = join(homedir(), '.fonts');
  mkdirSync(dir, { recursive: true });
  let installed = 0;
  for (const weight of [400, 600, 700]) {
    const src = join(ROOT, 'node_modules/@fontsource/archivo/files', `archivo-latin-${weight}-normal.woff`);
    if (!existsSync(src)) continue;
    writeFileSync(join(dir, `Archivo-${weight}.ttf`), woffToSfnt(readFileSync(src)));
    installed++;
  }
  if (!installed) {
    console.warn('⚠  No se encontró @fontsource/archivo — el texto caerá a la fuente por defecto.');
    return;
  }
  try {
    execFileSync('fc-cache', ['-f'], { stdio: 'ignore' });
  } catch {
    console.warn('⚠  fc-cache no disponible; si el texto sale con otra fuente, esa es la causa.');
  }
  console.log(`· ${installed} pesos de Archivo instalados en ~/.fonts`);
}

/* ------------------------------------------------------------------ *
 * 2. Marca: rayo sobre cuadrado negro
 * ------------------------------------------------------------------ */
// Rayo dibujado sobre un viewBox de 64×64, centrado.
const BOLT = 'M37.5 6 18 35.5h11.2L26.5 58 46 28.5H34.8L37.5 6Z';

function iconSvg(size, { rounded = true } = {}) {
  const r = rounded ? size * 0.22 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bolt" x1="18" y1="6" x2="46" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${FLASH_ORANGE}"/>
      <stop offset="1" stop-color="${EMBER_RED}"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="${(r / size) * 64}" fill="${DEEP_BLACK}"/>
  <path d="${BOLT}" fill="url(#bolt)"/>
</svg>`;
}

/* ------------------------------------------------------------------ *
 * 3. Imagen social 1200×630
 * ------------------------------------------------------------------ */
function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.86" cy="0.08" r="0.75">
      <stop offset="0" stop-color="${FLASH_ORANGE}" stop-opacity="0.85"/>
      <stop offset="0.38" stop-color="#EE0000" stop-opacity="0.42"/>
      <stop offset="1" stop-color="${DEEP_BLACK}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${FLASH_ORANGE}"/>
      <stop offset="1" stop-color="${FLASH_ORANGE}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${EMBER_RED}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${EMBER_RED}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${EMBER_RED}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="boltG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${FLASH_ORANGE}"/>
      <stop offset="1" stop-color="${EMBER_RED}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${DEEP_BLACK}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Estelas: eco del shader del hero -->
  <g opacity="0.55">
    <rect x="620" y="150" width="620" height="2" fill="url(#streak)" transform="rotate(-14 620 150)"/>
    <rect x="560" y="238" width="720" height="3" fill="url(#streak)" transform="rotate(-14 560 238)"/>
    <rect x="700" y="322" width="520" height="2" fill="url(#streak)" transform="rotate(-14 700 322)"/>
    <rect x="640" y="410" width="640" height="2" fill="url(#streak)" transform="rotate(-14 640 410)"/>
  </g>

  <!-- Wordmark -->
  <g transform="translate(80 92)">
    <g transform="translate(0 -30) scale(0.75)">
      <path d="${BOLT}" fill="url(#boltG)"/>
    </g>
    <text x="62" y="18" font-family="Archivo" font-weight="700" font-size="34"
          letter-spacing="1" fill="${SOFT_WHITE}">CuatroNodos</text>
    <text x="305" y="18" font-family="Archivo" font-weight="700" font-size="34"
          fill="${FLASH_ORANGE}">.</text>
  </g>

  <rect x="80" y="140" width="420" height="1" fill="url(#rule)"/>

  <!-- Titular -->
  <text x="80" y="292" font-family="Archivo" font-weight="700" font-size="84"
        letter-spacing="-2.4" fill="${SOFT_WHITE}">Sitios que <tspan fill="${EMBER_RED}">encienden</tspan>.</text>
  <text x="80" y="386" font-family="Archivo" font-weight="700" font-size="84"
        letter-spacing="-2.4" fill="${SOFT_WHITE}">Código <tspan fill="${EMBER_RED}">tuyo</tspan>.</text>

  <!-- Bajada -->
  <text x="80" y="452" font-family="Archivo" font-weight="400" font-size="26"
        fill="${STUDIO_GRAY}">Sitios Jamstack en Panamá · carga en menos de 1 s · desde $295</text>

  <!-- Pie -->
  <rect x="80" y="516" width="1040" height="1" fill="#FFFFFF" opacity="0.12"/>
  <text x="80" y="562" font-family="Archivo" font-weight="600" font-size="22"
        letter-spacing="2" fill="${FLASH_ORANGE}">CÓDIGO EN TU GITHUB</text>
  <text x="1120" y="562" text-anchor="end" font-family="Archivo" font-weight="400" font-size="22"
        fill="${STUDIO_GRAY}">Entrega en días, no en semanas</text>
</svg>`;
}

/* ------------------------------------------------------------------ *
 * Render
 * ------------------------------------------------------------------ */
async function main() {
  installFonts();
  mkdirSync(PUBLIC, { recursive: true });

  // favicon.svg — se sirve tal cual, sin rasterizar
  writeFileSync(join(PUBLIC, 'favicon.svg'), iconSvg(64));

  const jobs = [
    ['favicon-32.png', iconSvg(32), 32],
    ['apple-touch-icon.png', iconSvg(180, { rounded: false }), 180],
    ['og.png', ogSvg(), 1200],
  ];

  for (const [name, svg, width] of jobs) {
    const buf = await sharp(Buffer.from(svg), { density: 384 })
      .resize({ width })
      .png({ compressionLevel: 9, palette: name !== 'og.png' })
      .toBuffer();
    writeFileSync(join(PUBLIC, name), buf);
    console.log(`· ${name} — ${(buf.length / 1024).toFixed(1)} kB`);
  }

  console.log('✓ Assets de marca generados en public/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
