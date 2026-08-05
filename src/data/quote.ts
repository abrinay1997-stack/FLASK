/**
 * Motor del cotizador.
 *
 * Todo lo que hay aquí se deriva de `plans.ts` y `modules.ts`: este archivo NO
 * inventa precios, los compone. Si cambia el precio de un plan o de una
 * capacidad, el cotizador se actualiza solo.
 *
 * Es lógica pura y sin dependencias del DOM para que la pueda usar tanto el
 * render de Astro como el script del navegador, con exactamente el mismo
 * resultado. Un cotizador que dice un número distinto al de /planes destruye
 * justo la confianza que el sitio vende.
 */
import { plans, type Plan } from './plans';
import { modules } from './modules';

/* ------------------------------------------------------------------ *
 * Precios: de texto a número
 * ------------------------------------------------------------------ */

export interface Money {
  min: number;
  max: number;
}

/** '$1,200' → {min:1200,max:1200} · '$250–$900' → {min:250,max:900} */
export function parsePrice(price: string): Money {
  const nums = price.replace(/,/g, '').match(/\d+(\.\d+)?/g)?.map(Number) ?? [0];
  return { min: nums[0]!, max: nums[nums.length - 1]! };
}

export function formatMoney({ min, max }: Money): string {
  const f = (n: number) => `$${n.toLocaleString('en-US')}`;
  return min === max ? f(min) : `${f(min)} – ${f(max)}`;
}

/* ------------------------------------------------------------------ *
 * Pasos
 * ------------------------------------------------------------------ */

export interface QuoteOption {
  value: string;
  label: string;
  hint: string;
  /** Plan mínimo que exige esta respuesta. */
  requiresPlan?: PlanSlug;
}

export interface QuoteStep {
  id: string;
  /** La pregunta, en segunda persona. */
  question: string;
  help: string;
  multiple: boolean;
  options: QuoteOption[];
}

export type PlanSlug = 'start' | 'launch' | 'corporate' | 'commerce';

/** De menor a mayor. El plan recomendado es el mayor que exija alguna respuesta. */
const PLAN_ORDER: PlanSlug[] = ['start', 'launch', 'corporate', 'commerce'];

