import { routes } from './links';

export interface Service {
  idx: string;
  title: string;
  desc: string;
  longDesc?: string;
}

export const services: Service[] = [
  {
    idx: '01',
    title: 'Velocidad como servicio',
    desc: 'Arquitectura Jamstack sobre CDN. Sin plugins pesados, sin base de datos expuesta. PageSpeed ≥90 garantizado en móvil y escritorio.',
    longDesc:
      'Los sitios FLASK se sirven desde una red de distribución global (CDN Netlify). No hay servidor PHP procesando cada visita, no hay base de datos consultada cada milisegundo, no hay treinta plugins compitiendo por CPU. El resultado: LCP por debajo de 1.8 segundos, INP por debajo de 150ms, CLS prácticamente cero. Un sitio que Google entiende como técnicamente sano y que sube en rankings sin más esfuerzo que existir.',
  },
  {
    idx: '02',
    title: 'Seguridad por diseño',
    desc: 'Sitios headless con superficie de ataque mínima. Adiós a los hackeos crónicos de WordPress y sus plugins desactualizados.',
    longDesc:
      'El 43 % de todos los sitios web del planeta corren WordPress y comparten el mismo dolor: un plugin desactualizado, una versión de PHP vieja, un backdoor en un tema pirata, y en cuestión de días el sitio termina redirigiendo a spam o directamente offline. FLASK entrega sitios estáticos sin panel de administración público expuesto, sin base de datos accesible, sin superficie que hackear. La única superficie de ataque real es tu cuenta de GitHub — y esa la proteges con 2FA.',
  },
  {
    idx: '03',
    title: 'Entrega en días',
    desc: 'Metodología productizada con plantillas propias por vertical. Un Launch sale en 5 días, no en 4 semanas. El código llega a tu GitHub al pago final.',
    longDesc:
      'Las agencias tradicionales cotizan 3-6 semanas porque su flujo es: reunión inicial, brief, wireframe, diseño en Figma, revisión, otro diseño, HTML manual, testing manual, deploy manual. FLASK ha productizado cada paso con plantillas verticales propias y flujo de trabajo automatizado. Un Launch de $450 se entrega en 4-5 días reales. Corporate en 8-12. Commerce en 15-20. Los plazos cuentan desde que recibimos tu contenido y el 50 % del pago.',
  },
];

export interface ProcesoStep {
  num: string;
  title: string;
  desc: string;
  longDesc?: string;
}

export const procesoSteps: ProcesoStep[] = [
  {
    num: '01',
    title: '50 % adelanto',
    desc: 'No arrancamos sin depósito. La factura y el alcance quedan por escrito antes de la primera línea de código.',
    longDesc:
      'Antes de escribir una sola línea, te enviamos una propuesta escrita con el alcance exacto, el cronograma día por día y una cláusula clara de "qué NO incluye". Firmas, pagas el 50 %, y arrancamos. Sin esa firma y sin ese pago no hay proyecto — y eso te protege a ti también: garantiza que tomamos tu proyecto en serio y no lo dejamos a medias.',
  },
  {
    num: '02',
    title: 'El código es tuyo',
    desc: 'Al pago final transferimos el repositorio a tu propio GitHub. Nada de rehenes tecnológicos: te vas cuando quieras.',
    longDesc:
      'La mayoría de agencias en Panamá te venden un sitio y se quedan con el código, el hosting y el dominio a su nombre. Cuando quieres irte, te cuesta más migrar que rehacer. Nosotros no. Al momento del pago final, el repositorio se transfiere a tu cuenta de GitHub y el dominio a tu nombre. Si mañana quieres irte con otra agencia o mover el sitio a tu sobrino que estudia sistemas, tu problema — tienes todo.',
  },
  {
    num: '03',
    title: 'Revisiones claras',
    desc: 'Cada paquete incluye rondas de revisión definidas. Si necesitas más, cada revisión extra cuesta $40. Punto.',
    longDesc:
      'El scope creep — los "solo un cambio más" que no se acaban nunca — es lo que quiebra a quien cobra barato en Panamá. Nosotros lo cerramos por adelantado: cada paquete incluye rondas de revisión específicas (Launch: 2 rondas, Corporate: 3, Commerce: 4). Si necesitas otra ronda después de agotar las incluidas, cuesta $40 por revisión. Sin excepciones, sin regateos, sin resentimiento. Es justo para todos.',
  },
];

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: routes.servicios, label: 'Servicios' },
  { href: routes.planes, label: 'Planes' },
  { href: routes.proceso, label: 'Proceso' },
  { href: routes.sobre, label: 'Nosotros' },
];
