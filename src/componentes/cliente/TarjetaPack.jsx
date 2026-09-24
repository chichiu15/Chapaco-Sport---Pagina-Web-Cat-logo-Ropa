import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronDown, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { describirBeneficioPack, productoCumpleFiltrosPack } from '../../utilidades/descuentos';
import { formatearPrecio } from '../../utilidades/formatearPrecio';

const unir = (lista = []) => lista.filter(Boolean).join(', ');

function ProductoElegible({ producto }) {
  const precioOferta = Number(producto.oferta?.precioOferta);
  const tieneOferta = Number.isFinite(precioOferta) && precioOferta > 0;

  return <article className="productoPack">
    <Link className="productoPack__imagen" to={`/producto/${producto.id}`} aria-label={`Ver ${producto.nombre}`}>
      {producto.imagen
        ? <img src={producto.imagen} alt={producto.nombre || 'Producto Chapaco Sport'} loading="lazy" decoding="async"/>
        : <span>CHAPACO SPORT</span>}
    </Link>
    <div className="productoPack__contenido">
      <p className="productoPack__meta">{[producto.nombreMarca, producto.nombreCategoria].filter(Boolean).join(' · ') || 'CHAPACO SPORT'}</p>
      <h4>{producto.nombre || 'Producto Chapaco Sport'}</h4>
      <div className="productoPack__pie">
        <div className="productoPack__precio">
          <strong>{formatearPrecio(tieneOferta ? precioOferta : Number(producto.precio || 0))}</strong>
          {tieneOferta && <del>{formatearPrecio(Number(producto.precio || 0))}</del>}
        </div>
        <Link to={`/producto/${producto.id}`}>Elegir <ArrowRight size={16}/></Link>
      </div>
    </div>
  </article>;
}

function TarjetaPack({ pack, marcas = {}, categorias = {}, productos = [], compacto = false, indice = 0 }) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [limite, setLimite] = useState(8);
  const condiciones = pack.condiciones || {};
  const elegibles = useMemo(() => productos.filter((producto) => productoCumpleFiltrosPack(producto, pack)), [productos, pack]);
  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');
    const filtrados = termino
      ? elegibles.filter((producto) => `${producto.nombre} ${producto.nombreMarca} ${producto.nombreCategoria}`.toLocaleLowerCase('es').includes(termino))
      : elegibles;
    return { todos: filtrados, pagina: filtrados.slice(0, limite) };
  }, [elegibles, busqueda, limite]);
  const detalles = [
    condiciones.marcas_ids?.length ? `Marcas: ${unir(condiciones.marcas_ids.map((id) => marcas[id] || id))}` : '',
    condiciones.categorias_ids?.length ? `Categorías: ${unir(condiciones.categorias_ids.map((id) => categorias[id] || id))}` : '',
    condiciones.tallas?.length ? `Tallas: ${unir(condiciones.tallas)}` : '',
    condiciones.colores?.length ? `Colores: ${unir(condiciones.colores)}` : '',
    condiciones.productos_ids?.length ? `${condiciones.productos_ids.length} producto(s) seleccionado(s)${pack.requiere_todos_productos ? ' · todos obligatorios' : ''}` : '',
  ].filter(Boolean);
  const vigencia = pack.fecha_inicio || pack.fecha_fin
    ? `${pack.fecha_inicio ? `Desde ${pack.fecha_inicio}` : 'Disponible ahora'} · ${pack.fecha_fin ? `Hasta ${pack.fecha_fin}` : 'Sin fecha final'}`
    : 'Vigencia indefinida';

  if (compacto) return <article className="tarjetaPack tarjetaPack--compacta">
    <div className="tarjetaPack__numero">{String(indice + 1).padStart(2, '0')}</div>
    <div className="tarjetaPack__compactaContenido">
      <span className="tarjetaPack__etiqueta">PROMOCIÓN VIGENTE</span>
      <h3>{pack.nombre}</h3>
      <strong className="tarjetaPack__resumen">{describirBeneficioPack(pack)}</strong>
      {pack.descripcion && <p>{pack.descripcion}</p>}
      <Link to={`/promociones#${pack.id}`}>Ver condiciones <ArrowRight size={17}/></Link>
    </div>
  </article>;

  return <article id={pack.id} className="tarjetaPack tarjetaPack--detalle">
    <header className="tarjetaPack__cabecera">
      <div className="tarjetaPack__numero">{String(indice + 1).padStart(2, '0')}</div>
      <div className="tarjetaPack__identidad">
        <span className="tarjetaPack__etiqueta">PROMOCIÓN VIGENTE</span>
        <h2>{pack.nombre}</h2>
        {pack.descripcion && <p className="tarjetaPack__descripcion">{pack.descripcion}</p>}
      </div>
      <div className="tarjetaPack__beneficio">
        <span>TU BENEFICIO</span>
        <strong>{describirBeneficioPack(pack)}</strong>
        <small>Se calcula automáticamente en el carrito</small>
      </div>
    </header>

    <div className="tarjetaPack__condiciones">
      <div className="tarjetaPack__condicionesTexto">
        <span>CONDICIONES</span>
        <p>{detalles.length ? detalles.join('  /  ') : 'Disponible para todo el catálogo'}</p>
      </div>
      <div className="tarjetaPack__vigencia"><CalendarDays size={15}/>{vigencia}</div>
    </div>

    <div className="tarjetaPack__accionesPublicas">
      <button type="button" aria-expanded={abierto} onClick={() => setAbierto((actual) => !actual)}>
        <ShoppingBag size={18}/>{abierto ? 'Ocultar productos' : `Ver productos disponibles (${elegibles.length})`}
        <ChevronDown className={abierto ? 'girado' : ''} size={18}/>
      </button>
      <Link to="/catalogo">Explorar todo el catálogo <ArrowRight size={17}/></Link>
    </div>

    {abierto && <section className="tarjetaPack__productos">
      <header>
        <div><span>SELECCIÓN DEL PACK</span><h3>Elige tus productos</h3><p>Abre cada producto para seleccionar talla y color. Al completar el pack, el descuento aparece en tu carrito.</p></div>
        {elegibles.length > 5 && <label><Search size={17}/><input value={busqueda} onChange={(evento) => { setBusqueda(evento.target.value); setLimite(8); }} placeholder="Buscar producto…"/></label>}
      </header>
      {visibles.pagina.length
        ? <div className="tarjetaPack__productosGrid">{visibles.pagina.map((producto) => <ProductoElegible key={producto.id} producto={producto}/>)}</div>
        : <p className="tarjetaPack__sinProductos">No encontramos productos disponibles con esa búsqueda.</p>}
      {visibles.todos.length > limite && <button type="button" className="tarjetaPack__verMas" onClick={() => setLimite((actual) => actual + 8)}>Mostrar más productos</button>}
    </section>}
  </article>;
}

export default TarjetaPack;
