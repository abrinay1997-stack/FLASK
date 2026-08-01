/**
 * Helpers de URLs para respetar el `base` de Astro.
 *
 * En dev  → BASE_URL = '/'         → withBase('contacto.html') = '/contacto.html'
 * En prod → BASE_URL = '/FLASK'    → withBase('contacto.html') = '/FLASK/contacto.html'
 *
 * Regla: NUNCA hardcodear rutas con '/…' en templates. Usar siempre withBase() o routes.*
 */

// Normalizamos: siempre garantizamos trailing slash para poder concatenar sin sorpresas.
const RAW = import.meta.env.BASE_URL;
const BASE = RAW.endsWith('/') ? RAW : `${RAW}/`;

/** Une el base con una ruta interna. Acepta hashes y query strings. */
export function withBase(path: string): string {
  // Enlaces externos y anclas puras pasan tal cual
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('#')) return path;
  const clean = path.replace(/^\/+/, '');
  return `${BASE}${clean}`;
}

/** Rutas internas nombradas — punto único de verdad. */
export const routes = {
  home: BASE,
  servicios: withBase('servicios.html'),
  planes: withBase('planes.html'),
  proceso: withBase('proceso.html'),
  sobre: withBase('sobre.html'),
  cotizador: withBase('cotizador.html'),
  contacto: withBase('contacto.html'),
  gracias: withBase('gracias.html'),
};

/** Ancla dentro de una ruta. */
export function anchor(route: string, hash: string): string {
  return `${route}${hash}`;
}
