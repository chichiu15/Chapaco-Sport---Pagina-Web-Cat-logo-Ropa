import {
  calcularMejorPack,
  calcularResumenDescuentos,
  MODALIDADES_PACK,
} from '../src/utilidades/descuentos.js';

const item = (id, precio, cantidad = 1) => ({
  producto: { id, marca_id: 'gymshark', categoria_id: 'poleras', precio },
  variante: { talla: 'M', color_estampado: 'Negro' },
  cantidad,
});
const carrito = [item('a', 200), item('b', 200), item('c', 200), item('d', 200)];
const base = { activo: true, cantidad_minima: 3, condiciones: { marcas_ids: ['gymshark'] } };
const escenarios = [
  ['Porcentaje desde cantidad', { ...base, modalidad: MODALIDADES_PACK.PORCENTAJE_DESDE, porcentaje_descuento: 10 }, 80, 720],
  ['Porcentaje limitado a 3', { ...base, modalidad: MODALIDADES_PACK.PORCENTAJE_PACK, porcentaje_descuento: 10 }, 60, 740],
  ['Tres por Bs. 550', { ...base, modalidad: MODALIDADES_PACK.PRECIO_FIJO_PACK, precio_fijo_pack: 550 }, 50, 750],
  ['Lleva 3 paga 2', { ...base, modalidad: MODALIDADES_PACK.LLEVA_PAGA, cantidad_paga: 2 }, 200, 600],
  ['Combo exacto', { ...base, modalidad: MODALIDADES_PACK.PRECIO_FIJO_PACK, precio_fijo_pack: 550, requiere_todos_productos: true, condiciones: { productos_ids: ['a', 'b', 'c'] } }, 50, 750],
];

escenarios.forEach(([nombre, pack, descuentoEsperado, totalEsperado]) => {
  const resumen = calcularResumenDescuentos(carrito, [pack]);
  if (resumen.descuentoPack !== descuentoEsperado || resumen.total !== totalEsperado) {
    throw new Error(`${nombre}: resultado inesperado ${JSON.stringify(resumen)}`);
  }
  console.log(`✓ ${nombre}`);
});

const faltante = { ...escenarios[4][1], condiciones: { productos_ids: ['a', 'b', 'inexistente'] } };
if (calcularMejorPack(carrito, [faltante])) throw new Error('El combo exacto se aplicó sin todos los productos.');
console.log('✓ Combo obligatorio no se activa si falta un producto');

const codigo = { activo: true, codigo: 'PRUEBA10', porcentaje_descuento: 10, compra_minima: 500, combinable_con_packs: true };
const conCodigo = calcularResumenDescuentos(carrito, [escenarios[1][1]], codigo);
if (conCodigo.descuentoCodigo !== 74 || conCodigo.total !== 666) throw new Error('Código combinable: resultado inesperado.');
console.log('✓ Pack + código combinable');
console.log('\nTodas las pruebas automáticas de promociones terminaron correctamente.');
