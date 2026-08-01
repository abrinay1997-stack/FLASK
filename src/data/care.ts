export interface CarePlan {
  name: string;
  price: string;
  suffix: string;
  features: string[];
  featured?: boolean;
}

export const carePlans: CarePlan[] = [
  {
    name: 'Care Base',
    price: '$35',
    suffix: '/mes',
    features: [
      'Hosting + dominio + SSL',
      'Monitoreo 24/7',
      'Backups automáticos',
      '1 hora de cambios / mes',
    ],
  },
  {
    name: 'Care Pro',
    price: '$75',
    suffix: '/mes',
    featured: true,
    features: [
      'Todo lo de Base',
      '3 horas de cambios / mes',
      'SEO técnico continuo',
      'Reporte mensual',
      'Respuesta < 24 h',
    ],
  },
  {
    name: 'Care Business',
    price: '$150–$250',
    suffix: '/mes',
    features: [
      'Todo lo de Pro',
      '6–8 horas de cambios / mes',
      'Gestión Supabase / Railway',
      'Alertas dedicadas',
      'SLA < 4 h',
    ],
  },
];

export const careNote =
  'Pago anual adelantado: dos meses gratis en cualquier plan. Sin permanencia forzada.';
