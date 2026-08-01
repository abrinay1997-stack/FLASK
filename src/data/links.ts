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
  home: BASE, // termina con '/', p. ej. '/FLASK/' o '/'
  contacto: withBase('contacto.html'),
  gracias: withBase('gracias.html'),
};

/** Ancla dentro de la home (usa # solo si estás EN la home; si no, prefija con home). */
export function homeAnchor(hash: string): string {
  return `${BASE}${hash}`;
}
