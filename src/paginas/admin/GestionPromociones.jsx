import { useEffect, useMemo, useState } from 'react';
import { BadgePercent, Copy, Edit3, PackagePlus, Sparkles, Tag, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import SelectorMultipleBuscable from '../../componentes/admin/SelectorMultipleBuscable';
import { suscribirProductosAdmin } from '../../servicios/admin/productosServicio';
import { suscribirMarcas } from '../../servicios/admin/marcasServicio';
import { suscribirCategorias } from '../../servicios/admin/categoriasServicio';
import {
  eliminarCodigo, eliminarPack, guardarCodigo, guardarPack,
  normalizarCodigoDescuento, suscribirCodigos, suscribirPacks,
} from '../../servicios/admin/promocionesServicio';
import { describirBeneficioPack, MODALIDADES_PACK } from '../../utilidades/descuentos';
import { ordenarTallas } from '../../utilidades/tallas';
import '../../estilos/adminestilos.css';
import './GestionPromociones.css';

const condicionesIniciales = () => ({ productos_ids: [], marcas_ids: [], categorias_ids: [], tallas: [], colores: [] });
const packInicial = () => ({
  id: '', nombre: '', descripcion: '', activo: true, modalidad: MODALIDADES_PACK.PORCENTAJE_DESDE,
  porcentaje_descuento: 10, cantidad_minima: 2, precio_fijo_pack: 0, cantidad_paga: 1,
  repetible: false, requiere_todos_productos: false, vigencia_indefinida: true,
  fecha_inicio: '', fecha_fin: '', condiciones: condicionesIniciales(),
});
const codigoInicial = () => ({
  id: '', codigo: '', nombre: '', descripcion: '', activo: true, porcentaje_descuento: 10,
  compra_minima: 0, descuento_maximo: 0, vigencia_indefinida: true, fecha_inicio: '', fecha_fin: '',
  combinable_con_packs: false,
});
const tema = { background: '#171717', color: '#fff', confirmButtonColor: '#e4292f' };

function GestionPromociones() {
  const [pestana, setPestana] = useState('packs');
  const [packs, setPacks] = useState([]);
  const [codigos, setCodigos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pack, setPack] = useState(packInicial);
  const [codigo, setCodigo] = useState(codigoInicial);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const bajas = [
      suscribirPacks(setPacks, console.error), suscribirCodigos(setCodigos, console.error),
      suscribirMarcas(setMarcas), suscribirCategorias(setCategorias),
      suscribirProductosAdmin(setProductos, console.error),
    ];
    return () => bajas.forEach((baja) => baja());
  }, []);

  const datosBd = useMemo(() => {
    const mapaMarcas = Object.fromEntries(marcas.map((item) => [item.id, item.nombre]));
    const mapaCategorias = Object.fromEntries(categorias.map((item) => [item.id, item.nombre]));
    const variantes = productos.flatMap((producto) => Object.values(producto.subcolecciones?.variantes || {}));
    const tallas = ordenarTallas([...new Set(variantes.map((item) => item.talla).filter(Boolean))]);
    const mapaColores = new Map();
    variantes.forEach((item) => {
      const color = String(item.color_estampado || item.color || '').trim();
      if (color) mapaColores.set(color.toLocaleLowerCase('es'), color);
    });
    return {
      nombres: { marcas: mapaMarcas, categorias: mapaCategorias },
      opcionesMarcas: marcas.map((item) => ({ id: item.id, nombre: item.nombre || item.id })),
      opcionesCategorias: categorias.map((item) => ({ id: item.id, nombre: item.nombre || item.id })),
      opcionesProductos: productos.map((item) => ({
        id: item.id, nombre: item.nombre || item.id,
        detalle: [mapaMarcas[item.marca_id], mapaCategorias[item.categoria_id]].filter(Boolean).join(' · '),
      })),
      opcionesTallas: tallas.map((item) => ({ id: item, nombre: item })),
      opcionesColores: [...mapaColores.values()].sort((a, b) => a.localeCompare(b, 'es')).map((item) => ({ id: item, nombre: item })),
    };
  }, [marcas, categorias, productos]);

  const cambiarPack = (evento) => {
    const { name, value, type, checked } = evento.target;
    setPack((actual) => {
      const nuevo = { ...actual, [name]: type === 'checkbox' ? checked : value };
      if (name === 'vigencia_indefinida' && checked) return { ...nuevo, fecha_inicio: '', fecha_fin: '' };
      if (name === 'modalidad' && value === MODALIDADES_PACK.LLEVA_PAGA) {
        nuevo.cantidad_paga = Math.max(1, Number(actual.cantidad_minima) - 1);
      }
      return nuevo;
    });
  };
  const cambiarCondicion = (clave, valor) => setPack((actual) => ({
    ...actual, condiciones: { ...actual.condiciones, [clave]: valor },
  }));
  const cambiarCodigo = (evento) => {
    const { name, value, type, checked } = evento.target;
    setCodigo((actual) => {
      const nuevo = { ...actual, [name]: type === 'checkbox' ? checked : value };
      return name === 'vigencia_indefinida' && checked ? { ...nuevo, fecha_inicio: '', fecha_fin: '' } : nuevo;
    });
  };

  const validarPack = () => {
    if (!pack.nombre.trim() || Number(pack.cantidad_minima) < 1) return 'Nombre y cantidad de prendas son obligatorios.';
    if ([MODALIDADES_PACK.PORCENTAJE_DESDE, MODALIDADES_PACK.PORCENTAJE_PACK].includes(pack.modalidad)
      && (Number(pack.porcentaje_descuento) <= 0 || Number(pack.porcentaje_descuento) > 90)) return 'El porcentaje debe estar entre 1 y 90.';
    if (pack.modalidad === MODALIDADES_PACK.PRECIO_FIJO_PACK && Number(pack.precio_fijo_pack) <= 0) return 'Ingresa el precio final del pack.';
    if (pack.modalidad === MODALIDADES_PACK.LLEVA_PAGA
      && Number(pack.cantidad_paga) >= Number(pack.cantidad_minima)) return 'La cantidad que paga debe ser menor a la cantidad que lleva.';
    if (pack.requiere_todos_productos && pack.condiciones.productos_ids.length === 0) return 'Selecciona los productos obligatorios del combo.';
    if (pack.requiere_todos_productos && pack.condiciones.productos_ids.length > Number(pack.cantidad_minima)) return 'La cantidad del pack no puede ser menor al número de productos obligatorios.';
    if (pack.fecha_inicio && pack.fecha_fin && pack.fecha_inicio > pack.fecha_fin) return 'La fecha inicial no puede ser posterior a la final.';
    return '';
  };

  const guardarPackActual = async (evento) => {
    evento.preventDefault();
    const error = validarPack();
    if (error) return Swal.fire({ ...tema, icon: 'warning', title: 'Revisa la promoción', text: error });
    try {
      setGuardando(true);
      await guardarPack({
        ...pack,
        cantidad_minima: Number(pack.cantidad_minima), porcentaje_descuento: Number(pack.porcentaje_descuento) || 0,
        precio_fijo_pack: Number(pack.precio_fijo_pack) || 0, cantidad_paga: Number(pack.cantidad_paga) || 1,
        fecha_inicio: pack.vigencia_indefinida ? '' : pack.fecha_inicio,
        fecha_fin: pack.vigencia_indefinida ? '' : pack.fecha_fin,
      });
      setPack(packInicial());
      await Swal.fire({ ...tema, icon: 'success', title: 'Promoción guardada', text: 'Ya está disponible para el cliente si se encuentra activa.' });
    } catch (errorGuardado) {
      await Swal.fire({ ...tema, icon: 'error', title: 'No se pudo guardar', text: errorGuardado.message });
    } finally { setGuardando(false); }
  };

  const guardarCodigoActual = async (evento) => {
    evento.preventDefault();
    const codigoNormalizado = normalizarCodigoDescuento(codigo.codigo);
    if (!codigoNormalizado || Number(codigo.porcentaje_descuento) <= 0 || Number(codigo.porcentaje_descuento) > 90) {
      return Swal.fire({ ...tema, icon: 'warning', title: 'Revisa el código', text: 'El código y un porcentaje entre 1 y 90 son obligatorios.' });
    }
    if (codigo.fecha_inicio && codigo.fecha_fin && codigo.fecha_inicio > codigo.fecha_fin) {
      return Swal.fire({ ...tema, icon: 'warning', title: 'Revisa la vigencia', text: 'La fecha inicial no puede ser posterior a la final.' });
    }
    try {
      setGuardando(true);
      await guardarCodigo({
        ...codigo, codigo: codigoNormalizado, porcentaje_descuento: Number(codigo.porcentaje_descuento),
        compra_minima: Number(codigo.compra_minima) || 0, descuento_maximo: Number(codigo.descuento_maximo) || 0,
        fecha_inicio: codigo.vigencia_indefinida ? '' : codigo.fecha_inicio,
        fecha_fin: codigo.vigencia_indefinida ? '' : codigo.fecha_fin,
      }, codigo.id);
      setCodigo(codigoInicial());
      await Swal.fire({ ...tema, icon: 'success', title: 'Código guardado' });
    } catch (errorGuardado) {
      await Swal.fire({ ...tema, icon: 'error', title: 'No se pudo guardar', text: errorGuardado.message });
    } finally { setGuardando(false); }
  };

  const confirmarEliminar = async (tipo, item) => {
    const respuesta = await Swal.fire({ ...tema, icon: 'warning', title: `¿Eliminar ${tipo}?`, text: 'Esta acción no se puede deshacer.', showCancelButton: true, cancelButtonText: 'Cancelar', confirmButtonText: 'Eliminar' });
    if (!respuesta.isConfirmed) return;
    try {
      if (tipo === 'promoción') await eliminarPack(item.id); else await eliminarCodigo(item.id);
    } catch (error) {
      await Swal.fire({ ...tema, icon: 'error', title: 'No se pudo eliminar', text: error.message });
    }
  };

  const editarPack = (item) => {
    setPack({
      ...packInicial(),
      ...item,
      vigencia_indefinida: item.vigencia_indefinida ?? (!item.fecha_inicio && !item.fecha_fin),
      condiciones: { ...condicionesIniciales(), ...item.condiciones },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editarCodigo = (item) => {
    setCodigo({
      ...codigoInicial(),
      ...item,
      vigencia_indefinida: item.vigencia_indefinida ?? (!item.fecha_inicio && !item.fecha_fin),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const resumenCondiciones = (item) => {
    const c = item.condiciones || {};
    const partes = [];
    if (c.marcas_ids?.length) partes.push(`Marcas: ${c.marcas_ids.map((id) => datosBd.nombres.marcas[id] || id).join(', ')}`);
    if (c.categorias_ids?.length) partes.push(`Categorías: ${c.categorias_ids.map((id) => datosBd.nombres.categorias[id] || id).join(', ')}`);
    if (c.productos_ids?.length) partes.push(`${c.productos_ids.length} producto(s)`);
    if (c.tallas?.length) partes.push(`Tallas: ${c.tallas.join(', ')}`);
    if (c.colores?.length) partes.push(`Colores: ${c.colores.join(', ')}`);
    return partes.length ? partes.join(' · ') : 'Todo el catálogo';
  };
  return <main className="promoAdmin">
    <header className="promoAdmin__cabecera">
      <div><span className="promoAdmin__eyebrow">VENTAS Y FIDELIZACIÓN</span><h1>Promociones y descuentos</h1><p>Configura reglas flexibles utilizando datos reales del catálogo.</p></div>
      <div className="promoAdmin__cabeceraAcciones"><BadgePercent size={42}/></div>
    </header>

    <nav className="promoAdmin__tabs" aria-label="Tipos de promoción">
      <button type="button" className={pestana === 'packs' ? 'activo' : ''} onClick={() => setPestana('packs')}><PackagePlus size={18}/> Packs automáticos</button>
      <button type="button" className={pestana === 'codigos' ? 'activo' : ''} onClick={() => setPestana('codigos')}><Tag size={18}/> Códigos de descuento</button>
    </nav>

    {pestana === 'packs' ? <div className="promoAdmin__grid">
      <form className="promoAdmin__panel" onSubmit={guardarPackActual}>
        <div className="promoAdmin__tituloPanel"><div><h2>{pack.id ? 'Editar promoción' : 'Nueva promoción'}</h2><p>Los campos marcados como opcionales pueden quedar vacíos.</p></div>{pack.id && <button type="button" className="promoAdmin__icono" onClick={() => setPack(packInicial())}><X/></button>}</div>
        <label>Nombre público *<input name="nombre" value={pack.nombre} onChange={cambiarPack} placeholder="Ej. Mes del amor" /></label>
        <label>Descripción pública<textarea name="descripcion" value={pack.descripcion} onChange={cambiarPack} placeholder="Ej. Elige tus prendas favoritas y comparte el entrenamiento." /></label>
        <label>Tipo de beneficio *<select name="modalidad" value={pack.modalidad} onChange={cambiarPack}>
          <option value={MODALIDADES_PACK.PORCENTAJE_DESDE}>Desde X prendas: aplicar % a todas las que cumplan</option>
          <option value={MODALIDADES_PACK.PORCENTAJE_PACK}>Solo X prendas: aplicar % únicamente a ese grupo</option>
          <option value={MODALIDADES_PACK.PRECIO_FIJO_PACK}>X prendas por un precio total fijo</option>
          <option value={MODALIDADES_PACK.LLEVA_PAGA}>Lleva X prendas y paga solamente Y</option>
        </select></label>
        <div className="promoAdmin__explicacion"><Sparkles size={17}/><span>{pack.modalidad === MODALIDADES_PACK.PORCENTAJE_DESDE && 'Ejemplo: desde 2 compresoras, aplica 10% a todas las compresoras elegibles.'}{pack.modalidad === MODALIDADES_PACK.PORCENTAJE_PACK && 'Ejemplo: elige 3 poleras Gymshark; si lleva 4, solo 3 reciben descuento.'}{pack.modalidad === MODALIDADES_PACK.PRECIO_FIJO_PACK && 'Ejemplo: elige 3 baggys seleccionados y paga Bs. 550 por el pack.'}{pack.modalidad === MODALIDADES_PACK.LLEVA_PAGA && 'Ejemplo: lleva 3 prendas y paga solamente 2.'}</span></div>
        <div className="promoAdmin__dos">
          <label>{pack.modalidad === MODALIDADES_PACK.PORCENTAJE_DESDE ? 'Cantidad mínima *' : 'Prendas por pack *'}<input type="number" min="1" name="cantidad_minima" value={pack.cantidad_minima} onChange={cambiarPack}/></label>
          {[MODALIDADES_PACK.PORCENTAJE_DESDE, MODALIDADES_PACK.PORCENTAJE_PACK].includes(pack.modalidad) && <label>Descuento (%) *<input type="number" min="1" max="90" name="porcentaje_descuento" value={pack.porcentaje_descuento} onChange={cambiarPack}/></label>}
          {pack.modalidad === MODALIDADES_PACK.PRECIO_FIJO_PACK && <label>Precio final del pack (Bs.) *<input type="number" min="0.01" step="0.01" name="precio_fijo_pack" value={pack.precio_fijo_pack} onChange={cambiarPack}/></label>}
          {pack.modalidad === MODALIDADES_PACK.LLEVA_PAGA && <label>Cantidad que paga *<input type="number" min="1" max={Math.max(1, Number(pack.cantidad_minima) - 1)} name="cantidad_paga" value={pack.cantidad_paga} onChange={cambiarPack}/></label>}
        </div>
        {pack.modalidad !== MODALIDADES_PACK.PORCENTAJE_DESDE && <label className="promoAdmin__check"><input type="checkbox" name="repetible" checked={pack.repetible} onChange={cambiarPack}/> Repetir el beneficio por cada grupo completo (ej. 6 prendas = 2 packs de 3)</label>}

        <div className="promoAdmin__separador"><h3>Productos elegibles</h3><p>Los filtros seleccionados se cumplen juntos. Si no seleccionas ninguno, aplica a todo el catálogo.</p></div>
        <SelectorMultipleBuscable etiqueta="Marcas" opciones={datosBd.opcionesMarcas} seleccionados={pack.condiciones.marcas_ids} onChange={(valor) => cambiarCondicion('marcas_ids', valor)} placeholder="Buscar marca…" />
        <SelectorMultipleBuscable etiqueta="Categorías" opciones={datosBd.opcionesCategorias} seleccionados={pack.condiciones.categorias_ids} onChange={(valor) => cambiarCondicion('categorias_ids', valor)} placeholder="Buscar categoría…" />
        <SelectorMultipleBuscable etiqueta="Productos específicos" opciones={datosBd.opcionesProductos} seleccionados={pack.condiciones.productos_ids} onChange={(valor) => cambiarCondicion('productos_ids', valor)} placeholder="Buscar producto o marca…" />
        {pack.condiciones.productos_ids.length > 0 && <label className="promoAdmin__check promoAdmin__check--destacado"><input type="checkbox" name="requiere_todos_productos" checked={pack.requiere_todos_productos} onChange={cambiarPack}/> Exigir al menos una unidad de cada producto seleccionado</label>}
        <SelectorMultipleBuscable etiqueta="Tallas" opciones={datosBd.opcionesTallas} seleccionados={pack.condiciones.tallas} onChange={(valor) => cambiarCondicion('tallas', valor)} placeholder="Buscar talla…" />
        <SelectorMultipleBuscable etiqueta="Colores o estampados" opciones={datosBd.opcionesColores} seleccionados={pack.condiciones.colores} onChange={(valor) => cambiarCondicion('colores', valor)} placeholder="Buscar color o estampado…" />

        <div className="promoAdmin__separador"><h3>Vigencia</h3><p>Puede ser indefinida o tener solamente una de las dos fechas.</p></div>
        <label className="promoAdmin__check"><input type="checkbox" name="vigencia_indefinida" checked={pack.vigencia_indefinida} onChange={cambiarPack}/> Vigencia indefinida</label>
        {!pack.vigencia_indefinida && <div className="promoAdmin__dos"><label>Desde (opcional)<input type="date" name="fecha_inicio" value={pack.fecha_inicio} onChange={cambiarPack}/></label><label>Hasta (opcional)<input type="date" name="fecha_fin" value={pack.fecha_fin} onChange={cambiarPack}/></label></div>}
        <label className="promoAdmin__check"><input type="checkbox" name="activo" checked={pack.activo} onChange={cambiarPack}/> Promoción activa y visible</label>
        <button className="promoAdmin__guardar" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar promoción'}</button>
      </form>

      <section className="promoAdmin__panel promoAdmin__listado"><h2>Promociones creadas</h2>{packs.length === 0 && <p className="promoAdmin__vacio">Todavía no hay promociones.</p>}{packs.map((item) => <article className="promoAdmin__item" key={item.id}><div><div className="promoAdmin__badges"><span className={item.activo ? 'estado activo' : 'estado'}>{item.activo ? 'ACTIVA' : 'INACTIVA'}</span></div><h3>{item.nombre}</h3><strong>{describirBeneficioPack(item)}</strong><p>{resumenCondiciones(item)}</p><small>{item.fecha_inicio || item.fecha_fin ? `${item.fecha_inicio ? `Desde ${item.fecha_inicio}` : 'Sin fecha inicial'} · ${item.fecha_fin ? `Hasta ${item.fecha_fin}` : 'Sin fecha final'}` : 'Vigencia indefinida'}</small></div><div className="promoAdmin__acciones"><button type="button" title="Editar" onClick={() => editarPack(item)}><Edit3/></button><button type="button" title="Eliminar" onClick={() => confirmarEliminar('promoción', item)}><Trash2/></button></div></article>)}</section>
    </div> : <div className="promoAdmin__grid">
      <form className="promoAdmin__panel" onSubmit={guardarCodigoActual}>
        <div className="promoAdmin__tituloPanel"><div><h2>{codigo.id ? 'Editar código' : 'Nuevo código'}</h2><p>El cliente lo escribirá en su carrito.</p></div>{codigo.id && <button type="button" className="promoAdmin__icono" onClick={() => setCodigo(codigoInicial())}><X/></button>}</div>
        <label>Código *<input name="codigo" value={codigo.codigo} onChange={cambiarCodigo} placeholder="AMOR10" /></label>
        <label>Nombre interno<input name="nombre" value={codigo.nombre} onChange={cambiarCodigo} placeholder="Campaña mes del amor" /></label>
        <label>Descripción<input name="descripcion" value={codigo.descripcion} onChange={cambiarCodigo} placeholder="Nota opcional para administración" /></label>
        <div className="promoAdmin__dos"><label>Descuento (%) *<input type="number" min="1" max="90" name="porcentaje_descuento" value={codigo.porcentaje_descuento} onChange={cambiarCodigo}/></label><label>Compra mínima (Bs.)<input type="number" min="0" step="0.01" name="compra_minima" value={codigo.compra_minima} onChange={cambiarCodigo}/></label></div>
        <label>Descuento máximo (Bs.)<input type="number" min="0" step="0.01" name="descuento_maximo" value={codigo.descuento_maximo} onChange={cambiarCodigo}/><small>0 significa sin límite monetario.</small></label>
        <label className="promoAdmin__check"><input type="checkbox" name="vigencia_indefinida" checked={codigo.vigencia_indefinida} onChange={cambiarCodigo}/> Vigencia indefinida</label>
        {!codigo.vigencia_indefinida && <div className="promoAdmin__dos"><label>Desde (opcional)<input type="date" name="fecha_inicio" value={codigo.fecha_inicio} onChange={cambiarCodigo}/></label><label>Hasta (opcional)<input type="date" name="fecha_fin" value={codigo.fecha_fin} onChange={cambiarCodigo}/></label></div>}
        <label className="promoAdmin__check"><input type="checkbox" name="combinable_con_packs" checked={codigo.combinable_con_packs} onChange={cambiarCodigo}/> Permitir combinar con una promoción automática</label>
        <label className="promoAdmin__check"><input type="checkbox" name="activo" checked={codigo.activo} onChange={cambiarCodigo}/> Código activo</label>
        <button className="promoAdmin__guardar" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar código'}</button>
      </form>
      <section className="promoAdmin__panel promoAdmin__listado"><h2>Códigos creados</h2>{codigos.length === 0 && <p className="promoAdmin__vacio">Todavía no hay códigos.</p>}{codigos.map((item) => <article className="promoAdmin__item" key={item.id}><div><div className="promoAdmin__badges"><span className={item.activo ? 'estado activo' : 'estado'}>{item.activo ? 'ACTIVO' : 'INACTIVO'}</span></div><h3 className="promoAdmin__codigo">{item.codigo} <button type="button" title="Copiar" onClick={() => navigator.clipboard?.writeText(item.codigo)}><Copy size={15}/></button></h3><strong>{item.porcentaje_descuento}% OFF · mínimo Bs. {Number(item.compra_minima || 0).toFixed(2)}</strong><p>{item.combinable_con_packs ? 'Combinable con promociones automáticas' : 'No combinable con promociones automáticas'}</p><small>{item.fecha_inicio || item.fecha_fin ? `${item.fecha_inicio ? `Desde ${item.fecha_inicio}` : 'Sin fecha inicial'} · ${item.fecha_fin ? `Hasta ${item.fecha_fin}` : 'Sin fecha final'}` : 'Vigencia indefinida'}</small></div><div className="promoAdmin__acciones"><button type="button" title="Editar" onClick={() => editarCodigo(item)}><Edit3/></button><button type="button" title="Eliminar" onClick={() => confirmarEliminar('código', item)}><Trash2/></button></div></article>)}</section>
    </div>}
  </main>;
}

export default GestionPromociones;
