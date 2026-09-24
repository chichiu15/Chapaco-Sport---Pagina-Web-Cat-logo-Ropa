import { useEffect, useMemo, useState } from 'react';
import SEO from '../../componentes/comun/SEO';
import TarjetaPack from '../../componentes/cliente/TarjetaPack';
import { usarCatalogo } from '../../hooks/usarCatalogo';
import { suscribirPacksActivos } from '../../servicios/cliente/promocionesPublicoServicio';
import '../../componentes/cliente/Promociones.css';

function Promociones() {
  const [packs, setPacks] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { marcas = [], categorias = [], productos = [] } = usarCatalogo();
  const mapas = useMemo(() => ({
    marcas: Object.fromEntries(marcas.map((item) => [item.id, item.nombre])),
    categorias: Object.fromEntries(categorias.map((item) => [item.id, item.nombre])),
  }), [marcas, categorias]);
  useEffect(() => suscribirPacksActivos((datos) => { setPacks(datos); setCargando(false); }, () => setCargando(false)), []);
  useEffect(() => {
    if (!packs.length || !window.location.hash) return;
    const destino = document.getElementById(window.location.hash.slice(1));
    if (destino) window.setTimeout(() => destino.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [packs]);

  return <main className="promocionesPagina">
    <SEO titulo="Packs y promociones | Chapaco Sport" descripcion="Descubre packs de ropa deportiva para hombre y obtén descuentos automáticos al completar las condiciones en tu carrito." ruta="/promociones" />
    <header className="promocionesPagina__hero"><span>PROMOCIONES CHAPACO SPORT</span><h1>Más prendas. Mejor precio.</h1><p>Elige tus productos con libertad. Cuando tu carrito cumpla un pack activo, aplicaremos automáticamente la mejor promoción disponible.</p></header>
    {cargando ? <div className="promocionesPagina__vacio">Cargando promociones…</div> : packs.length ? <div className="promocionesPagina__grid">{packs.map((pack, indice) => <TarjetaPack key={pack.id} pack={pack} indice={indice} marcas={mapas.marcas} categorias={mapas.categorias} productos={productos}/>)}</div> : <div className="promocionesPagina__vacio"><h2>Nuevos packs muy pronto</h2><p>Mientras tanto, explora nuestro catálogo.</p></div>}
    <p className="promocionesPagina__nota">Si coinciden varias promociones automáticas, se aplica únicamente la que produzca el mayor ahorro.</p>
  </main>;
}

export default Promociones;
