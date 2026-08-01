/**
 * Punto único de verdad de las imágenes cinemáticas del sitio.
 *
 * Los originales viven en `stitch_3d_web_creation_hero/` (referencia, 16:9,
 * ~1.3 MB cada uno). Los que están en uso se copian a `src/assets/<página>/`
 * con nombre kebab-case y se importan aquí: Astro los procesa con
 * `astro:assets` y emite WebP responsive, así que el PNG pesado nunca llega
 * al navegador.
 *
 * Para cambiar la imagen de una sección se edita este archivo, no la página.
 */
import velocidad from '../assets/servicios/velocidad.png';
import seguridad from '../assets/servicios/seguridad.png';
import entrega from '../assets/servicios/entrega.png';
import webGrid from '../assets/sobre/web-grid.png';
import interfaz from '../assets/sobre/interfaz.png';
import flujo from '../assets/proceso/flujo.png';
import start from '../assets/planes/start.png';
import corporate from '../assets/planes/corporate.png';

export interface Visual {
  src: ImageMetadata;
  /** Texto alternativo. Describe la imagen, no repite el titular contiguo. */
  alt: string;
  /** `object-position` cuando el recorte no es 16:9 y el sujeto no va centrado. */
  focus?: string;
}

/** Visual de cada pilar de /servicios, indexado por `Service.idx`. */
export const serviceVisuals: Record<string, Visual> = {
  '01': {
    src: velocidad,
    alt: 'Proyectil oscuro atravesando estelas de luz roja a alta velocidad.',
    focus: '62% center',
  },
  '02': {
    src: seguridad,
    alt: 'Monolitos negros con circuitos rojos alzados sobre una llanura fracturada.',
    focus: 'center 45%',
  },
  '03': {
    src: entrega,
    alt: 'Hélice de bloques de cristal rojo encajados uno tras otro, como código estructurado.',
    focus: 'center center',
  },
};

/** /sobre — manifiesto y bloque de quiénes están detrás. */
export const sobreVisuals = {
  manifiesto: {
    src: webGrid,
    alt: 'Retícula infinita de servidores encendidos en rojo, perdiéndose en el horizonte.',
    focus: 'center 60%',
  },
  interfaz: {
    src: interfaz,
    alt: 'Una mano de cristal oscuro tocando una esfera de datos incandescente.',
    focus: '58% center',
  },
} satisfies Record<string, Visual>;

/** /proceso — banda cinemática entre el hero y los pasos. */
export const procesoVisual: Visual = {
  src: flujo,
  alt: 'Cintas de luz roja trenzándose sobre una superficie de obsidiana pulida.',
  focus: 'center 55%',
};

/** /planes — vitrina de los dos planes con mayor demanda, por slug. */
export const planVisuals: Record<string, Visual> = {
  start: {
    src: start,
    alt: 'Esfera de roca incandescente flotando sola en una cámara oscura.',
    focus: 'center center',
  },
  corporate: {
    src: corporate,
    alt: 'Estructura corporativa de cristal negro con vetas rojas en un espacio iluminado.',
    focus: 'center center',
  },
};
