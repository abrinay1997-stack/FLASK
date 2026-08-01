export interface Module {
  name: string;
  price: string;
  stack: string;
}

export const modules: Module[] = [
  { name: 'Login + roles + usuarios', price: '$450', stack: 'Supabase Auth + RLS' },
  { name: 'Panel administrativo / dashboard', price: '$650', stack: 'Next.js + Supabase + Recharts' },
  { name: 'Sistema de reservas / citas', price: '$600', stack: 'Supabase + FullCalendar' },
  { name: 'Portal de clientes', price: '$750', stack: 'Supabase Auth + RLS por usuario' },
  { name: 'Integración de API externa', price: '$350', stack: 'Railway worker / API route' },
  { name: 'Automatización con IA / WhatsApp', price: '$250–$900', stack: 'n8n + Claude API + WhatsApp API' },
  { name: 'Inventario avanzado', price: '$550', stack: 'Supabase + lógica de stock' },
];
