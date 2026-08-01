export interface Module {
  name: string;
  price: string;
  /** Qué resuelve, en el idioma del cliente. Nunca el nombre de la herramienta. */
  stack: string;
}

/**
 * Capacidades que se suman a cualquier plan.
 *
 * El campo `stack` decía antes con qué se construye ("Supabase Auth + RLS").
 * Eso le importa a un programador; a quien va a pagar le dice cero y le hace
 * sentir que no entiende lo que compra. Ahora dice qué consigue.
 */
export const modules: Module[] = [
  {
    name: 'Cuentas de usuario',
    price: '$450',
    stack: 'Cada persona entra con su clave y ve solo lo que le corresponde.',
  },
  {
    name: 'Panel de control',
    price: '$650',
    stack: 'Ves tus números y gestionas tu negocio desde una sola pantalla.',
  },
  {
    name: 'Reservas y citas',
    price: '$600',
    stack: 'Tus clientes reservan solos, sin llamarte y sin pisarse el horario.',
  },
  {
    name: 'Portal de clientes',
    price: '$750',
    stack: 'Cada cliente entra y consulta lo suyo sin escribirte para preguntar.',
  },
  {
    name: 'Conexión con otro sistema',
    price: '$350',
    stack: 'Tu web y el programa que ya usas dejan de vivir por separado.',
  },
  {
    name: 'Respuestas automáticas con IA',
    price: '$250–$900',
    stack: 'Contesta las preguntas de siempre por WhatsApp, a cualquier hora.',
  },
  {
    name: 'Control de inventario',
    price: '$550',
    stack: 'El stock se descuenta solo y dejas de vender lo que no tienes.',
  },
];
