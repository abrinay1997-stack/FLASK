/**
 * Trabajo publicado.
 *
 * REGLA DE ESTE ARCHIVO: aquí solo entra lo verificable.
 *
 * Todo lo que no sea el nombre, el dominio y el enlace es opcional y está sin
 * rellenar a propósito. La página omite el campo que no existe, así que una
 * ficha a medias se ve corta pero nunca falsa.
 *
 * El motivo no es prudencia decorativa: el argumento entero del sitio es que
 * los números se miden. Una cifra inflada aquí desmonta las otras nueve
 * páginas. Es preferible enseñar cuatro enlaces reales sin adornos que cuatro
 * fichas completas que no aguanten una comprobación.
 *
 * CÓMO COMPLETAR UNA FICHA
 *   1. `sector`, `year`, `summary`, `challenge`, `solution` — los escribe quien
 *      hizo el proyecto. `summary` es una frase; `challenge` y `solution`, un
 *      párrafo corto cada uno. Mismo criterio que en services.ts: el dolor del
 *      cliente antes que la herramienta.
 *   2. `metrics` — medidas de verdad, no recordadas: `npm run medir` las saca de
 *      Lighthouse y las devuelve listas para pegar, con su `measuredAt`. Si no
 *      se midió, se deja el array vacío y la banda no aparece.
 *   3. `capabilities` — qué del catálogo se aplicó, con el mismo vocabulario de
 *      modules.ts, para que el visitante ate el caso con lo que puede contratar.
 *   4. `image` — `npm run capturas` abre cada sitio de esta lista y deja la
 *      portada en `src/assets/proyectos/<slug>.jpg`. Míralas antes de
 *      publicarlas (el script no distingue una portada de un aviso de cookies
 *      tapándola) y luego enlázalas: el import arriba y `image` en la ficha, que
 *      es lo único que el script no hace por ti. Sin captura, la tarjeta cae a
 *      un tratamiento tipográfico que ya se ve intencionado; no hace falta poner
 *      una imagen de relleno.
 */

export interface ProjectMetric {
  /**
   * Etiqueta corta: «Carga», «Prueba de Google», «Productos».
   * En el idioma del cliente, como el resto del sitio: nada de nombres de
   * herramienta que solo reconozca un programador.
   */
  k: string;
  /** El valor medido, con su unidad. */
  v: string;
}

export interface Project {
  slug: string;
  /** Cómo se nombra el proyecto en la ficha. */
  name: string;
  /** Dominio visible, sin protocolo. Es lo que sostiene la tarjeta sin captura. */
  domain: string;
  url: string;

  /** Sector en una o dos palabras. */
  sector?: string;
  /** Año de entrega. */
  year?: string;
  /** Qué es, en una frase. */
  summary?: string;
  /** De qué se partía. */
  challenge?: string;
  /** Qué se construyó. */
  solution?: string;
  /** Medidas reales. Vacío = no se dibuja la banda de métricas. */
  metrics?: ProjectMetric[];
  /** Fecha de la medición. Sin ella las métricas no se publican. */
  measuredAt?: string;
  /** Capacidades del catálogo aplicadas en este proyecto. */
  capabilities?: string[];
  /** Captura del sitio. */
  image?: ImageMetadata;
  /** Ocupa el doble de ancho en la retícula. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'bukoflow-play',
    name: 'Bukoflow Play',
    domain: 'play.bukoflow.com',
    url: 'https://play.bukoflow.com/',
    // TODO(contenido): sector, year, summary, challenge, solution, capabilities.
    // TODO(medición): `npm run medir` → metrics + measuredAt.
  },
  {
    slug: 'livesync-pro',
    name: 'LiveSync Pro',
    domain: 'livesyncpro.com',
    url: 'https://livesyncpro.com/',
    // TODO(contenido): sector, year, summary, challenge, solution, capabilities.
    // TODO(medición): `npm run medir` → metrics + measuredAt.
  },
  {
    slug: 'acustica-superior',
    name: 'Acústica Superior',
    domain: 'acusticasuperior.com',
    url: 'https://acusticasuperior.com/',
    // TODO(contenido): sector, year, summary, challenge, solution, capabilities.
    // TODO(medición): `npm run medir` → metrics + measuredAt.
  },
  {
    slug: 'bukoflow-tienda',
    name: 'Bukoflow Tienda',
    domain: 'tienda.bukoflow.com',
    url: 'https://tienda.bukoflow.com/',
    // TODO(contenido): sector, year, summary, challenge, solution, capabilities.
    // TODO(medición): `npm run medir` → metrics + measuredAt.
  },
];

/**
 * Las métricas solo se publican si además se sabe cuándo se tomaron. Una cifra
 * sin fecha envejece sin avisar y acaba siendo mentira sin que nadie la tocara.
 */
export function publishedMetrics(project: Project): ProjectMetric[] {
  if (!project.measuredAt) return [];
  return project.metrics ?? [];
}
