export interface CarePlan {
  name: string;
  price: string;
  suffix: string;
  features: string[];
  featured?: boolean;
}

/**
 * Planes de mantenimiento. Igual que en el resto del sitio: qué consigues, no
 * con qué se hace.
 */
export const carePlans: CarePlan[] = [
  {
    name: 'Care Base',
    price: '$35',
    suffix: '/mes',
    features: [
      'Tu sitio en línea, con su dominio y su candado de seguridad',
      'Vigilado día y noche por si se cae',
      'Copia de seguridad automática',
      '1 hora de cambios al mes',
    ],
  },
  {
    name: 'Care Pro',
    price: '$75',
    suffix: '/mes',
    featured: true,
    features: [
      'Todo lo de Base',
      '3 horas de cambios al mes',
      'Seguimos trabajando para que salgas en Google',
      'Un informe mensual de cómo va',
      'Te respondemos en menos de 24 horas',
    ],
  },
  {
    name: 'Care Business',
    price: '$150–$250',
    suffix: '/mes',
    features: [
      'Todo lo de Pro',
      '6–8 horas de cambios al mes',
      'Nos ocupamos también de tus sistemas conectados',
      'Te avisamos nosotros antes de que lo notes',
      'Te respondemos en menos de 4 horas',
    ],
  },
];

export const careNote =
  'Pago anual adelantado: dos meses gratis en cualquier plan. Sin permanencia forzada.';
