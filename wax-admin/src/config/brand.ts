export const adminBrand = {
  name: 'WAX Admin',
  label: 'Panel operativo',
  description:
    'Panel interno para gestion administrativa con acceso restringido a usuarios con rol de administrador.',
} as const;

export const adminNavigation = [
  { label: 'Pedidos', path: '/orders', meta: '01' },
  { label: 'Catalogo', path: '/catalog', meta: '02' },
  { label: 'Usuarios', path: '/users', meta: '03' },
  { label: 'Soporte', path: '/support', meta: '04' },
  { label: 'Cotizaciones', path: '/quotations', meta: '05' },
  { label: 'Reportería', path: '/reports', meta: '06' },
  { label: 'Reglas de cotización', path: '/quotation-rules', meta: '07' },
  { label: 'Facturas', path: '/invoices', meta: '08' },
] as const;