export const steps: QuoteStep[] = [
  {
    id: 'objetivo',
    question: '¿Qué necesitas hacer?',
    help: 'Elige lo que más se parezca. Nada de esto es definitivo.',
    multiple: false,
    options: [
      { value: 'nuevo', label: 'Estrenar sitio', hint: 'Aún no tienes nada en línea.', requiresPlan: 'start' },
      { value: 'rehacer', label: 'Rehacer el que tengo', hint: 'Existe, pero va lento o da vergüenza.', requiresPlan: 'launch' },
      { value: 'vender', label: 'Vender en línea', hint: 'Catálogo, carrito y cobros.', requiresPlan: 'commerce' },
      { value: 'sistema', label: 'Un sistema a medida', hint: 'Reservas, portal de clientes, panel interno.', requiresPlan: 'corporate' },
    ],
  },
  {
    id: 'alcance',
    question: '¿De qué tamaño?',
    help: 'Si dudas entre dos, elige el más pequeño: ampliar después cuesta lo mismo.',
    multiple: false,
    options: [
      { value: 'una', label: 'Una sola página', hint: '4–5 secciones. Para un evento o una campaña.', requiresPlan: 'start' },
      { value: 'landing', label: 'Una página, a medida', hint: '7 secciones diseñadas desde cero. Para pauta.', requiresPlan: 'launch' },
      { value: 'multi', label: 'Varias páginas', hint: 'Hasta 10. Servicios, nosotros, contacto, blog.', requiresPlan: 'corporate' },
      { value: 'catalogo', label: 'Catálogo completo', hint: 'Productos, inventario y checkout.', requiresPlan: 'commerce' },
    ],
  },
  {
    id: 'capacidades',
    question: '¿Qué tiene que hacer, además de existir?',
    help: 'Marca todas las que apliquen. Las que ya vengan en tu plan salen sin coste.',
    multiple: true,
    options: [
      { value: 'form', label: 'Recibir mensajes por WhatsApp', hint: 'Quien te escriba te llega al teléfono.' },
      { value: 'blog', label: 'Salir en Google', hint: 'Blog y todo lo que hace falta para posicionar.', requiresPlan: 'corporate' },
      { value: 'cms', label: 'Editarlo tú mismo', hint: 'Cambiar textos e imágenes sin llamar a nadie.', requiresPlan: 'corporate' },
      { value: 'reservas', label: 'Reservas y citas', hint: 'Tus clientes reservan solos, sin llamarte.' },
      { value: 'cobros', label: 'Cobrar en línea', hint: 'Yappy, tarjeta y PayPal.', requiresPlan: 'commerce' },
      { value: 'login', label: 'Cuentas de usuario', hint: 'Cada persona entra con su clave.' },
      { value: 'panel', label: 'Panel de control', hint: 'Tus números y tu gestión en una pantalla.' },
      { value: 'portal', label: 'Portal de clientes', hint: 'Cada cliente consulta lo suyo sin escribirte.' },
      { value: 'api', label: 'Conectar con otro sistema', hint: 'Que tu web y tu programa dejen de ir por separado.' },
      { value: 'ia', label: 'Respuestas automáticas', hint: 'Contestar lo de siempre por WhatsApp, a cualquier hora.' },
      { value: 'inventario', label: 'Control de inventario', hint: 'Dejar de vender lo que no tienes.' },
    ],
  },
  {
    id: 'urgencia',
    question: '¿Para cuándo lo necesitas?',
    help: 'Esto no cambia el precio. Cambia cómo ordenamos la cola.',
    multiple: false,
    options: [
      { value: 'ya', label: 'Ya', hint: 'Esta semana, si se puede.' },
      { value: 'mes', label: 'Este mes', hint: 'Hay fecha, pero no es hoy.' },
      { value: 'flexible', label: 'Sin prisa', hint: 'Quiero saber cuánto cuesta y planificar.' },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Capacidades → qué las cubre
 * ------------------------------------------------------------------ */

/**
 * Cada capacidad se resuelve de una de dos formas:
 *  - `includedFrom`: a partir de ese plan viene incluida y no suma nada.
 *  - `moduleName`: se cobra aparte, con el precio literal de `modules.ts`.
 * Una capacidad puede tener ambas: incluida en planes altos, módulo en bajos.
 */
export interface CapabilityRule {
  includedFrom?: PlanSlug;
  moduleName?: string;
}

export const CAPABILITIES: Record<string, CapabilityRule> = {
  form: { includedFrom: 'start' }, // los cuatro planes lo traen
  blog: { includedFrom: 'corporate' },
  cms: { includedFrom: 'corporate' },
  cobros: { includedFrom: 'commerce' },
  inventario: { includedFrom: 'commerce', moduleName: 'Control de inventario' },
  reservas: { moduleName: 'Reservas y citas' },
  login: { moduleName: 'Cuentas de usuario' },
  panel: { moduleName: 'Panel de control' },
  portal: { moduleName: 'Portal de clientes' },
  api: { moduleName: 'Conexión con otro sistema' },
  ia: { moduleName: 'Respuestas automáticas con IA' },
};

/* ------------------------------------------------------------------ *
 * Etiquetas de precio para las opciones
 * ------------------------------------------------------------------ */

/**
 * Cada opción enseña lo que cuesta ANTES de marcarla.
 *
 * Sin esto el cotizador se comporta como un carrito sin precios: marcar sale
 * gratis, el entusiasmo no encuentra freno y el total aparece de golpe al
 * final. Una cifra de cuatro dígitos sin aviso previo no se lee como
 * presupuesto, se lee como sorpresa — y la sorpresa mata la venta.
 */
export function optionPriceLabel(stepId: string, value: string): string | null {
  if (stepId === 'urgencia') return null;

  const opt = steps.find((s) => s.id === stepId)?.options.find((o) => o.value === value);
  if (!opt) return null;

  if (stepId === 'capacidades') {
    const rule = CAPABILITIES[value];
    if (!rule) return null;
    if (rule.moduleName) {
      const mod = modules.find((m) => m.name === rule.moduleName);
      if (mod) return `+${formatMoney(parsePrice(mod.price))}`;
    }
    if (rule.includedFrom) {
      const plan = plans.find((p) => p.slug === rule.includedFrom);
      return plan ? `Incluido en ${plan.name.replace('PanaClaw ', '')}` : null;
    }
    return null;
  }

  // Pasos que fijan el plan: enseñamos desde cuánto arranca esa elección
  if (!opt.requiresPlan) return null;
  const plan = plans.find((p) => p.slug === opt.requiresPlan);
  return plan ? `Desde ${plan.price}` : null;
}

/* ------------------------------------------------------------------ *
 * Cálculo
 * ------------------------------------------------------------------ */

export interface QuoteLine {
  label: string;
  /** null = viene incluido en el plan. */
  price: Money | null;
  note?: string;
}

export interface QuoteResult {
  plan: Plan;
  /** Por qué se recomienda ese plan y no otro. */
  reason: string;
  lines: QuoteLine[];
  total: Money;
  delivery: string;
  urgencia: string;
}

const rank = (slug: PlanSlug) => PLAN_ORDER.indexOf(slug);

export type Answers = Record<string, string[]>;

export function computeQuote(answers: Answers): QuoteResult | null {
  const objetivo = answers.objetivo?.[0];
  const alcance = answers.alcance?.[0];
  if (!objetivo || !alcance) return null;

  const capacidades = answers.capacidades ?? [];

  // El plan es el mayor que exija cualquiera de las respuestas. Recomendar por
  // debajo de lo que la persona pidió sería cotizar algo que no le sirve.
  let slug: PlanSlug = 'start';
  let driver = '';
  const bump = (req: PlanSlug | undefined, why: string) => {
    if (req && rank(req) > rank(slug)) {
      slug = req;
      driver = why;
    }
  };

  for (const step of steps) {
    const picked = answers[step.id] ?? [];
    for (const opt of step.options) {
      if (picked.includes(opt.value)) bump(opt.requiresPlan, opt.label.toLowerCase());
    }
  }

  const plan = plans.find((p) => p.slug === slug)!;
  const lines: QuoteLine[] = [
    { label: plan.name, price: parsePrice(plan.price), note: plan.delivery },
  ];

  for (const cap of capacidades) {
    const rule = CAPABILITIES[cap];
    const option = steps
      .find((s) => s.id === 'capacidades')!
      .options.find((o) => o.value === cap);
    if (!rule || !option) continue;

    if (rule.includedFrom && rank(slug) >= rank(rule.includedFrom)) {
      lines.push({ label: option.label, price: null, note: `Incluido en ${plan.name}` });
      continue;
    }
    if (rule.moduleName) {
      const mod = modules.find((m) => m.name === rule.moduleName);
      if (mod) lines.push({ label: option.label, price: parsePrice(mod.price), note: mod.stack });
    }
  }

  const total = lines.reduce<Money>(
    (acc, l) => (l.price ? { min: acc.min + l.price.min, max: acc.max + l.price.max } : acc),
    { min: 0, max: 0 }
  );

  const extras = lines.length - 1;
  const reason = driver
    ? `Lo pide "${driver}". Es el plan más pequeño que lo cubre.`
    : 'Es el plan más pequeño que cubre lo que marcaste.';

  const urgenciaLabel =
    steps.find((s) => s.id === 'urgencia')!.options.find((o) => o.value === answers.urgencia?.[0])
      ?.label ?? '';

  return {
    plan,
    reason,
    lines,
    total,
    delivery: extras > 0 ? `${plan.delivery}, más el plazo de cada capacidad` : plan.delivery,
    urgencia: urgenciaLabel,
  };
}
