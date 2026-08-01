/**
 * Punto único de configuración de animación.
 * - Registra plugins de GSAP una sola vez.
 * - Detecta prefers-reduced-motion y expone `motionEnabled`.
 * - Compatible con View Transitions API de Astro (re-init en cada page load).
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/** Detecta si el usuario pidió reducir animaciones. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Detecta si es un dispositivo táctil (para desactivar cursor custom). */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/** Registra plugins de GSAP. Idempotente. */
export function registerPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Limpia todos los ScrollTrigger existentes.
 * Llamar antes de navegar entre páginas con View Transitions.
 */
export function killAllTriggers(): void {
  if (typeof window === 'undefined') return;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

/** Refresca ScrollTrigger tras cambios de DOM (nueva página, resize, etc.). */
export function refreshTriggers(): void {
  if (typeof window === 'undefined') return;
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
