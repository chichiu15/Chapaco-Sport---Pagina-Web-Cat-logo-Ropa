const dinero = (valor) => Math.round((Number(valor) || 0) * 100) / 100;
const entero = (valor, respaldo = 1) => Math.max(1, Math.floor(Number(valor) || respaldo));
const normalizar = (valor) => String(valor || '').trim().toLocaleLowerCase('es');
const incluye = (lista, valor) => !Array.isArray(lista) || lista.length === 0 || lista.includes(valor);

export const MODALIDADES_PACK = {
  PORCENTAJE_DESDE: 'porcentaje_desde',
  PORCENTAJE_PACK: 'porcentaje_pack',
  PRECIO_FIJO_PACK: 'precio_fijo_pack',
  LLEVA_PAGA: 'lleva_paga',
};

export const obtenerPrecioItem = (item) => {
  const oferta = Number(item?.variante?.precio_oferta);
  return item?.variante?.en_oferta === true && Number.isFinite(oferta)
    ? oferta
    : Number(item?.producto?.precio) || 0;
};

export const promocionVigente = (promo) => {
  if (!promo || !promo.activo) return false;
  if (promo.vigencia_indefinida) return true;

  // Obtiene la fecha local actual en formato YYYY-MM-DD
  const hoy = new Date().toLocaleDateString('sv');

  // Si la fecha de inicio es posterior a hoy, la promoción aún no ha comenzado
  if (promo.fecha_inicio && promo.fecha_inicio > hoy) {
    return false;
  }

  // Si la fecha de fin es anterior a hoy, la promoción ya venció
  if (promo.fecha_fin && promo.fecha_fin < hoy) {
    return false;
  }

  return true;
};

export const itemCumplePack = (item, pack) => {
  const condiciones = pack?.condiciones || {};
  const producto = item?.producto || {};
  const variante = item?.variante || {};
  const colores = (condiciones.colores || []).map(normalizar);
  return incluye(condiciones.productos_ids, producto.id)
    && incluye(condiciones.marcas_ids, producto.marca_id)
    && incluye(condiciones.categorias_ids, producto.categoria_id)
    && incluye(condiciones.tallas, variante.talla)
    && (colores.length === 0 || colores.includes(normalizar(variante.color_estampado || variante.color)));
};

export const productoCumpleFiltrosPack = (producto, pack) => {
  const condiciones = pack?.condiciones || {};
  if (!incluye(condiciones.productos_ids, producto?.id)) return false;
  if (!incluye(condiciones.marcas_ids, producto?.marca_id)) return false;
  if (!incluye(condiciones.categorias_ids, producto?.categoria_id)) return false;
  const variantes = Array.isArray(producto?.variantes) ? producto.variantes : [];
  const tallas = condiciones.tallas || [];
  const colores = (condiciones.colores || []).map(normalizar);
  if (!tallas.length && !colores.length) return true;
  return variantes.some((variante) => (
    (!tallas.length || tallas.includes(variante.talla))
    && (!colores.length || colores.includes(normalizar(variante.color_estampado || variante.color)))
    && variante.disponible === true
  ));
};

const expandirUnidades = (items) => items.flatMap((item) => {
  const cantidad = Math.max(0, Math.floor(Number(item.cantidad) || 0));
  return Array.from({ length: cantidad }, (_, indice) => ({
    item, indice, productoId: item.producto?.id, precio: obtenerPrecioItem(item),
  }));
});

const seleccionarUnidades = (unidades, pack, limite, grupos = 1) => {
  const requeridos = pack.requiere_todos_productos === true
    ? [...new Set(pack.condiciones?.productos_ids || [])]
    : [];
  if (!requeridos.length) {
    return [...unidades].sort((a, b) => b.precio - a.precio).slice(0, limite);
  }
  const disponibles = [...unidades];
  const elegidas = [];
  for (let grupo = 0; grupo < grupos; grupo += 1) {
    for (const id of requeridos) {
      const indice = disponibles.findIndex((unidad) => unidad.productoId === id);
      if (indice < 0) return [];
      elegidas.push(disponibles.splice(indice, 1)[0]);
    }
  }
  return [...elegidas, ...disponibles.sort((a, b) => b.precio - a.precio)]
    .slice(0, Math.max(limite, elegidas.length));
};

