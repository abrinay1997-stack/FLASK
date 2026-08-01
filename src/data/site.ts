export const site = {
  name: 'FLASK',
  tagline: 'Sitios rápidos. Código tuyo.',
  description:
    'Agencia web en Panamá. Sitios Jamstack que cargan en menos de un segundo, entregados en días, con el código en tu propio GitHub. Desde $295.',
  descriptionShort: 'Sitios Jamstack en Panamá. Carga <1s, entrega en días, código 100% tuyo. Desde $295.',
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
  whatsappDefaultMsg: 'Hola FLASK, quiero cotizar mi sitio web',
  horario: 'Lun–Vie · 9:00 – 18:00',
  timezone: 'Hora de Panamá (GMT-5)',
} as const;

export function waLink(msg: string = contact.whatsappDefaultMsg): string {
  return `https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}
