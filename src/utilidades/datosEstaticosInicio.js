import { ShieldCheck, Truck, Users, Lock } from 'lucide-react';
 
export const CARACTERISTICAS = [
  {
    id: 'calidad-premium',
    Icono: ShieldCheck,
    titulo: 'CALIDAD PREMIUM',
    descripcion: 'Prendas seleccionadas de alta calidad.',
  },
  {
    id: 'envio-seguro',
    Icono: Truck,
    titulo: 'ENVÍO SEGURO',
    descripcion: 'Envíos rápidos y seguros a toda Bolivia.',
  },
  {
    id: 'mas-1000-clientes',
    Icono: Users,
    titulo: '+1.000 CLIENTES',
    descripcion: 'Confían en nuestra marca y productos.',
  },
  {
    id: 'pagos-seguros',
    Icono: Lock,
    titulo: 'PAGOS SEGUROS',
    descripcion: 'Compra con total confianza y seguridad.',
  },
];
 
export const BANNERS_MARCAS_OFERTAS = [
  {
    id: 'banner-marcas',
    titulo: 'MARCAS',
    ruta: '/marcas',
    imagenFondo:
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'banner-ofertas',
    titulo: 'OFERTAS',
    ruta: '/ofertas',
    imagenFondo:
      'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?q=80&w=1200&auto=format&fit=crop',
  },
];
 