const calcularPack = (items, pack) => {
  if (!promocionVigente(pack)) return null;
  const unidades = expandirUnidades(items).filter((unidad) => itemCumplePack(unidad.item, pack));
  const minimo = entero(pack.cantidad_minima);
  const requeridos = pack.requiere_todos_productos === true
    ? [...new Set(pack.condiciones?.productos_ids || [])]
    : [];
  if (requeridos.some((id) => !unidades.some((unidad) => unidad.productoId === id))) return null;
  if (unidades.length < minimo) return null;

  const modalidad = pack.modalidad || MODALIDADES_PACK.PORCENTAJE_DESDE;
  const repetible = pack.repetible === true;
  const gruposPorCantidad = repetible ? Math.floor(unidades.length / minimo) : 1;
  const gruposPorObligatorios = requeridos.length && repetible
    ? Math.min(...requeridos.map((id) => unidades.filter((unidad) => unidad.productoId === id).length))
    : gruposPorCantidad;
  const grupos = modalidad === MODALIDADES_PACK.PORCENTAJE_DESDE
    ? 1
    : Math.min(gruposPorCantidad, gruposPorObligatorios);
  if (grupos < 1) return null;
  const limite = modalidad === MODALIDADES_PACK.PORCENTAJE_DESDE
    ? unidades.length
    : minimo * grupos;
  const seleccionadas = seleccionarUnidades(unidades, pack, limite, grupos);
  if (seleccionadas.length < limite) return null;
  const base = dinero(seleccionadas.reduce((total, unidad) => total + unidad.precio, 0));
  let descuento = 0;
  let beneficio = '';

  if (modalidad === MODALIDADES_PACK.PRECIO_FIJO_PACK) {
    const precioPack = Math.max(0, Number(pack.precio_fijo_pack) || 0);
    descuento = dinero(Math.max(0, base - precioPack * grupos));
    beneficio = `${grupos > 1 ? `${grupos} packs` : 'El pack'} por Bs. ${(precioPack * grupos).toFixed(2)}`;
  } else if (modalidad === MODALIDADES_PACK.LLEVA_PAGA) {
    const paga = Math.min(minimo - 1, Math.max(1, Math.floor(Number(pack.cantidad_paga) || minimo - 1)));
    const ordenadas = [...seleccionadas].sort((a, b) => b.precio - a.precio);
    for (let grupo = 0; grupo < grupos; grupo += 1) {
      const bloque = ordenadas.slice(grupo * minimo, (grupo + 1) * minimo);
      descuento += bloque.slice(paga).reduce((total, unidad) => total + unidad.precio, 0);
    }
    descuento = dinero(descuento);
    beneficio = `Lleva ${minimo} y paga ${paga}${grupos > 1 ? ` · ${grupos} veces` : ''}`;
  } else {
    const porcentaje = Math.min(100, Math.max(0, Number(pack.porcentaje_descuento) || 0));
    descuento = dinero(base * porcentaje / 100);
    beneficio = `${porcentaje}% de descuento en ${seleccionadas.length} prenda(s)`;
  }

  if (descuento <= 0) return null;
  return { pack, cantidadCoincidente: unidades.length, cantidadDescontada: seleccionadas.length, grupos, base, descuento, beneficio };
};

export const calcularMejorPack = (items = [], packs = []) => {
  let mejor = null;
  packs.forEach((pack) => {
    const resultado = calcularPack(items, pack);
    if (resultado && (!mejor || resultado.descuento > mejor.descuento)) mejor = resultado;
  });
  return mejor;
};

export const obtenerProgresoPack = (items = [], packs = []) => {
  const unidades = expandirUnidades(items);
  const candidatos = packs.filter(promocionVigente).map((pack) => {
    const cantidad = unidades.filter((unidad) => itemCumplePack(unidad.item, pack)).length;
    const minimo = entero(pack.cantidad_minima);
    return { pack, cantidad, faltan: Math.max(0, minimo - cantidad) };
  }).filter((item) => item.cantidad > 0 && item.faltan > 0).sort((a, b) => a.faltan - b.faltan);
  return candidatos[0] || null;
};

export const validarCodigo = (codigoDoc, subtotal, tienePack = false) => {
  if (!codigoDoc) return { valido: false, mensaje: 'El código ingresado no existe.' };
  if (!promocionVigente(codigoDoc)) return { valido: false, mensaje: 'El código promocional no se encuentra vigente.' };
  
  if (tienePack && !codigoDoc.combinable_con_packs) {
    return { valido: false, mensaje: 'Este código no se puede combinar con promociones de packs.' };
  }
  
  if (codigoDoc.compra_minima && subtotal < Number(codigoDoc.compra_minima)) {
    return { valido: false, mensaje: `Requiere una compra mínima de Bs. ${Number(codigoDoc.compra_minima).toFixed(2)}` };
  }

  return { valido: true, mensaje: '' };
};

export const calcularResumenDescuentos = (items = [], packs = [], codigo = null) => {
  const subtotal = dinero(items.reduce(
    (total, item) => total + obtenerPrecioItem(item) * Number(item.cantidad || 0), 0
  ));
  const mejorPack = calcularMejorPack(items, packs);
  const descuentoPack = mejorPack?.descuento || 0;
  const validacionCodigo = codigo ? validarCodigo(codigo, subtotal, Boolean(mejorPack)) : null;
  let descuentoCodigo = 0;
  if (codigo && validacionCodigo?.valido) {
    const base = Math.max(0, subtotal - descuentoPack);
    descuentoCodigo = dinero(base * Math.min(100, Math.max(0, Number(codigo.porcentaje_descuento) || 0)) / 100);
    const maximo = Number(codigo.descuento_maximo) || 0;
    if (maximo > 0) descuentoCodigo = Math.min(descuentoCodigo, maximo);
  }
  return {
    subtotal, mejorPack, progresoPack: mejorPack ? null : obtenerProgresoPack(items, packs),
    descuentoPack, codigo: validacionCodigo?.valido ? codigo : null,
    descuentoCodigo: dinero(descuentoCodigo),
    total: dinero(Math.max(0, subtotal - descuentoPack - descuentoCodigo)), validacionCodigo,
  };
};

export const describirBeneficioPack = (pack) => {
  const minimo = entero(pack.cantidad_minima);
  const modalidad = pack.modalidad || MODALIDADES_PACK.PORCENTAJE_DESDE;
  if (modalidad === MODALIDADES_PACK.PRECIO_FIJO_PACK) return `${minimo} prendas por Bs. ${Number(pack.precio_fijo_pack || 0).toFixed(2)}`;
  if (modalidad === MODALIDADES_PACK.LLEVA_PAGA) return `Lleva ${minimo} y paga ${Math.max(1, Number(pack.cantidad_paga) || minimo - 1)}`;
  if (modalidad === MODALIDADES_PACK.PORCENTAJE_PACK) return `${Number(pack.porcentaje_descuento || 0)}% OFF en ${minimo} prendas`;
  return `${Number(pack.porcentaje_descuento || 0)}% OFF desde ${minimo} prendas`;
};
