export interface Plan {
  slug: string;
  name: string;
  price: string;
  delivery: string;
  desc: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}

/**
 * Orden visual (Corporate primero = anclaje).
 * Cambiar precio o plan aquí propaga a landing + selector del formulario.
 */
export const plans: Plan[] = [
  {
    slug: 'corporate',
    name: 'Flask Corporate',
    price: '$850',
    delivery: 'Entrega 8–12 días',
    featured: true,
    badge: 'Recomendado',
    desc: 'Sitio corporativo hasta 10 páginas con CMS autogestionable, blog y SEO técnico completo. El plan que reemplaza al WordPress de $1,200 de las agencias.',
    features: [
      'Hasta 10 páginas a medida',
      'CMS Supabase autogestionable',
      'Blog + SEO técnico',
      'Formularios → WhatsApp / correo',
      'Analytics + Search Console',
      'Deploy en Netlify + dominio',
    ],
  },
  {
    slug: 'launch',
    name: 'Flask Launch',
    price: '$450',
    delivery: 'Entrega 4–5 días',
    desc: 'One-page premium de 7 secciones, diseño 100 % a medida. Para negocios que compran pauta y necesitan una landing que convierta.',
    features: [
      '7 secciones a medida',
      'SEO on-page completo',
      'Formulario → WhatsApp',
      'Analytics + píxel',
      'Deploy en Netlify',
    ],
  },
  {
    slug: 'commerce',
    name: 'Flask Commerce',
    price: '$1,200',
    delivery: 'Entrega 15–20 días',
    desc: 'Todo lo de Corporate más catálogo con inventario, carrito y pasarela local. Pensado para el e-commerce PYME panameño.',
    features: [
      'Todo lo de Corporate',
      'Catálogo + inventario',
      'Carrito y checkout',
      'Yappy (Tilopay) + tarjeta + PayPal',
      'Panel de pedidos',
    ],
  },
  {
    slug: 'start',
    name: 'Flask Start',
    price: '$295',
    delivery: 'Entrega 72 h',
    desc: 'One-page ejecutivo de 4–5 secciones sobre plantilla vertical propia. Para emprendedores, eventos y campañas puntuales.',
    features: [
      '4–5 secciones',
      'Diseño sobre plantilla propia',
      'Formulario → WhatsApp',
      'Analytics básico',
      'Deploy en Netlify',
    ],
  },
];

export const diagnostico = {
  slug: 'diagnostico',
  name: 'Diagnóstico FLASK',
  price: '$49',
  desc: 'Reporte PageSpeed de tu sitio actual + 3 fallas de conversión detectadas + plan de una página + llamada de 30 min. Entrega en 48 h.',
} as const;

/**
 * Opciones del <select> en /contacto — se genera de plans + diagnostico + extras.
 */
export interface PlanOption {
  value: string;
  label: string;
}

export const planOptions: PlanOption[] = [
  ...plans.map((p) => ({ value: p.slug, label: `${p.name} — ${p.price}` })),
  { value: diagnostico.slug, label: `${diagnostico.name} — ${diagnostico.price}` },
  { value: 'modulos', label: 'Sistema por módulos' },
  { value: 'care', label: 'Solo mantenimiento (Care)' },
  { value: 'otro', label: 'Aún no lo sé' },
];
