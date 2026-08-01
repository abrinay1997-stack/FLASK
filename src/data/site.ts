export const site = {
  name: 'CuatroNodos',
  tagline: 'Sitios rápidos. Código tuyo.',
  description:
    'Agencia web en Panamá. Sitios que abren en menos de un segundo, entregados en días y que quedan a tu nombre. Desde $295.',
  descriptionShort: 'Webs en Panamá. Abren en menos de 1 s, listas en días y quedan a tu nombre. Desde $295.',
  locale: 'es_PA',
  lang: 'es',
  themeColor: '#100101',
  accentColor: '#FF5100',
  year: 2026,
  location: 'Panamá',
} as const;

export const contact = {
  whatsapp: '+507 6227 2025',
  whatsappRaw: '50762272025',
  whatsappDefaultMsg: 'Hola CuatroNodos, quiero cotizar mi sitio web',
  horario: 'Lun–Vie · 9:00 – 18:00',
  timezone: 'Hora de Panamá (GMT-5)',
} as const;

export function waLink(msg: string = contact.whatsappDefaultMsg): string {
  return `https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}
