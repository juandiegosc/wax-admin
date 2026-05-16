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
] as const;