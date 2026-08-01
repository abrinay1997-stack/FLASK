export interface Service {
  idx: string;
  title: string;
  desc: string;
}

export const services: Service[] = [
  {
    idx: '01',
    title: 'Velocidad como servicio',
    desc: 'Arquitectura Jamstack sobre CDN. Sin plugins pesados, sin base de datos expuesta. PageSpeed ≥90 garantizado en móvil y escritorio.',
  },
  {
    idx: '02',
    title: 'Seguridad por diseño',
    desc: 'Sitios headless con superficie de ataque mínima. Adiós a los hackeos crónicos de WordPress y sus plugins desactualizados.',
  },
  {
    idx: '03',
    title: 'Entrega en días',
    desc: 'Metodología productizada con plantillas propias por vertical. Un Launch sale en 5 días, no en 4 semanas. El código llega a tu GitHub al pago final.',
  },
];

export interface ProcesoStep {
  num: string;
  title: string;
  desc: string;
}

export const procesoSteps: ProcesoStep[] = [
  {
    num: '01',
    title: '50 % adelanto',
    desc: 'No arrancamos sin depósito. La factura y el alcance quedan por escrito antes de la primera línea de código.',
  },
  {
    num: '02',
    title: 'El código es tuyo',
    desc: 'Al pago final transferimos el repositorio a tu propio GitHub. Nada de rehenes tecnológicos: te vas cuando quieras.',
  },
  {
    num: '03',
    title: 'Revisiones claras',
    desc: 'Cada paquete incluye rondas de revisión definidas. Si necesitas más, cada revisión extra cuesta $40. Punto.',
  },
];

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/#servicios', label: 'Ventajas' },
  { href: '/#planes', label: 'Planes' },
  { href: '/#modulos', label: 'Módulos' },
  { href: '/#care', label: 'Mantenimiento' },
  { href: '/contacto.html', label: 'Contacto' },
];
