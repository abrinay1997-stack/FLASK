/**
 * Punto único de configuración de animación.
 *
 * Aquí vivía el registro de GSAP + ScrollTrigger. Se quitó: lo único que el
 * sitio hacía con ellos era marcar un elemento como visible al entrar en
 * pantalla, y eso lo resuelve `IntersectionObserver` sin cargar nada. GSAP
 * pesaba 43 KB comprimidos —el 74 % de todo el JS del sitio— por ese trabajo,
 * en una página cuyo argumento de venta es abrir en menos de un segundo.
 *
 * Regla que deja escrita esa decisión: **este sitio no carga una librería de
 * animación.** El movimiento se hace con transiciones CSS y lo único que decide
 * JavaScript es cuándo dispararlas. Si algún día hiciera falta una línea de
 * tiempo de verdad (scrub, pin, morphing), se vuelve a evaluar; para reveals y
 * scroll suave no hace falta.
 */

/** Detecta si el usuario pidió reducir animaciones. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Detecta si es un dispositivo táctil (para desactivar efectos de hover). */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}
