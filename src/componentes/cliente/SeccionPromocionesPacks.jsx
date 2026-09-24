import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { suscribirPacksActivos } from '../../servicios/cliente/promocionesPublicoServicio';
import TarjetaPack from './TarjetaPack';
import './Promociones.css';

function SeccionPromocionesPacks() {
  const [packs, setPacks] = useState([]);
  useEffect(() => suscribirPacksActivos(setPacks, console.error), []);
  return <section className="seccionPacks">
    <header className="seccionPacks__anuncio"><div className="seccionPacks__anuncioTexto"><span>PACKS Y PRECIOS ESPECIALES</span><h2>Compra más. Paga menos.</h2><p>{packs.length ? `Hay ${packs.length} promoción${packs.length === 1 ? '' : 'es'} vigente${packs.length === 1 ? '' : 's'}. Elige productos participantes y el beneficio se aplicará automáticamente en tu carrito.` : 'Muy pronto publicaremos nuevos packs y beneficios para tus compras.'}</p></div><Link to="/promociones">Conocer promociones <ArrowRight size={18}/></Link></header>
    {packs.length > 0 && <div className="seccionPacks__grid">{packs.slice(0, 3).map((pack, indice) => <TarjetaPack key={pack.id} pack={pack} indice={indice} compacto />)}</div>}
  </section>;
}

export default SeccionPromocionesPacks;
