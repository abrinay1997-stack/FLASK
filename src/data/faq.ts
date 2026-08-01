export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: '¿Qué incluye el precio y qué no?',
    a: 'El precio del paquete cubre diseño, desarrollo, despliegue en Netlify y la primera ronda de revisiones definida en cada plan. No cubre generación de contenido escrito, sesión de fotografía profesional, ni licencias de imágenes premium. Todo esto lo cotizamos aparte solo si lo necesitas.',
  },
  {
    q: '¿Quién es dueño del código y del dominio?',
    a: 'Tú. El repositorio se transfiere a tu cuenta de GitHub al pago final y el dominio queda registrado a tu nombre. Si algún día decides mover el sitio, te llevas todo.',
  },
  {
    q: '¿Y el hosting? ¿Cuánto cuesta después del primer año?',
    a: 'Los sitios FLASK se despliegan en Netlify sobre su capa gratuita, que cubre a la mayoría de PYMES sin costo. La renovación anual del dominio ronda los $15 al año. Si prefieres olvidarte del tema, el plan Care Base ($35/mes) incluye hosting, dominio, SSL, monitoreo y una hora de cambios.',
  },
  {
    q: '¿Cuánto tarda realmente la entrega?',
    a: 'Start: 72 horas. Launch: 4–5 días. Corporate: 8–12 días. Commerce: 15–20 días. Los plazos cuentan desde que recibimos el contenido final (textos, imágenes y logos) y el 50 % del pago.',
  },
  {
    q: '¿Cómo cotizan un sistema grande?',
    a: 'Por módulos. En vez de una factura enorme y de alto riesgo, dividimos el sistema en piezas independientes (login, dashboard, reservas, portal, etc.) con precio fijo cada una. Compras y recibes por partes.',
  },
];
